/*
  Syntax and Convention Reference:
  https://github.com/erikras/ducks-modular-redux
  http://blog.jakoblind.no/reduce-redux-boilerplate/
*/

import {
  combineReducers
} from 'redux';
import {
  of ,
  from
} from 'rxjs';
import {
  mergeMap,
  map,
  flatMap,
  catchError
} from 'rxjs/operators';
import {
  combineEpics,
  ofType
} from 'redux-observable';
import apiMongodb from 'services/api-mongodb';
import apiRpc from 'services/api-rpc';
import {
  errorLog
} from 'helpers/error-logger';
import {
  accountClear
} from 'reducers/permission';

import {
  mongoApi
} from 'services/rxAxios'
// import { JsonRpc } from 'eosjs'
// const endpoint = "/chain"
// const rpc = new JsonRpc(endpoint)
// IMPORTANT


// Must modify action prefix since action types must be unique in the whole app
const actionPrefix = `BalanceDetail`;

//Action Type
const FETCH_START = actionPrefix + `FETCH_START`;
const SWITCH_CHECK = actionPrefix + `SWITCH_CHECK`;
const FETCH_FULFILLED = actionPrefix + `FETCH_FULFILLED`;
const FETCH_REJECTED = actionPrefix + `FETCH_REJECTED`;


const FETCH_DETAIL_START = actionPrefix + `FETCH_DETAIL_START`;
const FETCH_DETAIL_START_SUCCESS = actionPrefix + `FETCH_DETAIL_START_SUCCESS`;



//Action Creator
export const fetchStart = () => ({
  type: FETCH_START
});
export const switchCheck = () => ({
  type: SWITCH_CHECK
});
export const fetchFulfilled = payload => ({
  type: FETCH_FULFILLED,
  payload
});
export const fetchRejected = (payload, error) => ({
  type: FETCH_REJECTED,
  payload,
  error
});


export const fetchDetail = (action) => ({
  type: FETCH_DETAIL_START,
  id:action.id
});
export const fetchDetailSuccess = (payload) => ({
  type: FETCH_DETAIL_START_SUCCESS,
  payload
});

//Epic

const get_currency_balance_Data = {
  code: "eosio.token",
  account: "eosusersk135", //要查询余额的持币账户
  symbol: "EOS" //通证符号，可选
}



const fetchEpic = action$ => action$.pipe(
  ofType(FETCH_START),
  mergeMap(action =>
    from(window.rpc.get_account(
      get_currency_balance_Data.account)).pipe(
      map(res => fetchFulfilled(res)),
      catchError(error => {
        errorLog("Info page/ get blockchain info error", error);
        return of(fetchRejected(error.response, {
          status: error.status
        }))
      })
    )
  ),
);


const fetchDetailEpic = action$ => action$.pipe(
  ofType(FETCH_DETAIL_START),
  mergeMap(action =>
    mongoApi.post('/transactionDetail', {
      'id': action.id,
      'contentComb': 1
    }).pipe(
      map(res => fetchDetailSuccess(res.data.data)),
      catchError(error => {
        errorLog("get transactionDetail error", error);
        return of(fetchRejected(error.response, {
          status: error.status
        }))
      })
    )
  ),
);



const switchCheckEpic = action$ => action$.pipe(
  ofType(SWITCH_CHECK),
  mergeMap(action =>
    apiRpc("get_info").pipe(
      flatMap(res => ([fetchFulfilled(res), accountClear()])),
      catchError(error => {
        errorLog("Info page/ endpoint change error", error);
        return of(fetchRejected(error.response, {
          status: error.status
        }))
      })
    )
  ),
)

export const combinedEpic = combineEpics(
  fetchEpic,
  switchCheckEpic,
  // fetchEpicb,
  fetchDetailEpic
);


//Reducer
const dataInitState = {
  payload: undefined,
  blockdetail: undefined,
  transactionDetail:undefined,
  error: undefined
}

const dataReducer = (state = dataInitState, action) => {
  switch (action.type) {
    case FETCH_START:
    case SWITCH_CHECK:
      return dataInitState;

    case FETCH_FULFILLED:
      return {
        ...state,
        payload: action.payload,
          error: undefined
      };

    case FETCH_DETAIL_START_SUCCESS:
      return {
        ...state,
        transactionDetail: action.payload[0],
          error: undefined
      };
    case FETCH_REJECTED:
      return {
        ...state,
        payload: action.payload,
          error: action.error
      };
    default:
      return state;
  }
};

const isFetchingReducer = (state = false, action) => {
  switch (action.type) {
    case FETCH_START:
    case SWITCH_CHECK:
      return true;

    case FETCH_FULFILLED:
    case FETCH_REJECTED:
      return false;

    default:
      return state;
  }
};

export const combinedReducer = combineReducers({
  data: dataReducer,
  isFetching: isFetchingReducer
})