import React, { Component } from 'react';
import { WalletTemplate } from 'templates';
import Blockdetails from './components/Blockdetails';
import BlockdetailTabs from "./components/BlockdetailsTabs"
// import Icon from '@ant-design/icons';

class BlockdetailPage extends Component {

  render() {

    return (
      <WalletTemplate history={this.props.history}>
        <div className="TransactionQueryPage container">

          <div className="unit"> 账号信息</div>
          <div className="panel panel-default">
            <div className="panel-body">
            <Blockdetails />
            </div>
          </div>
          <BlockdetailTabs history ={this.props.history}/>

        </div>
      </WalletTemplate>
    );
  }
}

export default BlockdetailPage;
