import React, { Component } from "react"
import { connect } from 'react-redux';
import { setSearch } from "reducers/headblock"
import './TransactionTraces'
import { Table } from "antd"

class TransactionTraces extends Component {
  constructor(props) {
    super(props)
    this.state = {
      codeText: {}
    }
  }
  goblock(id) {
    this.props.setSearch(id)
    this.props.history.push('/blockDetail/' + id)
  }
  render() {
    let { blockchainInfo: { data: { transactiontraces = [] } } } = this.props

    let datas = transactiontraces.map((item, index) => {
      item.key = item.block_num + "" + index
      return item
    })

    const columns = [
      {
        title: '区块编号',
        dataIndex: 'block_num',
        key: 'block_num',
        render: row => <a onClick={e => this.goblock(row)} >{row}</a>
      },
      {
        title: 'cpu使用量',
        dataIndex: 'cpu_usage_us',
        key: 'cpu_usage_us ',
        render: row => <span >{row} us</span>
      },
      {
        title: 'net使用量',
        dataIndex: 'net_usage_words',
        key: 'net_usage_words ',
        render: row => <span >{row} bytes</span>

      },
      {
        title: '交易数量',
        dataIndex: 'transaction_size',
        key: 'transaction_size',
      },
      {
        title: '操作数量',
        dataIndex: 'action_size',
        key: 'action_size ',
      },
    ];


    return <div className='flowbox'>
      <Table dataSource={datas} columns={columns} pagination={false} />;
                </div>
  }

}

export default connect(
  ({ infoPage: { blockchainInfo } }) => ({
    blockchainInfo,
  }), { setSearch })(TransactionTraces)