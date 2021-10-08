var express = require("express");
var router = express.Router();
const multer = require("multer");
const nodemailer = require("nodemailer");
/* GET home page. */
router.get("/", (req, res) => {
  res.render("index");
});

var to;
var subject;
var body;
var path;

var Storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./images");
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});

var upload = multer({
  storage: Storage,
}).array("image", 2);

router.get("/", (req, res) => {
  res.render("index");
});

router.post("/sendemail", (req, res) => {
  upload(req, res, function (err) {
    if (err) {
      console.log(err);
      return res.end("Something went wrong!");
    } else {
      to = req.body.to;
      subject = req.body.subject;
      body = req.body.body;
      // path = req.file.path
      // console.log(to)
      // console.log(subject)
      // console.log(body)
      // console.log(req.file)
      // console.log(req.files)
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "pr3380611@gmail.com",
          pass: "Dixit@000",
        },
      });

      //   var tables = [
      //     { "art":"A","count":"0","name":"name1","ean":"802.0079.127","marker":"null","stammkost":"A","tablename":"IWEO_IWBB_01062015" },
      //     { "art":"A","count":"0","name":"2","ean":"657.7406.559","marker":"null","stammkost":"A","tablename":"IWEO_IWBB_02062015" }
      // ];

      // tables.forEach(function(table) {
      //     var tableName = table.name;
      //     console.log(tableName);
      // });

      console.log("Attachment List", req.files[0]);
      var attachementList = [];
      req.files.forEach(function (fileData) {
        attachementList.push({
          filename: fileData.originalname,
          path: fileData.path,
        });
      });
      // function attachmentList(req, res, next) {
      //   var attachementList = [];
      //   for (var i = 0; i < req.files.leg; i++) {
      //     attachementList.push({ filename: req.files[i].originalname, path: req.files[i].path })
      //   }
      // }
      // attachmentList();
      console.log("Attachments ", attachementList);
      var mailOptions = {
        from: "pr3380611@gmail.com",
        to: to,
        subject: subject,
        text: body,
        attachments: attachementList,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log("Send Mail ", error);
        } else {
          res.send("<h1>E-mail Sent</h1>");
          // fs.unlink(path, function (err) {
          //   if (err) {
          //     return res.end(err)
          //   } else {
          //     console.log("deleted")
          //     return res.send('Email sent')
          //   }
          // })
        }
      });
    }
  });
});

module.exports = router;
