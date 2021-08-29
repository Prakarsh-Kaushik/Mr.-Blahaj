const express = require("express")
const server = express()

server.all("/", (req,res)=>{
  res.send("Mr. Blahaj is up and Swimming")
})

function keepAlive()
{
  server.listen(3000, ()=>
  {
    console.log("Server is ready")
  })
}

module.exports = keepAlive