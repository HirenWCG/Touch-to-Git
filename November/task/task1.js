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
