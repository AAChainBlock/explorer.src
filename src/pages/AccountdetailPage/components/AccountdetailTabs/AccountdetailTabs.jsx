import React, { Component } from 'react';
import { connect } from 'react-redux';
import './AccountdetailTabs.scss'
import { LoadingSpinner } from 'components';
import { ErrorButton } from 'styled';
import { Tabs, Table, DatePicker, Input } from 'antd';
import { ContainerOutlined } from '@ant-design/icons';
import moment from 'moment';
import { fetchStart } from 'pages/InfoPage/components/ProductionNode/ProductionNodeReducer';
import Transactions from "pages/InfoPage/components/Transactions/Transactions"


import { fetchActionsTraces, fetchActionsTracesActive, fetchTransfers } from 'components/Header/components/Headsearch/HeadsearchReducer'
import VotesList from "./../VotesList/Producers"
import { Exchanges } from 'components'
import axios from 'axios'

const { RangePicker } = DatePicker
const { Search } = Input;

const { TabPane } = Tabs;
let names = "",
  pageNum = 1

let timeRange = {
  "今天": [moment().startOf("days"), moment().endOf("days")],
  "一周前": [moment().subtract('days', 6), moment()],
  "三周前": [moment().subtract('days', 20), moment()],
  '本月': [moment().startOf('month'), moment().endOf('month')],
  "一个月前": [moment().subtract('days', 29), moment()],
  "一个季度": [moment().subtract('days', 120), moment()],
}
let start = moment().subtract('days', 29)
let end = moment()
let max = Infinity,
  min = 0,
  serchName = ""
class AccountdetailTabs extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showObj: {},
      page: 1,
      contract: undefined,
      act: undefined,
      name: undefined,
      active: undefined,

      pageNum: 1,
      pageNum2: 1,
      pageNum3: 1
    }
  }

  componentDidMount() {
    let hash = this.props.router.location.hash
    let urlValues = window.location.hash.split("/");
    let name = urlValues[2]
    names = name
    serchName = name
    this.setState({ name: name })
    this.props.fetchStart()
    this.transfers(1)
  }
  componentDidUpdate() {
    let hash = this.props.router.location.hash
    let urlValues = window.location.hash.split("/");
    let name = urlValues[2]
    names = name
  }

  toggles(index) {
    let value = !this.state.showObj[index]
    let showObj = this.state.showObj
    showObj[index] = value
    this.setState({ showObj })
  }

  onChange(event) {
    event.persist()
    this.setState({ page: event.target.value })
  }

  heyueChange(event) {
    event.persist()
    this.setState({ contract: event.target.value })
  }
  actChange(event) {
    event.persist()
    this.setState({ act: event.target.value })
  }
  activeChange(event) {
    event.persist()
    this.setState({ active: event.target.value })

  }

  searchheyue(val) {
    // this.setState({ contract : val })
    let opt = {
      blockNum: {
        max,
        min
      },
      contract: this.state.contract,
      act: this.state.act,
      authorized: this.state.name,
    }
    this.props.fetchActionsTraces(opt)

  }
  transactionsPag = (pageNum) => {
    let hash = window.location.hash
    let urlValues = window.location.hash.split("/");
    let name = urlValues[2]
    let { contract, act } = this.state
    this.setState({ pageNum })
    let opt = {
      blockNum: {
        max,
        min
      },
      contract: contract,
      action: act,
      authorized: name,
      pageNum,
      pageSize: 20
    }
    this.props.fetchActionsTraces(opt)
  }
  transfers = (pageNum) => {
    let hash = window.location.hash
    let urlValues = window.location.hash.split("/");
    let name = urlValues[2]
    this.setState({ pageNum3: pageNum })
    let opt = {
      account: name,
      pageNum,

    }
    this.props.fetchTransfers(opt)
  }
  transactionsActivePag = (pageNum) => {
    let hash = this.props.router.location.hash
    let urlValues = window.location.hash.split("/");
    let name = urlValues[2]
    let { act } = this.state
    this.setState({ pageNum2: pageNum })
    // this.setState({pageNum})
    let opt = {
      blockNum: {
        max,
        min
      },
      action: act,
      contract: name,
      pageNum,
      pageSize: 20
    }

    this.props.fetchActionsTracesActive(opt)
  }
  searchactive(val) {

    let opt = {
      blockNum: {
        max,
        min
      },
      action: this.state.active,
      contract: this.state.name
    }
    this.props.fetchActionsTracesActive(opt)
  }
  searchact(val) {
    let opt = {
      blockNum: {
        max,
        min
      },
      contract: this.state.contract,
      action: this.state.act,
      authorized: this.state.name,
    }
    this.props.fetchActionsTraces(opt)
  }

  actionOnChange = async (e, f) => {
    if (e) {
      if (e.length > 0) {
        start = e[0].toISOString()
        end = e[1].toISOString()
        try {
          let r1 = await this.getblockNum({ time: end, limit: 'gt' })
          let r2 = await this.getblockNum({ time: start, limit: 'lt' })
          max = r1.data.data.block_num
          min = r2.data.data.block_num
        } catch (error) {
          console.log(error)
        }
      } else {
        max = undefined
        min = 0
      }

    }


  }

  activeOnChange = async (e, f) => {
    if (e) {
      if (e.length > 0) {
        start = e[0].toISOString()
        end = e[1].toISOString()
        try {
          let r1 = await this.getblockNum({ time: end, limit: 'gt' })
          let r2 = await this.getblockNum({ time: start, limit: 'lt' })
          max = r1.data.data.block_num
          min = r2.data.data.block_num
        } catch (error) {
          console.log(error)
        }
      } else {
        max = undefined
        min = 0
      }

    }

  }

  getblockNum = (opt) => {
    return axios.post(window.baseUrl + '/getBlockByTime', opt)
  }

  render() {

    let { accountdetail: { accountdetail: { data: { payload, payload1, producers, currency, currentAccount } } }, Headsearch: { data }, Abidescribe, ProductionNodeReducer } = this.props;
    let rows = ProductionNodeReducer ? ProductionNodeReducer.data.payload ? ProductionNodeReducer.data.payload.rows : [] : []
    let array = payload1 != undefined ? (payload1.voter_info != undefined ? payload1.voter_info.detail != undefined ? payload1.voter_info.detail : [] : []) : []
    // let Abidescribedata = Abidescribe.data.payload
    let producerlist = []
    for (let i = 0; i < array.length; i++) {
      const element1 = array[i];
      for (let n = 0; n < rows.length; n++) {
        const element = rows[n];
        if (element1.prod == element.owner) {
          element.ranking = n + 1
          element.pdv = element1.pdv
          element.prenst = (parseFloat(element1.pdv) * 100 / parseFloat(element.total_votes)).toFixed(2) + "%"
          producerlist.push(element)
        }
      }
    }
    let action, active, total, total2

    if (data && data.actionsTraces) {
      action = data.actionsTraces.data
      total = data.actionsTraces.data.total || 200
    }
    if (data && data.actionsTracesActive) {

      active = data.actionsTracesActive.data
      total2 = data.actionsTracesActive.data.total || 200
    }
    const columns = [
      {
        title: '合约',
        dataIndex: 'contract',
        key: 'contract',
      },
      {
        title: '发行人',
        dataIndex: 'issuer',
        key: 'issuer',
      },
      {
        title: '余额',
        dataIndex: 'asset',
        key: 'asset',
      },
    ];

    let isFetching = false, error = false,
      currencyData = currency ? currency.data.map((item, index) => {
        item.key = index
        item.issuer = item.issuer.replace(/eosio/g, "*****")
        item.contract = item.contract.replace(/eosio/g, "*****")
        return item
      }) : []
    return (
      <div >
        {error ?
          <>
            <ErrorButton onClick={this.props.fetchStart}>连接错误 点击重连</ErrorButton>
          </>
          : isFetching ? (
            <LoadingSpinner />
          ) : (
            <div className="accountTabs-box">
              <Tabs defaultActiveKey="1">

                <TabPane
                  tab={<span className="tabPane"><ContainerOutlined /> 通证信息</span>}
                  key="1">
                  <Table dataSource={currencyData} columns={columns} />
                </TabPane>

                <TabPane
                  tab={<span className="tabPane"><ContainerOutlined /> 投票 {producers ? producerlist.length : 0}</span>}
                  key="2">
                  <VotesList producers={producerlist} />

                </TabPane>

                <TabPane
                  tab={<span className="tabPane"><ContainerOutlined />最近操作</span>}
                  key="3">
                  <div className="searbox">
                    <RangePicker
                      ranges={timeRange}
                      showTime
                      defaultValue={[start, end]}
                      format="YYYY/MM/DD HH:mm:ss"
                      onChange={e => this.actionOnChange(e)}
                    />
                    <Search
                      placeholder="请输入合约称"
                      onChange={val => this.heyueChange(val)}
                      onSearch={value => this.searchheyue(value)}
                      style={{ width: 200 }}
                    />
                    <Search
                      placeholder="请输入操作名称"
                      onChange={val => this.actChange(val)}

                      onSearch={value => this.searchact(value)}
                      style={{ width: 200 }}
                    />
                  </div>

                  {data.isFetchActionsTraces ? <LoadingSpinner /> :
                    <Transactions history={this.props.history}
                      fatherfetchActionsTraces={this.transactionsPag}
                      actions={action ? action : []} total={1000} pageNum={this.state.pageNum} showPag={true} />}
                </TabPane>
                <TabPane
                  tab={<span className="tabPane"><ContainerOutlined /> 最近访问</span>}
                  key="4">
                  <div className="searbox">
                    <RangePicker
                      ranges={timeRange}
                      showTime
                      defaultValue={[start, end]}
                      format="YYYY/MM/DD HH:mm:ss"
                      onChange={this.activeOnChange}
                    />
                    <Search
                      placeholder="请输入操作名称"
                      onChange={val => this.activeChange(val)}

                      onSearch={value => this.searchactive(value)}
                      style={{ width: 200 }}
                    />
                  </div>
                  {data.isFetchActionsTracesActive ? <LoadingSpinner /> :
                    <Transactions history={this.props.history}
                      fatherfetchActionsTraces={this.transactionsActivePag}
                      total={1000} pageNum={this.state.pageNum2} actions={active ? active : []} showPag={true} />}
                </TabPane>
                <TabPane
                  tab={<span className="tabPane"><ContainerOutlined /> 转账记录</span>}
                  key="6">

                  <Exchanges isExport={true} />
                </TabPane>

                {/* <TabPane
                    tab={<span><ContainerOutlined /> 合约描述</span>}
                    key="5">
                    <div className="Abidescribe " >
                      {Abidescribedata && Abidescribedata.data ? Abidescribedata.data.map((item, index) => {
                        return <div className="" key={index}>
                          <h3>{item.name}</h3>
                          <div>{item.abi && item.abi.ricardian_clauses.map((item1, index1) => {

                            return <h5 key={index1}>
                              <div>{item1.id}</div>
                              <div>{item1.body}</div>
                            </h5>
                          })}</div>
                        </div>
                      }) : <h2> 暂无数据 </h2>}
                      {Abidescribedata && Abidescribedata.data ? Abidescribedata.data.length === 0 ? <h2><br /> 暂无数据 </h2> : null : null}
                    </div>
                  </TabPane> */}

              </Tabs>
            </div>
          )}
      </ div>
    );
  }
}

export default connect(
  ({ Headsearch, accountdetail, Abidescribe, ProductionNodeReducer, router }) => ({
    Headsearch,
    accountdetail,
    Abidescribe,
    ProductionNodeReducer,
    router
  }),
  {
    fetchStart,
    fetchActionsTraces,
    fetchActionsTracesActive,
    fetchTransfers
  }

)(AccountdetailTabs);
