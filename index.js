const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

require('dotenv').config();

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5yhhqym.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const db = client.db("Ema-John");

app.post('/place_order', (req, res) =>{
  const coll = db.collection("Orders");
  const orderInfo = req.body;
  client.connect()
  .then(() => coll.insertOne(orderInfo))
  .then(result => {
    res.send(result);
  })
  .catch(error => {
    console.error(error);
  })
  .finally(() => client.close());
});

app.get('/', (req, res) => {
    res.send("Welcome");
});

app.get('/all_products', (req, res) => {
  const coll = db.collection("Products");
  client.connect()
  .then(() =>coll.find({}).toArray())
  .then(result => {
    res.send(result);
  })
  .catch(error => {
    console.error(error);
  })
  .finally(() => client.close());
});

app.listen(4000, () => {
    console.log('listening to port 4000');
});