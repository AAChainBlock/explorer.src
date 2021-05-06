import React, { Component } from 'react'

import { connect } from 'react-redux';
import { ScatterTemplate } from 'templates';
import { Tabs } from 'antd'
import ContractInvocation from './component/contractInvocation/ContractInvocation'
import GetTables from './component/getTables/GetTables'

const { TabPane } = Tabs;

class Scatter extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount() {
    }

    render() {


        return <ScatterTemplate hidesearch={true}>
            <div className="container scatter-container">
                <Tabs className="scatter-tabs" defaultActiveKey="1" >
                    {/* <TabPane tab="合约挂载" key="1">
                    <ContractMount />
                </TabPane> */}
                    <TabPane tab="数据浏览" key="2">
                        <GetTables />
                    </TabPane>
                    {/* <TabPane tab="合约的调用" key="3">
                        <ContractInvocation />
                    </TabPane> */}
                </Tabs>
            </div>
        </ScatterTemplate>
    }
}

export default connect(() => ({}), {})(Scatter)