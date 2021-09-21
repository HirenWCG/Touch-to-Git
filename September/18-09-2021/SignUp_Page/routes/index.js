var express = require("express");
var router = express.Router();
const nodemailer = require("nodemailer");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/", function (req, res, next) {
  let fname = req.body.first_name;
  let email = req.body.email;
  let mnumber = req.body.mnumber;
  let gender = req.body.gender;
  res.render("output", { name: fname, mail: email });
  main();
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
      from: '"training2021.com" <herrypottar21@gmail.com>', // sender address
      to: email, // list of receivers
      subject: "Training 2021", // Subject line
      text: "Are you Intrested in NodeJS Training?", // plain text body
      html: `<html>
      <head>
      <style>
      table {
        font-family: arial, sans-serif;
        border-collapse: collapse;
        width: 100%;
      }
      
      td{
        border: 1px solid #dddddd;
        text-align: left;
        padding: 8px;
      }
      th{
      border: 1px solid #dddddd;
        text-align: left;
        padding: 8px;
        text-align:center;
        font-size:30px;
        background-color:#345B63;
        color:white;
      }
      
      tr:nth-child(even) {
        background-color: #dddddd;
      }
      </style>
      </head>
      <body>
      <table>
        <tr>
          <th colspan="2">Welcome to training2021</th>
        </tr>
        <tr>
          <td>Name:</td>
          <td>${fname}</td>
        </tr>
        <tr>
          <td>Email</td>
          <td>${email}</td>
        </tr>
        <tr>
          <td>Mobile No</td>
          <td>${mnumber}</td>
        </tr>
        <tr>
          <td>Gender</td>
          <td>${gender}</td>
        </tr>
      </table>
      
      </body>
      </html>`, // html body
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  }
});

module.exports = router;
