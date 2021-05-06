import React, { Component} from 'react';
import { connect } from 'react-redux';
import './TransactionDetail.scss'
import {  fetchBlockDetail, fetchDetail } from './TransactionDetailReducer';
import moment from "moment"
function formatNumber(value) {
  value += '';
  const list = value.split('.');
  const prefix = list[0].charAt(0) === '-' ? '-' : '';
  let num = prefix ? list[0].slice(1) : list[0];
  let result = '';
  while (num.length > 3) {
    result = `,${num.slice(-3)}${result}`;
    num = num.slice(0, num.length - 3);
  }
  if (num) {
    result = num + result;
  }
  return `${prefix}${result}${list[1] ? `.${list[1]}` : ''}`;
}
let afId = undefined

let sohistory ={}
 
class TransactionDetail extends Component {
  constructor(props){
    super(props)
    sohistory = this.props.history
  }
  
  componentDidMount(){
    let urlValues = window.location.hash.split("/");
    let name = urlValues[2]

    if(name){
      this.props.fetchDetail({ id:  name })
    }
    
  }

  componentWillUpdate(){
    
  }
  blockdetail(id) {
    if (id) {
      if (afId !== id) {
        afId = id
        this.props.fetchBlockDetail(id)
      }
    }
  }

render(){
  let { TransactionQuery: { TransactionsDetail: { data } } } = this.props;
  let detail = data.transactionDetail
  let payload = detail ? detail : {}
  return (
    <div >
      { payload.id?
       
            <div className="detail-box TransactionDetail">
                      <div>{}</div>
              <div className="flex-box-c col-xs-12 ">
                <div className="flex-box lg-box">
                  <div className="value hx" style={{ width: "15%", minWidth: '15%' }}> 交易哈希:</div>
                  <div className="keys bw">{payload.id}</div>
                </div>
                <div className="midbox">
                  <div className="flex-box-lg ">
                    <div className="flex-box  ">
                      <div className="value">状态:</div>
                      <div className="keys " >
                        {/* {payload.receipt && (payload.receipt.status === "executed" ? (<span className="btn btn-success">已经执行</span>) : (<span className="btn btn-info"></span>))} */}
                        {/* {blockDetail && (blockDetail.irreversible ? (<span className="btn btn-info" style={{ marginLeft: '.3rem' }}>不可逆</span>) : null)} */}
                        
                        <span className="btn btn-info">不可逆</span>
                      
                      </div>

                    </div>
                    <div className="flex-box  borderline">
                      <div className="value" >区块编号:</div>
                      <div className="keys" onClick={this.blockdetail(payload.block_num)}>{payload && formatNumber(payload.block_num)}</div>
                    </div>
                    <div className="flex-box ">
                      <div className="value">区块创建时间:</div>
                      <div className="keys">{payload && moment(payload.block_time).add(8, 'H').format("YYYY-MM-DD HH:mm:ss")}</div>
                    </div>

                  </div>
                  <div className="flex-box-lg  ">
                    <div className="flex-box ">
                      <div className="value">计算资源使用量:</div>

                      {payload.receipt ? payload.receipt.cpu_usage_us : 0}μs
                    </div>
                    <div className="flex-box  borderline">
                      <div className="value ">网络资源使用量:</div>

                      {(payload.receipt ? payload.receipt.net_usage_words : 0) * 8} bytes

                    </div>
                    <div className="flex-box ">
                      {/* <div className="value">交易过期时间:</div>
                      <div className="keys">{ payload && new Date(payload.expiration).Format("yyyy-MM-dd HH:mm:ss")}</div>  */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          :<div>交易不存在</div>}
    </ div>
  );
}
 
}

export default connect(
  ({ TransactionQuery, TransactionDetailById, TransactionDetail, router, Blockdetail }) => ({
    TransactionDetailById,
    TransactionDetail,
    router,
    TransactionQuery,
    Blockdetail
  }),
  {
    fetchBlockDetail,
    fetchDetail
  }

)(TransactionDetail);
