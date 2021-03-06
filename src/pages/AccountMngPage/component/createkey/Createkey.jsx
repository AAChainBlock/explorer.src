import { Form, Input, Button, Select, message } from 'antd';
import React, { Component, createRef } from 'react'
import { connect } from 'react-redux';
import {
  Api,
  JsonRpc,
  JsSignatureProvider,
  ecc
} from 'lcnjs';
import './Createkey.scss'
import axios from 'axios'
import {rulesAccount,rulesSymbol,lcnOnSubmit } from 'services/lcnjs'
// axios.defaults.withCredentials = true;
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

class Createkey extends Component {
  state = {
    img: ''
  }
  formRef = createRef();

  componentWillMount() {

  }


  onFinish = async values => {

    let { account, privatekey, publickey, validCode } = values
    let data = [{
      chainid: 'b1b39c2a44631f8a914564f652b02fa37f1dce7004f3abce34f8ee57956f363d',
      kaptcha: validCode,
      account: "eosio",
      name: "newaccount",
      authorization: [{ actor: "agent.main", permission: "active" }],
      data: {
        creator: "agent.main",
        name: account,
        owner: {
          threshold: 1,
          keys: [{ key: publickey, weight: 1 }],
          accounts: [],
          waits: []
        },
        active: {
          threshold: 1,
          keys: [{ key: publickey, weight: 1 }],
          accounts: [],
          waits: []
        }
      }
    }]
    const result = await axios.post( window.newAccountApi +'/kaptcha/validate', data)
    if (result.data.code == 200) {
      message.success(result.data.message)
    } else {
      message.error(result.data.message)
    }
  };
  valid = async () => {
    axios.post(window.newAccountApi +'/kaptcha', {}, {
      responseType: "arraybuffer",
    }).then(res => {
      return 'data:image/png;base64,' + btoa(new Uint8Array(res.data)
        .reduce((data, byte) => data + String.fromCharCode(byte), '')
      );
    }).then(data => {
      this.setState({ img: data })

    })
  }

  onReset = () => {
    this.formRef.current.resetFields();
  }

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
            name="account"
            label="?????????"
            rules ={rulesAccount}
          >
            <Input />
          </Form.Item>
        </div>
        <div className='pns'>
          <Form.Item
            name="publickey"
            label="??????"
          >
            <Input />
          </Form.Item>
        </div>
        <div className='pns'>
          <Form.Item
            name="privatekey"
            label="??????"
          >
            <Input  />
          </Form.Item>
          <Button type="primary" onClick={_ => this.write()}>
            ???????????????????????????
          </Button>
        </div>
        <div className='pns'>
          <Form.Item
            name="privatekey"
            label="???????????????"
          >
                      <img src={this.state.img} />
          </Form.Item>
          <Button type="primary" onClick={_ => this.valid()}>
            ???????????????
          </Button>
        </div>
        <div className='pns2'>
          <Form.Item
            name="validCode"
            label="?????????"
          >

            <Input />

          </Form.Item>
          
        </div>
        <Form.Item {...tailLayout}>

          <Button type="primary" htmlType="submit">
            ??????
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

export default connect(() => ({}), {})(Createkey)