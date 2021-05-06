import React, { useEffect } from 'react';

import { connect } from 'react-redux';
import './BlockchainInfo.scss'
import { fetchStart, fetchResouse, fetchTransactionTraces } from './BlockchainInfoReducer';
import { fetchActionsTracesActive as fetchTransactions } from 'components/Header/components/Headsearch/HeadsearchReducer'
import { LoadingSpinner } from 'components';
import { ErrorButton } from 'styled';
import ReactEcharts from 'echarts-for-react';
import { Progress } from "antd"
// import loadsh from 'lodash'
import cloneDeep from 'lodash/cloneDeep'
import moment from "moment"

function creatEchartsOPt(name, colors, values) {
  let opt = {
    title: {
      text: name,
      textAlign: 'auto',
      textStyle: {
        fontSize: 16,
        fontWeight: 'normal'
      }
    },
    color: colors ? colors : [
      '#FCCE10', '#E87C25', '#27727B',
    ],
    series: [{
      name: '',
      type: 'pie',
      radius: ['40%', '90%'],

      itemStyle: {

        normal: {

          //  function (params) {
          //   var colorList = colors ? colors:[
          //      '#FCCE10', '#E87C25', '#27727B',
          //   ];
          //   return colorList[params.dataIndex]
          // },
          label: {
            show: false,
            position: 'top',
            formatter: '{b}'

          }

        }

      },
      // avoidLabelOverlap: false,
      // roseType: true,
      label: {
        normal: {
          show: true,
          position: 'inner',
          textStyle: {
            fontSize: '12',
            // fontWeight: 700,
            color: '#666'
          }
        },
        emphasis: {
          show: true,
          textStyle: {
            fontSize: '18',
            color: "#333",
            background: "#fff"
            // fontWeight: 700
          }
        },

        align: "center"
      },
      data: values ? values : []
    }
    ]
  };

  return cloneDeep(opt)
}

function formatNumber(value) {
  value += '';
  const list = value.split('.');
  const prefix = list[0].charAt(0) === '-' ? '-' : '';
  let num = prefix ? list[0].slice(1) : list[0];
  let result = '';
  while (num.length > 3) {
    result = `,${num.slice(-3)}${result}`;
    num = num.slice(0, num.length - 3);
  }
  if (num) {
    result = num + result;
  }
  return `${prefix}${result}${list[1] ? `.${list[1]}` : ''}`;
}


const BlockchainInfo = (props) => {
  let {  headblock, Headsearch, blockchainInfo={},lastblockinfo:{data} } = props;
  let HeadsearchData = Headsearch.data ? Headsearch.data : {}
  let  { totalNet, creatTime, AAA } = HeadsearchData
  let blockchainInfoData = blockchainInfo.data? blockchainInfo.data : {}
  let { resCPU, resNET, resPDV, payload = {} } = blockchainInfoData
  totalNet = totalNet ? totalNet : {}
  let getblock = data.payload
  let infopages = headblock.data.payload
  useEffect(() => {
    props.fetchStart();
    props.fetchResouse()
    props.fetchTransactions()
    // props.fetchTransactionTraces()
  }, [])

  let chainCreatTime = creatTime ? moment(creatTime.created).add(8, 'H').format("YYYY-MM-DD HH:mm:ss") : ""
  let optData = [],
    opt1Data = [],
    datalist = [],
    res = 0
  if (totalNet) {
    optData.push({ name: "网络已用量\n\n\n" + totalNet.max_transaction_net_usage, value: parseInt(totalNet.max_transaction_net_usage) })
    optData.push({ name: "网络可用量\n" + (parseInt(totalNet.max_block_net_usage) - parseInt(totalNet.max_transaction_net_usage)), value: parseInt(totalNet.max_block_net_usage) - parseInt(totalNet.max_transaction_net_usage) })
    opt1Data.push({ name: "\n\n\n内存已用量\n" + totalNet.total_ram_bytes_reserved + " bytes \n", value: parseInt(totalNet.total_ram_bytes_reserved) })
    opt1Data.push({ name: "内存可用量\n" + (parseInt(totalNet.max_ram_size) - parseInt(totalNet.total_ram_bytes_reserved)) + " bytes", value: parseInt(totalNet.max_ram_size) - parseInt(totalNet.total_ram_bytes_reserved) })
  }
  if (resCPU) {
    datalist.push({ name: "运算资源" + resCPU.rows[0].supply + "\n\n", value: parseFloat(resCPU.rows[0].supply) })
    res += parseFloat(resCPU.rows[0].supply)
  }
  if (resNET) {
    datalist.push({ name: "\n网络资源" + resNET.rows[0].supply, value: parseFloat(resNET.rows[0].supply) })
    res += parseFloat(resNET.rows[0].supply)
  }
  if (resPDV) {
    datalist.push({ name: "PDV资源" + resPDV.rows[0].supply, value: parseFloat(resPDV.rows[0].supply) })
    res += parseFloat(resPDV.rows[0].supply)
  }
  if (AAA) {
    datalist.push({ name: "\n\n\n\n活跃额度\n" + (parseFloat(AAA.supply) - res + " AAA"), value: parseFloat(AAA.supply) - res })

  }
  // const opt = creatEchartsOPt("网络使用量\n总量：" +totalNet.max_block_net_usage, , optData)
  const opt1 = creatEchartsOPt("当前内存使用情况 " + totalNet.max_ram_size + " bytes", ['rgba(205,122,255,1)', 'rgba(205,122,255,.6)'], opt1Data)
  const optRes = creatEchartsOPt("当前资源\n抵押情况\n" + parseInt(res) + "\nAAA", ["#ffff99", "#8ee3a0", "#ff6633"], datalist)
  return (
    <div >
      {false ?
        <div>
          {/* {!isObjectEmpty(error) && <p className="text-danger">{JSON.stringify(error)}</p>} */}
          <ErrorButton onClick={props.fetchStart}>连接错误 点击重连</ErrorButton>
        </div>
        : false ? (
          <LoadingSpinner />
        ) : (
            <div className="">
              <div className="panel panel-default">
                <div className="panel-body">
                  <div className="content-box">
                    <div className="flex-box-c ">
                      <div className="flex-box lg-box">
                        <div className="value" style={{ maxWidth: "157px", minWidth: "157px" }}>链ID:</div>
                        <div className="keys color0052a3" style={{ fontSize: "14px !important", wordBreak: "break-all", lineHeight: "30px", }}>{payload && payload.chain_id}</div>
                      </div>

                      <div className="flex-box">
                        <div className="flex-box lg-box flex-grow" style={{ flexBasis: '50%' }}>
                          <div className="value">启动时间:</div>
                          <div className="keys startiems" >{chainCreatTime}</div>
                        </div>
                        <div className="flex-box lg-box flex-grow" style={{ flexBasis: '50%' }}>
                          <div className="value">服务器版本:</div>
                          <div className="keys  ">{payload && payload.server_version_string}</div>
                        </div>
                      </div>

                      <div className="flex-box" style={{ border: "none !important" }}>
                        <div className="flex-box lg-box flex-grow">
                          <div className="value">AAA最大发行量:</div>
                          <div className="keys color0052a3" style={{ fontSize: "14px !important", wordBreak: "break-all", lineHeight: "30px", }}>{AAA && formatNumber(AAA.max_supply)}</div>
                        </div>

                        <div className="flex-box lg-box flex-grow">
                          <div className="value">AAA当前发行量:</div>
                          <div className="keys color0052a3" >{AAA && formatNumber(AAA.supply)}</div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>

              <div className="panel panel-default">
                <div className="panel-body">
                  <div className="content-box">
                    <div className="flex-box-c ">

                      <div className="flex-box">
                        <div className="flex-box flex-grow" style={{ width: "50%" }}>
                          <div className="value">超级生产者最后更新时间:</div>
                          <div className="keys">
                            {totalNet && totalNet.last_producer_schedule_update ? moment(totalNet.last_producer_schedule_update).add(8, 'H').format("YYYY-MM-DD HH:mm:ss") : ""
                            }</div>
                        </div>
                        <div className="flex-box flex-grow" style={{ width: "50%" }}>
                          <div className="value">超级生产者最大数量:</div>
                          <div className="keys">{totalNet && totalNet.last_producer_schedule_size}</div>
                        </div>
                      </div>
                      <div className="flex-box ">
                        <div className="flex-box lg-box flex-grow" style={{ width: "50%" }}>
                          <div className="value">当前区块:</div>
                          <div className="keys font-fangzheng ">{getblock && formatNumber(getblock.head_block_num)}</div>
                        </div>
                        <div className="flex-box lg-box flex-grow" style={{ width: "50%" }}>
                          <div className="value">最新的不可逆区块:</div>
                          <div className="keys  font-fangzheng">{getblock && formatNumber(getblock.last_irreversible_block_num)}</div>
                        </div>
                      </div>

                      <div className="flex-box">

                        <div className="flex-box flex-grow">
                          <div className="value">当前生产节点:</div>
                          <div className="keys" style={{ textDecoration: "none" }}>{infopages.block && infopages.block.producer}</div>
                        </div>

                        <div className="flex-box flex-grow">
                          <div className="value">下一个生产节点:</div>
                          <div className="keys" style={{ textDecoration: "none" }}>{payload && payload.head_block_producer}</div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>

              <div className="panel panel-default">
                <div className="panel-body">
                  <div className="content-box">



                    <div className="flex-box-c ">
                      <div className="flex-box-lg">
                        <div className="flex-box chartbox">
                          <div style={{ width: "33.3%" }}>
                            <div className="flex-box lg-box progressbox">
                              <div className="value">当前NET负载:</div>
                              <Progress
                                strokeColor={{
                                  '0%': '#108ee9',
                                  '100%': '#87d068',
                                }}
                                percent={parseFloat((parseInt(payload.block_net_limit) * 100 / parseInt(payload.virtual_block_net_limit)).toFixed(2))}
                              />
                              <span className="numbers">
                                {parseInt(payload.block_net_limit) + " / " + parseInt(payload.virtual_block_net_limit)}
                              </span>
                            </div>
                            <div className="flex-box lg-box  progressbox">
                              <div className="value">当前CPU负载:</div>
                              <Progress
                                strokeColor={{
                                  '0%': '#108ee9',
                                  '100%': '#87d068',
                                }}
                                percent={parseFloat((parseInt(payload.block_cpu_limit) * 100 / parseInt(payload.virtual_block_cpu_limit)).toFixed(2))}
                              />
                              <span className="numbers">
                                {parseInt(payload.block_cpu_limit) + " / " + parseInt(payload.virtual_block_cpu_limit)}
                              </span>
                            </div>
                          </div>
                          <ReactEcharts
                            option={opt1}
                            style={{ height: '190px', width: '33.3%' }}
                            notMerge={true}
                            lazyUpdate={true}
                            theme={"theme_name"}
                          />
                          <ReactEcharts
                            option={optRes}
                            style={{ height: '190px', width: '33.3%' }}
                            notMerge={true}
                            lazyUpdate={true}
                            theme={"theme_name"}
                          />
                       
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              </div>


            </div>
          )}
    </ div>
  );
}

export default connect(
  ({ infoPage: { blockchainInfo }, headblock, lastblockinfo, Headsearch }) => ({
    blockchainInfo,
    headblock,
    lastblockinfo,
    Headsearch
  }),
  {
    fetchStart,
    fetchResouse,
    fetchTransactionTraces,
    fetchTransactions
  }

)(BlockchainInfo);
