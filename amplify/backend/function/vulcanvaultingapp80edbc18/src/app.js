/* Amplify Params - DO NOT EDIT
	API_VULCANAPI_APIID
	API_VULCANAPI_APINAME
	ENV
	REGION
Amplify Params - DO NOT EDIT */ /*
Use the following code to retrieve configured secrets from SSM:

const aws = require('aws-sdk');

const { Parameters } = await (new aws.SSM())
  .getParameters({
    Names: ["FOUNDRY_TOKEN"].map(secretName => process.env[secretName]),
    WithDecryption: true,
  })
  .promise();

Parameters will be of the form { Name: 'secretName', Value: 'secretValue', ... }[]
*/
/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

const express = require("express");
const bodyParser = require("body-parser");
const awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");

// declare a new express app
const app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

/****************************
 * put method for Vulcan Records *
 ****************************/


app.put("/deposit", async function (req, res) {
  const axios = require("axios");
  const aws = require("aws-sdk");

  const { v4: uuidv4 } = require("uuid");
  const crypto = require("crypto");

  // ######################## FOUNDRY API PARAMS ############################

  const riWrt =
    "ri.ontology.main.ontology.b034a691-27e9-4959-9bcc-bc99b1552c97";

  const createVaultingRecord =
    "new-action-0cb194d6-882e-1c9e-3f8f-bacb0c93833b";
  const applyAction_createObject = `https://beckett.palantirfoundry.com/api/v1/ontologies/${riWrt}/actions/${createVaultingRecord}/apply`;

  //############################### GET TOKEN ############################
  const { Parameters } = await new aws.SSM() // get the secret from SSM
    .getParameters({
      Names: ["FOUNDRY_TOKEN"].map((secretName) => process.env[secretName]), 
      WithDecryption: true,   
    })
    .promise();

  const token = Parameters;

  const todayDate = new Date().toISOString(); // ISO format

  const newId = uuidv4(); // UUID

  //############################### GENERATE SALT ############################
  var genRandomString = function (length) {
    return crypto
      .randomBytes(Math.ceil(length / 2))
       .toString("hex") /** convert to hexadecimal format */
      .slice(0, length); /**return required number of characters */
  };

  function saltHashValue() {
    var salt = genRandomString(36); /** Gives us salt of length 36 */
    return salt;
  }

  //################################ POST VAULTING RECORD ############################

  const options = {
    method: "POST",
    url: applyAction_createObject,
    headers: {
      Authorization: "Bearer " + token[0].Value,
      "Content-Type": "application/json",
    },
    data: {
      "parameters": {
        // ######## FORM DATA #########
        "date_of_birth": req.body.dateOfBirth,
        "first_name": req.body.firstName,
        "email": req.body.email,
        "zip": req.body.zip,
        "city": req.body.city,
        "last_name": req.body.lastName,
        "wallet_address": req.body.walletAddress,
        "vaulted_item_description": req.body.itemDesc,
        "address_line_1": req.body.address1,
        "vaulted_item_name": req.body.itemName,
        "address_line_2": req.body.address2,
        "state": req.body.state,

        // ######## GENERATED VALUES #########
        "submitted_date": todayDate,
        "vault_status": "deposit_request",
        "action_type": "Deposit",
        "vaulted_item_unique_id": `${newId}`,
        "salt": `${saltHashValue()}`,

        // ############# NOT REQUIRED BY PALANTIR ##############
        "image_filename": "",
        "date_vaulted": "",
        "date_received": "",
      },
    },
  };

  if (token[0].Value.length === 0) {
    res.status(500).send("No API key found");
  } else {

    axios(options)
      .then((response) => {
        res.send({
          status_code: response.status,
          status_message: response.statusText,
        });
      })
      .catch((error) => {
        res.send({
          data: error.message,
          status_code: error.response.status,
          status_message: error.response.statusText,

        });
      });
  }
});

/****************************
 * (put) withdraw method for Vulcan Records *
 ****************************/


app.put("/withdraw", async function (req, res) {
  const axios = require("axios");
  const aws = require("aws-sdk");

  const { v4: uuidv4 } = require("uuid");
  const crypto = require("crypto");
  const utils = require('web3-utils')

  // ######################## FOUNDRY API PARAMS ############################

  const riWrt =
    "ri.ontology.main.ontology.b034a691-27e9-4959-9bcc-bc99b1552c97";

  const createVaultingRecord =
    "new-action-0cb194d6-882e-1c9e-3f8f-bacb0c93833b";
  const applyAction_createObject = `https://beckett.palantirfoundry.com/api/v1/ontologies/${riWrt}/actions/${createVaultingRecord}/apply`;

  //############################### GET TOKEN ############################
  const { Parameters } = await new aws.SSM() // get the secret from SSM
    .getParameters({
      Names: ["FOUNDRY_TOKEN"].map((secretName) => process.env[secretName]), 
      WithDecryption: true,   
    })
    .promise();

  const token = Parameters;

  const todayDate = new Date().toISOString(); // ISO format

  const newId = uuidv4(); // UUID

  //############################### GENERATE SALT ############################
  var genRandomString = function (length) {
    return crypto
      .randomBytes(Math.ceil(length))
       .toString("hex") /** convert to hexadecimal format */
  };

  function saltHashValue() {
    var salt = genRandomString(32);  /** Gives us salt of length 32 */
    return salt;
  }

  const salt = saltHashValue()

  //################################ GENERATE  soliditySha3 ############################
  function generateKeccak256() {

    const hash = utils.soliditySha3(
      {
        type: 'string',
        value: req.body.firstName,
      },
      {
        type: 'string',
        value: req.body.lastName,
      },
      {
        type: 'string',
        value: req.body.address1,
      },
      {
        type: 'string',
        value: req.body.city,
      },
      {
        type: 'string',
        value: req.body.state,
      },
      {
        type: 'string',
        value: req.body.zip,
      },
      {
        type: 'bytes32',
        value: salt,
      }
    )        
  
    return hash
  }


  //################################ POST VAULTING RECORD ############################

  const options = {
    method: "POST",
    url: applyAction_createObject,
    headers: {
      Authorization: "Bearer " + token[0].Value,
      "Content-Type": "application/json",
    },
    data: {
      "parameters": {
        // ######## FORM DATA #########
        "date_of_birth": req.body.dateOfBirth,
        "first_name": req.body.firstName,
        "email": req.body.email,
        "zip": req.body.zip,
        "city": req.body.city,
        "last_name": req.body.lastName,
        "wallet_address": req.body.walletAddress,
        "address_line_1": req.body.address1,
        "address_line_2": req.body.address2,
        "state": req.body.state,
        "withdrawal_nft_token_id": req.body.tokenID,
        // ######## GENERATED VALUES #########
        "vaulted_item_description": `Withdraw_Request-${req.body.tokenID}`,
        "vaulted_item_name": `Withdraw_Request-${req.body.tokenID}`,
        "submitted_date": todayDate,
        "vault_status": "withdraw_request_unsigned",
        "action_type": "Withdrawal",
        "vaulted_item_unique_id": `${newId}`,
        "salt": salt,

        // ############# NOT REQUIRED BY PALANTIR ##############
        "image_filename": "",
        "date_vaulted": "",
        "date_received": "",
      },
    },
  };

  if (token[0].Value.length === 0) {
    res.status(500).send("No API key found");
  } else {

    axios(options)
      .then((response) => {
        res.send({
          status_code: response.status,
          status_message: response.statusText,
          user_info_hash: generateKeccak256(),
          vaulted_item_unique_id: newId,
        });
      })
      .catch((error) => {
        res.send({
          data: error.message,
          status_code: error.response.status,
          status_message: error.response.statusText,

        });
      });
  }
});
/****************************
 * put method for NFT Records *
 ****************************/

app.put("/updatenftrecords", async function (req, res) {
  const axios = require("axios");
  const aws = require("aws-sdk");

  // ######################## FOUNDRY API PARAMS ############################

  const updateNFTRecord = "new-action-9b914db3-5648-e82a-448d-bdf78acb4f15";
  const riUpd =
    "ri.ontology.main.ontology.b034a691-27e9-4959-9bcc-bc99b1552c97";
    const applyAction_updateObject = `https://beckett.palantirfoundry.com/api/v1/ontologies/${riUpd}/actions/${updateNFTRecord}/apply`;



  //############################### GET TOKEN ############################
  const { Parameters } = await new aws.SSM()
    .getParameters({
      Names: ["FOUNDRY_TOKEN"].map((secretName) => process.env[secretName]),
      WithDecryption: true,
    })
    .promise();

  const token = Parameters;

  //################################ PUT NFT RECORD ############################

  const options = {
    method: "POST",
    url: applyAction_updateObject,
    headers: {
      Authorization: "Bearer " + token[0].Value,
      "Content-Type": "application/json",
    },
    data: {
      "parameters": {
        "VulcanNftRecord": req.body.nft_record_uid,
        "status": req.body.status,
        "nft_token_id": req.body.nft_token_id,
        "nft_collection_address": req.body.nft_collection_address,
      },
    },
  };

  if (token[0].Value.length === 0) {

    res.status(500).send("No API key found");

  } else {

    axios(options)
      .then((response) => {
        res.send({
          status_code: response.status,
          status_message: response.statusText,
        });
      })
      .catch((error) => {
        console.log(error);
        res.send({
          data: error.message,
          status_code: error.response.status,
          status_message: error.response.statusText,
        });
      });
  }
});

/****************************
 * put Delta for NFT Records *
 ****************************/

 app.put("/withdrawexecute", async function (req, res) {
  const axios = require("axios");
  const aws = require("aws-sdk");
  
  // ########################  API PARAMS ############################
  const API_URL = `https://dev.beckett.com:3000/vaulting/execute`

  const action_type_update_vaulting_record = `new-action-cc248c96-dff1-9045-3ae3-46f6706908ee`
  const riUpd = "ri.ontology.main.ontology.b034a691-27e9-4959-9bcc-bc99b1552c97";
  const applyAction_updateObject = `https://beckett.palantirfoundry.com/api/v1/ontologies/${riUpd}/actions/${action_type_update_vaulting_record}/apply`;

    //############################### GET TOKEN ############################
    const { Parameters } = await new aws.SSM()
    .getParameters({
      Names: ["FOUNDRY_TOKEN"].map((secretName) => process.env[secretName]),
      WithDecryption: true,
    })
    .promise();

  const token = Parameters;


  
  // ################################ BRAVO CALL ############################
  const options = {
    method: "POST",
    url: API_URL,
    headers: {
      "Content-Type": "application/json",
    },
    data: {
        "from": req.body.from,
        "to": req.body.to,
        "value": req.body.value,
        "nonce": req.body.nonce,
        "gas": req.body.gas,
        "data": req.body.data,
        "signature": req.body.signature,
        "collection": "0x17e95b844f8bdb32f0bcf57542f1e5cd79a2b342",
        "token_id": parseInt(req.body.token_id),
    },
  };
    axios(options)
    .then((response) => {

      const options = {
        method: "POST",
        url: applyAction_updateObject,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token[0].Value,
        },
        data: {
          "parameters": {
            "VulcanVaultingRecord": req.body.vaulted_item_unique_id,
            "execution_job_id": response.data.job_id,
            "execution_response_code": response.status,
            "vault_status": "withdraw_request_signed",
          }
        },
      };

      // ################################ PALANTIR CALL ############################
      axios(options)
      .then((response) => {
        res.send({
          status_code: response.status,
          job_id: response.data.job_id,
        });
      })
      
      // ################################ ERROR HANDLING PALANTIR ############################
      .catch((error) => {
        res.send({
          type_err: "palantir",
          data: error.message,
          status_code: error.status,
        });
      });
    })
      
    // ################################ ERROR HANDLING BRAVO ############################
    .catch((error) => {
        res.send({
          type_err: "bravo",
          data: error.message,
          status_code: error.status,
        });
      });
});


app.listen(3000, function () {
  console.log("App started");
});

module.exports = app;