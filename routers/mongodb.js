const express = require('express');
const router = express.Router();
const url = require('url');
var bodyParser = require('body-parser');
const apiMongodbPlugin = require('@eosio-toppings/api-mongodb-plugin').default;
const connectMongo = require('@eosio-toppings/api-mongodb-plugin').connectMongo;
const { Transaction, ActionStraces, Block, Accounts, PublicKey, TransactionTraces } =require("./blockSchema")
const moment = require("moment") 

connectMongo('mongodb://119.3.126.220:27017/eos')
router.get("*", (req, res) => {
  let { pathname, query } = url.parse(req.url, true);
  let endpoint = pathname.substring(1); // remove leading '/' 
  if ( endpoint === "set_endpoint"){
    let { path } = query;
    connectMongo(path)
     .then(()=>{
        res.setHeader('Cache-Control', 'no-cache');
        res.json({response: `Mongodb connection changed to ${path}.`});
      })
      .catch(err=>{
        console.error(err);
        res.status(500);
        res.json(err).end();
      });
  }else{
    apiMongodbPlugin[endpoint](query)
      .then(doc=>{
        res.setHeader('Cache-Control', 'no-cache');
        res.json(doc);
      })
      .catch(err=>{
        console.error(err);
        res.status(500);
        res.json(err).end();
      });
  }
})
router.post("/transactionDetail",async (req,res)=>{
  try {
    
    const data = await Transaction.find({ "block_num":req.body.block_num})
    const result = {
      code:200,
      data:data
    }
    res.setHeader('Cache-Control', 'no-cache');
    res.json(result) 
  } catch (error) {
      res.status(500);
      res.json(error).end();
  }
})


router.post('/abiList', async (req,res) => {
   const name = req.body.name
   try {
    const data = await Accounts.find({ name : name, 'abi' : { $exists : true } })
    const result = {
      code:200,
      data:data
    }
    res.setHeader('Cache-Control', 'no-cache');
    res.json(result) 
  } catch (error) {
      res.status(500);
      res.json(error).end();
   }
} )

router.post("/transactions", async (req, res) => {
  try { 

    const data = await Transaction.find({}).limit(25).sort({block_num:-1})
    // const total = await Transaction.find({}).countDocuments()
    const result = {
      code:200,
      data:data,
      total:200
    }
    res.setHeader('Cache-Control', 'no-cache');
    res.json(result) 

  } catch (error) {
    res.status(500);
    res.json(error).end();
  }

})

router.post("/pubKey", async (req, res) => {
  const public_key = req.body.key
  try { 
    const data = await PublicKey.find({public_key})

    const result = {
      code:200,
      data:data
    }
    res.setHeader('Cache-Control', 'no-cache');
    res.json(result) 

  } catch (error) {
    res.status(500);
    res.json(error).end();
  }

})


router.post("/get_blocks", async (req, res) => {
  try { 
    const data = await Block.findOne({}).sort({block_num:-1})
    const result = {
      code:200,
      data:data
    }
    res.setHeader('Cache-Control', 'no-cache');
    res.json(data) 

  } catch (error) {
    res.status(500);
    res.json(error).end();
  }

})

/**
 * limit：number|| 20
 */
router.post("/TransactionTraces", async (req, res) => {
  if(req.body.numb){
    try { 
      const number = parseInt(req.body.numb) 
      if(number != NaN){
        const data = await TransactionTraces.find({}).where('block_num').gt(number-20).lte(number).sort({block_num:-1})
        const result = {
          code:200,
          data:data
        }
        res.setHeader('Cache-Control', 'no-cache');
        res.json(data) 
      }else{
        res.status(500);
      } 
  
    } catch (error) {
      res.status(500);
      res.json(error).end();
    }
  }
})

router.post("/actions_traces", async (req, res) => {
  try { 
    let  {contract, act, name,  pageNum, start, end, pageSize } =  req.body

    let startTime =  start ? start : moment().subtract( 6,'days').format("YYYY-MM-DD")
    let endTime =  end ? end : moment().add(1,'days').format("YYYY-MM-DD")
    let search1 ={
      "createdAt":{$gte: new Date(startTime),$lte: new Date(endTime)}
    }
    if(name){
      search1["actions.authorization.actor"] = name
    }
    if(contract){
      search1["actions.account"] = contract
    }
    if(act){
      search1["actions.name"] = act
    }

    let pageNums = pageNum ? parseInt(pageNum)  : 1
    let limit = pageSize ? parseInt(pageSize) : 10
    const data = await Transaction.find(search1).limit(limit).sort({block_num:-1}).skip(pageNums*limit-limit)
    // const total = await Transaction.find(search1).countDocuments()

    const result = {
      code:200,
      data:{
        action:data,
        total:200,
      }
    }
    res.setHeader('Cache-Control', 'no-cache');
    res.json(result) 

  } catch (error) {
    res.status(500);
    res.json(error).end();
  }

})

router.post("/actions_traces_query", async (req, res) => {
  try { 
    let  {contract, act, name,  pageNum, start, end, pageSize } =  req.body

    let startTime =  start ? start : moment().subtract( 6,'days').format("YYYY-MM-DD")
    let endTime =  end ? end : moment().add(1,'days').format("YYYY-MM-DD")
    let search1 ={
      "createdAt":{$gte: new Date(startTime),$lte: new Date(endTime)}
    }
    if(name){
      search1["act.authorization.actor"] = name
    }
    if(contract){
      search1["act.account"] = contract
    }
    if(act){
      search1["act.name"] = act
    }

    let pageNums = pageNum ? parseInt(pageNum)  : 1
    let limit = pageSize ? parseInt(pageSize) : 10
    const data = await ActionStraces.find(search1).limit(limit).sort({block_num:-1}).skip(pageNums*limit-limit)
    // const total = await ActionStraces.find(search1).countDocuments()

    const result = {
      code:200,
      data:{
        action:data,
        total:200,
      }
    }
    res.setHeader('Cache-Control', 'no-cache');
    res.json(result) 

  } catch (error) {
    res.status(500);
    res.json(error).end();
  }

})

router.post("/actions_traces_active", async (req, res) => {
  try { 
    let  { name,  pageNum, active, start, end, pageSize } =  req.body
    let startTime =  start ? start : moment().subtract( 6,'days').format("YYYY-MM-DD")
    let endTime =  end ? end : moment().add(1,'days').format("YYYY-MM-DD")
    let search ={
      "createdAt":{$gte: new Date(startTime),$lte: new Date(endTime)}
    }
    if(name){
      search["actions.account"] = name
    }
    if (active) {
      search["actions.name"] = active
    }
    let pageNums = pageNum ? pageNum : 1
    let limit = pageSize ? parseInt(pageSize) : 10
    
    const data = await Transaction.find(search).limit(limit).sort({block_num:-1}).skip(pageNums*limit-limit)
    // .where("createdAt").gt("2019-10-01").lt(endTime)
    
    // const total = await Transaction.find(search).countDocuments()

    const result = {
      code:200,
      data:{
        active:data,
        total:200,
      }
    }
    res.setHeader('Cache-Control', 'no-cache');
    res.json(result) 

  } catch (error) {
    res.status(500);
    res.json(error).end();
  }

})

router.post("/actions_traces_trx_id", async (req, res) => {
  try { 
    let  { trx_id } =  req.body
    let search ={
      trx_id
    }
    const data = await Transaction.find(search)
    const result = {
      code:200,
      data:{
        active:data,
      }
    }
    res.setHeader('Cache-Control', 'no-cache');
    res.json(result) 

  } catch (error) {
    res.status(500);
    res.json(error).end();
  }

})

/**
 * accountName, 
 * coinSymbol
 * pageSize
 * pageNuber
 * action
 */
// {$regex: JSON.stringify(eval(`/${pams.coinSymbol}/ig`)) }
router.post("/actionStraces", async (req,res)=>{
  let pams = req.body
  const limt = pams.pageSize ? parseInt(pams.pageSize) : 10
  const skip = pams.pageNum ? (parseInt(pams.pageNum)-1) * parseInt(limt) : 0
  const word = pams.coinSymbol
  delete pams.pageNum
  delete pams.pageSize
  delete pams.coinSymbol
  const searchObj ={
    ...pams,
    // "act.data.quantity":{$regex: eval(`/${word}+/`)}
  }
 
  let search = JSON.stringify(searchObj)
  try {
    const data = await ActionStraces.find(JSON.parse(search)).where('act.data.quantity').equals(new RegExp(word))
                                .limit(limt).sort({block_num:-1}).skip(skip)
      const result = {
        code:200,
        data:{
          action:data,
        }
      }
      res.setHeader('Cache-Control', 'no-cache');
      res.json(result)
  } catch (error) {
    console.log(error)
    res.status(500);
    res.json(error).end();
  }
})



module.exports = router;
