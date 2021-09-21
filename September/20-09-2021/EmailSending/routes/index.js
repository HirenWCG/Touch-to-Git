var express = require("express");
var router = express.Router();
const nodemailer = require("nodemailer");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/dashbord", function (req, res, next) {
  let name = req.body.name;
  let email = req.body.email;
  let subject = req.body.subject;
  let msg = req.body.message;
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
  </html>`, // html body
    });
    res.render("output");
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  }
  main().catch(console.error);
});

module.exports = router;
