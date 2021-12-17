var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
var { check, validationResult } = require("express-validator");
const { Parser } = require("json2csv");
const fs = require("fs");
const multer = require("multer");
const csvtojson = require("csvtojson");

//require userAuth Model
const userAuthModel = require("../models/userModel");
const filesModel = require("../models/filesModel");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/importFile");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

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
          userId: data._id,
          name: data.name,
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

router.post(
  "/api/import",
  authJWT,
  upload.single("importFile"),
  async (req, res) => {
    try {
      if (req.file) {
        let filesData = {
          name: req.file.filename,
          uploadedBy: req.user.userId,
        };
        let file = await filesModel.create(filesData);
        // convert file csv to json
        counter = 0;
        const csvFilePath = req.file.destination + "/" + req.file.filename;
        const jsonArray = await csvtojson().fromFile(csvFilePath);
        // console.log(req.file.destination);

        // fs.readFile(
        //   "./public/importFile/newexportsData.csv",
        //   "utf8",
        //   (err, data) => {
        //     console.log(data);
        //   }
        // );

        if (jsonArray) {
          let firstRow = Object.keys(jsonArray[0]);
          let secondRow = Object.values(jsonArray[0]);
          res.send({
            type: "success",
            firstRow,
            secondRow,
            fileId: file._id,
          });
        } else {
          res.send({
            type: "error",
            message: "No data found in CSV",
          });
        }
      } else {
        res.send({
          type: "error",
          message: "File not uploaded",
        });
      }
    } catch (error) {
      res.send({
        type: "error",
        message: "Unale to upload file",
      });
    }
  }
);

router.put("/api/mapping/:fileId", async (req, res) => {
  try {
    // console.log("body", req.body);
    // console.log("params", req.params.fileId);
    let file = await filesModel.findOne({ _id: req.params.fileId });
    if (file) {
      // console.log(file);
      const csvFilePath = "./public/importFile/" + file.name;
      const jsonArray = await csvtojson().fromFile(csvFilePath);
      if (jsonArray) {
        let totalRecords = 0;
        let duplicates = 0;
        let discarded = 0;
        let totalUploaded = 0;
        let mappedArray = [];
        let csvDublicates = {};
        let valuesOfObject = Object.values(req.body);
        let keysOfObject = Object.keys(req.body);
        for (let data = 0; data < jsonArray.length; data++) {
          totalRecords++;
          for (let key = 0; key < valuesOfObject.length; key++) {
            let jsonObj = jsonArray[data];
            let mapObj = valuesOfObject[key];
            let keyOfMapObject = keysOfObject[key];
            req.body[keyOfMapObject] = jsonObj[mapObj];
          }
          if (csvDublicates[req.body.email] || csvDublicates[req.body.mobile]) {
            console.log("aela malo ek data...");
            duplicates++;
          } else {
            let mobile = req.body.email;
            let email = req.body.mobile;
            csvDublicates[mobile] = 1;
            csvDublicates[email] = 1;
          }
          console.log("csvDuplicatesssssssssssssssssssss", duplicates);
          let duplicateUser = await userAuthModel.findOne({
            $or: [{ email: req.body.email }, { mobile: req.body.mobile }],
          });

          var emailRegExp = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

          if (duplicateUser) {
            duplicates++;
          } else if (
            emailRegExp.test(req.body.name) == true ||
            req.body.name == undefined ||
            req.body.name == ""
          ) {
            console.log("Name is Invalid");
            discarded++;
          } else if (emailRegExp.test(req.body.email) == false) {
            console.log("Email is Invalid");
            discarded++;
          } else if (
            req.body.mobile.length < 10 ||
            req.body.mobile.length > 10
          ) {
            console.log("Mobile must be 10 digits only.");
            discarded++;
          } else {
            mappedArray.push(req.body);
            totalUploaded++;
          }
        }
        await userAuthModel.insertMany(mappedArray);
      } else {
        res.json({
          status: "error",
          code: 404,
          message: "File not convert CSV to JSON",
        });
      }
    } else {
      res.json({
        status: "error",
        code: 404,
        message: "File not in Database",
      });
    }
  } catch (error) {
    return res.json({
      status: "error",
      code: 404,
      message: "Something went wrong",
    });
  }
});
module.exports = router;
