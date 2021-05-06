import { Form, Input, Button, Select, message } from 'antd';
import React, { Component, createRef } from 'react'
import { connect } from 'react-redux';
import {
  ecc,

} from 'lcnjs';
import './CreateCoin.scss'
import axios from 'axios'
import { rpc, Eos, transactOpt, rulesAccount, rulesSymbol ,lcnOnSubmit } from 'services/lcnjs'
// axios.defaults.withCredentials = true;
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

class CreateCoin extends Component {
  state = {
    img: ''
  }
  formRef = createRef();

  componentWillMount() {

  }


  onFinish = async values => {
    let { issuer, maximum_supply } = values
    let action = {
      account: window.account,
      name: 'create',
      authorization: [{ actor: window.account, permission: "active" }],
      data: {
        issuer,
        maximum_supply
      }
    }
    lcnOnSubmit(action)

  };
  valid = async () => {
    axios.post('/kaptcha', {}, {
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
            name="issuer"
            label="发行人"
            rules={rulesAccount}
          >
            <Input />
          </Form.Item>
        </div>
        <div className='pns'>
          <Form.Item
            name="maximum_supply"
            label="发行数额"
            rules={rulesSymbol}
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

export default connect(() => ({}), {})(CreateCoin)