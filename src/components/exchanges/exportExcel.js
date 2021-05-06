import moment from 'moment'
export default function tableToExcel(jsonDatas,name){
    let file = name+'--' + moment().format('YYYY-MM-DD HH:mm:ss')

    let transferSource = jsonDatas.map((item, index) => {
        let { block_num,
            trx_id,
            publish_account,
            from,
            to,
            quantity,
            memo, block_time } = item
            // block_time =   moment(block_time).add(8,"H").format('YYYY-MM-DD HH:mm:ss')
            block_time =   moment(block_time).format('YYYY-MM-DD HH:mm:ss')
            let amount = item.amount?item.amount:0
        quantity = amount.toFixed(item.decimal) + " " + item.symbol
        return {
            // key: index,
            block_num,
            trx_id,
            publish_account,
            from,
            to,
            quantity,
            memo,
            block_time
        }
    })
    //要导出的json数据
    var jsonData = [
      {
        name:'路人甲',
        phone:'123456789',
        email:'000@123456.com'
      },
      {
        name:'炮灰乙',
        phone:'123456789',
        email:'000@123456.com'
      },
      {
        name:'土匪丙',
        phone:'123456789',
        email:'000@123456.com'
      },
      {
        name:'流氓丁',
        phone:'123456789',
        email:'000@123456.com'
      },
    ]
    //列标题，逗号隔开，每一个逗号就是隔开一个单元格
    let str = `区块编号,交易id,合约账户,转出账户,转入账户,金额,备注,区块时间\n`;
    //增加\t为了不让表格显示科学计数法或者其他格式
    for(let i = 0 ; i < transferSource.length ; i++ ){
      for(let item in transferSource[i]){
          str+=`${transferSource[i][item] + '\t'},`;     
      }
      str+='\n';
    }
    //encodeURIComponent解决中文乱码
    let uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str);
    //通过创建a标签实现
    var link = document.createElement("a");
    link.href = uri;
    //对下载的文件命名
    link.download = file+ ".csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }