const express = require("express")
const cors = require('cors')
const bodyParser = require("body-parser")
const mongodb = require('./mongodb')

const app = express()
app.use(cors());
app.use(bodyParser.json()) 
app.use(bodyParser.urlencoded({ extended: true }));


const port =   process.env.PORT || 4000

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
        date : req.body.date,
        imgURL : req.body.imgURL
    }
    mongodb.addMemeFunction(data)
    res.send("Set successfull")
})
app.get('/memes/:id', async (req, res) =>{
    var meme = await mongodb.getMemesByID( req.params.id)
    //console.log(meme,req.params.id)
    res.send(meme)
})
app.post('/memes/delete',async (req,res)=>{
    //console.log(req.body)
    var data = await mongodb.deleteMemesByID(req.body.id)
    res.send(data)
})
app.post('/memes/edit',async (req,res)=>{
    //console.log(req.body)
    var incomingData = {
        caption: req.body.caption,
        imgURL: req.body.imgURL,
        date : req.body.date
    }
    var data = await mongodb.updateMemesByID(req.body.id, incomingData)
    res.send(data)
})


app.listen( port , ()=>{
    console.log(`App started at ` + port)
})
