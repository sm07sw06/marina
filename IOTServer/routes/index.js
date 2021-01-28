var express = require('express');
var router  = express.Router();
var fs      = require('fs');
var multer  = require('multer'); 

var app = express();

var dir = './uploadedFiles';
if (!fs.existsSync(dir)) fs.mkdirSync(dir); // 2

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

 
var storage  = multer.diskStorage({ // 2
  destination(req, file, cb) {
    cb(null, 'uploadedFiles/');
  },
  filename(req, file, cb) {
	  cb(null, `${Date.now()}__${file.originalname}`);
  },
});
var upload = multer({ storage: storage }); 
//var upload = multer({ dest: 'uploadedFiles/' }); // 3-1
//var uploadWithOriginalFilename = multer({ storage: storage }); // 3-2
 
	
router.post('/uploadFile', upload.single('attachment'), function(req,res){
	console.log(req.file.originalname)
	console.log(req.cameraId)
	res.render('confirmation', { file:req.file, files:null });
});

module.exports = router;


/**

var form = new FormData();
form.append("attachment", "C:\\Users\\dhlee\\Pictures\\20210112_172133.jpg");
form.append("cameraId", "1234567890");

var settings = {
  "async": true,
  "crossDomain": true,
  "url": "http://localhost:3000/uploadfile",
  "method": "POST",
  "headers": {
    "cache-control": "no-cache",
    "Postman-Token": "236202ff-fbe1-4e22-9b57-8c19cea36a7b"
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
   { 'Postman-Token': '7db11a39-88c8-42f9-9bf3-d4368f4d3b1b',
     'cache-control': 'no-cache',
     'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' },
  formData: 
   { attachment: 
      { value: 'fs.createReadStream("C:\\Users\\dhlee\\Pictures\\20210112_172133.jpg")',
        options: 
         { filename: 'C:\\Users\\dhlee\\Pictures\\20210112_172133.jpg',
           contentType: null } },
     cameraId: '1234567890' } };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});


**/
