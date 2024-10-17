const express=require('express');
const{handlegenerateNewShortURL,handlegetAnalytics}=require("../controllers/url");
const router=express.Router();

router.post('/',handlegenerateNewShortURL);

router.get("/analytics/:shortId",handlegetAnalytics);
module.exports=router;