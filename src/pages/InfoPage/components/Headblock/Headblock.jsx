import React from 'react';

import { connect } from 'react-redux';
import "./headblock.scss"
// import { Icon   } from "antd"



function search(params) {
  
}

const Headblock = (props) => {
  return (
    <div className="searchbox container">
      <div className="searchtitle">
        {/* <Icon type="search" style={{color:"#5fccff", fontSize: "1rem"}} />  */}
        
        <span className="default">查询</span>
        <a href="#"> 账号,</a>
        <a href="#"> 公钥, </a>
        <a href="#"> 区块</a>
      </div>
      <div className="searchline"> 
          {/* <Icon type="right" style={{color:"#cbd7e8", fontSize: "1.2rem", marginLeft:"-4.5px"}} /> */}
          <input onChange={(val)=>search(val)} type="text" size="30" placeholder ="输入账号/公钥/交易哈希/区块编号"/>
      </div>
      
    </div>
  );
}

export default connect(
  ({  }) => ({
  }),
  {
    pollingStart
  }

)(Headblock);
