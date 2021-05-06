import './App.scss';

import React, { Component } from 'react';
import { Switch, Redirect } from 'react-router-dom';
import Loadable from 'react-loadable';
import { connect } from 'react-redux';
import { withRouter } from "react-router";
import TagManager from 'react-gtm-module';
import queryString from 'query-string';

import InfoPage from 'pages/InfoPage';
import BlockdetailPage from 'pages/BlockdetailPage';
import AccountdetailPage from 'pages/AccountdetailPage';
import TransactionQueryPage from 'pages/TransactionQueryPage'
import Scatter from 'pages/ScatterPage/Scatter'
import AccountMngPage from 'pages/AccountMngPage'
import CoinMngPage from 'pages/CoinMngPage'
import ContractMngPage from 'pages/ContractMngPage'
import MinerMngPage from 'pages/MinerMngPage'
import ResourceMngPage from 'pages/ResourceMngPage'

import { WillRoute } from 'hocs';


// import TestViews from 'pages/EosApiTestPage'



const prodTagManagerArgs = {
  gtmId: process.env.REACT_APP_PROD_GTM_ID
}

const devTagManagerArgs = {
  gtmId: process.env.REACT_APP_DEV_GTM_ID
}

class App extends Component {
  componentWillMount() {
    if(process.env.NODE_ENV === "development" ) {
      TagManager.initialize(devTagManagerArgs);
    }
    else {
      TagManager.initialize(prodTagManagerArgs);
    }
  }

  componentDidMount(){
    setTimeout(()=>{Loadable.preloadAll()}, 1000);
  }

  render() {
    return (
      <div className="App ">
        <Switch>
          <WillRoute exact path="/" component={ InfoPage }/>
          
          <WillRoute exact path="/transactionQuery/:id" component={ TransactionQueryPage }/>
          
          <WillRoute exact path="/blockdetail/:id" component={ BlockdetailPage }/>
          
          <WillRoute exact path="/account/:name" component={ AccountdetailPage }/>
          
          <WillRoute exact path="/accountMng" component={ AccountMngPage }/>

          <WillRoute exact path="/contractMng" component={ ContractMngPage }/>

          <WillRoute exact path="/coinMng" component={ CoinMngPage }/>

          <WillRoute exact path="/minersMng" component={ MinerMngPage }/>

          <WillRoute exact path="/srcMng" component={ ResourceMngPage }/>

          <WillRoute exact path="/scatter" component={ Scatter }/>

          



          <Redirect to="/" />
        </Switch>
      </div>
    );
  }
}

export default withRouter(connect(
  ({ endpoint, router }) => ({
    endpoint, router
  }),
  {

  }

)(App));
