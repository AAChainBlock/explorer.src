import { Form, Input, Button, Select, message } from 'antd';
import React, { Component, createRef } from 'react'
import { connect } from 'react-redux';
import {
  ecc
} from 'lcnjs';
import './Voteproducer.scss'
import axios from 'axios'
import { rpc, Eos, transactOpt, lcnOnSubmit } from 'services/lcnjs'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';


const { Option } = Select
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
const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 20, offset: 4 },
  },
};
// axios.defaults.withCredentials = true;
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

class Voteproducer extends Component {
  state = {
    img: '',
    list: [],
    producers: []
  }
  formRef = createRef();



  componentDidMount() {
    // setTimeout(() => {
    //   this.getVoter()
    //   this.getproducers()
    // }, 2000)

  }

  componentDidUpdate() {
    this.formRef.current.resetFields();
  }

  addProd(add) {
    let list = this.formRef.current.getFieldsValue().producers 
    let producers = list? JSON.parse(JSON.stringify(list)):[]
    producers.push({ weight: 0, prod: '', pdv: "" })
    this.formRef.current.setFieldsValue({
      producers
    });
  }

  onFinish = async values => {

    let { producers } = values
    let flag = producers.find(item => {
      return !item.prod || item.prod == "" || !item.pdv
    })
    let action
    if (!flag) {
      action = {
        account: 'eosio',
        name: 'voteproducer',
        authorization: [{ actor: window.account, permission: "active" }],
        data: {
          voter: window.account,
          producers
        }
      }
      lcnOnSubmit(action)
    }else {
      message.error('请检查您的输入')
    }
      

    };

    valiName(name, index){
      debugger
      const {data:{accountInfo}} = this.props.Scatter
      let list = this.formRef.current.getFieldsValue().producers;
      list[index].prod = ''
      let item = list.find(item => item.prod === name)
      if (item) {
        message.error('无法重复投票')
        this.formRef.current.setFieldsValue({
          producers: list
        });
      } else {
        list[index].prod = name
        this.formRef.current.setFieldsValue({
          producers: list
        });
      }
    }
    removeVoter = async (name) => {
      let list = this.formRef.current.getFieldsValue().producers.filter((item, index) => index !== name)
      this.formRef.current.setFieldsValue({
        producers: list
      });

    }





    render() {
      console.log(this.props.Scatter)
      const {data:{producers,accountInfo}} = this.props.Scatter
      let list = accountInfo.voter_info ? accountInfo.voter_info.detail : []
      console.log('producers,accountInfo',producers,accountInfo)
      return (
        <Form {...layout} ref={this.formRef} name="control-ref" onFinish={this.onFinish}
        initialValues={{producers:list}}
        >

          <div className='pns'>
            <Form.List name="producers" >
              {(fields, { add, remove }) => {
                return (
                  <div  >
                    {fields.map((field, index) =>
                      (
                        <Form.Item
                          {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                          label={index === 0 ? '矿工' : ''}
                          required={false}
                          key={field.key}
                        >
                          <Form.Item
                            {...field}
                            fieldKey={[field.fieldKey, "prod"]}
                            name={[field.fieldKey, "prod"]}
                            validateTrigger={['onChange', 'onBlur']}
                            fieldKey={field.fieldKey + "a"}
                            label="生产者"
                            noStyle
                          >
                            <Select onChange={_ => this.valiName(_, index)} style={{ width: '60%', marginRight: 8 }}>
                              {producers.map((action, index) => <Option key={index} value={action.owner}>{action.owner}</Option>)}
                            </Select>
                          </Form.Item>
                          <Form.Item
                            style={{ display: 'none' }}
                            fieldKey={[field.fieldKey, "weight"]}
                            name={[field.fieldKey, "weight"]}
                            label="权重"
                            validateTrigger={['onChange', 'onBlur']}
                            noStyle
                          >
                            <Input placeholder="权重weight" value={0} style={{ width: '60%', marginRight: 8, display: 'none' }} />
                          </Form.Item>
                          <Form.Item
                            fieldKey={[field.fieldKey, "pdv"]}
                            name={[field.fieldKey, "pdv"]}
                            validateTrigger={['onChange', 'onBlur']}
                            label="pdv数量"
                            noStyle
                          >
                            <Input placeholder="pdv数量" style={{ width: '60%', marginRight: 8 }} />
                          </Form.Item>
                          {fields.length > 0 ? (
                            <MinusCircleOutlined
                              style={{ marginLeft: '28px' }}
                              className="dynamic-delete-button"
                              onClick={() => {
                                this.removeVoter(field.name);
                              }}
                            />
                          ) : null}
                        </Form.Item>

                      ))}
                    <Form.Item style={{ marginLeft: '20px' }}>
                      <Button
                        type="dashed"
                        onClick={() => {
                          this.addProd(add);
                        }}
                        style={{ width: '60%' }}
                      >
                        <PlusOutlined /> 添加矿工
                </Button>
                    </Form.Item>
                  </div>
                )
                  ;
              }}
            </Form.List>
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

  export default connect(({Scatter}) => ({Scatter}), {}) (Voteproducer)