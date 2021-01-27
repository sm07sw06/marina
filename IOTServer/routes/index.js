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
var upload = multer({ dest: 'uploadedFiles/' }); // 3-1
var uploadWithOriginalFilename = multer({ storage: storage }); // 3-2

	
router.post('/uploadFile', upload.single('attachment'), function(req,res,next){ // 4 
  res.render('confirmation', { file:req.file, files:null });
});

module.exports = router;


