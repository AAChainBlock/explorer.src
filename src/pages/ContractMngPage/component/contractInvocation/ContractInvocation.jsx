import { Form, Input, Button, Select, message } from 'antd';
import React, { Component, createRef } from 'react'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { transactOpt,isAccount ,lcnOnSubmit } from 'services/lcnjs'
import { connect } from 'react-redux';
import { rulesAccount } from '../../../../services/lcnjs';
const { Option } = Select;
const { Search } = Input;


const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 20, offset: 4 },
  },
};

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};

class ContractInvocation extends Component {
  constructor() {
    super()
    this.state = {
      actions: [],
      data: [],
      structs: []
    }
  }
  formRef = createRef();


  onFinish = async values => {
    let { code, actionName } = values
    delete values.code
    delete values.actionName
    let action = {
      account: code,
      name: actionName.value,
      authorization: [{ actor: window.account, permission: "active" }],
      data: {
        ...values
      }
    }
    
    lcnOnSubmit(action)
  };

  change(val) {

    let datas = this.state.structs.find(item => item.name == val.value)
    this.setState({ data: datas.fields })
  }
  async search(val) {
    try {
      const result = await window.eosr.rpc.get_abi(val)
      if (result.abi && result.abi.actions) {
        this.setState({ actions: result.abi.actions, structs: result.abi.structs })
      }
    } catch (error) {
      console.log(error)
    }
  }


  render() {
    const { actions, data } = this.state
    return (
      <Form {...layout} ref={this.formRef} name="control-ref" onFinish={this.onFinish}>
        <Form.Item name="code" label="合约" rules={rulesAccount} >
          <Search placeholder="input search text" onSearch={value => this.search(value)} enterButton />
        </Form.Item>
        <Form.Item name="actionName" label="操作" >
          <Select
            labelInValue
            style={{ width: 120 }}
            onChange={_ => this.change(_)}
          >
            {actions.map((action) => <Option key={action.name} value={action.name}>{action.name}</Option>)}
          </Select>

        </Form.Item>
        {data.map((item, index) => {
          return <Form.Item key={index} name={'data.', item.name} label={`${item.name}(${item.type})`} >
            <Input />
          </Form.Item>

        }
        )
        }


        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            提交
          </Button>

        </Form.Item>
      </Form>
    );
  }
}

export default connect(() => ({}), {})(ContractInvocation)