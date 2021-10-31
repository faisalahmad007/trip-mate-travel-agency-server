const express = require('express');
const app = express();

const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
app.use(cors());
app.use(express.json());
require('dotenv').config();
const port = process.env.PORT|| 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5pjon.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

//console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run(){
  try{
       await client.connect();
       //console.log("Connect database");
      const database = client.db('tripMate');
      const servicesCollection = database.collection('services');
        //GET Packages API
       app.get('/services', async(req,res)=>{
        const cursor = servicesCollection.find({});
        const services = await cursor.toArray();
        res.send(services); 
    })
     //GET single service
     app.get('/services/:id', async(req,res)=>{
         const id = req.params.id;
         const query = {_id:ObjectId(id)};
         const service = await servicesCollection.findOne(query);
         res.json(service);
          

     })

         //POST API //database connect 
    app.post('/services', async(req, res)=>{
      const service =req.body;
      const result = await servicesCollection.insertOne(service);
      //console.log(result);
      res.json(result);
  })

  //POST API
  app.post('/addservice'), (req, res) => {
    servicesCollection.insertOne(req.body).then(result => {
       res.send(result.insertedId);
    });
  }

  //Update API
  app.put('/update/:id',async (req, res)=>{
    const id = req.params.id;
    const updatedInfo = req.body;
    
   const result = await servicesCollection.updateOne({_id:ObjectId(id)},
    {
      $set:{
        name: updatedInfo.name,
        price: updatedInfo.price,
        description: updatedInfo.description,
        duration: updatedInfo.duration,
        img: updatedInfo.img,
      }
    })
    res
  })

  //DELETE service API
  app.delete('/services/:id',async(req, res) => {
    const id = req.params.id;
    const query = {_id:ObjectId(id)};
    const result = await servicesCollection.deleteOne(query);
    res.json(result);

})
       
    
  }
  finally{
      //await client.close();
  }

}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Tripmate server is running');
})

app.listen(port, () => {
  console.log('server running at the port',port);
})