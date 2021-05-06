import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';

import { combinedEpic as transactionTabsEpic, combinedReducer as transactionTabsReducer } from './components/TransactionTabs/TransactionTabsReducer';
import { combinedEpic as transactionDetailEpic, combinedReducer as transactionDetailReducer } from './components/TransactionDetail/TransactionDetailReducer';

export const combinedEpic = combineEpics(
  transactionDetailEpic,
  transactionTabsEpic
);

export const combinedReducer = combineReducers({
  TransactionsTabs: transactionTabsReducer,
  TransactionsDetail: transactionDetailReducer

})
