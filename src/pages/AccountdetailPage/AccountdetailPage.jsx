import React, { Component } from 'react';

import { WalletTemplate } from 'templates';
import Accountdetail from './components/AccountDetail';
import AccountdetailTabs from './components/AccountdetailTabs'
import { connect } from 'react-redux';
import {  Tree } from "antd"
import "./AccountdetailPage.scss"
import { isArrayFn } from "helpers/isArrays"
const { TreeNode } = Tree;
let objTree = {}

let arr = [], next = [], tree = []

class AccountdetailPage extends Component {
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

  objFn(objs, item) {
    let resultObj = { bln: false, arr }
    let obj = { ...objs }
    for (var key in obj) {
      if (typeof obj[key] != "object") {
        // arr.push(key);
      } else if (typeof obj[key] == "object" && !isArrayFn(obj[key])) {
        if (key === item.parent) {
          arr.push(key)
          resultObj = { bln: true, arr }
          return resultObj
        } else {
          arr.push(key)
          this.objFn(obj[key], item);
        }
      }
    }
    return resultObj
  }

  treeloop(treeNode, item) {
    let perm_names = undefined
    treeNode.forEach((ele) => {
      if (ele.perm_name === item.parent) {
        perm_names = ele.perm_name
        if (ele.child) {
          ele.child.push(item)
        } else {
          ele.child = []
          ele.child.push(item)
        }
      } else {
        if (ele.child && ele.child.length > 0) {
          perm_names = this.treeloop(ele.child, item)
        }
      }
    })

    return perm_names
  }
  nextFilter(indexes) {
    let newArr = JSON.parse(JSON.stringify(indexes))
    newArr = indexes.filter((item) => {
      let perm_names = this.treeloop(tree, item)
      return perm_names !== item.parent
    })
    if (newArr && newArr.length > 0) {
      this.nextFilter(newArr)
    }
  }

  treeFormart(arrs) {
    let indexes = arrs.filter((item) => {
      if (item.parent === "") {
        tree.push(item)
      }
      return !(item.parent === "")
    })
    this.nextFilter(indexes)
    return tree

  }

  titleRender(item, index) {
    let kes = item.required_auth.keys ? item.required_auth.keys : [],
      accounts = item.required_auth.accounts ? item.required_auth.accounts : []
    return item ? <div className="som" key={index} style={item.parent === "" ? { float: "left" } : {}}>
      <div>{item.perm_name} </div>
      <div className="keybox">
        {kes.map((item1, index1) => {
          return <div key={index1} > <span><span className="yaoshi"></span>{item1.key}</span> <span>{item1.weight}/{item.required_auth.threshold}<span>(权重/阈值)</span></span></div>
        })
        }
        {accounts.map((item1, index1) => {
          return <div key={index1} > <span><span className="yaoshi"></span>{item1.permission.actor + "(" + item1.permission.permission + ")"}</span> <span>{item1.weight}/{item.required_auth.threshold}<span>(权重/阈值)</span></span></div>
        })
        }
      </div>
    </div> : null
  }
  
  renderTree = jsonTree => jsonTree.map( (value, index)=> {
        if(value.child){
            return(
                <TreeNode title={
                	this.titleRender(value,index)
                } key={value.parent + value.perm_name}>
                    {this.renderTree(value.child)}  
                </TreeNode>       
            )
        }else{
          return(
            <TreeNode title={
              this.titleRender(value,index)
            } key={value.parent + index}>
            </TreeNode>       
          )
        }    
	 })



  render() {
    let payload1 = {
      permissions: []
    }

    if (this.props.accountdetail) {
      payload1 = this.props.accountdetail.data.payload1 ? this.props.accountdetail.data.payload1 : { permissions: [] }
    }
    let arrn = JSON.parse(JSON.stringify(payload1.permissions))
    tree = []
    let treeDatas = this.treeFormart(arrn)

    return (
      <WalletTemplate history={this.props.history}>
        <div className="AccountdetailPage container">
          <Accountdetail />
          <div >
            <div className={(this.state.panelIsshow ? "hides" : "shows") + " animatediv"}>
              <div className="borders">
              <Tree showLine  >
                  {this.renderTree(tree)}
              </Tree> 
              </div>
            </div>
            <div className="default" onClick={() => this.powerful(this.state.panelIsshow)}>
              {!this.state.panelIsshow ? "隐藏权限" : "显示权限"}
              {/* <Icon type={!this.state.panelIsshow ? "down" : "right"} /> */}
            </div>
          </div>


          <div className="panel panel-default">
            <div className="panel-body">
              <AccountdetailTabs history={this.props.history} />
            </div>
          </div>


        </div>


      </WalletTemplate>
    );
  }
}





export default connect(({ accountdetail }) => accountdetail)(AccountdetailPage);
