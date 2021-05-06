
import LcScatter from 'lcscatter'
import { JsonRpc,ecc } from 'lcnjs'
import {message} from 'antd'
export const rpc = new JsonRpc(window.rpcPath, {
  fetch
});

window.ecc = ecc 
export const rulesAccount = [{ required: true }, { validator: (_, value) => isAccount(value) ? Promise.resolve() : Promise.reject('账户名不合法') }]
export const rulesSymbol = [{ required: true }, { validator: (_, value) => isSymbol(value) ? Promise.resolve() : Promise.reject('通证格式错误') }]
export const isSymbol = (str) => {
  if (str && typeof str === 'string') {
    let arr = str.split(' ')
    // symbol类型 精度0-无限  通证符号 1到无限
    let reg = /^(([^0][0-9]+|0)\.([0-9]{1,20})$)|^(([^0][0-9]+|0)$)|^(([1-9]+)\.([0-9]{1,20})$)|^(([1-9]+)$)/
    let reg1 = /^([A-Z]{1,})$/
    // let reg =/^((([^0][0-9]+|0)\.([0-9]{1,}[ ]([A-Z]{1,}))$)|^([^0][0-9][ ]([A-Z]{1,})))$/
    console.log('arr[0])',arr[0])
    if (arr.length > 1 && reg.test(arr[0]) && reg1.test(arr[1])) {
      return true
    } else {
      return false
    }
  } else {
    return false

  }
}

export const isAccount = (str) => {
  if (str && typeof str === 'string') {
    // let qtest = /(^[a-z1-5]{6,12}$)|(^[a-z1-5]{1}((?!\\.\\.)[a-z1-5\\.]){4,10}[a-z1-5]{1}$)/
    let qtest = /(^[a-z1-5]{6,12}$)|(^[a-z1-5]{1}((?!\\.\\.)[a-z1-5\\.]){4,10}[a-z1-5]{1}$)|((^([a-z]{1,10}[\.][a-z]{1,10}){1,12}$)|^[a-z]{5,12}$)/
    if (qtest.test(str)) {
      return true
    } else {
      return false
    }
  } else {
    return false
  }
}

export const transactOpt = {
  blocksBehind: 30,//滞后块数，整数
  expireSeconds: 60,//超时秒数，整数
  broadcast: true,//是否广播交易，布尔型，默认值：true
  sign: true//是否签名，布尔类型，默认值：true

}
export const transactOptEosr = {
  blocksBehind: 30,//滞后块数，整数
  expireSeconds: 60,//超时秒数，整数
  broadcast: false,//是否广播交易，布尔型，默认值：true
  sign: false//是否签名，布尔类型，默认值：true

}

export const EpScatter = new LcScatter()
export const connectScatter = (callback) => {
  let AAA = new LcScatter()
  AAA.getLcn(async (err,api) => {

    try {
      if(err){
        window.eosr = api
        window.accountInfo = await AAA.getInfo()
        window.account = window.accountInfo.account
        if (callback && typeof callback == 'function') {
          callback(err,api)
        }
      }else{
        window.eosr = {}
        callback(err,api)
      }
      
    } catch (error) {
      console.log(error)
    }
  })
}

export const lcnOnSubmit = async(action) =>{
  try {
    let result
    if (!window.isDappPay) {
      result = await window.eosr.transacts({ actions: [action] }, transactOpt, true)
      
    } else {
      result = await window.eosr.transacts({ actions: [action] }, transactOpt)
      if (result) {
        message.success('成功')
      } else {
        message.error('失败')
      }
    }
  } catch (error) {
    message.error('失败 '+error.message)
  }
  
}


