var express = require('express');
var router  = express.Router();
var fs      = require('fs');
var multer  = require('multer'); 

var app = express();

var dir = './uploadedFiles';
if (!fs.existsSync(dir)) {
	fs.mkdirSync(dir); 
}

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});

 
var storage  = multer.diskStorage({  
	destination(req, file, cb) {
		cb(null, 'uploadedFiles/');
	},
	filename(req, file, cb) {
		cb(null, `${Date.now()}__${file.originalname}`);
	},
});
var upload = multer({ storage: storage }); 
	
router.post('/uploadFile', upload.single('attachment'), function(req,res){
	console.log("index1:"+req.file.originalname)
	console.log("index2:"+req.cameraId)
	res.render('confirmation', { file:req.file.originalname, files:null });
});

module.exports = router;


/**

var form = new FormData();
form.append("attachment", "C:\\Users\\dhlee\\Pictures\\APR2020_1920x1080.png");
form.append("cameraId", "1234567890");
form.append("sendtime", "20210128101010");

var settings = {
  "async": true,
  "crossDomain": true,
  "url": "http://localhost:3000/uploadfile",
  "method": "POST",
  "headers": {
    "cache-control": "no-cache",
    "Postman-Token": "7e64c887-12a6-4637-9c5b-b532a850c553"
  },
  "processData": false,
  "contentType": false,
  "mimeType": "multipart/form-data",
  "data": form
}

$.ajax(settings).done(function (response) {
  console.log(response);
});




var fs = require("fs");
var request = require("request");

var options = { method: 'POST',
  url: 'http://localhost:3000/uploadfile',
  headers: 
   { 'Postman-Token': 'a3274671-f7a8-4ce8-a7f5-8ab625bac0f7',
     'cache-control': 'no-cache',
     'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' },
  formData: 
   { attachment: 
      { value: 'fs.createReadStream("C:\\Users\\dhlee\\Pictures\\APR2020_1920x1080.png")',
        options: 
         { filename: 'C:\\Users\\dhlee\\Pictures\\APR2020_1920x1080.png',
           contentType: null } },
     cameraId: '1234567890',
     sendtime: '20210128101010' } };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});


**/
