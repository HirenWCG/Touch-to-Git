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
