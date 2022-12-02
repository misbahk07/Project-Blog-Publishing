const jwt = require("jsonwebtoken");
const BlogModel = require('../models/blogModel')
 
const {isValidObjectId} = require('mongoose')

let authenticate=async function (req,res,next){
  try{
  let token =req.headers["x-api-key"]

  if(!token)
    res.status(400).send({status:false,msg:"token must be present."})

  let decodeToken= jwt.verify(token,"project 1",function(err,decodeToken){
    if(err) return res.status(400).send("token is invalid")
  })

 req.authorId=decodeToken.authorId
 next()

}catch(error){
  return res.status(500).send({status:false,msg:error.message})
}
}


let authorise=async function(req,res,next){
try{ let blogId=req.params.blogId

  if(!isValidObjectId(blogId))
  return res.status(400).send({status:false,msg:"please provide valid object id."})

  let findBlog=await BlogModel.findById(blogId)
  if(!findBlog)
  return res.status(404).send({status:false,msg:"Blog not found."})

  if(req.authorId !=blogId.authorId)
  return res.status(403).send({statusbar:false,msg:"Not authorized."})
  next()
}catch(error){
  return res.status(500).send({status:false,msg:error.message})
}
}





 
module.exports={authenticate,authorise}
