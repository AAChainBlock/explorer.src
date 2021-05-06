const express = require('express');
var bodyParser = require('body-parser');
const path = require('path');
const mongodb = require('./routers/mongodb');
const cors = require('cors');
const openBrowser = require('./helpers/openBrowser');
const fs = require('fs');
const dotenv = require('dotenv');

const app = express();
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());


// app.all('*', function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "X-Requested-With");
//   res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
//   res.header("X-Powered-By",' 3.2.1')
//   res.header("Content-Type", "application/json;charset=utf-8"); 
//   next();
// });

// app.use(bodyParser.urlencoded({
//   extends: true
// }))
dotenv.config();
// const envConfig = fs.existsSync('.env.local') && dotenv.parse(fs.readFileSync('.env.local'));
const envConfig ={
  REACT_APP_MONGODB_PORT:27017,
  REACT_APP_MONGODB_DB_NAME:"eos",
  REACT_APP_LOCAL_SERVICE_PORT:8081,
  REACT_APP_APP_SERVE_PORT:3001
}
if (envConfig){
  for (let k in envConfig) {
    process.env[k] = envConfig[k];
  }
}
let endpointConfig;
if(`${process.env.MODE}` !== `development`){  
  let endpointConfigPath = process.argv.slice(2)[0];
  // endpointConfig = JSON.parse(fs.readFileSync(endpointConfigPath, 'utf-8')); 

  endpointConfig= {
    DBEndpoint:'mongodb://119.3.126.220:27017/eos',
    NodesEndpoint:'/chain'
  }
}

const PORT = process.env.REACT_APP_APP_SERVE_PORT;

// If serve.js is called from yarn serve-clear, set lastTimestamp = current timestamp
const lastTimestamp = process.env.CLEARBROWSERSTORAGE ? Math.floor(new Date() / 1000) : "";

app.use((req, res, next) => {

  // Always assign a value to the lastTimestamp cookie, either current timestamp or an empty string.
  res.cookie("lastTimestamp", lastTimestamp );
  next();
});

//only serve api calls ( not the static build/ ) in development mode, create react app in develop will call the APIs from a proxy.
if ( process.env.MODE !== 'development'){
  app.use(express.static(path.join(__dirname, 'build')));
}

// app.use("/api/mongodb", mongodb);

// app.use("/new_explore/api/mongodb", mongodb);

app.on('error', function (e) {
  // do your thing
  console.log(e);
});


app.listen(process.argv[2]?process.argv[2]:PORT, ()=>{
  console.log(`Listening ${process.env.MODE !== `development`  ? `static \`build/\` folder and ` : `` }API calls on port ${PORT} in production mode.`);
  console.log(``);
  if(`${process.env.MODE}` !== `development`){
    let url;

    // if(endpointConfig.hasOwnProperty("NodesEndpoint") && endpointConfig["NodesEndpoint"] != "" 
    //     && endpointConfig.hasOwnProperty("DBEndpoint") && endpointConfig["DBEndpoint"] != ""){
    //   url = "http://localhost:" + PORT +"?nodeos="+endpointConfig.NodesEndpoint.trim()+"&mongodb="+endpointConfig.DBEndpoint.trim();
    // }else{
      url = "http://localhost:" + PORT;
    // }    
    console.log(`Application is ready on "${url}".`);
    console.log()
    console.log(`You can now view EOSIO Labs™: EOSIO Explorer in the browser.`);
    openBrowser(url);
  }
});
