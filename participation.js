export default  {
    // code
	// scope
	// table
	// json
	// limit
	// lower_bound
	// upper_bound
	// index_position	
    // key_type

    get_table_row: {
        code: "eosio",
        json: true,
        limit: 10,
        scope: "eosio",
        table: "rammarket"
      },

      //account_name：合约的托管账号，string

      get_abi: {
        account_name:""
      },

      //account_name：合约的托管账号，string

      get_account: {
        account_name:""
      },

      //block_num_or_id：区块编号或id，number或string类型
      get_block: {
        block_num_or_id:""
      },


      //block_num_or_id：区块编号或id，number或string类型
      get_block_header_state: {
        block_num_or_id:""
      },


      //account_name：合约托管账号，string
      get_code: {
        account_name:""
      },


    //方法返回指定账号的通证余额信息
    //  code：合约托管代码
    // 	account：要查询余额的持币账户
    // 	symbol：通证符号，可选

      get_currency_balance: {

      },
      
    //方法返回通证的总体发行信息，它是对RPC接
    //	code：合约托管代码
    // 	symbol：通证符号

      get_currency_stats: {

      }
}