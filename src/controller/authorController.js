const jwt = require("jsonwebtoken");
const authorModel = require("../models/authorModel")



let nameReg = /^[a-zA-Z]+$/
let emailReg=/^[a-z]{1}[a-z0-9._]{1,100}[@]{1}[a-z]{2,15}[.]{1}[a-z]{2,10}$/
// let passwordReg=/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/



const authorData = async function (req, res) {
  try {
    const data = req.body;
    if (Object.keys(data).length == 0) {
      return res.status(400).send({ status: false, message: "Data is required to create an author." });
    }
    const { email, fname, lname, title, password } = data
    if (!fname) {
      return res.status(400).send({ status: false, msg: "First name must be present" })
    }
    if (!lname) {
      return res.status(400).send({ status: false, msg: "Last name must be present" })
    }
    if (!email) {
      return res.status(400).send({ status: false, msg: "Email must be present" })
    }
    if (!title) {
      return res.status(400).send({ status: false, msg: "Title is mandatory" })
    }
    if (!password) {
      return res.status(400).send({ status: false, msg: "Password must be there" })
    }

    // if(!passwordReg.test(password))
    // return res.status(400).send({status:false,msg:"Password in incorrect."})  
  
    if (!nameReg.test(fname) || !nameReg.test(lname)) {
      return res.status(400).send({ msg: "Please provide valid name." })
    }
    if (!(["Mr","Mrs","Miss"].includes(title))) {
      return res.status(400).send({ msg: "title can not be other than this" })
    }

    if(!emailReg.test(email))
    return res.status(400).send({status:false,msg:"Please provide valid email."})  

    const isEmailAlreadyUsed = await authorModel.findOne({ email:email });
    if (isEmailAlreadyUsed) {
      return res.status(400).send({ status: false, msg: " This email is already in use try with another one." });
    }
    
    const createdAuther = await authorModel.create(data)
    return res.status(201).send({ status : true, msg: "Author Created successfully!", data: createdAuther })
  }
  catch (error) {
    return res.status(500).send({ msg: error.message })

  }
}



const login = async function (req, res) {
  let userName = req.body.email;
  let password = req.body.password;

  if (!userName || !password) {
    return res.status(400).send({
      status: false,
      msg: "username or the password is not present",
    });
  }

  let author = await authorModel.findOne({ email: userName, password: password });
  if (!author)
    return res.status(401).send({
      status: false,   
      msg: "username or the password is not corerct",
    });

  let token = jwt.sign(
    {
      authorId: author._id,
    },   
    "Blog project"
  );

  res.status(200).send({ status: true, data: token });
};



module.exports = { authorData, login }