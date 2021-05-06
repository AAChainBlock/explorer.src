// import './InfoPage.scss';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Pagination, Table, Button, Tooltip, Input } from "antd"
import { AudioOutlined } from '@ant-design/icons';
import { fetchTransfers } from 'components/Header/components/Headsearch/HeadsearchReducer'
import { LoadingSpinner } from 'components';
import download from './exportExcel'
import moment from 'moment'
import axios from 'axios'
import "./Exchanges.css"
const { Search } = Input

const suffix = (
  <AudioOutlined
    style={{
      fontSize: 16,
      color: '#1890ff',
    }}
  />
);
let memo = undefined
class InfoPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageNum3: 1
    }
  }
  componentDidMount() {
    this.transfers(1)
  }
  transfers = (pageNum) => {
    let urlValues = window.location.hash.split("/");
    let name
    this.setState({ pageNum3: pageNum })
    let opt = {
      pageNum: pageNum,
      memo
    }
    if (urlValues.length > 2) {
      opt.account = urlValues[2]
      name = urlValues[2]
    }
    this.props.fetchTransfers(opt)
  }

  exportExcel = async () => {
    let urlValues = window.location.hash.split("/");
    try {
      let opt = {
        pageSize: 100000
      },
        name
      if (urlValues.length > 2) {
        opt.account = urlValues[2]
        name = urlValues[2]
      }

      const jsons = await axios.post(window.baseUrl + '/transferList', opt)
      download(jsons.data.data, name)
    } catch (error) {

    }

  }
  memochange(val) {
    if (val.target.value != "" && val.target.value != undefined) {
      memo = val.target.value
    }

  }
  sert() {
    return
  }

  render() {
    let { data } = this.props.Headsearch
    let transfers = data.transfers ? data.transfers : []
    transfers = transfers.filter(item => item.from)
    let transferSource = transfers.map((item, index) => {
      let { block_num,
        trx_id,
        publish_account,
        from,
        to,
        quantity,
        memo, block_time } = item
      let amount = item.amount ? item.amount : 0
      quantity = amount.toFixed(item.decimal) + " " + item.symbol
      return {
        key: index,
        block_num,
        trx_id,
        publish_account,
        from,
        to,
        quantity,
        memo,
        block_time
      }
    })
    const domains = window.location.origin + "/"
    const transfersColumns = [
      {
        title: '区块编号',
        dataIndex: 'block_num',
        key: 'block_num',
        render: block_num => (
          <a href={domains + "#/blockDetail/" + block_num}>
            {block_num}
          </a>
        ),
      },
      {
        title: '交易编号',
        dataIndex: 'trx_id',
        key: 'trx_id',
        render: trx_id => (
          <a href={domains + "#/transactionQuery/" + trx_id}>
            {trx_id.substring(0, 8)}...
          </a>
        ),
      },
      {
        title: '资产合约',
        dataIndex: 'publish_account',
        key: 'publish_account',
        render: publish_account => (
          <a href={domains + "#/account/" + publish_account}>
            {publish_account.replace(/eosio/g, "*****")}
          </a>
        ),
      },
      {
        title: '转出账户',
        dataIndex: 'from',
        key: 'from',
        render: from => (
          <a href={domains + "#/account/" + from}>
            {from.replace(/eosio/g, "*****")}
          </a>
        ),
      },
      {
        title: '转入账户',
        dataIndex: 'to',
        key: 'to',
        render: to => (
          <a href={domains + "#/account/" + to}>
            {to.replace(/eosio/g, "*****")}
          </a>
        ),
      },
      {
        title: '金额',
        dataIndex: 'quantity',
        key: 'quantity',
        render: quantity => {
          let arrs
          if (typeof quantity == "string" && quantity.length > 0) {
            arrs = quantity.split(".")
          }
          return <div className="quantitybox" >
            <div className="quantitybox-left">{arrs[0]}</div>.<div className="quantitybox-right">{arrs[1]}</div>
          </div>
        },
      },
      {
        title: '备注',
        dataIndex: 'memo',
        key: 'memo',
        render: memo => {
          if (memo) {
            return <Tooltip title={memo}>
              <span>{memo.length > 10 ? memo.substring(0, 10) + '...' : memo}</span>
            </Tooltip>
          } else {
            return ''
          }

        },
      },
      {
        title: '时间',
        dataIndex: 'block_time',
        key: 'block_time',
        render: block_time => (
          <span>
            {moment(block_time).format("YYYY-MM-DD HH:mm:ss")}
          </span>
        ),
      },
    ];

    return (

      <div className="">
        <div
          tab={<span> 转账记录</span>}
          key="6">
          <Search
            className="memosearch"
            placeholder="备注信息模糊搜索"
            enterButton="搜索"
            size="middle"
            onChange={_ => this.memochange(_)}
            onSearch={value => this.transfers()}
          />
          {data.fetchTranfers ? <LoadingSpinner /> :
            <Table columns={transfersColumns} dataSource={transferSource} pagination={false} />
          }
          {
            (transferSource.length > 0 || this.state.pageNum3 > 1) ?
              <div className="pagbody">
                {this.props.isExport ? <Button onClick={this.exportExcel}> 导出excel</Button> : <div></div>}
                <Pagination className="transfertable" defaultPageSize={10} defaultCurrent={this.state.pageNum3} total={50000} onChange={_ => this.transfers(_)}
                  showTotal={(total, range) => `${range[0]}至${range[1]}， 共 ${total} 条`}
                />
              </div> : null
          }
        </div>

      </div>


    );
  }
}

export default connect(
  ({ Headsearch, }) => ({
    Headsearch
  }),
  {
    fetchTransfers
  }
)(InfoPage);
