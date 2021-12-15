var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
var { check, validationResult } = require("express-validator");
const { Parser } = require("json2csv");
const fs = require("fs");
const multer = require("multer");
const csvtojson = require("csvtojson");

//require userAuth Model
var userAuthModel = require("../models/userModel");
const { count } = require("console");

//authentication function authJWT
function authJWT(req, res, next) {
  console.log("req cookie data", req.cookies.token);
  console.log(typeof req.cookies);
  let token;
  if (req.cookies.token) {
    token = req.cookies.token;
  }
  const privateKey = "erhvfmyoaswlbhrfmasuypolncasteif";
  jwt.verify(token, privateKey, function (err, user) {
    if (err) {
      res.redirect("/loginUser");
    } else {
      console.log("logged-user", user);
      next();
    }
  });
}

// UI Router
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/loginUser", function (req, res, next) {
  res.render("loginUser", { title: "loginUser" });
});

router.get("/userList", authJWT, async function (req, res, next) {
  var user = await userAuthModel.find();
  res.render("userList", { user: user });
});

// ------------------------------------ API ------------------------------------
//API for signup user to store new user in db
router.post(
  "/api/addUser",
  [
    check("email", "Email length should be 10 to 30 characters")
      .isEmail()
      .isLength({ min: 10, max: 30 }),
    check("name", "Name length should be 10 to 20 characters").isLength({
      min: 2,
      max: 20,
    }),
    check("mobile", "Mobile number should contains 10 digits").isLength({
      min: 10,
      max: 10,
    }),
    check("password", "Password length should be 8 to 10 characters").isLength({
      min: 8,
      max: 10,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json(errors);
    } else {
      const mybodydata = req.body;
      var userData = await userAuthModel.findOne({
        $or: [{ email: mybodydata.email }, { mobile: mybodydata.mobile }],
      });
      if (userData) {
        res.send({
          type: "error",
          messaage: "Already Exist in Database",
        });
      } else {
        var user = await userAuthModel(mybodydata);
        user.save();
        res.send("Successfully validated and stored");
      }
    }
  }
);

// Login API to check user in db, Created token using private key using jwt...
router.post("/api/login", async (req, res) => {
  try {
    console.log(req.body);
    let data = await userAuthModel.findOne({
      $or: [
        { email: req.body.name },
        { mobile: req.body.name },
        { name: req.body.name },
      ],
    });

    console.log("this is data", data);
    if (data) {
      // console.log("hiren", data);
      // if match generate token for user login
      if (req.body.password == data.password) {
        //Token Key 32 Character
        var privateKey = "erhvfmyoaswlbhrfmasuypolncasteif";
        let params = {
          email: data.email,
          mobile: data.mobile,
        };
        var token = jwt.sign(params, privateKey); // , { expires_in: '500s' }
        res.cookie("token", token);
        console.log("Token is " + token);
        console.log("req.headers", req.headers.cookie);
        // res.sendStatus(200);
        res.send({
          type: "success",
          login: true,
          messaage: "login successfully",
          token: token,
          header: req.headers.cookie,
          status: 200,
        });
      } else {
        res.send("password wrong please enter correct password...");
      }
    } else {
      res.send("user not found...");
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/api/userList", async function (req, res, next) {
  try {
    // Use user list API to export user data in CSV.
    if (req.query.exportId) {
      // export file code
      const filePath = "exportsData" + ".csv";
      const fields = ["name", "email", "mobile"];
      const opts = { fields };
      const parser = new Parser(opts);
      var exportData = await userAuthModel.find();
      const csv = parser.parse(exportData);

      fs.writeFile("public/exports/" + filePath, csv, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("stored successfully");
          console.log(filePath);
        }
      });
      res.send({ type: "success", data: exportData, file: filePath });
    } else {
      const formData = req.body;
      var userData = await userAuthModel.findOne({
        $or: [{ email: formData.email }, { mobileNumber: formData.mobile }],
      });

      if (userData) {
        res.json({
          status: "Error",
          code: 404,
          message: "This user already Exist..",
        });
      } else {
        var data = await userAuthModel(formData);
        data.save(async function (err, data) {
          if (err) {
            console.log("Error in Insert Record");
          } else {
            res.json({
              status: "Success",
              code: 200,
              users: await userAuthModel.find(),
            });
          }
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/api/logout", async (req, res) => {
  try {
    res.clearCookie("token");
    return res.json({ status: "success", code: 200 });
  } catch (error) {
    console.log(error);
    return res.json({
      status: "error",
      code: 404,
      message: "Something went wrong",
    });
  }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/importFile");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

router.post("/api/import", upload.single("importFile"), async (req, res) => {
  if (req.file) {
    counter = 0;
    const csvFilePath = req.file.destination + "/" + req.file.filename;
    const jsonArray = await csvtojson().fromFile(csvFilePath);
    if (jsonArray) {
      for (let jsonData of jsonArray) {
        let emailRegExp = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        if (
          emailRegExp.test(jsonData.email) == false ||
          jsonData.mobile == "" ||
          jsonData.name == ""
        ) {
          counter++;
        } else {
          let user = await userAuthModel.findOne({ email: jsonData.email });
          if (user) {
            res.send({
              type: "error",
              messaage: "Already exist in Database",
            });
          } else {
          }
        }
      }
    }
  }
});

module.exports = router;
