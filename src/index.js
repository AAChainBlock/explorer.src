import React from 'react';
import { hydrate, render } from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { PersistGate } from 'redux-persist/integration/react'
import Cookies from 'js-cookie';
import { HashRouter as Router } from 'react-router-dom';
import store, { persistor } from 'store';
// import { createHashHistory } from 'history'
import { createHashHistory } from 'history'
import { JsonRpc } from 'eosjs'

import App from 'app';
import 'antd/dist/antd.css'

import zh_CN from "antd/lib/locale-provider/zh_CN"
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

const history = createHashHistory()




// let nodeosP = window.LocalStoreApi.get('nodeosApiPath')
// let nodes = nodeosP?nodeosP: nodeosApiPath

window.rpc = new JsonRpc(window.rpcPath)


const currentLastTimestamp = Cookies.get('lastTimestamp') || process.env.REACT_APP_LAST_INIT_TIMESTAMP || "";

// If currentLastTimestamp is empty, current application run does not need to clear local storage.
// Hence, ignore below steps for not clearing persisted store and not setting local storage variable.
if ( currentLastTimestamp ){

  const storedLastTimestamp = localStorage.getItem('lastTimestamp');

  // If the current last timestamp from cookies / process.env is greater than the stored one, it means user has run init or has built the app again
  // since the last initialization or build.
  // Hence, clear the whole persisted store.
  if (storedLastTimestamp < currentLastTimestamp){
    persistor.purge();
  }

  localStorage.setItem('lastTimestamp', currentLastTimestamp);

}


const AppBundle = (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Router history={history}>
        <>
        {/* <LocaleProvider locale={zh_CN} > */}
          <App history={history}/> 
          {/* </LocaleProvider> */}
          
          <div id="modal"></div>
        </>
      </Router>
    </PersistGate>
  </Provider>
);

const rootElement = document.getElementById("root");
if (rootElement.hasChildNodes()) {
  hydrate(AppBundle, rootElement);
} else {
  render(AppBundle, rootElement);
}
