import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Accountdetail.scss'
import { fetchBalanceStart, fetchBalanceStart as fetchaccount, pubKeyAccount, hideAccount } from './AccountdetailReducer';
import ReactEcharts from 'echarts-for-react';
import { Progress } from "antd"
import { fetchActionsTraces, fetchActionsTracesActive, fetchTransfers } from 'components/Header/components/Headsearch/HeadsearchReducer'
// import { fetchStart as Abidescribe } from 'pages/Abidescribe/AbidescribeReducer'
import { formartBalance } from "helpers/formartBalance"
import "./icon/iconfont.css"
import moment from "moment"
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


class Accountdetail extends Component {

  componentDidMount() {
    let urlValues = window.location.hash.split("/");
    let name = urlValues[2]
    if (name.length < 13) {
      this.props.hideAccount()
      this.props.fetchaccount(name)
      this.props.fetchActionsTraces({ authorized: name })
      this.props.fetchActionsTracesActive({ contract: name })
      // this.props.Abidescribe(name)
    } else {
      this.props.pubKeyAccount(name)
    }
  }
  searchs = (name) => {
    this.props.fetchaccount(name)
    this.props.fetchActionsTraces({ authorized: name })
    this.props.fetchTransfers({ account: name })
    // this.props.Abidescribe(name)
  }

  searches = (name) => {

    // setTimeout(() => {
    this.props.fetchaccount(name)
    this.props.fetchActionsTraces({ authorized: name })
    this.props.fetchTransfers({ account: name })
    this.props.fetchActionsTracesActive({ contract: name })
    // this.props.Abidescribe(name)
    // })
  }

  render() {

    let { accountdetail: { accountdetail: { data: { payload1, pubKeys, balance, accountError, hasAbi, ye, showAccount } } } } = this.props
    let assets = balance != undefined ? formartBalance(balance.rows) : false
    let seise = []
    const option1 = payload1 && payload1.cpu_limit ? {
      title: {
        text: `运算资源总量  \n${payload1.cpu_limit.max} ms
      \n\n可用量  \n ${parseFloat(payload1.cpu_limit.available) + "ms"}`,
        textAlign: 'auto',
        textStyle: {
          fontSize: 16,
          fontWeight: 'normal',
          color: "#999"
        }
      },
      series: [{
        name: '已抵押',
        type: 'pie',
        radius: ['40%', '90%'],
        itemStyle: {
          normal: {
            color: function (params) {
              var colorList = [
                'rgba(183,218,252,1)', 'rgba(183,218,252,.6)', '#FCCE10', '#E87C25', '#27727B',
              ];
              return colorList[params.dataIndex]
            },
            label: {
              show: true,
              position: 'top',
              formatter: '{b}'
            }
          }
        },
        avoidLabelOverlap: false,
        roseType: true,
        label: {
          normal: {
            show: true,
            position: 'center',
            textStyle: {
              fontSize: '24',
              fontWeight: 700,
              color: 'green'
            }
          },
          emphasis: {
            show: true,
            textStyle: {
              fontSize: '60',
              fontWeight: 700
            }
          },
        },
        data: [
          { value: parseFloat(payload1.cpu_limit.available), name: '' },
          {
            value: parseFloat(payload1.cpu_limit.used),
            name: `${(parseFloat(payload1.cpu_limit.available) / parseFloat(payload1.cpu_limit.max) * 100 + "").substring(0, 4)}%`
          }
        ]
      }
      ]
    } : {};

    const option = payload1 && payload1.net_limit ? {
      title: {
        text: `网络资源总量  \n${payload1.net_limit.max} bytes
      \n\n可用量  \n ${parseFloat(payload1.net_limit.available) + " bytes"}`,
        textAlign: 'auto',
        textStyle: {
          fontSize: 16,
          fontWeight: 'normal',
          color: "#999"
        }
      },
      series: [{
        name: '已抵押',
        type: 'pie',
        radius: ['40%', '90%'],
        itemStyle: {
          normal: {
            color: function (params) {
              var colorList = [
                'rgba(252,192,143,1)', 'rgba(252,192,143,.6)', '#FCCE10', '#E87C25', '#27727B',
              ];
              return colorList[params.dataIndex]
            },
            label: {
              show: true,
              position: 'top',
              formatter: '{b}'
            }
          }
        },
        avoidLabelOverlap: false,
        roseType: true,
        label: {
          normal: {
            show: true,
            position: 'center',
            textStyle: {
              fontSize: '24',
              fontWeight: 700,
              color: 'blue'
            }
          },
          emphasis: {
            show: true,
            textStyle: {
              fontSize: '60',
              fontWeight: 700
            }
          },
          align: "center"
        },
        data: [
          { value: parseFloat(payload1.net_limit.available), name: '' },
          {
            value: parseFloat(payload1.net_limit.used),
            name: `${(payload1.net_limit.max == 0 ? parseFloat(payload1.net_limit.available) / parseFloat(payload1.net_limit.max) * 100 + "" : 0 + "").substring(0, 4)}%`
          }
        ]
      }
      ]
    } : {};
    let app = {}
    var posList = [
      'left', 'right', 'top', 'bottom',
      'inside',
      'insideTop', 'insideLeft', 'insideRight', 'insideBottom',
      'insideTopLeft', 'insideTopRight', 'insideBottomLeft', 'insideBottomRight'
    ];
    app.configParameters = {
      rotate: {
        min: -90,
        max: 90
      },
      align: {
        options: {
          left: 'left',
          center: 'center',
          right: 'right'
        }
      },
      verticalAlign: {
        options: {
          top: 'top',
          middle: 'middle',
          bottom: 'bottom'
        }
      },
      distance: {
        min: 0,
        max: 100
      }
    };

    app.config = {
      rotate: 90,
      align: 'left',
      verticalAlign: 'middle',
      position: 'insideBottom',
      distance: 15,
      onChange: function () {
        var labelOption = {
          normal: {
            rotate: app.config.rotate,
            align: app.config.align,
            verticalAlign: app.config.verticalAlign,
            position: app.config.position,
            distance: app.config.distance
          }
        };
      }
    };
    var labelOption = {
      normal: {
        show: true,
        formatter: '{c}  ',
        fontSize: 12,
        rich: {}
      }
    };

    let lengeds = {}
    let arrsy = balance ? balance.rows : []
    arrsy.forEach(ele => {
      Object.keys(ele).map((el) => {
        if (lengeds[el] === undefined) {
          lengeds[el] = []
          // lengeds[el].push(parseFloat(ele[el]).toFixed(1))
          lengeds[el].push(parseInt(ele[el]))

        } else {
          // lengeds[el].push(parseFloat(ele[el]).toFixed(1))
          lengeds[el].push(parseInt(ele[el]))

        }
      })
    });
    Object.keys(lengeds).map((item) => {
      let osb = {
        name: item,
        type: 'bar',
        label: labelOption,
        barMaxWidth: "20px",
        data: lengeds[item]
      }
      seise.push(osb)
    })

    let resouceOption = {

      color: ['#003366', '#006699', '#4cabce', '#e5323e'],
      xAxis: [
        {
          type: 'category',
          axisTick: { show: false },
          data: Object.keys(assets)
        }
      ],
      legend: {
        data: lengeds
      },
      yAxis: [{
        type: 'value'
      }],
      series: seise

    };


    const abiClass = hasAbi.abi ? "icon iconfont icon-gaiicon- heyue1" : "icon iconfont icon-gaiicon- heyue2"
    return (
      <div >{showAccount ?
        <div className="panel panel-default">
          <div className="panel-body">
            {pubKeys != undefined ? <div className='pubbox'>
              {pubKeys.map((item, index) => {
                return <span onClick={_ => this.searches(item.account)} className='btn btn-default btn-small' key={index}>
                  {index == 0 ? <span onClick={_ => this.searches(item.account)}></span> : null}
                  <span className="currorPoint" >{item.account}</span>({item.permission})</span>
              })
              }
            </div> : null}
          </div>
        </div> : null}
        {payload1 === undefined ?
          // <LoadingSpinner />
          '错误  用户不存在:' + JSON.stringify(accountError)
          : (
            <div>
              <div className="panel panel-default">
                <div className="panel-body">
                  <div className="Accountdetail">
                    <div className="flex-box-c ">
                      <div className="flex-box lg-box">
                        <div className="value">账户名 :</div>
                        <div className="users ">
                          <span>{payload1 && payload1.account_name.replace(/eosio/g, "***")}</span>
                          {/* <span><object type="image/svg+xml" data={payload1 && payload1.lock ? "./icon/lock.svg" : "./icon/unlock.svg"} class={payload1 && payload1.lock ? "lock" : "unlock"}></object></span>
                        <span><object type="image/svg+xml" data="./icon/heyue.svg" class={hasAbi.abi ? "abi" : "no-abi"}></object></span> */}
                          <i title={hasAbi.abi ? "合约账号" : "非合约账号"} className={abiClass} />
                          <i title={payload1 && payload1.lock ? "已经锁定" : "未锁定"} className={"" + payload1 && payload1.lock ? "icon iconfont icon-lock" : "icon iconfont icon-unlock"} />
                        </div>
                      </div>
                    </div>
                    <div className="flex-box-c ">
                      <div className="flex-box createby">
                        账户创建于  {payload1 && moment(payload1.created).add(8, 'H').format("YYYY-MM-DD HH:mm:ss")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="panel panel-default">
                <div className="panel-body">
                  <div className="Accountdetail">
                    <div className="flex-box flex-grow">
                      <div className="value">总余额:</div>
                      <div className="keys font-fangzheng">{ye && ye.rows && ye.rows.length > 0 ? formatNumber(ye.rows[0].balance) : "0.0000 AAA"} </div>
                    </div>
                    <div className="flex-box flex-grow">
                      <div className="flex-box lineHeight20 flex-grow">
                        <div className="value">抵押量:</div>
                        <div className="keys">{ye && ye.rows && ye.rows.length > 0 ? formatNumber(ye.rows[0].deposit) : 0}</div>
                      </div>
                      <div className="flex-box lineHeight20 flex-grow">
                        <div className="value">待退还额:</div>
                        <div className="keys">{payload1 && payload1.refund_request ? formatNumber(payload1.refund_request.amount) : "0"}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="panel panel-default">
                <div className="panel-body">
                  <div className="Accountdetail">
                    <div className="  " style={{ flexBasis: "65%" }}>
                      <div className="title">当前资源购买，抵押情况:</div>

                      {seise.length > 0 ? <ReactEcharts
                        option={resouceOption}
                        style={{ height: '330px', width: '100%' }}
                        notMerge={true}
                        lazyUpdate={true}
                        theme={"theme_name"}
                      /> : null}
                    </div>

                    <div className="flex-box ecbox" style={{ flexBasis: "35%" }}>
                      <div className="flex-box-lg " style={{ width: "100%" }}>
                        <div className="title">当前可用资源情况：</div>

                        <div className="flex-box progressbox">
                          <div className="value">Ram使用情况:</div>
                          <Progress
                            strokeColor={{
                              '0%': '#108ee9',
                              '100%': '#87d068',
                            }}
                            percent={parseFloat((parseInt(payload1.ram_usage) * 100 / parseInt(payload1.ram_quota)))}
                          />
                          <span className="numbers">
                            {payload1 ? (parseInt(payload1.ram_usage) + " / " + parseInt(payload1.ram_quota)) : null}
                          </span>
                        </div>
                        {<div className="" >

                          {payload1 ? <ReactEcharts
                            option={option}
                            style={{ height: '130px', width: '100%' }}
                            notMerge={true}
                            lazyUpdate={true}
                            theme={"theme_name"}
                          /> : null}

                          {payload1 ? <ReactEcharts
                            option={option1}
                            style={{ height: '130px', width: '100%' }}
                            notMerge={true}
                            lazyUpdate={true}
                            theme={"theme_name"}
                          /> : null}
                        </div>
                        }
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
}

export default connect(
  ({ accountdetail, Headsearch, router }) => ({
    accountdetail,
    Headsearch,
    router
  }),
  {
    fetchBalanceStart,
    fetchActionsTraces,
    fetchaccount,
    pubKeyAccount,
    hideAccount,
    fetchTransfers,
    fetchActionsTracesActive
  }

)(Accountdetail);
