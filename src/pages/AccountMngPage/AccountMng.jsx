import React, { Component } from 'react'
import './AccountMng.scss'
import { connect } from 'react-redux';
import { ScatterTemplate } from 'templates';
import { Tabs } from 'antd'
import Createkey from './component/createkey/Createkey'
import CreateAccount from './component/createAccount/CreateAccount'
// import PermissionUpdate from './component/permissionUpdate/PermissionUpdate'

const { TabPane } = Tabs;
class AccountMng extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {

        return <ScatterTemplate hidesearch={true}>
            <div className="container scatter-container">
                <Tabs className="scatter-tabs" defaultActiveKey="1" >
                    <TabPane tab="创建密钥" key="2">
                        <CreateAccount />   
                    </TabPane>
                    <TabPane tab="创建账户" key="1">
                        <Createkey />
                    </TabPane>
                    {/* <TabPane tab="权限更新" key="3">
                        <PermissionUpdate />
                    </TabPane> */}
                </Tabs>,
        </div>
        </ScatterTemplate>
    }
}

export default connect(() => ({}), {})(AccountMng)