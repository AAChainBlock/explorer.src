/*
  Syntax and Convention Reference:
  https://github.com/erikras/ducks-modular-redux
  http://blog.jakoblind.no/reduce-redux-boilerplate/
*/

import {
  combineReducers
} from 'redux';
import {
  of,
  from,
  interval,
} from 'rxjs';
import {
  mergeMap,
  map,
  flatMap,
  catchError,
  exhaustMap,
  switchMap,
  takeUntil,
  startWith
} from 'rxjs/operators';
import {
  combineEpics,
  ofType
} from 'redux-observable';
import apiRpc from 'services/api-rpc';
import {
  mongoApi
} from 'services/rxAxios';

import {
  errorLog
} from 'helpers/error-logger';
import {
  accountClear
} from 'reducers/permission';
// import { JsonRpc } from 'eosjs'  
import axios from 'axios'
import paramsToQuery from 'helpers/params-to-query';
import qs from "qs"

// IMPORTANT
// Must modify action prefix since action types must be unique in the whole app
const actionPrefix = `InfoPage/BlockchainInfo/`;

//Action Type
const FETCH_START = actionPrefix + `FETCH_START`;
const SWITCH_CHECK = actionPrefix + `SWITCH_CHECK`;
const FETCH_FULFILLED = actionPrefix + `FETCH_FULFILLED`;
const FETCH_REJECTED = actionPrefix + `FETCH_REJECTED`;

const FETCH_RESOUSE = actionPrefix + `FETCH_RESOUSE`;
const FETCH_NET_SUCCESS = actionPrefix + `FETCH_NET_SUCCESS`;
const FETCH_CPU_SUCCESS = actionPrefix + `FETCH_CPU_SUCCESS`;
const FETCH_PDV_SUCCESS = actionPrefix + `FETCH_PDV_SUCCESS`;
const FETCH_TRANSACIONTRACES_SUCCESS = actionPrefix + `FETCH_TRANSACIONTRACES_SUCCESS`;
const FETCH_TRANSACIONTRACES = actionPrefix + `FETCH_TRANSACIONTRACES`;
const FETCH_CURRENCYMNG_SUCCESS = actionPrefix + `FETCH_CURRENCYMNG_SUCCESS`;

const FETCH_DETAIL = actionPrefix + `FETCH_DETAIL`;
const FETCH_DETAIL_SUCCESS = actionPrefix + `FETCH_DETAIL_SUCCESS`;

export const POLLING_STOP_ALL = actionPrefix + `POLLING_STOP_ALL`;


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

export const fetchResouse = (numb) => ({
  type: FETCH_RESOUSE,
  numb
})
export const fetchNetSuccess = (payload) => ({
  type: FETCH_NET_SUCCESS,
  payload
})
export const fetchCpuSuccess = (payload) => ({
  type: FETCH_CPU_SUCCESS,
  payload
})
export const fetchPdvSuccess = (payload) => ({
  type: FETCH_PDV_SUCCESS,
  payload
})

export const pollingStopAll = () => ({
  type: POLLING_STOP_ALL
})


export const fetchTransactionTraces = (numb) => ({
  type: FETCH_TRANSACIONTRACES,
  numb
})

export const fetchTransactionTracesSuccess = (payload) => ({
  type: FETCH_TRANSACIONTRACES_SUCCESS,
  payload
})

export const fetchCurrencymngSuccess = (data) => ({
  type: FETCH_CURRENCYMNG_SUCCESS,
  data
})


export const fetchDetail = (data) => ({
  type: FETCH_DETAIL,
  data
})

export const fetchDetailSuccess = (data) => ({
  type: FETCH_DETAIL_SUCCESS,
  data
})


//Epic

const fetchEpic = action$ => action$.pipe(
  ofType(FETCH_START),
  mergeMap(action =>
    apiRpc("get_info").pipe(
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
  ofType(FETCH_DETAIL),
  mergeMap(action => {
    let { scope, code } = action.data
    const mngTableData = {
      code: code,
      scope: scope,
      table: 'stat',
    }
    return from(window.rpc.get_table_rows(mngTableData)).pipe(
      map(res => fetchDetailSuccess(res.rows)),
      catchError(error => {
        errorLog("------------Info page/ get blockchain info error", error);
        return of(fetchRejected(error.response, {
          status: error.status
        }))
      })
    )

  }
  ),
);

const mngTableData = {
  code: "currencymng",
  scope: "currencymng",
  table: 'currencyinfo',
  index_position: 1,
  json: true,
  key_type: "",
  limit: 200,
  lower_bound: "",
  table_key: "",
  upper_bound: "",
}
const fetchEpicMsn = action$ => action$.pipe(
  ofType(FETCH_START),
  mergeMap(action =>
    // apiRpc("get_table_rows",mngTableData).pipe(
    from(window.rpc.get_table_rows(mngTableData)).pipe(
      map(res => fetchCurrencymngSuccess(res.rows)),
      catchError(error => {
        errorLog("------------Info page/ get blockchain info error", error);
        return of(fetchRejected(error.response, {
          status: error.status
        }))
      })
    )
  ),
);

const tableData = {
  code: "eosio.res",
  index_position: 1,
  json: true,
  key_type: "",
  limit: 10,
  lower_bound: "",
  // scope: action.data,
  table: "stat",
  table_key: "",
  upper_bound: "",
}

const tableDataNET = {
  ...tableData
},
  tableDataCPU = {
    ...tableData
  },
  tableDataPDV = {
    ...tableData
  }
tableDataNET.scope = "NET"
tableDataCPU.scope = "CPU"
tableDataPDV.scope = "AAB"


const fetchEpicResNet = action$ => action$.pipe(
  ofType(FETCH_RESOUSE),
  mergeMap(action =>
    from(
      window.rpc.get_table_rows(
        tableDataNET)
    ).pipe(
      map(res => fetchNetSuccess(res)),
      catchError(error => {
        errorLog("get_account page/ get get_account info error", error);
        return of(fetchRejected(error.response, {
          status: error.status
        }))
      })
    )
  ),

);


const fetchEpicResCpu = action$ => action$.pipe(
  ofType(FETCH_RESOUSE),
  mergeMap(action =>
    from(
      window.rpc.get_table_rows(
        tableDataCPU)
    ).pipe(
      map(res => fetchCpuSuccess(res)),
      catchError(error => {
        errorLog("get_account page/ get get_account info error", error);
        return of(fetchRejected(error.response, {
          status: error.status
        }))
      })
    )
  ),

);

const fetchEpicResPdv = action$ => action$.pipe(
  ofType(FETCH_RESOUSE),
  mergeMap(action =>
    from(window.rpc.get_table_rows(tableDataPDV)).pipe(
      map(res => fetchPdvSuccess(res)),
      catchError(error => {
        errorLog("get_account page/ get get_account info error", error);
        return of(fetchRejected(error.response, {
          status: error.status
        }))
      })
    )
  ),
);

const fetchEpicTransactionTraces = (action$, state$) => action$.pipe(
  ofType(FETCH_TRANSACIONTRACES),

  switchMap(action =>
    interval(process.env.REACT_APP_POLLING_INTERVAL_TIME).pipe(
      startWith(-1),
      exhaustMap(index => {
        let {
          headblock
        } = state$.value
        let numb = headblock.data.payload ? headblock.data.payload.block_num : ""

        // return from(axios.post(baseUrl + '/api/mongodb/TransactionTraces',qs.stringify({numb: numb})))
        return mongoApi.post('/getBlockInfo', {

        }).pipe(
          map(res => fetchTransactionTracesSuccess(res.data.data)),
          catchError(error => {
            errorLog("get_account page/ get get_account info error", error);
            return of(fetchRejected(error.response, {
              status: error.status
            }))
          })
        )
      }),

      takeUntil(action$.pipe(
        ofType(POLLING_STOP_ALL, FETCH_TRANSACIONTRACES),
      )),
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
  fetchEpicResCpu,
  fetchEpicResNet,
  fetchEpicResPdv,
  fetchEpicTransactionTraces,
  fetchEpicMsn,
  fetchDetailEpic
);


//Reducer
const dataInitState = {
  payload: undefined,
  resNET: undefined,
  resCPU: undefined,
  resPDV: undefined,
  error: undefined,
  transactiontraces: undefined,
  currentMng: undefined,
  detailIsFetch: false,
  detail: []
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
    case FETCH_TRANSACIONTRACES_SUCCESS:
      return {
        ...state,
        transactiontraces: action.payload,
        error: undefined
      };
    case FETCH_CURRENCYMNG_SUCCESS:
      return {
        ...state,
        currentMng: action.data,
        error: undefined
      };

    case FETCH_NET_SUCCESS:
      return {
        ...state,
        resNET: action.payload,
        error: action.error
      };

    case FETCH_CPU_SUCCESS:
      return {
        ...state,
        resCPU: action.payload,
        error: action.error
      };

    case FETCH_DETAIL:
      return {
        ...state,
        detailIsFetch: true,
      };
    case FETCH_DETAIL_SUCCESS:
      return {
        ...state,
        detailIsFetch: false,
        detail: action.data
      };

    case FETCH_PDV_SUCCESS:
      return {
        ...state,
        resPDV: action.payload,
        error: action.error
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