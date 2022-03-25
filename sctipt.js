const cityNameEl = document.getElementById("cityName");
const currentDate = document.getElementById("currentDate");
const tempEl = document.getElementById("temp");
const humidityEl = document.getElementById("humidity");
const uviEl = document.getElementById("uvi");
const windSpeedEl = document.getElementById("windSpeed");
const weatherIcon = document.getElementById("icon")



const cityList = document.getElementById("city-list");
const weatherDisplay = document.getElementById("weather-display");

var API_KEY = "1bb0ac4c223553b0a3ff97973f7ca679" ;

var cityName;
var allCities;
var data = JSON.parse(localStorage.getItem("savedCities"))
if (!data) {
    allCities = []
} else {
    allCities = data
} 

for (let i =0; i<allCities.length; i++) {
cityName = allCities[i]

    var listItem = document.createElement("li")
listItem.textContent = cityName
cityList.append(listItem)
}

const searchBox = document.getElementById("city");
const searchButton = document.getElementById("search-btn");

searchButton.addEventListener("click", function(){
cityName = searchBox.value;

var listItem = document.createElement("li")
listItem.textContent = cityName
cityList.append(listItem)
allCities.push(cityName)
localStorage.setItem("savedCities", JSON.stringify(allCities))

getLatLon()
})

function getLatLon() {
    var currentWeatherAPI = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`

    fetch(currentWeatherAPI)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        console.log(data);
        var lat = data.coord.lat;
        var lon = data.coord.lon;
        getweatherdata(lat, lon);
    })
}


function getweatherdata(lat, lon) {
    var oneCallAPI = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&appid=${API_KEY}`;

    fetch(oneCallAPI)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        console.log(data);
        dynamicDataPopulation(data)
    })
}

function dynamicDataPopulation(data) {
    var uvi = data.current.uvi;
    var temperature = data.current.temp;
    var humidity = data.current.humidity;
    var windSpeed = data.current.wind_speed;
    var icon = data.current.weather[0].icon;
    var iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`
    var currentDay = data.current.dt;

    currentDay = unixConverter(currentDay)
  
    temperature = kToF(temperature);

    

    cityNameEl.textContent = cityName
    uviEl.textContent = uvi;
    tempEl.textContent = temperature;
    humidityEl.textContent = humidity;
    currentDate.textContent = currentDay;
    windSpeedEl.textContent = windSpeed;
    weatherIcon.setAttribute("src",iconUrl)

    var futureWeather =  data.daily.slice(1,6)
    var futureTempEl = document.querySelectorAll(".temp")
    var futureHumidityEl = document.querySelectorAll(".humidity")
    var futureWindSpeedEl = document.querySelectorAll(".windSpeed")
    var futureIconEl = document.querySelectorAll(".icon")
    var futureDateEl = document.querySelectorAll(".futureDate")
    for (let i =0; i<futureWeather.length; i++) {
        console.log(futureWeather[i].temp)

        var futureTemperature = futureWeather[i].temp.day;
        var futureHumidity = futureWeather[i].humidity;
        var futureWindSpeed = futureWeather[i].wind_speed;
        var futureIcon = futureWeather[i].weather[0].icon;
        var futureIconUrl = `http://openweathermap.org/img/wn/${futureIcon}@2x.png`
        var futureDay = futureWeather[i].dt;

        futureDay = unixConverter(futureDay)
        futureDay = futureDay.split (",")[0]
  
        futureTemperature = kToF(futureTemperature);
    


    futureTempEl[i].textContent =  futureTemperature;
    futureHumidityEl[i].textContent = futureHumidity;
    futureDateEl[i].textContent = futureDay;
    futureWindSpeedEl[i].textContent = futureWindSpeed;
    futureIconEl[i].setAttribute("src",futureIconUrl)

    }

}
  function kToF (temp) {
    temp = ((temp - 273.15)*(9/5)) + 32;
    return  Math.floor(temp);
}
function unixConverter(unix){
    const unixTimestamp = unix;
    const milliseconds = unixTimestamp * 1000;
    const dateObject = new Date(milliseconds) ;
    const dateFormat = dateObject.toLocaleString();
    return dateFormat;
}

