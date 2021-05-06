import {
  combineReducers
} from 'redux';
import {
  of ,
  from
} from 'rxjs';
import {
  switchMap,
  map,
  catchError,
  mergeMap
} from 'rxjs/operators';
import axios from "axios"
import {
  combineEpics,
  ofType
} from 'redux-observable';

import {
  errorLog
} from 'helpers/error-logger';
  // import Qs from 'qs'
//Action Type
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
const actionPrefix = `searchNodeos`;


const FETCH_BLOCKS = actionPrefix + `FETCH_BLOCKS`;
const FETCH_BLOCKS_SUCCESS = actionPrefix + `FETCH_BLOCKS_SUCCESS`;

const FETCH_BLOCK = actionPrefix + `FETCH_BLOCK`;
const FETCH_BLOCK_SUCCESS = actionPrefix + `FETCH_BLOCK_SUCCESS`;

const FETCH_ACTION_TRANCE = actionPrefix + `FETCH_ACTION_TRANCE`;
const FETCH_ACTION_TRANCE_SUCCESS = actionPrefix + `FETCH_ACTION_TRANCE_SUCCESS`;

const FETCH_TRANSACTION_TRANCES = actionPrefix + `FETCH_TRANSACTION_TRANCES`;
const FETCH_TRANSACTION_TRANCES_SUCCESS = actionPrefix + `FETCH_TRANSACTION_TRANCES_SUCCESS`;

const FETCH_TRANSACTION_TRANCE = actionPrefix + `FETCH_TRANSACTION_TRANCE`;
const FETCH_TRANSACTION_TRANCE_SUCCESS = actionPrefix + `FETCH_TRANSACTION_TRANCE_SUCCESS`;

export const fetchBlocks = () => ({
  type: FETCH_BLOCKS
})
export const fetchBlocksSuccess = (payload) => ({
  type: FETCH_BLOCKS_SUCCESS,
  payload
})

export const fetchBlock = () => ({
  type: FETCH_BLOCK
})
export const fetchBlockSuccess = (payload) => ({
  type: FETCH_BLOCK_SUCCESS,
  payload
})

export const fetchActionsTraces = () => ({
  type: FETCH_ACTION_TRANCE
})
export const fetchActionsTracesSuccess = (payload) => ({
  type: FETCH_ACTION_TRANCE_SUCCESS,
  payload
})

export const fetchTransctionsTraces = () => ({
  type: FETCH_TRANSACTION_TRANCES
})
export const fetchTransctionsTracesSuccess = (payload) => ({
  type: FETCH_TRANSACTION_TRANCES_SUCCESS,
  payload
})

export const fetchTransctionsTrace = (trx_id) => ({
  type: FETCH_TRANSACTION_TRANCE,
  trx_id
})
export const fetchTransctionsTraceSuccess = (payload) => ({
  type: FETCH_TRANSACTION_TRANCE_SUCCESS,
  payload
})
//Epic


const fetchBlocksEpic = action$ => action$.pipe(
  ofType(FETCH_BLOCKS),
  switchMap(action => {
    return from(axios.post(window.rpcPath + '/v1/history_log/get_reversible_blocks')).pipe(
      map(res => fetchBlocksSuccess(res.data)),
      catchError(error => {
        errorLog("reversibles Error", error);
        return of()
      })
    )
  }),
);

const fetchBlockEpic = action$ => action$.pipe(
  ofType(FETCH_BLOCK),
  switchMap(action => {
    return from(axios.post(window.rpcPath + '/v1/history_log/get_reversible_block')).pipe(
      map(res => fetchBlockSuccess(res.data)),
      catchError(error => {
        errorLog("reversibles Error", error);
        return of()
      })
    )
  }),
);

const fetchTransactionTrancesEpic = action$ => action$.pipe(
  ofType(FETCH_TRANSACTION_TRANCES),
  switchMap(action => {
    return from(axios.post(window.rpcPath + '/v1/history_log/get_reversible_trans_traces')).pipe(
      map(res => fetchTransctionsTracesSuccess(res.data)),
      catchError(error => {
        errorLog("reversibles Error", error);
        return of()
      })
    )
  }),
);

const fetchActionTranceEpic = action$ => action$.pipe(
  ofType(FETCH_ACTION_TRANCE),
  switchMap(action => {
    return from(axios.post(window.rpcPath + '/v1/history_log/get_reversible_action_traces')).pipe(
      map(res => fetchActionsTracesSuccess(res.data)),
      catchError(error => {
        errorLog("reversibles Error", error);
        return of()
      })
    )
  }),
);

const fetchTransactionTranceEpic = action$ => action$.pipe(
  ofType(FETCH_TRANSACTION_TRANCE),
  switchMap(action => {
    let trx_id = action.trx_id.trx_id
    return from(axios.post(
      window.rpcPath + '/v1/history_log/get_reversible_trans_trace',
    {
      trx_id
    }, 
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      } //加上这个
    }
    )).pipe(
      map(res => fetchTransctionsTracesSuccess(res.data)),
      catchError(error => {
        errorLog("reversibles Error", error);
        return of()
      })
    )
  }),
);

export const combinedEpic = combineEpics(
  fetchBlocksEpic,
  fetchBlockEpic,
  fetchTransactionTrancesEpic,
  fetchActionTranceEpic,
  fetchTransactionTranceEpic
);


//Reducer
const dataInitState = {
  transactionTrace: undefined
}

const dataReducer = (state = dataInitState, action) => {
  switch (action.type) {
    case FETCH_BLOCK:
      return {
        ...state,
        payload: action.payload,
          error: undefined
      };

    case FETCH_BLOCK_SUCCESS:
      return {
        ...state,
        isFetchActionsTraces: true,
          error: undefined
      };
    case FETCH_TRANSACTION_TRANCES_SUCCESS:
      return {
        ...state,
        transactionTrace: action.payload,
          error: undefined
      };



    default:
      return state;
  }
};



export const combinedReducer = combineReducers({
  data: dataReducer,
  //   isFetching: isFetchingReducer
})