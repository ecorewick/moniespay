

const dboperations = require('./dboperations');
var express = require('express');
var bodyParser = require('body-parser');
const dotenv = require('dotenv');
 const jwt = require('jsonwebtoken');
const cors = require('cors');

const multer = require('multer');

var CryptoJS = require("crypto-js");
const PayU = require("payu-websdk");
var https = require('https'),
crypto = require('crypto'),
events = require('events'),
qs = require('querystring'),
eventEmitter = new events.EventEmitter();
const port = process.env.PORT || 3080;

const axios = require('axios');
var FormData = require('form-data');

const sql = require("mssql");
var config = require('./dbconfig');


const { sign } = require("jsonwebtoken");
const path = require('path');
// const { hostname } = require('os');

var app = express();
var router = express.Router();


// const Binance = require('binance-api-node').default;
// const technicalindicators = require('technicalindicators');
// const client = Binance();
// let historicalData = [];
// const emaPeriod = 15;
// const riskRewardRatio = 3;

const sessiontoken="0";

//set for Global configuration access
dotenv.config();

// app.use(cors());
app.use(cors({origin:"*"}))
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


app.use('/api', router);

app.use('/images', express.static('images'));

var drespose="";

//// Global START

//var data = new FormData();





const form = new FormData();



console.log('Data received:---1');


form.append('email', 'laxmikanta.28@gmail.com');
form.append('password', 'Pintu#84');






const payuClient = new PayU(
  {
    key: process.env.MERCHANT_KEY,
    salt: process.env.MERCHANT_SALT,
  },
  process.env.MERCHANT_MODE
);


const getpay2allprofile = async (token1) => {
 // const data = { date1: date1, date2: date2 }
  //const tokenApp = window.localStorage.getItem('token');
  const { data: res } = await axios.get(`https://erp.pay2all.in/api/user`, {
    headers: { Authorization: `Bearer ${token1}`, },
  });
  return res;
};

// async function getpay2allprofile(token1) {

//     try
//     {        


//         console.log('****Profile*******');

//         var axios = require('axios');
//         var configcd = {
//           method: 'get',
//           url: 'https://erp.pay2all.in/api/user',
//           headers: { 
//              'Authorization': `Bearer ${token1}`,
//           }
//         };

// axios(configcd)
// .then(function (response) {
//   console.log(JSON.stringify(response.data));
// 	//console.log(response.data);
	
	

//     console.log('-----**BALANACE START**-------');
//     console.log(JSON.stringify(response.data.data.id));
// 	console.log(JSON.stringify(response.data.data.name));
// 	console.log(response.data.data.id);
//     console.log(response.data.data.balance.user_balance);
//     console.log('-----**BALANACE END**-------');
//  return response.data.data.balance.user_balance;


// })
// .catch(function (error) {
//   console.log(error);
// });


 


//     } catch(error){

//     }
  
    
// };

router.post("/initiate-payment-deposit", async  function(req, res){
  try {
    


    const {userid, txnid, amount, productinfo, firstname, email, phone} = req.body;
   
    console.log('IIIIIIIIIIIIIIIIIIIIIIII');
   
    console.log(req.body.userid);
    console.log(req.body.txnid);
    console.log(req.body.amount);
    console.log(req.body.productinfo);
    console.log(req.body.firstname);
    console.log(req.body.email);
    console.log(req.body.phone);



    console.log(req.body.sessionuserid);
    console.log(req.body.accountno);
    console.log(req.body.amount);
    console.log(req.body.paidtype);
    console.log(req.body.provideid);
    console.log(req.body.serviceprovidername);
    console.log(req.body.uniqueid);
      
    console.log('KKKKKKKKKKKKKKKK');
   
    console.log(req.body.mobileno);
    console.log(req.body.token);
    console.log(req.body.category);
    console.log(req.body.ip);



   // insert_transaction_directpayment(req.body.sessionuserid,req.body.accountno,req.body.provideid,req.body.uniqueid,req.body.serviceprovidername,req.body.mobileno,req.body.amount,req.body.paidtype,req.body.category,req.body.ip,req.body.txnid,req.body.token);
   

    let data = {
      isAmountFilledByCustomer: false,
      txnid,
      amount,
      currency: "INR",
      productinfo,
      firstname,
      email,
      phone,
      surl: `https://www.moniespay.com/verifypayudeposit/${txnid}`,
      furl: `https://www.moniespay.com/verifypayudeposit/${txnid}`,
    };


     
    const hashString = `${process.env.MERCHANT_KEY}|${data.txnid}|${data.amount}|${data.productinfo}|${data.firstname}|${data.email}|||||||||||${process.env.MERCHANT_SALT}`;
    const hash = crypto.createHash("sha512").update(hashString).digest("hex");
    data.hash = hash;
    console.log(hash)

   
    if(req.body.category=="mobile"){
		 console.log('PPPPPP');
		 console.log(req.body.uniqueid);
        addmoney_transaction(req.body.userid,txnid,amount,productinfo,email,phone,firstname);
    }
    else{
		 console.log('QQQQQQQQQ');
		  console.log(userid);
		 console.log(req.body.uniqueid);
		updateaddmoney_transaction(userid,txnid,amount,productinfo,req.body.email,req.body.phone,req.body.firstname,req.body.uniqueid);
    }
    

     
    

    let response = await payuClient.paymentInitiate(data);
    console.log(response);
      res.json(response);
    //res.send(response);
  } catch (error) {
    console.error("Error initiating payment:", error);
    res.status(500).send(error);
  }
});



router.post("/initiate-payment", async  function(req, res){
//app.post("/initiate-payment", async (req, res) => {
  try {
    


    const {userid, txnid, amount, productinfo, firstname, email, phone} = req.body;
   
   
    console.log('IIIIIIIIIIIIIIIIIIIIIIII');
   
    console.log(req.body.userid);
    console.log(req.body.txnid);
    console.log(req.body.amount);
    console.log(req.body.productinfo);
    console.log(req.body.firstname);
    console.log(req.body.email);
    console.log(req.body.phone);



    console.log(req.body.sessionuserid);
    console.log(req.body.accountno);
    console.log(req.body.amount);
    console.log(req.body.paidtype);
    console.log(req.body.provideid);
    console.log(req.body.serviceprovidername);
    console.log(req.body.uniqueid);
      
    console.log('KKKKKKKKKKKKKKKK');
   
    console.log(req.body.mobileno);
    console.log(req.body.token);
    console.log(req.body.category);
    console.log(req.body.ip);



     insert_transaction_directpayment(req.body.sessionuserid,req.body.accountno,req.body.provideid,req.body.uniqueid,req.body.serviceprovidername,req.body.mobileno,req.body.amount,req.body.paidtype,req.body.category,req.body.ip,req.body.txnid,req.body.token);
   

    let data = {
      isAmountFilledByCustomer: false,
      txnid,
      amount,
      currency: "INR",
      productinfo,
      firstname,
      email,
      phone,
      surl: `https://www.moniespay.com/verifypayu/${txnid}`,
      furl: `https://www.moniespay.com/verifypayu/${txnid}`,
    };


     
    const hashString = `${process.env.MERCHANT_KEY}|${data.txnid}|${data.amount}|${data.productinfo}|${data.firstname}|${data.email}|||||||||||${process.env.MERCHANT_SALT}`;
    const hash = crypto.createHash("sha512").update(hashString).digest("hex");
    data.hash = hash;
    console.log(hash)

    if(req.body.category=="mobile"){
        addmoney_transaction(userid,txnid,amount,productinfo,email,phone,firstname);
    }
    else{
      console.log(req.body.uniqueid);
      updateaddmoney_transaction(userid,txnid,amount,productinfo,email,phone,firstname,req.body.uniqueid);
    }
    

     
    

    let response = await payuClient.paymentInitiate(data);
    console.log(response);
      res.json(response);
    //res.send(response);
  } catch (error) {
    console.error("Error initiating payment:", error);
    res.status(500).send(error);
  }
});

async function insert_transaction_directpayment(userid,accountno,provideid,myuniqueid,serviceprovidername,mobileno,amount,paidtype,category,ip,payutxtid,token){

    try{
        
            const conn= await sql.connect(config);
            const res =await conn.request()
            .input("userid", userid)
            .input("accountno", accountno)
            .input("provideid", provideid)
            .input("tranid", myuniqueid)
            .input("serviceprovidername", serviceprovidername)
            .input("mobileno",mobileno)
            .input("amount", amount)
            .input("paidtype", paidtype)
            .input("category", category)
            .input("ip", ip)
            .input("payutxtid", payutxtid)
            .input("token", token)
            .execute("usp_insertTransaction_direct");
            const data = res.recordset;
            //  console.log('sp Response:', data);
          //  return data;

    }catch(error){
        console.log(error);
    }

}

async function updateaddmoney_transaction(userid,txnid,amount,productinfo,email,mobileno,name,uniqueid){

    try{
         console.log('---ADD Money INICIATE---')
      console.log('---22---')
      console.log(userid);
      console.log(txnid);
      console.log(amount);
      console.log(productinfo);
      console.log(email);
      console.log(mobileno);
      console.log(name);

            const conn= await sql.connect(config);
            const res =await conn.request()



            .input("userid", userid)
            .input("txnid", txnid)
            .input("amount", amount)
            .input("productinfo", productinfo)
            .input("email", email)
            .input("mobileno",mobileno)
            .input("name", name)
             .input("uniqueid", uniqueid)
            // .input("hashid", '--')

            .execute("usp_updateaddmoneyTransaction");
            const data = res.recordset;
            //  console.log('sp Response:', data);


               console.log('---ADD Money INICIATE- END--')
            return data;

    }catch(error){
        console.log(error);
    }

}








///CREDIT CARD PART START

router.post("/initiate-payment-creditcard", async  function(req, res){
//app.post("/initiate-payment", async (req, res) => {
  try {
    

	 console.log('Credit Card Online Payment Line 1');
    const {userid, txnid, amount, productinfo, firstname, email, phone} = req.body;
   
   
    console.log('Credit Card Online Payment Line 2');
    console.log(req.body.userid);
    console.log(req.body.txnid);
    console.log(req.body.amount);
    console.log(req.body.productinfo);
    console.log(req.body.firstname);
    console.log(req.body.email);
    console.log(req.body.phone);



    console.log(req.body.sessionuserid);
    console.log(req.body.accountno);
    console.log(req.body.amount);
    console.log(req.body.paidtype);
    console.log(req.body.provideid);
    console.log(req.body.serviceprovidername);
    console.log(req.body.uniqueid);
      
     console.log('Credit Card Online Payment Line 3');
   
    console.log(req.body.mobileno);
    console.log(req.body.token);
    console.log(req.body.category);
    console.log(req.body.ip);



   // insert_transaction_directpayment(req.body.sessionuserid,req.body.accountno,req.body.provideid,req.body.uniqueid,req.body.serviceprovidername,req.body.mobileno,req.body.amount,req.body.paidtype,req.body.category,req.body.ip,req.body.txnid,req.body.token);
   

    let data = {
      isAmountFilledByCustomer: false,
      txnid,
      amount,
      currency: "INR",
      productinfo,
      firstname,
      email,
      phone,
      surl: `https://www.moniespay.com/verifypayucreditcard/${txnid}`,
      furl: `https://www.moniespay.com/verifypayucreditcard/${txnid}`,
    };


      console.log('Credit Card Online Payment Line 4');
    const hashString = `${process.env.MERCHANT_KEY}|${data.txnid}|${data.amount}|${data.productinfo}|${data.firstname}|${data.email}|||||||||||${process.env.MERCHANT_SALT}`;
    const hash = crypto.createHash("sha512").update(hashString).digest("hex");
    data.hash = hash;
    console.log(hash)

   
   
    
		 console.log('Credit Card Online Payment Line 5');
		  console.log(userid);
		 console.log(req.body.uniqueid);
		  console.log('Credit Card Online Payment Line 6');
		updateaddmoney_transaction(userid,txnid,amount,productinfo,req.body.email,req.body.phone,req.body.firstname,req.body.uniqueid);
    
    

     
    

    let response = await payuClient.paymentInitiate(data);
    console.log(response);
      res.json(response);
    //res.send(response);
  } catch (error) {
    console.error("Error initiating payment:", error);
    res.status(500).send(error);
  }
});

 router.get("/verifycredit/:id", async  function(req, res)
 {
    try{

       console.log('---Verify Credit Card Transaction--Line-1');
       console.log(req.params.id)
       const data = await payuClient.verifyPayment(req.params.id);
       const status = data.transaction_details[req.params.id];
       console.log(status);
       console.log(status.status);
       console.log(status.transaction_amount);
    
	     console.log(status.error_Message);
       console.log('---Verify Credit Card Transaction--Line-2');

       if (status.status === "success") {
            console.log('---Verify Credit Card Transaction--Line-3');
            const conn= await sql.connect(config);
            const result =await conn.request()
           .input("Tranid", req.params.id)
           .execute("USP_getPaymode");
            const data = result["recordset"];
            console.log(' Response:', data);
            console.log(data.paytype);
            console.log(result["recordset"][0].paytype);
            console.log('---category---');
            console.log(result["recordset"][0].Name);
            console.log('---Verify Credit Card Transaction--Line-4');
            console.log(result["recordset"][0].token);
		        
            const getpay2all_balance = await getpay2allprofile(result["recordset"][0].token);
			      console.log('---Verify Credit Card Transaction--Line-6');
			      console.log(getpay2all_balance.data.balance.user_balance);			
			      console.log('---Verify Credit Card Transaction--Line-7');
		        console.log(result["recordset"][0].category);
			      console.log('---Verify Credit Card Transaction--Line-8');
            
            if(result["recordset"][0].category=="Credit Card"){

               const getdatabalance= await getbalance(result["recordset"][0].userid);
               console.log(getdatabalance.MSG);
               console.log(getdatabalance.Balance);
               console.log(getpay2all_balance.data.balance.user_balance);
               console.log(parseFloat(getpay2all_balance.data.balance.user_balance));
               console.log(parseFloat(result["recordset"][0].amount));
               console.log('---Verify Credit Card Transaction--Line-10');

               if(parseFloat(getpay2all_balance.data.balance.user_balance) >= parseFloat(result["recordset"][0].amount)){
                console.log(result["recordset"][0].accountno);
                console.log(result["recordset"][0].provideid);
                console.log(result["recordset"][0].amount);
                console.log(result["recordset"][0].uniqueid);
                console.log(result["recordset"][0].mobileno);
                console.log(result["recordset"][0].token);
                console.log(result["recordset"][0].parameter1);
                console.log(result["recordset"][0].parameter2);
                console.log(result["recordset"][0].parameter3);
                console.log('---Verify Credit Card Transaction--Line-11');

                if(result["recordset"][0].amount >=10){
                  console.log('---Verify Credit Card Transaction--Line-12');
                  const datarecharge = await funcbillfetchpay_creditcard_Online(result["recordset"][0].accountno,result["recordset"][0].ReferenceID,result["recordset"][0].amount,result["recordset"][0].provideid,result["recordset"][0].uniqueid,result["recordset"][0].Name,result["recordset"][0].mobileno,result["recordset"][0].token,result["recordset"][0].parameter1,result["recordset"][0].parameter2);
                  console.log('---Verify Credit Card Transaction--Line-13');
                  console.log(datarecharge.status_id);
                  console.log(datarecharge.balance);
                  console.log(datarecharge.order_id);
                  console.log(datarecharge.utr);
                  console.log(datarecharge.report_id);
                  console.log(datarecharge.message);
                  console.log('---Verify Credit Card Transaction--Line-14'); 
                  
                  if(datarecharge.status_id.toString()=="1"){
                    console.log('---Verify Credit Card Transaction--Line-15');
                    console.log(result["recordset"][0].userid);
                    console.log(result["recordset"][0].uniqueid);
                    console.log(datarecharge.utr);
                    console.log(datarecharge.message);
                    console.log('---Verify Credit Card Transaction--Line-16');
                    const returnrecharge = await update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'success',datarecharge.utr,datarecharge.message,'direct')
                    console.log('---Verify Credit Card Transaction--Line-17');
                    console.log(returnrecharge[0].transactionsID);    
                    console.log(returnrecharge[0].serviceprovider);  
                    console.log(returnrecharge[0].paidtype);  
                    console.log(returnrecharge[0].mobilenumber);  
                    console.log(returnrecharge[0].amount);  
                    console.log(returnrecharge[0].Message);  
					console.log(returnrecharge[0].rechargemobileno);   
                    console.log('---Verify Credit Card Transaction--Line-18');

                    res.json({
                      status:"success",
                      paytype:'direct_payment',    
                      redirect:'success',
                      transactionsID:returnrecharge[0].transactionsID,
                      serviceprovider:returnrecharge[0].serviceprovider,
                      paidtype:returnrecharge[0].paidtype,
                      mobilenumber:returnrecharge[0].mobilenumber,
                      amount:returnrecharge[0].amount,
                      msg:datarecharge.message, 
					  rechargemobileno:returnrecharge[0].rechargemobileno,					  
                    });  

                  }
                  else if(datarecharge.status_id.toString()=="3"){

                    console.log('---Verify Credit Card Transaction--Line-19');
                    console.log(result["recordset"][0].userid);
					console.log(result["recordset"][0].uniqueid);
					console.log(datarecharge.utr);
					console.log(datarecharge.message);
					console.log('---Verify Credit Card Transaction--Line-20');
					const returnrecharge = await update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'success',datarecharge.utr,datarecharge.message,'direct')
					console.log('---Verify Credit Card Transaction--Line-21');
					console.log(returnrecharge[0].transactionsID);    
					console.log(returnrecharge[0].serviceprovider);  
					console.log(returnrecharge[0].paidtype);  
					console.log(returnrecharge[0].mobilenumber);  
					console.log(returnrecharge[0].amount);  
					console.log(returnrecharge[0].Message);  
					console.log(returnrecharge[0].rechargemobileno);   
					console.log('---Verify Credit Card Transaction--Line-22');

                    res.json({
                      status:"Pending",
                      paytype:'direct_payment',    
                      redirect:'success',
					 
					 
                      transactionsID:returnrecharge[0].transactionsID,
                      serviceprovider:returnrecharge[0].serviceprovider,
                      paidtype:returnrecharge[0].paidtype,
                      mobilenumber:returnrecharge[0].mobilenumber,
                      amount:returnrecharge[0].amount,
                      msg:datarecharge.message, 
					  rechargemobileno:returnrecharge[0].rechargemobileno,
					  

                    });

                  }
                  else{

                    console.log('---Verify Credit Card Transaction--Line-23');
                    update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'failure',datarecharge.utr,datarecharge.message,'direct');
                    console.log('---Verify Credit Card Transaction--Line-24');

                    res.json({
                      status:"failure",
                      paytype:'direct_payment',    
                      redirect:'success',
                      transactionsID:'',
                      serviceprovider:'',
                      paidtype:"",
                      mobilenumber:"",
                      amount:"",
                      message:datarecharge.message,    
                    });

                  } 

                }
                else{
                   
                   console.log('---Verify Credit Card Transaction--Line-25');
                   update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'failure',"","Minimum Recharge 10",'direct')
                   console.log('---Verify Credit Card Transaction--Line-26');

                   res.json({
                    status:"failure",
                                    paytype:'direct_payment',    
                                    redirect:'success',
                                    transactionsID:"",
                                    serviceprovider:"",
                                    paidtype:"",
                                    mobilenumber:"",
                                    amount:"",
                                    msg:"Minimum Recharge 10",      
                   });


                }
                

               }

            }
       }


    }
    catch(ex){

    }
 });

async function funcbillfetchpay_creditcard_Online(accountno,referenceid,amount,billerid,uniqueid,name,mobileno,token, paraname1, paraname2){
  
    console.log('function Payment credit card line--1'); 
    console.log(accountno); 
    console.log(referenceid);
    console.log(amount);
    console.log(billerid); 
    console.log(uniqueid); 
    console.log(name);
    console.log(mobileno); 
    console.log(token); 
    console.log(paraname1); 
    console.log(paraname2); 
    console.log('function Payment credit card line--2'); 


	var requestBody = JSON.stringify({"reference_id":referenceid,"amount":amount,"billerId":billerid,"mobile_number":mobileno,"client_id":uniqueid,"customerParams":[{"name":paraname1,"value":accountno},{"name":paraname2,"value":mobileno}]});
	
  const response = await axios.post('https://erp.pay2all.in/api/bbps/payment', requestBody, {
		  headers: {
			'Content-Type': 'application/json',
		  'Authorization': `Bearer ${token}`
		}
	 });


	// let jsonData = 
	//  {
	 //    "status_id": "2",
	 //    "balance": "100",
	 //    "order_id": "5988775",
	//	"utr": "",
	// 	"report_id": "",
	//   "message": "failure",
	//   }
	// ;
	// const data = jsonData;
	
    const data = response.data;
	
    console.log('API Response:', data);
    return data;


}

router.post("/billfetch_creditcard_payment_wallet", async  function(request, response){


    try
    {               

       console.log('Credit Card Payment wallet line 1');

      const getdatabalance= await getbalance(request.body.userid);
      console.log(getdatabalance.MSG);
      console.log(getdatabalance.Balance);
       console.log('Credit Card Payment wallet line 2');
     //if(parseFloat(getdatabalance.Balance) >= parseFloat(request.body.amount))
     // {
		  
		const updateprice =  await update_custom_payment_wallet(request.body.userid,request.body.uniqueid,request.body.amount);
			 
			   console.log(updateprice.MSG);
			   
		   console.log('Credit Card Payment wallet line 3-----');
		   console.log(request.body.accountno);
		   console.log(request.body.referenceid);
		   console.log(request.body.amount);
			 console.log(request.body.billerid);
			 console.log(request.body.uniqueid);
			 console.log(request.body.name);
			 console.log(request.body.mobileno);
			 console.log(request.body.token);
			 console.log(request.body.Paraname1);
			 console.log(request.body.Paraname2);
			 console.log('Credit Card Payment wallet line 4');
    
       const datapayreturn = await funcbillfetchpay_creditcard_wallet(request.body.accountno,request.body.referenceid,request.body.amount,request.body.billerid,request.body.uniqueid,request.body.name,request.body.mobileno,request.body.token,request.body.Paraname1,request.body.Paraname2);
    
		    console.log(datapayreturn.status_id);
        console.log(datapayreturn.utr);
        console.log(datapayreturn.message);
        console.log(request.body.uniqueid);
        console.log('Credit Card Payment wallet line 5');
		
		console.log(datapayreturn.status_id.toString());
     
      if(datapayreturn.status_id.toString() =="1")
      {
		  console.log('Credit Card Payment wallet line 6');
          const returnrecharge = await update_transaction(request.body.userid,request.body.uniqueid,'success',datapayreturn.utr,datapayreturn.message,'wallet')
          console.log('Credit Card Payment wallet line 7');
         
          response.json({
              status:"success",
              transactionsID:returnrecharge[0].transactionsID,
              serviceprovider:returnrecharge[0].serviceprovider,
              paidtype:returnrecharge[0].paidtype,
              mobilenumber:returnrecharge[0].mobilenumber,
              accountno:returnrecharge[0].accountno,
              amount:returnrecharge[0].amount,
              message:returnrecharge[0].Message, 
              rechargemobileno:returnrecharge[0].rechargemobileno,				            
           });

      }
	    else if(datapayreturn.status_id.toString() =="3")
      {
		  console.log('Credit Card Payment wallet line 8');
          const returnrecharge = await update_transaction(request.body.userid,request.body.uniqueid,'success',datapayreturn.utr,datapayreturn.message,'wallet')
          console.log('Credit Card Payment wallet line 9');          
          response.json({
              status:"Pending",
              transactionsID:returnrecharge[0].transactionsID,
              serviceprovider:returnrecharge[0].serviceprovider,
              paidtype:returnrecharge[0].paidtype,
              mobilenumber:returnrecharge[0].mobilenumber,
              accountno:returnrecharge[0].accountno,
              amount:returnrecharge[0].amount,
              message:'Transaction is in Queue',
              rechargemobileno:returnrecharge[0].rechargemobileno,             
           });
      }
      else{
		  console.log('Credit Card Payment wallet line 10');
		   console.log(request.body.userid);
		   console.log(request.body.uniqueid);
		   // console.log(datarecharge.utr);
		 //console.log(datarecharge.message);
		   console.log('Credit Card Payment wallet line 11');
           update_transaction(request.body.userid,request.body.uniqueid,'failure',"","",'wallet')
           console.log('Credit Card wallet line 12');
           
           response.json({
              status:"failure",
               transactionsID:'',
                serviceprovider:'',
                paidtype:"",
                mobilenumber:"",
                amount:"",
                message:"failure",             
            });

      }

      
   // }
   // else{
   //     response.json({
   //                      status:"failure",
   //                       msg:"Insufficient Balance",                  
   //                    });

   // }

    } catch(error){





    }
  
    
});
async function update_custom_payment_wallet(userid,transactionid,amount){

    try{
			console.log('Credit Card update custom price update line 1');
            const conn= await sql.connect(config);
            const res =await conn.request()
            .input("userid", userid)
			.input("transactionid", transactionid)
			.input("amount", amount)
            .execute("USP_Update_Custum_Amount_Walletpay");
            const data = res.recordset[0];
             console.log('sp update:', data);
			 console.log('Credit Card update custom price update line 2');
            return data;

    }catch(error){
        console.log(error);
    }

}
async function funcbillfetchpay_creditcard_wallet(accountno,referenceid,amount,billerid,uniqueid,name,mobileno,token, paraname1, paraname2) {
  
  
     console.log('Credit Card wallet pay line 1');
      console.log(accountno);
      console.log(referenceid);
      console.log(amount);
	    console.log(billerid);
	    console.log(uniqueid);
	    console.log(name);
	    console.log(mobileno);
		  console.log(token);
		  console.log(paraname1);
		  console.log(paraname2);
		  console.log('Credit Card wallet pay line 2');
			
			var requestBody = JSON.stringify({"reference_id":referenceid,"amount":amount,"billerId":billerid,"mobile_number":mobileno,"client_id":uniqueid,"customerParams":[{"name":paraname1,"value":accountno},{"name":paraname2,"value":mobileno}]});
			const response = await axios.post('https://erp.pay2all.in/api/bbps/payment', requestBody, {
				  headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				  }
    });


    //let jsonData = 
	//  {
	//     "status_id": "3",
	//     "balance": "100",
	// 	"order_id": "5988775",
	// 	"utr": "",
	// 	"report_id": "",
	//    "message": "Quee",
	//   }
	// ;
	// const data = jsonData;

    const data = response.data;
    console.log('API Billpay Response:', data);
    return data;


}

///CREDIT CARD PART END






///INSURENCE PART START


router.post("/initiate-payment-insurence", async  function(req, res){
//app.post("/initiate-payment", async (req, res) => {
  try {
    

	 console.log('INSURENCE Online Payment Line 1');
    const {userid, txnid, amount, productinfo, firstname, email, phone} = req.body;
   
   
    console.log('INSURENCE Online Payment Line 2');
    console.log(req.body.userid);
    console.log(req.body.txnid);
    console.log(req.body.amount);
    console.log(req.body.productinfo);
    console.log(req.body.firstname);
    console.log(req.body.email);
    console.log(req.body.phone);



    console.log(req.body.sessionuserid);
    console.log(req.body.accountno);
    console.log(req.body.amount);
    console.log(req.body.paidtype);
    console.log(req.body.provideid);
    console.log(req.body.serviceprovidername);
    console.log(req.body.uniqueid);
      
     console.log('INSURENCE Online Payment Line 3');
   
    console.log(req.body.mobileno);
    console.log(req.body.token);
    console.log(req.body.category);
    console.log(req.body.ip);



    

    let data = {
      isAmountFilledByCustomer: false,
      txnid,
      amount,
      currency: "INR",
      productinfo,
      firstname,
      email,
      phone,
      surl: `https://www.moniespay.com/verifypayuInsurence/${txnid}`,
      furl: `https://www.moniespay.com/verifypayuInsurence/${txnid}`,
    };


      console.log('INSURENCE Online Payment Line 4');
    const hashString = `${process.env.MERCHANT_KEY}|${data.txnid}|${data.amount}|${data.productinfo}|${data.firstname}|${data.email}|||||||||||${process.env.MERCHANT_SALT}`;
    const hash = crypto.createHash("sha512").update(hashString).digest("hex");
    data.hash = hash;
    console.log(hash)

   
   
    
		 console.log('INSURENCE Online Payment Line 5');
		  console.log(userid);
		 console.log(req.body.uniqueid);
		  console.log('INSURENCE Online Payment Line 6');
		updateaddmoney_transaction(userid,txnid,amount,productinfo,req.body.email,req.body.phone,req.body.firstname,req.body.uniqueid);
    
    

     
    

    let response = await payuClient.paymentInitiate(data);
    console.log(response);
      res.json(response);
    //res.send(response);
  } catch (error) {
    console.error("Error initiating payment:", error);
    res.status(500).send(error);
  }
});

 router.get("/verifyinsurence/:id", async  function(req, res)
 {
    try{

       console.log('---Verify INSURENCE Transaction--Line-1');
       console.log(req.params.id)
       const data = await payuClient.verifyPayment(req.params.id);
       const status = data.transaction_details[req.params.id];
       console.log(status);
       console.log(status.status);
       console.log(status.transaction_amount);
       console.log(status.error_Message);
       console.log('---Verify INSURENCE Transaction--Line-2');

       if (status.status === "success") {
            console.log('---Verify INSURENCE Transaction--Line-3');
            const conn= await sql.connect(config);
            const result =await conn.request()
           .input("Tranid", req.params.id)
           .execute("USP_getPaymode");
            const data = result["recordset"];
            console.log(' Response:', data);
            console.log(data.paytype);
            console.log(result["recordset"][0].paytype);
            console.log('---category---');
            console.log(result["recordset"][0].Name);
            console.log('---Verify INSURENCE Transaction--Line-4');
            console.log(result["recordset"][0].token);
		   
            const getpay2all_balance = await getpay2allprofile(result["recordset"][0].token);
            console.log('---Verify INSURENCE Transaction--Line-6');
            console.log(getpay2all_balance.data.balance.user_balance);			
            console.log('---Verify INSURENCE Transaction--Line-7');
            console.log(result["recordset"][0].category);
            console.log('---Verify INSURENCE Transaction--Line-8');
            
            if(result["recordset"][0].category=="Insurance"){

               const getdatabalance= await getbalance(result["recordset"][0].userid);
               console.log(getdatabalance.MSG);
               console.log(getdatabalance.Balance);
               console.log(getpay2all_balance.data.balance.user_balance);
               console.log(parseFloat(getpay2all_balance.data.balance.user_balance));
               console.log(parseFloat(result["recordset"][0].amount));
               console.log('---Verify INSURENCE Transaction--Line-10');

               if(parseFloat(getpay2all_balance.data.balance.user_balance) >= parseFloat(result["recordset"][0].amount)){
                console.log(result["recordset"][0].accountno);
                console.log(result["recordset"][0].provideid);
                console.log(result["recordset"][0].amount);
                console.log(result["recordset"][0].uniqueid);
                console.log(result["recordset"][0].mobileno);
                console.log(result["recordset"][0].token);
                console.log(result["recordset"][0].parameter1);
                console.log(result["recordset"][0].parameter2);
                console.log(result["recordset"][0].parameter3);
                console.log('---Verify INSURENCE Transaction--Line-11');

                if(result["recordset"][0].amount >=10){
                  console.log('---Verify INSURENCE Transaction--Line-12');
                  const datarecharge = await funcbillfetchpay_insurence_Online(result["recordset"][0].accountno,result["recordset"][0].ReferenceID,result["recordset"][0].amount,result["recordset"][0].provideid,result["recordset"][0].uniqueid,result["recordset"][0].Name,result["recordset"][0].mobileno,result["recordset"][0].token,result["recordset"][0].parameter1,result["recordset"][0].parameter2,result["recordset"][0].parameter3);
                  console.log('---Verify INSURENCE Transaction--Line-13');
                  console.log(datarecharge.status_id);
                  console.log(datarecharge.balance);
                  console.log(datarecharge.order_id);
                  console.log(datarecharge.utr);
                  console.log(datarecharge.report_id);
                  console.log(datarecharge.message);
                  console.log('---Verify INSURENCE Transaction--Line-14'); 
                  
                  if(datarecharge.status_id.toString()=="1"){
                    console.log('---Verify INSURENCE Transaction--Line-15');
                    console.log(result["recordset"][0].userid);
                    console.log(result["recordset"][0].uniqueid);
                    console.log(datarecharge.utr);
                    console.log(datarecharge.message);
                    console.log('---Verify INSURENCE Transaction--Line-16');
                    const returnrecharge = await update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'success',datarecharge.utr,datarecharge.message,'direct')
                    console.log('---Verify INSURENCE Transaction--Line-17');
                    console.log(returnrecharge[0].transactionsID);    
                    console.log(returnrecharge[0].serviceprovider);  
                    console.log(returnrecharge[0].paidtype);  
                    console.log(returnrecharge[0].mobilenumber);  
                    console.log(returnrecharge[0].amount);  
                    console.log(returnrecharge[0].Message);  
					          console.log(returnrecharge[0].rechargemobileno);   
                    console.log('---Verify INSURENCE Transaction--Line-18');

                    res.json({
                      status:"success",
                      paytype:'direct_payment',    
                      redirect:'success',
                      transactionsID:returnrecharge[0].transactionsID,
                      serviceprovider:returnrecharge[0].serviceprovider,
                      paidtype:returnrecharge[0].paidtype,
                      mobilenumber:returnrecharge[0].mobilenumber,
                      amount:returnrecharge[0].amount,
                      msg:datarecharge.message, 
					            rechargemobileno:returnrecharge[0].rechargemobileno,					  
                    });  

                  }
                  else if(datarecharge.status_id.toString()=="3"){

                    console.log('---Verify INSURENCE Transaction--Line-19');
                    console.log(result["recordset"][0].userid);
                    console.log(result["recordset"][0].uniqueid);
                    console.log(datarecharge.utr);
                    console.log(datarecharge.message);
                    console.log('---Verify INSURENCE Transaction--Line-20');
                    const returnrecharge = await update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'success',datarecharge.utr,datarecharge.message,'direct')
                    console.log('---Verify INSURENCE Transaction--Line-21');
                    console.log(returnrecharge[0].transactionsID);    
                    console.log(returnrecharge[0].serviceprovider);  
                    console.log(returnrecharge[0].paidtype);  
                    console.log(returnrecharge[0].mobilenumber);  
                    console.log(returnrecharge[0].amount);  
                    console.log(returnrecharge[0].Message);  
                    console.log(returnrecharge[0].rechargemobileno);   
                    console.log('---Verify INSURENCE Transaction--Line-22');

                    res.json({
                      status:"Pending",
                      paytype:'direct_payment',    
                      redirect:'success',
					 
					 
                      transactionsID:returnrecharge[0].transactionsID,
                      serviceprovider:returnrecharge[0].serviceprovider,
                      paidtype:returnrecharge[0].paidtype,
                      mobilenumber:returnrecharge[0].mobilenumber,
                      amount:returnrecharge[0].amount,
                      msg:datarecharge.message, 
					            rechargemobileno:returnrecharge[0].rechargemobileno,
					  

                    });

                  }
                  else{

                    console.log('---Verify INSURENCE Transaction--Line-23');
                    update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'failure',datarecharge.utr,datarecharge.message,'direct');
                    console.log('---Verify INSURENCE Transaction--Line-24');

                    res.json({
                      status:"failure",
                      paytype:'direct_payment',    
                      redirect:'success',
                      transactionsID:'',
                      serviceprovider:'',
                      paidtype:"",
                      mobilenumber:"",
                      amount:"",
                      message:datarecharge.message,    
                    });

                  } 

                }
                else{
                   
                   console.log('---Verify INSURENCE Transaction--Line-25');
                   update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'failure',"","Minimum Recharge 10",'direct')
                   console.log('---Verify INSURENCE Transaction--Line-26');

                   res.json({
                    status:"failure",
                                    paytype:'direct_payment',    
                                    redirect:'success',
                                    transactionsID:"",
                                    serviceprovider:"",
                                    paidtype:"",
                                    mobilenumber:"",
                                    amount:"",
                                    msg:"Minimum Recharge 10",      
                   });


                }
                

               }

            }
       }


    }
    catch(ex){

    }
 });

async function funcbillfetchpay_insurence_Online(accountno,referenceid,amount,billerid,uniqueid,name,mobileno,token, paraname1, paraname2, paraname3){
  
    console.log('function Payment INSURENCE line--1'); 
    console.log(accountno); 
    console.log(referenceid);
    console.log(amount);
    console.log(billerid); 
    console.log(uniqueid); 
    console.log(name);
    console.log(mobileno); 
    console.log(token); 
    console.log(paraname1); 
    console.log(paraname2); 
    console.log(paraname3); 
    console.log('function Payment INSURENCE line--2'); 


	//var requestBody = JSON.stringify({"reference_id":referenceid,"amount":amount,"billerId":billerid,"mobile_number":mobileno,"client_id":uniqueid,"customerParams":[{"name":paraname1,"value":accountno},{"name":paraname2,"value":mobileno},{"name":paraname3,"value":mobileno}]});
	
	//const response = await axios.post('https://erp.pay2all.in/api/bbps/payment', requestBody, {
	//	  headers: {
	//		'Content-Type': 'application/json',
	//	  'Authorization': `Bearer ${token}`
	//	}
	// });


	 let jsonData = 
	  {
	     "status_id": "2",
	     "balance": "100",
	     "order_id": "5988775",
		"utr": "",
	 	"report_id": "",
	   "message": "failure",
	   }
	 ;
	 const data = jsonData;
	
  //  const data = response.data;
	
    console.log('API Response:', data);
    return data;


}

router.post("/billfetch_insurence_payment_wallet", async  function(request, response){


    try
    {               

       console.log('INSURENCE Payment wallet line 1');

      const getdatabalance= await getbalance(request.body.userid);
      console.log(getdatabalance.MSG);
      console.log(getdatabalance.Balance);
       console.log('INSURENCE Payment wallet line 2');
     //if(parseFloat(getdatabalance.Balance) >= parseFloat(request.body.amount))
     // {
		  
	  	const updateprice =  await update_custom_payment_wallet(request.body.userid,request.body.uniqueid,request.body.amount);
			 
			   console.log(updateprice.MSG);
			   
		   console.log('INSURENCE Payment wallet line 3-----');
		   console.log(request.body.accountno);
		   console.log(request.body.referenceid);
		   console.log(request.body.amount);
			 console.log(request.body.billerid);
			 console.log(request.body.uniqueid);
			 console.log(request.body.name);
			 console.log(request.body.mobileno);
			 console.log(request.body.token);
			 console.log(request.body.Paraname1);
			 console.log(request.body.Paraname2);
       console.log(request.body.Paraname3);
			 console.log('INSURENCE Payment wallet line 4');
    
       const datapayreturn = await funcbillfetchpay_insurence_wallet(request.body.accountno,request.body.referenceid,request.body.amount,request.body.billerid,request.body.uniqueid,request.body.name,request.body.mobileno,request.body.token,request.body.Paraname1,request.body.Paraname2,request.body.Paraname3);
    
		    console.log(datapayreturn.status_id);
        console.log(datapayreturn.utr);
        console.log(datapayreturn.message);
        console.log(request.body.uniqueid);
        console.log('INSURENCE Payment wallet line 5');
		    console.log(datapayreturn.status_id.toString());
     
      if(datapayreturn.status_id.toString() =="1")
      {
		      console.log('INSURENCE Payment wallet line 6');
          const returnrecharge = await update_transaction(request.body.userid,request.body.uniqueid,'success',datapayreturn.utr,datapayreturn.message,'wallet')
          console.log('INSURENCE Payment wallet line 7');
         
          response.json({
              status:"success",
              transactionsID:returnrecharge[0].transactionsID,
              serviceprovider:returnrecharge[0].serviceprovider,
              paidtype:returnrecharge[0].paidtype,
              mobilenumber:returnrecharge[0].mobilenumber,
              accountno:returnrecharge[0].accountno,
              amount:returnrecharge[0].amount,
              message:returnrecharge[0].Message, 
              rechargemobileno:returnrecharge[0].rechargemobileno,				            
           });

      }
	    else if(datapayreturn.status_id.toString() =="3")
      {
		      console.log('INSURENCE Payment wallet line 8');
          const returnrecharge = await update_transaction(request.body.userid,request.body.uniqueid,'success',datapayreturn.utr,datapayreturn.message,'wallet')
          console.log('INSURENCE Payment wallet line 9');          
          response.json({
              status:"Pending",
              transactionsID:returnrecharge[0].transactionsID,
              serviceprovider:returnrecharge[0].serviceprovider,
              paidtype:returnrecharge[0].paidtype,
              mobilenumber:returnrecharge[0].mobilenumber,
              accountno:returnrecharge[0].accountno,
              amount:returnrecharge[0].amount,
              message:'Transaction is in Queue',
              rechargemobileno:returnrecharge[0].rechargemobileno,             
           });
      }
      else{
		   console.log('INSURENCE Payment wallet line 10');
		   console.log(request.body.userid);
		   console.log(request.body.uniqueid);
		   // console.log(datarecharge.utr);
		   //console.log(datarecharge.message);
		   console.log('INSURENCE Payment wallet line 11');
           update_transaction(request.body.userid,request.body.uniqueid,'failure',"","",'wallet')
           console.log('INSURENCE wallet line 12');
           
           response.json({
              status:"failure",
               transactionsID:'',
                serviceprovider:'',
                paidtype:"",
                mobilenumber:"",
                amount:"",
                message:"failure",             
            });

      }

      
   // }
   // else{
   //     response.json({
   //                      status:"failure",
   //                       msg:"Insufficient Balance",                  
   //                    });

   // }

    } catch(error){





    }
  
    
});
async function update_custom_payment_wallet(userid,transactionid,amount){

    try{
			      console.log('INSURENCE update custom price update line 1');
            const conn= await sql.connect(config);
            const res =await conn.request()
            .input("userid", userid)
			      .input("transactionid", transactionid)
		      	.input("amount", amount)
            .execute("USP_Update_Custum_Amount_Walletpay");
            const data = res.recordset[0];
             console.log('sp update:', data);
			      console.log('INSURENCE update custom price update line 2');
            return data;

    }catch(error){
        console.log(error);
    }

}

async function funcbillfetchpay_insurence_wallet(accountno,referenceid,amount,billerid,uniqueid,name,mobileno,token, paraname1, paraname2, paraname3) {
  
  
     console.log('INSURENCE wallet pay line 1');
      console.log(accountno);
      console.log(referenceid);
      console.log(amount);
	    console.log(billerid);
	    console.log(uniqueid);
	    console.log(name);
	    console.log(mobileno);
		  console.log(token);
		  console.log(paraname1);
		  console.log(paraname2);
       console.log(paraname3);
		  console.log('INSURENCE wallet pay line 2');
			
		//	var requestBody = JSON.stringify({"reference_id":referenceid,"amount":amount,"billerId":billerid,"mobile_number":mobileno,"client_id":uniqueid,"customerParams":[{"name":paraname1,"value":accountno},{"name":paraname2,"value":mobileno},{"name":paraname3,"value":mobileno}]});
		//	const response = await axios.post('https://erp.pay2all.in/api/bbps/payment', requestBody, {
		//		  headers: {
		//			'Content-Type': 'application/json',
		//			'Authorization': `Bearer ${token}`
		//		  }
    //});


    let jsonData = 
	  {
	     "status_id": "3",
	     "balance": "100",
	 	"order_id": "5988775",
	 	"utr": "",
	 	"report_id": "",
	    "message": "Quee",
	   }
	 ;
	 const data = jsonData;

  //  const data = response.data;
    console.log('API Billpay Response:', data);
    return data;


}


//INSURENCE PART END







 router.get("/verifypayudeposit/:id", async  function(req, res){
  try {


    console.log('---verify payment fetch---');
     console.log(req.params.id)
    const data = await payuClient.verifyPayment(req.params.id);
    const status = data.transaction_details[req.params.id];
	   console.log(status);
	   console.log(status.status);
     console.log(status.transaction_amount);
    
	   console.log(status.error_Message);
     console.log('---v---');
    if (status.status === "success") 
      {


      
        
                          const conn= await sql.connect(config);
                          const result =await conn.request()
                          .input("Tranid", req.params.id)
                          .input("status", status.status)
                          .input("amount", status.transaction_amount)
                        

                          .execute("USP_UpdateSuccessTransaction");
                          const data = result["recordset"];
                           console.log(' Response:', data);
                          
                            console.log(result["recordset"][0].paytype);


                          res.json({
                                      status:"success",
                                      paytype:'deposit',    
                                      redirect:'success',
                                      amount:status.transaction_amount,
                                      mobilenumber:'',
                                      serviceprovider:'',
                                      transactionsID:'',
                                      msg:"success",      
                                                                
                                });


                


      } 
        else
          
          {
      
            console.log('---failure or cancel payment---')
       
       
            



           //#region cancel entry tn database
              console.log(req.params.id);
              console.log(status.status);
              console.log(status.error_Message);


            const conn= await sql.connect(config);
            const result =await conn.request()



            
            .input("Tranid", req.params.id)
            .input("status", status.status)
            .input("message", status.error_Message)
           

            .execute("USP_Updatecancel");
             const data = result["recordset"];
                console.log(' Response:', data);
              console.log(data.paytype);
              console.log(result["recordset"][0].paytype);

              
                          res.json({
                                      status:"failure",
                                      paytype:'deposit',    
                                      redirect:'failed',
                                      amount:status.transaction_amount,
                                      mobilenumber:'',
                                      serviceprovider:'',
                                      transactionsID:'',
                                      msg:"failure",      
                                                                
                                });
             //#endregion cancel payment
            
             



      

    }
  } catch (error) {
     console.log('---44---')
    console.error("Error verifying payment:", error);
    res.status(500).send(error);
  }



});



//  router.get("/verify/:id", async  function(req, res){
// //app.get("/verify/:id", async (req, res) => {
//   try {

//     console.log('---verify payment fetch---');
//      console.log(req.params.id)
//     const data = await payuClient.verifyPayment(req.params.id);
//     const status = data.transaction_details[req.params.id];
// 	   console.log(status);
// 	   console.log(status.status);
//      console.log(status.transaction_amount);
    
// 	   console.log(status.error_Message);
//      console.log('---v---');
//     if (status.status === "success") 
//       {










//              const conn= await sql.connect(config);
//             const result =await conn.request()
 
//             .input("Tranid", req.params.id)
           

//             .execute("USP_getPaymode");
//              const data = result["recordset"];
//                 console.log(' Response:', data);
//               console.log(data.paytype);
//               console.log(result["recordset"][0].paytype);
//                  console.log('---category---');
//                console.log(result["recordset"][0].Name);
			   
			   
			   
			   
			

//               if(result["recordset"][0].paytype =="direct_payment")
//               {
				  
				  
// 				  console.log('---Payment success return with pay2all balance get--Start****1---');
// 			console.log(result["recordset"][0].token);
// 			const getpay2all_balance = await getpay2allprofile(result["recordset"][0].token);
// 			console.log('---Payment success return with pay2all balance get--Start****2---');
// 			console.log(getpay2all_balance.data.balance.user_balance);			
// 			console.log('---Payment success return with pay2all balance get--Start****3		---');
		
			   
			   
// 			  console.log('---Payment success return with pay2all balance get--Start****4---');

//                    console.log('---Direct pay 1---');
// 				    console.log(result["recordset"][0].category);
// 					console.log('---Payment success return with pay2all balance get--Start****5---');

//                  if(result["recordset"][0].category=="mobile")
//                  {
                  
                   
//                   const getdatabalance= await getbalance(result["recordset"][0].userid);
//                     console.log(getdatabalance.MSG);
//                     console.log(getdatabalance.Balance);

//                   if(parseFloat(getpay2all_balance.data.balance.user_balance) >= parseFloat(result["recordset"][0].amount))
//                     {

//                       console.log('---Mobile  1---');
//                       //mobile recharge
//                       console.log(result["recordset"][0].accountno);
//                       console.log(result["recordset"][0].provideid);
//                       console.log(result["recordset"][0].amount);
//                       console.log(result["recordset"][0].uniqueid);
//                       console.log(result["recordset"][0].mobileno);
//                         console.log(result["recordset"][0].token);

                    
//                         console.log('---Mobile  2 ---');

//                         if(result["recordset"][0].amount >=10)
//                         {

//                               const datarecharge = await funcmobilerecharge(result["recordset"][0].accountno,result["recordset"][0].provideid,result["recordset"][0].amount,result["recordset"][0].uniqueid,result["recordset"][0].mobileno,result["recordset"][0].token); 
//                                 console.log('---Mobile  result 2---');
//                             console.log(datarecharge.status_id);
//                               console.log(datarecharge.balance);
//                               console.log(datarecharge.order_id);
//                               console.log(datarecharge.utr);
//                               console.log(datarecharge.report_id);
//                             console.log(datarecharge.message);
//                               console.log('---Mobile  result 3---');
                    
                
//                               if(datarecharge.status_id.toString()=="1")
//                                 {
//                                   console.log('Update Mobile Recharge Trasaction----1');
//                                   console.log(result["recordset"][0].userid);
//                                   console.log(result["recordset"][0].uniqueid);
//                                   console.log(datarecharge.utr);
//                                   console.log(datarecharge.message);
                          
//                                   console.log('Update Mobile Recharge Trasaction----2');
//                                   const returnrecharge = await update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'success',datarecharge.utr,datarecharge.message,'direct')
//                                   console.log('Update Mobile Recharge Trasaction----3');
//                                   console.log(returnrecharge[0].transactionsID);    
//                                   console.log(returnrecharge[0].serviceprovider);  
//                                   console.log(returnrecharge[0].paidtype);  
//                                   console.log(returnrecharge[0].mobilenumber);  
//                                   console.log(returnrecharge[0].amount);  
//                                   console.log(returnrecharge[0].Message);  
//                                   console.log('Update Mobile Recharge Trasaction----4');
                                          
//                                         res.json({
//                                             status:"success",
//                                             paytype:'direct_payment',    
//                                             redirect:'success',
                                            
//                                             transactionsID:returnrecharge[0].transactionsID,
//                                             serviceprovider:returnrecharge[0].serviceprovider,
//                                             paidtype:returnrecharge[0].paidtype,
//                                             mobilenumber:returnrecharge[0].mobilenumber,
//                                             amount:returnrecharge[0].amount,
//                                             msg:returnrecharge[0].Message,      
                                                                      
//                                       });
                              
//                                 }
//                                 else
//                                 {
//                                       console.log('Update Mobile Recharge Trasaction----6');
//                                       update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'failure',datarecharge.utr,datarecharge.message,'direct')
//                                       console.log('Update Mobile Recharge Trasaction----7');
                                  



//                                           res.json({
//                                               status:"failure",
//                                               paytype:'direct_payment',    
//                                               redirect:'success',
                                              
//                                               transactionsID:'',
//                                               serviceprovider:'',
//                                               paidtype:"",
//                                               mobilenumber:"",
//                                               amount:"",
//                                               msg:datarecharge.message,      
                                                                        
//                                         });

//                                 }

//                         }
//                         else
//                           {





//                           console.log('Update Mobile Recharge Trasaction----6');
//                           update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'failure',"","Minimum Recharge 10",'direct')
//                           console.log('Update Mobile Recharge Trasaction----7');
                      



//                               res.json({
//                                   status:"failure",
//                                   paytype:'direct_payment',    
//                                   redirect:'success',
                                  
//                                   transactionsID:"",
//                                   serviceprovider:"",
//                                   paidtype:"",
//                                   mobilenumber:"",
//                                   amount:"",
//                                   msg:"Minimum Recharge 10",      
                                                            
//                             });




//                         }

//                     }
//                   else{
                             

                              
//                             res.json({
//                                 status:"failure",
//                                 paytype:'direct_payment',    
//                                 redirect:'success',
                                
//                                 transactionsID:"",
//                                 serviceprovider:"",
//                                 paidtype:"",
//                                 mobilenumber:"",
//                                 amount:"",
//                                 msg:"Insufficient Balance",      
                                                          
//                           });

//                       }
//                      //end






//                  }
//                  else if(result["recordset"][0].category=="DTH")
//                  {



//                    console.log('---DTH  1---');


//                      //DTH recharge

//                     console.log(result["recordset"][0].userid);
//                     console.log(result["recordset"][0].accountno);
//                     console.log(result["recordset"][0].provideid);
//                      console.log(result["recordset"][0].amount);
//                     console.log(result["recordset"][0].uniqueid);
//                      console.log(result["recordset"][0].mobileno);
//                       console.log(result["recordset"][0].token);

//                          const getdatabalance= await getbalance(result["recordset"][0].userid);
//                         console.log(getdatabalance.MSG);
//                         console.log(getdatabalance.Balance);

//                       if(parseFloat(getpay2all_balance.data.balance.user_balance) >= parseFloat(result["recordset"][0].amount))
//                         {
                  
//                       console.log('---DTH  2 ---');

//                       if(result["recordset"][0].amount >=10)
//                       {


//                            console.log(result["recordset"][0].accountno);
//                              console.log(result["recordset"][0].provideid);
//                              console.log(result["recordset"][0].amount);
//                               console.log(result["recordset"][0].uniqueid);
//                                console.log(result["recordset"][0].mobileno);
//                                 console.log(result["recordset"][0].token);
//  console.log('---DTH  2 end ---');

//                             const datarecharge = await funcmobilerecharge(result["recordset"][0].accountno,result["recordset"][0].provideid,result["recordset"][0].amount,result["recordset"][0].uniqueid,result["recordset"][0].mobileno,result["recordset"][0].token); 
//                               console.log('---DTH  result 2---');
//                           console.log(datarecharge.status_id);
//                             console.log(datarecharge.balance);
//                             console.log(datarecharge.order_id);
//                             console.log(datarecharge.utr);
//                             console.log(datarecharge.report_id);
//                           console.log(datarecharge.message);
//                             console.log('---DTH  result 3---');
                   
               
//                              if(datarecharge.status_id.toString()=="1")
//                               {
//                                 console.log('Update DTH Recharge Trasaction----1');
//                                 console.log(result["recordset"][0].userid);
//                                 console.log(result["recordset"][0].uniqueid);
//                                 console.log(datarecharge.utr);
//                                 console.log(datarecharge.message);
                        
//                                 console.log('Update DTH Recharge Trasaction----2');
//                                 const returnrecharge = await update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'success',datarecharge.utr,datarecharge.message,'direct')
//                                 console.log('Update DTH Recharge Trasaction----3');
//                                 console.log(returnrecharge[0].transactionsID);    
//                                 console.log(returnrecharge[0].serviceprovider);  
//                                 console.log(returnrecharge[0].paidtype);  
//                                 console.log(returnrecharge[0].mobilenumber);  
//                                 console.log(returnrecharge[0].amount);  
//                                 console.log(returnrecharge[0].Message);  
//                                 console.log('Update DTH Recharge Trasaction----4');
                                        
//                                       res.json({
//                                           status:"success",
//                                           paytype:'direct_payment',    
//                                           redirect:'success',
                                          
//                                           transactionsID:returnrecharge[0].transactionsID,
//                                           serviceprovider:returnrecharge[0].serviceprovider,
//                                           paidtype:returnrecharge[0].paidtype,
//                                           mobilenumber:returnrecharge[0].mobilenumber,
//                                           amount:returnrecharge[0].amount,
//                                           msg:returnrecharge[0].Message,      
                                                                    
//                                     });
                            
//                               }
//                               else
//                               {
//                                     console.log('Update DTH Recharge Trasaction----6');
//                                     update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'failure',datarecharge.utr,datarecharge.message,'direct')
//                                     console.log('Update DTH Recharge Trasaction----7');
                                



//                                         res.json({
//                                             status:"failure",
//                                             paytype:'direct_payment',    
//                                             redirect:'success',
                                            
//                                             transactionsID:'',
//                                             serviceprovider:'',
//                                             paidtype:"",
//                                             mobilenumber:"",
//                                             amount:"",
//                                             msg:datarecharge.message,      
                                                                      
//                                       });

//                               }

//                       }
//                       else
//                         {





//                          console.log('Update DTH Recharge Trasaction----6');
//                          update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'failure',"","Minimum Recharge 10",'direct')
//                          console.log('Update DTH Recharge Trasaction----7');
                     



//                             res.json({
//                                 status:"failure",
//                                 paytype:'direct_payment',    
//                                 redirect:'success',
                                
//                                 transactionsID:"",
//                                 serviceprovider:"",
//                                 paidtype:"",
//                                 mobilenumber:"",
//                                 amount:"",
//                                 msg:"Minimum Recharge 10",      
                                                          
//                           });




//                       }

//                     }
//                     else{
                             

                              
//                             res.json({
//                                 status:"failure",
//                                 paytype:'direct_payment',    
//                                redirect:'success',
                                
//                                 transactionsID:"",
//                                serviceprovider:"",
//                                paidtype:"",
//                                 mobilenumber:"",
//                                 amount:"",
//                                 msg:"Insufficient Balance",      
                                                          
//                           });

//                       }

//                      //end





//                  }
//                   else if(result["recordset"][0].category=="electricity")
//                  {



//                    console.log('---Electricity  1---');
//                      //Electricity payment

//                          const getdatabalance= await getbalance(result["recordset"][0].userid);
//                         console.log(getdatabalance.MSG);
//                         console.log(getdatabalance.Balance);
// 						 console.log(result["recordset"][0].amount);

//                       if(parseFloat(getpay2all_balance.data.balance.user_balance) >= parseFloat(result["recordset"][0].amount))
//                         {
                 
//                           console.log(result["recordset"][0].accountno);
//                           console.log(result["recordset"][0].provideid);
//                           console.log(result["recordset"][0].amount);
//                           console.log(result["recordset"][0].uniqueid);
//                           console.log(result["recordset"][0].mobileno);
//                             console.log(result["recordset"][0].token);

                  
//                            console.log('---Electricity  2 ---');

//                           if(result["recordset"][0].amount >=10)
//                           {

//                                 const datarecharge = await funcbillfetchpay(result["recordset"][0].accountno,result["recordset"][0].ReferenceID,result["recordset"][0].amount,result["recordset"][0].provideid,result["recordset"][0].uniqueid,result["recordset"][0].Name,result["recordset"][0].mobileno,result["recordset"][0].token);
                                                                         
    
//                                 console.log('---Electricity  result 2---');
//                               console.log(datarecharge.status_id);
//                                 console.log(datarecharge.balance);
//                                 console.log(datarecharge.order_id);
//                                 console.log(datarecharge.utr);
//                                 console.log(datarecharge.report_id);
//                               console.log(datarecharge.message);
//                                 console.log('---Electricity  result 3---');
                      
                  
//                                 if(datarecharge.status_id.toString()=="1")
//                                   {
//                                     console.log('Update Electricity Recharge Trasaction----1');
//                                     console.log(result["recordset"][0].userid);
//                                     console.log(result["recordset"][0].uniqueid);
//                                     console.log(datarecharge.utr);
//                                     console.log(datarecharge.message);
                            
//                                     console.log('Update Electricity Recharge Trasaction----2');
//                                     const returnrecharge = await update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'success',datarecharge.utr,datarecharge.message,'direct')
                               
//                                     console.log('Update Electricity Recharge Trasaction----3');
//                                     console.log(returnrecharge[0].transactionsID);    
//                                     console.log(returnrecharge[0].serviceprovider);  
//                                     console.log(returnrecharge[0].paidtype);  
//                                     console.log(returnrecharge[0].mobilenumber);  
//                                     console.log(returnrecharge[0].amount);  
//                                     console.log(returnrecharge[0].Message);  
//                                     console.log('Update Electricity Recharge Trasaction----4');
                                            
//                                           res.json({
//                                               status:"success",
//                                               paytype:'direct_payment',    
//                                               redirect:'success',
                                              
//                                               transactionsID:returnrecharge[0].transactionsID,
//                                               serviceprovider:returnrecharge[0].serviceprovider,
//                                               paidtype:returnrecharge[0].paidtype,
//                                               mobilenumber:returnrecharge[0].mobilenumber,
//                                               amount:returnrecharge[0].amount,
//                                               msg:returnrecharge[0].Message,      
                                                                        
//                                         });
                                
//                                   }
//                                   else
//                                   {
//                                         console.log('Update Electricity Recharge Trasaction----6');
//                                         update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'failure',datarecharge.utr,datarecharge.message,'direct');
                                        
//                                         console.log('Update Electricity Recharge Trasaction----7');
                                    



//                                             res.json({
//                                                 status:"failure",
//                                                 paytype:'direct_payment',    
//                                                 redirect:'success',
                                                
//                                                 transactionsID:'',
//                                                 serviceprovider:'',
//                                                 paidtype:"",
//                                                 mobilenumber:"",
//                                                 amount:"",
//                                                 msg:datarecharge.message,      
                                                                          
//                                           });

//                                   }

//                           }
//                           else
//                             {





//                             console.log('Update Electricity Recharge Trasaction----6');
//                             update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'failure',"","Minimum Recharge 10",'direct')
//                             console.log('Update Electricity Recharge Trasaction----7');
                        



//                                 res.json({
//                                     status:"failure",
//                                     paytype:'direct_payment',    
//                                     redirect:'success',
                                    
//                                     transactionsID:"",
//                                     serviceprovider:"",
//                                     paidtype:"",
//                                     mobilenumber:"",
//                                     amount:"",
//                                     msg:"Minimum Recharge 10",      
                                                              
//                               });




//                           }
//                        }
//                   else{
                             

                              
//                             res.json({
//                               status:"failure",
//                                 paytype:'direct_payment',    
//                                 redirect:'success',
                                
//                                 transactionsID:"",
//                                 serviceprovider:"",
//                                 paidtype:"",
//                                 mobilenumber:"",
//                                 amount:"",
//                                 msg:"Insufficient Balance",      
                                                          
//                           });

//                       }
      

//                      //end



//                  }
//                   else if(result["recordset"][0].category=="Broadband Postpaid")
//                  {




//                      console.log('---Broadband Postpaid  1---');
//                      //Broadband Postpaid payment

//                          const getdatabalance= await getbalance(result["recordset"][0].userid);
//                         console.log(getdatabalance.MSG);
//                         console.log(getdatabalance.Balance);

//                       if(parseFloat(getpay2all_balance.data.balance.user_balance) >= parseFloat(result["recordset"][0].amount))
//                         {
                 
//                           console.log(result["recordset"][0].accountno);
//                           console.log(result["recordset"][0].provideid);
//                           console.log(result["recordset"][0].amount);
//                           console.log(result["recordset"][0].uniqueid);
//                           console.log(result["recordset"][0].mobileno);
//                             console.log(result["recordset"][0].token);

                  
//                            console.log('---Broadband Postpaid  2 ---');

//                           if(result["recordset"][0].amount >=10)
//                           {

//                                 const datarecharge = await funcbillfetchpay(result["recordset"][0].accountno,result["recordset"][0].ReferenceID,result["recordset"][0].amount,result["recordset"][0].provideid,result["recordset"][0].uniqueid,result["recordset"][0].Name,result["recordset"][0].mobileno,result["recordset"][0].token);
                                                                         
    
//                                 console.log('---Broadband Postpaid  result 2---');
//                               console.log(datarecharge.status_id);
//                                 console.log(datarecharge.balance);
//                                 console.log(datarecharge.order_id);
//                                 console.log(datarecharge.utr);
//                                 console.log(datarecharge.report_id);
//                               console.log(datarecharge.message);
//                                 console.log('---Landline Postpaid  result 3---');
                      
                  
//                                 if(datarecharge.status_id.toString()=="1")
//                                   {
//                                     console.log('Update Broadband Postpaid Recharge Trasaction----1');
//                                     console.log(result["recordset"][0].userid);
//                                     console.log(result["recordset"][0].uniqueid);
//                                     console.log(datarecharge.utr);
//                                     console.log(datarecharge.message);
                            
//                                     console.log('Update Broadband Postpaid Recharge Trasaction----2');
//                                     const returnrecharge = await update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'success',datarecharge.utr,datarecharge.message,'direct')
                               
//                                     console.log('Update Broadband Postpaid Recharge Trasaction----3');
//                                     console.log(returnrecharge[0].transactionsID);    
//                                     console.log(returnrecharge[0].serviceprovider);  
//                                     console.log(returnrecharge[0].paidtype);  
//                                     console.log(returnrecharge[0].mobilenumber);  
//                                     console.log(returnrecharge[0].amount);  
//                                     console.log(returnrecharge[0].Message);  
//                                     console.log('Update Broadband Postpaid Recharge Trasaction----4');
                                            
//                                           res.json({
//                                               status:"success",
//                                               paytype:'direct_payment',    
//                                               redirect:'success',
                                              
//                                               transactionsID:returnrecharge[0].transactionsID,
//                                               serviceprovider:returnrecharge[0].serviceprovider,
//                                               paidtype:returnrecharge[0].paidtype,
//                                               mobilenumber:returnrecharge[0].mobilenumber,
//                                               amount:returnrecharge[0].amount,
//                                               msg:returnrecharge[0].Message,      
                                                                        
//                                         });
                                
//                                   }
//                                   else
//                                   {
//                                         console.log('Update Broadband Postpaid Recharge Trasaction----6');
//                                         update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'failure',datarecharge.utr,datarecharge.message,'direct');
                                        
//                                         console.log('Update Broadband Postpaid Recharge Trasaction----7');
                                    



//                                             res.json({
//                                                 status:"failure",
//                                                 paytype:'direct_payment',    
//                                                 redirect:'success',
                                                
//                                                 transactionsID:'',
//                                                 serviceprovider:'',
//                                                 paidtype:"",
//                                                 mobilenumber:"",
//                                                 amount:"",
//                                                 msg:datarecharge.message,      
                                                                          
//                                           });

//                                   }

//                           }
//                           else
//                             {





//                             console.log('Update Broadband Postpaid Recharge Trasaction----6');
//                             update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'failure',"","Minimum Recharge 10",'direct')
//                             console.log('Update Broadband Postpaid Recharge Trasaction----7');
                        



//                                 res.json({
//                                     status:"failure",
//                                     paytype:'direct_payment',    
//                                     redirect:'success',
                                    
//                                     transactionsID:"",
//                                     serviceprovider:"",
//                                     paidtype:"",
//                                     mobilenumber:"",
//                                     amount:"",
//                                     msg:"Minimum Recharge 10",      
                                                              
//                               });




//                           }
//                        }
//                     else{
                             

                              
//                             res.json({
//                                 status:"failure",
//                                 paytype:'direct_payment',    
//                                 redirect:'success',
                                
//                                 transactionsID:"",
//                                 serviceprovider:"",
//                                 paidtype:"",
//                                 mobilenumber:"",
//                                 amount:"",
//                                 msg:"Insufficient Balance",      
                                                          
//                           });

//                       }
      

//                      //end






//                  }
//                  else if(result["recordset"][0].category=="Landline Postpaid")
//                  {

//                      console.log('---Landline Postpaid  1---');
//                      //Landline Postpaid payment

//                          const getdatabalance= await getbalance(result["recordset"][0].userid);
//                         console.log(getdatabalance.MSG);
//                         console.log(getdatabalance.Balance);

//                       if(parseFloat(getpay2all_balance.data.balance.user_balance) >= parseFloat(result["recordset"][0].amount))
//                         {
                 
//                           console.log(result["recordset"][0].accountno);
//                           console.log(result["recordset"][0].provideid);
//                           console.log(result["recordset"][0].amount);
//                           console.log(result["recordset"][0].uniqueid);
//                           console.log(result["recordset"][0].mobileno);
//                             console.log(result["recordset"][0].token);

                  
//                            console.log('---Landline Postpaid  2 ---');

//                           if(result["recordset"][0].amount >=10)
//                           {

//                                 const datarecharge = await funcbillfetchpay(result["recordset"][0].accountno,result["recordset"][0].ReferenceID,result["recordset"][0].amount,result["recordset"][0].provideid,result["recordset"][0].uniqueid,result["recordset"][0].Name,result["recordset"][0].mobileno,result["recordset"][0].token);
                                                                         
    
//                                 console.log('---Landline Postpaid  result 2---');
//                               console.log(datarecharge.status_id);
//                                 console.log(datarecharge.balance);
//                                 console.log(datarecharge.order_id);
//                                 console.log(datarecharge.utr);
//                                 console.log(datarecharge.report_id);
//                               console.log(datarecharge.message);
//                                 console.log('---Landline Postpaid  result 3---');
                      
                  
//                                 if(datarecharge.status_id.toString()=="1")
//                                   {
//                                     console.log('Update Landline Postpaid Recharge Trasaction----1');
//                                     console.log(result["recordset"][0].userid);
//                                     console.log(result["recordset"][0].uniqueid);
//                                     console.log(datarecharge.utr);
//                                     console.log(datarecharge.message);
                            
//                                     console.log('Update Landline Postpaid Recharge Trasaction----2');
//                                     const returnrecharge = await update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'success',datarecharge.utr,datarecharge.message,'direct')
                               
//                                     console.log('Update Landline Postpaid Recharge Trasaction----3');
//                                     console.log(returnrecharge[0].transactionsID);    
//                                     console.log(returnrecharge[0].serviceprovider);  
//                                     console.log(returnrecharge[0].paidtype);  
//                                     console.log(returnrecharge[0].mobilenumber);  
//                                     console.log(returnrecharge[0].amount);  
//                                     console.log(returnrecharge[0].Message);  
//                                     console.log('Update Landline Postpaid Recharge Trasaction----4');
                                            
//                                           res.json({
//                                               status:"success",
//                                               paytype:'direct_payment',    
//                                               redirect:'success',
                                              
//                                               transactionsID:returnrecharge[0].transactionsID,
//                                               serviceprovider:returnrecharge[0].serviceprovider,
//                                               paidtype:returnrecharge[0].paidtype,
//                                               mobilenumber:returnrecharge[0].mobilenumber,
//                                               amount:returnrecharge[0].amount,
//                                               msg:returnrecharge[0].Message,      
                                                                        
//                                         });
                                
//                                   }
//                                   else
//                                   {
//                                         console.log('Update Landline Postpaid Recharge Trasaction----6');
//                                         update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'failure',datarecharge.utr,datarecharge.message,'direct');
                                        
//                                         console.log('Update Landline Postpaid Recharge Trasaction----7');
                                    



//                                             res.json({
//                                                 status:"failure",
//                                                 paytype:'direct_payment',    
//                                                 redirect:'success',
                                                
//                                                 transactionsID:'',
//                                                 serviceprovider:'',
//                                                 paidtype:"",
//                                                 mobilenumber:"",
//                                                 amount:"",
//                                                 msg:datarecharge.message,      
                                                                          
//                                           });

//                                   }

//                           }
//                           else
//                             {





//                             console.log('Update Landline Postpaid Recharge Trasaction----6');
//                             update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'failure',"","Minimum Recharge 10",'direct')
//                             console.log('Update Landline Postpaid Recharge Trasaction----7');
                        



//                                 res.json({
//                                     status:"failure",
//                                     paytype:'direct_payment',    
//                                     redirect:'success',
                                    
//                                     transactionsID:"",
//                                     serviceprovider:"",
//                                     paidtype:"",
//                                     mobilenumber:"",
//                                     amount:"",
//                                     msg:"Minimum Recharge 10",      
                                                              
//                               });




//                           }
//                        }
//                     else{
                             

                              
//                             res.json({
//                                 status:"failure",
//                                 paytype:'direct_payment',    
//                                 redirect:'success',
                                
//                                 transactionsID:"",
//                                 serviceprovider:"",
//                                 paidtype:"",
//                                 mobilenumber:"",
//                                 amount:"",
//                                 msg:"Insufficient Balance",      
                                                          
//                           });

//                       }
      

//                      //end


//                  }
//                   else if(result["recordset"][0].category=="Cable TV")
//                  {

//                  }
//                   else if(result["recordset"][0].category=="Gas")
//                  {

//                          console.log('---Gas  1---');
//                      //Gas payment

//                          const getdatabalance= await getbalance(result["recordset"][0].userid);
//                         console.log(getdatabalance.MSG);
//                         console.log(getdatabalance.Balance);

//                       if(parseFloat(getpay2all_balance.data.balance.user_balance) >= parseFloat(result["recordset"][0].amount))
//                         {
                 
//                           console.log(result["recordset"][0].accountno);
//                           console.log(result["recordset"][0].provideid);
//                           console.log(result["recordset"][0].amount);
//                           console.log(result["recordset"][0].uniqueid);
//                           console.log(result["recordset"][0].mobileno);
//                             console.log(result["recordset"][0].token);

                  
//                            console.log('---Gas  2 ---');

//                           if(result["recordset"][0].amount >=10)
//                           {

//                                 const datarecharge = await funcbillfetchpay(result["recordset"][0].accountno,result["recordset"][0].ReferenceID,result["recordset"][0].amount,result["recordset"][0].provideid,result["recordset"][0].uniqueid,result["recordset"][0].Name,result["recordset"][0].mobileno,result["recordset"][0].token);
                                                                         
    
//                                 console.log('---Gas  result 2---');
//                               console.log(datarecharge.status_id);
//                                 console.log(datarecharge.balance);
//                                 console.log(datarecharge.order_id);
//                                 console.log(datarecharge.utr);
//                                 console.log(datarecharge.report_id);
//                               console.log(datarecharge.message);
//                                 console.log('---Gas  result 3---');
                      
                  
//                                 if(datarecharge.status_id.toString()=="1")
//                                   {
//                                     console.log('Update Gas Recharge Trasaction----1');
//                                     console.log(result["recordset"][0].userid);
//                                     console.log(result["recordset"][0].uniqueid);
//                                     console.log(datarecharge.utr);
//                                     console.log(datarecharge.message);
                            
//                                     console.log('Update Gas Recharge Trasaction----2');
//                                     const returnrecharge = await update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'success',datarecharge.utr,datarecharge.message,'direct')
                               
//                                     console.log('Update Gas Recharge Trasaction----3');
//                                     console.log(returnrecharge[0].transactionsID);    
//                                     console.log(returnrecharge[0].serviceprovider);  
//                                     console.log(returnrecharge[0].paidtype);  
//                                     console.log(returnrecharge[0].mobilenumber);  
//                                     console.log(returnrecharge[0].amount);  
//                                     console.log(returnrecharge[0].Message);  
//                                     console.log('Update Gas Recharge Trasaction----4');
                                            
//                                           res.json({
//                                               status:"success",
//                                               paytype:'direct_payment',    
//                                               redirect:'success',
                                              
//                                               transactionsID:returnrecharge[0].transactionsID,
//                                               serviceprovider:returnrecharge[0].serviceprovider,
//                                               paidtype:returnrecharge[0].paidtype,
//                                               mobilenumber:returnrecharge[0].mobilenumber,
//                                               amount:returnrecharge[0].amount,
//                                               msg:returnrecharge[0].Message,      
                                                                        
//                                         });
                                
//                                   }
//                                   else
//                                   {
//                                         console.log('Update GasRecharge Trasaction----6');
//                                         update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'failure',datarecharge.utr,datarecharge.message,'direct');
                                        
//                                         console.log('Update Gas Recharge Trasaction----7');
                                    



//                                             res.json({
//                                                 status:"failure",
//                                                 paytype:'direct_payment',    
//                                                 redirect:'success',
                                                
//                                                 transactionsID:'',
//                                                 serviceprovider:'',
//                                                 paidtype:"",
//                                                 mobilenumber:"",
//                                                 amount:"",
//                                                 msg:datarecharge.message,      
                                                                          
//                                           });

//                                   }

//                           }
//                           else
//                             {





//                             console.log('Update Gas Recharge Trasaction----6');
//                             update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'failure',"","Minimum Recharge 10",'direct')
//                             console.log('Update Gas Recharge Trasaction----7');
                        



//                                 res.json({
//                                     status:"failure",
//                                     paytype:'direct_payment',    
//                                     redirect:'success',
                                    
//                                     transactionsID:"",
//                                     serviceprovider:"",
//                                     paidtype:"",
//                                     mobilenumber:"",
//                                     amount:"",
//                                     msg:"Minimum Recharge 10",      
                                                              
//                               });




//                           }
//                        }
//                     else{
                             

                              
//                             res.json({
//                                 status:"failure",
//                                 paytype:'direct_payment',    
//                                 redirect:'success',
                                
//                                 transactionsID:"",
//                                 serviceprovider:"",
//                                 paidtype:"",
//                                 mobilenumber:"",
//                                 amount:"",
//                                 msg:"Insufficient Balance",      
                                                          
//                           });

//                       }
      

//                      //end

//                  }
//                   else if(result["recordset"][0].category=="Water")
//                  {

//                     console.log('---Water  1---');
//                      //Water payment

//                          const getdatabalance= await getbalance(result["recordset"][0].userid);
//                         console.log(getdatabalance.MSG);
//                         console.log(getdatabalance.Balance);

//                       if(parseFloat(getpay2all_balance.data.balance.user_balance) >= parseFloat(result["recordset"][0].amount))
//                         {
                 
//                           console.log(result["recordset"][0].accountno);
//                           console.log(result["recordset"][0].provideid);
//                           console.log(result["recordset"][0].amount);
//                           console.log(result["recordset"][0].uniqueid);
//                           console.log(result["recordset"][0].mobileno);
//                             console.log(result["recordset"][0].token);

                  
//                            console.log('---Water  2 ---');

//                           if(result["recordset"][0].amount >=10)
//                           {

//                                 const datarecharge = await funcbillfetchpay(result["recordset"][0].accountno,result["recordset"][0].ReferenceID,result["recordset"][0].amount,result["recordset"][0].provideid,result["recordset"][0].uniqueid,result["recordset"][0].Name,result["recordset"][0].mobileno,result["recordset"][0].token);
                                                                         
    
//                                 console.log('---Water  result 2---');
//                               console.log(datarecharge.status_id);
//                                 console.log(datarecharge.balance);
//                                 console.log(datarecharge.order_id);
//                                 console.log(datarecharge.utr);
//                                 console.log(datarecharge.report_id);
//                               console.log(datarecharge.message);
//                                 console.log('---Water  result 3---');
                      
                  
//                                 if(datarecharge.status_id.toString()=="1")
//                                   {
//                                     console.log('Update Water Recharge Trasaction----1');
//                                     console.log(result["recordset"][0].userid);
//                                     console.log(result["recordset"][0].uniqueid);
//                                     console.log(datarecharge.utr);
//                                     console.log(datarecharge.message);
                            
//                                     console.log('Update Water Recharge Trasaction----2');
//                                     const returnrecharge = await update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'success',datarecharge.utr,datarecharge.message,'direct')
                               
//                                     console.log('Update Water Recharge Trasaction----3');
//                                     console.log(returnrecharge[0].transactionsID);    
//                                     console.log(returnrecharge[0].serviceprovider);  
//                                     console.log(returnrecharge[0].paidtype);  
//                                     console.log(returnrecharge[0].mobilenumber);  
//                                     console.log(returnrecharge[0].amount);  
//                                     console.log(returnrecharge[0].Message);  
//                                     console.log('Update Water Recharge Trasaction----4');
                                            
//                                           res.json({
//                                               status:"success",
//                                               paytype:'direct_payment',    
//                                               redirect:'success',
                                              
//                                               transactionsID:returnrecharge[0].transactionsID,
//                                               serviceprovider:returnrecharge[0].serviceprovider,
//                                               paidtype:returnrecharge[0].paidtype,
//                                               mobilenumber:returnrecharge[0].mobilenumber,
//                                               amount:returnrecharge[0].amount,
//                                               msg:returnrecharge[0].Message,      
                                                                        
//                                         });
                                
//                                   }
//                                   else
//                                   {
//                                         console.log('Update Water Trasaction----6');
//                                         update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'failure',datarecharge.utr,datarecharge.message,'direct');
                                        
//                                         console.log('Update Water Recharge Trasaction----7');
                                    



//                                             res.json({
//                                                 status:"failure",
//                                                 paytype:'direct_payment',    
//                                                 redirect:'success',
                                                
//                                                 transactionsID:'',
//                                                 serviceprovider:'',
//                                                 paidtype:"",
//                                                 mobilenumber:"",
//                                                 amount:"",
//                                                 msg:datarecharge.message,      
                                                                          
//                                           });

//                                   }

//                           }
//                           else
//                             {





//                             console.log('Update Water Recharge Trasaction----6');
//                             update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'failure',"","Minimum Recharge 10",'direct')
//                             console.log('Update Water Recharge Trasaction----7');
                        



//                                 res.json({
//                                     status:"failure",
//                                     paytype:'direct_payment',    
//                                     redirect:'success',
                                    
//                                     transactionsID:"",
//                                     serviceprovider:"",
//                                     paidtype:"",
//                                     mobilenumber:"",
//                                     amount:"",
//                                     msg:"Minimum Recharge 10",      
                                                              
//                               });




//                           }
//                        }
//                     else{
                             

                              
//                             res.json({
//                                 status:"failure",
//                                 paytype:'direct_payment',    
//                                 redirect:'success',
                                
//                                 transactionsID:"",
//                                 serviceprovider:"",
//                                 paidtype:"",
//                                 mobilenumber:"",
//                                 amount:"",
//                                 msg:"Insufficient Balance",      
                                                          
//                           });

//                       }
      

//                      //end


//                  }
//                  else if(result["recordset"][0].category=="Credit Card")
//                  {

//                          console.log('---Credit Card Start 1---');
//                      //Credit Card payment

//                          const getdatabalance= await getbalance(result["recordset"][0].userid);
//                         console.log(getdatabalance.MSG);
//                         console.log(getdatabalance.Balance);
// 						console.log(getpay2all_balance.data.balance.user_balance);
// 						console.log(parseFloat(getpay2all_balance.data.balance.user_balance));
// 						console.log(parseFloat(result["recordset"][0].amount));
// 					console.log('---Credit Card END  2---');
//                       if(parseFloat(getpay2all_balance.data.balance.user_balance) >= parseFloat(result["recordset"][0].amount))
//                         {
                 
//                           console.log(result["recordset"][0].accountno);
//                           console.log(result["recordset"][0].provideid);
//                           console.log(result["recordset"][0].amount);
//                           console.log(result["recordset"][0].uniqueid);
//                           console.log(result["recordset"][0].mobileno);
//                             console.log(result["recordset"][0].token);

                  
//                            console.log('---Credit Card  2 ---');

//                           if(result["recordset"][0].amount >=1)
//                           {

//                                 const datarecharge = await funcbillfetchpay_test(result["recordset"][0].accountno,result["recordset"][0].ReferenceID,result["recordset"][0].amount,result["recordset"][0].provideid,result["recordset"][0].uniqueid,result["recordset"][0].Name,result["recordset"][0].mobileno,result["recordset"][0].token);
                                                                         
    
//                                 console.log('---Credit Card  result 2---');
//                               console.log(datarecharge.status_id);
//                                 console.log(datarecharge.balance);
//                                 console.log(datarecharge.order_id);
//                                 console.log(datarecharge.utr);
//                                 console.log(datarecharge.report_id);
//                               console.log(datarecharge.message);
//                                 console.log('---Credit Card  result 3---');
                      
                  
//                                 if(datarecharge.status_id.toString()=="1")
//                                   {
//                                     console.log('Update Credit Card Recharge Trasaction----1');
//                                     console.log(result["recordset"][0].userid);
//                                     console.log(result["recordset"][0].uniqueid);
//                                     console.log(datarecharge.utr);
//                                     console.log(datarecharge.message);
                            
//                                     console.log('Update Credit Card Recharge Trasaction----2');
//                                     const returnrecharge = await update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'success',datarecharge.utr,datarecharge.message,'direct')
                               
//                                     console.log('Update Credit Card Recharge Trasaction----3');
//                                     console.log(returnrecharge[0].transactionsID);    
//                                     console.log(returnrecharge[0].serviceprovider);  
//                                     console.log(returnrecharge[0].paidtype);  
//                                     console.log(returnrecharge[0].mobilenumber);  
//                                     console.log(returnrecharge[0].amount);  
//                                     console.log(returnrecharge[0].Message);  
//                                     console.log('Update Credit Card Recharge Trasaction----4');
                                            
//                                           res.json({
//                                               status:"success",
//                                               paytype:'direct_payment',    
//                                               redirect:'success',
                                              
//                                               transactionsID:returnrecharge[0].transactionsID,
//                                               serviceprovider:returnrecharge[0].serviceprovider,
//                                               paidtype:returnrecharge[0].paidtype,
//                                               mobilenumber:returnrecharge[0].mobilenumber,
//                                               amount:returnrecharge[0].amount,
//                                               msg:returnrecharge[0].Message,      
                                                                        
//                                         });
                                
//                                   }
// 								  else if(datarecharge.status_id.toString()=="3")
//                                   {
//                                     console.log('Update Credit Card Recharge Pending Trasaction----1');
//                                     console.log(result["recordset"][0].userid);
//                                     console.log(result["recordset"][0].uniqueid);
//                                     console.log(datarecharge.utr);
//                                     console.log(datarecharge.message);
                            
//                                     console.log('Update Credit Card Recharge Pending Trasaction----2');
//                                     const returnrecharge = await update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'success',datarecharge.utr,datarecharge.message,'direct')
                               
//                                     console.log('Update Credit Card Recharge Pending Trasaction----3');
//                                     console.log(returnrecharge[0].transactionsID);    
//                                     console.log(returnrecharge[0].serviceprovider);  
//                                     console.log(returnrecharge[0].paidtype);  
//                                     console.log(returnrecharge[0].mobilenumber);  
//                                     console.log(returnrecharge[0].amount);  
//                                     console.log(returnrecharge[0].Message);  
//                                     console.log('Update Credit Card Recharge Pending Trasaction----4');
                                            
//                                           res.json({
//                                               status:"Pending",
//                                               paytype:'direct_payment',    
//                                               redirect:'success',
                                              
//                                               transactionsID:returnrecharge[0].transactionsID,
//                                               serviceprovider:returnrecharge[0].serviceprovider,
//                                               paidtype:returnrecharge[0].paidtype,
//                                               mobilenumber:returnrecharge[0].mobilenumber,
//                                               amount:returnrecharge[0].amount,
//                                               msg:returnrecharge[0].Message,      
                                                                        
//                                         });
                                
//                                   }
//                                   else
//                                   {
//                                         console.log('Update Credit Card Trasaction----6');
//                                         update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'failure',datarecharge.utr,datarecharge.message,'direct');
                                        
//                                         console.log('Update Credit Card Recharge Trasaction----7');
                                    



//                                             res.json({
//                                                 status:"failure",
//                                                 paytype:'direct_payment',    
//                                                 redirect:'success',
                                                
//                                                 transactionsID:'',
//                                                 serviceprovider:'',
//                                                 paidtype:"",
//                                                 mobilenumber:"",
//                                                 amount:"",
//                                                 msg:datarecharge.message,      
                                                                          
//                                           });

//                                   }

//                           }
//                           else
//                             {





//                             console.log('Update Credit Card Recharge Trasaction----6');
//                             update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'failure',"","Minimum Recharge 10",'direct')
//                             console.log('Update Credit Card Recharge Trasaction----7');
                        



//                                 res.json({
//                                     status:"failure",
//                                     paytype:'direct_payment',    
//                                     redirect:'success',
                                    
//                                     transactionsID:"",
//                                     serviceprovider:"",
//                                     paidtype:"",
//                                     mobilenumber:"",
//                                     amount:"",
//                                     msg:"Minimum Recharge 10",      
                                                              
//                               });




//                           }
//                        }
//                     else{
                             

                              
//                             res.json({
//                                 status:"failure",
//                                 paytype:'direct_payment',    
//                                 redirect:'success',
                                
//                                 transactionsID:"",
//                                 serviceprovider:"",
//                                paidtype:"",
//                                 mobilenumber:"",
//                                amount:"",
//                                 msg:"Insufficient Balance",      
                                                          
//                           });

//                      }
      

//                      //end


//                  }
//                  else if(result["recordset"][0].category=="Insurance")
//                  {



//                     console.log('---Insurance  1---');
//                      //Insurance payment

//                          const getdatabalance= await getbalance(result["recordset"][0].userid);
//                         console.log(getdatabalance.MSG);
//                         console.log(getdatabalance.Balance);

//                       if(parseFloat(getpay2all_balance.data.balance.user_balance) >= parseFloat(result["recordset"][0].amount))
//                         {
                 
//                           console.log(result["recordset"][0].accountno);
//                           console.log(result["recordset"][0].provideid);
//                           console.log(result["recordset"][0].amount);
//                           console.log(result["recordset"][0].uniqueid);
//                           console.log(result["recordset"][0].mobileno);
//                             console.log(result["recordset"][0].token);

                  
//                            console.log('---Insurance  2 ---');

//                           if(result["recordset"][0].amount >=10)
//                           {

//                                 const datarecharge = await funcbillfetchpay(result["recordset"][0].accountno,result["recordset"][0].ReferenceID,result["recordset"][0].amount,result["recordset"][0].provideid,result["recordset"][0].uniqueid,result["recordset"][0].Name,result["recordset"][0].mobileno,result["recordset"][0].token);
                                                                         
    
//                                 console.log('---Insurance  result 2---');
//                               console.log(datarecharge.status_id);
//                                 console.log(datarecharge.balance);
//                                 console.log(datarecharge.order_id);
//                                 console.log(datarecharge.utr);
//                                 console.log(datarecharge.report_id);
//                               console.log(datarecharge.message);
//                                 console.log('---Insurance  result 3---');
                      
                  
//                                 if(datarecharge.status_id.toString()=="1")
//                                   {
//                                     console.log('Update Insurance Recharge Trasaction----1');
//                                     console.log(result["recordset"][0].userid);
//                                     console.log(result["recordset"][0].uniqueid);
//                                     console.log(datarecharge.utr);
//                                     console.log(datarecharge.message);
                            
//                                     console.log('Update Insurance Recharge Trasaction----2');
//                                     const returnrecharge = await update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'success',datarecharge.utr,datarecharge.message,'direct')
                               
//                                     console.log('Update Insurance Recharge Trasaction----3');
//                                     console.log(returnrecharge[0].transactionsID);    
//                                     console.log(returnrecharge[0].serviceprovider);  
//                                     console.log(returnrecharge[0].paidtype);  
//                                     console.log(returnrecharge[0].mobilenumber);  
//                                     console.log(returnrecharge[0].amount);  
//                                     console.log(returnrecharge[0].Message);  
//                                     console.log('Update Insurance Recharge Trasaction----4');
                                            
//                                           res.json({
//                                               status:"success",
//                                               paytype:'direct_payment',    
//                                               redirect:'success',
                                              
//                                               transactionsID:returnrecharge[0].transactionsID,
//                                               serviceprovider:returnrecharge[0].serviceprovider,
//                                               paidtype:returnrecharge[0].paidtype,
//                                               mobilenumber:returnrecharge[0].mobilenumber,
//                                               amount:returnrecharge[0].amount,
//                                               msg:returnrecharge[0].Message,      
                                                                        
//                                         });
                                
//                                   }
//                                   else
//                                   {
//                                         console.log('Update Insurance Trasaction----6');
//                                         update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'failure',datarecharge.utr,datarecharge.message,'direct');
                                        
//                                         console.log('Update Insurance Recharge Trasaction----7');
                                    



//                                             res.json({
//                                                 status:"failure",
//                                                 paytype:'direct_payment',    
//                                                 redirect:'success',
                                                
//                                                 transactionsID:'',
//                                                 serviceprovider:'',
//                                                 paidtype:"",
//                                                 mobilenumber:"",
//                                                 amount:"",
//                                                 msg:datarecharge.message,      
                                                                          
//                                           });

//                                   }

//                           }
//                           else
//                             {





//                             console.log('Update Insurance Recharge Trasaction----6');
//                             update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'failure',"","Minimum Recharge 10",'direct')
//                             console.log('UpdateInsurance Recharge Trasaction----7');
                        



//                                 res.json({
//                                     status:"failure",
//                                     paytype:'direct_payment',    
//                                     redirect:'success',
                                    
//                                     transactionsID:"",
//                                     serviceprovider:"",
//                                     paidtype:"",
//                                     mobilenumber:"",
//                                     amount:"",
//                                     msg:"Minimum Recharge 10",      
                                                              
//                               });




//                           }
//                        }
//                     else{
                             

                              
//                             res.json({
//                                 status:"failure",
//                                 paytype:'direct_payment',    
//                                 redirect:'success',
                                
//                                 transactionsID:"",
//                                 serviceprovider:"",
//                                 paidtype:"",
//                                 mobilenumber:"",
//                                 amount:"",
//                                 msg:"Insufficient Balance",      
                                                          
//                           });

//                       }
      

//                      //end






//                  }
//                   else if(result["recordset"][0].category=="Loan")
//                  {




//                     console.log('---Loan  1---');
//                      //Insurance payment

//                          const getdatabalance= await getbalance(result["recordset"][0].userid);
//                         console.log(getdatabalance.MSG);
//                         console.log(getdatabalance.Balance);

//                       if(parseFloat(getpay2all_balance.data.balance.user_balance) >= parseFloat(result["recordset"][0].amount))
//                         {
                 
//                           console.log(result["recordset"][0].accountno);
//                           console.log(result["recordset"][0].provideid);
//                           console.log(result["recordset"][0].amount);
//                           console.log(result["recordset"][0].uniqueid);
//                           console.log(result["recordset"][0].mobileno);
//                             console.log(result["recordset"][0].token);

                  
//                            console.log('---Loan  2 ---');

//                           if(result["recordset"][0].amount >=10)
//                           {

//                                 const datarecharge = await funcbillfetchpay(result["recordset"][0].accountno,result["recordset"][0].ReferenceID,result["recordset"][0].amount,result["recordset"][0].provideid,result["recordset"][0].uniqueid,result["recordset"][0].Name,result["recordset"][0].mobileno,result["recordset"][0].token);
                                                                         
    
//                                 console.log('---Loan  result 2---');
//                               console.log(datarecharge.status_id);
//                                 console.log(datarecharge.balance);
//                                 console.log(datarecharge.order_id);
//                                 console.log(datarecharge.utr);
//                                 console.log(datarecharge.report_id);
//                               console.log(datarecharge.message);
//                                 console.log('---Loan  result 3---');
                      
                  
//                                 if(datarecharge.status_id.toString()=="1")
//                                   {
//                                     console.log('Update Loan Recharge Trasaction----1');
//                                     console.log(result["recordset"][0].userid);
//                                     console.log(result["recordset"][0].uniqueid);
//                                     console.log(datarecharge.utr);
//                                     console.log(datarecharge.message);
                            
//                                     console.log('Update Loan Recharge Trasaction----2');
//                                     const returnrecharge = await update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'success',datarecharge.utr,datarecharge.message,'direct')
                               
//                                     console.log('Update Loan Recharge Trasaction----3');
//                                     console.log(returnrecharge[0].transactionsID);    
//                                     console.log(returnrecharge[0].serviceprovider);  
//                                     console.log(returnrecharge[0].paidtype);  
//                                     console.log(returnrecharge[0].mobilenumber);  
//                                     console.log(returnrecharge[0].amount);  
//                                     console.log(returnrecharge[0].Message);  
//                                     console.log('Update Loan Recharge Trasaction----4');
                                            
//                                           res.json({
//                                               status:"success",
//                                               paytype:'direct_payment',    
//                                               redirect:'success',
                                              
//                                               transactionsID:returnrecharge[0].transactionsID,
//                                               serviceprovider:returnrecharge[0].serviceprovider,
//                                               paidtype:returnrecharge[0].paidtype,
//                                               mobilenumber:returnrecharge[0].mobilenumber,
//                                               amount:returnrecharge[0].amount,
//                                               msg:returnrecharge[0].Message,      
                                                                        
//                                         });
                                
//                                   }
//                                   else
//                                   {
//                                         console.log('Update Loan Trasaction----6');
//                                         update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'failure',datarecharge.utr,datarecharge.message,'direct');
                                        
//                                         console.log('Update Loan Recharge Trasaction----7');
                                    



//                                             res.json({
//                                                 status:"failure",
//                                                 paytype:'direct_payment',    
//                                                 redirect:'success',
                                                
//                                                 transactionsID:'',
//                                                 serviceprovider:'',
//                                                 paidtype:"",
//                                                 mobilenumber:"",
//                                                 amount:"",
//                                                 msg:datarecharge.message,      
                                                                          
//                                           });

//                                   }

//                           }
//                           else
//                             {





//                             console.log('Update Loan Recharge Trasaction----6');
//                             update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'failure',"","Minimum Recharge 10",'direct')
//                             console.log('Update Loan Recharge Trasaction----7');
                        



//                                 res.json({
//                                     status:"failure",
//                                     paytype:'direct_payment',    
//                                     redirect:'success',
                                    
//                                     transactionsID:"",
//                                     serviceprovider:"",
//                                     paidtype:"",
//                                     mobilenumber:"",
//                                     amount:"",
//                                     msg:"Minimum Recharge 10",      
                                                              
//                               });




//                           }
//                        }
//                     else{
                             

                              
//                             res.json({
//                                 status:"failure",
//                                 paytype:'direct_payment',    
//                                 redirect:'success',
                                
//                                 transactionsID:"",
//                                 serviceprovider:"",
//                                 paidtype:"",
//                                 mobilenumber:"",
//                                 amount:"",
//                                 msg:"Insufficient Balance",      
                                                          
//                           });

//                       }
      

//                      //end







//                  }
//                    else if(result["recordset"][0].category=="Education")
//                  {

//                  }

//               }
//               else
//                 {

// 						console.log('DEPOSIT--01');				
//                           const conn= await sql.connect(config);
//                           const result =await conn.request()
//                           .input("Tranid", req.params.id)
//                           .input("status", status.status)
//                           .input("amount", status.transaction_amount)
                        

//                           .execute("USP_UpdateSuccessTransaction");
//                           const data = result["recordset"];
//                            console.log(' Response:', data);
                          
//                             console.log(result["recordset"][0].paytype);


//                           res.json({
//                                       status:"success",
//                                       paytype:'deposit',    
//                                       redirect:'success',
//                                       amount:status.transaction_amount,
//                                       mobilenumber:'',
//                                       serviceprovider:'',
//                                       transactionsID:'',
//                                       msg:"success",      
                                                                
//                                 });


//                    }

                


//       } 
//         else
          
//           {
      
//             console.log('---failure or cancel payment---')
       
       
            



//            //#region cancel entry tn database
//               console.log(req.params.id);
//               console.log(status.status);
//               console.log(status.error_Message);


//             const conn= await sql.connect(config);
//             const result =await conn.request()



            
//             .input("Tranid", req.params.id)
//             .input("status", status.status)
//             .input("message", status.error_Message)
           

//             .execute("USP_Updatecancel");
//              const data = result["recordset"];
//                 console.log(' Response:', data);
//               console.log(data.paytype);
//               console.log(result["recordset"][0].paytype);

              
//                           res.json({
//                                       status:"failure",
//                                       paytype:'deposit',    
//                                       redirect:'failed',
//                                       amount:status.transaction_amount,
//                                       mobilenumber:'',
//                                       serviceprovider:'',
//                                       transactionsID:'',
//                                       msg:"failure",      
                                                                
//                                 });
//              //#endregion cancel payment
            
             



      

//     }
//   } catch (error) {
//      console.log('---44---')
//     console.error("Error verifying payment:", error);
//     res.status(500).send(error);
//   }



// });





 router.get("/verify/:id", async  function(req, res){
//app.get("/verify/:id", async (req, res) => {
  try {

    console.log('---verify payment fetch---');
     console.log(req.params.id)
    const data = await payuClient.verifyPayment(req.params.id);
    const status = data.transaction_details[req.params.id];
	   console.log(status);
	   console.log(status.status);
     console.log(status.transaction_amount);
    
	   console.log(status.error_Message);
     console.log('---v---');
    if (status.status === "success") 
      {










             const conn= await sql.connect(config);
            const result =await conn.request()
 
            .input("Tranid", req.params.id)
           

            .execute("USP_getPaymode");
             const data = result["recordset"];
                console.log(' Response:', data);
              console.log(data.paytype);
              console.log(result["recordset"][0].paytype);
                 console.log('---category---');
               console.log(result["recordset"][0].Name);
			   
			   
			   
			   
			

              if(result["recordset"][0].paytype =="direct_payment")
              {
				  
				  
				  console.log('---Payment success return with pay2all balance get--Start****1---');
			console.log(result["recordset"][0].token);
			const getpay2all_balance = await getpay2allprofile(result["recordset"][0].token);
			console.log('---Payment success return with pay2all balance get--Start****2---');
			console.log(getpay2all_balance.data.balance.user_balance);			
			console.log('---Payment success return with pay2all balance get--Start****3		---');
		
			   
			   
			  console.log('---Payment success return with pay2all balance get--Start****4---');

                   console.log('---Direct pay 1---');
				    console.log(result["recordset"][0].category);
					console.log('---Payment success return with pay2all balance get--Start****5---');

                 if(result["recordset"][0].category=="mobile")
                 {
                  
                   
                  const getdatabalance= await getbalance(result["recordset"][0].userid);
                    console.log(getdatabalance.MSG);
                    console.log(getdatabalance.Balance);

                  if(parseFloat(getpay2all_balance.data.balance.user_balance) >= parseFloat(result["recordset"][0].amount))
                    {

                      console.log('---Mobile  1---');
                      //mobile recharge
                      console.log(result["recordset"][0].accountno);
                      console.log(result["recordset"][0].provideid);
                      console.log(result["recordset"][0].amount);
                      console.log(result["recordset"][0].uniqueid);
                      console.log(result["recordset"][0].mobileno);
                        console.log(result["recordset"][0].token);

                    
                        console.log('---Mobile  2 ---');

                        if(result["recordset"][0].amount >=10)
                        {

                              const datarecharge = await funcmobilerecharge(result["recordset"][0].accountno,result["recordset"][0].provideid,result["recordset"][0].amount,result["recordset"][0].uniqueid,result["recordset"][0].mobileno,result["recordset"][0].token); 
                                console.log('---Mobile  result 2---');
                            console.log(datarecharge.status_id);
                              console.log(datarecharge.balance);
                              console.log(datarecharge.order_id);
                              console.log(datarecharge.utr);
                              console.log(datarecharge.report_id);
                            console.log(datarecharge.message);
                              console.log('---Mobile  result 3---');
                    
                
                              if(datarecharge.status_id.toString()=="1")
                                {
                                  console.log('Update Mobile Recharge Trasaction----1');
                                  console.log(result["recordset"][0].userid);
                                  console.log(result["recordset"][0].uniqueid);
                                  console.log(datarecharge.utr);
                                  console.log(datarecharge.message);
                          
                                  console.log('Update Mobile Recharge Trasaction----2');
                                  const returnrecharge = await update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'success',datarecharge.utr,datarecharge.message,'direct')
                                  console.log('Update Mobile Recharge Trasaction----3');
                                  console.log(returnrecharge[0].transactionsID);    
                                  console.log(returnrecharge[0].serviceprovider);  
                                  console.log(returnrecharge[0].paidtype);  
                                  console.log(returnrecharge[0].mobilenumber);  
                                  console.log(returnrecharge[0].amount);  
                                  console.log(returnrecharge[0].Message);  
                                  console.log('Update Mobile Recharge Trasaction----4');
                                          
                                        res.json({
                                            status:"success",
                                            paytype:'direct_payment',    
                                            redirect:'success',
                                            
                                            transactionsID:returnrecharge[0].transactionsID,
                                            serviceprovider:returnrecharge[0].serviceprovider,
                                            paidtype:returnrecharge[0].paidtype,
                                            mobilenumber:returnrecharge[0].mobilenumber,
                                            amount:returnrecharge[0].amount,
                                            msg:returnrecharge[0].Message,      
                                                                      
                                      });
                              
                                }
                                else
                                {
                                      console.log('Update Mobile Recharge Trasaction----6');
                                      update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'failure',datarecharge.utr,datarecharge.message,'direct')
                                      console.log('Update Mobile Recharge Trasaction----7');
                                  



                                          res.json({
                                              status:"failure",
                                              paytype:'direct_payment',    
                                              redirect:'success',
                                              
                                              transactionsID:'',
                                              serviceprovider:'',
                                              paidtype:"",
                                              mobilenumber:"",
                                              amount:"",
                                              msg:datarecharge.message,      
                                                                        
                                        });

                                }

                        }
                        else
                          {





                          console.log('Update Mobile Recharge Trasaction----6');
                          update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'failure',"","Minimum Recharge 10",'direct')
                          console.log('Update Mobile Recharge Trasaction----7');
                      



                              res.json({
                                  status:"failure",
                                  paytype:'direct_payment',    
                                  redirect:'success',
                                  
                                  transactionsID:"",
                                  serviceprovider:"",
                                  paidtype:"",
                                  mobilenumber:"",
                                  amount:"",
                                  msg:"Minimum Recharge 10",      
                                                            
                            });




                        }

                    }
                  else{
                             

                              
                            res.json({
                                status:"failure",
                                paytype:'direct_payment',    
                                redirect:'success',
                                
                                transactionsID:"",
                                serviceprovider:"",
                                paidtype:"",
                                mobilenumber:"",
                                amount:"",
                                msg:"Insufficient Balance",      
                                                          
                          });

                      }
                     //end






                 }
                 else if(result["recordset"][0].category=="DTH")
                 {



                   console.log('---DTH  1---');


                     //DTH recharge

                    console.log(result["recordset"][0].userid);
                    console.log(result["recordset"][0].accountno);
                    console.log(result["recordset"][0].provideid);
                     console.log(result["recordset"][0].amount);
                    console.log(result["recordset"][0].uniqueid);
                     console.log(result["recordset"][0].mobileno);
                      console.log(result["recordset"][0].token);

                         const getdatabalance= await getbalance(result["recordset"][0].userid);
                        console.log(getdatabalance.MSG);
                        console.log(getdatabalance.Balance);

                      if(parseFloat(getpay2all_balance.data.balance.user_balance) >= parseFloat(result["recordset"][0].amount))
                        {
                  
                      console.log('---DTH  2 ---');

                      if(result["recordset"][0].amount >=10)
                      {


                           console.log(result["recordset"][0].accountno);
                             console.log(result["recordset"][0].provideid);
                             console.log(result["recordset"][0].amount);
                              console.log(result["recordset"][0].uniqueid);
                               console.log(result["recordset"][0].mobileno);
                                console.log(result["recordset"][0].token);
 console.log('---DTH  2 end ---');

                            const datarecharge = await funcmobilerecharge(result["recordset"][0].accountno,result["recordset"][0].provideid,result["recordset"][0].amount,result["recordset"][0].uniqueid,result["recordset"][0].mobileno,result["recordset"][0].token); 
                              console.log('---DTH  result 2---');
                          console.log(datarecharge.status_id);
                            console.log(datarecharge.balance);
                            console.log(datarecharge.order_id);
                            console.log(datarecharge.utr);
                            console.log(datarecharge.report_id);
                          console.log(datarecharge.message);
                            console.log('---DTH  result 3---');
                   
               
                             if(datarecharge.status_id.toString()=="1")
                              {
                                console.log('Update DTH Recharge Trasaction----1');
                                console.log(result["recordset"][0].userid);
                                console.log(result["recordset"][0].uniqueid);
                                console.log(datarecharge.utr);
                                console.log(datarecharge.message);
                        
                                console.log('Update DTH Recharge Trasaction----2');
                                const returnrecharge = await update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'success',datarecharge.utr,datarecharge.message,'direct')
                                console.log('Update DTH Recharge Trasaction----3');
                                console.log(returnrecharge[0].transactionsID);    
                                console.log(returnrecharge[0].serviceprovider);  
                                console.log(returnrecharge[0].paidtype);  
                                console.log(returnrecharge[0].mobilenumber);  
                                console.log(returnrecharge[0].amount);  
                                console.log(returnrecharge[0].Message);  
                                console.log('Update DTH Recharge Trasaction----4');
                                        
                                      res.json({
                                          status:"success",
                                          paytype:'direct_payment',    
                                          redirect:'success',
                                          
                                          transactionsID:returnrecharge[0].transactionsID,
                                          serviceprovider:returnrecharge[0].serviceprovider,
                                          paidtype:returnrecharge[0].paidtype,
                                          mobilenumber:returnrecharge[0].mobilenumber,
                                          amount:returnrecharge[0].amount,
                                          msg:returnrecharge[0].Message,      
                                                                    
                                    });
                            
                              }
                              else
                              {
                                    console.log('Update DTH Recharge Trasaction----6');
                                    update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'failure',datarecharge.utr,datarecharge.message,'direct')
                                    console.log('Update DTH Recharge Trasaction----7');
                                



                                        res.json({
                                            status:"failure",
                                            paytype:'direct_payment',    
                                            redirect:'success',
                                            
                                            transactionsID:'',
                                            serviceprovider:'',
                                            paidtype:"",
                                            mobilenumber:"",
                                            amount:"",
                                            msg:datarecharge.message,      
                                                                      
                                      });

                              }

                      }
                      else
                        {





                         console.log('Update DTH Recharge Trasaction----6');
                         update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'failure',"","Minimum Recharge 10",'direct')
                         console.log('Update DTH Recharge Trasaction----7');
                     



                            res.json({
                                status:"failure",
                                paytype:'direct_payment',    
                                redirect:'success',
                                
                                transactionsID:"",
                                serviceprovider:"",
                                paidtype:"",
                                mobilenumber:"",
                                amount:"",
                                msg:"Minimum Recharge 10",      
                                                          
                          });




                      }

                    }
                    else{
                             

                              
                            res.json({
                                status:"failure",
                                paytype:'direct_payment',    
                               redirect:'success',
                                
                                transactionsID:"",
                               serviceprovider:"",
                               paidtype:"",
                                mobilenumber:"",
                                amount:"",
                                msg:"Insufficient Balance",      
                                                          
                          });

                      }

                     //end





                 }
               

              }
              else
                {

						console.log('DEPOSIT--01');				
                          const conn= await sql.connect(config);
                          const result =await conn.request()
                          .input("Tranid", req.params.id)
                          .input("status", status.status)
                          .input("amount", status.transaction_amount)
                        

                          .execute("USP_UpdateSuccessTransaction");
                          const data = result["recordset"];
                           console.log(' Response:', data);
                          
                            console.log(result["recordset"][0].paytype);


                          res.json({
                                      status:"success",
                                      paytype:'deposit',    
                                      redirect:'success',
                                      amount:status.transaction_amount,
                                      mobilenumber:'',
                                      serviceprovider:'',
                                      transactionsID:'',
                                      msg:"success",      
                                                                
                                });


                   }

                


      } 
        else
          
          {
      
            console.log('---failure or cancel payment---')
       
       
            



           //#region cancel entry tn database
              console.log(req.params.id);
              console.log(status.status);
              console.log(status.error_Message);


            const conn= await sql.connect(config);
            const result =await conn.request()



            
            .input("Tranid", req.params.id)
            .input("status", status.status)
            .input("message", status.error_Message)
           

            .execute("USP_Updatecancel");
             const data = result["recordset"];
                console.log(' Response:', data);
              console.log(data.paytype);
              console.log(result["recordset"][0].paytype);

              
                          res.json({
                                      status:"failure",
                                      paytype:'deposit',    
                                      redirect:'failed',
                                      amount:status.transaction_amount,
                                      mobilenumber:'',
                                      serviceprovider:'',
                                      transactionsID:'',
                                      msg:"failure",      
                                                                
                                });
             //#endregion cancel payment
            
             



      

    }
  } catch (error) {
     console.log('---44---')
    console.error("Error verifying payment:", error);
    res.status(500).send(error);
  }



});


async function addmoney_transaction(userid,txnid,amount,productinfo,email,mobileno,name){

    try{
         console.log('---ADD Money INICIATE---')
      console.log('---22---')
      console.log(userid);
      console.log(txnid);
      console.log(amount);
      console.log(productinfo);
      console.log(email);
      console.log(mobileno);
      console.log(name);

            const conn= await sql.connect(config);
            const res =await conn.request()



            .input("userid", userid)
            .input("txnid", txnid)
            .input("amount", amount)
            .input("productinfo", productinfo)
            .input("email", email)
            .input("mobileno",mobileno)
            .input("name", name)
            // .input("status", '-')
            // .input("hashid", '--')

            .execute("usp_addmoneyTransaction");
            const data = res.recordset;
            //  console.log('sp Response:', data);


               console.log('---ADD Money INICIATE- END--')
            return data;

    }catch(error){
        console.log(error);
    }

}



async function cancel_transaction(txnid,status,message){

    try{
        
      console.log('---22---')
      console.log(txnid);
      console.log(status);
      console.log(message);


            const conn= await sql.connect(config);
            const res =await conn.request()



            
            .input("Tranid", txnid)
            .input("status", status)
            .input("message", message)
           

            .execute("USP_Updatecancel");
            // const data = res.recordset;
            // //  console.log('sp Response:', data);
            // return data;

                 const data = res["recordset"];
              console.log('API Billpay Response:', data);
              return data;


            

    }catch(error){
        console.log(error);
    }

}

async function success_transaction(txnid,status,amount){

    try{
        
      console.log('---22---')
      console.log(txnid);
      console.log(status);
      console.log(amount);


            const conn= await sql.connect(config);
            const res =await conn.request()



            
            .input("Tranid", txnid)
            .input("status", status)
            .input("amount", amount)
           

            .execute("USP_UpdateSuccessTransaction");
            const data = res.recordset;
            //  console.log('sp Response:', data);
            return data;

    }catch(error){
        console.log(error);
    }

}
// async function addmoney_transaction(txnid,status){



// }


// PayU configuration
// const PAYU_CONFIG = {
//   merchantKey: 'efmBlaOa',
//   merchantSalt: 'AtBlCnu6gz',
//   testUrl: 'https://test.payu.in/_payment',
//   productionUrl: 'https://secure.payu.in/_payment',
//   successUrl: 'http://moniespay.com/success',
//   failureUrl: 'http://moniespay.com/failure'
// };

// // Generate hash for PayU
// function generateHash(paymentParams) {
//   const hashString = 
//     `${paymentParams.key}|${paymentParams.txnid}|${paymentParams.amount}|` +
//     `${paymentParams.productinfo}|${paymentParams.firstname}|${paymentParams.email}|` +
//     `|||||||||||${PAYU_CONFIG.merchantSalt}`;
    
//   return crypto.createHash('sha512').update(hashString).digest('hex');
// }

// // Initiate payment
// router.post('/initiate-payment', async (req, res) => {
//   try {
//     const { amount, productInfo, firstName, email, phone } = req.body;
    
//     // Generate transaction ID
//     const txnid =  Date.now();
    
//     const paymentParams = {
//       key: PAYU_CONFIG.merchantKey,
//       txnid,
//       amount,
//       productinfo: productInfo,
//       firstname: firstName,
//       email,
//       phone,
//       surl: PAYU_CONFIG.successUrl,
//       furl: PAYU_CONFIG.failureUrl,
//       service_provider: ''
//     };
    
//     // Generate hash
//     paymentParams.hash = generateHash(paymentParams);
   
//     console.log(txnid);
//     console.log(amount);
//     console.log(productInfo);
//     console.log(firstName);
//     console.log(email);
//     console.log(phone);
//     console.log(PAYU_CONFIG.successUrl);
//     console.log(PAYU_CONFIG.failureUrl);
//     console.log(paymentParams.hash);

//     // Save transaction to database
//     const pool = await sql.connect(config);
//     await pool.request()
//       .input('txnid', sql.VarChar, txnid)
//       .input('amount', sql.Decimal, amount)
//       .input('productinfo', sql.VarChar, productInfo)
//       .input('email', sql.VarChar, email)
//       .input('status', sql.VarChar, 'INITIATED')
//       .query(`
//         INSERT INTO Transactions (txnid, amount, productinfo, email, status, created_at)
//         VALUES (@txnid, @amount, @productinfo, @email, @status, GETDATE())
//       `);
    
//     res.json({
//       paymentUrl: PAYU_CONFIG.productionUrl, // Use productionUrl for live
//       paymentParams
//     });
    
//   } catch (error) {
//     console.error('Payment initiation error:', error);
//     res.status(500).json({ error: 'Payment initiation failed' });
//   }
// });

// // Payment response handler

// router.post("/payment-response", async (req, res) => {
//   try {
//     console.log('xxx11');
//     const { txnid, status, hash, amount } = req.body;
//         console.log('xxx12');
//     // Verify hash
//     const expectedHash = crypto.createHash('sha512')
//       .update(`${PAYU_CONFIG.merchantSalt}|${status}|||||||||||${email}|${firstName}|${productInfo}|${amount}|${txnid}|${PAYU_CONFIG.merchantKey}`)
//       .digest('hex');
      
//     if (hash !== expectedHash) {
//       return res.status(400).send('Invalid hash');
//     }
    
//     // Update transaction in database
//     const pool = await sql.connect(config);
//     await pool.request()
//       .input('txnid', sql.VarChar, txnid)
//       .input('status', sql.VarChar, status)
//       .query(`
//         UPDATE Transactions 
//         SET status = @status, updated_at = GETDATE()
//         WHERE txnid = @txnid
//       `);
    
//     // Redirect or respond based on status
//     if (status === 'success') {
//       res.redirect('/payment-success');
//     } else {
//       res.redirect('/payment-failure');
//     }
    
//   } catch (error) {
//     console.error('Payment response error:', error);
//     res.status(500).send('Payment processing failed');
//   }
// });













// Axios POST request
async function fetchDatatoken() {
  try {
    const response = await axios.post('https://erp.pay2all.in/api/token', form, {
      headers: form.getHeaders(),
    });
console.log('Data received:---2');

    const data = response.data;
    console.log('Data received:', data);
    return data;
  } catch (error) {
    console.error('Error fetching data:', error.message);
    return null;
  }
}

router.post("/generatetokenbypay2all", async  function(request, res){


    try
    {               

        console.log('***********');

var axios = require('axios');
var FormData = require('form-data');
var data = new FormData();
data.append('email', 'laxmikanta.28@gmail.com');
data.append('password', 'Pintu#84');

var configc = {
  method: 'post',
  url: 'https://erp.pay2all.in/api/token',
  headers: { 
    'Accept': 'application/json', 
    ...data.getHeaders()
  },
  data : data
};

axios(configc)
.then(function (response) {
  console.log(JSON.stringify(response.data));
     res.json({
                   
      status:"success",
      msg:'Valid',
     token:response.data.token,
                   
 });
 sessiontoken=response.data.token;

})
.catch(function (error) {
  console.log(error);
});


 


    } catch(error){

    }
  
    
});


//Mobile recharge & DTH Recharge
router.post("/mobilerecharge", async  function(request, response){

    const status=""; 
     const message=""; 

    try
    {               

   

     console.log('req----');
    const token1 = request.header('Authorization');
     console.log(token1);
    const decoded = jwt.verify(token1, 'msecret-keys@9128');
    console.log('----lll----');
     console.log(decoded);
     console.log(decoded.USERID);
     if (decoded.USERID != null) 
      {

           const data1 = await  insert_transaction(request.body.userid,request.body.accountno,request.body.provideid,request.body.uniqueid,request.body.serviceprovidername,request.body.mobileno,request.body.amount,request.body.paidtype,request.body.category,request.body.ip);
     
         console.log(data1[0].MSG);
         console.log(data1[0].Balance);
         console.log('Start----1');
         if(data1[0].MSG.toString() == "TRUE")
         {
             console.log('Start----2');
              if(parseFloat(data1[0].Balance) >= parseFloat(request.body.amount))
              {
                  console.log('Start----3');
                   const datarecharge = await funcmobilerecharge(request.body.accountno,request.body.provideid,request.body.amount,request.body.uniqueid,request.body.mobileno,request.body.token); 
   

                    console.log(datarecharge.status_id);
                    console.log(datarecharge.balance);
                    console.log(datarecharge.order_id);
                    console.log(datarecharge.utr);
                    console.log(datarecharge.report_id);
                   console.log(datarecharge.message);
                   
               
                  if(datarecharge.status_id.toString()=="1")
                  {
                    console.log('Update Mobile Recharge Trasaction----1');
                    console.log(request.body.userid);
                    console.log(request.body.uniqueid);
                    console.log(datarecharge.utr);
                    console.log(datarecharge.message);
             
                     console.log('Update Mobile Recharge Trasaction----2');
                     const returnrecharge = await update_transaction(request.body.userid,request.body.uniqueid,'success',datarecharge.utr,datarecharge.message,'wallet')
                     console.log('Update Mobile Recharge Trasaction----3');
                     console.log(returnrecharge[0].transactionsID);    
                    console.log(returnrecharge[0].serviceprovider);  
                    console.log(returnrecharge[0].paidtype);  
                    console.log(returnrecharge[0].mobilenumber);  
                    console.log(returnrecharge[0].amount);  
                    console.log(returnrecharge[0].Message);  
                     console.log('Update Mobile Recharge Trasaction----4');
                   
                       response.json({
                         status:"success",
                         transactionsID:returnrecharge[0].transactionsID,
                         serviceprovider:returnrecharge[0].serviceprovider,
                         paidtype:returnrecharge[0].paidtype,
                         mobilenumber:returnrecharge[0].mobilenumber,
                         amount:returnrecharge[0].amount,
                         msg:returnrecharge[0].Message,             
                       });
                    console.log('Update Mobile Recharge Trasaction----5');
                  }
                  else
                  {
                       console.log('Update Mobile Recharge Trasaction----6');
                       update_transaction(request.body.userid,request.body.uniqueid,'failure',datarecharge.utr,datarecharge.message,'wallet')
                         console.log('Update Mobile Recharge Trasaction----7');
                        response.json({
                         status:"failure",
                          msg:datarecharge.message,             
                       });

                  }

                     



              }
              else
              {
                       response.json({
                         status:"failure",
                          msg:'Insufficent balance',
                          
                       });
              }
         }
      
    }
   
       
    } catch(error){

    }
  
    
});



async function insert_transaction(userid,accountno,provideid,myuniqueid,serviceprovidername,mobileno,amount,paidtype,category,ip){

    try{
        
            const conn= await sql.connect(config);
            const res =await conn.request()
            .input("userid", userid)
            .input("accountno", accountno)
            .input("provideid", provideid)
            .input("tranid", myuniqueid)
            .input("serviceprovidername", serviceprovidername)
            .input("mobileno",mobileno)
            .input("amount", amount)
            .input("paidtype", paidtype)
             .input("category", category)
            .input("ip", ip)
            .execute("usp_insertTransaction");
            const data = res.recordset;
            //  console.log('sp Response:', data);
            return data;

    }catch(error){
        console.log(error);
    }

}


async function update_transaction(userid,myuniqueid,status,Utr,msg,typeofpayment){

    try{
        
            const conn= await sql.connect(config);
            const res =await conn.request()
            .input("userid", userid)
            .input("myuniqueid", myuniqueid)
            .input("status", status)
            .input("utr", Utr)
            .input("message", msg)
             .input("typeofpayment", typeofpayment)
            .execute("USP_UpdateTransaction");
      
              const data = res.recordset;
             console.log('SP Response:', data);
   
    
           
            return data;

    }catch(error){
        console.log(error);
    }

}



async function funcmobilerecharge(accountno,provideid,amount,uniqueid,mobileno,token) {

   console.log('xxxxx222'); 
   console.log(accountno); 
      console.log(provideid); 
         console.log(amount); 
   console.log(uniqueid); 
            console.log(mobileno); 
            console.log(token); 
   console.log('xxxxx333 end'); 


const form = new FormData();
form.append('number', accountno);
form.append('provider_id', provideid);
form.append('amount', amount);
form.append('client_id', uniqueid);
form.append('optional1', mobileno);
form.append('api_id', '27');
form.append('optional2', '');
form.append('optional3', '');
form.append('optional4', '');
form.append('reference_id', '');

 const response = await axios.post('https://erp.pay2all.in/api/v1/payment/recharge', form, {
  headers: {
        ...form.getHeaders(),
        'Authorization': `Bearer ${token}`,
    }

    });

    const data = response.data;
    console.log('API Response:', data);
   
    return data;

}





router.post("/billfetch", async  function(request, response){


    try
    {               

    console.log('req bill fetch');
    console.log(request.body.billerid);
    console.log(request.body.uniqueid);
    console.log(request.body.paraname);
    console.log(request.body.accountno);
    console.log(request.body.token);
    console.log('req bill fetch-2');
    const databillfetch = await funcbillfetch(request.body.billerid,request.body.uniqueid,request.body.paraname,request.body.accountno,request.body.token);
        // if (data1) {

        //          console.log('Response');
        //           response.json({
                   
        //             status:"success",
        //             msg:'Valid',
        //             message:data1,
                   
        //         });


        // // await insertIntoDb(data);
        // }
              
      console.log(databillfetch.status_id);
      console.log(databillfetch.billNumber);
      console.log(databillfetch.amount);
      console.log(databillfetch.name);
      console.log(databillfetch.dueDate);
      console.log(databillfetch.billdate);
      console.log(databillfetch.reference_id);
      console.log(databillfetch.message);  

      if(databillfetch.message =="Success")
      {
        const datainsertbillfetch = await  insert_transaction_billfetch(request.body.userid,request.body.accountno,request.body.billerid,request.body.uniqueid,request.body.serviceprovidername,request.body.mobileno,databillfetch.amount,request.body.paidtype,request.body.category,request.body.paraname,request.body.token,databillfetch.billNumber,databillfetch.name,databillfetch.dueDate,databillfetch.billdate,databillfetch.reference_id,request.body.ip,databillfetch.message);
     
         console.log('yyyyyyyyyyyyyyyyyyyyyy');  
        console.log(datainsertbillfetch.Message); 

         response.json({
                         status:"success",
                         msg:datainsertbillfetch.Message,      
                         transactionsID:datainsertbillfetch.transactionsID,
                         serviceprovider:datainsertbillfetch.serviceprovider,
                         paidtype:datainsertbillfetch.paidtype,
                         mobilenumber:datainsertbillfetch.mobilenumber,
                         amount:datainsertbillfetch.amount,
                         accountno:datainsertbillfetch.accountno,
                          referenceId:datainsertbillfetch.referenceId,  
                          billerid:datainsertbillfetch.billerid, 
                          Paraname:datainsertbillfetch.Paraname, 
                          token:datainsertbillfetch.token, 
                          customername:datainsertbillfetch.customername,
                          BillDate:datainsertbillfetch.billdate, 
                          DueDate:datainsertbillfetch.dueDate,   
                       });


      }
      else{
                  const datainsertbillfetch = await  insert_transaction_billfetch(request.body.userid,request.body.accountno,request.body.provideid,request.body.uniqueid,request.body.serviceprovidername,request.body.mobileno,databillfetch.amount,request.body.paidtype,request.body.category,request.body.name,request.body.token,databillfetch.billNumber,databillfetch.name,databillfetch.dueDate,databillfetch.billdate,databillfetch.reference_id,request.body.ip,databillfetch.message);
                    console.log('xxxxxxxxxxxxxxxxx');  
                  
                  response.json({
                         status:"failure",
                         msg:datainsertbillfetch.Message,      
                         transactionsID:datainsertbillfetch.transactionsID,
                        token:datainsertbillfetch.token, 
                       });

      }



    } catch(error){

    }
    
});

async function funcbillfetch(billerid,uniqueid,name,accountno,token) {
  
var requestBody = JSON.stringify({"billerId":billerid,"client_id":uniqueid,"customerParams":[{"name":name,"value":accountno}]});

const response = await axios.post('https://erp.pay2all.in/api/bbps/fetch', requestBody, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const data = response.data;
    console.log('API Response:', data);
    return data;


}
async function insert_transaction_billfetch(userid,accountno,provideid,myuniqueid,serviceprovidername,mobileno,amount,paidtype,category,paraname,token,billNumber,customername,dueDate,billdate,reference_id,ip, message){

    try{
        
            const conn= await sql.connect(config);
            const res =await conn.request()
            .input("userid", userid)
             .input("amount", amount)
             .input("paidtype", paidtype)
            .input("accountno", accountno)
            .input("provideid", provideid)
            .input("tranid", myuniqueid.toString())
            .input("serviceprovidername", serviceprovidername)
            .input("mobileno",mobileno)
            .input("category", category)
            .input("paraname", paraname)
            .input("token", token)
            .input("billNumber", billNumber)
            .input("customername", customername)
            .input("dueDate", dueDate)
            .input("billdate", billdate)
            .input("reference_id", reference_id)
            .input("ip", ip)
            .input("Remarks",message)
            
            .execute("usp_insertTransaction_billfetch");
            const data = res.recordset[0];
             console.log('sp Responsett:', data);
            return data;

    }catch(error){
        console.log(error);
    }

}



//CREDIT CARD START 

// router.post("/initiate-payment-creditcard", async  function(req, res){
// //app.post("/initiate-payment", async (req, res) => {
//   try {
    

// 	 console.log('Credit Card Online Payment Line 1');
//     const {userid, txnid, amount, productinfo, firstname, email, phone} = req.body;
   
   
//     console.log('Credit Card Online Payment Line 2');
//     console.log(req.body.userid);
//     console.log(req.body.txnid);
//     console.log(req.body.amount);
//     console.log(req.body.productinfo);
//     console.log(req.body.firstname);
//     console.log(req.body.email);
//     console.log(req.body.phone);



//     console.log(req.body.sessionuserid);
//     console.log(req.body.accountno);
//     console.log(req.body.amount);
//     console.log(req.body.paidtype);
//     console.log(req.body.provideid);
//     console.log(req.body.serviceprovidername);
//     console.log(req.body.uniqueid);
      
//      console.log('Credit Card Online Payment Line 3');
   
//     console.log(req.body.mobileno);
//     console.log(req.body.token);
//     console.log(req.body.category);
//     console.log(req.body.ip);



//    // insert_transaction_directpayment(req.body.sessionuserid,req.body.accountno,req.body.provideid,req.body.uniqueid,req.body.serviceprovidername,req.body.mobileno,req.body.amount,req.body.paidtype,req.body.category,req.body.ip,req.body.txnid,req.body.token);
   

//     let data = {
//       isAmountFilledByCustomer: false,
//       txnid,
//       amount,
//       currency: "INR",
//       productinfo,
//       firstname,
//       email,
//       phone,
//       surl: `https://www.moniespay.com/verifypayucreditcard/${txnid}`,
//       furl: `https://www.moniespay.com/verifypayucreditcard/${txnid}`,
//     };


//       console.log('Credit Card Online Payment Line 4');
//     const hashString = `${process.env.MERCHANT_KEY}|${data.txnid}|${data.amount}|${data.productinfo}|${data.firstname}|${data.email}|||||||||||${process.env.MERCHANT_SALT}`;
//     const hash = crypto.createHash("sha512").update(hashString).digest("hex");
//     data.hash = hash;
//     console.log(hash)

   
   
    
// 		 console.log('Credit Card Online Payment Line 5');
// 		  console.log(userid);
// 		 console.log(req.body.uniqueid);
// 		  console.log('Credit Card Online Payment Line 6');
// 		updateaddmoney_transaction(userid,txnid,amount,productinfo,req.body.email,req.body.phone,req.body.firstname,req.body.uniqueid);
    
    

     
    

//     let response = await payuClient.paymentInitiate(data);
//     console.log(response);
//       res.json(response);
//     //res.send(response);
//   } catch (error) {
//     console.error("Error initiating payment:", error);
//     res.status(500).send(error);
//   }
// });

//  router.get("/verifycredit/:id", async  function(req, res)
//  {
//     try{

//        console.log('---Verify Credit Card Transaction--Line-1');
//        console.log(req.params.id)
//        const data = await payuClient.verifyPayment(req.params.id);
//        const status = data.transaction_details[req.params.id];
//        console.log(status);
//        console.log(status.status);
//        console.log(status.transaction_amount);
    
// 	     console.log(status.error_Message);
//        console.log('---Verify Credit Card Transaction--Line-2');

//        if (status.status === "success") {
//             console.log('---Verify Credit Card Transaction--Line-3');
//             const conn= await sql.connect(config);
//             const result =await conn.request()
//            .input("Tranid", req.params.id)
//            .execute("USP_getPaymode");
//             const data = result["recordset"];
//             console.log(' Response:', data);
//             console.log(data.paytype);
//             console.log(result["recordset"][0].paytype);
//             console.log('---category---');
//             console.log(result["recordset"][0].Name);
//             console.log('---Verify Credit Card Transaction--Line-4');
//             console.log(result["recordset"][0].token);
		        
//             const getpay2all_balance = await getpay2allprofile(result["recordset"][0].token);
// 			      console.log('---Verify Credit Card Transaction--Line-6');
// 			      console.log(getpay2all_balance.data.balance.user_balance);			
// 			      console.log('---Verify Credit Card Transaction--Line-7');
// 		        console.log(result["recordset"][0].category);
// 			      console.log('---Verify Credit Card Transaction--Line-8');
            
//             if(result["recordset"][0].category=="Credit Card"){

//                const getdatabalance= await getbalance(result["recordset"][0].userid);
//                console.log(getdatabalance.MSG);
//                console.log(getdatabalance.Balance);
//                console.log(getpay2all_balance.data.balance.user_balance);
//                console.log(parseFloat(getpay2all_balance.data.balance.user_balance));
//                console.log(parseFloat(result["recordset"][0].amount));
//                console.log('---Verify Credit Card Transaction--Line-10');

//                if(parseFloat(getpay2all_balance.data.balance.user_balance) >= parseFloat(result["recordset"][0].amount)){
//                 console.log(result["recordset"][0].accountno);
//                 console.log(result["recordset"][0].provideid);
//                 console.log(result["recordset"][0].amount);
//                 console.log(result["recordset"][0].uniqueid);
//                 console.log(result["recordset"][0].mobileno);
//                 console.log(result["recordset"][0].token);
//                 console.log(result["recordset"][0].parameter1);
//                 console.log(result["recordset"][0].parameter2);
//                 console.log(result["recordset"][0].parameter3);
//                 console.log('---Verify Credit Card Transaction--Line-11');

//                 if(result["recordset"][0].amount >=10){
//                   console.log('---Verify Credit Card Transaction--Line-12');
//                   const datarecharge = await funcbillfetchpay_creditcard_Online(result["recordset"][0].accountno,result["recordset"][0].ReferenceID,result["recordset"][0].amount,result["recordset"][0].provideid,result["recordset"][0].uniqueid,result["recordset"][0].Name,result["recordset"][0].mobileno,result["recordset"][0].token,result["recordset"][0].parameter1,result["recordset"][0].parameter2);
//                   console.log('---Verify Credit Card Transaction--Line-13');
//                   console.log(datarecharge.status_id);
//                   console.log(datarecharge.balance);
//                   console.log(datarecharge.order_id);
//                   console.log(datarecharge.utr);
//                   console.log(datarecharge.report_id);
//                   console.log(datarecharge.message);
//                   console.log('---Verify Credit Card Transaction--Line-14'); 
                  
//                   if(datarecharge.status_id.toString()=="1"){
//                     console.log('---Verify Credit Card Transaction--Line-15');
//                     console.log(result["recordset"][0].userid);
//                     console.log(result["recordset"][0].uniqueid);
//                     console.log(datarecharge.utr);
//                     console.log(datarecharge.message);
//                     console.log('---Verify Credit Card Transaction--Line-16');
//                     const returnrecharge = await update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'success',datarecharge.utr,datarecharge.message,'direct')
//                     console.log('---Verify Credit Card Transaction--Line-17');
//                     console.log(returnrecharge[0].transactionsID);    
//                     console.log(returnrecharge[0].serviceprovider);  
//                     console.log(returnrecharge[0].paidtype);  
//                     console.log(returnrecharge[0].mobilenumber);  
//                     console.log(returnrecharge[0].amount);  
//                     console.log(returnrecharge[0].Message);  
// 					console.log(returnrecharge[0].rechargemobileno);   
//                     console.log('---Verify Credit Card Transaction--Line-18');

//                     res.json({
//                       status:"success",
//                       paytype:'direct_payment',    
//                       redirect:'success',
//                       transactionsID:returnrecharge[0].transactionsID,
//                       serviceprovider:returnrecharge[0].serviceprovider,
//                       paidtype:returnrecharge[0].paidtype,
//                       mobilenumber:returnrecharge[0].mobilenumber,
//                       amount:returnrecharge[0].amount,
//                       msg:datarecharge.message, 
// 					  rechargemobileno:returnrecharge[0].rechargemobileno,					  
//                     });  

//                   }
//                   else if(datarecharge.status_id.toString()=="3"){

//                     console.log('---Verify Credit Card Transaction--Line-19');
//                     console.log(result["recordset"][0].userid);
// 					console.log(result["recordset"][0].uniqueid);
// 					console.log(datarecharge.utr);
// 					console.log(datarecharge.message);
// 					console.log('---Verify Credit Card Transaction--Line-20');
// 					const returnrecharge = await update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'success',datarecharge.utr,datarecharge.message,'direct')
// 					console.log('---Verify Credit Card Transaction--Line-21');
// 					console.log(returnrecharge[0].transactionsID);    
// 					console.log(returnrecharge[0].serviceprovider);  
// 					console.log(returnrecharge[0].paidtype);  
// 					console.log(returnrecharge[0].mobilenumber);  
// 					console.log(returnrecharge[0].amount);  
// 					console.log(returnrecharge[0].Message);  
// 					console.log(returnrecharge[0].rechargemobileno);   
// 					console.log('---Verify Credit Card Transaction--Line-22');

//                     res.json({
//                       status:"Pending",
//                       paytype:'direct_payment',    
//                       redirect:'success',
					 
					 
//                       transactionsID:returnrecharge[0].transactionsID,
//                       serviceprovider:returnrecharge[0].serviceprovider,
//                       paidtype:returnrecharge[0].paidtype,
//                       mobilenumber:returnrecharge[0].mobilenumber,
//                       amount:returnrecharge[0].amount,
//                       msg:datarecharge.message, 
// 					  rechargemobileno:returnrecharge[0].rechargemobileno,
					  

//                     });

//                   }
//                   else{

//                     console.log('---Verify Credit Card Transaction--Line-23');
//                     update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'failure',datarecharge.utr,datarecharge.message,'direct');
//                     console.log('---Verify Credit Card Transaction--Line-24');

//                     res.json({
//                       status:"failure",
//                       paytype:'direct_payment',    
//                       redirect:'success',
//                       transactionsID:'',
//                       serviceprovider:'',
//                       paidtype:"",
//                       mobilenumber:"",
//                       amount:"",
//                       message:datarecharge.message,    
//                     });

//                   } 

//                 }
//                 else{
                   
//                    console.log('---Verify Credit Card Transaction--Line-25');
//                    update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'failure',"","Minimum Recharge 10",'direct')
//                    console.log('---Verify Credit Card Transaction--Line-26');

//                    res.json({
//                     status:"failure",
//                                     paytype:'direct_payment',    
//                                     redirect:'success',
//                                     transactionsID:"",
//                                     serviceprovider:"",
//                                     paidtype:"",
//                                     mobilenumber:"",
//                                     amount:"",
//                                     msg:"Minimum Recharge 10",      
//                    });


//                 }
                

//                }

//             }
//        }


//     }
//     catch(ex){

//     }
//  });

// async function funcbillfetchpay_creditcard_Online(accountno,referenceid,amount,billerid,uniqueid,name,mobileno,token, paraname1, paraname2){
  
//     console.log('function Payment credit card line--1'); 
//     console.log(accountno); 
//     console.log(referenceid);
//     console.log(amount);
//     console.log(billerid); 
//     console.log(uniqueid); 
//     console.log(name);
//     console.log(mobileno); 
//     console.log(token); 
//     console.log(paraname1); 
//     console.log(paraname2); 
//     console.log('function Payment credit card line--2'); 


// 	var requestBody = JSON.stringify({"reference_id":referenceid,"amount":amount,"billerId":billerid,"mobile_number":mobileno,"client_id":uniqueid,"customerParams":[{"name":paraname1,"value":accountno},{"name":paraname2,"value":mobileno}]});
	
//   const response = await axios.post('https://erp.pay2all.in/api/bbps/payment', requestBody, {
// 		  headers: {
// 			'Content-Type': 'application/json',
// 		  'Authorization': `Bearer ${token}`
// 		}
// 	 });


// 	// let jsonData = 
// 	//  {
// 	 //    "status_id": "2",
// 	 //    "balance": "100",
// 	 //    "order_id": "5988775",
// 	//	"utr": "",
// 	// 	"report_id": "",
// 	//   "message": "failure",
// 	//   }
// 	// ;
// 	// const data = jsonData;
	
//     const data = response.data;
	
//     console.log('API Response:', data);
//     return data;


// }
// router.post("/billfetch_creditcard_payment_wallet", async  function(request, response){


//     try
//     {               

//        console.log('Credit Card Payment wallet line 1');

//       const getdatabalance= await getbalance(request.body.userid);
//       console.log(getdatabalance.MSG);
//       console.log(getdatabalance.Balance);
//        console.log('Credit Card Payment wallet line 2');
//      //if(parseFloat(getdatabalance.Balance) >= parseFloat(request.body.amount))
//      // {
		  
// 		const updateprice =  await update_custom_payment_wallet(request.body.userid,request.body.uniqueid,request.body.amount);
			 
// 			   console.log(updateprice.MSG);
			   
// 		   console.log('Credit Card Payment wallet line 3-----');
// 		   console.log(request.body.accountno);
// 		   console.log(request.body.referenceid);
// 		   console.log(request.body.amount);
// 			 console.log(request.body.billerid);
// 			 console.log(request.body.uniqueid);
// 			 console.log(request.body.name);
// 			 console.log(request.body.mobileno);
// 			 console.log(request.body.token);
// 			 console.log(request.body.Paraname1);
// 			 console.log(request.body.Paraname2);
// 			 console.log('Credit Card Payment wallet line 4');
    
//        const datapayreturn = await funcbillfetchpay_creditcard_wallet(request.body.accountno,request.body.referenceid,request.body.amount,request.body.billerid,request.body.uniqueid,request.body.name,request.body.mobileno,request.body.token,request.body.Paraname1,request.body.Paraname2);
    
// 		    console.log(datapayreturn.status_id);
//         console.log(datapayreturn.utr);
//         console.log(datapayreturn.message);
//         console.log(request.body.uniqueid);
//         console.log('Credit Card Payment wallet line 5');
		
// 		console.log(datapayreturn.status_id.toString());
     
//       if(datapayreturn.status_id.toString() =="1")
//       {
// 		  console.log('Credit Card Payment wallet line 6');
//           const returnrecharge = await update_transaction(request.body.userid,request.body.uniqueid,'success',datapayreturn.utr,datapayreturn.message,'wallet')
//           console.log('Credit Card Payment wallet line 7');
         
//           response.json({
//               status:"success",
//               transactionsID:returnrecharge[0].transactionsID,
//               serviceprovider:returnrecharge[0].serviceprovider,
//               paidtype:returnrecharge[0].paidtype,
//               mobilenumber:returnrecharge[0].mobilenumber,
//               accountno:returnrecharge[0].accountno,
//               amount:returnrecharge[0].amount,
//               message:returnrecharge[0].Message, 
//               rechargemobileno:returnrecharge[0].rechargemobileno,				            
//            });

//       }
// 	    else if(datapayreturn.status_id.toString() =="3")
//       {
// 		  console.log('Credit Card Payment wallet line 8');
//           const returnrecharge = await update_transaction(request.body.userid,request.body.uniqueid,'success',datapayreturn.utr,datapayreturn.message,'wallet')
//           console.log('Credit Card Payment wallet line 9');          
//           response.json({
//               status:"Pending",
//               transactionsID:returnrecharge[0].transactionsID,
//               serviceprovider:returnrecharge[0].serviceprovider,
//               paidtype:returnrecharge[0].paidtype,
//               mobilenumber:returnrecharge[0].mobilenumber,
//               accountno:returnrecharge[0].accountno,
//               amount:returnrecharge[0].amount,
//               message:'Transaction is in Queue',
//               rechargemobileno:returnrecharge[0].rechargemobileno,             
//            });
//       }
//       else{
// 		  console.log('Credit Card Payment wallet line 10');
// 		   console.log(request.body.userid);
// 		   console.log(request.body.uniqueid);
// 		   // console.log(datarecharge.utr);
// 		 //console.log(datarecharge.message);
// 		   console.log('Credit Card Payment wallet line 11');
//            update_transaction(request.body.userid,request.body.uniqueid,'failure',"","",'wallet')
//            console.log('Credit Card wallet line 12');
           
//            response.json({
//               status:"failure",
//                transactionsID:'',
//                 serviceprovider:'',
//                 paidtype:"",
//                 mobilenumber:"",
//                 amount:"",
//                 message:"failure",             
//             });

//       }

      
//    // }
//    // else{
//    //     response.json({
//    //                      status:"failure",
//    //                       msg:"Insufficient Balance",                  
//    //                    });

//    // }

//     } catch(error){





//     }
  
    
// });
// async function update_custom_payment_wallet(userid,transactionid,amount){

//     try{
// 			console.log('Credit Card update custom price update line 1');
//             const conn= await sql.connect(config);
//             const res =await conn.request()
//             .input("userid", userid)
// 			.input("transactionid", transactionid)
// 			.input("amount", amount)
//             .execute("USP_Update_Custum_Amount_Walletpay");
//             const data = res.recordset[0];
//              console.log('sp update:', data);
// 			 console.log('Credit Card update custom price update line 2');
//             return data;

//     }catch(error){
//         console.log(error);
//     }

// }
// async function funcbillfetchpay_creditcard_wallet(accountno,referenceid,amount,billerid,uniqueid,name,mobileno,token, paraname1, paraname2) {
  
  
//      console.log('Credit Card wallet pay line 1');
//       console.log(accountno);
//       console.log(referenceid);
//       console.log(amount);
// 	    console.log(billerid);
// 	    console.log(uniqueid);
// 	    console.log(name);
// 	    console.log(mobileno);
// 		  console.log(token);
// 		  console.log(paraname1);
// 		  console.log(paraname2);
// 		  console.log('Credit Card wallet pay line 2');
			
// 			var requestBody = JSON.stringify({"reference_id":referenceid,"amount":amount,"billerId":billerid,"mobile_number":mobileno,"client_id":uniqueid,"customerParams":[{"name":paraname1,"value":accountno},{"name":paraname2,"value":mobileno}]});
// 			const response = await axios.post('https://erp.pay2all.in/api/bbps/payment', requestBody, {
// 				  headers: {
// 					'Content-Type': 'application/json',
// 					'Authorization': `Bearer ${token}`
// 				  }
//     });


//     //let jsonData = 
// 	//  {
// 	//     "status_id": "3",
// 	//     "balance": "100",
// 	// 	"order_id": "5988775",
// 	// 	"utr": "",
// 	// 	"report_id": "",
// 	//    "message": "Quee",
// 	//   }
// 	// ;
// 	// const data = jsonData;

//     const data = response.data;
//     console.log('API Billpay Response:', data);
//     return data;


// }


//CREDIT CARD END





//InsuranceSTART 



router.post("/billfetch_Insurance", async  function(request, response){


    try
    {               

       // const getpay2all_balance = await getpay2allprofile(request.body.token); 
   //console.log(getpay2all_balance.data.data.balance.user_balance);
   console.log('----------------------------');
   
     
    console.log('req bill fetch Insurance');
    console.log(request.body.billerid);
    console.log(request.body.serviceprovidername);
    console.log(request.body.uniqueid);
    
    console.log(request.body.paraname);
    console.log(request.body.dob);

    const formatter = new Intl.DateTimeFormat('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const formattedDate = formatter.format(request.body.dob);
    console.log(formattedDate);

    console.log(request.body.paraname1);
    console.log(request.body.emailID);

    console.log(request.body.paraname2);
    console.log(request.body.accountno);
    
    
    console.log(request.body.token);

    console.log('req bill fetch Insurance-1');
    const databillfetch = await funcbillfetch_Insurance(request.body.billerid,request.body.uniqueid,request.body.paraname,request.body.dob,request.body.paraname1,request.body.emailID,request.body.paraname2,request.body.accountno,request.body.token);

              
      console.log(databillfetch.status_id);
      console.log(databillfetch.billNumber);
      console.log(databillfetch.amount);
      console.log(databillfetch.name);
      console.log(databillfetch.dueDate);
      console.log(databillfetch.billdate);
      console.log(databillfetch.reference_id);
      console.log(databillfetch.additionalInfo);  
       console.log(databillfetch.message);  

      if(databillfetch.message =="Success")
      {
        const datainsertbillfetch = await  insert_transaction_billfetch_Insurance(request.body.userid,request.body.accountno,request.body.billerid,request.body.uniqueid,request.body.serviceprovidername,request.body.mobileno,databillfetch.amount,request.body.paidtype,request.body.category,request.body.paraname,request.body.token,databillfetch.billNumber,databillfetch.name,databillfetch.dueDate,databillfetch.billdate,databillfetch.reference_id,request.body.ip,databillfetch.message,databillfetch.additionalInfo);
     
         console.log('yyyyyyyyyyyyyyyyyyyyyy');  
        console.log(datainsertbillfetch.Message); 

         response.json({
                         status:"success",
                         msg:datainsertbillfetch.Message,      
                         transactionsID:datainsertbillfetch.transactionsID,
                         serviceprovider:datainsertbillfetch.serviceprovider,
                         billNumber:datainsertbillfetch.billNumber,
                         customername:datainsertbillfetch.customername,
                         BillDate:datainsertbillfetch.billdate, 
                         DueDate:datainsertbillfetch.dueDate,
                         referenceId:datainsertbillfetch.referenceId,   
                        
                         paraname:request.body.paraname,  
                         dob:request.body.dob,

                         paraname1:request.body.paraname1,
                         emailID:request.body.emailID,
                         paraname2:request.body.paraname2,
                         accountno:request.body.accountno,



                         paidtype:datainsertbillfetch.paidtype,
                         mobilenumber:datainsertbillfetch.mobilenumber,
                         amount:datainsertbillfetch.amount,
                         accountno:datainsertbillfetch.accountno,
                          
                          billerid:datainsertbillfetch.billerid, 
                          Paraname:datainsertbillfetch.Paraname, 
                          token:datainsertbillfetch.token, 
                          
                         
                       });


      }
      else{
                  const datainsertbillfetch = await  insert_transaction_billfetch_Insurance(request.body.userid,request.body.accountno,request.body.provideid,request.body.uniqueid,request.body.serviceprovidername,request.body.mobileno,databillfetch.amount,request.body.paidtype,request.body.category,request.body.name,request.body.token,databillfetch.billNumber,databillfetch.name,databillfetch.dueDate,databillfetch.billdate,databillfetch.reference_id,request.body.ip,databillfetch.message);
                    console.log('xxxxxxxxxxxxxxxxx');  
                  
                  response.json({
                         status:"failure",
                         msg:datainsertbillfetch.Message,      
                         transactionsID:datainsertbillfetch.transactionsID,
                        token:datainsertbillfetch.token, 
                       });

      }



    } catch(error){

    }
    
});

async function funcbillfetch_Insurance(billerid,uniqueid,paraname,dob,paraname1,emailID,paraname2,accountno,token) {


console.log('----a1----');
console.log(billerid);
console.log(uniqueid);
console.log(paraname);
console.log(dob);
console.log(paraname1);
console.log(emailID);
console.log(paraname2);
console.log(accountno);
console.log(token);

console.log('----a2----');

var requestBody = JSON.stringify({"billerId":billerid,"client_id":uniqueid,"customerParams":[{"name":paraname,"value":dob},{"name":paraname1,"value":emailID},{"name":paraname2,"value":accountno}]});
const response = await axios.post('https://erp.pay2all.in/api/bbps/fetch', requestBody, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const data = response.data;
    console.log('API Response:', data);
    return data;


}
async function insert_transaction_billfetch_Insurance(userid,accountno,provideid,myuniqueid,serviceprovidername,mobileno,amount,paidtype,category,paraname,token,billNumber,customername,dueDate,billdate,reference_id,ip, message,additionalInfo){

    try{
        
            const conn= await sql.connect(config);
            const res =await conn.request()
            .input("userid", userid)
             .input("amount", amount)
             .input("paidtype", paidtype)
            .input("accountno", accountno)
            .input("provideid", provideid)
            .input("tranid", myuniqueid.toString())
            .input("serviceprovidername", serviceprovidername)
            .input("mobileno",mobileno)
            .input("category", category)
            .input("paraname", paraname)
            .input("token", token)
            .input("billNumber", billNumber)
            .input("customername", customername)
            .input("dueDate", dueDate)
            .input("billdate", billdate)
            .input("reference_id", reference_id)
            .input("ip", ip)
            .input("Remarks",message)
             .input("additionalInfo",additionalInfo)
            .execute("usp_insertTransaction_Insurance_billfetch");
            const data = res.recordset[0];
             console.log('sp Responsett:', data);
            return data;

    }catch(error){
        console.log(error);
    }

}

router.post("/billfetch_Insurance_payment", async  function(request, response){


    try
    {               

    console.log('bill pay');

      const getdatabalance= await getbalance(request.body.userid);
      console.log(getdatabalance.MSG);
      console.log(getdatabalance.Balance);

     if(parseFloat(getdatabalance.Balance) >= parseFloat(request.body.amount))
      {
    
          const datapayreturn = await funcbillfetchpay_Insurance(request.body.accountno,request.body.referenceid,request.body.amount,request.body.billerid,request.body.uniqueid,request.body.name,request.body.mobileno,request.body.token,request.body.Paraname1,request.body.Paraname2);
    

        console.log(datapayreturn.utr);
        console.log(datapayreturn.message);
        console.log(request.body.uniqueid);
     
      if(datapayreturn.message.toString() =="success")
      {
               const returnrecharge = await update_transaction(request.body.userid,request.body.uniqueid,'success',datapayreturn.utr,datapayreturn.message,'wallet')
                    

                       response.json({
                         status:"success",
                         transactionsID:returnrecharge[0].transactionsID,
                         serviceprovider:returnrecharge[0].serviceprovider,
                         paidtype:returnrecharge[0].paidtype,
                         mobilenumber:returnrecharge[0].mobilenumber,
                         accountno:returnrecharge[0].accountno,
                         amount:returnrecharge[0].amount,
                         msg:returnrecharge[0].Message,             
                       });

        


      }
      else{
                   update_transaction(request.body.userid,request.body.uniqueid,'failure',datarecharge.utr,datarecharge.message,'wallet')

                        response.json({
                         status:"failure",
                          msg:datarecharge.message,             
                       });

      }

      
    }
    else{
        response.json({
                         status:"failure",
                          msg:"Insufficient Balance",                  
                       });

    }

    } catch(error){





    }
  
    
});

async function funcbillfetchpay_Insurance(accountno,referenceid,amount,billerid,uniqueid,name,mobileno,token, paraname1, paraname2) {
  
// var requestBody = JSON.stringify({"billerId":billerid,"client_id":uniqueid,"customerParams":[{"name":name,"value":mobileno}]});
var requestBody = JSON.stringify({"reference_id":referenceid,"amount":amount,"billerId":billerid,"mobile_number":mobileno,"client_id":uniqueid,"customerParams":[{"name":paraname1,"value":accountno},{"name":paraname2,"value":mobileno}]});
const response = await axios.post('https://erp.pay2all.in/api/bbps/payment', requestBody, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });



    const data = response.data;
    console.log('API Billpay Response:', data);
    return data;


}

//Insurance END




















router.post("/billfetchpayment", async  function(request, response){


    try
    {               

    console.log('bill pay');

      const getdatabalance= await getbalance(request.body.userid);
      console.log(getdatabalance.MSG);
      console.log(getdatabalance.Balance);

     if(parseFloat(getdatabalance.Balance) >= parseFloat(request.body.amount))
      {
    
          const datapayreturn = await funcbillfetchpay(request.body.accountno,request.body.referenceid,request.body.amount,request.body.billerid,request.body.uniqueid,request.body.name,request.body.mobileno,request.body.token);
    

        console.log(datapayreturn.utr);
        console.log(datapayreturn.message);
        console.log(request.body.uniqueid);
     
      if(datapayreturn.message.toString() =="success")
      {
               const returnrecharge = await update_transaction(request.body.userid,request.body.uniqueid,'success',datapayreturn.utr,datapayreturn.message,'wallet')
                    

                       response.json({
                         status:"success",
                         transactionsID:returnrecharge[0].transactionsID,
                         serviceprovider:returnrecharge[0].serviceprovider,
                         paidtype:returnrecharge[0].paidtype,
                         mobilenumber:returnrecharge[0].mobilenumber,
                         accountno:returnrecharge[0].accountno,
                         amount:returnrecharge[0].amount,
                         msg:returnrecharge[0].Message,             
                       });

        


      }
      else{
                   update_transaction(request.body.userid,request.body.uniqueid,'failure',datarecharge.utr,datarecharge.message,'wallet')

                        response.json({
                         status:"failure",
                          msg:datarecharge.message,             
                       });

      }

      
    }
    else{
        response.json({
                         status:"failure",
                          msg:"Insufficient Balance",                  
                       });

    }

    } catch(error){





    }
  
    
});

async function funcbillfetchpay(accountno,referenceid,amount,billerid,uniqueid,name,mobileno,token) {
  
 console.log('--start credit card--');
  console.log('--DIRECT PAYMENT--');
  console.log(accountno);
  console.log(referenceid);
  console.log(amount);
  console.log(billerid);
  console.log(uniqueid);
  console.log(name);
  console.log(mobileno);
    console.log(token);
	console.log('--end direct payment--');
//// var requestBody = JSON.stringify({"billerId":billerid,"client_id":uniqueid,"customerParams":[{"name":name,"value":mobileno}]});
//var requestBody = JSON.stringify({"reference_id":referenceid,"amount":amount,"billerId":billerid,"mobile_number":mobileno,"client_id":uniqueid,"customerParams":[{"name":name,"value":accountno}]});
//const response = await axios.post('https://erp.pay2all.in/api/bbps/payment', requestBody, {
//      headers: {
//        'Content-Type': 'application/json',
//       'Authorization': `Bearer ${token}`
 //   }
 //  });



    const data = response.data;
    console.log('API Billpay Response:', data);
    return data;


}
// async function funcbillfetchpay(accountno,referenceid,amount,billerid,uniqueid,name,mobileno,token) {
  
// // var requestBody = JSON.stringify({"billerId":billerid,"client_id":uniqueid,"customerParams":[{"name":name,"value":mobileno}]});
// var requestBody = JSON.stringify({"reference_id":referenceid,"amount":amount,"billerId":billerid,"mobile_number":mobileno,"client_id":uniqueid,"customerParams":[{"name":name,"value":accountno}]});
// const response = await axios.post('https://erp.pay2all.in/api/bbps/payment', requestBody, {
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`
//       }
//     });



//     const data = response.data;
//     console.log('API Billpay Response:', data);
//     return data;


// }




async function getbalance(userid){

    try{
        
            const conn= await sql.connect(config);
            const res =await conn.request()
            .input("userid", userid)
            .execute("USP_getbalance");
            const data = res.recordset[0];
             console.log('sp balance:', data);
            return data;

    }catch(error){
        console.log(error);
    }

}



//Mobile app
router.post("/signin", function(request, response){


    try
    {

        let order= {...request.body}
        dboperations.signinapi(order).then(result => {
        
           // console.log(result.recordsets);
    
           
            if(result.recordsets[0][0].Valid=="TRUE")
            {
             
                const user= {id:result.recordsets[0][0].ID};
    
                var data =  result.recordsets[0][0].UserID;
                  // Encrypt
                var cipherUserID = CryptoJS.AES.encrypt(JSON.stringify(data), 'msecret-keys@9128').toString();
    
                const token = jwt.sign({USERID:user},"msecret-keys@9128", {expiresIn:"30m"});
                response.json({
                    token:token,
                    status:"success",
                    msg:'Valid',
                    id:result.recordsets[0][0].ID,
                    UserID:result.recordsets[0][0].USERID,
                    FullName:result.recordsets[0][0].FullName,
                    EmailID:result.recordsets[0][0].EMailId,
                    valid:result.recordsets[0][0].Valid,
                    url:result.recordsets[0][0].URL,
                    clientID:result.recordsets[0][0].ClientID,
                    clientsecrect:result.recordsets[0][0].ClientSecrect,
                    ismember:'1',
                    Encrypt:cipherUserID
                });

        
             }
             else{
                response.json({
                    
                    status:"failure",
                    msg:'Invalid UserID or Password',
            
                });
             }
        });


    } catch(error){

    }
  
    
});


router.post("/register", function(request, response){


    try
    {

        let order= {...request.body}
        dboperations.registerapi(order).then(result => {
        
           // console.log(result.recordsets);
    
           
            if(result.recordsets[0][0].ISSUCCESS=="TRUE")
            {
                const user= {id:result.recordsets[0][0].ID};
    
                var data =  result.recordsets[0][0].UserID;
                  // Encrypt
                var cipherUserID = CryptoJS.AES.encrypt(JSON.stringify(data), 'msecret-keys@9128').toString();
    
                const token = jwt.sign({USERID:user},"msecret-keys@9128", {expiresIn:"30m"});
                response.json({
                    token:token,
                    status:"success",
                    msg:'Valid',
                    id:result.recordsets[0][0].ID,
                    UserID:result.recordsets[0][0].Userid,
                    FullName:result.recordsets[0][0].NAME,
                    EmailID:result.recordsets[0][0].EMailId,
                    ismember:'1'
                   
                });
        
             }
             else{
                response.json({
                    
                    status:"failure",
                    msg:'Invalid UserID or Password',
            
                });
             }
        });


    } catch(error){

    }
  
    
});

router.post("/welcome", function (request, response) {

    try {


        let order = { ...request.body }
        dboperations.getwelcome(order).then(result => {

            if (result != null) {
                console.log(result.recordsets[0])
                response.json({
                    data: result.recordsets[0],

                });
            }


        });

    }
    catch (error) {

    }





});





router.post("/getmemerdashboard", function(request, response){

    let order= {...request.body}
    dboperations.getmemberdashboard(order).then(result => {
    
       console.log(result.recordsets);
      response.json(result["recordsets"][0]);
          
    
    });
    
});

router.post("/operatorlist", function (request, response) {

    let order = { ...request.body }
    dboperations.getoperatorlist(order).then(result => {

        console.log(result);
        response.json(result["recordsets"][0]);

    });

});



router.post("/updatename", function(request, response){

    let order= {...request.body}
    dboperations.getupdatename(order).then(result => {
    
          if(result !=null){
                //console.log(result.recordsets[0])
                console.log(result["recordsets"][0]);

             for (var i = 0; i < result.recordsets[0].length; i++) 
             {
                     console.log(result.recordsets[0][i].billerId);
                   update(result.recordsets[0][i].billerId)
                  
             }

            }
    });
    
});
async function update(billerid) {
  

var requestBody = JSON.stringify({});
const response = await axios.get('https://erp.pay2all.in/api/bbps/biller/'+billerid, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer 384934|g6H1T6OlCnAgcjUxx4SX077OHjQ46LShConTyvih065de865`
      }
    });


                                const data = response.data;
                                     console.log(data);
                                   console.log(billerid);
                                    console.log(billerid+':', data.biller[0].customerParams.paramName);
                                    const conn = await sql.connect(config);
                                    const resg =  await conn.request()
                                    .input("name", data.biller[0].customerParams.paramName)
                                    .input("billerid", billerid)
                                    .execute("USP_UpdateCustomername");
   // return data;
}




router.post("/billpay", async  function(request, response){

    try
    {               

    console.log('req');

    const data1 = await funcbillfetchpay(request.body.accountno,request.body.referenceid,request.body.amount,request.body.billerid,request.body.uniqueid,request.body.name,request.body.mobileno,request.body.token);
        if (data1) {

                 console.log('Response');
                  response.json({
                   
                    status:"success",
                    msg:'Valid',
                    message:data1,
                   
                });


        // await insertIntoDb(data);
        }
              

     


    } catch(error){

    }
  
    
});

router.post("/billerparaname", function (request, response) {

    let order = { ...request.body }
    dboperations.getbillerparaname(order).then(result => {

        console.log(result);
        response.json(result["recordsets"][0][0]);

    });

});











router.post("/getprofile", function (request, response) {

    console.log('*111***1')
    let order = { ...request.body }
    const token1 = request.header('Authorization');
    console.log('*111***2')
  
    dboperations.getprofileadmin(order).then(result => {

        if (result != null) {
            console.log(result.recordsets[0])
            response.json({
                statuscode:1,
                data: result.recordsets[0],


            });
        }
    });
 
});


router.post("/updateprofile", function (request, response) {

    let order = { ...request.body }

   
    dboperations.updateprofileadmin(order).then(result => {

        if (result != null) {
            console.log(result.recordsets[0])
            response.json({

                statuscode:1, 

                 data: result.recordsets[0],

            });
        }
    });


});

router.post("/updatememberpassword", function (request, response) {

    let order = { ...request.body }
   
    dboperations.updatepassword(order).then(result => {

        if (result != null) {
            console.log(result.recordsets[0])
            response.json({
                statuscode:1,
                data: result.recordsets[0],


            });
        }
    });
   

});

router.post("/transactiondtls", function (request, response) {

       console.log('start');
    let order = { ...request.body }

    dboperations.gettransactiondetails(order).then(result => {

        if (result != null) {
            console.log(result.recordsets[0])
            response.json({
                statuscode:1,
                data: result.recordsets[0],

            });
        }
    });
  

});


router.post("/commissiondtls", function (request, response) {

    let order = { ...request.body }

    dboperations.getcommissiondetails(order).then(result => {

        if (result != null) {
            console.log(result.recordsets[0])
            response.json({
                statuscode:1,
                data: result.recordsets[0],

            });
        }
    });
  

});

router.post("/fundreport", function (request, response) {

    let order = { ...request.body }

    dboperations.getfundreport(order).then(result => {

        if (result != null) {
            console.log(result.recordsets[0])
            response.json({
                statuscode:1,
                data: result.recordsets[0],

            });
        }
    });
  

});



router.route('/BillerList').post((request, response) => {

    try {
        dboperations.getbillerlist().then(result => {
            console.log(result);
            response.json(result["recordsets"][0]);
        })
    }
    catch (error) {

    }

});


// API endpoint to get search suggestions
router.get("/search",async function (req, res) {

  const { query } = req.query;
  
  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('searchQuery', sql.NVarChar, `%${query}%`)
      .query('SELECT billerId, billerName FROM tblBillerList WHERE billerName LIKE @searchQuery');
    
    res.json(result.recordset);
  } catch (err) {
    console.error('SQL error', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// API endpoint to get all items for dropdown
router.get("/items",async function (req, res) {

  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .query('SELECT billerId, billerName FROM tblBillerList');
    
    res.json(result.recordset);
  } catch (err) {
    console.error('SQL error', err);
    res.status(500).json({ error: 'Database error' });
  }
});



// Get daily data

router.post("/data",async function (req, res) {

if(req.body.data=='daily')
{
  console.log(req.body.userId);
    try {
    const pool = await sql.connect(config);
    const result = await pool.request()
       .input('searchQuery', sql.NVarChar, `${req.body.userId}`)
      .query('SELECT CAST(Ondate AS DATE) as date, SUM(amount) as value FROM tblTransaction_Recharge WHERE  MemberID= (select MemberID from tblLogin where USERID=@searchQuery) and Ondate >= DATEADD(day, -30, GETDATE()) GROUP BY CAST(Ondate AS DATE) ORDER BY date');
    
       console.log(result.recordset);
    res.json(result.recordset);
  } catch (err) {
    console.error('SQL error', err);
    res.status(500).json({ error: 'Database error' });
  }
}
else if(req.body.data=='weekly')
{

    try {
       console.log(req.body.userId);
    const pool = await sql.connect(config);
    const result = await pool.request()
     .input('searchQuery', sql.NVarChar, `${req.body.userId}`)
      .query('SELECT DATEPART(year, Ondate) as year, DATEPART(week, Ondate) as week, SUM(amount) as value FROM tblTransaction_Recharge WHERE MemberID= (select MemberID from tblLogin where USERID=@searchQuery) and Ondate >= DATEADD(week, -12, GETDATE()) GROUP BY DATEPART(year, Ondate), DATEPART(week, Ondate) ORDER BY year, week ');
    
       console.log(result.recordset);
    res.json(result.recordset);
  } catch (err) {
    console.error('SQL error', err);
    res.status(500).json({ error: 'Database error' });
  }
}

else if(req.body.data=='quarterly')
{

    try {
    const pool = await sql.connect(config);
    const result = await pool.request()
     .input('searchQuery', sql.NVarChar, `${req.body.userId}`)
      .query('SELECT DATEPART(year, Ondate) as year, (DATEPART(week, Ondate) / 3) as quarterly, SUM(amount) as value FROM tblTransaction_Recharge WHERE MemberID= (select MemberID from tblLogin where USERID=@searchQuery) and Ondate >= DATEADD(month, -6, GETDATE())  GROUP BY DATEPART(year, Ondate), (DATEPART(week, Ondate) / 3) ORDER BY year, quarterly');
    
       console.log(result.recordset);
    res.json(result.recordset);
  } catch (err) {
    console.error('SQL error', err);
    res.status(500).json({ error: 'Database error' });
  }
}

else if(req.body.data=='monthly')
{

    try {
    const pool = await sql.connect(config);
    const result = await pool.request()
     .input('searchQuery', sql.NVarChar, `${req.body.userId}`)
      .query('SELECT  DATEPART(year, Ondate) as year, DATEPART(month, Ondate) as month,SUM(amount) as value FROM tblTransaction_Recharge WHERE MemberID= (select MemberID from tblLogin where USERID=@searchQuery) and Ondate >= DATEADD(year, -2, GETDATE()) GROUP BY DATEPART(year, Ondate), DATEPART(month, Ondate) ORDER BY year, month  ');
    
       console.log(result.recordset);
    res.json(result.recordset);
  } catch (err) {
    console.error('SQL error', err);
    res.status(500).json({ error: 'Database error' });
  }
}


});



router.post("/circle-chart-data",async function (req, res) {

  try {
    // Connect to the database
       const pool = await sql.connect(config);
    
 
    const result = await pool.request()
     .input('searchQuery', sql.NVarChar, `${req.body.userId}`)
     .query('select distinct  B.billerCategoryName as category ,ISNULL((select SUM(T.amount) from tblTransaction_Recharge T where T.Category=B.billerCategoryName and T.MemberID=(select L.MEMBERID from tblLogin L where L.USERID=@searchQuery)),0) as value from tblBillerList B');
    
      console.log(result.recordset);
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching chart data:', err);
    res.status(500).send('Server error');
  } finally {
    sql.close();
  }
});






router.get("/testcall", async  function(request, response){
    try
    {               
        
        response.json({
                
                data: 'ALL DATA',


        });


    console.log('req');
    } catch(error){

    }
  
    
});



// Serve React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}



app.listen(port, (c) => {



    console.log(
        `Server is working on port ${port} in ${process.env.NODE_ENV} Mode.`
    )
});





// var config = require('dbconfig');
// const sql = require("mssql");
// const jwt = require('jsonwebtoken')
// const cookieParser =require('cookie-parser')
// var CryptoJS = require("crypto-js");





// const express = require("express");
// var bodyParser = require('body-parser');
// const dotenv = require('dotenv');

// const cors = require('cors');
// const multer = require('multer');

// var CryptoJS = require("crypto-js");
// const PayU = require("payu-websdk");
// var https = require('https'),
// crypto = require('crypto'),
// events = require('events'),
// qs = require('querystring'),
// eventEmitter = new events.EventEmitter();

// const axios = require('axios');
// var FormData = require('form-data');


// const { sign } = require("jsonwebtoken");
// const path = require('path');

// const app= express();
// var router = express.Router();
// const port = process.env.PORT || 8080;




// const sessiontoken="0";

// //set for Global configuration access
// dotenv.config();


// // app.use(cors());
// app.use(cors({origin:"*"}))
// app.use(bodyParser.urlencoded({extended:true}));
// app.use(bodyParser.json());

// app.use('/api', router);

// app.use('/images', express.static('images'));

// var drespose="";



// const form = new FormData();



// console.log('Data received:---1');


// form.append('email', 'laxmikanta.28@gmail.com');
// form.append('password', 'Pintu#84');






// const payuClient = new PayU(
//   {
//     key: process.env.MERCHANT_KEY,
//     salt: process.env.MERCHANT_SALT,
//   },
//   process.env.MERCHANT_MODE
// );


// const getpay2allprofile = async (token1) => {
//  // const data = { date1: date1, date2: date2 }
//   //const tokenApp = window.localStorage.getItem('token');
//   const { data: res } = await axios.get(`https://erp.pay2all.in/api/user`, {
//     headers: { Authorization: `Bearer ${token1}`, },
//   });
//   return res;
// };


// router.post("/initiate-payment-deposit", async  function(req, res){
//   try {
    


//     const {userid, txnid, amount, productinfo, firstname, email, phone} = req.body;
   
//     console.log('IIIIIIIIIIIIIIIIIIIIIIII');
   
//     console.log(req.body.userid);
//     console.log(req.body.txnid);
//     console.log(req.body.amount);
//     console.log(req.body.productinfo);
//     console.log(req.body.firstname);
//     console.log(req.body.email);
//     console.log(req.body.phone);



//     console.log(req.body.sessionuserid);
//     console.log(req.body.accountno);
//     console.log(req.body.amount);
//     console.log(req.body.paidtype);
//     console.log(req.body.provideid);
//     console.log(req.body.serviceprovidername);
//     console.log(req.body.uniqueid);
      
//     console.log('KKKKKKKKKKKKKKKK');
   
//     console.log(req.body.mobileno);
//     console.log(req.body.token);
//     console.log(req.body.category);
//     console.log(req.body.ip);



//    // insert_transaction_directpayment(req.body.sessionuserid,req.body.accountno,req.body.provideid,req.body.uniqueid,req.body.serviceprovidername,req.body.mobileno,req.body.amount,req.body.paidtype,req.body.category,req.body.ip,req.body.txnid,req.body.token);
   

//     let data = {
//       isAmountFilledByCustomer: false,
//       txnid,
//       amount,
//       currency: "INR",
//       productinfo,
//       firstname,
//       email,
//       phone,
//       surl: `https://www.moniespay.com/verifypayudeposit/${txnid}`,
//       furl: `https://www.moniespay.com/verifypayudeposit/${txnid}`,
//     };


     
//     const hashString = `${process.env.MERCHANT_KEY}|${data.txnid}|${data.amount}|${data.productinfo}|${data.firstname}|${data.email}|||||||||||${process.env.MERCHANT_SALT}`;
//     const hash = crypto.createHash("sha512").update(hashString).digest("hex");
//     data.hash = hash;
//     console.log(hash)

   
//     if(req.body.category=="mobile"){
// 		 console.log('PPPPPP');
// 		 console.log(req.body.uniqueid);
//         addmoney_transaction(req.body.userid,txnid,amount,productinfo,email,phone,firstname);
//     }
//     else{
// 		 console.log('QQQQQQQQQ');
// 		  console.log(userid);
// 		 console.log(req.body.uniqueid);
// 		updateaddmoney_transaction(userid,txnid,amount,productinfo,req.body.email,req.body.phone,req.body.firstname,req.body.uniqueid);
//     }
    

     
    

//     let response = await payuClient.paymentInitiate(data);
//     console.log(response);
//       res.json(response);
//     //res.send(response);
//   } catch (error) {
//     console.error("Error initiating payment:", error);
//     res.status(500).send(error);
//   }
// });



// router.post("/initiate-payment", async  function(req, res){
// //app.post("/initiate-payment", async (req, res) => {
//   try {
    


//     const {userid, txnid, amount, productinfo, firstname, email, phone} = req.body;
   
   
//     console.log('IIIIIIIIIIIIIIIIIIIIIIII');
   
//     console.log(req.body.userid);
//     console.log(req.body.txnid);
//     console.log(req.body.amount);
//     console.log(req.body.productinfo);
//     console.log(req.body.firstname);
//     console.log(req.body.email);
//     console.log(req.body.phone);



//     console.log(req.body.sessionuserid);
//     console.log(req.body.accountno);
//     console.log(req.body.amount);
//     console.log(req.body.paidtype);
//     console.log(req.body.provideid);
//     console.log(req.body.serviceprovidername);
//     console.log(req.body.uniqueid);
      
//     console.log('KKKKKKKKKKKKKKKK');
   
//     console.log(req.body.mobileno);
//     console.log(req.body.token);
//     console.log(req.body.category);
//     console.log(req.body.ip);



//      insert_transaction_directpayment(req.body.sessionuserid,req.body.accountno,req.body.provideid,req.body.uniqueid,req.body.serviceprovidername,req.body.mobileno,req.body.amount,req.body.paidtype,req.body.category,req.body.ip,req.body.txnid,req.body.token);
   

//     let data = {
//       isAmountFilledByCustomer: false,
//       txnid,
//       amount,
//       currency: "INR",
//       productinfo,
//       firstname,
//       email,
//       phone,
//       surl: `https://www.moniespay.com/verifypayu/${txnid}`,
//       furl: `https://www.moniespay.com/verifypayu/${txnid}`,
//     };


     
//     const hashString = `${process.env.MERCHANT_KEY}|${data.txnid}|${data.amount}|${data.productinfo}|${data.firstname}|${data.email}|||||||||||${process.env.MERCHANT_SALT}`;
//     const hash = crypto.createHash("sha512").update(hashString).digest("hex");
//     data.hash = hash;
//     console.log(hash)

//     if(req.body.category=="mobile"){
//         addmoney_transaction(userid,txnid,amount,productinfo,email,phone,firstname);
//     }
//     else{
//       console.log(req.body.uniqueid);
//       updateaddmoney_transaction(userid,txnid,amount,productinfo,email,phone,firstname,req.body.uniqueid);
//     }
    

     
    

//     let response = await payuClient.paymentInitiate(data);
//     console.log(response);
//       res.json(response);
//     //res.send(response);
//   } catch (error) {
//     console.error("Error initiating payment:", error);
//     res.status(500).send(error);
//   }
// });

// async function insert_transaction_directpayment(userid,accountno,provideid,myuniqueid,serviceprovidername,mobileno,amount,paidtype,category,ip,payutxtid,token){

//     try{
        
//             const conn= await sql.connect(config);
//             const res =await conn.request()
//             .input("userid", userid)
//             .input("accountno", accountno)
//             .input("provideid", provideid)
//             .input("tranid", myuniqueid)
//             .input("serviceprovidername", serviceprovidername)
//             .input("mobileno",mobileno)
//             .input("amount", amount)
//             .input("paidtype", paidtype)
//             .input("category", category)
//             .input("ip", ip)
//             .input("payutxtid", payutxtid)
//             .input("token", token)
//             .execute("usp_insertTransaction_direct");
//             const data = res.recordset;
//             //  console.log('sp Response:', data);
//           //  return data;

//     }catch(error){
//         console.log(error);
//     }

// }

// async function updateaddmoney_transaction(userid,txnid,amount,productinfo,email,mobileno,name,uniqueid){

//     try{
//          console.log('---ADD Money INICIATE---')
//       console.log('---22---')
//       console.log(userid);
//       console.log(txnid);
//       console.log(amount);
//       console.log(productinfo);
//       console.log(email);
//       console.log(mobileno);
//       console.log(name);

//             const conn= await sql.connect(config);
//             const res =await conn.request()



//             .input("userid", userid)
//             .input("txnid", txnid)
//             .input("amount", amount)
//             .input("productinfo", productinfo)
//             .input("email", email)
//             .input("mobileno",mobileno)
//             .input("name", name)
//              .input("uniqueid", uniqueid)
//             // .input("hashid", '--')

//             .execute("usp_updateaddmoneyTransaction");
//             const data = res.recordset;
//             //  console.log('sp Response:', data);


//                console.log('---ADD Money INICIATE- END--')
//             return data;

//     }catch(error){
//         console.log(error);
//     }

// }





// ///CREDIT CARD PART START

// router.post("/initiate-payment-creditcard", async  function(req, res){
// //app.post("/initiate-payment", async (req, res) => {
//   try {
    

// 	 console.log('Credit Card Online Payment Line 1');
//     const {userid, txnid, amount, productinfo, firstname, email, phone} = req.body;
   
   
//     console.log('Credit Card Online Payment Line 2');
//     console.log(req.body.userid);
//     console.log(req.body.txnid);
//     console.log(req.body.amount);
//     console.log(req.body.productinfo);
//     console.log(req.body.firstname);
//     console.log(req.body.email);
//     console.log(req.body.phone);



//     console.log(req.body.sessionuserid);
//     console.log(req.body.accountno);
//     console.log(req.body.amount);
//     console.log(req.body.paidtype);
//     console.log(req.body.provideid);
//     console.log(req.body.serviceprovidername);
//     console.log(req.body.uniqueid);
      
//      console.log('Credit Card Online Payment Line 3');
   
//     console.log(req.body.mobileno);
//     console.log(req.body.token);
//     console.log(req.body.category);
//     console.log(req.body.ip);



//    // insert_transaction_directpayment(req.body.sessionuserid,req.body.accountno,req.body.provideid,req.body.uniqueid,req.body.serviceprovidername,req.body.mobileno,req.body.amount,req.body.paidtype,req.body.category,req.body.ip,req.body.txnid,req.body.token);
   

//     let data = {
//       isAmountFilledByCustomer: false,
//       txnid,
//       amount,
//       currency: "INR",
//       productinfo,
//       firstname,
//       email,
//       phone,
//       surl: `https://www.moniespay.com/verifypayucreditcard/${txnid}`,
//       furl: `https://www.moniespay.com/verifypayucreditcard/${txnid}`,
//     };


//       console.log('Credit Card Online Payment Line 4');
//     const hashString = `${process.env.MERCHANT_KEY}|${data.txnid}|${data.amount}|${data.productinfo}|${data.firstname}|${data.email}|||||||||||${process.env.MERCHANT_SALT}`;
//     const hash = crypto.createHash("sha512").update(hashString).digest("hex");
//     data.hash = hash;
//     console.log(hash)

   
   
    
// 		 console.log('Credit Card Online Payment Line 5');
// 		  console.log(userid);
// 		 console.log(req.body.uniqueid);
// 		  console.log('Credit Card Online Payment Line 6');
// 		updateaddmoney_transaction(userid,txnid,amount,productinfo,req.body.email,req.body.phone,req.body.firstname,req.body.uniqueid);
    
    

     
    

//     let response = await payuClient.paymentInitiate(data);
//     console.log(response);
//       res.json(response);
//     //res.send(response);
//   } catch (error) {
//     console.error("Error initiating payment:", error);
//     res.status(500).send(error);
//   }
// });

//  router.get("/verifycredit/:id", async  function(req, res)
//  {
//     try{

//        console.log('---Verify Credit Card Transaction--Line-1');
//        console.log(req.params.id)
//        const data = await payuClient.verifyPayment(req.params.id);
//        const status = data.transaction_details[req.params.id];
//        console.log(status);
//        console.log(status.status);
//        console.log(status.transaction_amount);
    
// 	     console.log(status.error_Message);
//        console.log('---Verify Credit Card Transaction--Line-2');

//        if (status.status === "success") {
//             console.log('---Verify Credit Card Transaction--Line-3');
//             const conn= await sql.connect(config);
//             const result =await conn.request()
//            .input("Tranid", req.params.id)
//            .execute("USP_getPaymode");
//             const data = result["recordset"];
//             console.log(' Response:', data);
//             console.log(data.paytype);
//             console.log(result["recordset"][0].paytype);
//             console.log('---category---');
//             console.log(result["recordset"][0].Name);
//             console.log('---Verify Credit Card Transaction--Line-4');
//             console.log(result["recordset"][0].token);
		        
//             const getpay2all_balance = await getpay2allprofile(result["recordset"][0].token);
// 			      console.log('---Verify Credit Card Transaction--Line-6');
// 			      console.log(getpay2all_balance.data.balance.user_balance);			
// 			      console.log('---Verify Credit Card Transaction--Line-7');
// 		        console.log(result["recordset"][0].category);
// 			      console.log('---Verify Credit Card Transaction--Line-8');
            
//             if(result["recordset"][0].category=="Credit Card"){

//                const getdatabalance= await getbalance(result["recordset"][0].userid);
//                console.log(getdatabalance.MSG);
//                console.log(getdatabalance.Balance);
//                console.log(getpay2all_balance.data.balance.user_balance);
//                console.log(parseFloat(getpay2all_balance.data.balance.user_balance));
//                console.log(parseFloat(result["recordset"][0].amount));
//                console.log('---Verify Credit Card Transaction--Line-10');

//                if(parseFloat(getpay2all_balance.data.balance.user_balance) >= parseFloat(result["recordset"][0].amount)){
//                 console.log(result["recordset"][0].accountno);
//                 console.log(result["recordset"][0].provideid);
//                 console.log(result["recordset"][0].amount);
//                 console.log(result["recordset"][0].uniqueid);
//                 console.log(result["recordset"][0].mobileno);
//                 console.log(result["recordset"][0].token);
//                 console.log(result["recordset"][0].parameter1);
//                 console.log(result["recordset"][0].parameter2);
//                 console.log(result["recordset"][0].parameter3);
//                 console.log('---Verify Credit Card Transaction--Line-11');

//                 if(result["recordset"][0].amount >=10){
//                   console.log('---Verify Credit Card Transaction--Line-12');
//                   const datarecharge = await funcbillfetchpay_creditcard_Online(result["recordset"][0].accountno,result["recordset"][0].ReferenceID,result["recordset"][0].amount,result["recordset"][0].provideid,result["recordset"][0].uniqueid,result["recordset"][0].Name,result["recordset"][0].mobileno,result["recordset"][0].token,result["recordset"][0].parameter1,result["recordset"][0].parameter2);
//                   console.log('---Verify Credit Card Transaction--Line-13');
//                   console.log(datarecharge.status_id);
//                   console.log(datarecharge.balance);
//                   console.log(datarecharge.order_id);
//                   console.log(datarecharge.utr);
//                   console.log(datarecharge.report_id);
//                   console.log(datarecharge.message);
//                   console.log('---Verify Credit Card Transaction--Line-14'); 
                  
//                   if(datarecharge.status_id.toString()=="1"){
//                     console.log('---Verify Credit Card Transaction--Line-15');
//                     console.log(result["recordset"][0].userid);
//                     console.log(result["recordset"][0].uniqueid);
//                     console.log(datarecharge.utr);
//                     console.log(datarecharge.message);
//                     console.log('---Verify Credit Card Transaction--Line-16');
//                     const returnrecharge = await update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'success',datarecharge.utr,datarecharge.message,'direct')
//                     console.log('---Verify Credit Card Transaction--Line-17');
//                     console.log(returnrecharge[0].transactionsID);    
//                     console.log(returnrecharge[0].serviceprovider);  
//                     console.log(returnrecharge[0].paidtype);  
//                     console.log(returnrecharge[0].mobilenumber);  
//                     console.log(returnrecharge[0].amount);  
//                     console.log(returnrecharge[0].Message);  
// 					console.log(returnrecharge[0].rechargemobileno);   
//                     console.log('---Verify Credit Card Transaction--Line-18');

//                     res.json({
//                       status:"success",
//                       paytype:'direct_payment',    
//                       redirect:'success',
//                       transactionsID:returnrecharge[0].transactionsID,
//                       serviceprovider:returnrecharge[0].serviceprovider,
//                       paidtype:returnrecharge[0].paidtype,
//                       mobilenumber:returnrecharge[0].mobilenumber,
//                       amount:returnrecharge[0].amount,
//                       msg:datarecharge.message, 
// 					  rechargemobileno:returnrecharge[0].rechargemobileno,					  
//                     });  

//                   }
//                   else if(datarecharge.status_id.toString()=="3"){

//                     console.log('---Verify Credit Card Transaction--Line-19');
//                     console.log(result["recordset"][0].userid);
// 					console.log(result["recordset"][0].uniqueid);
// 					console.log(datarecharge.utr);
// 					console.log(datarecharge.message);
// 					console.log('---Verify Credit Card Transaction--Line-20');
// 					const returnrecharge = await update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'success',datarecharge.utr,datarecharge.message,'direct')
// 					console.log('---Verify Credit Card Transaction--Line-21');
// 					console.log(returnrecharge[0].transactionsID);    
// 					console.log(returnrecharge[0].serviceprovider);  
// 					console.log(returnrecharge[0].paidtype);  
// 					console.log(returnrecharge[0].mobilenumber);  
// 					console.log(returnrecharge[0].amount);  
// 					console.log(returnrecharge[0].Message);  
// 					console.log(returnrecharge[0].rechargemobileno);   
// 					console.log('---Verify Credit Card Transaction--Line-22');

//                     res.json({
//                       status:"Pending",
//                       paytype:'direct_payment',    
//                       redirect:'success',
					 
					 
//                       transactionsID:returnrecharge[0].transactionsID,
//                       serviceprovider:returnrecharge[0].serviceprovider,
//                       paidtype:returnrecharge[0].paidtype,
//                       mobilenumber:returnrecharge[0].mobilenumber,
//                       amount:returnrecharge[0].amount,
//                       msg:datarecharge.message, 
// 					  rechargemobileno:returnrecharge[0].rechargemobileno,
					  

//                     });

//                   }
//                   else{

//                     console.log('---Verify Credit Card Transaction--Line-23');
//                     update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'failure',datarecharge.utr,datarecharge.message,'direct');
//                     console.log('---Verify Credit Card Transaction--Line-24');

//                     res.json({
//                       status:"failure",
//                       paytype:'direct_payment',    
//                       redirect:'success',
//                       transactionsID:'',
//                       serviceprovider:'',
//                       paidtype:"",
//                       mobilenumber:"",
//                       amount:"",
//                       message:datarecharge.message,    
//                     });

//                   } 

//                 }
//                 else{
                   
//                    console.log('---Verify Credit Card Transaction--Line-25');
//                    update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'failure',"","Minimum Recharge 10",'direct')
//                    console.log('---Verify Credit Card Transaction--Line-26');

//                    res.json({
//                     status:"failure",
//                                     paytype:'direct_payment',    
//                                     redirect:'success',
//                                     transactionsID:"",
//                                     serviceprovider:"",
//                                     paidtype:"",
//                                     mobilenumber:"",
//                                     amount:"",
//                                     msg:"Minimum Recharge 10",      
//                    });


//                 }
                

//                }

//             }
//        }


//     }
//     catch(ex){

//     }
//  });

// async function funcbillfetchpay_creditcard_Online(accountno,referenceid,amount,billerid,uniqueid,name,mobileno,token, paraname1, paraname2){
  
//     console.log('function Payment credit card line--1'); 
//     console.log(accountno); 
//     console.log(referenceid);
//     console.log(amount);
//     console.log(billerid); 
//     console.log(uniqueid); 
//     console.log(name);
//     console.log(mobileno); 
//     console.log(token); 
//     console.log(paraname1); 
//     console.log(paraname2); 
//     console.log('function Payment credit card line--2'); 


// 	var requestBody = JSON.stringify({"reference_id":referenceid,"amount":amount,"billerId":billerid,"mobile_number":mobileno,"client_id":uniqueid,"customerParams":[{"name":paraname1,"value":accountno},{"name":paraname2,"value":mobileno}]});
	
//   const response = await axios.post('https://erp.pay2all.in/api/bbps/payment', requestBody, {
// 		  headers: {
// 			'Content-Type': 'application/json',
// 		  'Authorization': `Bearer ${token}`
// 		}
// 	 });


// 	// let jsonData = 
// 	//  {
// 	 //    "status_id": "2",
// 	 //    "balance": "100",
// 	 //    "order_id": "5988775",
// 	//	"utr": "",
// 	// 	"report_id": "",
// 	//   "message": "failure",
// 	//   }
// 	// ;
// 	// const data = jsonData;
	
//     const data = response.data;
	
//     console.log('API Response:', data);
//     return data;


// }

// router.post("/billfetch_creditcard_payment_wallet", async  function(request, response){


//     try
//     {               

//        console.log('Credit Card Payment wallet line 1');

//       const getdatabalance= await getbalance(request.body.userid);
//       console.log(getdatabalance.MSG);
//       console.log(getdatabalance.Balance);
//        console.log('Credit Card Payment wallet line 2');
//      //if(parseFloat(getdatabalance.Balance) >= parseFloat(request.body.amount))
//      // {
		  
// 		const updateprice =  await update_custom_payment_wallet(request.body.userid,request.body.uniqueid,request.body.amount);
			 
// 			   console.log(updateprice.MSG);
			   
// 		   console.log('Credit Card Payment wallet line 3-----');
// 		   console.log(request.body.accountno);
// 		   console.log(request.body.referenceid);
// 		   console.log(request.body.amount);
// 			 console.log(request.body.billerid);
// 			 console.log(request.body.uniqueid);
// 			 console.log(request.body.name);
// 			 console.log(request.body.mobileno);
// 			 console.log(request.body.token);
// 			 console.log(request.body.Paraname1);
// 			 console.log(request.body.Paraname2);
// 			 console.log('Credit Card Payment wallet line 4');
    
//        const datapayreturn = await funcbillfetchpay_creditcard_wallet(request.body.accountno,request.body.referenceid,request.body.amount,request.body.billerid,request.body.uniqueid,request.body.name,request.body.mobileno,request.body.token,request.body.Paraname1,request.body.Paraname2);
    
// 		    console.log(datapayreturn.status_id);
//         console.log(datapayreturn.utr);
//         console.log(datapayreturn.message);
//         console.log(request.body.uniqueid);
//         console.log('Credit Card Payment wallet line 5');
		
// 		console.log(datapayreturn.status_id.toString());
     
//       if(datapayreturn.status_id.toString() =="1")
//       {
// 		  console.log('Credit Card Payment wallet line 6');
//           const returnrecharge = await update_transaction(request.body.userid,request.body.uniqueid,'success',datapayreturn.utr,datapayreturn.message,'wallet')
//           console.log('Credit Card Payment wallet line 7');
         
//           response.json({
//               status:"success",
//               transactionsID:returnrecharge[0].transactionsID,
//               serviceprovider:returnrecharge[0].serviceprovider,
//               paidtype:returnrecharge[0].paidtype,
//               mobilenumber:returnrecharge[0].mobilenumber,
//               accountno:returnrecharge[0].accountno,
//               amount:returnrecharge[0].amount,
//               message:returnrecharge[0].Message, 
//               rechargemobileno:returnrecharge[0].rechargemobileno,				            
//            });

//       }
// 	    else if(datapayreturn.status_id.toString() =="3")
//       {
// 		  console.log('Credit Card Payment wallet line 8');
//           const returnrecharge = await update_transaction(request.body.userid,request.body.uniqueid,'success',datapayreturn.utr,datapayreturn.message,'wallet')
//           console.log('Credit Card Payment wallet line 9');          
//           response.json({
//               status:"Pending",
//               transactionsID:returnrecharge[0].transactionsID,
//               serviceprovider:returnrecharge[0].serviceprovider,
//               paidtype:returnrecharge[0].paidtype,
//               mobilenumber:returnrecharge[0].mobilenumber,
//               accountno:returnrecharge[0].accountno,
//               amount:returnrecharge[0].amount,
//               message:'Transaction is in Queue',
//               rechargemobileno:returnrecharge[0].rechargemobileno,             
//            });
//       }
//       else{
// 		  console.log('Credit Card Payment wallet line 10');
// 		   console.log(request.body.userid);
// 		   console.log(request.body.uniqueid);
// 		   // console.log(datarecharge.utr);
// 		 //console.log(datarecharge.message);
// 		   console.log('Credit Card Payment wallet line 11');
//            update_transaction(request.body.userid,request.body.uniqueid,'failure',"","",'wallet')
//            console.log('Credit Card wallet line 12');
           
//            response.json({
//               status:"failure",
//                transactionsID:'',
//                 serviceprovider:'',
//                 paidtype:"",
//                 mobilenumber:"",
//                 amount:"",
//                 message:"failure",             
//             });

//       }

      
//    // }
//    // else{
//    //     response.json({
//    //                      status:"failure",
//    //                       msg:"Insufficient Balance",                  
//    //                    });

//    // }

//     } catch(error){





//     }
  
    
// });
// async function update_custom_payment_wallet(userid,transactionid,amount){

//     try{
// 			console.log('Credit Card update custom price update line 1');
//             const conn= await sql.connect(config);
//             const res =await conn.request()
//             .input("userid", userid)
// 			.input("transactionid", transactionid)
// 			.input("amount", amount)
//             .execute("USP_Update_Custum_Amount_Walletpay");
//             const data = res.recordset[0];
//              console.log('sp update:', data);
// 			 console.log('Credit Card update custom price update line 2');
//             return data;

//     }catch(error){
//         console.log(error);
//     }

// }
// async function funcbillfetchpay_creditcard_wallet(accountno,referenceid,amount,billerid,uniqueid,name,mobileno,token, paraname1, paraname2) {
  
  
//      console.log('Credit Card wallet pay line 1');
//       console.log(accountno);
//       console.log(referenceid);
//       console.log(amount);
// 	    console.log(billerid);
// 	    console.log(uniqueid);
// 	    console.log(name);
// 	    console.log(mobileno);
// 		  console.log(token);
// 		  console.log(paraname1);
// 		  console.log(paraname2);
// 		  console.log('Credit Card wallet pay line 2');
			
// 			var requestBody = JSON.stringify({"reference_id":referenceid,"amount":amount,"billerId":billerid,"mobile_number":mobileno,"client_id":uniqueid,"customerParams":[{"name":paraname1,"value":accountno},{"name":paraname2,"value":mobileno}]});
// 			const response = await axios.post('https://erp.pay2all.in/api/bbps/payment', requestBody, {
// 				  headers: {
// 					'Content-Type': 'application/json',
// 					'Authorization': `Bearer ${token}`
// 				  }
//     });


//     //let jsonData = 
// 	//  {
// 	//     "status_id": "3",
// 	//     "balance": "100",
// 	// 	"order_id": "5988775",
// 	// 	"utr": "",
// 	// 	"report_id": "",
// 	//    "message": "Quee",
// 	//   }
// 	// ;
// 	// const data = jsonData;

//     const data = response.data;
//     console.log('API Billpay Response:', data);
//     return data;


// }

// ///CREDIT CARD PART END








// ///INSURENCE PART START


// router.post("/initiate-payment-insurence", async  function(req, res){
// //app.post("/initiate-payment", async (req, res) => {
//   try {
    

// 	 console.log('INSURENCE Online Payment Line 1');
//     const {userid, txnid, amount, productinfo, firstname, email, phone} = req.body;
   
   
//     console.log('INSURENCE Online Payment Line 2');
//     console.log(req.body.userid);
//     console.log(req.body.txnid);
//     console.log(req.body.amount);
//     console.log(req.body.productinfo);
//     console.log(req.body.firstname);
//     console.log(req.body.email);
//     console.log(req.body.phone);



//     console.log(req.body.sessionuserid);
//     console.log(req.body.accountno);
//     console.log(req.body.amount);
//     console.log(req.body.paidtype);
//     console.log(req.body.provideid);
//     console.log(req.body.serviceprovidername);
//     console.log(req.body.uniqueid);
      
//      console.log('INSURENCE Online Payment Line 3');
   
//     console.log(req.body.mobileno);
//     console.log(req.body.token);
//     console.log(req.body.category);
//     console.log(req.body.ip);



    

//     let data = {
//       isAmountFilledByCustomer: false,
//       txnid,
//       amount,
//       currency: "INR",
//       productinfo,
//       firstname,
//       email,
//       phone,
//       surl: `https://www.moniespay.com/verifypayuInsurence/${txnid}`,
//       furl: `https://www.moniespay.com/verifypayuInsurence/${txnid}`,
//     };


//       console.log('INSURENCE Online Payment Line 4');
//     const hashString = `${process.env.MERCHANT_KEY}|${data.txnid}|${data.amount}|${data.productinfo}|${data.firstname}|${data.email}|||||||||||${process.env.MERCHANT_SALT}`;
//     const hash = crypto.createHash("sha512").update(hashString).digest("hex");
//     data.hash = hash;
//     console.log(hash)

   
   
    
// 		 console.log('INSURENCE Online Payment Line 5');
// 		  console.log(userid);
// 		 console.log(req.body.uniqueid);
// 		  console.log('INSURENCE Online Payment Line 6');
// 		updateaddmoney_transaction(userid,txnid,amount,productinfo,req.body.email,req.body.phone,req.body.firstname,req.body.uniqueid);
    
    

     
    

//     let response = await payuClient.paymentInitiate(data);
//     console.log(response);
//       res.json(response);
//     //res.send(response);
//   } catch (error) {
//     console.error("Error initiating payment:", error);
//     res.status(500).send(error);
//   }
// });

//  router.get("/verifyinsurence/:id", async  function(req, res)
//  {
//     try{

//        console.log('---Verify INSURENCE Transaction--Line-1');
//        console.log(req.params.id)
//        const data = await payuClient.verifyPayment(req.params.id);
//        const status = data.transaction_details[req.params.id];
//        console.log(status);
//        console.log(status.status);
//        console.log(status.transaction_amount);
//        console.log(status.error_Message);
//        console.log('---Verify INSURENCE Transaction--Line-2');

//        if (status.status === "success") {
//             console.log('---Verify INSURENCE Transaction--Line-3');
//             const conn= await sql.connect(config);
//             const result =await conn.request()
//            .input("Tranid", req.params.id)
//            .execute("USP_getPaymode");
//             const data = result["recordset"];
//             console.log(' Response:', data);
//             console.log(data.paytype);
//             console.log(result["recordset"][0].paytype);
//             console.log('---category---');
//             console.log(result["recordset"][0].Name);
//             console.log('---Verify INSURENCE Transaction--Line-4');
//             console.log(result["recordset"][0].token);
		   
//             const getpay2all_balance = await getpay2allprofile(result["recordset"][0].token);
//             console.log('---Verify INSURENCE Transaction--Line-6');
//             console.log(getpay2all_balance.data.balance.user_balance);			
//             console.log('---Verify INSURENCE Transaction--Line-7');
//             console.log(result["recordset"][0].category);
//             console.log('---Verify INSURENCE Transaction--Line-8');
            
//             if(result["recordset"][0].category=="Insurance"){

//                const getdatabalance= await getbalance(result["recordset"][0].userid);
//                console.log(getdatabalance.MSG);
//                console.log(getdatabalance.Balance);
//                console.log(getpay2all_balance.data.balance.user_balance);
//                console.log(parseFloat(getpay2all_balance.data.balance.user_balance));
//                console.log(parseFloat(result["recordset"][0].amount));
//                console.log('---Verify INSURENCE Transaction--Line-10');

//                if(parseFloat(getpay2all_balance.data.balance.user_balance) >= parseFloat(result["recordset"][0].amount)){
//                 console.log(result["recordset"][0].accountno);
//                 console.log(result["recordset"][0].provideid);
//                 console.log(result["recordset"][0].amount);
//                 console.log(result["recordset"][0].uniqueid);
//                 console.log(result["recordset"][0].mobileno);
//                 console.log(result["recordset"][0].token);
//                 console.log(result["recordset"][0].parameter1);
//                 console.log(result["recordset"][0].parameter2);
//                 console.log(result["recordset"][0].parameter3);
//                 console.log('---Verify INSURENCE Transaction--Line-11');

//                 if(result["recordset"][0].amount >=10){
//                   console.log('---Verify INSURENCE Transaction--Line-12');
//                   const datarecharge = await funcbillfetchpay_insurence_Online(result["recordset"][0].accountno,result["recordset"][0].ReferenceID,result["recordset"][0].amount,result["recordset"][0].provideid,result["recordset"][0].uniqueid,result["recordset"][0].Name,result["recordset"][0].mobileno,result["recordset"][0].token,result["recordset"][0].parameter1,result["recordset"][0].parameter2,result["recordset"][0].parameter3);
//                   console.log('---Verify INSURENCE Transaction--Line-13');
//                   console.log(datarecharge.status_id);
//                   console.log(datarecharge.balance);
//                   console.log(datarecharge.order_id);
//                   console.log(datarecharge.utr);
//                   console.log(datarecharge.report_id);
//                   console.log(datarecharge.message);
//                   console.log('---Verify INSURENCE Transaction--Line-14'); 
                  
//                   if(datarecharge.status_id.toString()=="1"){
//                     console.log('---Verify INSURENCE Transaction--Line-15');
//                     console.log(result["recordset"][0].userid);
//                     console.log(result["recordset"][0].uniqueid);
//                     console.log(datarecharge.utr);
//                     console.log(datarecharge.message);
//                     console.log('---Verify INSURENCE Transaction--Line-16');
//                     const returnrecharge = await update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'success',datarecharge.utr,datarecharge.message,'direct')
//                     console.log('---Verify INSURENCE Transaction--Line-17');
//                     console.log(returnrecharge[0].transactionsID);    
//                     console.log(returnrecharge[0].serviceprovider);  
//                     console.log(returnrecharge[0].paidtype);  
//                     console.log(returnrecharge[0].mobilenumber);  
//                     console.log(returnrecharge[0].amount);  
//                     console.log(returnrecharge[0].Message);  
// 					          console.log(returnrecharge[0].rechargemobileno);   
//                     console.log('---Verify INSURENCE Transaction--Line-18');

//                     res.json({
//                       status:"success",
//                       paytype:'direct_payment',    
//                       redirect:'success',
//                       transactionsID:returnrecharge[0].transactionsID,
//                       serviceprovider:returnrecharge[0].serviceprovider,
//                       paidtype:returnrecharge[0].paidtype,
//                       mobilenumber:returnrecharge[0].mobilenumber,
//                       amount:returnrecharge[0].amount,
//                       msg:datarecharge.message, 
// 					            rechargemobileno:returnrecharge[0].rechargemobileno,					  
//                     });  

//                   }
//                   else if(datarecharge.status_id.toString()=="3"){

//                     console.log('---Verify INSURENCE Transaction--Line-19');
//                     console.log(result["recordset"][0].userid);
//                     console.log(result["recordset"][0].uniqueid);
//                     console.log(datarecharge.utr);
//                     console.log(datarecharge.message);
//                     console.log('---Verify INSURENCE Transaction--Line-20');
//                     const returnrecharge = await update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'success',datarecharge.utr,datarecharge.message,'direct')
//                     console.log('---Verify INSURENCE Transaction--Line-21');
//                     console.log(returnrecharge[0].transactionsID);    
//                     console.log(returnrecharge[0].serviceprovider);  
//                     console.log(returnrecharge[0].paidtype);  
//                     console.log(returnrecharge[0].mobilenumber);  
//                     console.log(returnrecharge[0].amount);  
//                     console.log(returnrecharge[0].Message);  
//                     console.log(returnrecharge[0].rechargemobileno);   
//                     console.log('---Verify INSURENCE Transaction--Line-22');

//                     res.json({
//                       status:"Pending",
//                       paytype:'direct_payment',    
//                       redirect:'success',
					 
					 
//                       transactionsID:returnrecharge[0].transactionsID,
//                       serviceprovider:returnrecharge[0].serviceprovider,
//                       paidtype:returnrecharge[0].paidtype,
//                       mobilenumber:returnrecharge[0].mobilenumber,
//                       amount:returnrecharge[0].amount,
//                       msg:datarecharge.message, 
// 					            rechargemobileno:returnrecharge[0].rechargemobileno,
					  

//                     });

//                   }
//                   else{

//                     console.log('---Verify INSURENCE Transaction--Line-23');
//                     update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'failure',datarecharge.utr,datarecharge.message,'direct');
//                     console.log('---Verify INSURENCE Transaction--Line-24');

//                     res.json({
//                       status:"failure",
//                       paytype:'direct_payment',    
//                       redirect:'success',
//                       transactionsID:'',
//                       serviceprovider:'',
//                       paidtype:"",
//                       mobilenumber:"",
//                       amount:"",
//                       message:datarecharge.message,    
//                     });

//                   } 

//                 }
//                 else{
                   
//                    console.log('---Verify INSURENCE Transaction--Line-25');
//                    update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'failure',"","Minimum Recharge 10",'direct')
//                    console.log('---Verify INSURENCE Transaction--Line-26');

//                    res.json({
//                     status:"failure",
//                                     paytype:'direct_payment',    
//                                     redirect:'success',
//                                     transactionsID:"",
//                                     serviceprovider:"",
//                                     paidtype:"",
//                                     mobilenumber:"",
//                                     amount:"",
//                                     msg:"Minimum Recharge 10",      
//                    });


//                 }
                

//                }

//             }
//        }


//     }
//     catch(ex){

//     }
//  });

// async function funcbillfetchpay_insurence_Online(accountno,referenceid,amount,billerid,uniqueid,name,mobileno,token, paraname1, paraname2, paraname3){
  
//     console.log('function Payment INSURENCE line--1'); 
//     console.log(accountno); 
//     console.log(referenceid);
//     console.log(amount);
//     console.log(billerid); 
//     console.log(uniqueid); 
//     console.log(name);
//     console.log(mobileno); 
//     console.log(token); 
//     console.log(paraname1); 
//     console.log(paraname2); 
//     console.log(paraname3); 
//     console.log('function Payment INSURENCE line--2'); 


// 	//var requestBody = JSON.stringify({"reference_id":referenceid,"amount":amount,"billerId":billerid,"mobile_number":mobileno,"client_id":uniqueid,"customerParams":[{"name":paraname1,"value":accountno},{"name":paraname2,"value":mobileno},{"name":paraname3,"value":mobileno}]});
	
// 	//const response = await axios.post('https://erp.pay2all.in/api/bbps/payment', requestBody, {
// 	//	  headers: {
// 	//		'Content-Type': 'application/json',
// 	//	  'Authorization': `Bearer ${token}`
// 	//	}
// 	// });


// 	 let jsonData = 
// 	  {
// 	     "status_id": "2",
// 	     "balance": "100",
// 	     "order_id": "5988775",
// 		"utr": "",
// 	 	"report_id": "",
// 	   "message": "failure",
// 	   }
// 	 ;
// 	 const data = jsonData;
	
//   //  const data = response.data;
	
//     console.log('API Response:', data);
//     return data;


// }

// router.post("/billfetch_insurence_payment_wallet", async  function(request, response){


//     try
//     {               

//        console.log('INSURENCE Payment wallet line 1');

//       const getdatabalance= await getbalance(request.body.userid);
//       console.log(getdatabalance.MSG);
//       console.log(getdatabalance.Balance);
//        console.log('INSURENCE Payment wallet line 2');
//      //if(parseFloat(getdatabalance.Balance) >= parseFloat(request.body.amount))
//      // {
		  
// 	  	const updateprice =  await update_custom_payment_wallet(request.body.userid,request.body.uniqueid,request.body.amount);
			 
// 			   console.log(updateprice.MSG);
			   
// 		   console.log('INSURENCE Payment wallet line 3-----');
// 		   console.log(request.body.accountno);
// 		   console.log(request.body.referenceid);
// 		   console.log(request.body.amount);
// 			 console.log(request.body.billerid);
// 			 console.log(request.body.uniqueid);
// 			 console.log(request.body.name);
// 			 console.log(request.body.mobileno);
// 			 console.log(request.body.token);
// 			 console.log(request.body.Paraname1);
// 			 console.log(request.body.Paraname2);
//        console.log(request.body.Paraname3);
// 			 console.log('INSURENCE Payment wallet line 4');
    
//        const datapayreturn = await funcbillfetchpay_insurence_wallet(request.body.accountno,request.body.referenceid,request.body.amount,request.body.billerid,request.body.uniqueid,request.body.name,request.body.mobileno,request.body.token,request.body.Paraname1,request.body.Paraname2,request.body.Paraname3);
    
// 		    console.log(datapayreturn.status_id);
//         console.log(datapayreturn.utr);
//         console.log(datapayreturn.message);
//         console.log(request.body.uniqueid);
//         console.log('INSURENCE Payment wallet line 5');
// 		    console.log(datapayreturn.status_id.toString());
     
//       if(datapayreturn.status_id.toString() =="1")
//       {
// 		      console.log('INSURENCE Payment wallet line 6');
//           const returnrecharge = await update_transaction(request.body.userid,request.body.uniqueid,'success',datapayreturn.utr,datapayreturn.message,'wallet')
//           console.log('INSURENCE Payment wallet line 7');
         
//           response.json({
//               status:"success",
//               transactionsID:returnrecharge[0].transactionsID,
//               serviceprovider:returnrecharge[0].serviceprovider,
//               paidtype:returnrecharge[0].paidtype,
//               mobilenumber:returnrecharge[0].mobilenumber,
//               accountno:returnrecharge[0].accountno,
//               amount:returnrecharge[0].amount,
//               message:returnrecharge[0].Message, 
//               rechargemobileno:returnrecharge[0].rechargemobileno,				            
//            });

//       }
// 	    else if(datapayreturn.status_id.toString() =="3")
//       {
// 		      console.log('INSURENCE Payment wallet line 8');
//           const returnrecharge = await update_transaction(request.body.userid,request.body.uniqueid,'success',datapayreturn.utr,datapayreturn.message,'wallet')
//           console.log('INSURENCE Payment wallet line 9');          
//           response.json({
//               status:"Pending",
//               transactionsID:returnrecharge[0].transactionsID,
//               serviceprovider:returnrecharge[0].serviceprovider,
//               paidtype:returnrecharge[0].paidtype,
//               mobilenumber:returnrecharge[0].mobilenumber,
//               accountno:returnrecharge[0].accountno,
//               amount:returnrecharge[0].amount,
//               message:'Transaction is in Queue',
//               rechargemobileno:returnrecharge[0].rechargemobileno,             
//            });
//       }
//       else{
// 		   console.log('INSURENCE Payment wallet line 10');
// 		   console.log(request.body.userid);
// 		   console.log(request.body.uniqueid);
// 		   // console.log(datarecharge.utr);
// 		   //console.log(datarecharge.message);
// 		   console.log('INSURENCE Payment wallet line 11');
//            update_transaction(request.body.userid,request.body.uniqueid,'failure',"","",'wallet')
//            console.log('INSURENCE wallet line 12');
           
//            response.json({
//               status:"failure",
//                transactionsID:'',
//                 serviceprovider:'',
//                 paidtype:"",
//                 mobilenumber:"",
//                 amount:"",
//                 message:"failure",             
//             });

//       }

      
//    // }
//    // else{
//    //     response.json({
//    //                      status:"failure",
//    //                       msg:"Insufficient Balance",                  
//    //                    });

//    // }

//     } catch(error){





//     }
  
    
// });
// async function update_custom_payment_wallet(userid,transactionid,amount){

//     try{
// 			      console.log('INSURENCE update custom price update line 1');
//             const conn= await sql.connect(config);
//             const res =await conn.request()
//             .input("userid", userid)
// 			      .input("transactionid", transactionid)
// 		      	.input("amount", amount)
//             .execute("USP_Update_Custum_Amount_Walletpay");
//             const data = res.recordset[0];
//              console.log('sp update:', data);
// 			      console.log('INSURENCE update custom price update line 2');
//             return data;

//     }catch(error){
//         console.log(error);
//     }

// }

// async function funcbillfetchpay_insurence_wallet(accountno,referenceid,amount,billerid,uniqueid,name,mobileno,token, paraname1, paraname2, paraname3) {
  
  
//      console.log('INSURENCE wallet pay line 1');
//       console.log(accountno);
//       console.log(referenceid);
//       console.log(amount);
// 	    console.log(billerid);
// 	    console.log(uniqueid);
// 	    console.log(name);
// 	    console.log(mobileno);
// 		  console.log(token);
// 		  console.log(paraname1);
// 		  console.log(paraname2);
//        console.log(paraname3);
// 		  console.log('INSURENCE wallet pay line 2');
			
// 		//	var requestBody = JSON.stringify({"reference_id":referenceid,"amount":amount,"billerId":billerid,"mobile_number":mobileno,"client_id":uniqueid,"customerParams":[{"name":paraname1,"value":accountno},{"name":paraname2,"value":mobileno},{"name":paraname3,"value":mobileno}]});
// 		//	const response = await axios.post('https://erp.pay2all.in/api/bbps/payment', requestBody, {
// 		//		  headers: {
// 		//			'Content-Type': 'application/json',
// 		//			'Authorization': `Bearer ${token}`
// 		//		  }
//     //});


//     let jsonData = 
// 	  {
// 	     "status_id": "3",
// 	     "balance": "100",
// 	 	"order_id": "5988775",
// 	 	"utr": "",
// 	 	"report_id": "",
// 	    "message": "Quee",
// 	   }
// 	 ;
// 	 const data = jsonData;

//   //  const data = response.data;
//     console.log('API Billpay Response:', data);
//     return data;


// }


// //INSURENCE PART END






//  router.get("/verifypayudeposit/:id", async  function(req, res){
//   try {


//     console.log('---verify payment fetch---');
//      console.log(req.params.id)
//     const data = await payuClient.verifyPayment(req.params.id);
//     const status = data.transaction_details[req.params.id];
// 	   console.log(status);
// 	   console.log(status.status);
//      console.log(status.transaction_amount);
    
// 	   console.log(status.error_Message);
//      console.log('---v---');
//     if (status.status === "success") 
//       {


      
        
//                           const conn= await sql.connect(config);
//                           const result =await conn.request()
//                           .input("Tranid", req.params.id)
//                           .input("status", status.status)
//                           .input("amount", status.transaction_amount)
                        

//                           .execute("USP_UpdateSuccessTransaction");
//                           const data = result["recordset"];
//                            console.log(' Response:', data);
                          
//                             console.log(result["recordset"][0].paytype);


//                           res.json({
//                                       status:"success",
//                                       paytype:'deposit',    
//                                       redirect:'success',
//                                       amount:status.transaction_amount,
//                                       mobilenumber:'',
//                                       serviceprovider:'',
//                                       transactionsID:'',
//                                       msg:"success",      
                                                                
//                                 });


                


//       } 
//         else
          
//           {
      
//             console.log('---failure or cancel payment---')
       
       
            



//            //#region cancel entry tn database
//               console.log(req.params.id);
//               console.log(status.status);
//               console.log(status.error_Message);


//             const conn= await sql.connect(config);
//             const result =await conn.request()



            
//             .input("Tranid", req.params.id)
//             .input("status", status.status)
//             .input("message", status.error_Message)
           

//             .execute("USP_Updatecancel");
//              const data = result["recordset"];
//                 console.log(' Response:', data);
//               console.log(data.paytype);
//               console.log(result["recordset"][0].paytype);

              
//                           res.json({
//                                       status:"failure",
//                                       paytype:'deposit',    
//                                       redirect:'failed',
//                                       amount:status.transaction_amount,
//                                       mobilenumber:'',
//                                       serviceprovider:'',
//                                       transactionsID:'',
//                                       msg:"failure",      
                                                                
//                                 });
//              //#endregion cancel payment
            
             



      

//     }
//   } catch (error) {
//      console.log('---44---')
//     console.error("Error verifying payment:", error);
//     res.status(500).send(error);
//   }



// });



// //  router.get("/verify/:id", async  function(req, res){
// // //app.get("/verify/:id", async (req, res) => {
// //   try {

// //     console.log('---verify payment fetch---');
// //      console.log(req.params.id)
// //     const data = await payuClient.verifyPayment(req.params.id);
// //     const status = data.transaction_details[req.params.id];
// // 	   console.log(status);
// // 	   console.log(status.status);
// //      console.log(status.transaction_amount);
    
// // 	   console.log(status.error_Message);
// //      console.log('---v---');
// //     if (status.status === "success") 
// //       {










// //              const conn= await sql.connect(config);
// //             const result =await conn.request()
 
// //             .input("Tranid", req.params.id)
           

// //             .execute("USP_getPaymode");
// //              const data = result["recordset"];
// //                 console.log(' Response:', data);
// //               console.log(data.paytype);
// //               console.log(result["recordset"][0].paytype);
// //                  console.log('---category---');
// //                console.log(result["recordset"][0].Name);
			   
			   
			   
			   
			

// //               if(result["recordset"][0].paytype =="direct_payment")
// //               {
				  
				  
// // 				  console.log('---Payment success return with pay2all balance get--Start****1---');
// // 			console.log(result["recordset"][0].token);
// // 			const getpay2all_balance = await getpay2allprofile(result["recordset"][0].token);
// // 			console.log('---Payment success return with pay2all balance get--Start****2---');
// // 			console.log(getpay2all_balance.data.balance.user_balance);			
// // 			console.log('---Payment success return with pay2all balance get--Start****3		---');
		
			   
			   
// // 			  console.log('---Payment success return with pay2all balance get--Start****4---');

// //                    console.log('---Direct pay 1---');
// // 				    console.log(result["recordset"][0].category);
// // 					console.log('---Payment success return with pay2all balance get--Start****5---');

// //                  if(result["recordset"][0].category=="mobile")
// //                  {
                  
                   
// //                   const getdatabalance= await getbalance(result["recordset"][0].userid);
// //                     console.log(getdatabalance.MSG);
// //                     console.log(getdatabalance.Balance);

// //                   if(parseFloat(getpay2all_balance.data.balance.user_balance) >= parseFloat(result["recordset"][0].amount))
// //                     {

// //                       console.log('---Mobile  1---');
// //                       //mobile recharge
// //                       console.log(result["recordset"][0].accountno);
// //                       console.log(result["recordset"][0].provideid);
// //                       console.log(result["recordset"][0].amount);
// //                       console.log(result["recordset"][0].uniqueid);
// //                       console.log(result["recordset"][0].mobileno);
// //                         console.log(result["recordset"][0].token);

                    
// //                         console.log('---Mobile  2 ---');

// //                         if(result["recordset"][0].amount >=10)
// //                         {

// //                               const datarecharge = await funcmobilerecharge(result["recordset"][0].accountno,result["recordset"][0].provideid,result["recordset"][0].amount,result["recordset"][0].uniqueid,result["recordset"][0].mobileno,result["recordset"][0].token); 
// //                                 console.log('---Mobile  result 2---');
// //                             console.log(datarecharge.status_id);
// //                               console.log(datarecharge.balance);
// //                               console.log(datarecharge.order_id);
// //                               console.log(datarecharge.utr);
// //                               console.log(datarecharge.report_id);
// //                             console.log(datarecharge.message);
// //                               console.log('---Mobile  result 3---');
                    
                
// //                               if(datarecharge.status_id.toString()=="1")
// //                                 {
// //                                   console.log('Update Mobile Recharge Trasaction----1');
// //                                   console.log(result["recordset"][0].userid);
// //                                   console.log(result["recordset"][0].uniqueid);
// //                                   console.log(datarecharge.utr);
// //                                   console.log(datarecharge.message);
                          
// //                                   console.log('Update Mobile Recharge Trasaction----2');
// //                                   const returnrecharge = await update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'success',datarecharge.utr,datarecharge.message,'direct')
// //                                   console.log('Update Mobile Recharge Trasaction----3');
// //                                   console.log(returnrecharge[0].transactionsID);    
// //                                   console.log(returnrecharge[0].serviceprovider);  
// //                                   console.log(returnrecharge[0].paidtype);  
// //                                   console.log(returnrecharge[0].mobilenumber);  
// //                                   console.log(returnrecharge[0].amount);  
// //                                   console.log(returnrecharge[0].Message);  
// //                                   console.log('Update Mobile Recharge Trasaction----4');
                                          
// //                                         res.json({
// //                                             status:"success",
// //                                             paytype:'direct_payment',    
// //                                             redirect:'success',
                                            
// //                                             transactionsID:returnrecharge[0].transactionsID,
// //                                             serviceprovider:returnrecharge[0].serviceprovider,
// //                                             paidtype:returnrecharge[0].paidtype,
// //                                             mobilenumber:returnrecharge[0].mobilenumber,
// //                                             amount:returnrecharge[0].amount,
// //                                             msg:returnrecharge[0].Message,      
                                                                      
// //                                       });
                              
// //                                 }
// //                                 else
// //                                 {
// //                                       console.log('Update Mobile Recharge Trasaction----6');
// //                                       update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'failure',datarecharge.utr,datarecharge.message,'direct')
// //                                       console.log('Update Mobile Recharge Trasaction----7');
                                  



// //                                           res.json({
// //                                               status:"failure",
// //                                               paytype:'direct_payment',    
// //                                               redirect:'success',
                                              
// //                                               transactionsID:'',
// //                                               serviceprovider:'',
// //                                               paidtype:"",
// //                                               mobilenumber:"",
// //                                               amount:"",
// //                                               msg:datarecharge.message,      
                                                                        
// //                                         });

// //                                 }

// //                         }
// //                         else
// //                           {





// //                           console.log('Update Mobile Recharge Trasaction----6');
// //                           update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'failure',"","Minimum Recharge 10",'direct')
// //                           console.log('Update Mobile Recharge Trasaction----7');
                      



// //                               res.json({
// //                                   status:"failure",
// //                                   paytype:'direct_payment',    
// //                                   redirect:'success',
                                  
// //                                   transactionsID:"",
// //                                   serviceprovider:"",
// //                                   paidtype:"",
// //                                   mobilenumber:"",
// //                                   amount:"",
// //                                   msg:"Minimum Recharge 10",      
                                                            
// //                             });




// //                         }

// //                     }
// //                   else{
                             

                              
// //                             res.json({
// //                                 status:"failure",
// //                                 paytype:'direct_payment',    
// //                                 redirect:'success',
                                
// //                                 transactionsID:"",
// //                                 serviceprovider:"",
// //                                 paidtype:"",
// //                                 mobilenumber:"",
// //                                 amount:"",
// //                                 msg:"Insufficient Balance",      
                                                          
// //                           });

// //                       }
// //                      //end






// //                  }
// //                  else if(result["recordset"][0].category=="DTH")
// //                  {



// //                    console.log('---DTH  1---');


// //                      //DTH recharge

// //                     console.log(result["recordset"][0].userid);
// //                     console.log(result["recordset"][0].accountno);
// //                     console.log(result["recordset"][0].provideid);
// //                      console.log(result["recordset"][0].amount);
// //                     console.log(result["recordset"][0].uniqueid);
// //                      console.log(result["recordset"][0].mobileno);
// //                       console.log(result["recordset"][0].token);

// //                          const getdatabalance= await getbalance(result["recordset"][0].userid);
// //                         console.log(getdatabalance.MSG);
// //                         console.log(getdatabalance.Balance);

// //                       if(parseFloat(getpay2all_balance.data.balance.user_balance) >= parseFloat(result["recordset"][0].amount))
// //                         {
                  
// //                       console.log('---DTH  2 ---');

// //                       if(result["recordset"][0].amount >=10)
// //                       {


// //                            console.log(result["recordset"][0].accountno);
// //                              console.log(result["recordset"][0].provideid);
// //                              console.log(result["recordset"][0].amount);
// //                               console.log(result["recordset"][0].uniqueid);
// //                                console.log(result["recordset"][0].mobileno);
// //                                 console.log(result["recordset"][0].token);
// //  console.log('---DTH  2 end ---');

// //                             const datarecharge = await funcmobilerecharge(result["recordset"][0].accountno,result["recordset"][0].provideid,result["recordset"][0].amount,result["recordset"][0].uniqueid,result["recordset"][0].mobileno,result["recordset"][0].token); 
// //                               console.log('---DTH  result 2---');
// //                           console.log(datarecharge.status_id);
// //                             console.log(datarecharge.balance);
// //                             console.log(datarecharge.order_id);
// //                             console.log(datarecharge.utr);
// //                             console.log(datarecharge.report_id);
// //                           console.log(datarecharge.message);
// //                             console.log('---DTH  result 3---');
                   
               
// //                              if(datarecharge.status_id.toString()=="1")
// //                               {
// //                                 console.log('Update DTH Recharge Trasaction----1');
// //                                 console.log(result["recordset"][0].userid);
// //                                 console.log(result["recordset"][0].uniqueid);
// //                                 console.log(datarecharge.utr);
// //                                 console.log(datarecharge.message);
                        
// //                                 console.log('Update DTH Recharge Trasaction----2');
// //                                 const returnrecharge = await update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'success',datarecharge.utr,datarecharge.message,'direct')
// //                                 console.log('Update DTH Recharge Trasaction----3');
// //                                 console.log(returnrecharge[0].transactionsID);    
// //                                 console.log(returnrecharge[0].serviceprovider);  
// //                                 console.log(returnrecharge[0].paidtype);  
// //                                 console.log(returnrecharge[0].mobilenumber);  
// //                                 console.log(returnrecharge[0].amount);  
// //                                 console.log(returnrecharge[0].Message);  
// //                                 console.log('Update DTH Recharge Trasaction----4');
                                        
// //                                       res.json({
// //                                           status:"success",
// //                                           paytype:'direct_payment',    
// //                                           redirect:'success',
                                          
// //                                           transactionsID:returnrecharge[0].transactionsID,
// //                                           serviceprovider:returnrecharge[0].serviceprovider,
// //                                           paidtype:returnrecharge[0].paidtype,
// //                                           mobilenumber:returnrecharge[0].mobilenumber,
// //                                           amount:returnrecharge[0].amount,
// //                                           msg:returnrecharge[0].Message,      
                                                                    
// //                                     });
                            
// //                               }
// //                               else
// //                               {
// //                                     console.log('Update DTH Recharge Trasaction----6');
// //                                     update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'failure',datarecharge.utr,datarecharge.message,'direct')
// //                                     console.log('Update DTH Recharge Trasaction----7');
                                



// //                                         res.json({
// //                                             status:"failure",
// //                                             paytype:'direct_payment',    
// //                                             redirect:'success',
                                            
// //                                             transactionsID:'',
// //                                             serviceprovider:'',
// //                                             paidtype:"",
// //                                             mobilenumber:"",
// //                                             amount:"",
// //                                             msg:datarecharge.message,      
                                                                      
// //                                       });

// //                               }

// //                       }
// //                       else
// //                         {





// //                          console.log('Update DTH Recharge Trasaction----6');
// //                          update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'failure',"","Minimum Recharge 10",'direct')
// //                          console.log('Update DTH Recharge Trasaction----7');
                     



// //                             res.json({
// //                                 status:"failure",
// //                                 paytype:'direct_payment',    
// //                                 redirect:'success',
                                
// //                                 transactionsID:"",
// //                                 serviceprovider:"",
// //                                 paidtype:"",
// //                                 mobilenumber:"",
// //                                 amount:"",
// //                                 msg:"Minimum Recharge 10",      
                                                          
// //                           });




// //                       }

// //                     }
// //                     else{
                             

                              
// //                             res.json({
// //                                 status:"failure",
// //                                 paytype:'direct_payment',    
// //                                redirect:'success',
                                
// //                                 transactionsID:"",
// //                                serviceprovider:"",
// //                                paidtype:"",
// //                                 mobilenumber:"",
// //                                 amount:"",
// //                                 msg:"Insufficient Balance",      
                                                          
// //                           });

// //                       }

// //                      //end





// //                  }
// //                   else if(result["recordset"][0].category=="electricity")
// //                  {



// //                    console.log('---Electricity  1---');
// //                      //Electricity payment

// //                          const getdatabalance= await getbalance(result["recordset"][0].userid);
// //                         console.log(getdatabalance.MSG);
// //                         console.log(getdatabalance.Balance);
// // 						 console.log(result["recordset"][0].amount);

// //                       if(parseFloat(getpay2all_balance.data.balance.user_balance) >= parseFloat(result["recordset"][0].amount))
// //                         {
                 
// //                           console.log(result["recordset"][0].accountno);
// //                           console.log(result["recordset"][0].provideid);
// //                           console.log(result["recordset"][0].amount);
// //                           console.log(result["recordset"][0].uniqueid);
// //                           console.log(result["recordset"][0].mobileno);
// //                             console.log(result["recordset"][0].token);

                  
// //                            console.log('---Electricity  2 ---');

// //                           if(result["recordset"][0].amount >=10)
// //                           {

// //                                 const datarecharge = await funcbillfetchpay(result["recordset"][0].accountno,result["recordset"][0].ReferenceID,result["recordset"][0].amount,result["recordset"][0].provideid,result["recordset"][0].uniqueid,result["recordset"][0].Name,result["recordset"][0].mobileno,result["recordset"][0].token);
                                                                         
    
// //                                 console.log('---Electricity  result 2---');
// //                               console.log(datarecharge.status_id);
// //                                 console.log(datarecharge.balance);
// //                                 console.log(datarecharge.order_id);
// //                                 console.log(datarecharge.utr);
// //                                 console.log(datarecharge.report_id);
// //                               console.log(datarecharge.message);
// //                                 console.log('---Electricity  result 3---');
                      
                  
// //                                 if(datarecharge.status_id.toString()=="1")
// //                                   {
// //                                     console.log('Update Electricity Recharge Trasaction----1');
// //                                     console.log(result["recordset"][0].userid);
// //                                     console.log(result["recordset"][0].uniqueid);
// //                                     console.log(datarecharge.utr);
// //                                     console.log(datarecharge.message);
                            
// //                                     console.log('Update Electricity Recharge Trasaction----2');
// //                                     const returnrecharge = await update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'success',datarecharge.utr,datarecharge.message,'direct')
                               
// //                                     console.log('Update Electricity Recharge Trasaction----3');
// //                                     console.log(returnrecharge[0].transactionsID);    
// //                                     console.log(returnrecharge[0].serviceprovider);  
// //                                     console.log(returnrecharge[0].paidtype);  
// //                                     console.log(returnrecharge[0].mobilenumber);  
// //                                     console.log(returnrecharge[0].amount);  
// //                                     console.log(returnrecharge[0].Message);  
// //                                     console.log('Update Electricity Recharge Trasaction----4');
                                            
// //                                           res.json({
// //                                               status:"success",
// //                                               paytype:'direct_payment',    
// //                                               redirect:'success',
                                              
// //                                               transactionsID:returnrecharge[0].transactionsID,
// //                                               serviceprovider:returnrecharge[0].serviceprovider,
// //                                               paidtype:returnrecharge[0].paidtype,
// //                                               mobilenumber:returnrecharge[0].mobilenumber,
// //                                               amount:returnrecharge[0].amount,
// //                                               msg:returnrecharge[0].Message,      
                                                                        
// //                                         });
                                
// //                                   }
// //                                   else
// //                                   {
// //                                         console.log('Update Electricity Recharge Trasaction----6');
// //                                         update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'failure',datarecharge.utr,datarecharge.message,'direct');
                                        
// //                                         console.log('Update Electricity Recharge Trasaction----7');
                                    



// //                                             res.json({
// //                                                 status:"failure",
// //                                                 paytype:'direct_payment',    
// //                                                 redirect:'success',
                                                
// //                                                 transactionsID:'',
// //                                                 serviceprovider:'',
// //                                                 paidtype:"",
// //                                                 mobilenumber:"",
// //                                                 amount:"",
// //                                                 msg:datarecharge.message,      
                                                                          
// //                                           });

// //                                   }

// //                           }
// //                           else
// //                             {





// //                             console.log('Update Electricity Recharge Trasaction----6');
// //                             update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'failure',"","Minimum Recharge 10",'direct')
// //                             console.log('Update Electricity Recharge Trasaction----7');
                        



// //                                 res.json({
// //                                     status:"failure",
// //                                     paytype:'direct_payment',    
// //                                     redirect:'success',
                                    
// //                                     transactionsID:"",
// //                                     serviceprovider:"",
// //                                     paidtype:"",
// //                                     mobilenumber:"",
// //                                     amount:"",
// //                                     msg:"Minimum Recharge 10",      
                                                              
// //                               });




// //                           }
// //                        }
// //                   else{
                             

                              
// //                             res.json({
// //                               status:"failure",
// //                                 paytype:'direct_payment',    
// //                                 redirect:'success',
                                
// //                                 transactionsID:"",
// //                                 serviceprovider:"",
// //                                 paidtype:"",
// //                                 mobilenumber:"",
// //                                 amount:"",
// //                                 msg:"Insufficient Balance",      
                                                          
// //                           });

// //                       }
      

// //                      //end



// //                  }
// //                   else if(result["recordset"][0].category=="Broadband Postpaid")
// //                  {




// //                      console.log('---Broadband Postpaid  1---');
// //                      //Broadband Postpaid payment

// //                          const getdatabalance= await getbalance(result["recordset"][0].userid);
// //                         console.log(getdatabalance.MSG);
// //                         console.log(getdatabalance.Balance);

// //                       if(parseFloat(getpay2all_balance.data.balance.user_balance) >= parseFloat(result["recordset"][0].amount))
// //                         {
                 
// //                           console.log(result["recordset"][0].accountno);
// //                           console.log(result["recordset"][0].provideid);
// //                           console.log(result["recordset"][0].amount);
// //                           console.log(result["recordset"][0].uniqueid);
// //                           console.log(result["recordset"][0].mobileno);
// //                             console.log(result["recordset"][0].token);

                  
// //                            console.log('---Broadband Postpaid  2 ---');

// //                           if(result["recordset"][0].amount >=10)
// //                           {

// //                                 const datarecharge = await funcbillfetchpay(result["recordset"][0].accountno,result["recordset"][0].ReferenceID,result["recordset"][0].amount,result["recordset"][0].provideid,result["recordset"][0].uniqueid,result["recordset"][0].Name,result["recordset"][0].mobileno,result["recordset"][0].token);
                                                                         
    
// //                                 console.log('---Broadband Postpaid  result 2---');
// //                               console.log(datarecharge.status_id);
// //                                 console.log(datarecharge.balance);
// //                                 console.log(datarecharge.order_id);
// //                                 console.log(datarecharge.utr);
// //                                 console.log(datarecharge.report_id);
// //                               console.log(datarecharge.message);
// //                                 console.log('---Landline Postpaid  result 3---');
                      
                  
// //                                 if(datarecharge.status_id.toString()=="1")
// //                                   {
// //                                     console.log('Update Broadband Postpaid Recharge Trasaction----1');
// //                                     console.log(result["recordset"][0].userid);
// //                                     console.log(result["recordset"][0].uniqueid);
// //                                     console.log(datarecharge.utr);
// //                                     console.log(datarecharge.message);
                            
// //                                     console.log('Update Broadband Postpaid Recharge Trasaction----2');
// //                                     const returnrecharge = await update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'success',datarecharge.utr,datarecharge.message,'direct')
                               
// //                                     console.log('Update Broadband Postpaid Recharge Trasaction----3');
// //                                     console.log(returnrecharge[0].transactionsID);    
// //                                     console.log(returnrecharge[0].serviceprovider);  
// //                                     console.log(returnrecharge[0].paidtype);  
// //                                     console.log(returnrecharge[0].mobilenumber);  
// //                                     console.log(returnrecharge[0].amount);  
// //                                     console.log(returnrecharge[0].Message);  
// //                                     console.log('Update Broadband Postpaid Recharge Trasaction----4');
                                            
// //                                           res.json({
// //                                               status:"success",
// //                                               paytype:'direct_payment',    
// //                                               redirect:'success',
                                              
// //                                               transactionsID:returnrecharge[0].transactionsID,
// //                                               serviceprovider:returnrecharge[0].serviceprovider,
// //                                               paidtype:returnrecharge[0].paidtype,
// //                                               mobilenumber:returnrecharge[0].mobilenumber,
// //                                               amount:returnrecharge[0].amount,
// //                                               msg:returnrecharge[0].Message,      
                                                                        
// //                                         });
                                
// //                                   }
// //                                   else
// //                                   {
// //                                         console.log('Update Broadband Postpaid Recharge Trasaction----6');
// //                                         update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'failure',datarecharge.utr,datarecharge.message,'direct');
                                        
// //                                         console.log('Update Broadband Postpaid Recharge Trasaction----7');
                                    



// //                                             res.json({
// //                                                 status:"failure",
// //                                                 paytype:'direct_payment',    
// //                                                 redirect:'success',
                                                
// //                                                 transactionsID:'',
// //                                                 serviceprovider:'',
// //                                                 paidtype:"",
// //                                                 mobilenumber:"",
// //                                                 amount:"",
// //                                                 msg:datarecharge.message,      
                                                                          
// //                                           });

// //                                   }

// //                           }
// //                           else
// //                             {





// //                             console.log('Update Broadband Postpaid Recharge Trasaction----6');
// //                             update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'failure',"","Minimum Recharge 10",'direct')
// //                             console.log('Update Broadband Postpaid Recharge Trasaction----7');
                        



// //                                 res.json({
// //                                     status:"failure",
// //                                     paytype:'direct_payment',    
// //                                     redirect:'success',
                                    
// //                                     transactionsID:"",
// //                                     serviceprovider:"",
// //                                     paidtype:"",
// //                                     mobilenumber:"",
// //                                     amount:"",
// //                                     msg:"Minimum Recharge 10",      
                                                              
// //                               });




// //                           }
// //                        }
// //                     else{
                             

                              
// //                             res.json({
// //                                 status:"failure",
// //                                 paytype:'direct_payment',    
// //                                 redirect:'success',
                                
// //                                 transactionsID:"",
// //                                 serviceprovider:"",
// //                                 paidtype:"",
// //                                 mobilenumber:"",
// //                                 amount:"",
// //                                 msg:"Insufficient Balance",      
                                                          
// //                           });

// //                       }
      

// //                      //end






// //                  }
// //                  else if(result["recordset"][0].category=="Landline Postpaid")
// //                  {

// //                      console.log('---Landline Postpaid  1---');
// //                      //Landline Postpaid payment

// //                          const getdatabalance= await getbalance(result["recordset"][0].userid);
// //                         console.log(getdatabalance.MSG);
// //                         console.log(getdatabalance.Balance);

// //                       if(parseFloat(getpay2all_balance.data.balance.user_balance) >= parseFloat(result["recordset"][0].amount))
// //                         {
                 
// //                           console.log(result["recordset"][0].accountno);
// //                           console.log(result["recordset"][0].provideid);
// //                           console.log(result["recordset"][0].amount);
// //                           console.log(result["recordset"][0].uniqueid);
// //                           console.log(result["recordset"][0].mobileno);
// //                             console.log(result["recordset"][0].token);

                  
// //                            console.log('---Landline Postpaid  2 ---');

// //                           if(result["recordset"][0].amount >=10)
// //                           {

// //                                 const datarecharge = await funcbillfetchpay(result["recordset"][0].accountno,result["recordset"][0].ReferenceID,result["recordset"][0].amount,result["recordset"][0].provideid,result["recordset"][0].uniqueid,result["recordset"][0].Name,result["recordset"][0].mobileno,result["recordset"][0].token);
                                                                         
    
// //                                 console.log('---Landline Postpaid  result 2---');
// //                               console.log(datarecharge.status_id);
// //                                 console.log(datarecharge.balance);
// //                                 console.log(datarecharge.order_id);
// //                                 console.log(datarecharge.utr);
// //                                 console.log(datarecharge.report_id);
// //                               console.log(datarecharge.message);
// //                                 console.log('---Landline Postpaid  result 3---');
                      
                  
// //                                 if(datarecharge.status_id.toString()=="1")
// //                                   {
// //                                     console.log('Update Landline Postpaid Recharge Trasaction----1');
// //                                     console.log(result["recordset"][0].userid);
// //                                     console.log(result["recordset"][0].uniqueid);
// //                                     console.log(datarecharge.utr);
// //                                     console.log(datarecharge.message);
                            
// //                                     console.log('Update Landline Postpaid Recharge Trasaction----2');
// //                                     const returnrecharge = await update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'success',datarecharge.utr,datarecharge.message,'direct')
                               
// //                                     console.log('Update Landline Postpaid Recharge Trasaction----3');
// //                                     console.log(returnrecharge[0].transactionsID);    
// //                                     console.log(returnrecharge[0].serviceprovider);  
// //                                     console.log(returnrecharge[0].paidtype);  
// //                                     console.log(returnrecharge[0].mobilenumber);  
// //                                     console.log(returnrecharge[0].amount);  
// //                                     console.log(returnrecharge[0].Message);  
// //                                     console.log('Update Landline Postpaid Recharge Trasaction----4');
                                            
// //                                           res.json({
// //                                               status:"success",
// //                                               paytype:'direct_payment',    
// //                                               redirect:'success',
                                              
// //                                               transactionsID:returnrecharge[0].transactionsID,
// //                                               serviceprovider:returnrecharge[0].serviceprovider,
// //                                               paidtype:returnrecharge[0].paidtype,
// //                                               mobilenumber:returnrecharge[0].mobilenumber,
// //                                               amount:returnrecharge[0].amount,
// //                                               msg:returnrecharge[0].Message,      
                                                                        
// //                                         });
                                
// //                                   }
// //                                   else
// //                                   {
// //                                         console.log('Update Landline Postpaid Recharge Trasaction----6');
// //                                         update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'failure',datarecharge.utr,datarecharge.message,'direct');
                                        
// //                                         console.log('Update Landline Postpaid Recharge Trasaction----7');
                                    



// //                                             res.json({
// //                                                 status:"failure",
// //                                                 paytype:'direct_payment',    
// //                                                 redirect:'success',
                                                
// //                                                 transactionsID:'',
// //                                                 serviceprovider:'',
// //                                                 paidtype:"",
// //                                                 mobilenumber:"",
// //                                                 amount:"",
// //                                                 msg:datarecharge.message,      
                                                                          
// //                                           });

// //                                   }

// //                           }
// //                           else
// //                             {





// //                             console.log('Update Landline Postpaid Recharge Trasaction----6');
// //                             update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'failure',"","Minimum Recharge 10",'direct')
// //                             console.log('Update Landline Postpaid Recharge Trasaction----7');
                        



// //                                 res.json({
// //                                     status:"failure",
// //                                     paytype:'direct_payment',    
// //                                     redirect:'success',
                                    
// //                                     transactionsID:"",
// //                                     serviceprovider:"",
// //                                     paidtype:"",
// //                                     mobilenumber:"",
// //                                     amount:"",
// //                                     msg:"Minimum Recharge 10",      
                                                              
// //                               });




// //                           }
// //                        }
// //                     else{
                             

                              
// //                             res.json({
// //                                 status:"failure",
// //                                 paytype:'direct_payment',    
// //                                 redirect:'success',
                                
// //                                 transactionsID:"",
// //                                 serviceprovider:"",
// //                                 paidtype:"",
// //                                 mobilenumber:"",
// //                                 amount:"",
// //                                 msg:"Insufficient Balance",      
                                                          
// //                           });

// //                       }
      

// //                      //end


// //                  }
// //                   else if(result["recordset"][0].category=="Cable TV")
// //                  {

// //                  }
// //                   else if(result["recordset"][0].category=="Gas")
// //                  {

// //                          console.log('---Gas  1---');
// //                      //Gas payment

// //                          const getdatabalance= await getbalance(result["recordset"][0].userid);
// //                         console.log(getdatabalance.MSG);
// //                         console.log(getdatabalance.Balance);

// //                       if(parseFloat(getpay2all_balance.data.balance.user_balance) >= parseFloat(result["recordset"][0].amount))
// //                         {
                 
// //                           console.log(result["recordset"][0].accountno);
// //                           console.log(result["recordset"][0].provideid);
// //                           console.log(result["recordset"][0].amount);
// //                           console.log(result["recordset"][0].uniqueid);
// //                           console.log(result["recordset"][0].mobileno);
// //                             console.log(result["recordset"][0].token);

                  
// //                            console.log('---Gas  2 ---');

// //                           if(result["recordset"][0].amount >=10)
// //                           {

// //                                 const datarecharge = await funcbillfetchpay(result["recordset"][0].accountno,result["recordset"][0].ReferenceID,result["recordset"][0].amount,result["recordset"][0].provideid,result["recordset"][0].uniqueid,result["recordset"][0].Name,result["recordset"][0].mobileno,result["recordset"][0].token);
                                                                         
    
// //                                 console.log('---Gas  result 2---');
// //                               console.log(datarecharge.status_id);
// //                                 console.log(datarecharge.balance);
// //                                 console.log(datarecharge.order_id);
// //                                 console.log(datarecharge.utr);
// //                                 console.log(datarecharge.report_id);
// //                               console.log(datarecharge.message);
// //                                 console.log('---Gas  result 3---');
                      
                  
// //                                 if(datarecharge.status_id.toString()=="1")
// //                                   {
// //                                     console.log('Update Gas Recharge Trasaction----1');
// //                                     console.log(result["recordset"][0].userid);
// //                                     console.log(result["recordset"][0].uniqueid);
// //                                     console.log(datarecharge.utr);
// //                                     console.log(datarecharge.message);
                            
// //                                     console.log('Update Gas Recharge Trasaction----2');
// //                                     const returnrecharge = await update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'success',datarecharge.utr,datarecharge.message,'direct')
                               
// //                                     console.log('Update Gas Recharge Trasaction----3');
// //                                     console.log(returnrecharge[0].transactionsID);    
// //                                     console.log(returnrecharge[0].serviceprovider);  
// //                                     console.log(returnrecharge[0].paidtype);  
// //                                     console.log(returnrecharge[0].mobilenumber);  
// //                                     console.log(returnrecharge[0].amount);  
// //                                     console.log(returnrecharge[0].Message);  
// //                                     console.log('Update Gas Recharge Trasaction----4');
                                            
// //                                           res.json({
// //                                               status:"success",
// //                                               paytype:'direct_payment',    
// //                                               redirect:'success',
                                              
// //                                               transactionsID:returnrecharge[0].transactionsID,
// //                                               serviceprovider:returnrecharge[0].serviceprovider,
// //                                               paidtype:returnrecharge[0].paidtype,
// //                                               mobilenumber:returnrecharge[0].mobilenumber,
// //                                               amount:returnrecharge[0].amount,
// //                                               msg:returnrecharge[0].Message,      
                                                                        
// //                                         });
                                
// //                                   }
// //                                   else
// //                                   {
// //                                         console.log('Update GasRecharge Trasaction----6');
// //                                         update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'failure',datarecharge.utr,datarecharge.message,'direct');
                                        
// //                                         console.log('Update Gas Recharge Trasaction----7');
                                    



// //                                             res.json({
// //                                                 status:"failure",
// //                                                 paytype:'direct_payment',    
// //                                                 redirect:'success',
                                                
// //                                                 transactionsID:'',
// //                                                 serviceprovider:'',
// //                                                 paidtype:"",
// //                                                 mobilenumber:"",
// //                                                 amount:"",
// //                                                 msg:datarecharge.message,      
                                                                          
// //                                           });

// //                                   }

// //                           }
// //                           else
// //                             {





// //                             console.log('Update Gas Recharge Trasaction----6');
// //                             update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'failure',"","Minimum Recharge 10",'direct')
// //                             console.log('Update Gas Recharge Trasaction----7');
                        



// //                                 res.json({
// //                                     status:"failure",
// //                                     paytype:'direct_payment',    
// //                                     redirect:'success',
                                    
// //                                     transactionsID:"",
// //                                     serviceprovider:"",
// //                                     paidtype:"",
// //                                     mobilenumber:"",
// //                                     amount:"",
// //                                     msg:"Minimum Recharge 10",      
                                                              
// //                               });




// //                           }
// //                        }
// //                     else{
                             

                              
// //                             res.json({
// //                                 status:"failure",
// //                                 paytype:'direct_payment',    
// //                                 redirect:'success',
                                
// //                                 transactionsID:"",
// //                                 serviceprovider:"",
// //                                 paidtype:"",
// //                                 mobilenumber:"",
// //                                 amount:"",
// //                                 msg:"Insufficient Balance",      
                                                          
// //                           });

// //                       }
      

// //                      //end

// //                  }
// //                   else if(result["recordset"][0].category=="Water")
// //                  {

// //                     console.log('---Water  1---');
// //                      //Water payment

// //                          const getdatabalance= await getbalance(result["recordset"][0].userid);
// //                         console.log(getdatabalance.MSG);
// //                         console.log(getdatabalance.Balance);

// //                       if(parseFloat(getpay2all_balance.data.balance.user_balance) >= parseFloat(result["recordset"][0].amount))
// //                         {
                 
// //                           console.log(result["recordset"][0].accountno);
// //                           console.log(result["recordset"][0].provideid);
// //                           console.log(result["recordset"][0].amount);
// //                           console.log(result["recordset"][0].uniqueid);
// //                           console.log(result["recordset"][0].mobileno);
// //                             console.log(result["recordset"][0].token);

                  
// //                            console.log('---Water  2 ---');

// //                           if(result["recordset"][0].amount >=10)
// //                           {

// //                                 const datarecharge = await funcbillfetchpay(result["recordset"][0].accountno,result["recordset"][0].ReferenceID,result["recordset"][0].amount,result["recordset"][0].provideid,result["recordset"][0].uniqueid,result["recordset"][0].Name,result["recordset"][0].mobileno,result["recordset"][0].token);
                                                                         
    
// //                                 console.log('---Water  result 2---');
// //                               console.log(datarecharge.status_id);
// //                                 console.log(datarecharge.balance);
// //                                 console.log(datarecharge.order_id);
// //                                 console.log(datarecharge.utr);
// //                                 console.log(datarecharge.report_id);
// //                               console.log(datarecharge.message);
// //                                 console.log('---Water  result 3---');
                      
                  
// //                                 if(datarecharge.status_id.toString()=="1")
// //                                   {
// //                                     console.log('Update Water Recharge Trasaction----1');
// //                                     console.log(result["recordset"][0].userid);
// //                                     console.log(result["recordset"][0].uniqueid);
// //                                     console.log(datarecharge.utr);
// //                                     console.log(datarecharge.message);
                            
// //                                     console.log('Update Water Recharge Trasaction----2');
// //                                     const returnrecharge = await update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'success',datarecharge.utr,datarecharge.message,'direct')
                               
// //                                     console.log('Update Water Recharge Trasaction----3');
// //                                     console.log(returnrecharge[0].transactionsID);    
// //                                     console.log(returnrecharge[0].serviceprovider);  
// //                                     console.log(returnrecharge[0].paidtype);  
// //                                     console.log(returnrecharge[0].mobilenumber);  
// //                                     console.log(returnrecharge[0].amount);  
// //                                     console.log(returnrecharge[0].Message);  
// //                                     console.log('Update Water Recharge Trasaction----4');
                                            
// //                                           res.json({
// //                                               status:"success",
// //                                               paytype:'direct_payment',    
// //                                               redirect:'success',
                                              
// //                                               transactionsID:returnrecharge[0].transactionsID,
// //                                               serviceprovider:returnrecharge[0].serviceprovider,
// //                                               paidtype:returnrecharge[0].paidtype,
// //                                               mobilenumber:returnrecharge[0].mobilenumber,
// //                                               amount:returnrecharge[0].amount,
// //                                               msg:returnrecharge[0].Message,      
                                                                        
// //                                         });
                                
// //                                   }
// //                                   else
// //                                   {
// //                                         console.log('Update Water Trasaction----6');
// //                                         update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'failure',datarecharge.utr,datarecharge.message,'direct');
                                        
// //                                         console.log('Update Water Recharge Trasaction----7');
                                    



// //                                             res.json({
// //                                                 status:"failure",
// //                                                 paytype:'direct_payment',    
// //                                                 redirect:'success',
                                                
// //                                                 transactionsID:'',
// //                                                 serviceprovider:'',
// //                                                 paidtype:"",
// //                                                 mobilenumber:"",
// //                                                 amount:"",
// //                                                 msg:datarecharge.message,      
                                                                          
// //                                           });

// //                                   }

// //                           }
// //                           else
// //                             {





// //                             console.log('Update Water Recharge Trasaction----6');
// //                             update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'failure',"","Minimum Recharge 10",'direct')
// //                             console.log('Update Water Recharge Trasaction----7');
                        



// //                                 res.json({
// //                                     status:"failure",
// //                                     paytype:'direct_payment',    
// //                                     redirect:'success',
                                    
// //                                     transactionsID:"",
// //                                     serviceprovider:"",
// //                                     paidtype:"",
// //                                     mobilenumber:"",
// //                                     amount:"",
// //                                     msg:"Minimum Recharge 10",      
                                                              
// //                               });




// //                           }
// //                        }
// //                     else{
                             

                              
// //                             res.json({
// //                                 status:"failure",
// //                                 paytype:'direct_payment',    
// //                                 redirect:'success',
                                
// //                                 transactionsID:"",
// //                                 serviceprovider:"",
// //                                 paidtype:"",
// //                                 mobilenumber:"",
// //                                 amount:"",
// //                                 msg:"Insufficient Balance",      
                                                          
// //                           });

// //                       }
      

// //                      //end


// //                  }
// //                  else if(result["recordset"][0].category=="Credit Card")
// //                  {

// //                          console.log('---Credit Card Start 1---');
// //                      //Credit Card payment

// //                          const getdatabalance= await getbalance(result["recordset"][0].userid);
// //                         console.log(getdatabalance.MSG);
// //                         console.log(getdatabalance.Balance);
// // 						console.log(getpay2all_balance.data.balance.user_balance);
// // 						console.log(parseFloat(getpay2all_balance.data.balance.user_balance));
// // 						console.log(parseFloat(result["recordset"][0].amount));
// // 					console.log('---Credit Card END  2---');
// //                       if(parseFloat(getpay2all_balance.data.balance.user_balance) >= parseFloat(result["recordset"][0].amount))
// //                         {
                 
// //                           console.log(result["recordset"][0].accountno);
// //                           console.log(result["recordset"][0].provideid);
// //                           console.log(result["recordset"][0].amount);
// //                           console.log(result["recordset"][0].uniqueid);
// //                           console.log(result["recordset"][0].mobileno);
// //                             console.log(result["recordset"][0].token);

                  
// //                            console.log('---Credit Card  2 ---');

// //                           if(result["recordset"][0].amount >=1)
// //                           {

// //                                 const datarecharge = await funcbillfetchpay_test(result["recordset"][0].accountno,result["recordset"][0].ReferenceID,result["recordset"][0].amount,result["recordset"][0].provideid,result["recordset"][0].uniqueid,result["recordset"][0].Name,result["recordset"][0].mobileno,result["recordset"][0].token);
                                                                         
    
// //                                 console.log('---Credit Card  result 2---');
// //                               console.log(datarecharge.status_id);
// //                                 console.log(datarecharge.balance);
// //                                 console.log(datarecharge.order_id);
// //                                 console.log(datarecharge.utr);
// //                                 console.log(datarecharge.report_id);
// //                               console.log(datarecharge.message);
// //                                 console.log('---Credit Card  result 3---');
                      
                  
// //                                 if(datarecharge.status_id.toString()=="1")
// //                                   {
// //                                     console.log('Update Credit Card Recharge Trasaction----1');
// //                                     console.log(result["recordset"][0].userid);
// //                                     console.log(result["recordset"][0].uniqueid);
// //                                     console.log(datarecharge.utr);
// //                                     console.log(datarecharge.message);
                            
// //                                     console.log('Update Credit Card Recharge Trasaction----2');
// //                                     const returnrecharge = await update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'success',datarecharge.utr,datarecharge.message,'direct')
                               
// //                                     console.log('Update Credit Card Recharge Trasaction----3');
// //                                     console.log(returnrecharge[0].transactionsID);    
// //                                     console.log(returnrecharge[0].serviceprovider);  
// //                                     console.log(returnrecharge[0].paidtype);  
// //                                     console.log(returnrecharge[0].mobilenumber);  
// //                                     console.log(returnrecharge[0].amount);  
// //                                     console.log(returnrecharge[0].Message);  
// //                                     console.log('Update Credit Card Recharge Trasaction----4');
                                            
// //                                           res.json({
// //                                               status:"success",
// //                                               paytype:'direct_payment',    
// //                                               redirect:'success',
                                              
// //                                               transactionsID:returnrecharge[0].transactionsID,
// //                                               serviceprovider:returnrecharge[0].serviceprovider,
// //                                               paidtype:returnrecharge[0].paidtype,
// //                                               mobilenumber:returnrecharge[0].mobilenumber,
// //                                               amount:returnrecharge[0].amount,
// //                                               msg:returnrecharge[0].Message,      
                                                                        
// //                                         });
                                
// //                                   }
// // 								  else if(datarecharge.status_id.toString()=="3")
// //                                   {
// //                                     console.log('Update Credit Card Recharge Pending Trasaction----1');
// //                                     console.log(result["recordset"][0].userid);
// //                                     console.log(result["recordset"][0].uniqueid);
// //                                     console.log(datarecharge.utr);
// //                                     console.log(datarecharge.message);
                            
// //                                     console.log('Update Credit Card Recharge Pending Trasaction----2');
// //                                     const returnrecharge = await update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'success',datarecharge.utr,datarecharge.message,'direct')
                               
// //                                     console.log('Update Credit Card Recharge Pending Trasaction----3');
// //                                     console.log(returnrecharge[0].transactionsID);    
// //                                     console.log(returnrecharge[0].serviceprovider);  
// //                                     console.log(returnrecharge[0].paidtype);  
// //                                     console.log(returnrecharge[0].mobilenumber);  
// //                                     console.log(returnrecharge[0].amount);  
// //                                     console.log(returnrecharge[0].Message);  
// //                                     console.log('Update Credit Card Recharge Pending Trasaction----4');
                                            
// //                                           res.json({
// //                                               status:"Pending",
// //                                               paytype:'direct_payment',    
// //                                               redirect:'success',
                                              
// //                                               transactionsID:returnrecharge[0].transactionsID,
// //                                               serviceprovider:returnrecharge[0].serviceprovider,
// //                                               paidtype:returnrecharge[0].paidtype,
// //                                               mobilenumber:returnrecharge[0].mobilenumber,
// //                                               amount:returnrecharge[0].amount,
// //                                               msg:returnrecharge[0].Message,      
                                                                        
// //                                         });
                                
// //                                   }
// //                                   else
// //                                   {
// //                                         console.log('Update Credit Card Trasaction----6');
// //                                         update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'failure',datarecharge.utr,datarecharge.message,'direct');
                                        
// //                                         console.log('Update Credit Card Recharge Trasaction----7');
                                    



// //                                             res.json({
// //                                                 status:"failure",
// //                                                 paytype:'direct_payment',    
// //                                                 redirect:'success',
                                                
// //                                                 transactionsID:'',
// //                                                 serviceprovider:'',
// //                                                 paidtype:"",
// //                                                 mobilenumber:"",
// //                                                 amount:"",
// //                                                 msg:datarecharge.message,      
                                                                          
// //                                           });

// //                                   }

// //                           }
// //                           else
// //                             {





// //                             console.log('Update Credit Card Recharge Trasaction----6');
// //                             update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'failure',"","Minimum Recharge 10",'direct')
// //                             console.log('Update Credit Card Recharge Trasaction----7');
                        



// //                                 res.json({
// //                                     status:"failure",
// //                                     paytype:'direct_payment',    
// //                                     redirect:'success',
                                    
// //                                     transactionsID:"",
// //                                     serviceprovider:"",
// //                                     paidtype:"",
// //                                     mobilenumber:"",
// //                                     amount:"",
// //                                     msg:"Minimum Recharge 10",      
                                                              
// //                               });




// //                           }
// //                        }
// //                     else{
                             

                              
// //                             res.json({
// //                                 status:"failure",
// //                                 paytype:'direct_payment',    
// //                                 redirect:'success',
                                
// //                                 transactionsID:"",
// //                                 serviceprovider:"",
// //                                paidtype:"",
// //                                 mobilenumber:"",
// //                                amount:"",
// //                                 msg:"Insufficient Balance",      
                                                          
// //                           });

// //                      }
      

// //                      //end


// //                  }
// //                  else if(result["recordset"][0].category=="Insurance")
// //                  {



// //                     console.log('---Insurance  1---');
// //                      //Insurance payment

// //                          const getdatabalance= await getbalance(result["recordset"][0].userid);
// //                         console.log(getdatabalance.MSG);
// //                         console.log(getdatabalance.Balance);

// //                       if(parseFloat(getpay2all_balance.data.balance.user_balance) >= parseFloat(result["recordset"][0].amount))
// //                         {
                 
// //                           console.log(result["recordset"][0].accountno);
// //                           console.log(result["recordset"][0].provideid);
// //                           console.log(result["recordset"][0].amount);
// //                           console.log(result["recordset"][0].uniqueid);
// //                           console.log(result["recordset"][0].mobileno);
// //                             console.log(result["recordset"][0].token);

                  
// //                            console.log('---Insurance  2 ---');

// //                           if(result["recordset"][0].amount >=10)
// //                           {

// //                                 const datarecharge = await funcbillfetchpay(result["recordset"][0].accountno,result["recordset"][0].ReferenceID,result["recordset"][0].amount,result["recordset"][0].provideid,result["recordset"][0].uniqueid,result["recordset"][0].Name,result["recordset"][0].mobileno,result["recordset"][0].token);
                                                                         
    
// //                                 console.log('---Insurance  result 2---');
// //                               console.log(datarecharge.status_id);
// //                                 console.log(datarecharge.balance);
// //                                 console.log(datarecharge.order_id);
// //                                 console.log(datarecharge.utr);
// //                                 console.log(datarecharge.report_id);
// //                               console.log(datarecharge.message);
// //                                 console.log('---Insurance  result 3---');
                      
                  
// //                                 if(datarecharge.status_id.toString()=="1")
// //                                   {
// //                                     console.log('Update Insurance Recharge Trasaction----1');
// //                                     console.log(result["recordset"][0].userid);
// //                                     console.log(result["recordset"][0].uniqueid);
// //                                     console.log(datarecharge.utr);
// //                                     console.log(datarecharge.message);
                            
// //                                     console.log('Update Insurance Recharge Trasaction----2');
// //                                     const returnrecharge = await update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'success',datarecharge.utr,datarecharge.message,'direct')
                               
// //                                     console.log('Update Insurance Recharge Trasaction----3');
// //                                     console.log(returnrecharge[0].transactionsID);    
// //                                     console.log(returnrecharge[0].serviceprovider);  
// //                                     console.log(returnrecharge[0].paidtype);  
// //                                     console.log(returnrecharge[0].mobilenumber);  
// //                                     console.log(returnrecharge[0].amount);  
// //                                     console.log(returnrecharge[0].Message);  
// //                                     console.log('Update Insurance Recharge Trasaction----4');
                                            
// //                                           res.json({
// //                                               status:"success",
// //                                               paytype:'direct_payment',    
// //                                               redirect:'success',
                                              
// //                                               transactionsID:returnrecharge[0].transactionsID,
// //                                               serviceprovider:returnrecharge[0].serviceprovider,
// //                                               paidtype:returnrecharge[0].paidtype,
// //                                               mobilenumber:returnrecharge[0].mobilenumber,
// //                                               amount:returnrecharge[0].amount,
// //                                               msg:returnrecharge[0].Message,      
                                                                        
// //                                         });
                                
// //                                   }
// //                                   else
// //                                   {
// //                                         console.log('Update Insurance Trasaction----6');
// //                                         update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'failure',datarecharge.utr,datarecharge.message,'direct');
                                        
// //                                         console.log('Update Insurance Recharge Trasaction----7');
                                    



// //                                             res.json({
// //                                                 status:"failure",
// //                                                 paytype:'direct_payment',    
// //                                                 redirect:'success',
                                                
// //                                                 transactionsID:'',
// //                                                 serviceprovider:'',
// //                                                 paidtype:"",
// //                                                 mobilenumber:"",
// //                                                 amount:"",
// //                                                 msg:datarecharge.message,      
                                                                          
// //                                           });

// //                                   }

// //                           }
// //                           else
// //                             {





// //                             console.log('Update Insurance Recharge Trasaction----6');
// //                             update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'failure',"","Minimum Recharge 10",'direct')
// //                             console.log('UpdateInsurance Recharge Trasaction----7');
                        



// //                                 res.json({
// //                                     status:"failure",
// //                                     paytype:'direct_payment',    
// //                                     redirect:'success',
                                    
// //                                     transactionsID:"",
// //                                     serviceprovider:"",
// //                                     paidtype:"",
// //                                     mobilenumber:"",
// //                                     amount:"",
// //                                     msg:"Minimum Recharge 10",      
                                                              
// //                               });




// //                           }
// //                        }
// //                     else{
                             

                              
// //                             res.json({
// //                                 status:"failure",
// //                                 paytype:'direct_payment',    
// //                                 redirect:'success',
                                
// //                                 transactionsID:"",
// //                                 serviceprovider:"",
// //                                 paidtype:"",
// //                                 mobilenumber:"",
// //                                 amount:"",
// //                                 msg:"Insufficient Balance",      
                                                          
// //                           });

// //                       }
      

// //                      //end






// //                  }
// //                   else if(result["recordset"][0].category=="Loan")
// //                  {




// //                     console.log('---Loan  1---');
// //                      //Insurance payment

// //                          const getdatabalance= await getbalance(result["recordset"][0].userid);
// //                         console.log(getdatabalance.MSG);
// //                         console.log(getdatabalance.Balance);

// //                       if(parseFloat(getpay2all_balance.data.balance.user_balance) >= parseFloat(result["recordset"][0].amount))
// //                         {
                 
// //                           console.log(result["recordset"][0].accountno);
// //                           console.log(result["recordset"][0].provideid);
// //                           console.log(result["recordset"][0].amount);
// //                           console.log(result["recordset"][0].uniqueid);
// //                           console.log(result["recordset"][0].mobileno);
// //                             console.log(result["recordset"][0].token);

                  
// //                            console.log('---Loan  2 ---');

// //                           if(result["recordset"][0].amount >=10)
// //                           {

// //                                 const datarecharge = await funcbillfetchpay(result["recordset"][0].accountno,result["recordset"][0].ReferenceID,result["recordset"][0].amount,result["recordset"][0].provideid,result["recordset"][0].uniqueid,result["recordset"][0].Name,result["recordset"][0].mobileno,result["recordset"][0].token);
                                                                         
    
// //                                 console.log('---Loan  result 2---');
// //                               console.log(datarecharge.status_id);
// //                                 console.log(datarecharge.balance);
// //                                 console.log(datarecharge.order_id);
// //                                 console.log(datarecharge.utr);
// //                                 console.log(datarecharge.report_id);
// //                               console.log(datarecharge.message);
// //                                 console.log('---Loan  result 3---');
                      
                  
// //                                 if(datarecharge.status_id.toString()=="1")
// //                                   {
// //                                     console.log('Update Loan Recharge Trasaction----1');
// //                                     console.log(result["recordset"][0].userid);
// //                                     console.log(result["recordset"][0].uniqueid);
// //                                     console.log(datarecharge.utr);
// //                                     console.log(datarecharge.message);
                            
// //                                     console.log('Update Loan Recharge Trasaction----2');
// //                                     const returnrecharge = await update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'success',datarecharge.utr,datarecharge.message,'direct')
                               
// //                                     console.log('Update Loan Recharge Trasaction----3');
// //                                     console.log(returnrecharge[0].transactionsID);    
// //                                     console.log(returnrecharge[0].serviceprovider);  
// //                                     console.log(returnrecharge[0].paidtype);  
// //                                     console.log(returnrecharge[0].mobilenumber);  
// //                                     console.log(returnrecharge[0].amount);  
// //                                     console.log(returnrecharge[0].Message);  
// //                                     console.log('Update Loan Recharge Trasaction----4');
                                            
// //                                           res.json({
// //                                               status:"success",
// //                                               paytype:'direct_payment',    
// //                                               redirect:'success',
                                              
// //                                               transactionsID:returnrecharge[0].transactionsID,
// //                                               serviceprovider:returnrecharge[0].serviceprovider,
// //                                               paidtype:returnrecharge[0].paidtype,
// //                                               mobilenumber:returnrecharge[0].mobilenumber,
// //                                               amount:returnrecharge[0].amount,
// //                                               msg:returnrecharge[0].Message,      
                                                                        
// //                                         });
                                
// //                                   }
// //                                   else
// //                                   {
// //                                         console.log('Update Loan Trasaction----6');
// //                                         update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'failure',datarecharge.utr,datarecharge.message,'direct');
                                        
// //                                         console.log('Update Loan Recharge Trasaction----7');
                                    



// //                                             res.json({
// //                                                 status:"failure",
// //                                                 paytype:'direct_payment',    
// //                                                 redirect:'success',
                                                
// //                                                 transactionsID:'',
// //                                                 serviceprovider:'',
// //                                                 paidtype:"",
// //                                                 mobilenumber:"",
// //                                                 amount:"",
// //                                                 msg:datarecharge.message,      
                                                                          
// //                                           });

// //                                   }

// //                           }
// //                           else
// //                             {





// //                             console.log('Update Loan Recharge Trasaction----6');
// //                             update_transaction(result["recordset"][0].userid,result["recordset"][0].uniqueid,'failure',"","Minimum Recharge 10",'direct')
// //                             console.log('Update Loan Recharge Trasaction----7');
                        



// //                                 res.json({
// //                                     status:"failure",
// //                                     paytype:'direct_payment',    
// //                                     redirect:'success',
                                    
// //                                     transactionsID:"",
// //                                     serviceprovider:"",
// //                                     paidtype:"",
// //                                     mobilenumber:"",
// //                                     amount:"",
// //                                     msg:"Minimum Recharge 10",      
                                                              
// //                               });




// //                           }
// //                        }
// //                     else{
                             

                              
// //                             res.json({
// //                                 status:"failure",
// //                                 paytype:'direct_payment',    
// //                                 redirect:'success',
                                
// //                                 transactionsID:"",
// //                                 serviceprovider:"",
// //                                 paidtype:"",
// //                                 mobilenumber:"",
// //                                 amount:"",
// //                                 msg:"Insufficient Balance",      
                                                          
// //                           });

// //                       }
      

// //                      //end







// //                  }
// //                    else if(result["recordset"][0].category=="Education")
// //                  {

// //                  }

// //               }
// //               else
// //                 {

// // 						console.log('DEPOSIT--01');				
// //                           const conn= await sql.connect(config);
// //                           const result =await conn.request()
// //                           .input("Tranid", req.params.id)
// //                           .input("status", status.status)
// //                           .input("amount", status.transaction_amount)
                        

// //                           .execute("USP_UpdateSuccessTransaction");
// //                           const data = result["recordset"];
// //                            console.log(' Response:', data);
                          
// //                             console.log(result["recordset"][0].paytype);


// //                           res.json({
// //                                       status:"success",
// //                                       paytype:'deposit',    
// //                                       redirect:'success',
// //                                       amount:status.transaction_amount,
// //                                       mobilenumber:'',
// //                                       serviceprovider:'',
// //                                       transactionsID:'',
// //                                       msg:"success",      
                                                                
// //                                 });


// //                    }

                


// //       } 
// //         else
          
// //           {
      
// //             console.log('---failure or cancel payment---')
       
       
            



// //            //#region cancel entry tn database
// //               console.log(req.params.id);
// //               console.log(status.status);
// //               console.log(status.error_Message);


// //             const conn= await sql.connect(config);
// //             const result =await conn.request()



            
// //             .input("Tranid", req.params.id)
// //             .input("status", status.status)
// //             .input("message", status.error_Message)
           

// //             .execute("USP_Updatecancel");
// //              const data = result["recordset"];
// //                 console.log(' Response:', data);
// //               console.log(data.paytype);
// //               console.log(result["recordset"][0].paytype);

              
// //                           res.json({
// //                                       status:"failure",
// //                                       paytype:'deposit',    
// //                                       redirect:'failed',
// //                                       amount:status.transaction_amount,
// //                                       mobilenumber:'',
// //                                       serviceprovider:'',
// //                                       transactionsID:'',
// //                                       msg:"failure",      
                                                                
// //                                 });
// //              //#endregion cancel payment
            
             



      

// //     }
// //   } catch (error) {
// //      console.log('---44---')
// //     console.error("Error verifying payment:", error);
// //     res.status(500).send(error);
// //   }



// // });




// async function addmoney_transaction(userid,txnid,amount,productinfo,email,mobileno,name){

//     try{
//          console.log('---ADD Money INICIATE---')
//       console.log('---22---')
//       console.log(userid);
//       console.log(txnid);
//       console.log(amount);
//       console.log(productinfo);
//       console.log(email);
//       console.log(mobileno);
//       console.log(name);

//             const conn= await sql.connect(config);
//             const res =await conn.request()



//             .input("userid", userid)
//             .input("txnid", txnid)
//             .input("amount", amount)
//             .input("productinfo", productinfo)
//             .input("email", email)
//             .input("mobileno",mobileno)
//             .input("name", name)
//             // .input("status", '-')
//             // .input("hashid", '--')

//             .execute("usp_addmoneyTransaction");
//             const data = res.recordset;
//             //  console.log('sp Response:', data);


//                console.log('---ADD Money INICIATE- END--')
//             return data;

//     }catch(error){
//         console.log(error);
//     }

// }



// async function cancel_transaction(txnid,status,message){

//     try{
        
//       console.log('---22---')
//       console.log(txnid);
//       console.log(status);
//       console.log(message);


//             const conn= await sql.connect(config);
//             const res =await conn.request()



            
//             .input("Tranid", txnid)
//             .input("status", status)
//             .input("message", message)
           

//             .execute("USP_Updatecancel");
//             // const data = res.recordset;
//             // //  console.log('sp Response:', data);
//             // return data;

//                  const data = res["recordset"];
//               console.log('API Billpay Response:', data);
//               return data;


            

//     }catch(error){
//         console.log(error);
//     }

// }

// async function success_transaction(txnid,status,amount){

//     try{
        
//       console.log('---22---')
//       console.log(txnid);
//       console.log(status);
//       console.log(amount);


//             const conn= await sql.connect(config);
//             const res =await conn.request()



            
//             .input("Tranid", txnid)
//             .input("status", status)
//             .input("amount", amount)
           

//             .execute("USP_UpdateSuccessTransaction");
//             const data = res.recordset;
//             //  console.log('sp Response:', data);
//             return data;

//     }catch(error){
//         console.log(error);
//     }

// }
// // async function addmoney_transaction(txnid,status){



// // }


// // PayU configuration
// // const PAYU_CONFIG = {
// //   merchantKey: 'efmBlaOa',
// //   merchantSalt: 'AtBlCnu6gz',
// //   testUrl: 'https://test.payu.in/_payment',
// //   productionUrl: 'https://secure.payu.in/_payment',
// //   successUrl: 'http://moniespay.com/success',
// //   failureUrl: 'http://moniespay.com/failure'
// // };

// // // Generate hash for PayU
// // function generateHash(paymentParams) {
// //   const hashString = 
// //     `${paymentParams.key}|${paymentParams.txnid}|${paymentParams.amount}|` +
// //     `${paymentParams.productinfo}|${paymentParams.firstname}|${paymentParams.email}|` +
// //     `|||||||||||${PAYU_CONFIG.merchantSalt}`;
    
// //   return crypto.createHash('sha512').update(hashString).digest('hex');
// // }

// // // Initiate payment
// // router.post('/initiate-payment', async (req, res) => {
// //   try {
// //     const { amount, productInfo, firstName, email, phone } = req.body;
    
// //     // Generate transaction ID
// //     const txnid =  Date.now();
    
// //     const paymentParams = {
// //       key: PAYU_CONFIG.merchantKey,
// //       txnid,
// //       amount,
// //       productinfo: productInfo,
// //       firstname: firstName,
// //       email,
// //       phone,
// //       surl: PAYU_CONFIG.successUrl,
// //       furl: PAYU_CONFIG.failureUrl,
// //       service_provider: ''
// //     };
    
// //     // Generate hash
// //     paymentParams.hash = generateHash(paymentParams);
   
// //     console.log(txnid);
// //     console.log(amount);
// //     console.log(productInfo);
// //     console.log(firstName);
// //     console.log(email);
// //     console.log(phone);
// //     console.log(PAYU_CONFIG.successUrl);
// //     console.log(PAYU_CONFIG.failureUrl);
// //     console.log(paymentParams.hash);

// //     // Save transaction to database
// //     const pool = await sql.connect(config);
// //     await pool.request()
// //       .input('txnid', sql.VarChar, txnid)
// //       .input('amount', sql.Decimal, amount)
// //       .input('productinfo', sql.VarChar, productInfo)
// //       .input('email', sql.VarChar, email)
// //       .input('status', sql.VarChar, 'INITIATED')
// //       .query(`
// //         INSERT INTO Transactions (txnid, amount, productinfo, email, status, created_at)
// //         VALUES (@txnid, @amount, @productinfo, @email, @status, GETDATE())
// //       `);
    
// //     res.json({
// //       paymentUrl: PAYU_CONFIG.productionUrl, // Use productionUrl for live
// //       paymentParams
// //     });
    
// //   } catch (error) {
// //     console.error('Payment initiation error:', error);
// //     res.status(500).json({ error: 'Payment initiation failed' });
// //   }
// // });

// // // Payment response handler

// // router.post("/payment-response", async (req, res) => {
// //   try {
// //     console.log('xxx11');
// //     const { txnid, status, hash, amount } = req.body;
// //         console.log('xxx12');
// //     // Verify hash
// //     const expectedHash = crypto.createHash('sha512')
// //       .update(`${PAYU_CONFIG.merchantSalt}|${status}|||||||||||${email}|${firstName}|${productInfo}|${amount}|${txnid}|${PAYU_CONFIG.merchantKey}`)
// //       .digest('hex');
      
// //     if (hash !== expectedHash) {
// //       return res.status(400).send('Invalid hash');
// //     }
    
// //     // Update transaction in database
// //     const pool = await sql.connect(config);
// //     await pool.request()
// //       .input('txnid', sql.VarChar, txnid)
// //       .input('status', sql.VarChar, status)
// //       .query(`
// //         UPDATE Transactions 
// //         SET status = @status, updated_at = GETDATE()
// //         WHERE txnid = @txnid
// //       `);
    
// //     // Redirect or respond based on status
// //     if (status === 'success') {
// //       res.redirect('/payment-success');
// //     } else {
// //       res.redirect('/payment-failure');
// //     }
    
// //   } catch (error) {
// //     console.error('Payment response error:', error);
// //     res.status(500).send('Payment processing failed');
// //   }
// // });













// // Axios POST request
// async function fetchDatatoken() {
//   try {
//     const response = await axios.post('https://erp.pay2all.in/api/token', form, {
//       headers: form.getHeaders(),
//     });
// console.log('Data received:---2');

//     const data = response.data;
//     console.log('Data received:', data);
//     return data;
//   } catch (error) {
//     console.error('Error fetching data:', error.message);
//     return null;
//   }
// }

// router.post("/generatetokenbypay2all", async  function(request, res){


//     try
//     {               

//         console.log('***********');

// var axios = require('axios');
// var FormData = require('form-data');
// var data = new FormData();
// data.append('email', 'laxmikanta.28@gmail.com');
// data.append('password', 'Pintu#84');

// var configc = {
//   method: 'post',
//   url: 'https://erp.pay2all.in/api/token',
//   headers: { 
//     'Accept': 'application/json', 
//     ...data.getHeaders()
//   },
//   data : data
// };

// axios(configc)
// .then(function (response) {
//   console.log(JSON.stringify(response.data));
//      res.json({
                   
//       status:"success",
//       msg:'Valid',
//      token:response.data.token,
                   
//  });
//  sessiontoken=response.data.token;

// })
// .catch(function (error) {
//   console.log(error);
// });


 


//     } catch(error){

//     }
  
    
// });


// //Mobile recharge & DTH Recharge
// router.post("/mobilerecharge", async  function(request, response){

//     const status=""; 
//      const message=""; 

//     try
//     {               

   

//      console.log('req----');
//     const token1 = request.header('Authorization');
//      console.log(token1);
//     const decoded = jwt.verify(token1, 'msecret-keys@9128');
//     console.log('----lll----');
//      console.log(decoded);
//      console.log(decoded.USERID);
//      if (decoded.USERID != null) 
//       {

//            const data1 = await  insert_transaction(request.body.userid,request.body.accountno,request.body.provideid,request.body.uniqueid,request.body.serviceprovidername,request.body.mobileno,request.body.amount,request.body.paidtype,request.body.category,request.body.ip);
     
//          console.log(data1[0].MSG);
//          console.log(data1[0].Balance);
//          console.log('Start----1');
//          if(data1[0].MSG.toString() == "TRUE")
//          {
//              console.log('Start----2');
//               if(parseFloat(data1[0].Balance) >= parseFloat(request.body.amount))
//               {
//                   console.log('Start----3');
//                    const datarecharge = await funcmobilerecharge(request.body.accountno,request.body.provideid,request.body.amount,request.body.uniqueid,request.body.mobileno,request.body.token); 
   

//                     console.log(datarecharge.status_id);
//                     console.log(datarecharge.balance);
//                     console.log(datarecharge.order_id);
//                     console.log(datarecharge.utr);
//                     console.log(datarecharge.report_id);
//                    console.log(datarecharge.message);
                   
               
//                   if(datarecharge.status_id.toString()=="1")
//                   {
//                     console.log('Update Mobile Recharge Trasaction----1');
//                     console.log(request.body.userid);
//                     console.log(request.body.uniqueid);
//                     console.log(datarecharge.utr);
//                     console.log(datarecharge.message);
             
//                      console.log('Update Mobile Recharge Trasaction----2');
//                      const returnrecharge = await update_transaction(request.body.userid,request.body.uniqueid,'success',datarecharge.utr,datarecharge.message,'wallet')
//                      console.log('Update Mobile Recharge Trasaction----3');
//                      console.log(returnrecharge[0].transactionsID);    
//                     console.log(returnrecharge[0].serviceprovider);  
//                     console.log(returnrecharge[0].paidtype);  
//                     console.log(returnrecharge[0].mobilenumber);  
//                     console.log(returnrecharge[0].amount);  
//                     console.log(returnrecharge[0].Message);  
//                      console.log('Update Mobile Recharge Trasaction----4');
                   
//                        response.json({
//                          status:"success",
//                          transactionsID:returnrecharge[0].transactionsID,
//                          serviceprovider:returnrecharge[0].serviceprovider,
//                          paidtype:returnrecharge[0].paidtype,
//                          mobilenumber:returnrecharge[0].mobilenumber,
//                          amount:returnrecharge[0].amount,
//                          msg:returnrecharge[0].Message,             
//                        });
//                     console.log('Update Mobile Recharge Trasaction----5');
//                   }
//                   else
//                   {
//                        console.log('Update Mobile Recharge Trasaction----6');
//                        update_transaction(request.body.userid,request.body.uniqueid,'failure',datarecharge.utr,datarecharge.message,'wallet')
//                          console.log('Update Mobile Recharge Trasaction----7');
//                         response.json({
//                          status:"failure",
//                           msg:datarecharge.message,             
//                        });

//                   }

                     



//               }
//               else
//               {
//                        response.json({
//                          status:"failure",
//                           msg:'Insufficent balance',
                          
//                        });
//               }
//          }
      
//     }
   
       
//     } catch(error){

//     }
  
    
// });



// async function insert_transaction(userid,accountno,provideid,myuniqueid,serviceprovidername,mobileno,amount,paidtype,category,ip){

//     try{
        
//             const conn= await sql.connect(config);
//             const res =await conn.request()
//             .input("userid", userid)
//             .input("accountno", accountno)
//             .input("provideid", provideid)
//             .input("tranid", myuniqueid)
//             .input("serviceprovidername", serviceprovidername)
//             .input("mobileno",mobileno)
//             .input("amount", amount)
//             .input("paidtype", paidtype)
//              .input("category", category)
//             .input("ip", ip)
//             .execute("usp_insertTransaction");
//             const data = res.recordset;
//             //  console.log('sp Response:', data);
//             return data;

//     }catch(error){
//         console.log(error);
//     }

// }


// async function update_transaction(userid,myuniqueid,status,Utr,msg,typeofpayment){

//     try{
        
//             const conn= await sql.connect(config);
//             const res =await conn.request()
//             .input("userid", userid)
//             .input("myuniqueid", myuniqueid)
//             .input("status", status)
//             .input("utr", Utr)
//             .input("message", msg)
//              .input("typeofpayment", typeofpayment)
//             .execute("USP_UpdateTransaction");
      
//               const data = res.recordset;
//              console.log('SP Response:', data);
   
    
           
//             return data;

//     }catch(error){
//         console.log(error);
//     }

// }



// async function funcmobilerecharge(accountno,provideid,amount,uniqueid,mobileno,token) {

//    console.log('xxxxx222'); 
//    console.log(accountno); 
//       console.log(provideid); 
//          console.log(amount); 
//    console.log(uniqueid); 
//             console.log(mobileno); 
//             console.log(token); 
//    console.log('xxxxx333 end'); 


// const form = new FormData();
// form.append('number', accountno);
// form.append('provider_id', provideid);
// form.append('amount', amount);
// form.append('client_id', uniqueid);
// form.append('optional1', mobileno);
// form.append('api_id', '27');
// form.append('optional2', '');
// form.append('optional3', '');
// form.append('optional4', '');
// form.append('reference_id', '');

//  const response = await axios.post('https://erp.pay2all.in/api/v1/payment/recharge', form, {
//   headers: {
//         ...form.getHeaders(),
//         'Authorization': `Bearer ${token}`,
//     }

//     });

//     const data = response.data;
//     console.log('API Response:', data);
   
//     return data;

// }





// router.post("/billfetch", async  function(request, response){


//     try
//     {               

//     console.log('req bill fetch');
//     console.log(request.body.billerid);
//     console.log(request.body.uniqueid);
//     console.log(request.body.paraname);
//     console.log(request.body.accountno);
//     console.log(request.body.token);
//     console.log('req bill fetch-2');
//     const databillfetch = await funcbillfetch(request.body.billerid,request.body.uniqueid,request.body.paraname,request.body.accountno,request.body.token);
//         // if (data1) {

//         //          console.log('Response');
//         //           response.json({
                   
//         //             status:"success",
//         //             msg:'Valid',
//         //             message:data1,
                   
//         //         });


//         // // await insertIntoDb(data);
//         // }
              
//       console.log(databillfetch.status_id);
//       console.log(databillfetch.billNumber);
//       console.log(databillfetch.amount);
//       console.log(databillfetch.name);
//       console.log(databillfetch.dueDate);
//       console.log(databillfetch.billdate);
//       console.log(databillfetch.reference_id);
//       console.log(databillfetch.message);  

//       if(databillfetch.message =="Success")
//       {
//         const datainsertbillfetch = await  insert_transaction_billfetch(request.body.userid,request.body.accountno,request.body.billerid,request.body.uniqueid,request.body.serviceprovidername,request.body.mobileno,databillfetch.amount,request.body.paidtype,request.body.category,request.body.paraname,request.body.token,databillfetch.billNumber,databillfetch.name,databillfetch.dueDate,databillfetch.billdate,databillfetch.reference_id,request.body.ip,databillfetch.message);
     
//          console.log('yyyyyyyyyyyyyyyyyyyyyy');  
//         console.log(datainsertbillfetch.Message); 

//          response.json({
//                          status:"success",
//                          msg:datainsertbillfetch.Message,      
//                          transactionsID:datainsertbillfetch.transactionsID,
//                          serviceprovider:datainsertbillfetch.serviceprovider,
//                          paidtype:datainsertbillfetch.paidtype,
//                          mobilenumber:datainsertbillfetch.mobilenumber,
//                          amount:datainsertbillfetch.amount,
//                          accountno:datainsertbillfetch.accountno,
//                           referenceId:datainsertbillfetch.referenceId,  
//                           billerid:datainsertbillfetch.billerid, 
//                           Paraname:datainsertbillfetch.Paraname, 
//                           token:datainsertbillfetch.token, 
//                           customername:datainsertbillfetch.customername,
//                           BillDate:datainsertbillfetch.billdate, 
//                           DueDate:datainsertbillfetch.dueDate,   
//                        });


//       }
//       else{
//                   const datainsertbillfetch = await  insert_transaction_billfetch(request.body.userid,request.body.accountno,request.body.provideid,request.body.uniqueid,request.body.serviceprovidername,request.body.mobileno,databillfetch.amount,request.body.paidtype,request.body.category,request.body.name,request.body.token,databillfetch.billNumber,databillfetch.name,databillfetch.dueDate,databillfetch.billdate,databillfetch.reference_id,request.body.ip,databillfetch.message);
//                     console.log('xxxxxxxxxxxxxxxxx');  
                  
//                   response.json({
//                          status:"failure",
//                          msg:datainsertbillfetch.Message,      
//                          transactionsID:datainsertbillfetch.transactionsID,
//                         token:datainsertbillfetch.token, 
//                        });

//       }



//     } catch(error){

//     }
    
// });

// async function funcbillfetch(billerid,uniqueid,name,accountno,token) {
  
// var requestBody = JSON.stringify({"billerId":billerid,"client_id":uniqueid,"customerParams":[{"name":name,"value":accountno}]});

// const response = await axios.post('https://erp.pay2all.in/api/bbps/fetch', requestBody, {
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`
//       }
//     });

//     const data = response.data;
//     console.log('API Response:', data);
//     return data;


// }
// async function insert_transaction_billfetch(userid,accountno,provideid,myuniqueid,serviceprovidername,mobileno,amount,paidtype,category,paraname,token,billNumber,customername,dueDate,billdate,reference_id,ip, message){

//     try{
        
//             const conn= await sql.connect(config);
//             const res =await conn.request()
//             .input("userid", userid)
//              .input("amount", amount)
//              .input("paidtype", paidtype)
//             .input("accountno", accountno)
//             .input("provideid", provideid)
//             .input("tranid", myuniqueid.toString())
//             .input("serviceprovidername", serviceprovidername)
//             .input("mobileno",mobileno)
//             .input("category", category)
//             .input("paraname", paraname)
//             .input("token", token)
//             .input("billNumber", billNumber)
//             .input("customername", customername)
//             .input("dueDate", dueDate)
//             .input("billdate", billdate)
//             .input("reference_id", reference_id)
//             .input("ip", ip)
//             .input("Remarks",message)
            
//             .execute("usp_insertTransaction_billfetch");
//             const data = res.recordset[0];
//              console.log('sp Responsett:', data);
//             return data;

//     }catch(error){
//         console.log(error);
//     }

// }


// //InsuranceSTART 



// router.post("/billfetch_Insurance", async  function(request, response){


//     try
//     {               

//        // const getpay2all_balance = await getpay2allprofile(request.body.token); 
//    //console.log(getpay2all_balance.data.data.balance.user_balance);
//    console.log('----------------------------');
   
     
//     console.log('req bill fetch Insurance');
//     console.log(request.body.billerid);
//     console.log(request.body.serviceprovidername);
//     console.log(request.body.uniqueid);
    
//     console.log(request.body.paraname);
//     console.log(request.body.dob);

//     const formatter = new Intl.DateTimeFormat('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' });
//     const formattedDate = formatter.format(request.body.dob);
//     console.log(formattedDate);

//     console.log(request.body.paraname1);
//     console.log(request.body.emailID);

//     console.log(request.body.paraname2);
//     console.log(request.body.accountno);
    
    
//     console.log(request.body.token);

//     console.log('req bill fetch Insurance-1');
//     const databillfetch = await funcbillfetch_Insurance(request.body.billerid,request.body.uniqueid,request.body.paraname,request.body.dob,request.body.paraname1,request.body.emailID,request.body.paraname2,request.body.accountno,request.body.token);

              
//       console.log(databillfetch.status_id);
//       console.log(databillfetch.billNumber);
//       console.log(databillfetch.amount);
//       console.log(databillfetch.name);
//       console.log(databillfetch.dueDate);
//       console.log(databillfetch.billdate);
//       console.log(databillfetch.reference_id);
//       console.log(databillfetch.additionalInfo);  
//        console.log(databillfetch.message);  

//       if(databillfetch.message =="Success")
//       {
//         const datainsertbillfetch = await  insert_transaction_billfetch_Insurance(request.body.userid,request.body.accountno,request.body.billerid,request.body.uniqueid,request.body.serviceprovidername,request.body.mobileno,databillfetch.amount,request.body.paidtype,request.body.category,request.body.paraname,request.body.token,databillfetch.billNumber,databillfetch.name,databillfetch.dueDate,databillfetch.billdate,databillfetch.reference_id,request.body.ip,databillfetch.message,databillfetch.additionalInfo);
     
//          console.log('yyyyyyyyyyyyyyyyyyyyyy');  
//         console.log(datainsertbillfetch.Message); 

//          response.json({
//                          status:"success",
//                          msg:datainsertbillfetch.Message,      
//                          transactionsID:datainsertbillfetch.transactionsID,
//                          serviceprovider:datainsertbillfetch.serviceprovider,
//                          billNumber:datainsertbillfetch.billNumber,
//                          customername:datainsertbillfetch.customername,
//                          BillDate:datainsertbillfetch.billdate, 
//                          DueDate:datainsertbillfetch.dueDate,
//                          referenceId:datainsertbillfetch.referenceId,   
                        
//                          paraname:request.body.paraname,  
//                          dob:request.body.dob,

//                          paraname1:request.body.paraname1,
//                          emailID:request.body.emailID,
//                          paraname2:request.body.paraname2,
//                          accountno:request.body.accountno,



//                          paidtype:datainsertbillfetch.paidtype,
//                          mobilenumber:datainsertbillfetch.mobilenumber,
//                          amount:datainsertbillfetch.amount,
//                          accountno:datainsertbillfetch.accountno,
                          
//                           billerid:datainsertbillfetch.billerid, 
//                           Paraname:datainsertbillfetch.Paraname, 
//                           token:datainsertbillfetch.token, 
                          
                         
//                        });


//       }
//       else{
//                   const datainsertbillfetch = await  insert_transaction_billfetch_Insurance(request.body.userid,request.body.accountno,request.body.provideid,request.body.uniqueid,request.body.serviceprovidername,request.body.mobileno,databillfetch.amount,request.body.paidtype,request.body.category,request.body.name,request.body.token,databillfetch.billNumber,databillfetch.name,databillfetch.dueDate,databillfetch.billdate,databillfetch.reference_id,request.body.ip,databillfetch.message);
//                     console.log('xxxxxxxxxxxxxxxxx');  
                  
//                   response.json({
//                          status:"failure",
//                          msg:datainsertbillfetch.Message,      
//                          transactionsID:datainsertbillfetch.transactionsID,
//                         token:datainsertbillfetch.token, 
//                        });

//       }



//     } catch(error){

//     }
    
// });

// async function funcbillfetch_Insurance(billerid,uniqueid,paraname,dob,paraname1,emailID,paraname2,accountno,token) {


// console.log('----a1----');
// console.log(billerid);
// console.log(uniqueid);
// console.log(paraname);
// console.log(dob);
// console.log(paraname1);
// console.log(emailID);
// console.log(paraname2);
// console.log(accountno);
// console.log(token);

// console.log('----a2----');

// var requestBody = JSON.stringify({"billerId":billerid,"client_id":uniqueid,"customerParams":[{"name":paraname,"value":dob},{"name":paraname1,"value":emailID},{"name":paraname2,"value":accountno}]});
// const response = await axios.post('https://erp.pay2all.in/api/bbps/fetch', requestBody, {
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`
//       }
//     });

//     const data = response.data;
//     console.log('API Response:', data);
//     return data;


// }
// async function insert_transaction_billfetch_Insurance(userid,accountno,provideid,myuniqueid,serviceprovidername,mobileno,amount,paidtype,category,paraname,token,billNumber,customername,dueDate,billdate,reference_id,ip, message,additionalInfo){

//     try{
        
//             const conn= await sql.connect(config);
//             const res =await conn.request()
//             .input("userid", userid)
//              .input("amount", amount)
//              .input("paidtype", paidtype)
//             .input("accountno", accountno)
//             .input("provideid", provideid)
//             .input("tranid", myuniqueid.toString())
//             .input("serviceprovidername", serviceprovidername)
//             .input("mobileno",mobileno)
//             .input("category", category)
//             .input("paraname", paraname)
//             .input("token", token)
//             .input("billNumber", billNumber)
//             .input("customername", customername)
//             .input("dueDate", dueDate)
//             .input("billdate", billdate)
//             .input("reference_id", reference_id)
//             .input("ip", ip)
//             .input("Remarks",message)
//              .input("additionalInfo",additionalInfo)
//             .execute("usp_insertTransaction_Insurance_billfetch");
//             const data = res.recordset[0];
//              console.log('sp Responsett:', data);
//             return data;

//     }catch(error){
//         console.log(error);
//     }

// }

// router.post("/billfetch_Insurance_payment", async  function(request, response){


//     try
//     {               

//     console.log('bill pay');

//       const getdatabalance= await getbalance(request.body.userid);
//       console.log(getdatabalance.MSG);
//       console.log(getdatabalance.Balance);

//      if(parseFloat(getdatabalance.Balance) >= parseFloat(request.body.amount))
//       {
    
//           const datapayreturn = await funcbillfetchpay_Insurance(request.body.accountno,request.body.referenceid,request.body.amount,request.body.billerid,request.body.uniqueid,request.body.name,request.body.mobileno,request.body.token,request.body.Paraname1,request.body.Paraname2);
    

//         console.log(datapayreturn.utr);
//         console.log(datapayreturn.message);
//         console.log(request.body.uniqueid);
     
//       if(datapayreturn.message.toString() =="success")
//       {
//                const returnrecharge = await update_transaction(request.body.userid,request.body.uniqueid,'success',datapayreturn.utr,datapayreturn.message,'wallet')
                    

//                        response.json({
//                          status:"success",
//                          transactionsID:returnrecharge[0].transactionsID,
//                          serviceprovider:returnrecharge[0].serviceprovider,
//                          paidtype:returnrecharge[0].paidtype,
//                          mobilenumber:returnrecharge[0].mobilenumber,
//                          accountno:returnrecharge[0].accountno,
//                          amount:returnrecharge[0].amount,
//                          msg:returnrecharge[0].Message,             
//                        });

        


//       }
//       else{
//                    update_transaction(request.body.userid,request.body.uniqueid,'failure',datarecharge.utr,datarecharge.message,'wallet')

//                         response.json({
//                          status:"failure",
//                           msg:datarecharge.message,             
//                        });

//       }

      
//     }
//     else{
//         response.json({
//                          status:"failure",
//                           msg:"Insufficient Balance",                  
//                        });

//     }

//     } catch(error){





//     }
  
    
// });

// async function funcbillfetchpay_Insurance(accountno,referenceid,amount,billerid,uniqueid,name,mobileno,token, paraname1, paraname2) {
  
// // var requestBody = JSON.stringify({"billerId":billerid,"client_id":uniqueid,"customerParams":[{"name":name,"value":mobileno}]});
// var requestBody = JSON.stringify({"reference_id":referenceid,"amount":amount,"billerId":billerid,"mobile_number":mobileno,"client_id":uniqueid,"customerParams":[{"name":paraname1,"value":accountno},{"name":paraname2,"value":mobileno}]});
// const response = await axios.post('https://erp.pay2all.in/api/bbps/payment', requestBody, {
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`
//       }
//     });



//     const data = response.data;
//     console.log('API Billpay Response:', data);
//     return data;


// }

// //Insurance END






// router.post("/billfetchpayment", async  function(request, response){


//     try
//     {               

//     console.log('bill pay');

//       const getdatabalance= await getbalance(request.body.userid);
//       console.log(getdatabalance.MSG);
//       console.log(getdatabalance.Balance);

//      if(parseFloat(getdatabalance.Balance) >= parseFloat(request.body.amount))
//       {
    
//           const datapayreturn = await funcbillfetchpay(request.body.accountno,request.body.referenceid,request.body.amount,request.body.billerid,request.body.uniqueid,request.body.name,request.body.mobileno,request.body.token);
    

//         console.log(datapayreturn.utr);
//         console.log(datapayreturn.message);
//         console.log(request.body.uniqueid);
     
//       if(datapayreturn.message.toString() =="success")
//       {
//                const returnrecharge = await update_transaction(request.body.userid,request.body.uniqueid,'success',datapayreturn.utr,datapayreturn.message,'wallet')
                    

//                        response.json({
//                          status:"success",
//                          transactionsID:returnrecharge[0].transactionsID,
//                          serviceprovider:returnrecharge[0].serviceprovider,
//                          paidtype:returnrecharge[0].paidtype,
//                          mobilenumber:returnrecharge[0].mobilenumber,
//                          accountno:returnrecharge[0].accountno,
//                          amount:returnrecharge[0].amount,
//                          msg:returnrecharge[0].Message,             
//                        });

        


//       }
//       else{
//                    update_transaction(request.body.userid,request.body.uniqueid,'failure',datarecharge.utr,datarecharge.message,'wallet')

//                         response.json({
//                          status:"failure",
//                           msg:datarecharge.message,             
//                        });

//       }

      
//     }
//     else{
//         response.json({
//                          status:"failure",
//                           msg:"Insufficient Balance",                  
//                        });

//     }

//     } catch(error){





//     }
  
    
// });

// async function funcbillfetchpay(accountno,referenceid,amount,billerid,uniqueid,name,mobileno,token) {
  
//  console.log('--start credit card--');
//   console.log('--DIRECT PAYMENT--');
//   console.log(accountno);
//   console.log(referenceid);
//   console.log(amount);
//   console.log(billerid);
//   console.log(uniqueid);
//   console.log(name);
//   console.log(mobileno);
//     console.log(token);
// 	console.log('--end direct payment--');
// //// var requestBody = JSON.stringify({"billerId":billerid,"client_id":uniqueid,"customerParams":[{"name":name,"value":mobileno}]});
// //var requestBody = JSON.stringify({"reference_id":referenceid,"amount":amount,"billerId":billerid,"mobile_number":mobileno,"client_id":uniqueid,"customerParams":[{"name":name,"value":accountno}]});
// //const response = await axios.post('https://erp.pay2all.in/api/bbps/payment', requestBody, {
// //      headers: {
// //        'Content-Type': 'application/json',
// //       'Authorization': `Bearer ${token}`
//  //   }
//  //  });



//     const data = response.data;
//     console.log('API Billpay Response:', data);
//     return data;


// }


// async function getbalance(userid){

//     try{
        
//             const conn= await sql.connect(config);
//             const res =await conn.request()
//             .input("userid", userid)
//             .execute("USP_getbalance");
//             const data = res.recordset[0];
//              console.log('sp balance:', data);
//             return data;

//     }catch(error){
//         console.log(error);
//     }

// }



// //Mobile app
// router.post("/signin", function(request, response){


//     try
//     {

//         let order= {...request.body}
//         dboperations.signinapi(order).then(result => {
        
//            // console.log(result.recordsets);
    
           
//             if(result.recordsets[0][0].Valid=="TRUE")
//             {
             
//                 const user= {id:result.recordsets[0][0].ID};
    
//                 var data =  result.recordsets[0][0].UserID;
//                   // Encrypt
//                 var cipherUserID = CryptoJS.AES.encrypt(JSON.stringify(data), 'msecret-keys@9128').toString();
    
//                 const token = jwt.sign({USERID:user},"msecret-keys@9128", {expiresIn:"30m"});
//                 response.json({
//                     token:token,
//                     status:"success",
//                     msg:'Valid',
//                     id:result.recordsets[0][0].ID,
//                     UserID:result.recordsets[0][0].USERID,
//                     FullName:result.recordsets[0][0].FullName,
//                     EmailID:result.recordsets[0][0].EMailId,
//                     valid:result.recordsets[0][0].Valid,
//                     url:result.recordsets[0][0].URL,
//                     clientID:result.recordsets[0][0].ClientID,
//                     clientsecrect:result.recordsets[0][0].ClientSecrect,
//                     ismember:'1',
//                     Encrypt:cipherUserID
//                 });

        
//              }
//              else{
//                 response.json({
                    
//                     status:"failure",
//                     msg:'Invalid UserID or Password',
            
//                 });
//              }
//         });


//     } catch(error){

//     }
  
    
// });


// router.post("/register", function(request, response){


//     try
//     {

//         let order= {...request.body}
//         dboperations.registerapi(order).then(result => {
        
//            // console.log(result.recordsets);
    
           
//             if(result.recordsets[0][0].ISSUCCESS=="TRUE")
//             {
//                 const user= {id:result.recordsets[0][0].ID};
    
//                 var data =  result.recordsets[0][0].UserID;
//                   // Encrypt
//                 var cipherUserID = CryptoJS.AES.encrypt(JSON.stringify(data), 'msecret-keys@9128').toString();
    
//                 const token = jwt.sign({USERID:user},"msecret-keys@9128", {expiresIn:"30m"});
//                 response.json({
//                     token:token,
//                     status:"success",
//                     msg:'Valid',
//                     id:result.recordsets[0][0].ID,
//                     UserID:result.recordsets[0][0].Userid,
//                     FullName:result.recordsets[0][0].NAME,
//                     EmailID:result.recordsets[0][0].EMailId,
//                     ismember:'1'
                   
//                 });
        
//              }
//              else{
//                 response.json({
                    
//                     status:"failure",
//                     msg:'Invalid UserID or Password',
            
//                 });
//              }
//         });


//     } catch(error){

//     }
  
    
// });

// router.post("/welcome", function (request, response) {

//     try {


//         let order = { ...request.body }
//         dboperations.getwelcome(order).then(result => {

//             if (result != null) {
//                 console.log(result.recordsets[0])
//                 response.json({
//                     data: result.recordsets[0],

//                 });
//             }


//         });

//     }
//     catch (error) {

//     }





// });



// router.post("/getmemerdashboard", function(request, response){

//     let order= {...request.body}
//     dboperations.getmemberdashboard(order).then(result => {
    
//        console.log(result.recordsets);
//       response.json(result["recordsets"][0]);
          
    
//     });
    
// });

// router.post("/operatorlist", function (request, response) {

//     let order = { ...request.body }
//     dboperations.getoperatorlist(order).then(result => {

//         console.log(result);
//         response.json(result["recordsets"][0]);

//     });

// });



// router.post("/updatename", function(request, response){

//     let order= {...request.body}
//     dboperations.getupdatename(order).then(result => {
    
//           if(result !=null){
//                 //console.log(result.recordsets[0])
//                 console.log(result["recordsets"][0]);

//              for (var i = 0; i < result.recordsets[0].length; i++) 
//              {
//                      console.log(result.recordsets[0][i].billerId);
//                    update(result.recordsets[0][i].billerId)
                  
//              }

//             }
//     });
    
// });
// async function update(billerid) {
  

// var requestBody = JSON.stringify({});
// const response = await axios.get('https://erp.pay2all.in/api/bbps/biller/'+billerid, {
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer 384934|g6H1T6OlCnAgcjUxx4SX077OHjQ46LShConTyvih065de865`
//       }
//     });


//                                 const data = response.data;
//                                      console.log(data);
//                                    console.log(billerid);
//                                     console.log(billerid+':', data.biller[0].customerParams.paramName);
//                                     const conn = await sql.connect(config);
//                                     const resg =  await conn.request()
//                                     .input("name", data.biller[0].customerParams.paramName)
//                                     .input("billerid", billerid)
//                                     .execute("USP_UpdateCustomername");
//    // return data;
// }

// router.post("/billpay", async  function(request, response){

//     try
//     {               

//     console.log('req');

//     const data1 = await funcbillfetchpay(request.body.accountno,request.body.referenceid,request.body.amount,request.body.billerid,request.body.uniqueid,request.body.name,request.body.mobileno,request.body.token);
//         if (data1) {

//                  console.log('Response');
//                   response.json({
                   
//                     status:"success",
//                     msg:'Valid',
//                     message:data1,
                   
//                 });


//         // await insertIntoDb(data);
//         }
              

     


//     } catch(error){

//     }
  
    
// });

// router.post("/billerparaname", function (request, response) {

//     let order = { ...request.body }
//     dboperations.getbillerparaname(order).then(result => {

//         console.log(result);
//         response.json(result["recordsets"][0][0]);

//     });

// });




// router.post("/getprofile", function (request, response) {

//     console.log('*111***1')
//     let order = { ...request.body }
//     const token1 = request.header('Authorization');
//     console.log('*111***2')
  
//     dboperations.getprofileadmin(order).then(result => {

//         if (result != null) {
//             console.log(result.recordsets[0])
//             response.json({
//                 statuscode:1,
//                 data: result.recordsets[0],


//             });
//         }
//     });
 
// });


// router.post("/updateprofile", function (request, response) {

//     let order = { ...request.body }

   
//     dboperations.updateprofileadmin(order).then(result => {

//         if (result != null) {
//             console.log(result.recordsets[0])
//             response.json({

//                 statuscode:1, 

//                  data: result.recordsets[0],

//             });
//         }
//     });


// });

// router.post("/updatememberpassword", function (request, response) {

//     let order = { ...request.body }
   
//     dboperations.updatepassword(order).then(result => {

//         if (result != null) {
//             console.log(result.recordsets[0])
//             response.json({
//                 statuscode:1,
//                 data: result.recordsets[0],


//             });
//         }
//     });
   

// });

// router.post("/transactiondtls", function (request, response) {

//        console.log('start');
//     let order = { ...request.body }

//     dboperations.gettransactiondetails(order).then(result => {

//         if (result != null) {
//             console.log(result.recordsets[0])
//             response.json({
//                 statuscode:1,
//                 data: result.recordsets[0],

//             });
//         }
//     });
  

// });


// router.post("/commissiondtls", function (request, response) {

//     let order = { ...request.body }

//     dboperations.getcommissiondetails(order).then(result => {

//         if (result != null) {
//             console.log(result.recordsets[0])
//             response.json({
//                 statuscode:1,
//                 data: result.recordsets[0],

//             });
//         }
//     });
  

// });

// router.post("/fundreport", function (request, response) {

//     let order = { ...request.body }

//     dboperations.getfundreport(order).then(result => {

//         if (result != null) {
//             console.log(result.recordsets[0])
//             response.json({
//                 statuscode:1,
//                 data: result.recordsets[0],

//             });
//         }
//     });
  

// });



// router.route('/BillerList').post((request, response) => {

//     try {
//         dboperations.getbillerlist().then(result => {
//             console.log(result);
//             response.json(result["recordsets"][0]);
//         })
//     }
//     catch (error) {

//     }

// });





// // API endpoint to get search suggestions
// router.get("/search",async function (req, res) {

//   const { query } = req.query;
  
//   try {
//     const pool = await sql.connect(config);
//     const result = await pool.request()
//       .input('searchQuery', sql.NVarChar, `%${query}%`)
//       .query('SELECT billerId, billerName FROM tblBillerList WHERE billerName LIKE @searchQuery');
    
//     res.json(result.recordset);
//   } catch (err) {
//     console.error('SQL error', err);
//     res.status(500).json({ error: 'Database error' });
//   }
// });

// // API endpoint to get all items for dropdown
// router.get("/items",async function (req, res) {

//   try {
//     const pool = await sql.connect(config);
//     const result = await pool.request()
//       .query('SELECT billerId, billerName FROM tblBillerList');
    
//     res.json(result.recordset);
//   } catch (err) {
//     console.error('SQL error', err);
//     res.status(500).json({ error: 'Database error' });
//   }
// });



// // Get daily data

// router.post("/data",async function (req, res) {

// if(req.body.data=='daily')
// {
//   console.log(req.body.userId);
//     try {
//     const pool = await sql.connect(config);
//     const result = await pool.request()
//        .input('searchQuery', sql.NVarChar, `${req.body.userId}`)
//       .query('SELECT CAST(Ondate AS DATE) as date, SUM(amount) as value FROM tblTransaction_Recharge WHERE  MemberID= (select MemberID from tblLogin where USERID=@searchQuery) and Ondate >= DATEADD(day, -30, GETDATE()) GROUP BY CAST(Ondate AS DATE) ORDER BY date');
    
//        console.log(result.recordset);
//     res.json(result.recordset);
//   } catch (err) {
//     console.error('SQL error', err);
//     res.status(500).json({ error: 'Database error' });
//   }
// }
// else if(req.body.data=='weekly')
// {

//     try {
//        console.log(req.body.userId);
//     const pool = await sql.connect(config);
//     const result = await pool.request()
//      .input('searchQuery', sql.NVarChar, `${req.body.userId}`)
//       .query('SELECT DATEPART(year, Ondate) as year, DATEPART(week, Ondate) as week, SUM(amount) as value FROM tblTransaction_Recharge WHERE MemberID= (select MemberID from tblLogin where USERID=@searchQuery) and Ondate >= DATEADD(week, -12, GETDATE()) GROUP BY DATEPART(year, Ondate), DATEPART(week, Ondate) ORDER BY year, week ');
    
//        console.log(result.recordset);
//     res.json(result.recordset);
//   } catch (err) {
//     console.error('SQL error', err);
//     res.status(500).json({ error: 'Database error' });
//   }
// }

// else if(req.body.data=='quarterly')
// {

//     try {
//     const pool = await sql.connect(config);
//     const result = await pool.request()
//      .input('searchQuery', sql.NVarChar, `${req.body.userId}`)
//       .query('SELECT DATEPART(year, Ondate) as year, (DATEPART(week, Ondate) / 3) as quarterly, SUM(amount) as value FROM tblTransaction_Recharge WHERE MemberID= (select MemberID from tblLogin where USERID=@searchQuery) and Ondate >= DATEADD(month, -6, GETDATE())  GROUP BY DATEPART(year, Ondate), (DATEPART(week, Ondate) / 3) ORDER BY year, quarterly');
    
//        console.log(result.recordset);
//     res.json(result.recordset);
//   } catch (err) {
//     console.error('SQL error', err);
//     res.status(500).json({ error: 'Database error' });
//   }
// }

// else if(req.body.data=='monthly')
// {

//     try {
//     const pool = await sql.connect(config);
//     const result = await pool.request()
//      .input('searchQuery', sql.NVarChar, `${req.body.userId}`)
//       .query('SELECT  DATEPART(year, Ondate) as year, DATEPART(month, Ondate) as month,SUM(amount) as value FROM tblTransaction_Recharge WHERE MemberID= (select MemberID from tblLogin where USERID=@searchQuery) and Ondate >= DATEADD(year, -2, GETDATE()) GROUP BY DATEPART(year, Ondate), DATEPART(month, Ondate) ORDER BY year, month  ');
    
//        console.log(result.recordset);
//     res.json(result.recordset);
//   } catch (err) {
//     console.error('SQL error', err);
//     res.status(500).json({ error: 'Database error' });
//   }
// }


// });



// router.post("/circle-chart-data",async function (req, res) {

//   try {
//     // Connect to the database
//        const pool = await sql.connect(config);
    
 
//     const result = await pool.request()
//      .input('searchQuery', sql.NVarChar, `${req.body.userId}`)
//      .query('select distinct  B.billerCategoryName as category ,ISNULL((select SUM(T.amount) from tblTransaction_Recharge T where T.Category=B.billerCategoryName and T.MemberID=(select L.MEMBERID from tblLogin L where L.USERID=@searchQuery)),0) as value from tblBillerList B');
    
//       console.log(result.recordset);
//     res.json(result.recordset);
//   } catch (err) {
//     console.error('Error fetching chart data:', err);
//     res.status(500).send('Server error');
//   } finally {
//     sql.close();
//   }
// });


// router.get("/testcall", async  function(request, response){
//     try
//     {               
        
//         response.json({
                
//                 data: 'ALL DATA',


//         });


//     console.log('req');
//     } catch(error){

//     }
  
    
// });



// // Serve React app in production
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static('client/build'));
  
//   app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
//   });
// }




// app.get("/", (req,res) => {
//     res.send("Hello get data..................");
// });

// app.get("/a1", (req,res) => {
//     res.send("get data..................");
// });


// app.listen(port, () => {
//     console.log("Server started on port 8080");
// });






// const config={
//     user:"sa",
//     password:"sam@000000",
//     server:"207.180.212.179",
//     database:"DB_Moniespay_New",
//     options: {
//         encrypt:false,
//         useUTC:true,
//     },
//     port : 1433,
// };

// module.exports= config








// ////// end txg global




// //mobile app api start

// async function signinapi(prod){

//     try{
//             console.log(prod.email);
//             console.log(prod.password);
            
//             const conn= await sql.connect(config);
//             const res =await conn.request()
//             .input("USERID",prod.email)
//             .input("PASSWORD",prod.password)
//             .input("IP",prod.ip)
//             .input("URL","")
            
//             .input("DeviceID",prod.diviceid)
//             .input("Brand",prod.brand)
//             .input("Deviemodel",prod.divicemodel)

//             .input("Browser",prod.browser)
//             .input("Browsername",prod.browsername)
//             .input("Version",prod.version)
//             .execute("USP_VALIDATELOGIN_NEW");
//             return res;
//     }catch(error){
//         console.log(error);
//     }

// }


// async function registerapi(prod){

//     try{
//             console.log(prod.email);
//             console.log(prod.password);
            
//             const conn= await sql.connect(config);
//             const res =await conn.request()
//             .input("RegisterType",prod.type)
//             .input("Name",prod.name)
//             .input("MobileNo",prod.mobileNo)
//             .input("EmailID",prod.emailid)
//             .input("Password",prod.password)
            
//             .input("COUNTRY",prod.country)
//             .input("SPONSORID",prod.SPONSORID)
//             .input("IP",prod.ip)
//             .input("URL","")
            
//             .input("DeviceID",prod.diviceid)
//             .input("Brand",prod.brand)
//             .input("Deviemodel",prod.divicemodel)

//             .input("Browser",prod.browser)
//             .input("Browsername",prod.browsername)
//             .input("Version",prod.version)

//             .execute("Usp_Register");
//             return res;
//     }catch(error){
//         console.log(error);
//     }

// }

// async function getwelcome(prod)
// {
//     console.log('prod.memberid--1');
//      console.log(prod.memberid);
//      console.log('prod.memberid--2');
//           try{
            
//             const conn= await sql.connect(config);
//             const res =await conn.request()
//             .input("UserID",prod.memberid)
          
//             .execute("USP_GetWelComeLetterDt");
//             return res;
                          
//           }catch(error){
//               console.log(error);
//           }
      
// }

// async function getmemberdashboard(prod){

//     // Decrypt
   
//       try{
//               const conn= await sql.connect(config);
//               const res =await conn.request()
//               .input("USERID",prod.userid)
//               .execute("USP_GetCustomerDashBoardDtls");
//               return res;
//       }catch(error){
//           console.log(error);
//       }
  
//   }



// async function getoperatorlist(prod){

//     try{

//         console.log(prod.catid)
//             const conn= await sql.connect(config);
//             const res =await conn.request()
//             .input("Category",prod.catid)
//             .execute("USP_getOperatorlist");
//             return res;
//     }catch(error){
//         console.log(error);
//     }

// }


// async function getbillerparaname(prod){

//     try{

//         console.log(prod.catid)
//             const conn= await sql.connect(config);
//             const res =await conn.request()
//             .input("billerid",prod.billerid)
//             .execute("usp_getbillerinfo");
//             return res;
//     }catch(error){
//         console.log(error);
//     }

// }




// async function getprofileadmin(prod){

//     try{
        
//       const conn= await sql.connect(config);
//             const res =await conn.request()
//             .input("MemberID",prod.userId)
//             .execute("USP_GetMemberDetailsByMemberID");
//             return res;
//     }catch(error){
//         console.log(error);
//     }

// }
// async function getupdatename(prod){

//     try{
        
//       const conn= await sql.connect(config);
//             const res =await conn.request()
          
//             .execute("USP_billerid");
//             return res;
//     }catch(error){
//         console.log(error);
//     }

// }


//   async function getprofileadmin(prod){

//     try{
        
//       const conn= await sql.connect(config);
//             const res =await conn.request()
//             .input("MemberID",prod.userId)
//             .execute("USP_GetMemberDetailsByMemberID");
//             return res;
//     }catch(error){
//         console.log(error);
//     }

// }


// async function updateprofileadmin(prod){


//     try{
//       const conn= await sql.connect(config);
//             const res =await conn.request()
//             .input("TITLE","Mr")
//              .input("STATE","")
//             .input("COUNTRY",prod.country)
//             .input("Name",prod.name)
//             .input("ADDRESS",prod.address)
//             .input("PINCODE",prod.pincode)
//             .input("MOBILENO",prod.mobile)
//             .input("EMAILID",prod.email)
//             .input("DOB",prod.dob)
//             .input("MEMBERID",prod.userId)
        
//             .execute("USP_EditRegistration");
//             return res;
//     }catch(error){
//         console.log(error);
//     }

// }

// async function updatepassword(prod){

//     try{
        
//         console.log(prod.userid);
//         console.log('update change Req--1');
//         console.log(prod.oldPassword);
//         console.log(prod.newPassword);

//             const conn= await sql.connect(config);
//             const res =await conn.request()
//             .input("userid",prod.userid)
//             .input("oldpassword",prod.oldPassword)
//             .input("newpassword",prod.newPassword)
           
//             .execute("USP_UpdateMemberPassword");
//             return res;
//     }catch(error){
//         console.log(error);
//     }

// }



// async function gettransactiondetails(prod){
    
//     try{  
      

                     

//             const conn= await sql.connect(config);
//             const res =await conn.request()

//             .input("Userid",prod.userId)
//             .input("StartDate",prod.fromdt)
//             .input("EndDate",prod.todt)
//             .input("CustomerID",prod.customerNumber)
//             .input("ProviderID",prod.providerid)
//             .input("pageno",prod.page)
//             .input("PageSize",prod.limit)
//             .input("RecordCount", 10)
//             .execute("USP_getTransactionDtls_Pagination");
//             return res;

            

//     }catch(error){
//         console.log(error);
//     }
    
//  }



// async function getcommissiondetails(prod){
    
//     try{  
      
     
//             const conn= await sql.connect(config);
//             const res =await conn.request()

//             .input("Userid",prod.userId)
//             .input("StartDate",prod.fromdt)
//             .input("EndDate",prod.todt)
//             .input("pageno",prod.page)
//             .input("PageSize",prod.limit)
//             .input("RecordCount", 10)
//             .execute("USP_getCommissionDtls_Pagination");
//             return res;

            

//     }catch(error){
//         console.log(error);
//     }
    
//  }


// async function getfundreport(prod){
    
//     try{  
      
     
//             const conn= await sql.connect(config);
//             const res =await conn.request()

//             .input("Userid",prod.userId)
//             .input("StartDate",prod.fromdt)
//             .input("EndDate",prod.todt)
//             .input("pageno",prod.page)
//             .input("PageSize",prod.limit)
//             .input("RecordCount", 10)
//             .execute("USP_getFundReport_Pagination");
//             return res;

            

//     }catch(error){
//         console.log(error);
//     }
    
//  }

// async function getbillerlist(){


//     try{

//      const conn= await sql.connect(config);
//      const res =await conn.request()
//     .execute("USP_GetBillerLIst");
//      return res;

//     }catch(error){
//         console.log(error);
//     }
// }





// //mobile app  end
// module.exports ={

//     /////  global
   

//     getprofileadmin:getprofileadmin,
   
//     //mobileapp
//     signinapi:signinapi,
//     getmemberdashboard:getmemberdashboard,
//     getupdatename:getupdatename,
//     getoperatorlist:getoperatorlist,
//     getbillerparaname:getbillerparaname,
//     getprofileadmin:getprofileadmin,
//     updateprofileadmin:updateprofileadmin,
//     updatepassword:updatepassword,
//     gettransactiondetails:gettransactiondetails,
//     getcommissiondetails:getcommissiondetails,
//     getbillerlist:getbillerlist,
//     getfundreport:getfundreport,
//     registerapi:registerapi,
//     getwelcome:getwelcome

  

   
// }