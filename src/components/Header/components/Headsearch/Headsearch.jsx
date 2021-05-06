import React, { useEffect } from 'react';

import { connect } from 'react-redux';
import "./Headsearch.scss"
import { Input } from "antd"
// import Icon from '@ant-design/icons';
import { Link } from "react-router-dom"
import { fetchStart, fetchActionsTraces, fetchTotalEos, fetchTotalNet, fetchStartTime, fetchAAA, fetchActionsTracesActive, fetchDict } from './HeadsearchReducer'
import { fetchStart as searchAccount, fetchBalanceStart as getAccount, fetchProducer, setCurrentAccount, pubKeyAccount, hideAccount } from "pages/AccountdetailPage/components/AccountDetail/AccountdetailReducer.js"
import { fetchBlockDetail, fetchHashReset } from "pages/BlockdetailPage/components/Blockdetail/BlockdetailReducer"
import { fetchgetactionsStart, fetchDetail } from "pages/TransactionQueryPage/components/TransactionDetail/TransactionDetailReducer"
import { fetchgetactionsStart as getBlockActionsStart } from "pages/BlockdetailPage/components/Blockdetails/BlockdetailsReducer"
import { setSearch } from "reducers/headblock"
const { Search } = Input;


const Headsearch = (props) => {

  useEffect(() => {
    // props.fetchStart();
    props.fetchProducer();
    props.fetchTotalEos()
    props.fetchTotalNet();
    props.fetchStartTime();
    props.fetchAAA()
    props.fetchDict()
  }, [])



  let { pathname } = props.location
  const search = (val, path) => {
    let params = val.replace(/^\s+|\s+$/g, "")
    if (params) {
      if (params.length > 12) {

        if (params.indexOf("AAA") === 0) {
          //公钥

          props.setSearch(params)
          props.pubKeyAccount(params)

          return props.history.push("/account/" + params)

        } else {
          //交易哈希
          props.setSearch(params)
          window.hash = params
          if (pathname != "/transactionQuery") {
            return props.history.push("/transactionQuery/" + params)
          } else {
            props.fetchDetail({ id: params })
          }
        }

      } else
        if (params.length == 12) {
          //账户名字
          props.setCurrentAccount(params)
          props.setSearch(params)
          if (pathname != "/account") {

            return props.history.push("/account/" + params)
          } else {
            props.getAccount(params)
            props.hideAccount()
            props.fetchActionsTraces({ authorized: params })
            props.fetchActionsTracesActive({ contract: params })
          }
        } else
          if (params.length < 12) {

            if (/^[0-9]+$/.test(params)) {
              //区块儿 block 详情

              props.setSearch(params)
              if (pathname != "/blockdetail") {
                return props.history.push("/blockdetail/" + params)
              }
            } else {
              //账户详情
              props.setCurrentAccount(params)
              let params1 = params.toLocaleLowerCase()
              props.setSearch(params1)
              props.fetchProducer()
              if (pathname != "/account") {
                props.getAccount(params)
                props.hideAccount()
                props.fetchActionsTraces({ authorized: params1 })
                props.fetchActionsTracesActive({ contract: params1 })
                return props.history.push("/account/" + params1)

              } else {

                // props.getAccount(params)
                // props.hideAccount()
                // props.fetchActionsTraces({ authorized: params1 })
                // props.fetchActionsTracesActive({ contract: params1 })
              }
            }
          }
    }

  }

  return (
    <div className="searchbox ">
      <div className="searchtitle">
        {/* <Icon type="search" style={{ color: "#5fccff", fontSize: "1rem" }} /> */}

        <span className="default">查询</span>
        {/* <Link to={`/`} >查询</Link> */}
        <Link to={`/account`}>账号,</Link>
        <Link to={`/transactionQuery`} >交易, </Link>
        <Link to={`/`} >区块</Link>
        <Link to={`/queryActions`} >操作</Link>


      </div>
      <div className="searchline">
        {/* <Icon type="right" style={{ color: "#cbd7e8", fontSize: "1.2rem", marginLeft: "-4.5px" }} /> */}
        <Search onSearch={val => search(val, pathname)}

          id="search"
          defaultValue={typeof props.Headsearch.data.payload == "string" ? props.Headsearch.data.payload : ""}
          type="text" size="large" placeholder="输入账号/公钥/交易哈希/区块编号"
          enterButton={false} />
      </div>

    </div>
  );
}

export default connect(
  ({ router: { location }, Headsearch, router }) => ({
    location,
    Headsearch,
    router
  }),
  {
    searchAccount,
    fetchgetactionsStart,
    fetchBlockDetail,
    fetchStart,
    getAccount,
    fetchActionsTraces,
    fetchProducer,
    getBlockActionsStart,
    fetchTotalEos,
    fetchTotalNet,
    pubKeyAccount,
    setSearch,
    fetchStartTime,
    fetchAAA,
    setCurrentAccount,
    fetchDetail,
    fetchActionsTracesActive,
    hideAccount,
    fetchHashReset,
    fetchDict
  }

)(Headsearch);
