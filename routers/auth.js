const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");



const router = express.Router();

// register
router.post('/register', async (req, res) => {
 
 

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt)


    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    res.status(200).json(user);
  } 
  
  catch(err){
    console.log(err)
  }
  // const user = await new User({
  //   username: "Hebertt",
  //   email: "hebertt@gmail.com",
  //   password: "123456",
  // });

  // await user.save();
  // res.send("ok");
});

module.exports = router;