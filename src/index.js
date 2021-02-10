const express = require("express")
const cors = require('cors')
const bodyParser = require("body-parser")
const mongodb = require('./mongodb')

const app = express()
app.use(cors());
app.use(bodyParser.json()) 
app.use(bodyParser.urlencoded({ extended: true }));


const port = 4000 || process.env.PORT

app.get('/',(req, res)=>{
    res.send("Welcome to meme-stream backend ...")
})
app.get('/memes',async (req, res)=>{
    var data = await mongodb.getMemeFunction()
    res.send(data)
})
app.post('/memes',(req, res)=>{
    var data = {
        name: req.body.name,
        caption : req.body.caption,
        date : new Date(Date.now()),
        imgURL : req.body.imgURL
    }
    mongodb.addMemeFunction(data)
    res.send("Set successfull")
})


app.listen( port , ()=>{
    console.log(`App started at ` + port)
})
