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
  // const keccak256 = require("keccak256");
  const { v4: uuidv4 } = require("uuid");
  const crypto = require("crypto");

  // ######################## FOUNDRY API PARAMS ############################

  const riWrt =
    "ri.ontology.main.ontology.b034a691-27e9-4959-9bcc-bc99b1552c97";
  const createVaultingRecord =
    "new-action-0cb194d6-882e-1c9e-3f8f-bacb0c93833b";
  const applyAction_createObject = `https://beckett.palantirfoundry.com/api/v1/ontologies/${riWrt}/actions/${createVaultingRecord}/apply`;

  //############################### GET TOKEN ############################
  const { Parameters } = await new aws.SSM()
    .getParameters({
      Names: ["FOUNDRY_TOKEN"].map((secretName) => process.env[secretName]),
      WithDecryption: true,
    })
    .promise();

  const token = Parameters;

  const todayDate = new Date().toISOString(); // ISO 8601 format
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
        "submitted_date": todayDate,
        "vault_status": "deposit_request",
        "action_type": "Deposit",
        "vaulted_item_unique_id": `${newId}`,
        "salt": `${saltHashValue()}`,

        // ############# NOT REQUIRED PARAMS ##############

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
          status: "success",
          status_code: response.status,
          status_message: response.statusText,
        });
      })
      .catch((error) => {
        res.send({
          status: "error",
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

  const riUpd =
    "ri.ontology.main.ontology.b034a691-27e9-4959-9bcc-bc99b1552c97";
  const updateNFTRecord = "new-action-add75843-1aee-ceb2-4309-0ba49daf2a1d";
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
        "nft_token_ID": req.body.nft_token_id,
        "nft_collection_address": req.nft_collection_address,
      },
    },
  };

  if (token[0].Value.length === 0) {
    res.status(500).send("No API key found");
  } else {
    axios(options)
      .then((response) => {
        res.send({
          status: "successfully updated",
          status_code: response.status,
          status_message: response.statusText,
        });
      })
      .catch((error) => {
        console.log(error);
        res.send({
          status: "error",
          data: error.message,
          status_code: error.response.status,
          status_message: error.response.statusText,
        });
      });
  }
});

app.listen(3000, function () {
  console.log("App started");
});

module.exports = app;