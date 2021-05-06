import React, { useEffect } from 'react';

import { connect } from 'react-redux';
import './ProductionNode.scss'
import { Col, Form, FormGroup, Label } from 'reactstrap';

import isObjectEmpty from 'helpers/is-object-empty';
import { fetchStart } from './ProductionNodeReducer';

import { LoadingSpinner } from 'components';
import { ErrorButton } from 'styled';
import locationdict from "./locationdict"
import {Button} from "antd"
import { from } from 'rxjs';
const ProductionNode = (props) => {

  useEffect(()=>{
    props.fetchStart();

  },[])

  // let { blockchainInfo: { isFetching, data }} = props;
  let isFetching=false,
  error=false
  // let { payload = {}, error } = data;
  

 const {ProductionNodeReducer:{data:{payload}}} = props
 let arr =[]
 if (payload.rows) {
   
   arr = payload.rows.reverse()
 }


  return (
    <div >
      { error ?
        <>
          {!isObjectEmpty(error) && <p className="text-danger">{JSON.stringify(error)}</p>}
          <ErrorButton onClick={props.fetchStart}>连接错误 点击重连</ErrorButton>
        </>
      : isFetching ? (
        <LoadingSpinner />
      ) : (
       <div className='node-box'>
         <Button>11111</Button>
         <div className='table-title'>
           <div className="table-th">排名</div>
           <div className="table-th">节点账号</div>
           <div className="table-th">位置</div>
           <div className="table-th">状态</div>
           <div className="table-th">总票数</div>
           <div className="table-th">每日奖励</div>
         </div>
         { arr.map((item,index)=>{
           return <div className="table-tr" key={index}>
                    <div className="table-td">{index+1+'.'}</div>
                    <div className="table-td">{item.owner}</div>
                    <div className="table-td">{locationdict[item.location]}</div>
                    <div className="table-td">{item.is_active == 1 ? "当选节点":"正在生产"}</div>
                    <div className="table-td">{item.total_votes.split(".")[0]}</div>
                    <div className="table-td">{item.unpaid_blocks}</div>
                  </div>
           
         })}
       </div>
        
      )}
    </ div>
  );
}

export default connect(
  ({ProductionNodeReducer }) => ({
    ProductionNodeReducer
  }),
  {
    fetchStart,
  }

)(ProductionNode);
