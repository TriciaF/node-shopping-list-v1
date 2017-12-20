'use strict';

const express = require('express');
// we'll use morgan to log the HTTP layer
const morgan = require('morgan');
// we'll use body-parser's json() method to 
// parse JSON data sent in requests to this app
const bodyParser = require('body-parser');

// we import the ShoppingList model, which we'll
// interact with in our GET endpoint
const { ShoppingList } = require('./models');
const { Recipes } = require('./models');

const jsonParser = bodyParser.json();
const app = express();

// log the http layer
app.use(morgan('common'));

// we're going to add some items to ShoppingList
// so there's some data to look at. Note that 
// normally you wouldn't do this. Usually your
// server will simply expose the state of the
// underlying database.
ShoppingList.create('beans', 2);
ShoppingList.create('tomatoes', 3);
ShoppingList.create('peppers', 4);
Recipes.create('chocolate milk', ['cocoa', 'milk', 'sugar']);

// when the root of this route is called with GET, return
// all current ShoppingList items by calling `ShoppingList.get()`
app.get('/shopping-list', (req, res) => {
  res.json(ShoppingList.get());
});

// when the root of this route is called with GET, return
// all current Recipe items by calling `Recipes.get()`
app.get('/recipes', (req, res) => {
  res.json(Recipes.get());
});

app.post('/shopping-list', jsonParser, (req, res) => {
  const name = req.body.name;
  const budget = req.body.budget;
  const item = ShoppingList.create(name, budget);
  console.log(item);
  res.status(201).json(item);
});

app.post('/recipes', jsonParser, (req, res) => {
  const name = req.body.name;
  const ingredients = req.body.ingredients;
  const item = Recipes.create(name, ingredients);
  console.log(item);
  res.status(201).json(item);
});

app.delete('/shopping-list/:id', (req, res) => {
  ShoppingList.delete(req.params.id);
  console.log('Deleting shopping-list item = ' + req.params.id);
  res.status(204).end();
});

app.delete('/recipes/:id', (req, res) => {
  Recipes.delete(req.params.id);
  console.log('Deleting Recipe item = ' + req.params.id);
  res.status(204).end();
});


app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});