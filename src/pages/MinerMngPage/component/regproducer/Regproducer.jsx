import { Form, Input, Button, Select, message } from 'antd';
import React, { Component, createRef } from 'react'
import { connect } from 'react-redux';
import { ecc } from 'lcnjs'
import './Regproducer.scss'
import { rpc, Eos, transactOpt ,lcnOnSubmit } from 'services/lcnjs'
// axios.defaults.withCredentials = true;
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

class Regproducer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      img: '',
      isProducer: true
    }

  }

  formRef = createRef();

  componentDidMount() {
    // this.getReg()
    if (window.account) {
      // this.getproducers()
    }
  }

  componentDidUpdate(){
    this.formRef.current.resetFields();
  }

  	


  isValidUrl(str) {
    if (str) {
      let regemail = /[a-zA-z]+:\/\/[^\s]*/
      if (!regemail.test(str)) {

        return Promise.reject('你的网址输入不正确')
      } else {
        return Promise.resolve()
      }
    }
  }
  
  onFinish =  values => {
      let { producer, producer_key, url, location } = values
      producer = window.account
      let action = {
        account: 'eosio',
        name: 'regproducer',
        authorization: [{ actor: window.account, permission: "active" }],
        data: {
          producer, producer_key, url, location
        }
      }
      lcnOnSubmit(action)
  };



  render() {
    const { data:{accountInfo,producers} } = this.props.Scatter
    let prd = producers.find(item => item.owner == window.account)
    let initvalue = {}
    if (prd) {
      let { producer_key, url, location } = prd
      if (producer_key === 'AAA1111111111111111111111111111111114T1Anm') {
        producer_key = ""
      }
      initvalue = { producer_key, url, location }

    }
    console.log('accountInfo',initvalue)
    return (
      <Form {...layout} ref={this.formRef} name="control-ref" onFinish={this.onFinish}
      initialValues={initvalue} 

      >

        <div className='pns'>
          <Form.Item
          shouldUpdate
            name="producer_key"
            label="矿工公钥"
            rules={[{ required: true }, { validator: (_, value) => ecc.isValidPublic(value) ? Promise.resolve() : Promise.reject('公钥不合法') }]}
          >
            <Input />
          </Form.Item>
        </div>
        <div className='pns'>
          <Form.Item
          shouldUpdate
            name="url"
            label="url地址"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </div>
        <div className='pns'>
          <Form.Item
          shouldUpdate
            name="location"
            label="位置"
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

export default connect(({Scatter}) => ({Scatter}), {})(Regproducer)