import { Form, Input, Button, Select, message } from 'antd';
import React, { Component, createRef } from 'react'
import { connect } from 'react-redux';
import {
  ecc,
  isAccount
} from 'lcnjs';
import './DelCoin.scss'
import axios from 'axios'
import { rpc, Eos, transactOpt, rulesAccount ,lcnOnSubmit } from 'services/lcnjs'
// axios.defaults.withCredentials = true;
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

class DelCoin extends Component {
  state = {
    img: ''
  }
  formRef = createRef();

  onFinish = async values => {

    let { ncontract, sym } = values
    let action = {
      account: 'currencymng',
      name: 'delcoin',
      authorization: [{ actor: window.account, permission: "active" }],
      data: {
        ncontract, sym
      }
    }
    lcnOnSubmit(action)
  };

  onReset = () => {
    this.formRef.current.resetFields();
  }



  render() {
    return (
      <Form {...layout} ref={this.formRef} name="control-ref" onFinish={this.onFinish}>
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

export default connect(() => ({}), {})(DelCoin)