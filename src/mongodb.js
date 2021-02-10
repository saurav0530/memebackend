const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const { ObjectId } = require('mongodb')
const request = require("request")
const constants= require('../constants')


const connectionURL = constants.mongoURL
const databaseName = constants.databaseName

// ***** Function for connecting to database *****
const mongoConnect = async function(){
        return await MongoClient.connect( connectionURL, {useUnifiedTopology : true, useNewUrlParser : true})
}

// ***** Function for adding memes *****
var addMemeFunction = function(data){
    mongoConnect().then(async client =>{
        const db= client.db(databaseName)
        await db.collection('memes').insertOne(data);
        client.close()
    }).catch(err => console.log(err))

    return "Memes added successfully !!!"
}
// ***** Function for getting memes *****
var getMemeFunction = async function(){
    var memes
    await mongoConnect().then(async client =>{
        const db= client.db(databaseName)
        memes = await db.collection('memes').find().toArray();
        // console.log(memes)
        client.close()
    }).catch(err => console.log(err))
    //console.log(memes)
    return memes
}

// ***** Function for getting memes by ID *****
var getMemesByID = async function(id){
    var memes
    await mongoConnect().then(async client =>{
        const db= client.db(databaseName)
        memes = await db.collection('memes').find({_id : ObjectId(id)}).toArray()
        client.close()
    }).catch(err => console.log(err))
    return memes
}

module.exports = {
    mongoConnect : mongoConnect,
    addMemeFunction : addMemeFunction,
    getMemeFunction : getMemeFunction,
    getMemesByID : getMemesByID
}