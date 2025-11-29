var config = require('./dbconfig');
const sql = require("mssql");
const jwt = require('jsonwebtoken')
const cookieParser =require('cookie-parser')
var CryptoJS = require("crypto-js");





////// end txg global




//mobile app api start

async function signinapi(prod){

    try{
            console.log(prod.email);
            console.log(prod.password);
            
            const conn= await sql.connect(config);
            const res =await conn.request()
            .input("USERID",prod.email)
            .input("PASSWORD",prod.password)
            .input("IP",prod.ip)
            .input("URL","")
            
            .input("DeviceID",prod.diviceid)
            .input("Brand",prod.brand)
            .input("Deviemodel",prod.divicemodel)

            .input("Browser",prod.browser)
            .input("Browsername",prod.browsername)
            .input("Version",prod.version)
            .execute("USP_VALIDATELOGIN_NEW");
            return res;
    }catch(error){
        console.log(error);
    }

}


async function registerapi(prod){

    try{
            console.log(prod.email);
            console.log(prod.password);
            
            const conn= await sql.connect(config);
            const res =await conn.request()
            .input("RegisterType",prod.type)
            .input("Name",prod.name)
            .input("MobileNo",prod.mobileNo)
            .input("EmailID",prod.emailid)
            .input("Password",prod.password)
            
            .input("COUNTRY",prod.country)
            .input("SPONSORID",prod.SPONSORID)
            .input("IP",prod.ip)
            .input("URL","")
            
            .input("DeviceID",prod.diviceid)
            .input("Brand",prod.brand)
            .input("Deviemodel",prod.divicemodel)

            .input("Browser",prod.browser)
            .input("Browsername",prod.browsername)
            .input("Version",prod.version)

            .execute("Usp_Register");
            return res;
    }catch(error){
        console.log(error);
    }

}

async function getwelcome(prod)
{
    console.log('prod.memberid--1');
     console.log(prod.memberid);
     console.log('prod.memberid--2');
          try{
            
            const conn= await sql.connect(config);
            const res =await conn.request()
            .input("UserID",prod.memberid)
          
            .execute("USP_GetWelComeLetterDt");
            return res;
                          
          }catch(error){
              console.log(error);
          }
      
}

async function getmemberdashboard(prod){

    // Decrypt
   
      try{
              const conn= await sql.connect(config);
              const res =await conn.request()
              .input("USERID",prod.userid)
              .execute("USP_GetCustomerDashBoardDtls");
              return res;
      }catch(error){
          console.log(error);
      }
  
  }



async function getoperatorlist(prod){

    try{

        console.log(prod.catid)
            const conn= await sql.connect(config);
            const res =await conn.request()
            .input("Category",prod.catid)
            .execute("USP_getOperatorlist");
            return res;
    }catch(error){
        console.log(error);
    }

}


async function getbillerparaname(prod){

    try{

        console.log(prod.catid)
            const conn= await sql.connect(config);
            const res =await conn.request()
            .input("billerid",prod.billerid)
            .execute("usp_getbillerinfo");
            return res;
    }catch(error){
        console.log(error);
    }

}













async function getprofileadmin(prod){

    try{
        
      const conn= await sql.connect(config);
            const res =await conn.request()
            .input("MemberID",prod.userId)
            .execute("USP_GetMemberDetailsByMemberID");
            return res;
    }catch(error){
        console.log(error);
    }

}
async function getupdatename(prod){

    try{
        
      const conn= await sql.connect(config);
            const res =await conn.request()
          
            .execute("USP_billerid");
            return res;
    }catch(error){
        console.log(error);
    }

}


  async function getprofileadmin(prod){

    try{
        
      const conn= await sql.connect(config);
            const res =await conn.request()
            .input("MemberID",prod.userId)
            .execute("USP_GetMemberDetailsByMemberID");
            return res;
    }catch(error){
        console.log(error);
    }

}


async function updateprofileadmin(prod){


    try{
      const conn= await sql.connect(config);
            const res =await conn.request()
            .input("TITLE","Mr")
             .input("STATE","")
            .input("COUNTRY",prod.country)
            .input("Name",prod.name)
            .input("ADDRESS",prod.address)
            .input("PINCODE",prod.pincode)
            .input("MOBILENO",prod.mobile)
            .input("EMAILID",prod.email)
            .input("DOB",prod.dob)
            .input("MEMBERID",prod.userId)
        
            .execute("USP_EditRegistration");
            return res;
    }catch(error){
        console.log(error);
    }

}

async function updatepassword(prod){

    try{
        
        console.log(prod.userid);
        console.log('update change Req--1');
        console.log(prod.oldPassword);
        console.log(prod.newPassword);

            const conn= await sql.connect(config);
            const res =await conn.request()
            .input("userid",prod.userid)
            .input("oldpassword",prod.oldPassword)
            .input("newpassword",prod.newPassword)
           
            .execute("USP_UpdateMemberPassword");
            return res;
    }catch(error){
        console.log(error);
    }

}



async function gettransactiondetails(prod){
    
    try{  
      

                     

            const conn= await sql.connect(config);
            const res =await conn.request()

            .input("Userid",prod.userId)
            .input("StartDate",prod.fromdt)
            .input("EndDate",prod.todt)
            .input("CustomerID",prod.customerNumber)
            .input("ProviderID",prod.providerid)
            .input("pageno",prod.page)
            .input("PageSize",prod.limit)
            .input("RecordCount", 10)
            .execute("USP_getTransactionDtls_Pagination");
            return res;

            

    }catch(error){
        console.log(error);
    }
    
 }



async function getcommissiondetails(prod){
    
    try{  
      
     
            const conn= await sql.connect(config);
            const res =await conn.request()

            .input("Userid",prod.userId)
            .input("StartDate",prod.fromdt)
            .input("EndDate",prod.todt)
            .input("pageno",prod.page)
            .input("PageSize",prod.limit)
            .input("RecordCount", 10)
            .execute("USP_getCommissionDtls_Pagination");
            return res;

            

    }catch(error){
        console.log(error);
    }
    
 }


async function getfundreport(prod){
    
    try{  
      
     
            const conn= await sql.connect(config);
            const res =await conn.request()

            .input("Userid",prod.userId)
            .input("StartDate",prod.fromdt)
            .input("EndDate",prod.todt)
            .input("pageno",prod.page)
            .input("PageSize",prod.limit)
            .input("RecordCount", 10)
            .execute("USP_getFundReport_Pagination");
            return res;

            

    }catch(error){
        console.log(error);
    }
    
 }

async function getbillerlist(){


    try{

     const conn= await sql.connect(config);
     const res =await conn.request()
    .execute("USP_GetBillerLIst");
     return res;

    }catch(error){
        console.log(error);
    }
}





//mobile app  end
module.exports ={

    /////  global
   

    getprofileadmin:getprofileadmin,
   
    //mobileapp
    signinapi:signinapi,
    getmemberdashboard:getmemberdashboard,
    getupdatename:getupdatename,
    getoperatorlist:getoperatorlist,
    getbillerparaname:getbillerparaname,
    getprofileadmin:getprofileadmin,
    updateprofileadmin:updateprofileadmin,
    updatepassword:updatepassword,
    gettransactiondetails:gettransactiondetails,
    getcommissiondetails:getcommissiondetails,
    getbillerlist:getbillerlist,
    getfundreport:getfundreport,
    registerapi:registerapi,
    getwelcome:getwelcome

  

   
}