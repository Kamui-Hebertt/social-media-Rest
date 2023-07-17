const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');


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
      profilePicture: req.body.profilePicture,
      followers: req.body.followers,
      following: req.body.following,
      isAdmin: req.body.isAdmin,
      description: req.body.description,
      city: req.body.city,
      from: req.body.from,
      relationships: req.body.relationships,

  
   
   
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



//Login 

router.post("/login", async(req, res) => {
 

 try{
  const user = await User.findOne({email: req.body.email});
   !user && res.status(404).json("user not found");

   const validPassword = await bcrypt.compare(req.body.password, user.password);
   



   !validPassword && res.status(400).json("Invalid password");

 const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: '1h', // Token expires in 1 hour (adjust as needed)
    });

   res.status(200).json({user, token});
   } 
  
 catch(err){
  console.log(err);
 }
})

module.exports = router;