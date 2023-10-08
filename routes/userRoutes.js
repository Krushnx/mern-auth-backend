const router = require("express").Router();
const User = require('../models/schema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')


//register
router.post("/", async (req, res) => {
  try {
    const { email, password, passwordVerify } = req.body;

    // Validation



    if (!email || !password || !passwordVerify) {
      res.status(400).json({ errormessage: "Please Enter all reequired Feild" });
    }
    
    if(password.length < 6){
        res.status(400).json({ errormessage: "Password length should be atleast 6 char" });
    }
    
    if(password != passwordVerify){
        res.status(400).json({ errormessage: "Enter the same passwod twice" });
    }
    
    const existingUser = await User.findOne({ email });
    if(existingUser)
    {
        return res.status(400).json({ errormessage: "An account with this email already exists" });
    }

   

    // console.log(existingUser);

    // Hash the password

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password , salt);

    // console.log(passwordHash);


    // Save the new user account to the database

    const newuser = new User({
      email , passwordHash
    })

    const savedUser = await newuser.save();

    // sign the token

    const token = jwt.sign({
      user  : savedUser._id
    } , process.env.JWT_SECRATE)

    // Send the token in a HTTP-only cookie

    res.cookie("token" , token , {
      httpOnly:true
    }).send();


    //



  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
});


// log in

router.post("/login" , async (req , res)=>
{
  try {
    const { email, password } = req.body;

    //validate
    if (!email || !password) {
      res.status(400).json({ errormessage: "Please Enter all reequired Feild" });
    }
    
    const existingUser = await User.findOne({email});

    if(!existingUser)
      return res.status(400).json({ errormessage: "Wrong Email or password" });
    
      
    const passwodCorrect = await bcrypt.compare(password , existingUser.passwordHash);

    if(!passwodCorrect)
      return res.status(400).json({ errormessage: "Wrong Email or password" });
    
     // sign the token

     const token = jwt.sign({
      user  : existingUser._id
    } , process.env.JWT_SECRATE)

    // Send the token in a HTTP-only cookie

    res.cookie("token" , token , {
      httpOnly:true
    }).send();



  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
});


// Logout
router.get("/logout" , (req , res)=>{
  res.cookie("token" , "" , {httpOnly:true,expires : new Date(0)}).send();
})



// authetication

router.get('/loggedIN' ,(req , res)=>{

  try {
    const token = req.cookies.token;
    
    if(!token)
     return res.json(false);

  jwt.verify(token, process.env.JWT_SECRATE);
    
  res.send(true);
    
} catch (error) {
    res.json(false);
}
} )




module.exports = router;
