import React, { Component } from 'react';

import { connect } from 'react-redux';
import './BlockdetailsTabs.scss'
import isObjectEmpty from 'helpers/is-object-empty';
import { LoadingSpinner } from 'components';
import { ErrorButton } from 'styled';
import { Tabs } from 'antd';
import { CodeViewer } from 'components';
import { fetchStart } from 'pages/TransactiondetailPage/components/Transactiondetail/TransactiondetailReducer'
import { setSearch } from "reducers/headblock"
const { TabPane } = Tabs;




class BlockdetailsTabs extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showObj: {},
      page: 1
    }
  }

  search(id) {
    if (id) {
      // this.props.fetchStart(id).
      window.byHash = false
      this.props.setSearch(id)
      this.props.history.replace('/transactionQuery/' + id)
      // alert(111)
    }

  }

  toggles(index) {
    let value = !this.state.showObj[index]
    let showObj = this.state.showObj
    showObj[index] = value
    this.setState({ showObj })
  }

  onChange(val) {
    this.setState({ page: val })
  }

  render() {
    let { Blockdetail, } = this.props;
    let datas = Blockdetail.data.payload && Blockdetail.data.payload[0] ?
      Blockdetail.data.payload[0].block ? Blockdetail.data.payload[0].block.transactions : []
      : []
    let isFetching = false, error = false

    return (
      <div >
        { error ?
          <>
            {!isObjectEmpty(error) && <p className="text-danger">{JSON.stringify(error)}</p>}
            <ErrorButton onClick={this.props.fetchStart}>连接错误 点击重连</ErrorButton>
          </>
          : isFetching ? (
            <LoadingSpinner />
          ) : (

            <Tabs defaultActiveKey="1">
              <TabPane
                tab={<span className="tabPane">内含交易({datas.length})</span>}
                key="1">
                <div className="tablevir">
                  <div className="tablelines">
                    <div className="">
                      交易id
                    </div>
                    <div className="">
                      cpu使用量
                    </div>
                    <div className="">
                      net使用量
                    </div>
                    <div className="">
                      状态
                    </div>
                  </div>
                  {datas.map((item, index) => {

                    return <div className="tablelines" key={index}>
                      <div className="" onClick={_ => this.search(item.trx ? item.trx.id : false)}>
                        {item.trx ? item.trx.id : item.trx}
                      </div>
                      <div className="">
                        <strong>{item.cpu_usage_us}</strong>  μs
                    </div>
                      <div className="">
                        <strong>{item.net_usage_words}</strong> KB
                    </div>
                      <div className="">
                        {item.status}
                      </div>
                    </div>
                  })}
                </div>
              </TabPane>
              <TabPane
                tab={<span className="tabPane"> 查看原始数据</span>}
                key="2">
                <CodeViewer
                  language="json"
                  value={JSON.stringify(Blockdetail, null, 2).replace(/eosio/g, "*****")}
                  readOnly={true}
                  height={600}
                />

              </TabPane>


            </Tabs>
          )}
      </ div>
    );
  }
}

export default connect(
  ({ Blockdetail }) => ({
    Blockdetail
  }),
  {
    fetchStart,
    setSearch
  }

)(BlockdetailsTabs);
