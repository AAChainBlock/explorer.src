import { Form, Input, Button, Select, message } from 'antd';
import React, { Component, createRef } from 'react'
import { connect } from 'react-redux';

import {
  ecc,
  isAccount
} from 'lcnjs';
import './transfer.scss'
import axios from 'axios'
import { rpc, Eos, transactOpt, isSymbol ,lcnOnSubmit } from 'services/lcnjs'
import { rulesAccount, rulesSymbol } from '../../../../services/lcnjs';
import { tuple } from 'antd/lib/_util/type';

const { Option } = Select
// axios.defaults.withCredentials = true;
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

class Transfer extends Component {
  state = {
    img: ''
  }
  formRef = createRef();

  componentWillMount() {

  }
  change(val) {
    console.log(val)
  }

  assets( quantity, quan) {
    let arr = quan.split('.')
    if (arr && arr.length) {
      let symbol = arr[1].split(" ")
      if (symbol && symbol.length > 1) {
        let result = parseFloat(quantity).toFixed(symbol[0].length) + " " + symbol[1]
        return result
      }
    }
  }

  onFinish = async values => {
    let { contract, quantity, memo, to } = values
    let arr = contract.split('-')
    quantity = this.assets(quantity, arr[1])
    contract = arr[0]
    let action = {
      account: contract,
      name: 'transfer',
      authorization: [{ actor: window.account, permission: "active" }],
      data: {
        from: window.account,
        to,
        quantity,
        memo
      }
    }
    lcnOnSubmit(action)
  };

  render() {
    let { data: { balance = [] } } = this.props.Scatter

    return (
      <Form {...layout} ref={this.formRef} name="control-ref" onFinish={this.onFinish}>
        <div className='pns'>
          <Form.Item
            name="contract"
            label="资产所属合约"
          >
            <Select
              // labelInValue

              onChange={_ => this.change(_)}
            >
              {balance.map((action) => <Option key={action.id} value={action.contract+"-"+action.asset}>{action.contract}/{action.issuer}/{action.asset}</Option>)}
            </Select>
          </Form.Item>
        </div>

        <div className='pns'>
          <Form.Item
            name="to"
            label="接收人"
            rules={rulesAccount}
          >
            <Input />
          </Form.Item>
        </div>
        <div className='pns'>
          <Form.Item
            name="quantity"
            label="转账数额"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </div>
        <div className='pns'>
          <Form.Item
            name="memo"
            label="备注"
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

export default connect(({ Scatter, Qcode }) => ({ Scatter, Qcode }), {})(Transfer)