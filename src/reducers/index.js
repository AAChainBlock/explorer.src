import {
  combineReducers
} from 'redux';
import {
  combineEpics
} from 'redux-observable';
import {
  connectRouter
} from 'connected-react-router';

import {
  combinedEpic as permissionEpic,
  combinedReducer as permissionReducer
} from './permission';
import {
  combinedEpic as endpointEpic,
  combinedReducer as endpointReducer
} from './endpoint';
import {
  combinedEpic as headblockEpic,
  combinedReducer as headblockReducer
} from './headblock';
import {
  combinedEpic as lastblockinfoEpic,
  combinedReducer as lastblockinfoReducer
} from './lastblockinfo';
import {
  combinedEpic as connectionIndicatorEpic,
  combinedReducer as connectionIndicatorReducer
} from 'components/Header/components/ConnectionIndicator/ConnectionIndicatorReducer';
import {
  combinedEpic as errorlogEpic,
  combinedReducer as errorlogReducer
} from './errorlog';

import {
  combinedEpic as infoPageEpic,
  combinedReducer as infoPageReducer
} from 'pages/InfoPage/InfoPageReducer';
import {
  combinedEpic as accountdetailPageEpic,
  combinedReducer as accountdetailPageReducer
} from 'pages/AccountdetailPage/AccountdetailPageReducer';

import {
  combinedEpic as permissionPageEpic,
  combinedReducer as permissionPageReducer
} from 'pages/PermissionPage/PermissionPageReducer';


import {
  combinedEpic as ProductionNodePageEpic,
  combinedReducer as ProductionNodeReducer
} from 'pages/InfoPage/components/ProductionNode/ProductionNodeReducer';
import {
  combinedEpic as BalanceDetailEpic,
  combinedReducer as BalanceDetailReducer
} from 'pages/AccountdetailPage/components/BalanceDetail/BalanceDetailReducer';
import {
  combinedEpic as TransactionDetaillEpic,
  combinedReducer as TransactionDetailReducer
} from 'pages/TransactionQueryPage/components/TransactionDetail/TransactionDetailReducer';
import {
  combinedEpic as HeadsearchEpic,
  combinedReducer as HeadsearchReducer
} from 'components/Header/components/Headsearch/HeadsearchReducer'
import {
  combinedEpic as blockdetailPageEpic,
  combinedReducer as BlockdetailReducer
} from 'pages/BlockdetailPage/components/Blockdetail/BlockdetailReducer';

import {
  combinedEpic as TransactiondetailEpic,
  combinedReducer as TransactionsdetailReducer
} from 'pages/TransactiondetailPage/components/Transactiondetail/TransactiondetailReducer'
// import {
//   combinedEpic as Abidescribe,
//   combinedReducer as AbidescribeReducer
// } from 'pages/Abidescribe/AbidescribeReducer'

import {
  combinedEpic as TransactionQueryPageEpic,
  combinedReducer as TransactionQueryPageReducer
} from 'pages/TransactionQueryPage/TransactionQueryPageReducer'

import {
  combinedEpic as reversibleEpic,
  combinedReducer as reversibleReducer
} from './reversibleReducer'

import {
  combinedEpic as qocdeEpic,
  combinedReducer as qocdeReducer
} from './qcode'

import {
  combinedEpic as ScatterEpic,
  combinedReducer as ScatterReducer
} from './scatters'


export const rootEpic = combineEpics(
  permissionEpic,
  endpointEpic,
  headblockEpic,
  lastblockinfoEpic,
  connectionIndicatorEpic,
  ProductionNodePageEpic,
  errorlogEpic,
  infoPageEpic,
  blockdetailPageEpic,
  accountdetailPageEpic,
  permissionPageEpic,
  BalanceDetailEpic,
  TransactionDetaillEpic,
  HeadsearchEpic,
  TransactiondetailEpic,
  TransactionQueryPageEpic,
  reversibleEpic,
  ScatterEpic,
  qocdeEpic
);

export const rootReducer = (history) => combineReducers({
  router: connectRouter(history),
  permission: permissionReducer,
  endpoint: endpointReducer,
  headblock: headblockReducer,
  lastblockinfo: lastblockinfoReducer,
  connectionIndicator: connectionIndicatorReducer,
  errorlog: errorlogReducer,
  infoPage: infoPageReducer,
  reversible: reversibleReducer,
  accountdetail: accountdetailPageReducer,
  permissionPage: permissionPageReducer,
  ProductionNodeReducer,
  BalanceDetail: BalanceDetailReducer,
  Headsearch: HeadsearchReducer,
  TransactionDetail: TransactionDetailReducer,
  Blockdetail: BlockdetailReducer,
  TransactionDetailById: TransactionsdetailReducer,
  TransactionQuery: TransactionQueryPageReducer,
  Qcode: qocdeReducer,
  Scatter: ScatterReducer
})