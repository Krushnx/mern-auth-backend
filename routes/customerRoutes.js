const router = require("express").Router();
const Customer = require("../models/customerModel")
const auth = require('../middleware/auth')


router.post('/' , auth,async(req,res)=>
{
    try {
       const {name} = req.body; 
       const newCustomer = new Customer({name});

       const savedCustomer = await newCustomer.save();

       res.json(savedCustomer);
    }  catch (error) {
        console.error(error);
        res.status(500).send();
      }
})



router.get('/' , auth,async (req , res)=>
{
  try {

      const customer = await Customer.find();

      res.json(customer);
      
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
})

module.exports = router;