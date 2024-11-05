const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const client = require('prom-client'); 
const axios = require('axios');
const path = require('path');
const app = express()

require('dotenv').config(); // Load API key from .env

const apiKey = process.env.API_KEY; // Fetch API key from .env file

// Create un instance to Prometheus Metrics
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics(); // Collect default metrics

// Add the endpoint of metrics
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics()); 
  } catch (error) {
    console.error('Error getting metrics', error);
    res.status(500).end('Error getting metrics');
  }
});


app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

app.set('views', path.join(__dirname, 'views'));

app.get('/', function (req, res) {
  res.render('index', {weather: null, error: null, icon: null});
})

app.post('/', async function (req, res) {
  let city = req.body.city;
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  try {
    const response = await axios.get(url);
    const weather = response.data;
    let weatherText = `It's ${weather.main.temp} degrees Celsius in ${weather.name}, and the weather is ${weather.weather[0].description}.`;
    let weatherIcon = weather.weather[0].icon;  // Icon code from OpenWeatherMap API
    res.render('index', { weather: weatherText, error: null, icon: weatherIcon });
  } catch (error) {
    if (error.response && error.response.status === 404) {
      res.render('index', { weather: null, error: 'City not found, please try again', icon: null });
    } else {
      res.render('index', { weather: null, error: 'Error, please try again', icon: null });
    }
  }
});


app.listen(3000, function () {
  console.log('Weather app listening on port 3000!')
})
