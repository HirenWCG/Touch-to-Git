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
const feildModel = require("../models/fieldsModel");

// multer data store function
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/importFile");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

// All UI Router
// Home router
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

// loginUser Router
router.get("/loginUser", function (req, res, next) {
  res.render("loginUser", { title: "loginUser" });
});

// userList Router
router.get("/userList", authJWT, async function (req, res, next) {
  var user = await userAuthModel.find();
  res.render("userList", { user: user });
});

// All API list here
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
        // Error Send
        res.send({
          type: "error",
          messaage: "Already Exist in Database",
        });
      } else {
        var user = await userAuthModel(mybodydata);
        user.save();

        // Send Success Response
        res.send("Successfully validated and stored");
      }
    }
  }
);

// Login API to check user in db, Created token using private key using jwt...
router.post("/api/login", async (req, res) => {
  try {
    // Find User already exist or not
    let data = await userAuthModel.findOne({
      $or: [{ email: req.body.name }, { mobile: req.body.name }],
    });

    if (data) {
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

        // Here set token in cookie
        res.cookie("token", token);

        // Send Success Response
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
    return res.send({
      status: "error",
      code: 404,
      message: "Something went wrong",
    });
  }
});

// userList API to Ecxport all userData
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

      // Save file to particular directory
      fs.writeFile("public/exports/" + filePath, csv, function (err) {
        if (err) {
          res.send({
            status: "error",
            code: 404,
            message: "Something went wrong",
          });
        } else {
          res.send({
            status: "success",
            code: 200,
            message: "File stored successfully",
          });
        }
      });

      // Send success response
      res.send({ type: "success", data: exportData, file: filePath });
    } else {
      const formData = req.body;
      var userData = await userAuthModel.findOne({
        $or: [{ email: formData.email }, { mobileNumber: formData.mobile }],
      });

      if (userData) {
        // Send Error Response
        res.json({
          status: "Error",
          code: 404,
          message: "This user already Exist..",
        });
      } else {
        // store new user into database
        var data = await userAuthModel(formData);
        data.save(async function (err, data) {
          if (err) {
            res.send({
              status: "error",
              code: 404,
              message: "Error in Insert Record",
            });
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
    return res.send({
      status: "error",
      code: 404,
      message: "Something went wrong",
    });
  }
});

// Logout API
router.get("/api/logout", async (req, res) => {
  try {
    // clear set cookie
    res.clearCookie("token");
    return res.json({ status: "success", code: 200 });
  } catch (error) {
    return res.json({
      status: "error",
      code: 404,
      message: "Something went wrong",
    });
  }
});

// Promise function for read file from directory
let readFile = function (filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", function (err, result) {
      if (err) {
        reject(err);
      } else {
        dataArray = result.toString().split(/\r?\n/);
        resolve({
          firstRow: dataArray[0].split(","),
          secondRow: dataArray[1].split(","),
        });
      }
    });
  });
};
// Import API, import csv file and convert it into JSON formate
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
        console.log("aaaaaaaaaaaaaa", req.body);
        let file = await filesModel.create(filesData);
        counter = 0;

        let data = await readFile("./public/importFile/" + req.file.filename);

        res.send({
          type: "success",
          firstRow: data.firstRow,
          secondRow: data.secondRow,
          fileId: file._id,
          allFields: await feildModel.find().lean(),
        });
      } else {
        // Send Error Response
        res.send({
          type: "error",
          message: "File not uploaded",
        });
      }
    } catch (error) {
      // Send Error Response
      res.send({
        type: "error",
        message: "Unale to upload file",
      });
    }
  }
);

// Mapping API, map two Object and store clean data into Database
router.put("/api/mapping/:fileId/:header", async (req, res) => {
  try {
    // console.log(req.params.header);
    let headerObj = {};
    if (req.params.header == "true") {
      headerObj = { noheader: true };
    }
    await filesModel.updateOne(
      { _id: req.params.fileId },
      { $set: { fieldMappingObject: req.body, status: "inprogress" } }
    );
    let file = await filesModel.findOne({ _id: req.params.fileId });
    if (file) {
      const csvFilePath = "./public/importFile/" + file.name;
      // csv to JSON data
      const jsonArray = await csvtojson(headerObj).fromFile(csvFilePath);
      if (jsonArray) {
        let totalRecords = 0;
        let duplicates = 0;
        let discarded = 0;
        let totalUploaded = 0;
        let mappedArray = [];
        let csvDublicates = {};
        let valuesOfObject = Object.values(req.body);
        let keysOfObject = Object.keys(req.body);

        // for loop for array of json data
        for (let data = 0; data < jsonArray.length; data++) {
          totalRecords++;

          // for loop used for find value of mapped Object
          for (let key = 0; key < valuesOfObject.length; key++) {
            let jsonObj = jsonArray[data];
            let mapObj = valuesOfObject[key];
            let keyOfMapObject = keysOfObject[key];
            req.body[keyOfMapObject] = jsonObj[mapObj];
          }

          // find duplicate recoed in csv file
          if (csvDublicates[req.body.email] || csvDublicates[req.body.mobile]) {
            duplicates++;
          } else {
            let mobile = req.body.email;
            let email = req.body.mobile;
            csvDublicates[mobile] = 1;
            csvDublicates[email] = 1;

            let duplicateUser = await userAuthModel.findOne({
              $or: [{ email: req.body.email }, { mobile: req.body.mobile }],
            });

            // email validation Reg-Ex
            var emailRegExp = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

            if (duplicateUser) {
              duplicates++;
            } else if (
              emailRegExp.test(req.body.name) == true ||
              req.body.name == undefined ||
              req.body.name == ""
            ) {
              discarded++;
            } else if (emailRegExp.test(req.body.email) == false) {
              discarded++;
            } else if (
              req.body.mobile.length < 10 ||
              req.body.mobile.length > 10
            ) {
              discarded++;
            } else {
              // Final Object
              let finalObj = {
                name: req.body.name,
                email: req.body.email,
                mobile: req.body.mobile,
                password: "je saro lage e rakhi lyo",
              };
              mappedArray.push(finalObj);
              totalUploaded++;
            }
          }
        }

        // update file records like totalUploads, duplicates and other
        await filesModel.updateOne(
          { _id: req.params.fileId },
          {
            $set: {
              fieldMappingObject: req.body,
              totalRecords: totalRecords,
              duplicates: duplicates,
              discarded: discarded,
              totalUploaded: totalUploaded,
              status: "Success",
            },
          }
        );
        // insert all clean data into database
        await userAuthModel.insertMany(mappedArray);

        // send success respose
        res.send({
          status: "Success",
          code: 200,
          allCounter: { totalRecords, duplicates, discarded, totalUploaded },
          newAddedData: mappedArray,
        });
      } else {
        // Send Error response
        res.send({
          status: "error",
          code: 404,
          message: "File not convert CSV to JSON",
        });
      }
    } else {
      // Send Error response
      res.send({
        status: "error",
        code: 404,
        message: "File not in Database",
      });
    }
  } catch (error) {
    // Send Error response
    return res.send({
      status: "error",
      code: 404,
      message: "Something went wrong",
    });
  }
});

// add new field API
router.get("/api/fieldAdd/:field", async (req, res) => {
  try {
    let newField = await feildModel.create({ fields: req.params.field });
    if (newField) {
      res.send({
        status: "success",
        code: 200,
        message: "Field added",
        field: req.params.field,
      });
    } else {
      res.send({
        status: "error",
        code: 500,
        message: "Field not in Database",
      });
    }
  } catch (error) {
    return res.send({
      status: "error",
      code: 404,
      message: "Something went wrong",
    });
  }
});

module.exports = router;
