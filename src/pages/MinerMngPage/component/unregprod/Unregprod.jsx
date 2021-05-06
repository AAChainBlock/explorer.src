import { Form, Input, Button, Select, message } from 'antd';
import React, { Component, createRef } from 'react'
import { connect } from 'react-redux';

import './Unregprod.scss'
import {rpc, Eos, transactOpt,lcnOnSubmit } from 'services/lcnjs'

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

class Unregprod extends Component {
  state = {
    img: ''
  }
  formRef = createRef();
  componentDidMount(){
    // this.onReset()
  }
  onFinish = async values => {

    // let { producer } = values
    let action = {
      account:'eosio',
      name:'unregprod',
      authorization: [{ actor: window.account, permission: "active" }],
      data:{
        producer:window.account
      }
    }
    lcnOnSubmit(action)
  };


  render() {
    return (
      <Form {...layout} ref={this.formRef} name="control-ref" onFinish={this.onFinish}>
       
        <Form.Item {...tailLayout}>

          <Button type="primary" htmlType="submit">
            注销
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

export default connect(() => ({}), {})(Unregprod)