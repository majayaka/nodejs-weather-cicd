const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express()

require('dotenv').config(); // Load API key from .env

const apiKey = process.env.API_KEY; // Fetch API key from .env file

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
  res.render('index', {weather: null, error: null, icon: null});
})

app.post('/', function (req, res) {
  let city = req.body.city;
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`

  request(url, function (err, response, body) {
    if(err){
      res.render('index', {weather: null, error: 'Error, please try again', icon: null});
    } else {
      let weather = JSON.parse(body);
      if(weather.main == undefined){
        res.render('index', {weather: null, error: 'Error, please try again', icon: null});
      } else {
        let weatherText = `It's ${weather.main.temp} degrees Celsius in ${weather.name}, and the weather is ${weather.weather[0].description}.`;
        let weatherIcon = weather.weather[0].icon;  // Icon code from OpenWeatherMap API
        res.render('index', {weather: weatherText, error: null, icon: weatherIcon});
      }
    }
  });
})

app.listen(3000, function () {
  console.log('Weather app listening on port 3000!')
})
