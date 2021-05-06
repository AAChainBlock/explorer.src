import React, { Component } from 'react';

import { WalletTemplate } from 'templates';
import TransactionDetail from './components/TransactionDetail';
import TransactionTabs from './components/TransactionTabs'
import { connect } from 'react-redux';
// import { Icon } from "antd"
import "./TransactionQueryPage.scss"


class TransactionQueryPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      panelIsshow: true
    }
  }

  powerful = (bleen) => {
    this.setState({
      panelIsshow: !bleen
    })
  }

  render() {

    return (
      <WalletTemplate history={this.props.history}>
        <div className="TransactionQueryPage container">
          <div className="unit"> 账号信息</div>
          <div className="panel panel-default">
            <div className="panel-body">
              <TransactionDetail history={this.props.history} />
            </div>
          </div>
          <TransactionTabs history={this.props.history} />

        </div>
      </WalletTemplate>
    );
  }
}

export default connect(
  ({ TransactionQuery }) => ({ TransactionQuery }),
  {

  })(TransactionQueryPage);
