import React, { Component } from 'react'
import './CoinMng.scss'
import { connect } from 'react-redux';
import { ScatterTemplate } from 'templates';
import { Tabs } from 'antd'
import CreateCoin from './component/createCoin/CreateCoin'
import IssueCoin from './component/issueCoin/IssueCoin'
import RetireCoin from './component/retireCoin/RetireCoin'
import RegisterCoin from './component/registerCoin/RegisterCoin'
import DelCoin from './component/delCoin/DelCoin'

import Transfer from './component/transfer/Transfer'
const { TabPane } = Tabs;

class CoinMng extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    componentDidMount(){

    }

    render() {
        return <ScatterTemplate hidesearch={true}>
            <div className="container scatter-container">
                <Tabs className="scatter-tabs" defaultActiveKey="6" >
                <TabPane tab="转账" key="6">
                        <Transfer />
                    </TabPane>
                    <TabPane tab="创建通证" key="1">
                        <CreateCoin />
                    </TabPane>
                    <TabPane tab="增发通证" key="2">
                        <IssueCoin />
                    </TabPane>
                    <TabPane tab="减发通证" key="3">
                       <RetireCoin />
                    </TabPane>
                    <TabPane tab="注册通证" key="4">
                       <RegisterCoin />
                    </TabPane>
                    <TabPane tab="注销通证" key="5">
                       <DelCoin />
                    </TabPane>
                </Tabs>,
        </div>
        </ScatterTemplate>
    }
}

export default connect(() => ({}), {})(CoinMng)