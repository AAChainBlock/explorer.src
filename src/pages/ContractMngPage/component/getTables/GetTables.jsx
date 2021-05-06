
import { Form, Input, Button, Select, message, Col } from 'antd';
import React, { Component, createRef } from 'react'

import { connect } from 'react-redux';
import './GetTables.scss'
import { CodeViewer } from 'components'
import axios from 'axios'

const { Search } = Input;
const { Option } = Select;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const sert = {
  labelCol: { span: 12 },
  wrapperCol: { span: 12 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

class GetTables extends Component {
  formRef = createRef();
  state = {
    rows: [],
    tables: [],
    data:[]
  }


  onFinish = async values => {
    try {
      values.table = values.table.value
      const data = await window.eosr.rpc.get_table_rows(values)
      this.setState({ rows: data.rows })
    } catch (error) {
      message.error('查询失败')
    }

  };
  handleSearch = async value => {
    let code = this.formRef.current.getFieldValue('code'),
     table = this.formRef.current.getFieldValue('table').value
    
    if ( window.accountInfo && window.accountInfo.endpointsrvlist) {
      
      const result = await window.eosr.rpc.get_table_by_scope({code,table,limit:200}) 
      this.setState({ data: result.rows })
    } else {
      this.setState({ data: [] });
    }
  };

  handleChange = value => {
    this.setState({ value });
  };


  async search(val) {
    try {
      const result = await window.eosr.rpc.get_abi(val)
      this.setState({ tables: result.abi.tables })
    } catch (error) {
      console.log(error)
    }
  }

  onFill = () => {
    this.formRef.current.setFieldsValue({
      note: 'Hello world!',
      gender: 'male',
    });
  };


  render() {
    const { tables,data } = this.state
    return (
      <Form {...layout} ref={this.formRef} className='scatter-from' name="control-ref" onFinish={this.onFinish}>
        <div className='flex-input-list'>
          <Form.Item name="code" label="合约名" {...sert}>
            <Search placeholder="code" onSearch={value => this.search(value)} enterButton />
          </Form.Item>
          <Form.Item name="table" label="操作" {...sert}>
            <Select
              labelInValue
              onChange={_=>this.handleSearch()}
              // style={{ width: 120 }}
            >
              {tables.map((action) => <Option key={action.name} value={action.name}>{action.name}</Option>)}
            </Select>

          </Form.Item>
          <Form.Item name="scope" label="范围"  {...sert}>
            <Select
              showSearch
              // value={this.state.value}
              placeholder={this.props.placeholder}
              style={this.props.style}
              defaultActiveFirstOption={false}
              showArrow={false}
              filterOption={false}
              // onSearch={this.handleSearch}
              // onChange={this.handleChange}
              // notFoundContent={null}
            >
              {data.map((action) => <Option key={action.scope} value={action.scope}>{action.scope}</Option>)}
            
      </Select>
          </Form.Item>
          
          <Form.Item >
            <br />
          </Form.Item>
          <Form.Item >
            <br />
          </Form.Item>
          <Form.Item name="limit" label="分页条数"  {...sert}>
            <Input placeholder='limit' />
          </Form.Item>
          <Form.Item name="index_position" label="排序索引"  {...sert}>
            <Input placeholder='index_position' />
          </Form.Item>
          <Form.Item name="lower_bound" label="下限"  {...sert}>
            <Input placeholder='lower_bound' />
          </Form.Item>
          <Form.Item name="upper_bound" label="上限"  {...sert}>
            <Input placeholder='upper_bound' />
          </Form.Item>
          <Form.Item name="key_type" label="键类型"  {...sert}>
            <Input placeholder='key_type' />
          </Form.Item>
          {/* <Form.Item name="table_key" label="table_key"  {...sert}>
          <Input  placeholder='scope'/>
        </Form.Item> */}

        </div>
          <Button  className='search' type="primary" htmlType="submit">
            查询
        </Button>

        <div> </div>
        <CodeViewer
          language="json"
          className='tables'
          value={JSON.stringify(this.state.rows, null, 2)}
          readOnly={true}
          height={600}
        />
      </Form>
    );
  }
}

export default connect(() => ({}), {})(GetTables)