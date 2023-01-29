const axios = require('axios')
const fs = require('fs')
const jsonData = require('./all_with_data.json')
// # curl --request PUT \
  // # --url https://api.cloudflare.com/client/v4/accounts/account_identifier/storage/kv/namespaces/namespace_identifier/bulk \
  // # --header 'Content-Type: application/json' \
  // # --header 'X-Auth-Email: ' \
  // # --data '[
  // # {
    // # "base64": false,
    // # "expiration": 1578435000,
    // # "expiration_ttl": 300,
    // # "key": "My-Key",
    // # "metadata": {
      // # "someMetadataKey": "someMetadataValue"
    // # },
    // # "value": "Some string"
  // # }
// # ]'

function singleRequest(sticker){
  return {
    "base64": false,
    "key": sticker.code,
    "metadata": {
      "name": sticker.name,
      "glyph": sticker.glyph    
    },
    "value": sticker.dataUri
  }
}

function sendSingle(sticker){
  let json_data = singleRequest(sticker)
  var FormData = require('form-data');
  var data = new FormData();
  data.append('metadata', json_data["metadata"]);
  data.append('value', json_data["value"]);
  
  var config = {
    method: 'put',
    url: `https://api.cloudflare.com/client/v4/accounts/7b8e91c3be02e5133fb4d5954d609f8d/storage/kv/namespaces/8534bbdf6e894ee087dced7ae7904ebf/values/${json_data["key"]}`,
    headers: { 
      'Authorization': 'Bearer mAkNt1DK6g8shnoT-TySHFBiF4-bvA9PBa5uuuj4', 
      'Cookie': '__cflb=0H28vgHxwvgAQtjUGUFqYFDiSDreGJnUsnaLmg5Hbpy; __cfruid=a4e6345f2c8b2c57c056f58288388df6a3dd6df4-1673338223', 
      ...data.getHeaders()
    },
    data : data
  };
  
  axios(config)
  .then(function (response) {
    //console.log(JSON.stringify(response.data));
    console.log(response.status)
  })
  .catch(function (error) {
    console.log(error);
  });
  
}

jsonData.map(e=>{sendSingle(e)})