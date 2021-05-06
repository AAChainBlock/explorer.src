import React, {Component} from 'react'

import { connect } from 'react-redux';
import { ScatterTemplate } from 'templates';
import {Tabs} from 'antd'
import Res from './component/cpu/Cpu'

const { TabPane } = Tabs;


class ResourceMng extends Component{
    constructor(props){
        super(props);
        this.state = {

        }
    }
    componentDidMount(){

    }
    render(){


        return <ScatterTemplate hidesearch ={true}>
        <div className="container scatter-container">
            <Tabs className="scatter-tabs" defaultActiveKey="1" >
                {/* <TabPane tab="内存买卖" key="1">
                    <Ram /> 
                </TabPane> */}
                <TabPane tab="资源操作" key="2">
                    <Res />
                </TabPane>
                {/* <TabPane tab="权限更新" key="3">
                Content of Tab Pane 3
                </TabPane> */}
            </Tabs>,
        </div>
        </ScatterTemplate>
    }
}

export default connect(()=>({}),{})(ResourceMng)