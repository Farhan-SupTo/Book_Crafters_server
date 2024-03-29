const express = require('express')
const app = express()
const port = process.env.PORT || 5000
require('dotenv').config()
const cors =require('cors')

// middleware
app.use(cors())
app.use(express.json())

// mongodb Configuration


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.2veuzlp.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // create a collection of books
    const bookCollection= client.db('BookInventory').collection('books')
     const reviewCollection = client.db("BookInventory").collection("Reviews");


    // insert a book to the database :post method

    app.post('/upload-book',async(req,res)=>{
      const data =req.body
      const result =await bookCollection.insertOne(data)
      res.send(result)


    })

    // get all books from database

    // app.get('/all-books',async(req,res)=>{
    //   const book =await bookCollection.find().toArray();
    //   res.send(book)
    // })

    // update a book data:patch or update methods
    app.patch('/book:id',async(req,res)=>{
      const id =req.params.id
      console.log(id)
      const updateBookData =req.body
      const filter ={_id: new Object(id)}
      const updateDoc ={
        $set:{
          ...updateBookData,
        }
      }
        // update
        const result =await bookCollection.updateOne(filter,updateDoc)
        res.send(result)
      
    })

    // delete a book data

    app.delete('/book/:id',async(req,res)=>{
      const id =req.params.id
      const filter ={_id: new Object(id)}
      const result =await bookCollection.deleteOne(filter)
      res.send(result)
    })

    // find by category

    app.get('/all-books',async(req,res)=>{
      let query={}
      if(req.query?.category){
        query={category:req.query.category}

      }
      const result =await bookCollection.find(query).toArray()
      res.send(result)
    })

    // to get a single book

    app.get('/book/:id',async(req,res)=>{
      const id = req.params.id
      const filter ={ _id: new ObjectId(id)}
      const result =await bookCollection.findOne(filter)
      res.send(result)

    }) 

      // reviews related
      app.get('/Reviews',async(req,res)=>{
        const result =await reviewCollection.find().toArray();
        res.send(result)
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Book Crafter server is running')
})



app.listen(port, () => {
  console.log(`Book Crafter server is running ${port}`)
})