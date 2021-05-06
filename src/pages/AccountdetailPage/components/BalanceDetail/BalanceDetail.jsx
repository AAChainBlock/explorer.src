import React, { useEffect } from 'react';

import { connect } from 'react-redux';
import './BalanceDetail.scss'
import isObjectEmpty from 'helpers/is-object-empty';
import { fetchStart } from './BalanceDetailReducer';
import { LoadingSpinner } from 'components';
import { ErrorButton } from 'styled';


const BalanceDetail = (props) => {

  useEffect(()=>{
    props.fetchStart();

  }, [])

   let  isFetching = false,error=false

 
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
  
        <div className="BalanceDetail ">

        </div>
      )}
    </ div>
  );
}

export default connect(
  ({ BalanceDetail}) => ({
    BalanceDetail
  }),
  {
    fetchStart,
  }

)(BalanceDetail);
