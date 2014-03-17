var url=require('url'),
  parserMgr=require('./csvparser'),
  csv = require("csv"),
  Step = require("step"),
  fs = require('fs'),
  centers = {};

Step(
  function getCenters(){
    parserMgr.parseCenters(this);
  },
  function returnCenters(err,result){
    centers = result;
  }
);
  
exports.getMgr = {

  handleGetIndex : function (req,res,cb){
    //var centers = parserMgr.parseCenters();
    res.locals.centers=centers;
    cb(res);

  },
}
        
