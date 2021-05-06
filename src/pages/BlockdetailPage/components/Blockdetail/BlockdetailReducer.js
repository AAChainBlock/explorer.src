/*
  Syntax and Convention Reference:
  https://github.com/erikras/ducks-modular-redux
  http://blog.jakoblind.no/reduce-redux-boilerplate/
*/

import {
  combineReducers
} from 'redux';
import {
  of
} from 'rxjs';
import {
  mergeMap,
  map,
  catchError
} from 'rxjs/operators';
import {
  combineEpics,
  ofType
} from 'redux-observable';

import {
  errorLog
} from 'helpers/error-logger';
import {
  mongoApi
} from 'services/rxAxios'

// IMPORTANT
// Must modify action prefix since action types must be unique in the whole app
const actionPrefix = `BlockdetailPage/Blockdetail/`;

//Action Type
const FETCH_START = actionPrefix + `FETCH_START`;
const FETCH_FULFILLED = actionPrefix + `FETCH_FULFILLED`;
const FETCH_Block_Detail = actionPrefix + `FETCH_Block_Detail`
const FETCH_REJECTED = actionPrefix + `FETCH_REJECTED`;
const PARAMS_SET = actionPrefix + `PARAMS_SET`;
const FETCH_BLOCK_HASH = actionPrefix + `FETCH_BLOCK_HASH`;
const FETCH_HASH_FULFILLED = actionPrefix + `FETCH_HASH_FULFILLED`;

const FETCH_HASH_RESET = actionPrefix + `FETCH_HASH_RESET`;



//Action Creator
export const fetchStart = () => ({
  type: FETCH_START
});
export const fetchHashReset = () => ({
  type: FETCH_HASH_RESET
});
export const fetchBlockHash = (hash) => ({
  type: FETCH_BLOCK_HASH,
  hash
});
export const fetchBlockDetail = (blockId) => ({
  type: FETCH_Block_Detail,
  blockId
});
export const fetchFulfilled = payload => ({
  type: FETCH_FULFILLED,
  payload
});
export const fetchHashFulfilled = payload => ({
  type: FETCH_HASH_FULFILLED,
  payload
});


export const fetchRejected = (payload, error) => ({
  type: FETCH_REJECTED,
  payload,
  error
});
export const paramsSet = (params) => ({
  type: PARAMS_SET,
  params
});



//Epic

const fetchEpic = (action$, state$) => action$.pipe(
  ofType(FETCH_Block_Detail),
  mergeMap(action => {

    // return apiMongodb(`get_block_details?id_or_num=${action.blockId}`)
    return mongoApi.post(`/getBlocks`,{blockNum:action.blockId})
      .pipe(
        map(res => fetchFulfilled(res.data.data)),
        catchError(error => {
          errorLog("Block detail page/ get block details error", error);
          return of(fetchRejected(error.response, {
            status: error.status
          }))
        })
      )
  })
);

const fetchEpicA = (action$, state$) => action$.pipe(
  ofType(FETCH_BLOCK_HASH),
  mergeMap(action => {

    // return apiMongodb(`get_block_details?id_or_num=${action.blockId}`)
    return mongoApi.post(`/getBlockByHash`,action.hash)
      .pipe(
        map(res => fetchHashFulfilled(res.data.data)),
        catchError(error => {
          errorLog("Block detail page/ get block details error", error);
          return of(fetchRejected(error.response, {
            status: error.status
          }))
        })
      )
  })
);





export const combinedEpic = combineEpics(
  fetchEpic,
  fetchEpicA
);


//Reducer
const dataInitState = {
  payload: undefined,
  payloads:undefined,
  byHash:undefined,
  error: undefined
}

const dataReducer = (state = dataInitState, action) => {
  switch (action.type) {
    case FETCH_START:
      return dataInitState;

    case FETCH_FULFILLED:
      return {
        ...state,
        payload: action.payload,
          error: undefined
      };
    case FETCH_HASH_FULFILLED:
      return {
        ...state,
        payloads: action.payload,
        error: undefined
      };
      case FETCH_HASH_RESET:
        
        return {
          ...state,
          byHash:false,
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
      return true;

    case FETCH_FULFILLED:
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