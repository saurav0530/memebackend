const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const { ObjectId, ObjectID } = require('mongodb')
const request = require("request")
const constants= require('../constants')


const connectionURL = constants.mongoURL
const databaseName = constants.databaseName

// ***** Function for connecting to database *****
const mongoConnect = async function(){
        return await MongoClient.connect( connectionURL, {useUnifiedTopology : true, useNewUrlParser : true})
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

// ***** Function for adding memes *****
var addMemeFunction = async function(data){
    var response = await getMemeFunction(),check = 0
    for(var i=0; i<response.length; i++)
    {
        if((response[i].caption == data.caption) && (response[i].name == data.name) && (response[i].imgURL == data.imgURL))
            check++
    }
    if(check)
    {
        return "1"
    }
    else
    {
        var id
        await mongoConnect().then(async client =>{
            const db= client.db(databaseName)
            await db.collection('memes').insertOne(data).then(response => id = response.insertedId).catch(err =>console.log(err));
            client.close()
        }).catch(err => console.log(err))
        return id
    }
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

// ***** Function for deleting memes *****
var deleteMemesByID = async function(id){
    await mongoConnect().then(async client =>{
        const db= client.db(databaseName)
        await db.collection('memes').deleteOne({_id : ObjectId(id)})
        client.close()
    }).catch(err => console.log(err))
    return 'Deleted successfully'
}

// ***** Function for updating memes *****
var updateMemesByID = async function(id, data){
    //console.log(id)
    var err1
    await mongoConnect().then(async client =>{
        const db= client.db(databaseName)
        await db.collection('memes').updateOne({_id : ObjectID(id)},{$set : {
            caption: data.caption,
            imgURL: data.imgURL,
            date : data.date
        }})
        client.close()
    }).catch(err => console.log('ok',err))
    return 'Updated successfully'
}


module.exports = {
    mongoConnect : mongoConnect,
    addMemeFunction : addMemeFunction,
    getMemeFunction : getMemeFunction,
    getMemesByID : getMemesByID,
    deleteMemesByID : deleteMemesByID,
    updateMemesByID : updateMemesByID
}