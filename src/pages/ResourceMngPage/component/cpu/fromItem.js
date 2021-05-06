import React from 'react'
import { Form, Input } from 'antd';
import { isAccount,lcnOnSubmit } from 'services/lcnjs'
import { rulesAccount, rulesSymbol } from '../../../../services/lcnjs';
export const owner = <div className='pns'>
                    <Form.Item
                      name="owner"
                      label="拥有者"
            rules={rulesAccount}

                    >
                      <Input />
                    </Form.Item>
                  </div>

export const stake_quantity = <div className='pns'>
                    <Form.Item
                      name="stake_quantity"
                      label="股份数量"

                    >
                      <Input />
                    </Form.Item>
                  </div>

export const balance = <div className='pns'>
                  <Form.Item
                    name="balance"
                    label="余额"
                  >
                    <Input  placeholder="balance"/>
                  </Form.Item>
                </div>

export const id = <div className='pns'>
                  <Form.Item
                    name="id"
                    label="ID"
                  >
                    <Input placeholder="id" />
                  </Form.Item>
                </div>

export const from = <div className='pns'>
                <Form.Item
                  name="from"
                  label="发出者"
            rules={rulesAccount}

                >
                  <Input placeholder="from" />
                </Form.Item>
              </div>

export const to = <div className='pns'> 
              <Form.Item
                name="to"
                label="接收者"
            rules={rulesAccount}

              >
                <Input placeholder="to" />
              </Form.Item>
            </div>

export const quantity = <div className='pns'>
            <Form.Item
              name="quantity"
              label="数额"

            >
              <Input placeholder="quantity" />
            </Form.Item>
          </div>

export const memo = <div className='pns'>
          <Form.Item
            name="memo"
            label="备注"
            rules={[{required:true}]}
          >
            <Input placeholder="memo" />
          </Form.Item>
        </div>


export const  quant = <div className='pns'>
                        <Form.Item
                        name="quant"
                        label="数额"

                        >
                            <Input />
                        </Form.Item>
                    </div>


export const  bytes = <div className='pns'>
                        <Form.Item
                        name="bytes"
                        label="字节"
                        rules={[{required:true}]}
                        >
                            <Input />
                        </Form.Item>
                    </div>
