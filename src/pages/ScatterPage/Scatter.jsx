import React, {Component} from 'react'
import './Scatter.scss'
import { connect } from 'react-redux';
import { ScatterTemplate } from 'templates';
import {Tabs} from 'antd'
const { TabPane } = Tabs;
class Scatter extends Component{
    constructor(props){
        super(props);
        this.state = {

        }
    }

    render(){


        return <ScatterTemplate hidesearch ={true}>
        <div className="container">
            <h1>account</h1>
            <Tabs defaultActiveKey="1" >
                <TabPane tab="秘钥创建" key="1">
                Content of Tab Pane 1
                </TabPane>
                <TabPane tab="账户创建" key="2">
                Content of Tab Pane 2
                </TabPane>
                <TabPane tab="权限更新" key="3">
                Content of Tab Pane 3
                </TabPane>
            </Tabs>,
        </div>
        </ScatterTemplate>
    }
}

export default connect(()=>({}),{})(Scatter)