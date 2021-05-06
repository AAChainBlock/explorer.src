import React, { useEffect, Component } from 'react';
import { connect } from 'react-redux';
import './Blockdetails.scss'
import isObjectEmpty from 'helpers/is-object-empty';
import { fetchgetactionsStart } from './BlockdetailsReducer';
import { LoadingSpinner } from 'components';
import { ErrorButton } from 'styled';
import { fetchBlockDetail as getBlocksDetails, fetchHashReset } from "./../Blockdetail/BlockdetailReducer"
import { setSearch } from "reducers/headblock"
import { render } from 'react-dom';
import moment from "moment"

class Blockdetails extends Component  {
  constructor(props){
    super(props)

  }
  // let { Blockdetail, Blockdetail: { data: { payload, error } }, router: { location: { hash } }, headblock: { data: { search } } } = props;
  // let urlValues = window.location.hash.split("/");
  // let name = urlValues[2]


  componentDidMount(){
    let urlValues = window.location.hash.split("/");
    let name = urlValues[2]
      name = parseInt(name)
    this.props.getBlocksDetails(name)
    // this.props.fetchgetactionsStart();
  }


 freshBlock = (id) => {
    const blocks = parseInt(id)
    this.props.getBlocksDetails(blocks)
  }


render(){
  let { Blockdetail, Blockdetail: { data: { payload, error } }, router: { location: { hash } }, headblock: { data: { search } } } = this.props;
  payload = payload ? payload[0] : {}

  let isFetching = false
  return (
    <div >
      {error ?
        <>
          {!isObjectEmpty(error) && <p className="text-danger">{JSON.stringify(error)}</p>}
          <ErrorButton onClick={this.props.fetchgetactionsStart}>连接错误 点击重连</ErrorButton>
        </>
        : isFetching ? (
          <LoadingSpinner />
        ) : (
            <div className=" Blockdetails">
              <div className="flex-box-c">
                <div className="flex-box lg-box">
                  <div className="value">区块编号 :</div>
                  {payload ?
                    (<div className="keys font-fangzheng">{payload && payload.block_num}
                      <span className='' onClick={() => this.freshBlock(parseInt(payload.block_num) - 1)}>上一个</span>
                      <span className='' onClick={() => this.freshBlock(parseInt(payload.block_num) + 1)}>下一个 </span>
                    </div>
                    ) : null}
                </div>
                <div className="midbox">
                  <div className="flex-box-lg ">
                    <div className="flex-box">
                      <div className="value">创建者:</div>
                      <div className="keys ">
                        {payload && payload.block && payload.block.producer}
                      </div>
                    </div>
                    <div className="flex-box  ">
                      <div className="value">状态:</div>
                      <div className="keys ">
                        <span className="btn btn-info">不可逆</span>
                      </div>
                    </div>
                    <div className="flex-box  borderline">
                      <div className="value">区块ID:</div>
                      <div className="keys">{payload && payload.block_id}</div>
                    </div>
                    <div className="flex-box ">
                      <div className="value">区块创建时间:</div>
                      <div className="keys">{payload && payload.block && moment(payload.block.timestamp).add(8, 'H').format("YYYY-MM-DD HH:mm:ss")}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
    </ div>
  );
}
}

export default connect(
  ({ Blockdetail, router, headblock }) => ({
    router,
    Blockdetail,
    headblock
  }),
  {
    fetchgetactionsStart,
    getBlocksDetails,
    fetchHashReset,
    setSearch
  }

)(Blockdetails);
