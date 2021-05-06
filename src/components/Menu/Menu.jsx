import React, {
  Component
} from 'react'
import {
  connect
} from 'react-redux'
import './Menu.scss'
import {
  Link
} from 'react-router-dom';
import {
  showQcode,
  hideQcode,
  setIsDappPay
} from 'reducers/qcode'
import {
  setIsConnectScatter,
  fetchBlance,
  setAccount,
  fetchAccount
} from 'reducers/scatters'
import {
  connectScatter,
  EpScatter,
  transactOptEosr, 
  lcnOnSubmit
} from 'services/lcnjs'
import QRCode from 'qrcode.react';
import {
  Menu,
  Button,
  message,
  Modal,
  Switch,
  Input
} from 'antd';
import {
  MenuFoldOutlined,
  PieChartOutlined,
  DesktopOutlined,
  ContainerOutlined,
  MailOutlined,
} from '@ant-design/icons';


class ScatterMenu extends React.Component {
  state = {
    defaultSelectedKeys: '',
    showQcode: false,
    account: ''
  };
  componentWillMount() {
    let {
      data: {
        isDappPay
      }
    } = this.props.Qcode
    let {
      data: {
        isConnectScatter
      }
    } = this.props.Scatter
    let router = window.location.hash.substring(2)
    this.setState({
      defaultSelectedKeys: router,
    })
    if (!isConnectScatter) {
      connectScatter((error, api) => {
        this.props.setIsConnectScatter(true)
        if (!error) {
          window.eosr = {}
          message.error('对不起 ' + api)
        } else {
          this.setState({
            account: window.account
          })
          this.props.setAccount( window.account)
          this.props.fetchAccount(window.account)
          this.props.fetchBlance(window.account)
          message.success('连接钱包成功')
        }

        window.eosr.transacts = async (transaction, cfg, isQcode) => {
          console.log(cfg, isQcode)
          try {
            if (!isQcode) {
              if (window.eosr) {
                return window.eosr.transact(transaction, cfg)
              }
            } else {
              if (window.account && window.accoun != "") {
                let data = {
                  type: 1,
                  data: {
                    chainId: window.accountInfo ? window.accountInfo.chain_id : 'b1b39c2a44631f8a914564f652b02fa37f1dce7004f3abce34f8ee57956f363d',
                    actions: transaction.actions
                  }
                }
                let codes = JSON.stringify(data) + ''
                let codearr = codes.split('')
                codes = codearr.join('')
                this.props.showQcode(codes)
                return Promise.resolve(true)
              } else {
                return Promise.reject('请输入账户名')
              }

            }
          } catch (error) {
            return Promise.reject(error)
          }
        }


      })
    } else {

    }



  }
  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };


  async isDappPay(key) {
    window.isDappPay = !key

    this.props.setIsDappPay(key)
    console.log('window.isDappPay', window.isDappPay)

    if (!key) {
      if (window.scatter) {
        window.accountInfo = await EpScatter.getInfo()
        if (window.accountInfo) {
          window.account = window.accountInfo.account
          this.props.fetchBlance(window.account)
        this.props.setAccount(window.account)
        this.props.fetchAccount(window.account)
          this.setState({
            account: window.account
          })
        }
      } else {
        message.error('您没有安装钱包或钱包异常')
      }

    } else {
      message.info('请在输入框内输入账户名，以便您的后续操作')

    }

  }

  accountChange(e) {
    clearTimeout(window.accountId)

    e.persist()
    window.accountId = setTimeout(() => {
      window.account = e.target.value
      if (window.account != '') {
        console.log(e.target.value)
        this.props.fetchBlance(window.account)
        this.props.setAccount(window.account)
        this.props.fetchAccount(window.account)
      }
    }, 600)

  }

  render() {
    let {
      data: {
        showQcode,
        codeStr,
        isDappPay
      }
    } = this.props.Qcode
    let{
      data:{
        menuAccount
      }
    } = this.props.Scatter
    window.account = menuAccount
    return (
      <div>
        <div className="container menu-choose">
          {!isDappPay ? <span> {window.account ? '当前用户:' + window.account + '  ' : '当前无账户'}</span> :
            <Input defaultValue={menuAccount} placeholder='请输入当前用户' onChange={_ => this.accountChange(_)} />
          }
          <Switch checkedChildren="扫码签名" unCheckedChildren="钱包签名" defaultChecked={isDappPay} onChange={_ => this.isDappPay(_)} />
        </div>

        <Menu
          defaultSelectedKeys={this.state.defaultSelectedKeys}
          mode="horizontal"
          theme="dark"
          className="container smenus"
        >
          <Menu.Item key="accountMng">
            <PieChartOutlined />
            <Link to={`/accountMng`} >账户管理</Link>
          </Menu.Item>
          <Menu.Item key="coinMng" >
            <DesktopOutlined />
            <Link to={`/coinMng`} >代币管理</Link>
          </Menu.Item>
          <Menu.Item key="srcMng">
            <ContainerOutlined />
            <Link to={`/srcMng`} >资源管理</Link>
          </Menu.Item>
          <Menu.Item key="MinersMng">
            <MailOutlined />
            <Link to={`/MinersMng`} >矿工管理</Link>
          </Menu.Item>
          <Menu.Item key="contractMng">
            <MenuFoldOutlined />
            <Link to={`/contractMng`} >合约管理</Link>
          </Menu.Item>
        </Menu>
        <Modal
          title="手机Dapp提交"
          visible={showQcode}
          // onOk={this.handleOk}
          onCancel={this.props.hideQcode}
        >
          <QRCode
            value={codeStr}  //value参数为生成二维码的链接
            size={200} //二维码的宽高尺寸
            fgColor="#000000"  //二维码的颜色

          />
        </Modal>
      </div>
    );
  }
}

export default connect(({
  Qcode,
  Scatter
}) => ({
  Qcode,
  Scatter
}), {
  showQcode,
  hideQcode,
  setIsDappPay,
  setIsConnectScatter,
  fetchBlance,
  setAccount,
  fetchAccount
})(ScatterMenu)
