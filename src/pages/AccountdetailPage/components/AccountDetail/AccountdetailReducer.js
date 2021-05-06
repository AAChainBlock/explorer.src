/*
  Syntax and Convention Reference:
  https://github.com/erikras/ducks-modular-redux
  http://blog.jakoblind.no/reduce-redux-boilerplate/
*/

import { combineReducers } from 'redux';
import { of, from } from 'rxjs';
import { mergeMap, map,  catchError} from 'rxjs/operators';
import { combineEpics, ofType } from 'redux-observable';
import apiMongodb from 'services/api-mongodb';
import { errorLog } from 'helpers/error-logger';
import { mongoApi } from 'services/rxAxios'
import axios from 'axios'
// Must modify action prefix since action types must be unique in the whole app
const actionPrefix = `Accountdetail`;

//Action Type
const FETCH_START = actionPrefix + `FETCH_START`;
const FETCH_BALANCE_START = actionPrefix + `FETCH_BALANCE_START`;
const FETCH_BALANCE = actionPrefix + `FETCH_BALANCE`;

const SWITCH_CHECK = actionPrefix + `SWITCH_CHECK`;
const FETCH_FULFILLED = actionPrefix + `FETCH_FULFILLED`;
const FETCH_REJECTED = actionPrefix + `FETCH_REJECTED`;

const FETCH_PRODUCER = actionPrefix + `FETCH_PRODUCER`;
const FETCH_PRODUCER__FULFILLED = actionPrefix + `FETCH_PRODUCER__FULFILLED`;

const PUB_KEY_ACCOUNT = actionPrefix + `PUB_KEY_ACCOUNT`;
const PUB_KEY_ACCOUNT_SUCCESS = actionPrefix + `PUB_KEY_ACCOUNT_SUCCESS`;

const FETCH_BALANCEES_SUCCESS = actionPrefix + `FETCH_BALANCEES_SUCCESS`;
const FETCH_RES_SUCCESS = actionPrefix + `FETCH_RES_SUCCESS`;

const FETCH_ACCOUNT_ERROR = actionPrefix + `FETCH_ACCOUNT_ERROR`;

const FETCH_ABI_SUCCESS = actionPrefix + `FETCH_ABI_SUCCESS`;

const FETCH_CURRENCY_SUCCESS = actionPrefix + `FETCH_CURRENCY_SUCCESS`;

const FETCH_YE_SUCCESS = actionPrefix + `FETCH_YE_SUCCESS`;

const SET_CURRENT_ACCOUNT = actionPrefix + `SET_CURRENT_ACCOUNT`;

const HIDE_ACCOUNT = actionPrefix + `HIDE_ACCOUNT`;




//Action Creator
export const fetchStart = data => ({ type: FETCH_START,data:data });
export const fetchBalanceStart = data => ({ type: FETCH_BALANCE_START ,data:data});
export const fetchBalance = data => ({ type: FETCH_BALANCE,data:data });

export const fetchAbiSuccess = data => ({ type: FETCH_ABI_SUCCESS,data:data });

export const switchCheck = () => ({ type: SWITCH_CHECK });
export const fetchFulfilled = payload => ({ type: FETCH_FULFILLED, payload });
export const fetchRejected = (payload, error) => ({ type: FETCH_REJECTED, payload, error });

export const fetchAccountError = (payload, error) => ({ type: FETCH_ACCOUNT_ERROR, payload, error });

export const hideAccount = () => ({ type: HIDE_ACCOUNT});


export const fetchProducer = data =>({ type: FETCH_PRODUCER, data:data });

export const fetchProducerFulfilled = data => ({ type: FETCH_PRODUCER__FULFILLED, data:data });
//Epic

export const pubKeyAccount = (payload) => ({ type: PUB_KEY_ACCOUNT, payload })
export const pubKeyAccountSuccess = (payload) =>({ type: PUB_KEY_ACCOUNT_SUCCESS, payload })

export const fetchBalanceesSuccess = (data) => ({ type: FETCH_BALANCEES_SUCCESS, data })
export const fetchResSuccess = (data) => ({ type: FETCH_RES_SUCCESS, data })

export const fetchCurrencySuccess = (data) => ({ type: FETCH_CURRENCY_SUCCESS, data })
export const fetchYeSuccess = (data) => ({ type: FETCH_YE_SUCCESS, data })

export const setCurrentAccount = (data) => ({ type: SET_CURRENT_ACCOUNT, data })


const fetchEpic = action$ => action$.pipe(
  ofType( FETCH_BALANCE_START),
  mergeMap(action => from(
    window.rpc.get_account(
    action.data)
    ).pipe(
    map(res => fetchBalance(res)),
    catchError(error => {
      errorLog("get_account page/ get get_account info error", error);
      return of(fetchAccountError(error.response, { status: error.status }))
    })
  )
  ),
);


const fetchEpicE = action$ => action$.pipe(
  ofType( FETCH_BALANCE_START),
  mergeMap(action =>{ 
    const tableData = {
      code: "eosio.res",
      index_position: 1,
      json: true,
      key_type: "",
      limit: 10,
      lower_bound: "",
      scope: action.data,
      table: "accounts",
      table_key: "",
      upper_bound: "",
    }
  return  from(
    window.rpc.get_table_rows(
      tableData)
    ).pipe(
    map(res => fetchBalanceesSuccess(res)),
    catchError(error => {
      errorLog("get_account page/ get get_account info error", error);
      return of(fetchRejected(error.response, { status: error.status }))
    })
  )
}
  ),
);
const fetchEpicK = action$ => action$.pipe(
  ofType( FETCH_BALANCE_START),
  mergeMap(action =>{ 
    const tableData = {
      code: "eosio.token",
      index_position: 1,
      json: true,
      key_type: "",
      limit: 10,
      lower_bound: "",
      scope: action.data,
      table: "accounts",
      table_key: "",
      upper_bound: "",
    }
  return  from(
    window.rpc.get_table_rows(
      tableData)
    ).pipe(
    map(res => fetchYeSuccess(res)),
    catchError(error => {
      errorLog("get_account page/ get get_account info error", error);
      return of(fetchRejected(error.response, { status: error.status }))
    })
  )
}
  ),
);

const fetchEpicG = action$ => action$.pipe(
  ofType(FETCH_BALANCE_START),
  mergeMap(action => {
    const tableData = {
      code: "eosio.res",
      index_position: 1,
      json: true,
      key_type: "",
      limit: 10,
      lower_bound: "",
      scope: action.data,
      table: "accounts",
      table_key: "",
      upper_bound: "",
    }
    return from(
      window.rpc.get_table_rows(
        tableData)
      ).pipe(
      map(res => fetchResSuccess(res)),
      catchError(error => {
        errorLog("get_account page/ get get_account info error", error);
        return of(fetchRejected(error.response, { status: error.status }))
      })
    )
  }
  ),
);

const fetchEpicH = action$ => action$.pipe(
  ofType(FETCH_BALANCE_START),
  mergeMap(action => {
    return from( window.rpc.get_abi( action.data)).pipe(
      map(res => fetchAbiSuccess(res)),
      catchError(error => {
        errorLog("get_account page/ get get_account info error", error);
        return of(fetchRejected(error.response, { status: error.status }))
      })
    )
  }
  ),
);

const fetchEpicI = action$ => action$.pipe(
  ofType(FETCH_BALANCE_START),
  mergeMap(action => {
      return from( axios.post(window.rpcPath +'/v1/chain/get_currencys_balance', JSON.stringify({"currencymng": "currencymng","account":action.data}) )).pipe(
      map(res => fetchCurrencySuccess(res)),
      catchError(error => {
        errorLog("get_account page/ get get_account info error", error);
        return of(fetchRejected(error.response, { status: error.status }))
      })
    )
  }
  ),
);





const fetchEpicD = action$ => action$.pipe(
  ofType( PUB_KEY_ACCOUNT ),
  mergeMap(action => from(
    mongoApi.post('/accountList',{ publicKey: action.payload,pageSize:100 })
    ).pipe(
    map(res => pubKeyAccountSuccess(res.data.data)),
    catchError(error => {
      errorLog("/accountList  info error", error);
      return of(fetchRejected(error.response, { status: error.status }))
    })
  )
  ),
);

const fetchEpicC = action$ => action$.pipe(
  ofType( FETCH_PRODUCER ),
  mergeMap(action => from(
    window.rpc.get_producers(
    action.data)
    ).pipe(
    map(res => fetchProducerFulfilled(res)),
    catchError(error => {
      errorLog("get_account page/ get get_account info error", error);
      return of(fetchRejected(error.response, { status: error.status }))
    })
  )
  ),
);
const fetchEpicB = action$ => action$.pipe(
  ofType(FETCH_START),
      mergeMap(action => {
        
        return apiMongodb(`get_transactions?records_count=100`).pipe(
          map(res => fetchFulfilled(res.response)),
          catchError(error => {
            errorLog("",error);
            return of(fetchRejected(error.response, { status: error.status }))
          })
           
  ) 
}
  ),
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
  // switchCheckEpic,
  fetchEpicB,
  fetchEpicC,
  fetchEpicD,
  // fetchEpicf,
  fetchEpicE,
  fetchEpicG,
  fetchEpicH,
  fetchEpicI,
  fetchEpicK
  
);


//Reducer
const dataInitState = {
  payload: undefined,
  payload1: undefined,
  balance: undefined,
  total: undefined,
  pubKeys: undefined,
  producers:undefined,
  error: undefined,
  res: undefined,
  accountError: undefined,
  hasAbi: {},
  currency: undefined,
  ye:undefined,
  currentAccount:undefined,
  showAccount:undefined,
}

const dataReducer = (state = dataInitState, action) => {
  switch (action.type) {
    case FETCH_START:
      
    case HIDE_ACCOUNT:
      return {
        ...state,
        showAccount: false,
      };
    case SET_CURRENT_ACCOUNT:
      return {
        ...state,
        currentAccount: action.data,
        error: undefined
      };
    case SWITCH_CHECK:
      return dataInitState;

    case FETCH_FULFILLED:
      return {
        ...state,
        payload: action.payload,
        error: undefined
      };
    case FETCH_YE_SUCCESS:

      return {
        ...state,
        ye: action.data,
        error: undefined
      };
      
    case FETCH_ACCOUNT_ERROR:
      return {
        ...state,
        accountError: action.error,
        payload1:undefined,
        showAccount:undefined,
        error: undefined
      };
    case FETCH_BALANCE:
        return {
          ...state,
          payload1: action.data,
          error: undefined
        };

    case FETCH_BALANCEES_SUCCESS:
        return {
          ...state,
          balance: action.data,
          error: undefined
        };
        
    case FETCH_RES_SUCCESS:
        return {
          ...state,
          res: action.data,
          error: undefined
        };    
    case PUB_KEY_ACCOUNT_SUCCESS:
      return {
        ...state,
        pubKeys: action.payload,
        showAccount:true,
        error: undefined
      };      
        
      
    case FETCH_PRODUCER__FULFILLED:
          return {
            ...state,
            producers: action.data,
            error: undefined
          };
    case FETCH_CURRENCY_SUCCESS:
      return {
        ...state,
        currency: action.data,
        error: undefined
      };      
          
    case FETCH_ABI_SUCCESS:
      return {
        ...state,
        hasAbi: action.data,
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
