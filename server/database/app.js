const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const  cors = require('cors')
const app = express()
const port = 3030;

app.use(cors())
app.use(require('body-parser').urlencoded({ extended: false }));

// Load seed JSON robustly both in Docker (files at app root)
// and locally (files under data/)
function loadJson(candidates) {
  for (const name of candidates) {
    try {
      return JSON.parse(fs.readFileSync(name, 'utf8'));
    } catch (e) { /* try next candidate */ }
  }
  throw new Error('Could not load JSON from: ' + candidates.join(', '));
}
const reviews_data = loadJson(["reviews.json", "data/reviews.json", path.join(__dirname, "reviews.json"), path.join(__dirname, "data/reviews.json")]);
const dealerships_data = loadJson(["dealerships.json", "data/dealerships.json", path.join(__dirname, "dealerships.json"), path.join(__dirname, "data/dealerships.json")]);

const mongoUrl = process.env.MONGO_URL || "mongodb://mongo_db:27017/";
mongoose.connect(mongoUrl, {'dbName':'dealershipsDB'}).catch(err => console.log('Mongo connection failed, using JSON fallback:', err.message));


const Reviews = require('./review');

const Dealerships = require('./dealership');

try {
  Reviews.deleteMany({}).then(()=>{
    Reviews.insertMany(reviews_data['reviews']);
  }).catch(err => console.log('Skipping reviews seed (DB unavailable):', err.message));
  Dealerships.deleteMany({}).then(()=>{
    Dealerships.insertMany(dealerships_data['dealerships']);
  }).catch(err => console.log('Skipping dealerships seed (DB unavailable):', err.message));

} catch (error) {
  console.log('Skipping Mongo seed (DB unavailable):', error.message);
}


// Express route to home
app.get('/', async (req, res) => {
    res.send("Welcome to the Mongoose API")
});

// Express route to fetch all reviews
app.get('/fetchReviews', async (req, res) => {
  try {
    const documents = await Reviews.find();
    res.json(documents);
  } catch (error) {
    // Fallback to seeded JSON when Mongo is unavailable (local dev without Docker)
    res.json(reviews_data['reviews']);
  }
});

// Express route to fetch reviews by a particular dealer
app.get('/fetchReviews/dealer/:id', async (req, res) => {
  try {
    const documents = await Reviews.find({dealership: req.params.id});
    res.json(documents);
  } catch (error) {
    // Fallback to seeded JSON when Mongo is unavailable (local dev without Docker)
    res.json(reviews_data['reviews'].filter(r => r.dealership === parseInt(req.params.id)));
  }
});

// Express route to fetch all dealerships
app.get('/fetchDealers', async (req, res) => {
  try {
    const documents = await Dealerships.find();
    res.json(documents);
  } catch (error) {
    // Fallback to seeded JSON when Mongo is unavailable (local dev without Docker)
    res.json(dealerships_data['dealerships']);
  }
});

// Express route to fetch Dealers by a particular state
app.get('/fetchDealers/:state', async (req, res) => {
  try {
    const documents = await Dealerships.find({state: req.params.state});
    res.json(documents);
  } catch (error) {
    // Fallback to seeded JSON when Mongo is unavailable (local dev without Docker)
    res.json(dealerships_data['dealerships'].filter(d => d.state === req.params.state));
  }
});

// Express route to fetch dealer by a particular id
app.get('/fetchDealer/:id', async (req, res) => {
  try {
    const documents = await Dealerships.find({id: parseInt(req.params.id)});
    res.json(documents);
  } catch (error) {
    // Fallback to seeded JSON when Mongo is unavailable (local dev without Docker)
    res.json(dealerships_data['dealerships'].filter(d => d.id === parseInt(req.params.id)));
  }
});

//Express route to insert review
// In-memory fallback store when Mongo is unavailable (local dev without Docker)
let memoryReviews = null;
app.post('/insert_review', express.raw({ type: '*/*' }), async (req, res) => {
  data = JSON.parse(req.body);
  try {
    const documents = await Reviews.find().sort( { id: -1 } )
    let new_id = documents[0]['id']+1

    const review = new Reviews({
  		"id": new_id,
  		"name": data['name'],
  		"dealership": data['dealership'],
  		"review": data['review'],
  		"purchase": data['purchase'],
  		"purchase_date": data['purchase_date'],
  		"car_make": data['car_make'],
  		"car_model": data['car_model'],
  		"car_year": data['car_year'],
  	});

    const savedReview = await review.save();
    res.json(savedReview);
  } catch (error) {
    console.log('Mongo unavailable, storing review in-memory:', error.message);
    if (!memoryReviews) memoryReviews = reviews_data['reviews'];
    const maxId = memoryReviews.reduce((m, r) => Math.max(m, r.id), 0);
    const newReview = {
      "id": maxId + 1,
      "name": data['name'],
      "dealership": parseInt(data['dealership']),
      "review": data['review'],
      "purchase": data['purchase'],
      "purchase_date": data['purchase_date'],
      "car_make": data['car_make'],
      "car_model": data['car_model'],
      "car_year": parseInt(data['car_year']),
    };
    memoryReviews.push(newReview);
    reviews_data['reviews'] = memoryReviews;
    res.json(newReview);
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
