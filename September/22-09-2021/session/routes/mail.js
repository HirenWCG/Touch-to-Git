var express = require("express");
var router = express.Router();
var nodemailer = require("nodemailer");
const multer = require("multer");
const path = require("path");

router.get("/", (req, res) => {
  res.render("form");
});

const imageStorage = multer.diskStorage({
  // Destination to store image
  destination: "images",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const imageUpload = multer({
  storage: imageStorage,
  limits: {
    fileSize: 2000000, // 1000000 Bytes = 2 MB
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg)$/)) {
      // upload only png and jpg format
      return cb(new Error("Please upload a Image"));
    }
    cb(undefined, true);
  },
});

router.post("/", imageUpload.single("uploadfile"), (req, res) => {
  let name = req.body.name;
  let email = req.body.email;
  let subject = req.body.subject;
  let msg = req.body.message;
  let img = req.body.uploadfile;
  async function main() {
    let testAccount = await nodemailer.createTestAccount();

    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "herrypottar21@gmail.com", // generated ethereal user
        pass: "herry123!@#", // generated ethereal password
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Quick Inquiry" <herrypottar21@gmail.com>', // sender address
      to: email, // list of receivers
      subject: "Training 2021", // Subject line
      text: "Are you Intrested in NodeJS Training?", // plain text body
      html: `<html>
    <head>
      <style>
      </style>
    </head>
      <body>
      <div>
        <h3>${subject}</h3>
        <p>${msg}</p>
      </div>    
      </body>
  </html>`,
      attachments: [
        {
          filename: img,
        },
      ], // html body
    });
    res.render("output");
    // res.send(req.file);
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  }
  main().catch(console.error);
});

module.exports = router;
