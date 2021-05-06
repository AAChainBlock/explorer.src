import React, { Component } from "react"
import './Transactions.scss'
import { connect } from 'react-redux';
import { fetchStart } from 'pages/TransactiondetailPage/components/Transactiondetail/TransactiondetailReducer'
import { fetchActionsTraces, fetchDict } from 'components/Header/components/Headsearch/HeadsearchReducer'
import { fetchBalanceStart as getAccount } from "pages/AccountdetailPage/components/AccountDetail/AccountdetailReducer.js"
import { fetchgetactionsStart as getBlockActionsStart } from "pages/BlockdetailPage/components/Blockdetails/BlockdetailsReducer"
import { fetchBlockDetail } from "pages/BlockdetailPage/components/Blockdetail/BlockdetailReducer"
import { CodeViewer } from 'components';

import { setSearch } from "reducers/headblock"
import { Pagination } from "antd"
import moment from "moment"
import { strTemplate } from "./describe"
import { from } from "rxjs";

class Transctions extends Component {
  constructor(props) {
    super(props)
    this.state = {
      codeText: {}
    }
  }
  pagChange(pag) {
    this.props.fatherfetchActionsTraces(pag)
  }
  showDetail(index) {
    let textline = this.state.codeText
    textline["a" + index] = !textline["a" + index]
    this.setState({ codeText: textline })
  }


  search(id) {
    this.props.setSearch(id)
    this.props.history.push('/transactionQuery/' + id)
  }

  searchAccount(params) {
    this.props.setSearch(params)
    this.props.history.push('/account/' + params)
  }

  searchBlock(params) {
    this.props.setSearch(params)
    this.props.history.push('/blockDetail/' + params)
  }

  Abidescribe(name) {
    this.props.setSearch(name)
    this.props.history.push('/Abidescribe/' + name)
  }

  render() {

    const { actions = [], showPag, total, pageNum, clickHandle, Headsearch: { data: { dict } } } = this.props
    let objs = {}
    dict.map((item) => {
      objs[item.name] = {}
      item.abi.actions.map((ele) => {
        let re = RegExp(/^@@@@$/)
        // ele.ricardian_contract

        let resulst = ele.ricardian_contract.split("@@@@")
        resulst = resulst.filter((item) => item !== "")
        let rsus = {}
        if (resulst.length > 0) {
          resulst.map((res) => {
            let arr = res.split(':')
            rsus[arr[0].trim()] = arr[1].trim()
          })
        }
        objs[item.name][ele.name] = rsus
      })
    })
    return <div className='flowbox'>
      {actions.length > 0 ? actions.map((item, index) => {
        const imAcn = item.act ? item.act : item.actions[0]
        return <div className="linebox" key={index}>
          <div className="linefirst">
            {clickHandle == undefined ? <div className=" col-2 ">
              <span style={{ marginRight: '.3rem' }} className="Action__ActionHash-sc-1d4f4ww-2 kaXnUU currorPoint" onClick={_ => this.searchBlock(item.block_num)}>{item.block_num}</span>
            </div> : <div className=" col-2 ">
              <span style={{ marginRight: '.3rem' }} className="Action__ActionHash-sc-1d4f4ww-2 kaXnUU " >{item.block_num}</span>
            </div>}
            {clickHandle == undefined ? <div className=" col-2 ">
              <span className="mr-1 Action__ActionHash-sc-1d4f4ww-2 kaXnUU currorPoint" onClick={_ => this.search(item.trx_id)}>
                trx_id:{item.trx_id.substring(0, 8)}
              </span>
            </div> : <div className=" col-2 ">
              <span className="mr-1 Action__ActionHash-sc-1d4f4ww-2 kaXnUU " >
                trx_id:{item.trx_id.substring(0, 8)}
              </span>
            </div>}
            <div className="">

              {clickHandle == undefined ? <div className="flex-fill">
                经<span className="currorPoint" onClick={_ => this.searchAccount(imAcn.authorization[0].actor.replace(/eosio/g, "*****"))}>
                  {imAcn ? `${imAcn.authorization[0].actor.replace(/eosio/g, "*****")} (${imAcn.authorization[0].permission})` : "未知"}
                </span>授权
                                                 <strong className="currorPoint" onClick={_ => this.searchAccount(imAcn.account)}>{imAcn ? imAcn.account.replace(/eosio/g, "*****") : "/"}</strong>
                                执行了{imAcn ? imAcn.name : "/"}（<a className="currorPoint" onClick={() => this.showDetail(index)}>
                  {this.state.codeText["a" + index] ? '收起详细数据' : '查看详细数据'}
                </a>）
                            </div> :
                <div className="flex-fill">
                  经<span className="" >
                    {imAcn ? `${imAcn.authorization[0].actor.replace(/eosio/g, "*****")} (${imAcn.authorization[0].permission})` : "未知"}
                  </span>授权
                                                 <strong className="" >{imAcn ? imAcn.account.replace(/eosio/g, "*****") : "/"}</strong>
                                    执行了{imAcn ? imAcn.name : "/"}{typeof objs[imAcn.account][imAcn.name].ZH !== "string" ? <a className="" onClick={() => this.showDetail(index)}>
                    {this.state.codeText["a" + index] ? '（收起详细数据）' : '（查看详细数据）'}
                  </a> : null}
                </div>}
            </div>
            <div className="col-3">
              <span className="Action__ActionTime-sc-1d4f4ww-5 eHdVYL">
                <span >{
                  item.block_time ? moment(item.block_time).add(8, 'H').format("YYYY-MM-DD HH:mm:ss") : ""
                }</span>
              </span>
            </div>
          </div>
          {typeof objs[imAcn.account][imAcn.name].ZH == "string" ?
            <span className="describes">{strTemplate(imAcn.data, objs[imAcn.account][imAcn.name].ZH)}</span>
            : null}



          {this.state.codeText["a" + index] ? <div className="" style={{ width: "100%", }}>
            <CodeViewer
              language="json"
              value={JSON.stringify(imAcn.data, null, 2).replace(/eosio/g, "*****")}
              readOnly={true}
              height={200}
            />
          </div> : null
          }

        </div>
      }) : "暂无数据"}
      {
        //    true ?
        (actions.length > 0 || pageNum > 1) && showPag ?
          <Pagination defaultPageSize={20} defaultCurrent={pageNum} total={total} onChange={_ => this.pagChange(_)}
            showTotal={(total, range) => `${range[0]}至${range[1]}， 共 ${total} 条`}
          /> : null
      }
    </div>
  }

}

export default connect(({ Headsearch }) => ({ Headsearch }), {
  fetchStart,
  fetchActionsTraces,
  getAccount,
  getBlockActionsStart,
  fetchBlockDetail,
  setSearch,
  fetchDict
})(Transctions)
