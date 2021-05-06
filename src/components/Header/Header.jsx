import './Header.scss';

import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

    
import { fetchStart, fetchResouse, fetchTransactionTraces } from 'pages/InfoPage/components/BlockchainInfo/BlockchainInfoReducer';
import { fetchStart as fetchS } from 'pages/BlockdetailPage/components/Blockdetail/BlockdetailReducer';
import {fetchActionsTracesActive as fetchTransactions, fetchAAA} from 'components/Header/components/Headsearch/HeadsearchReducer'
import { panelSelect } from 'pages/PermissionPage/PermissionPageReducer';

import { fetchStart as fetchproducers } from 'pages/InfoPage/components/ProductionNode/ProductionNodeReducer';
import Headsearch from './components/Headsearch'
import {fetchStartTime} from './components/Headsearch/HeadsearchReducer'
import { connectStart } from 'reducers/endpoint';
import { Select } from 'antd';

const { Option } = Select;

function handleChange(value) {

}
const Header = (props,) => {

  let { router: { location } } = props;
  let pathname = location.hash
  const nodeosChange = (val) =>{
  }

  // window.defoultSelect = window.LocalStoreApi.get('select' )?  window.LocalStoreApi.get('select' ) :"1"
  window.defoultSelect = 1
  return (
    <div className="top">
      
      <div className="Header container">
        <Link to={`/`} >数据浏览</Link>
        <span> &nbsp;&nbsp;&nbsp;</span>
        <Link to={`/accountMng`} >操作</Link>
        <span> &nbsp;&nbsp;&nbsp;</span>
        {/* <Select defaultValue={window.defoultSelect} className="header-input" style={{minWidth:"130px"}} >
          <Option value="1" > <a onClick ={_=>nodeosChange(1)}>信链测试1.7</a></Option>
          <Option value="2"><a   onClick ={_=>nodeosChange(2)}>信链主网2.0</a></Option>
          <Option value="3"><a href="#">EOX PART网</a></Option> 
        </Select> */}

        {/* <Link to={`/Abidescribe`} >智能合约详情</Link> */}
        {/* <Select defaultValue="jack" style={{  border:"none" }} onChange={handleChange}>
          <Option value="jack"><a href="#">入门指南</a></Option>
          <Option value="lucy"><Link to={`/aaa`} >xxx</Link></Option>
          <Option value="Yiminghe"><Link to={`/`} >xxx</Link></Option>
        </Select> */}

        <Select defaultValue="jack" style={{  border:"none" }} onChange={handleChange} className="header-input">
          <Option value="jack"><a href="#">中文</a></Option>
          <Option value="lucy"><Link to={`/aaa`} >英文</Link></Option>
          <Option value="Yiminghe"><Link to={`/`} >韩文</Link></Option>
        </Select>
        {/* <Select defaultValue="jack" style={{  border:"none" }} onChange={handleChange}  className="header-input media">
          <Option value="jack"><a href="#">麒麟网</a></Option>
          <Option value="lucy"><Link to={`/aaa`} >eos官网</Link></Option>
          <Option value="Yiminghe"><Link to={`/`} >xxx网</Link></Option>
        </Select> */}
        

      </div>
     {!props.hideSearch? <div className="container">
        <Headsearch  history = { props.history }/>
      </div>:null}
        
    </div>
  )
}

export default connect(
  ({router}) => ({
    router
  }),
  {
    panelSelect,
    connectStart,
    fetchStart, 
    fetchResouse, 
    fetchTransactionTraces,
    fetchTransactions,
    fetchS,
    fetchStartTime,
    fetchAAA,
    fetchproducers
  }

)(Header);
