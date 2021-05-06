import { Form, Input, Button, Select, message } from 'antd';
import React, { Component, createRef } from 'react'
import { connect } from 'react-redux';

import './Cpu.scss'
import { rpc, Eos, transactOpt ,lcnOnSubmit } from 'services/lcnjs'
import { owner, stake_quantity, from, to, quantity, memo, quant, bytes } from './fromItem'
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};
let contract = 'eosio.res'
class Cpu extends Component {
  state = {
    img: '',
    src: "CPU",
    act: "lend",
  }
  formRef = createRef();

  onFinish = async values => {
      delete values.srcs
      delete values.acts
      let action = {
        account: contract,
        name: this.state.act,
        authorization: [{ actor: window.account, permission: "active" }],
        data: {
          ...values
        }
      }
      if (this.state.act == 'buyram') {
        if (action.data.quant && action.data.quant != "") {
          action.data.quant = parseFloat(action.data.quant).toFixed(4) + " ASDT"

        }
        action.data.payer = window.account
      } else
        if (this.state.act == 'sellram') {
          action.data.account = window.account
        } else
          if (this.state.act == 'delegate' || this.state.act == 'undelegate') {
            action.data.owner = window.account
            action.data.stake_quantity = parseFloat(action.data.stake_quantity).toFixed(4) + ' ' + this.state.src
          } else
            if (this.state.act == 'transfer' || this.state.act == 'lend' || this.state.act == 'retrieve') {
              action.data.from = window.account
              action.data.quantity = parseFloat(action.data.quantity).toFixed(4) + ' ' + this.state.src
            }
      lcnOnSubmit(action)

  };

  onReset = () => {
    this.formRef.current.resetFields();
  }

  resource = (key) => {
    // this.formRef.current.setFieldsValue({srcs:})
    this.setState({ src: key }, () => {

      if (key == 'RAM') {
        this.setState({ act: 'buyram' })
        this.formRef.current.setFieldsValue({ acts: 'buyram' })
      } else {
        this.setState({ act: 'delegate' })
        this.formRef.current.setFieldsValue({ acts: 'delegate' })
      }
    })


  }

  action = (key) => {
    this.setState({ act: key })
  }
  changes(key) {

    switch (key) {
      case "delegate":
        contract = 'eosio'
        return <div>
          {/* {owner} {stake_quantity} */}
          {stake_quantity}

        </div>
        break;
      case "undelegate":
        contract = 'eosio'
        return <div>
          {stake_quantity}
        </div>
        break;
      case "buyram":
        contract = 'eosio'
        return <div>
          {quant}
        </div>
        break;
      case "sellram":
        contract = 'eosio'
        return <div>
          {bytes}
        </div>
        break;
      case "lend":
        contract = 'eosio.res'
        return <div>
          {/* {from} */}
          {to}{quantity}
        </div>
        break;
      case "retrieve":
        contract = 'eosio.res'

        return <div>
          {to}{quantity}{memo}
        </div>
        break;
      case "transfer":
        contract = 'eosio.res'

        return <div>
          {/* {from}   */}
          {to}{quantity}{memo}
        </div>
        break;
      default:
        return
        break;
    }

  }
  render() {
    let actionName = this.state.act

    let fomlist = this.changes(actionName)
    return (

      <Form {...layout} ref={this.formRef} name="control-ref" onFinish={this.onFinish}>
        <div className='pns'>
          <Form.Item initialvalues={this.state.src} label="资源选择" name='srcs' rules={[{ required: true }]}>
            <Select onChange={_ => this.resource(_)} >
              <Select.Option value="NET">NET</Select.Option>
              <Select.Option value="CPU">CPU</Select.Option>
              <Select.Option value="AAB">AAB</Select.Option>
              <Select.Option value="RAM">RAM</Select.Option>

            </Select>
          </Form.Item>
        </div>
        <div className='pns' >
          <Form.Item label="操作" name='acts' rules={[{ required: true }]}>
            <Select initialvalues={this.state.act} onChange={_ => this.action(_)}>
              {this.state.src != 'RAM' ?
                <Select.Option value="delegate">抵押</Select.Option>
                : <Select.Option value="buyram">买入</Select.Option>}
              {this.state.src != 'RAM' ?
                <Select.Option value="undelegate">赎回</Select.Option>
                : <Select.Option value="sellram">卖出</Select.Option>}
              <Select.Option value="transfer">转移</Select.Option>
              <Select.Option value="lend">借出</Select.Option>
              <Select.Option value="retrieve">取回</Select.Option>
            </Select>
          </Form.Item>
        </div>
        {/* <div className='pns'>
          <Form.Item
            name="producer"
            label="生产者"
          >
            <Input />
          </Form.Item>
        </div> */}
        {fomlist}
        <Form.Item {...tailLayout}>

          <Button type="primary" htmlType="submit">
            提交
          </Button>
          {/* <Button htmlType="button" onClick={this.onReset}>
            Reset
          </Button>
          <Button type="link" htmlType="button" onClick={this.onFill}>
            Fill form
          </Button> */}
        </Form.Item>
      </Form>
    );
  }
}

export default connect(() => ({}), {})(Cpu)