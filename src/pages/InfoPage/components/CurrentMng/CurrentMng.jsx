import React from 'react';

import { connect } from 'react-redux';
import { Table, Popconfirm } from "antd"
import { fetchDetail } from '../BlockchainInfo/BlockchainInfoReducer'
import {
  LoadingOutlined,
} from '@ant-design/icons';
import './CurrentMng.scss'
const Headblock = (props) => {

  // useEffect(()=>{
  //   return () => { props.pollingStop() }
  // }, [])
  const showDetails = (rows) => {
    let data = {
      code: rows.ncontract,
      scope: rows.unit
    }
    props.fetchDetail(data)
  }
  const { blockchainInfo: { data: { currentMng, detailIsFetch, detail } } } = props;
  let dataMng = currentMng ? currentMng.map((item, index) => {
    item.accuracy = item.sym.substring(0, 1) + "位"
    item.unit = item.sym.substring(2)
    item.key = index
    item.rows = item
    item.ncontract = item.ncontract.replace(/eosio/g, "*****")
    item.issuer = item.issuer.replace(/eosio/g, "*****")

    return item
  }) : []
  const columns = [
    {
      title: '合约',
      dataIndex: 'ncontract',
      key: 'ncontract',
    },
    {
      title: '代号',
      dataIndex: 'unit',
      key: 'unit',
    },
    {
      title: '精度',
      dataIndex: 'accuracy',
      key: 'accuracy',
    },
    {
      title: '发行者',
      dataIndex: 'issuer',
      key: 'issuer',
    },

    {
      title: '评级',
      dataIndex: 'userrating',
      key: 'userrating',
    },
    {
      title: '详情',
      dataIndex: 'rows',
      key: 'rows',
      render: (rows, arg) => {
        const titles = !detailIsFetch ? <div>{detail.map(item =>
          <div className='detaild'>
            <div className='detaildmax'>
              <span>最大发行量：</span>
              <span>{item.max_supply}</span>
            </div>
            <div className='detaild'>
              <span>当前发行量：</span>
              <span>{item.supply}</span>
            </div>
          </div>
        )}</div> : <LoadingOutlined />
        return (<Popconfirm
          title={titles}
          cancelText='关闭'
          okText='确认'
        >
          <span className='detailds' onClick={_ => showDetails(arg)}>详情</span>
        </Popconfirm>
        )
      }
    }
  ];
  return (
    <Table dataSource={dataMng} columns={columns} />

  );
}

export default connect(
  ({ infoPage: { blockchainInfo } }) => ({
    blockchainInfo
  }),
  {
    fetchDetail
  }

)(Headblock);
