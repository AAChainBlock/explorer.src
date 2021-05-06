import React, { Component } from 'react';

import { connect } from 'react-redux';
import './TransactionTabs.scss'
import isObjectEmpty from 'helpers/is-object-empty';
import { LoadingSpinner } from 'components';
import { ErrorButton } from 'styled';
import { Tabs } from 'antd';
import { CodeViewer } from 'components';
import ActionsTable from 'components/ActionsTable'
const { TabPane } = Tabs;




class TransactionTabs extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showObj: {},
      page: 1
    }
  }

  componentDidMount() {
    // let { router: { location: { hash } }, } = this.props
    // let urlValues = window.location.hash.split("/");
    // let name = urlValues[2]
    // this.props.fetchDetail({ id: window.hash || name })
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
    //   let { TransactionQuery: { TransactionsDetail: { data } } } = this.props;
    // let detail = data.transactionDetail
    // let payload = detail ? detail : {}, error = false
    let { TransactionQuery: { TransactionsDetail: { data } } } = this.props;
    let transactionDetail = data.transactionDetail
    let isFetching = false,
      error = false
    return (
      <div >
        {error ?
          <>
            {!isObjectEmpty(error) && <p className="text-danger">{JSON.stringify(error)}</p>}
            <ErrorButton onClick={this.props.fetchStart}>连接错误 点击重连</ErrorButton>
          </>
          : isFetching ? (
            <LoadingSpinner />
          ) : (

            <Tabs defaultActiveKey="1">
              <TabPane
                tab={<span className="tabPane">操作踪迹</span>}
                key="1">
                <div style={{ overflow: 'auto' }}>
                  <ActionsTable history={this.props.history} hideCode={false} action={transactionDetail ? transactionDetail.action_traces : []} />
                </div>

              </TabPane>
              <TabPane
                tab={<span className="tabPane">原始代码</span>}
                key="2"
              >
                <CodeViewer
                  language="json"
                  value={JSON.stringify(transactionDetail ? transactionDetail.action_traces : [], null, 2).replace(/eosio/g, "*****")}
                  readOnly={true}
                  className='transCode'
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
  ({ TransactionDetailById, router, TransactionQuery }) => ({
    TransactionDetailById,
    router,
    TransactionQuery
  }),
  {
  }

)(TransactionTabs);
