require("dotenv").config();
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const cors = require('cors');
const { resolveSoa } = require("dns");
const e = require("express");

const app = express();


app.use(bodyParser.json());
app.use(cors());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://weather-app-frontend-gxwu.onrender.com');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.post("/weather", function (req, res) {

    const query = req.body.query;

    if (query === "") {
        return res.status(400).json({ error: 'Location required.' });
    } else {
        try {

            const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + process.env.API_KEY + "&units=metric";

            https.get(url, function (response) {

                response.on("data", function (data) {

                    let weatherData = JSON.parse(data)

                    let code = weatherData.cod;
                    let weatherDes = "";
                    let temp = "0.0";
                    let icon = "11d";
                    let humidity = "0";
                    let speed = "0";
                    let name = "";

                    if (code == 200) {
                        weatherDes = weatherData.weather[0].description;
                        temp = weatherData.main.temp;
                        icon = weatherData.weather[0].icon;
                        humidity = weatherData.main.humidity;
                        speed = weatherData.wind.speed;
                        name = weatherData.name;
                        res.json({ temp, weatherDes, icon, humidity, speed, name, code });

                    } else if (code == 404) {
                        weatherDes = weatherData.message;
                        res.json({ weatherDes, temp, icon, humidity, speed, name, code });

                    } else {
                        return res.status(500).json({ error: 'Error! :(' });
                    }
                });
            });
        } catch (err) {
            console.log(err);
        }
    }
})



app.listen(9000, function () {
    console.log("Server started at port 9000");
});
