import { Form, Input, Button, Select, message } from 'antd';
import React, { Component, createRef } from 'react'
import { connect } from 'react-redux';
import {
  ecc,

} from 'lcnjs';
import './RegisterCoin.scss'
import axios from 'axios'
import { rpc, Eos, transactOpt, rulesSymbol, rulesAccount ,lcnOnSubmit } from 'services/lcnjs'
// axios.defaults.withCredentials = true;
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

class RegisterCoin extends Component {
  state = {
    img: ''
  }
  formRef = createRef();

  componentWillMount() {

  }


  onFinish = async values => {

    let { issuer, ncontract, sym, description } = values
    let action = {
      account: 'currencymng',
      name: 'regist',
      authorization: [{ actor: window.account, permission: "active" }],
      data: {
        issuer, ncontract, sym, description
      }
    }
    lcnOnSubmit(action)
  };


  render() {
    return (
      <Form {...layout} ref={this.formRef} name="control-ref" onFinish={this.onFinish}>
        <div className='pns'>
          <Form.Item
            name="issuer"
            label="发行人"
            rules={rulesAccount}
          >
            <Input />
          </Form.Item>
        </div>
        <div className='pns'>
          <Form.Item
            name="ncontract"
            label="合约"
            rules={rulesAccount}
          >
            <Input />
          </Form.Item>
        </div>

        <div className='pns'>
          <Form.Item
            name="sym"
            label="代币sym"
            rules={[{ required: true }]}
          >
            <Input placeholder="4,AAA" />
          </Form.Item>
        </div>
        <div className='pns'>
          <Form.Item
            name="description"
            label="描述"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </div>
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

export default connect(() => ({}), {})(RegisterCoin)