import './InfoPage.scss';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { WalletTemplate } from 'templates';
import BlockchainInfo from './components/BlockchainInfo';
import ProductionNodeViews from './components/ProductionNode'
import {  Tabs, Input } from "antd"
// import Icon from '@ant-design/icons';
import Transactions from './components/Transactions/Transactions'
import TransactionTraces from './components/TransactionTraces/TransactionTraces'
import CurrentMng from "./components/CurrentMng/CurrentMng"
import { pollingStopAll, fetchTransactionTraces as transactionTracespolling } from './components/BlockchainInfo/BlockchainInfoReducer'
import { pollingStart as headpolling } from "reducers/headblock"
import { pollingStart as lastpolling } from "reducers/lastblockinfo"
import { fetchStart as blockchaininfo_fetchstart } from 'pages/InfoPage/components/BlockchainInfo/BlockchainInfoReducer';
import { fetchTransctionsTraces, fetchActionsTraces, fetchTransctionsTrace } from "reducers/reversibleReducer"
import { fetchTransfers } from 'components/Header/components/Headsearch/HeadsearchReducer'
import {Exchanges} from 'components'
import moment from 'moment'

const { TabPane } = Tabs;
const { Search } = Input

class InfoPage extends Component {

  constructor(props) {
    super(props);
    if (navigator.userAgent === 'ReactSnap') {
      this.state = {
        modalIsOpen: false,
        ispolling: true,
        pageNum3: 1
      }
    } else {
      this.state = {
        pageNum3: 1,
        modalIsOpen: false
      }
    }

  }

  componentDidMount() {
    this.pollingStarts()
    this.props.fetchTransctionsTraces()
    this.transfers(1)
  }

  pollingStop() {
    this.setState({ ispolling: false })
    this.props.pollingStopAll()
  }

  pollingStarts() {
    this.setState({ ispolling: true })

    this.props.transactionTracespolling()
    this.props.headpolling()
    this.props.lastpolling()
    this.props.blockchaininfo_fetchstart()
  }


  componentWillUnmount() {
    this.props.pollingStopAll()
  }

  search(val) {
    if (val === "" || val === undefined) {
      this.props.fetchTransctionsTraces()
    } else {
      this.props.fetchTransctionsTrace({ trx_id: val })

    }
  }
  transfers = (pageNum) => {

    this.setState({ pageNum3: pageNum })
    let opt = {
      pageNum:pageNum,
    }
    this.props.fetchTransfers(opt)
  }
  render() {
    let { transactionTrace } = this.props.reversible.data
    let { actionsTracesActive } = this.props.Headsearch.data
    let variants = transactionTrace ? transactionTrace.variants : []
    actionsTracesActive = actionsTracesActive ? actionsTracesActive.data : []
    let trance_trace = []
    for (let i = 0; i < variants.length; i++) {
      const el = variants[i];
      trance_trace.push(...el.action_traces)
    }

    return (
      <WalletTemplate history={this.props.history} >
        <div className="InfoPage container">

          <div className="panelhead">
            <div >  实时状态</div>
            {this.state.ispolling ? <div onClick={_ => this.pollingStop()}>  暂停更新</div> :
              <div onClick={_ => this.pollingStarts()}>  开始更新</div>}
          </div>

          <BlockchainInfo />


          <div className="panel panel-default">
            <div className="panel-body">
              <Tabs defaultActiveKey="1" >
                <TabPane tab="生产者" key="1">
                  <ProductionNodeViews history={this.props.history} />
                </TabPane>
                
                <TabPane tab="最新区块" key="2">
                  <TransactionTraces history={this.props.history} />
                </TabPane>
                <TabPane tab="最新操作" key="3">
                  <Transactions history={this.props.history} actions={actionsTracesActive} showPag={false} />
                </TabPane>
                <TabPane
                  tab={<span> 转账记录</span>}
                  key="6">

                  {/* {data.fetchTranfers ? <LoadingSpinner /> :
                    <Table columns={transfersColumns} dataSource={transferSource} pagination={false} />
                  }
                  {
                    //    true ?
                    (transferSource.length > 0 || this.state.pageNum3 > 1) ?
                      <Pagination className="transfertable" defaultPageSize={10} defaultCurrent={this.state.pageNum3} total={500} onChange={_ => this.transfers(_)}
                        showTotal={(total, range) => `${range[0]}至${range[1]}， 共 ${total} 条`}
                      /> : null
                  } */}
                  <Exchanges />
                </TabPane>
                
                <TabPane tab="可逆操作" key="4">
                  <Search
                    placeholder="请输入交易哈希"
                    // onChange={val => this.heyueChange(val)}
                    onSearch={value => this.search(value)}
                    style={{ width: 200 }}
                  />
                  <Transactions history={this.props.history} clickHandle={true} actions={trance_trace} showPag={false} />
                </TabPane>
                <TabPane tab="优质资产" key="5">
                  <CurrentMng />
                </TabPane>

              </Tabs>
            </div>
          </div>
        </div>

      </WalletTemplate>
    );
  }
}

export default connect(
  ({ Headsearch, accountdetail, reversible }) => ({
    Headsearch, accountdetail, reversible
  }),
  {
    pollingStopAll,
    transactionTracespolling,
    headpolling,
    lastpolling,
    fetchTransctionsTraces,
    fetchActionsTraces,
    fetchTransctionsTrace,
    fetchTransfers,
    blockchaininfo_fetchstart
  }
)(InfoPage);
