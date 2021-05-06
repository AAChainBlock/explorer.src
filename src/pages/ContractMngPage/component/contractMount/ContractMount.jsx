import { Form, Input, Button, Select, message, Upload } from 'antd';
import React, { Component, createRef } from 'react'
import { connect } from 'react-redux';
import {
  ecc
} from 'lcnjs';

import './ContractMount.scss'
import axios from 'axios'
import { rpc, Eos, transactOpt ,lcnOnSubmit } from 'services/lcnjs'
// axios.defaults.withCredentials = true;

import { InboxOutlined } from '@ant-design/icons';
const { Dragger } = Upload;
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

function stringToBytes(str) {

  var ch, st, re = [];
  for (var i = 0; i < str.length; i++) {
    ch = str.charCodeAt(i);  // get char  
    st = [];                 // set up "stack"  

    do {
      st.push(ch & 0xFF);  // push byte to stack  
      ch = ch >> 8;          // shift value down by 1 byte  
    }

    while (ch);
    // add stack contents to result  
    // done because chars have "wrong" endianness  
    re = re.concat(st.reverse());
  }
  // return an array of bytes  
  return re;
}

const props = {
  name: 'file',
  multiple: true,

  customRequest: async ({
    action,
    data,
    file,
    filename,
    headers,
    onError,
    onProgress,
    onSuccess,
    withCredentials,
  }) => {


    window.file = file
    if (file.name.substring(file.name.length - 3) == 'abi') {


      let bytes = await file.text()
      let actions = {
        account: 'eosio',
        name: 'setabi',
        authorization: [{ actor: window.account, permission: "active" }],
        data: {
          account: window.account,
          abi: stringToBytes(JSON.stringify(bytes))
        }
      }
      let result

      if (window.isDappPay) {
        result = await window.eosr.transacts({ actions: [action] }, transactOpt, true)
      } else {
        result = await window.eosr.transacts({ actions: [action] }, transactOpt)
        if (result) {
          message.success('成功')
        } else {
          message.error('失败')
        }
      }
      return {
        abort() {
          console.log('upload progress is aborted.');
        },
      };
    } else if (file.name.substring(file.name.length - 4) == 'wasm') {
      let bytes = await file.text()
      let actions = {
        account: 'eosio',
        name: 'setcode',

        authorization: [{ actor: window.account, permission: "active" }],
        data: {
          account: window.account,
          vmtype: 0,
          vmversion: 0,
          code: stringToBytes(JSON.stringify(bytes))
        }
      }
      let result

      if (window.isDappPay) {
        result = await window.eosr.transacts({ actions: [action] }, transactOpt, true)
        if (result) {
          if (!isDappPay) {
            message.success('成功')
          }
        } else {
          message.error('失败')
        }
      } result = await window.eosr.transacts({ actions: [action] }, transactOpt)
      if (result) {
        message.success('成功')
      } else {
        message.error('失败')
      }
      if (result) {

        if (!window.isDappPay) {
          message.success('成功')
        }
      } else {
        message.error('失败')
      }
      return {
        abort() {
          console.log('upload progress is aborted.');
        },
      };
    }


  },
  onChange(info) {
    // const { status } = info.file;
    // if (status !== 'uploading') {
    //   console.log(info.file, info.fileList);
    // }
    // if (status === 'done') {
    //   message.success(`${info.file.name} file uploaded successfully.`);
    // } else if (status === 'error') {
    //   message.error(`${info.file.name} file upload failed.`);
    // }
  },
};


class ContractMount extends Component {
  state = {
    img: ''
  }
  formRef = createRef();

  componentWillMount() {
    console.log('Eos', Eos)
    window.eosa = Eos
  }


  onFinish = async values => {
    //     let data1 = await eos.setcode(contractAccount, 0, 0, wasm) 
    // console.log("deploy:data1:")
    // let data2 = await eos.setabi(contractAccount, JSON.parse(abi))
    let { issuer, maximum_supply } = values
    let action = {
      account: 'eosio.token',
      name: 'create',
      authorization: [{ actor: issuer, permission: "active" }],
      data: {
        issuer,
        maximum_supply
      }
    }
    console.log('action', action)
    let result

    if (window.isDappPay) {
      result = await window.eosr.transacts({ actions: [action] }, transactOpt, true)
      if (result) {
        if (!isDappPay) {
          message.success('成功')
        }
      } else {
        message.error('失败')
      }
    } else {
      result = await window.eosr.transacts({ actions: [action] }, transactOpt)
    }
    if (result.data.code == 200) {
      message.success(result.data.message)
    } else {
      message.error(result.data.message)
    }
  };


  onReset = () => {
    this.formRef.current.resetFields();
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
        <Dragger {...props}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">单击或拖动文件到此区域以上载</p>
          <p className="ant-upload-hint">
            支持单次或批量上传
          </p>
        </Dragger>
        <div className='pns'>
          <Form.Item
            name="maximum_supply"
            label="发行数额"
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

export default connect(() => ({}), {})(ContractMount)