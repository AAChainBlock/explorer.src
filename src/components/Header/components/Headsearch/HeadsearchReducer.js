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
import {
  mongoApi
} from "services/rxAxios"

const actionPrefix = `Headsearch`;

//Action Type
const FETCH_ACCOUNT = actionPrefix + `FETCH_ACCOUNT`;
const FETCH_PUBLIC = actionPrefix + `FETCH_PUBLIC`;
const FETCH_TRANSACTION = actionPrefix + `FETCH_TRANSACTION`;
const FETCH_DEFAULT = actionPrefix + `FETCH_DEFAULT`;
const FETCH_START = actionPrefix + `FETCH_START`;
const SWITCH_CHECK = actionPrefix + `SWITCH_CHECK`;
const FETCH_FULFILLED = actionPrefix + `FETCH_FULFILLED`;
const FETCH_REJECTED = actionPrefix + `FETCH_REJECTED`;

const FETCH_ACTIONS_TRACES = actionPrefix + `FETCH_ACTIONS_TRACES`;
const FETCH_ACTIONS_TRACES_FULFILLED = actionPrefix + `FETCH_ACTIONS_TRACES_FULFILLED`;



const FETCH_ACTIONS_TRACES_ACTIVE = actionPrefix + `FETCH_ACTIONS_TRACES_ACTIVE`;
const FETCH_ACTIONS_TRACES_ACTIVE_FULFILLED = actionPrefix + `FETCH_ACTIONS_TRACES_ACTIVE_FULFILLED`;

const FETCH_NET_CPU = actionPrefix + `FETCH_NET_CPU`;
const FETCH_NET_CPU_SUCCESS = actionPrefix + `FETCH_NET_CPU_SUCCESS`;

const FETCH_NET = actionPrefix + `FETCH_NET`;
const FETCH_NET_SUCCESS = actionPrefix + `FETCH_NET_SUCCESS`;

const FETCH_START_TIME = actionPrefix + `FETCH_START_TIME`;
const FETCH_START_TIME_SUCCESS = actionPrefix + `FETCH_START_TIME_SUCCESS`;

const FETCH_AAA = actionPrefix + `FETCH_AAA`;
const FETCH_AAA_SUCCESS = actionPrefix + `FETCH_AAA_SUCCESS`;

const FETCH_ACTIONS_TRACES_QUERY = actionPrefix + `FETCH_ACTIONS_TRACES_QUERY`;
const FETCH_ACTIONS_TRACES_QUERY_SUCCESS = actionPrefix + `FETCH_ACTIONS_TRACES_QUERY_SUCCESS`;

const FETCH_TRANSACTION_TRANCE = actionPrefix + `FETCH_TRANSACTION_TRANCE`;
const FETCH_TRANSACTION_TRANCE_SUCCESS = actionPrefix + `FETCH_TRANSACTION_TRANCE_SUCCESS`;

const FETCH_TRANSFERS = actionPrefix + `FETCH_TRANSFERS`;
const FETCH_TRANSFERS_SUCCESS = actionPrefix + `FETCH_TRANSFERS_SUCCESS`;


const FETCH_DICT = actionPrefix + `FETCH_DICT`;
const FETCH_DICT_SUCCESS = actionPrefix + `FETCH_DICT_SUCCESS`;

//Action Creator
export const fetchStart = (n) => ({
  type: FETCH_START,
  n
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
export const fetchAccount = payload => ({
  type: FETCH_ACCOUNT,
  payload
});
export const fetchPublic = payload => ({
  type: FETCH_PUBLIC,
  payload
});
export const fetchTransaction = payload => ({
  type: FETCH_TRANSACTION,
  payload
});
export const fetchDefault = payload => ({
  type: FETCH_DEFAULT,
  payload
});

export const fetchActionsTraces = payload => ({
  type: FETCH_ACTIONS_TRACES,
  name: payload
});
export const fetchActionsTracesFulfilled = payload => ({
  type: FETCH_ACTIONS_TRACES_FULFILLED,
  payload
});

export const fetchActionsTracesQuery = payload => ({
  type: FETCH_ACTIONS_TRACES_QUERY,
  name: payload
});
export const fetchActionsTracesQueryFulfilled = payload => ({
  type: FETCH_ACTIONS_TRACES_QUERY_SUCCESS,
  payload
});

export const fetchActionsTracesActive = payload => ({
  type: FETCH_ACTIONS_TRACES_ACTIVE,
  name: payload
});
export const fetchActionsTracesActiveFulfilled = payload => ({
  type: FETCH_ACTIONS_TRACES_ACTIVE_FULFILLED,
  payload
});

export const fetchTotalEos = () => ({
  type: FETCH_NET_CPU
})
export const fetchNetCpuSuccess = data => ({
  type: FETCH_NET_CPU_SUCCESS,
  data
})

export const fetchTotalNet = () => ({
  type: FETCH_NET
})
export const fetchNetSuccess = data => ({
  type: FETCH_NET_SUCCESS,
  data
})

export const fetchStartTime = data => ({
  type: FETCH_START_TIME,
  data
})
export const fetchStartTimeSuccess = data => ({
  type: FETCH_START_TIME_SUCCESS,
  data
})

export const fetchAAA = data => ({
  type: FETCH_AAA,
  data
})
export const fetchAAASuccess = data => ({
  type: FETCH_AAA_SUCCESS,
  data
})

export const fetchTransctionsTraces = () => ({
  type: FETCH_TRANSACTION_TRANCE
})
export const fetchTransctionsTracesSuccess = (payload) => ({
  type: FETCH_TRANSACTION_TRANCE_SUCCESS,
  payload
})

export const fetchTransfers = (data) => ({
  type: FETCH_TRANSFERS,
  data
})
export const fetchTransfersSuccess = (payload) => ({
  type: FETCH_TRANSFERS_SUCCESS,
  payload
})


export const fetchDict = (data) => ({
  type: FETCH_DICT,
  data
})
export const fetchDictSuccess = (data) => ({
  type: FETCH_DICT_SUCCESS,
  data
})

//Epic

const fetchEpic = action$ => action$.pipe(
  ofType(FETCH_START),
  switchMap(action =>

    mongoApi.post("/transactionDetail", {
      pageSize: action.n,
      contentComb: 2
    })
    .pipe(map(res => fetchFulfilled(res.data)),
      catchError(error => {
        errorLog("Info page/ get blockchain info error", error);
        return of(fetchRejected(error.response, {
          status: error.status
        }))
      })
    )
  )

);

const fetchEpicTranfers = action$ => action$.pipe(
  ofType(FETCH_TRANSFERS),
  switchMap(action =>
{
 return   mongoApi.post("/transferList", action.data)
    .pipe(map(res => fetchTransfersSuccess(res.data.data)),
      catchError(error => {
        errorLog("Info page/ get blockchain info error", error);
        return of(fetchRejected(error.response, {
          status: error.status
        }))
      })
    )}
  )

);


const fetchEpicD = action$ => action$.pipe(
  ofType(FETCH_START_TIME),
  switchMap(action => {
    return from(window.rpc.get_account('eosio')).pipe(
      // apiRpc("get_table_rows", get_table_row_Data).pipe(
      map(res => fetchStartTimeSuccess(res)),
      catchError(error => {
        errorLog("Info page/ get blockchain info error", error);
        return of()
      })
    )
  }),
);


const fetchEpicDict = action$ => action$.pipe(
  ofType(FETCH_DICT),
  mergeMap(action =>
    mongoApi.post('/accountList')
    .pipe(
      map(res => fetchDictSuccess(res.data.data)),
      catchError(error => {
        errorLog("Info page/ get blockchain info error", error);
        return of(fetchRejected(error.response, {
          status: error.status
        }))
      })
    )
  ),
);

const fetchEpicB = action$ => action$.pipe(
  ofType(FETCH_ACTIONS_TRACES),
  mergeMap(action =>
    mongoApi.post('/actionList', {
      ...action.name,
      pageSize: 20
    })
    .pipe(
      map(res => fetchActionsTracesFulfilled(res.data)),
      catchError(error => {
        errorLog("Info page/ get blockchain info error", error);
        return of(fetchRejected(error.response, {
          status: error.status
        }))
      })
    )
  ),
);

const fetchEpicBC = action$ => action$.pipe(
  ofType(FETCH_ACTIONS_TRACES_QUERY),
  mergeMap(action =>

    // from(axios.post(baseUrl +'/api/mongodb/actions_traces_query',{...action.name}))
    mongoApi.post('/actionList', {
      ...action.name,
      pageSize: 20
    })
    .pipe(
      map(res => fetchActionsTracesQueryFulfilled(res.data)),
      catchError(error => {
        errorLog("Info page/ get blockchain info error", error);
        return of(fetchRejected(error.response, {
          status: error.status
        }))
      })
    )
  ),
);



const fetchEpicBactive = action$ => action$.pipe(
  ofType(FETCH_ACTIONS_TRACES_ACTIVE),
  mergeMap(action =>
    mongoApi.post('/actionList', {
      ...action.name
    }).pipe(
      map(res => fetchActionsTracesActiveFulfilled(res.data)),
      catchError(error => {
        errorLog("Info page/ get blockchain info error", error);
        return of(fetchRejected(error.response, {
          status: error.status
        }))
      })
    )
  ),
);

const get_table_row_Data = {
  code: "eosio.token",
  index_position: 1,
  json: true,
  key_type: "",
  limit: 10,
  lower_bound: "",
  scope: "EOS",
  table: "stat",
  table_key: "",
  upper_bound: "",
}
const fetchNetCpuEpic = action$ => action$.pipe(
  ofType(FETCH_NET_CPU),
  switchMap(action => {
    return from(window.rpc.get_table_rows(get_table_row_Data)).pipe(
      // apiRpc("get_table_rows", get_table_row_Data).pipe(
      map(res => fetchNetCpuSuccess(res)),
      catchError(error => {
        errorLog("Info page/ get blockchain info error", error);
        return of()
      })
    )
  }),
);

const get_table_row_Data_cpu = {
  code: "eosio",
  index_position: 1,
  json: true,
  key_type: "",
  limit: 10,
  lower_bound: "",
  scope: "eosio",
  table: "global",
  table_key: "",
  upper_bound: "",
}
const fetchNetEpic = action$ => action$.pipe(
  ofType(FETCH_NET),
  switchMap(action => {
    return from(window.rpc.get_table_rows(get_table_row_Data_cpu)).pipe(
      // apiRpc("get_table_rows", get_table_row_Data).pipe(
      map(res => fetchNetSuccess(res)),
      catchError(error => {
        errorLog("Info page/ get blockchain info error", error);
        return of()
      })
    )
  }),
);

const get_table_row_Data_AAA = {
  code: "eosio.token",
  index_position: 1,
  json: true,
  key_type: "",
  limit: 10,
  lower_bound: "",
  scope: "AAA",
  table: "stat",
  table_key: "",
  upper_bound: "",
}
const fetchNetEpicF = action$ => action$.pipe(
  ofType(FETCH_AAA),
  switchMap(action => {
    return from(window.rpc.get_table_rows(get_table_row_Data_AAA)).pipe(
      // apiRpc("get_table_rows", get_table_row_Data).pipe(
      map(res => fetchAAASuccess(res)),
      catchError(error => {
        errorLog("Info page/ get blockchain info error", error);
        return of()
      })
    )
  }),
);
// const switchCheckEpic = action$ => action$.pipe(
//   ofType(SWITCH_CHECK),
//   mergeMap(action =>
//     apiRpc("get_info").pipe(
//       flatMap(res => ([fetchFulfilled(res), accountClear()])),
//       catchError(error => {
//         errorLog("Info page/ endpoint change error", error);
//         return of(fetchRejected(error.response, { status: error.status }))
//       })
//     )
//   ),
// )

export const combinedEpic = combineEpics(
  fetchEpic,
  fetchEpicB,
  fetchNetCpuEpic,
  fetchNetEpic,
  fetchEpicD,
  fetchNetEpicF,
  fetchEpicBactive,
  fetchEpicBC,
  fetchEpicTranfers,
  fetchEpicDict
  // switchCheckEpic
);


//Reducer
const dataInitState = {
  payload: undefined,
  actionsTraces: undefined,
  actionsTracesActive: undefined,
  isFetchActionsTraces: false,
  isFetchActionsTracesActive: false,
  totalEos: undefined,
  totalNet: undefined,
  error: undefined,
  creatTime: undefined,
  actionsTracesQuery: undefined,
  AAA: undefined,
  transfers:undefined,
  fetchTranfers:true,
  dict:{}
}

const dataReducer = (state = dataInitState, action) => {
  switch (action.type) {
    case FETCH_ACCOUNT:
      return {
        ...state,
        payload: action.payload,
          error: undefined
      };
      case FETCH_TRANSFERS:
      return {
        ...state,
        transfers:undefined,
        fetchTranfers:true,
          error: undefined
      };
      

    case FETCH_ACTIONS_TRACES_QUERY:
      return {
        ...state,
        isFetchActionsTraces: true,
          error: undefined
      };
    case FETCH_ACTIONS_TRACES:
      return {
        ...state,
        isFetchActionsTraces: true,
          error: undefined
      };
      case FETCH_TRANSFERS_SUCCESS:
        return {
          ...state,
          // isFetchActionsTraces: true,
          fetchTranfers:false,
          transfers:action.payload,
            error: undefined
        };
      
    case FETCH_ACTIONS_TRACES_ACTIVE:
      return {
        ...state,
        isFetchActionsTracesActive: true,
          error: undefined
      };

    case FETCH_ACTIONS_TRACES_FULFILLED:
      return {
        ...state,
        actionsTraces: action.payload,
          isFetchActionsTraces: false,
          error: action.error
      };
    case FETCH_ACTIONS_TRACES_QUERY_SUCCESS:
      return {
        ...state,
        actionsTracesQuery: action.payload,
          isFetchActionsTraces: false,
          error: action.error
      };

    case FETCH_ACTIONS_TRACES_ACTIVE_FULFILLED:
      return {
        ...state,
        actionsTracesActive: action.payload,
          isFetchActionsTracesActive: false,
          error: action.error
      };

    case SWITCH_CHECK:
      return dataInitState;
    case FETCH_FULFILLED:
      return {
        ...state,
        payload: action.payload,
          error: undefined
      };
    case FETCH_REJECTED:
      return {
        ...state,
        payload: action.payload,
          error: action.error
      };

    case FETCH_NET_CPU_SUCCESS:
      return {
        ...state,
        totalEos: action.data.rows[0],
          error: undefined
      };
    case FETCH_NET_SUCCESS:
      return {
        ...state,
        totalNet: action.data.rows[0],
          error: undefined
      };

    case FETCH_AAA_SUCCESS:
      return {
        ...state,
        AAA: action.data.rows[0],
          error: undefined
      };

    case FETCH_START_TIME_SUCCESS:
      return {
        ...state,
        creatTime: action.data,
          error: undefined
      };
      case FETCH_DICT_SUCCESS:
        return {
          ...state,
          dict: action.data,
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