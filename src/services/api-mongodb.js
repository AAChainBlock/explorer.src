import { from } from 'rxjs';
import { ajax } from 'rxjs/ajax';
let url = ':3001'
export default ( apiPath ) => navigator.userAgent !== "ReactSnap"
?
  ajax({
    url :`${url}/api/mongodb/${apiPath}`,
    timeout: process.env.REACT_APP_API_TIMEOUT_TIME,
    responseType: "json"
  })
: //If we are prerendering using react snap, return a promise that resolved with a repsonse with { repsonse: undefined }
  from(new Promise((resolve, reject)=>{
    resolve({response: undefined});
  }))
