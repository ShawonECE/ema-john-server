const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const port = process.env.PORT || 4000; 

const app = express();
app.use(cors());
app.use(bodyParser.json());

require('dotenv').config();

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5yhhqym.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db;


client.connect()
  .then(() => {
    db = client.db("Ema-John");
    console.log("Connected to the database");
  })
  .catch(err => console.error("Error connecting to the database:", err));


app.use((req, res, next) => {
  req.db = db;
  next();
});

app.post('/place_order', (req, res) => {
  const coll = req.db.collection("Orders");
  const orderInfo = req.body;

  coll.insertOne(orderInfo)
    .then(result => {
      res.send(result);
    })
    .catch(error => {
      console.error(error);
      res.status(500).send("Internal Server Error");
    });
});

app.get('/', (req, res) => {
  res.send("Welcome to ema-john server!");
});

app.get('/all_products', (req, res) => {
  const coll = req.db.collection("Products");

  coll.find({}).toArray()
    .then(result => {
      res.send(result);
    })
    .catch(error => {
      console.error(error);
      res.status(500).send("Internal Server Error");
    });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});