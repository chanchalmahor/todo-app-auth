const express = require("express");
const { MongoClient } = require("mongodb");
const cookieParser = require("cookie-parser");
const {hashSync, compareSync} = require("bcrypt");

const server = express();

const client = new MongoClient("mongodb://localhost:27017");

const db = client.db("todoapp-auth");
const userColl = db.collection("users");
const todoColl = db.collection("todos");

server.use(express.static("public"));
server.use(express.urlencoded());
server.use(cookieParser());

server.set('view engine', 'ejs');

server.post("/register", async function (req, res) {
  //   const name = req.body.name;
  //   const password = req.body.password;

  const { name, password } = req.body;

  const passData = hashSync(password, 10);

  await client.connect();

  // await userColl.insertOne({
  //   name: name,
  //   password: password,
  // });

  await userColl.insertOne({
    name,
    password : passData,
  });

  res.redirect("/login.html");
});

server.post("/login", async function (req, res) {
  // credentials
  const { name, password } = req.body;

  await client.connect();

  const result = await userColl.findOne({
    name,
  });

  if (result) {
    const matched  = compareSync(password , result.password);
    if(matched){
    res.cookie('user_id', result._id, { maxAge: 360000 });
    res.redirect("/get-todos");
    }
    else{
      res.send("wrong password");
    }
  } else {
    res.send("User not found!");
  }
});

server.post("/create-todo", async function(req, res){
  const data = req.body.body;

  const {user_id} = req.cookies;
  console.log(req.cookies);

  if(user_id){
    await todoColl.insertOne({
      user_id,
      data
    })
    res.redirect("/get-todos");
   
     
  }
  else{
    res.send("please login");
  }
})

server.get('/get-todos', async function (req, res) {

  const {user_id} = req.cookies;

  if(user_id){

  
  await client.connect();

  const todo = await todoColl.find({
    user_id: user_id
  }).toArray();

  let str = "";

  for(let i = 0; i<todo.length ; i++){
    str = str +`<li>${todo[i].data}</li>`;

  }

  const data = {
    
    str 
  };

  res.render('todos', data);
  }
else{
  res.send("please login");
  }
});

server.get("/logout", function(req, res){
  res.clearCookie("user_id");
  res.redirect("/login.html");
});

server.listen(8080);
