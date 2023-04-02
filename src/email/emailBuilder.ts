//batchSend.js
import dotenv from 'dotenv'
const Sib = require('sib-api-v3-sdk');

dotenv.config()

 const emailFunction = () => {
   console.log('emailFunction');
   
   const client = Sib.ApiClient.instance;
   const apiKey:any = client.authentications['api-key']
   apiKey.apiKey = process.env.SENDINBLUE_KEY;
const tranEmailApi = new Sib.TransactionalEmailsApi();

const sender ={
   email:'moveochamp@gmail.com'
}

const receivers = [
   {
      email:'eranavru100@gmail.com'
   }
]

tranEmailApi.sendTransacEmail({
   sender,
   to: receivers,
   subject: 'hello',
   textContent: 'hello'

}).then(console.log('seee'))
.catch((err:any) =>console.log(err));
}

export default emailFunction


// new SibApiV3Sdk.TransactionalEmailsApi().sendTransacEmail({

//      "sender":{ "email":"moveochamp@gmail.com", "name":"eftaApp"},
//      "subject":"hello from EFTA",
//      "htmlContent":"<!DOCTYPE html><html><body><h1>My First Heading</h1><p>My first paragraph.</p></body></html>",
//      "params":{
//         "greeting":"Hi there",
//         "headline":"This is the default headline"
//      },
//    "messageVersions":[
//      //Definition for Message Version 1 
//      {
//          "to":[
//             {
//                "email":"eranavru100@gmail.com",
//                "name":"eran"
//             }
//          ],
//          "htmlContent":"<!DOCTYPE html><html><body><h1>Modified header!</h1><p>This is still a paragraph</p></body></html>",
//          "subject":"We are happy to be working with you"
//       },
     
//      // Definition for Message Version 2
//       {
//          "to":[
//             {
//                "email":"eranavru100@gmail.com",
//                "name":"version 2"
//             },
//          ]
//       }
//    ]

// }).then(function(data) {
//   console.log(data);
// }, function(error) {
//   console.error(error);
// });