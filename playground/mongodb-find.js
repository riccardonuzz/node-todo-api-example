const { MongoClient, ObjectID } = require('mongodb');
const dbUrl = 'mongodb://localhost:27017/TodoApp';


MongoClient.connect(dbUrl, { useNewUrlParser: true }, (err, client) => {
    if(err)
        return console.log('Unable to connect to MongoDb server.');

    console.log('Connected to MongoDb server.');

    const db = client.db('TodoApp');

    db.collection('Todos').find({completed: false}).toArray().then((docs) => {
        console.log('Todos');
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
        console.log('Unable to fetch todos', err);
    });

    client.close();
});