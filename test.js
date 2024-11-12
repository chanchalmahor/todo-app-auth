const obj = {
  name: "A",
  std: 1,
};

// console.log(obj.std);

// const name = obj.name;
// const std = obj.std;

// OBJECT DESTRUCTURING
const { name, std } = obj;

// console.log(name);
// console.log(std);

const arr = [1, 2, 3];

// const one = arr[0];
// const two = arr[1];
// const three = arr[2];

// ARRAY DESTRUCTURING
const [one, two, three] = arr;

console.log(one, two, three);
