const { MongoClient, ObjectID } = require('mongodb');
const dbUrl = 'mongodb://localhost:27017/TodoApp';

// var objID = new ObjectID();
// console.log(objID);

MongoClient.connect(dbUrl, { useNewUrlParser: true }, (err, client) => {
    if(err)
        return console.log('Unable to connect to MongoDb server.');

    console.log('Connected to MongoDb server.');

    // const db = client.db('TodoApp');

    // db.collection('Todos').insertOne({
    //     text: 'Something to do',
    //     completed: false
    // }, (err, result) => {
    //     if(err)
    //         return console.log('Unable to insert todo.', err);
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });

    //Insert new doc into Users(name, age, location)

    client.close();
});