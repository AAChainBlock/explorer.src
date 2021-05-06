import { Select, Spin } from 'antd';
import debounce from 'lodash/debounce';

const { Option } = Select;

class SelectMol extends React.Component {
  constructor(props) {
    super(props);
    this.lastFetchId = 0;
    this.fetchUser = debounce(this.fetchUser, 800);
  }

  state = {
    data: [],
    value: [],
    fetching: false,
  };

  fetchUser = value => {
    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;
    this.setState({ data: [], fetching: true });
    // fetch('https://randomuser.me/api/?results=5')
    //   .then(response => response.json())
    //   .then(body => {
    //     if (fetchId !== this.lastFetchId) {
    //       // for fetch callback order
    //       return;
    //     }
    //     const data = body.results.map(user => ({
    //       text: `${user.name.first} ${user.name.last}`,
    //       value: user.login.username,
    //     }));
    //     this.setState({ data, fetching: false });
    //   });
    if(this.props.fetch){
        this.props.fetch()
    }
    
  };

  handleChange = value => {
    this.setState({
      value,
      data: [],
      fetching: false,
    });
  };

  render() {
    const { fetching, data, value } = this.state;
    const { sChange, sPlaceholder, sdata} = this.props 
    let data = sdata ? sdata: []
    return (
      <Select
        mode="multiple"
        labelInValue
        value={value}
        placeholder={sPlaceholder}
        notFoundContent={fetching ? <Spin size="small" /> : null} 
        filterOption={false}
        onSearch={this.fetchUser}
        onChange={ val => sChange(val)}
        style={{ width: '100%' }}
      >
        {data.map(d => (
          <Option key={d.value}>{d.text}</Option>
        ))}
      </Select>
    );
  }
}

export default SelectMol 