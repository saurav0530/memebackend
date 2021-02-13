const express = require("express")
const cors = require('cors')
const bodyParser = require("body-parser")
const mongodb = require('./mongodb') 

const app = express()
app.use(cors());
app.use(bodyParser.json()) 
app.use(bodyParser.urlencoded({ extended: true }));


const port =   process.env.PORT || 8081


// Handle to greet to backend server
app.get('/',(req, res)=>{
    res.send("Welcome to meme-stream backend ...")
})

// Handle for rendering 100 recent memes
app.get('/memes',async (req, res)=>{
    var data = await mongodb.getMemeFunction()

    var mid = data.length/2, temp;
    for(var i=0; i<data.length/2; i++)
    {
        temp = data[i];
        data[i]=data[data.length - i -1]
        data[data.length - i - 1] = temp
    }
    var recentMeme = []
    for(var i=0; i<data.length; i++)
        recentMeme[i]= {
            id : data[i]._id,
            name : data[i].name,
            url : data[i].url,
            caption : data[i].caption
        }

    data = recentMeme

    res.status(200).send(data)
})

// Handle for uploading created memes
app.post('/memes',async (req, res)=>{
    var months = ['January','February','March','April','May','June','July','August','September','October','November','December']
    var date = new Date(Date.now())
    var date = `Posted on ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
    var data = {
        name: req.body.name,
        caption : req.body.caption,
        date : date,
        url : req.body.url
    }
    var response = await mongodb.addMemeFunction(data)

    if(response == '1')
        res.sendStatus(409).send("Meme already exists. Cannot upload duplicate meme.")
    else
        res.status(200).send({id : response})
})

// Handle for searching memes by ID
app.get('/memes/:id', async (req, res) =>{
    var meme = await mongodb.getMemesByID( req.params.id)
    var data 
    if(meme)
    {
        data = meme[0]
        data = {
            id : data._id,
            name : data.name,
            url : data.url,
            caption : data.caption
        }
        res.status(200).send(data)
    }
    res.sendStatus(404).send(data)
})

// Handle for deleting memes
app.delete('/memes/:id',async (req,res)=>{
    //console.log(req.params)
    var data = await mongodb.deleteMemesByID(req.params.id)
    res.status(200).send(data)
})

// Handle for updating memes
app.patch('/memes/:id',async (req,res)=>{
    //console.log(req.body)
    var months = ['January','February','March','April','May','June','July','August','September','October','November','December']
    var date = new Date(Date.now())
    var date = `Updated on ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
    var incomingData = {
        caption: req.body.caption,
        url: req.body.url,
        date : date
    }
    var data = await mongodb.updateMemesByID(`${req.params.id}`, incomingData)
    res.sendStatus(200).send('Ok')
})

// Handle for assigning port
app.listen( port , ()=>{
    console.log(`App started at ` + port)
})

