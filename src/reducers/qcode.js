/*
  Syntax and Convention Reference:
  https://github.com/erikras/ducks-modular-redux
  http://blog.jakoblind.no/reduce-redux-boilerplate/
*/

import { combineReducers } from 'redux';
import { interval, of } from 'rxjs';
import { combineEpics, ofType } from 'redux-observable';

// IMPORTANT
// Must modify action prefix since action types must be unique in the whole app
const actionPrefix = `qcode/`;

//Action Type
export const SHOW_QCODE = actionPrefix + `SHOW_QCODE`;
export const HIDE_QCODE = actionPrefix + `HIDE_QCODE`;
export const IS_DAPP_PAY = actionPrefix + `IS_DAPP_PAY`;

//Action Creator
export const showQcode = payload => ({ type: SHOW_QCODE, payload });
export const hideQcode = (payload, error) => ({ type: HIDE_QCODE, payload, error });
export const setIsDappPay = (payload) => ({ type: IS_DAPP_PAY, payload });




//Reducer
const dataInitState = {
    showQcode: false,
    codeStr: "",
    isDappPay: true
}

const dataReducer = (state = dataInitState, action) => {

    switch (action.type) {
        case SHOW_QCODE:
            return {
                ...state,
                showQcode: true,
                codeStr: action.payload
            };


        case HIDE_QCODE:
            return {
                ...state,
                showQcode: false
            };

        case IS_DAPP_PAY:
            return {
                ...state,
                isDappPay: action.payload
            };

        default:
            return state;
    }
};


export const combinedEpic = combineEpics(

);

export const combinedReducer = combineReducers({
    data: dataReducer,
})
