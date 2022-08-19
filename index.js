const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;

//Middleware
app.use(cors());
app.use(express.json());

//user: jahid482
//password: jahid482

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@add.cyoia.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    await client.connect();
    const database = client.db("bus");
    const busCollection = database.collection("addBus");
    const adminCollection = database.collection("admin");
    const userTicketCollection = database.collection("tickets");

    //GET API (BUS)
    app.get('/addAdmin', async (req, res) => {
      const cursor = adminCollection.find({});
      const allData = await cursor.toArray();
      res.send(allData);
    });

    //GET TICKET BY USER EMAIL FRROM DB
    app.get('/updateUserTicketCollection', async (req, res) => {
      const cursor = userTicketCollection.find({});
      const allData = await cursor.toArray();
      res.send(allData);
    });


    //GET API (ADMIN)
    app.get('/addBus', async (req, res) => {
      const cursor = busCollection.find({});
      const allData = await cursor.toArray();
      res.send(allData);
    });


    //UPDATE A BUS BY SEARCH WITH ID 
    app.get('/addBus/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await busCollection.findOne(query);

      res.send(result);
    });


    //POST API (BUS)
    app.post('/addBus', async (req, res) => {
      const newData = req.body;
      const result = await busCollection.insertOne(newData);
      res.json(result);
    });


    //ADD AN ADMIN
    app.post('/addAdmin', async (req, res) => {
      const newData = req.body;
      const result = await adminCollection.insertOne(newData);
      res.json(result);
    });

    //ADD TICKET BY USER EMAIL TO DB
    app.post('/updateUserTicketCollection', async (req, res) => {
      const newData = req.body;
      const result = await userTicketCollection.insertOne(newData);
      res.json(result);
    });


    //UPDATE API
    app.put('/addBus/:id', async (req, res) => {
      const id = req.params.id;
      const updatedBus = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };

      const updateDoc = {
        $set: {
          busName: updatedBus.busName,
          journeyType: updatedBus.journeyType
        },
      };
      const result = await busCollection.updateOne(filter, updateDoc, options)
      res.json(result);
    })


    //UPDATE TICKET
    app.put('/updateTicket/:id', async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };

      const updateDoc = {
        $set: {
          seats: data.seats,
          available: data.available - 1,
          unavailable: data.unavailable + 1
        },
      };

      const result = await busCollection.updateOne(filter, updateDoc, options)
      res.json(result);
    })

    //DELETE API (BUS)
    app.delete('/addBus/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };

      const result = await busCollection.deleteOne(query);
      res.json(result);
    });



  }
  finally {
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send("running my server");
});

app.listen(port, () => {
  console.log("running on port", port);
});

//npm run start-dev