/*
  Syntax and Convention Reference:
  https://github.com/erikras/ducks-modular-redux
  http://blog.jakoblind.no/reduce-redux-boilerplate/
*/
import { combineReducers } from 'redux';
import { of, from } from 'rxjs';
import { mergeMap, mapTo, map, flatMap, catchError } from 'rxjs/operators';

import { combineEpics, ofType } from 'redux-observable';
import { balance } from '../pages/ResourceMngPage/component/cpu/fromItem';
import axios from 'axios'
// IMPORTANT
// Must modify action prefix since action types must be unique in the whole app
const actionPrefix = `scatter/`;

//Action Type
const FETCH_PRODUCER = actionPrefix + `FETCH_PRODUCER`;
const FETCH_PRODUCER_SUCCESS = actionPrefix + `FETCH_PRODUCER_SUCCESS`;
const FETCH_VOTE = actionPrefix + `FETCH_VOTE`;
const FETCH_VOTE_SUCCESS = actionPrefix + `FETCH_VOTE_SUCCESS`;

const FETCH_BLANCE = actionPrefix + `FETCH_BLANCE`;
const FETCH_BLANCE_SUCCESS = actionPrefix + `FETCH_BLANCE_SUCCESS`;

const FETCH_ACCOUNT = actionPrefix + `FETCH_ACCOUNT`;
const FETCH_ACCOUNT_SUCCESS = actionPrefix + `FETCH_ACCOUNT_SUCCESS`;

const IS_CONNECT_SCATTER = actionPrefix + `IS_CONNECT_SCATTER`;
const ERROR = actionPrefix + `ERROR`;

const SET_ACCOUNT = actionPrefix + `SET_ACCOUNT`;
// const ERROR_RESET = actionPrefix + `ERROR_RESET`;

//Action Creator

const someError = (error) => ({ type: ERROR, error })
export const fetchProducer = (account) => ({ type: FETCH_PRODUCER, account });
export const fetchProducerSuccess = (data) => ({ type: FETCH_PRODUCER_SUCCESS, data });
export const fetchVote = account => ({ type: FETCH_VOTE, account });
export const fetchVoteSuccess = (data) => ({ type: FETCH_VOTE_SUCCESS, data });

export const fetchAccount = account => ({ type: FETCH_ACCOUNT, account });
export const fetchAccountSuccess = (data) => ({ type: FETCH_ACCOUNT_SUCCESS, data });

export const setIsConnectScatter = (data) => ({ type: IS_CONNECT_SCATTER, data });


export const fetchBlance = account => ({ type: FETCH_BLANCE, account });
export const fetchBlanceSuccess = (data) => ({ type: FETCH_BLANCE_SUCCESS, data });

export const setAccount = account => ({ type: SET_ACCOUNT, account });



// Epic


const producerEpic = (action$, state$) => action$.pipe(
  ofType(FETCH_PRODUCER),
  mergeMap(action => {
    const tableData = {
      "code": "eosio",
      "index_position": 2,
      "json": true,
      "key_type": "float64",
      "limit": -1,
      "lower_bound": "",
      "scope": "eosio",
      "table": "producers"
    }
    return from(window.rpc.get_table_rows(tableData)).pipe(
      map(res => fetchProducerSuccess(res.rows)),
      catchError((error = {}) => of(someError()))
    )
  }
  )
);

const blanceEpic = (action$, state$) => action$.pipe(
  ofType(FETCH_BLANCE),
  mergeMap(action =>
    from(
      axios.post(window.rpcPath + '/v1/chain/get_currencys_balance', JSON.stringify({ "currencymng": "currencymng", "account": action.account }))
    ).pipe(
      map(res => fetchBlanceSuccess(res.data)),
      catchError((error = {}) => of(someError()))
    )

  )
);

const accountEpic = (action$, state$) => action$.pipe(
  ofType(FETCH_ACCOUNT),
  mergeMap(action => {

    return from(window.rpc.get_account(action.account)).pipe(
      map(res => fetchAccountSuccess(res)),
      catchError((error = {}) => of(someError()))
    )
  }
  )
);

const voteEpic = (action$, state$) => action$.pipe(
  ofType(FETCH_VOTE),
  mergeMap(action => {
    const tableData = {
      scope: "eosio",
      code: 'eosio',
      table: 'producer'
    }
    return from(window.rpc.get_table_rows(tableData)).pipe(
      flatMap(res => fetchVoteSuccess(res.response)),
      catchError((error = {}) => of(someError()))
    )
  }
  )
);


export const combinedEpic = combineEpics(
  // connectEpic,
  producerEpic,
  blanceEpic,
  accountEpic
  // swapEpic,
  // resetEpic,
);

export const InitState = {
  producers: [],
  accountInfo: {},
  balance: [],
  isConnectScatter: false,
  menuAccount: ""
}


const Reducer = (state = InitState, action) => {
  switch (action.type) {
    case IS_CONNECT_SCATTER:
      return {
        ...state,
        isConnectScatter: action.data
      }
    case FETCH_BLANCE_SUCCESS:
      return {
        ...state,
        balance: action.data
      };
      
      case FETCH_PRODUCER_SUCCESS:
      return {
        ...state,
        producers: action.data
      };
    case SET_ACCOUNT:
      return {
        ...state,
        menuAccount: action.account
      };

    case FETCH_VOTE_SUCCESS:
      return {
        ...state,
        balance: action.data.rows
      };

    case FETCH_ACCOUNT_SUCCESS:
      return {
        ...state,
        accountInfo: action.data
      };


    // case CONNECT_FULFILLED:
    //   return {
    //     ...state,

    //   };


    default:
      return state;
  }
};



export const combinedReducer = combineReducers({
  data: Reducer,

})

