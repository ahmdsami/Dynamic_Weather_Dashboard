// Declaring variables that will be changed according to the city selected by the user
const cityElement = document.querySelector("#city");
const dayElement = document.querySelector("#day");
const currentWeatherIconElement = document.querySelector(".tempratureImage");
const currentTemperatureElement = document.querySelector(".tempratureDegree");
const currentConditionElement = document.querySelector(".dataFirstRow p");
const mainTemperatureElement = document.querySelector(".dataSecondRow p");
const maximumTemperatureElement = document.querySelector(".dataThirdRow p");
const humidityElement = document.querySelector(".subsection > div:first-child h2");
const windSpeedElement = document.querySelector(".subsection > div:nth-child(2) h2");
const weeklyDayElements = document.querySelectorAll(".week > div > p:first-of-type");
const weeklyWeatherIconElements = document.querySelectorAll(".week > div > img");
const weeklyTemperatureElements = document.querySelectorAll(".week > div > p:last-of-type");
const airQualityElement = document.querySelector(".overviewContent > .first h2");
const uvIndexElement = document.querySelector(".overviewContent > .second h2");
const pressureElement = document.querySelector(".overviewContent > .third h2");
const sunriseElement = document.querySelector(".final > .second > div:first-of-type p:last-of-type");
const sunsetElement = document.querySelector(".final > .second > div:nth-of-type(2) p:last-of-type");



/* Understand async, await */

// Fetching weather data
let weatherData = undefined

async function getWeatherData() {
    let res = await fetch("https://api.open-meteo.com/v1/forecast?latitude=27&longitude=30&hourly=temperature_2m,relative_humidity_2m&current=temperature_2m,is_day,relative_humidity_2m,surface_pressure,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,uv_index_max,sunrise,sunset&timezone=Africa%2FCairo")
    try {
        if(!res.ok) throw new Error(`Error Occurder, ${res.status}`)

        weatherData = await res.json()
        return weatherData 
    }
    catch(err)
    {
        console.log(err.message)
    }     
}

getWeatherData()
.then(data => 
    // All logic here 
    {
        console.log(data)
        cityElement.innerHTML = data.timezone.replace("Africa/", "")
        currentTemperatureElement.firstChild.textContent = data.current.temperature_2m
        const date = weatherData.current.time.slice(0, 10);
        const dayName = new Date(date).toLocaleDateString("en-US", {
            weekday: "long",
            timeZone: "UTC"
        });
        dayElement.textContent = dayName;
        currentWeatherIconElement.alt = `Weather code ${data.current.weather_code}`
        currentConditionElement.innerHTML = `Weather code ${data.current.weather_code}`
        mainTemperatureElement.innerHTML = `${data.current.temperature_2m}°C`
        maximumTemperatureElement.innerHTML = `${data.daily.temperature_2m_max[0]}°C`
        humidityElement.innerHTML = data.current.relative_humidity_2m
        windSpeedElement.innerHTML = data.current.wind_speed_10m
        
        weeklyWeatherIconElements.forEach((element, index) => {
            if (data.daily.weather_code[index] !== undefined) {
                element.alt = `Weather code ${data.daily.weather_code[index]}`
            }
        })
        weeklyTemperatureElements.forEach((element, index) => {
            if (data.daily.temperature_2m_max[index] !== undefined) {
                element.innerHTML = data.daily.temperature_2m_max[index]
            }
        })
        uvIndexElement.innerHTML = data.daily.uv_index_max[0]
        pressureElement.innerHTML = data.current.surface_pressure
        sunriseElement.innerHTML = `${data.daily.sunrise[0].split("T")[1]} AM`
        sunsetElement.innerHTML = `${data.daily.sunset[0].split("T")[1]} PM`
 
    }
)
.catch()
