import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchActionsTracesQuery as fetchActionsTraces } from 'components/Header/components/Headsearch/HeadsearchReducer'
import Transactions from "pages/InfoPage/components/Transactions/Transactions"
import { WalletTemplate } from 'templates';

import moment from 'moment';
import { DatePicker, Input } from 'antd';
import { LoadingSpinner } from 'components';

const { RangePicker } = DatePicker
const { Search } = Input;

let timeRange = {
    "今天": [moment().startOf("days"), moment().endOf("days")],
    "一周前": [moment().subtract('days', 6), moment()],
    "三周前": [moment().subtract('days', 20), moment()],
    '本月': [moment().startOf('month'), moment().endOf('month')],
    "一个月前": [moment().subtract('days', 29), moment()],
    "一个季度": [moment().subtract('days', 120), moment()],
}
let start = moment().subtract('days', 10).format("YYYY-MM-DD")
let end = moment().format("YYYY-MM-DD")


let names = undefined

class QueryActionsPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            page: 1,
            contract: undefined,
            act: undefined,
            pageNum: 1
        }
    }

    onChange(event) {
        event.persist()
        this.setState({ page: event.target.value })
    }

    heyueChange(event) {
        event.persist()
        this.setState({ contract: event.target.value })
    }
    actChange(event) {
        event.persist()
        this.setState({ act: event.target.value })
    }

    setName(event) {
        event.persist()
        names = event.target.value
    }
    
    searchheyue(val) {
        let opt = {
            start,
            end,
            contract: this.state.contract,
            act: this.state.act,
            name: names,
        }
        this.props.fetchActionsTraces(opt)

    }
    transactionsPag = (pageNum) => {
        let { contract, act } = this.state
        this.setState({ pageNum })
        let opt = {
            contract,
            act,
            name: names,
            start,
            end,
            pageNum
        }

        this.props.fetchActionsTraces(opt)
    }

    searchact(val) {
        // this.setState({ act : val })
        let opt = {
            contract: this.state.contract,
            act: this.state.act,
            start,
            end,
            name: names,
        }
        this.props.fetchActionsTraces(opt)
    }

    searchname(val) {
        let opt = {
            contract: this.state.contract,
            act: this.state.act,
            start,
            end,
            name: names,
        }
        this.props.fetchActionsTraces(opt)
    }
    actionOnChange = (e, f) => {
        if (e) {
            start = e[0].format("YYYY-MM-DD")
            end = e[1].format("YYYY-MM-DD")
        }
    }


    render() {
        let { data } = this.props.Headsearch
        let action, total
        if (data && data.actionsTracesQuery) {
            action = data.actionsTracesQuery.data.action
            action = action.map((item)=>{
                item.actions = [item.act]
                return item
            })
            total = data.actionsTracesQuery.data.total
        }
        return (

            <WalletTemplate history={this.props.history}>
                <div className="container queryaction">
                <div className="panel panel-default">
                    <div className="panel-body">
                    <div className="searbox">
                        <RangePicker
                            ranges={timeRange}
                            showTime
                            format="YYYY/MM/DD HH:mm:ss"
                            onChange={e => this.actionOnChange(e)}
                        />
                        <Search
                            placeholder="请输入合约称"
                            onChange={val => this.heyueChange(val)}
                            onSearch={value => this.searchheyue(value)}
                            style={{ width: 200 }}
                        />
                        <Search
                            placeholder="请输入操作名称"
                            onChange={val => this.actChange(val)}

                            onSearch={value => this.searchact(value)}
                            style={{ width: 200 }}
                        />
                        <Search
                            placeholder="请输入操作授权人"
                            onChange={val => this.setName(val)}

                            onSearch={value => this.searchname(value)}
                            style={{ width: 200 }}
                        />
                    </div>

                    {data.isFetchActionsTraces ? <LoadingSpinner /> :
                        <Transactions history={this.props.history}
                            fatherfetchActionsTraces={this.transactionsPag}
                            actions={action ? action : []} total={total} pageNum={this.state.pageNum} showPag={true} />}
                    </div>
                </div>
                    
                </ div>
            </WalletTemplate >

        );
    }

}

export default connect(
    ({ Headsearch }) => ({
        Headsearch
    }),
    {
        fetchActionsTraces
    }

)(QueryActionsPage);
