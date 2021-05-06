/*
  Syntax and Convention Reference:
  https://github.com/erikras/ducks-modular-redux
  http://blog.jakoblind.no/reduce-redux-boilerplate/
*/

import { combineReducers } from 'redux';
import { of } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';  
import { combineEpics, ofType } from 'redux-observable';
import apiMongodb from 'services/api-mongodb';
import { errorLog } from 'helpers/error-logger';
import { mongoApi } from "services/rxAxios"

// IMPORTANT
// Must modify action prefix since action types must be unique in the whole app
const actionPrefix = `TransactiondetailPagess`;

//Action Type
const FETCH_ONLYONE = actionPrefix + `FETCH_ONLYONE`;
const FETCH_FULFILLED = actionPrefix + `FETCH_FULFILLED`;
const FETCH_REJECTED = actionPrefix + `FETCH_REJECTED`;
const PARAMS_SET = actionPrefix + `PARAMS_SET`;

//Action Creator
export const fetchStart = (id) => {   
  return({ type: FETCH_ONLYONE, id })};
export const fetchFulfilled = payload => ({ type: FETCH_FULFILLED, payload });
export const fetchRejected = ( payload, error ) => ({ type: FETCH_REJECTED, payload, error });
export const paramsSet = (params) => ({ type: PARAMS_SET, params });

//Epic


const fetchEpic = action$ => action$.pipe(
  ofType(FETCH_ONLYONE),
  mergeMap(action =>{
     
    //  apiMongodb(`get_transaction_details?id=${action.id}`)
    return mongoApi.post('/transactionDetail',{contentComb:1,id:action.id})
    .pipe(
      map(res => fetchFulfilled(res.response)),

      catchError(error => {
        errorLog("Info page/ get blockchain info error", error);
        return of(fetchRejected(error.response, { status: error.status }))
      })
    )
  }
  ),
);










export const combinedEpic = combineEpics(
  fetchEpic,
);


//Reducer
const dataInitState = {
  payload: [],
  error: undefined
}

const dataReducer = (state=dataInitState, action) => {
  switch (action.type) {
    // case FETCH_ONLYONE:

    case FETCH_FULFILLED:
      return {
        ...state,
        payload: action.payload,
        error: undefined
      };
    // case FETCH_REJECTED:
      // return {
      //   ...state,
      //   payload: action.payload,
      //   error: action.error
      // };
    default:
      return state;
  }
};

const isFetchingReducer = (state = false, action) => {
  switch (action.type) {
    case FETCH_ONLYONE:
      return true;

    // case FETCH_FULFILLED:
    case FETCH_REJECTED:
      return false;

    default:
      return state;
  }
};

const paramsReducer = (state = {}, action) => {
  switch (action.type) {
    case PARAMS_SET:
      return {
        ...state,
        ...action.params
      };

    default:
      return state;
  }
};


export const combinedReducer = combineReducers({
  data: dataReducer,
  isFetching: isFetchingReducer,
  params: paramsReducer
})
