var express = require("express");
var shortUrl = require("node-url-shortener");
var router = express.Router();
const {
  userRegistration,
  postUserRegistration,
  userLogin,
  checkEmail,
  // postUserLogin,
} = require("../controllers/userControllers");
const passport = require("passport");

/* GET home page. */
router.get("/", userRegistration);
router.post("/", postUserRegistration);

router.get("/login", userLogin);
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
  })
);

router.get("/dashboard", (req, res) => {
  if (!req.user) {
    res.redirect("/login");
    return;
  }
  res.render("dashboard");
});

router.get("/logout", (req, res) => {
  let userid = req.user._id;
  console.log(userid);
  req.logout();
  res.redirect("/login");
});

router.get("/emailcheckvalidation", checkEmail);

router.get("/a", (req, res) => {
  let obj = {
    2: "abc",
    3: "def",
    4: "ghi",
    5: "jkl",
    6: "mno",
    7: "pqrs",
    8: "tuv",
    9: "wxyz",
  };

  let value = "4404447773366005554446220277774449992";
  let newValue = value.split("");
  let storeNumber;
  let firstZero;
  let counter = 0;
  let result = [];

  for (let data of newValue) {
    if (storeNumber == undefined) {
      storeNumber = data;
      counter++;
      if (firstZero == data) {
        result.push(" ");
        firstZero = undefined;
        storeNumber = undefined;
        counter = 0;
      }
    } else {
      if (storeNumber == data) {
        counter++;
      } else {
        let z = obj[storeNumber].split("");
        result.push(z[counter - 1]);
        storeNumber = undefined;
        counter = 0;
        storeNumber = data;
        counter++;
        if (storeNumber == 0) {
          firstZero = data;
          storeNumber = undefined;
          counter = 0;
        }
      }
    }
  }
  let z = obj[storeNumber].split("");
  result.push(z[counter - 1]);
  console.log(result.join(""));
});

router.get("/test", (req, res) => {
  shortUrl.short(
    "https://stackoverflow.com/questions/25153474/split-a-string-and-store-value-in-array-in-javascript",
    function (err, url) {
      console.log(url);
    }
  );
});

router.get("/b", (req, res) => {
  function emptyStack(val) {
    stack = [];
    stack.push(val);
  }

  function dataPushIntoStack() {
    // let z = obj[storeNumber].split("");
    // result.push(z[counter - 1]);

    var keypad = myArr[stack[0]].split("");
    output.push(keypad[stack.length - 1]);
  }
  // let myArr = ["", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"];
  let myArr = {
    2: "abc",
    3: "def",
    4: "ghi",
    5: "jkl",
    6: "mno",
    7: "pqrs",
    8: "tuv",
    9: "wxyz",
  };

  let inputVal = "440444777336600555444622027777444999200";
  var stack = [];
  var output = [];
  var separate = inputVal.split("");

  for (let storeData of separate) {
    if (stack.length == 0) {
      stack.push(storeData);
    } else {
      if (stack[0] == storeData) {
        stack.push(storeData);
      } else {
        if (stack[stack.length - 1] == 0) {
          if (stack.length % 2 == 0) {
            for (let i = 0; i < stack.length / 2; i++) {
              output.push(" ");
            }
            emptyStack(storeData);
          } else if (stack[1] != 0) {
            emptyStack(storeData);
          } else {
            let stackDecrese = stack.length - 1;
            for (let i = 0; i <= stackDecrese / 2; i++) {
              output.push(" ");
            }
            emptyStack(storeData);
          }
        } else {
          dataPushIntoStack();
          emptyStack(storeData);
        }
      }
    }
  }
  dataPushIntoStack();
  console.log(output.join(""));
});

router.get("/value", (req, res) => {
  var num = [1, 2, 2, 1, 3, 5, 8, 5, 7, 8];
  var store = {};
  for (let i = 0; i < num.length; i++) {
    if (store[num[i]]) {
      store[num[i]] = store[num[i]] + 1;
    } else {
      store[num[i]] = 1;
    }
  }
  let output = "";
  for (const index of Object.keys(store)) {
    if (store[index] == 1) {
      output += index;
    }
  }
  console.log(output);
});

router.get("/new", (req, res) => {
  var num = [1, 2, 9];
  let lastValue = num[num.length - 1];
  let arrLenght = num.length - 1;
  lastValue++;
  lastValue = lastValue.toString();
  lastValue = lastValue.split("");
  for (let value of lastValue) {
    let newValue = Number(value);
    num[arrLenght] = newValue;
    arrLenght++;
  }
  console.log(num);
});

router.get("/total/:id", (req, res) => {
  let value = Number(req.params.id);
  var num = [1, 2, 5, 9, 9];
  var newNumber = Number(num.join(""));
  newNumber = newNumber + value;
  var arrIndex = 0;

  newNumber = newNumber.toString();
  newNumber = newNumber.split("");
  for (let value of newNumber) {
    let newValue = Number(value);
    num[arrIndex] = newValue;
    arrIndex++;
  }
  console.log(num);
});

module.exports = router;
