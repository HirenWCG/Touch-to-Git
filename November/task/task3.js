var num = [1, 2, 4, 5, 9, 9];
var newNumber = num.join("");
console.log(typeof newNumber);
newNumber++;
console.log(newNumber);
var arrIndex = 0;

newNumber = newNumber.toString();
newNumber = newNumber.split("");
for (let value of newNumber) {
  let newValue = Number(value);
  num[arrIndex] = newValue;
  arrIndex++;
}
console.log(num);
