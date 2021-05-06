
import React, { Component } from "react"
import { Tree } from "antd"
import './ActionsTable.scss'
import { connect } from 'react-redux';
import { fetchStart } from 'pages/TransactiondetailPage/components/Transactiondetail/TransactiondetailReducer'
import { fetchActionsTraces } from 'components/Header/components/Headsearch/HeadsearchReducer'
import { fetchBalanceStart as getAccount } from "pages/AccountdetailPage/components/AccountDetail/AccountdetailReducer.js"
import { fetchgetactionsStart as getBlockActionsStart } from "pages/BlockdetailPage/components/Blockdetails/BlockdetailsReducer"
import { fetchBlockDetail } from "pages/BlockdetailPage/components/Blockdetail/BlockdetailReducer"
import { CodeViewer } from 'components';
import { setSearch } from "reducers/headblock"
import moment from "moment"
const { TreeNode } = Tree;

class AnctionsTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      codeText: {},
      codeIndex: undefined
    }

  }

  onSelect = (selectedKeys, info) => {

  };
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
  }

  showDetail(index) {
    let codeText = this.state.codeText

    if (this.state.codeIndex === index) {
      codeText[index] = !this.state.codeText[index]
    } else {
      for (const key in codeText) {
        codeText[key] = false
      }
      codeText[index] = !this.state.codeText[index]
    }
    this.setState({ codeIndex: index })
    this.setState({ codeText: codeText })
  }

  title = (items, index, name) => {

    let item = items.act
    return <div className="treetitles ">
      <div className="linebox" >
        <div className="linefirst">
          <div className=" col-6">
            <div className="d-flex flex-row justify-content-start flex-nowrap">
              <div className="pb-0 flex-fill Action__ActionContent-sc-1d4f4ww-6 eTYlTr">
                <div className="flex-fill">
                  经<span className="currorPoint" onClick={_ => this.searchAccount(item.authorization[0].actor.replace(/eosio/g, "*****"))}>  {item ? `${item.authorization[0].actor.replace(/eosio/g, "***")} (${item.authorization[0].permission})` : "未知"}</span> 授权
                                                 <strong className="currorPoint" onClick={_ => this.searchAccount(item.account)}>{item ? item.account.replace(/eosio/g, "*****") : "/"}</strong> 执行了 <strong>{item ? item.name.replace(/eosio/g, "*****") : "/"}</strong>
                  {!this.props.hideCode ?
                    <span>
                      （<a className="currorPoint" onClick={() => this.showDetail(index)}>
                        {this.state.codeText[index] ? '收起详细数据' : '查看详细数据'}
                      </a>）
                                                    </span>
                    : null}
                </div>
              </div>

            </div>
          </div>
          <div className="col-2"><span
            className="Action__ActionTime-sc-1d4f4ww-5 eHdVYL"><span >
              {moment(items.block_time).add(8, 'H').format("YYYY-MM-DD HH:mm:ss")}</span></span>
          </div>
        </div>
        {this.state.codeText[index] ? <div className="codebox" style={{ width: "100%", }}>
          <CodeViewer
            language="json"
            value={JSON.stringify(items.act.data, null, 2).replace(/eosio/g, "*****")}
            readOnly={true}
            height={200}
          />
        </div> : null
        }

      </div>
    </div>
  }

  render() {
    const action = this.props.action ? this.props.action : []
    let trees = []
    action.map((item) => {
      if (item.creator_action_ordinal == 0) {
        item.child = []
        trees.push(item)
      } else {
        trees = trees.map((items) => {
          if (items.action_ordinal == item.creator_action_ordinal) {
            items.child.push(item)
          }
          return items
        })
      }
    })
    const loop = data =>
      data.map(item => {

        if (item.children) {
          return (
            <TreeNode key={item.action_ordinal} title={this.title(item, item.action_ordinal)}>
              {loop(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode key={item.action_ordinal} title={this.title(item, item.action_ordinal)} />;
      });
    return <div className="anctionbox">

      <Tree > {loop(action)}</Tree>
    </div>

  }
}


export default connect((router) => ({ router }), {
  fetchStart,
  fetchActionsTraces,
  getAccount,
  getBlockActionsStart,
  fetchBlockDetail,
  // Abidescribe,
  setSearch
})(AnctionsTable)
