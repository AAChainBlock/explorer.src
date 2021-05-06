import { Form, Input, Button, Select, message } from 'antd';
import React, { Component, createRef } from 'react'
import { connect } from 'react-redux';
import {
  Api,
  JsonRpc,
  JsSignatureProvider,
  ecc
} from 'lcnjs';
import './CreateAccount.scss'
import axios from 'axios'

// axios.defaults.withCredentials = true;
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

class CreateAccount extends Component {
  state = {
    img: ''
  }
  formRef = createRef();

  write = async () => {
    let priv = await ecc.randomKey()
    let pub = await ecc.privateToPublic(priv)
    this.formRef.current.setFieldsValue({
      privatekey: priv,
      publickey: pub
    });
    return false
  }


  render() {
    return (
      <Form {...layout} ref={this.formRef} name="control-ref" onFinish={this.onFinish}>
       
        <div className='pns'>
          <Form.Item
            name="publickey"
            label="公钥"
          >
            <Input />
          </Form.Item>
        </div>
        <div className='pns'>
          <Form.Item
            name="privatekey"
            label="私钥"
          >
            <Input  />
          </Form.Item>
          <Button type="primary" onClick={_ => this.write()}>
            生成私钥及对应公钥
          </Button>
        </div>
      
      </Form>
    );
  }
}

export default connect(() => ({}), {})(CreateAccount)