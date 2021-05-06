import React, { Component } from 'react'

import { connect } from 'react-redux';
import { ScatterTemplate } from 'templates';
import { Tabs } from 'antd'

import { fetchProducer, fetchAccount } from 'reducers/scatters'
import Regproducer from './component/regproducer/Regproducer'//注册
import Unregprod from './component/unregprod/Unregprod'
import Voteproducer from './component/voteproducer/Voteproducer'


const { TabPane } = Tabs;
class Miner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            producers: [],
            isProducer: false,
            producer: {}
        }
    }
    componentDidMount() {
        this.props.fetchProducer()

    }

    render() {
        const { data: { accountInfo, producers } } = this.props.Scatter
        console.log('accountInfo-----', producers)
        let product = producers.find(item => item.owner === window.account)
        return <ScatterTemplate hidesearch={true}>
            <div className="container scatter-container">
                <Tabs className="scatter-tabs" defaultActiveKey="1" >
                    {
                        accountInfo.voter_info ? <TabPane tab="修改信息" key="1">
                            <Regproducer producers={this.state.producers} producer={this.state.producer} />
                        </TabPane> : <TabPane tab="注册" key="1">
                                <Regproducer producers={this.state.producers} producer={this.state.producer} />
                            </TabPane>
                    }
                    {
                        product && product.is_active == 1 ? <TabPane tab="注销" producers={this.state.producers} key="2">
                            <Unregprod />
                        </TabPane> : <TabPane tab="注销" disabled key="2">
                                <Unregprod />
                            </TabPane>
                    }
                    <TabPane tab="投票" key="3">
                        <Voteproducer producers={this.state.producers} />
                    </TabPane>
                </Tabs>,
        </div>
        </ScatterTemplate>
    }
}

export default connect(({ Scatter }) => ({ Scatter }), {
    fetchProducer,
    fetchAccount
})(Miner)