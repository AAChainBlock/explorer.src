import React from 'react';
import { connect } from 'react-redux';
// import { SearchOutlined } from '@ant-design/icons';
import { Table, Input, Button } from 'antd';
// import Highlighter from 'react-highlight-words';
import { fetchStart } from './ProductionNodeReducer';
import locationdict from "helpers/ISO3316"
import { setSearch } from "reducers/headblock"
import './ProductionNode.scss'


class ProductionNode extends React.Component {
  constructor(props) {
    super()
  }
  state = {
    searchText: '',
  };

  componentDidMount() {
    this.props.fetchStart()
  }

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm)}
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          Reset
        </Button>
      </div>
    ),
    // filterIcon: filtered => (
    //   <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
    // ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: text => text
    // (
    //   <Highlighter
    //     highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
    //     searchWords={[this.state.searchText]}
    //     autoEscape
    //     textToHighlight={text ? text.toString() : ''}
    //   />
    // ),
  });
  serarch = (params) => {
    this.props.setSearch(params)
    this.props.history.push('/account/' + params)
  }
  handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.setState({ searchText: selectedKeys[0] });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  render() {

    const { ProductionNodeReducer: { data } } = this.props
    let rows = data ? data.payload && data.payload.rows : []
    let tablelist = []
    let list = rows ? rows.sort((item1, item2) => item2.total_votes - item1.total_votes):[]
     tablelist = list.map((item, index) => {
      item.key = index
      item.location = locationdict[item.location] ? locationdict[item.location] : "其他"
      item.ranking = index + 1
      // item.total_votes = item.total_votes ? item.total_votes.split(".")[0]:"0"
      return item
    })

    //     is_active: 1
    // last_claim_time: "2019-08-22T03:59:52.500"
    // location: 156
    // owner: "producer111a"
    // producer_key: "EOS8imf2TDq6FKtLZ8mvXPWcd6EF2rQwo8zKdLNzsbU9EiMSt9Lwz"
    // total_votes: "4235846330465103872.00000000000000000"
    // unpaid_blocks: 57182
    const columns = [
      {
        title: '排名',
        dataIndex: 'ranking',
        key: 'ranking',
        width: '10%',
      },
      {
        title: '账户',
        dataIndex: 'owner',
        key: 'owner',
        width: '30%',
        render: rows => {
          return <a onClick={_ => this.serarch(rows)} >{rows}</a>
        }
        // ...this.getColumnSearchProps('owner'),
      },
      {
        title: '位置',
        dataIndex: 'location',
        key: 'location',
        width: '20%',
      },
      {
        title: '主页',
        dataIndex: 'url',
        key: 'url',
        width: '15%',
        render: rows => {
          return <a href={rows} target='blank'>点击访问</a>
        }
      },
      {
        title: '总票数',
        dataIndex: 'total_votes',
        key: 'total_votes',
        ...this.getColumnSearchProps('total_votes'),
      },
      {
        title: '奖励',
        dataIndex: 'unpaid_blocks',
        key: 'unpaid_blocks',
      },
    ];
    return <Table columns={columns} dataSource={tablelist} className="node-table" />;
  }
}

export default connect(
  ({ ProductionNodeReducer }) => ({
    ProductionNodeReducer
  }),
  {
    fetchStart,
    setSearch
  }

)(ProductionNode);
