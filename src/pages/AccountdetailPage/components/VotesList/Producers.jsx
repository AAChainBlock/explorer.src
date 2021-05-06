import React  from 'react';
// import { SearchOutlined } from '@ant-design/icons';
import { Table, Input, Button } from 'antd';
// import Highlighter from 'react-highlight-words';

import locationdict from "./locationdict"
import './Producers.scss'


class Producers extends React.Component {
  constructor(props){
    super(props)
  }
  state = {
    searchText: '',
  };

  componentDidMount(){
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
    render: text =>text
    //  (
    //   <Highlighter
    //     highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
    //     searchWords={[this.state.searchText]}
    //     autoEscape
    //     textToHighlight={text?text.toString():''}
    //   />
    // ),
  });

  handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.setState({ searchText: selectedKeys[0] });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };
  comparison(prps){
    return function (a,b) {
      return a[prps] - b[prps]
    }
  }
  render() {

    const { producers  } = this.props
    let rows = producers ? producers :[]
    
    let tablelist = []
     tablelist = rows ? rows.map((item,index)=>{
      item.key = index
      item.location = locationdict[item.location]?locationdict[item.location]:"不详"
      item.ranking = item.ranking? item.ranking : index+1
      // item.total_votes = item.total_votes && typeof item.total_votes == String && item.total_votes.length >0 ? 
      //                       item.total_votes.split(".")[0] : "0"
      return item
    }):[]
    tablelist = tablelist.sort( this.comparison('ranking'))
    const columns = [
      {
        title: '排名',
        dataIndex: 'ranking',
        key: 'ranking',
        width: '5%',
      },
      {
        title: '账户',
        dataIndex: 'owner',
        key: 'owner',
        width: '15%',
        ...this.getColumnSearchProps('owner'),
      },
      {
        title: '位置',
        dataIndex: 'location',
        key: 'location',
        width: '10%',
        // ...this.getColumnSearchProps('age'),
      },
      {
        title: '主页',
        dataIndex: 'url',
        key: 'url',
        width: '15%',
        render:rows=>{
          return <a href={rows} target='blank'>点击访问</a>
        }
      },
      {
        title: '投票占比',
        dataIndex: 'prenst',
        key: 'prenst',
        // render:rows=>{
        //   return <a href={rows} target='blank'>点击访问</a>
        // }
      },
      {
        title: '投票数',
        dataIndex: 'pdv',
        key: 'pdv',
        // render:rows=>{
        //   return <a href={rows} target='blank'>点击访问</a>
        // }
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
    return <Table columns={columns} dataSource={tablelist}   className="node-table"/>;
  }
}

export default Producers;
