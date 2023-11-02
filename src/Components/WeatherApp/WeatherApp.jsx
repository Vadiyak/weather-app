import React, { useState, useEffect } from 'react';
import './WeatherApp.css';

import search_icon from '../Assets/search.png';
import clear_icon from '../Assets/clear.png';
import cloud_icon from '../Assets/cloud.png';
import drizzle_icon from '../Assets/drizzle.png';
import rain_icon from '../Assets/rain.png';
import snow_icon from '../Assets/snow.png';
import wind_icon from '../Assets/wind.png';
import humidity_icon from '../Assets/humidity.png';

const WeatherApp = () => {
    const apiKey = "da74117caa2f7eab25c2aa854c1a2b54";
    const [wicon, setWicon] = useState(cloud_icon);
    const [weatherData, setWeatherData] = useState(null);
    const [city, setCity] = useState('London');
    const [formattedTime, setFormattedTime] = useState('');

    useEffect(() => {
        // Load initial weather data for the default city (London).
        fetchData(city);
    }, []);

    const fetchData = async (searchCity) => {
        const urlSearch = `http://api.openweathermap.org/geo/1.0/direct?q=${searchCity}&limit=2&appid=${apiKey}`;
        const response = await fetch(urlSearch);
        const locationData = await response.json();

        if (locationData.length > 0) {
            const lat = locationData[0].lat;
            const lon = locationData[0].lon;

            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
            const dataResponse = await fetch(url);
            const data = await dataResponse.json();

            setWeatherData(data);

            // Determine the weather icon based on the received weather condition.
            updateWeatherIcon(data.weather[0].icon);

            // Extract the timezone offset from your API response
            const timezoneOffset = data.timezone;
            // Create a Date object for the local time
            const localTime = new Date(new Date().getTime() + timezoneOffset * 1000); // Convert seconds to milliseconds

            // Format the local time as a string (e.g., HH:MM AM/PM)
            const options = { hour: 'numeric', minute: 'numeric', hour12: true };
            const timeString = localTime.toLocaleTimeString(undefined, options);
            setFormattedTime(timeString); // Update the state with the formatted time



        } else {
            console.log("No location data found.");
        }
    };

    const updateWeatherIcon = (icon) => {
        switch (icon) {
            case "01d":
            case "01n":
                setWicon(clear_icon);
                break;
            case "02d":
            case "02n":
                setWicon(cloud_icon);
                break;
            case "03d":
            case "03n":
                setWicon(drizzle_icon);
                break;
            case "04d":
            case "04n":
                setWicon(drizzle_icon);
                break;
            case "09d":
            case "09n":
            case "10d":
            case "10n":
                setWicon(rain_icon);
                break;
            case "13d":
            case "13n":
                setWicon(snow_icon);
                break;
            default:
                setWicon(cloud_icon);
                break;
        }
    };

    const handleSearch = () => {
        const element = document.getElementsByClassName("cityInput");
        if (element[0].value === "") {
            return;
        }

        setCity(element[0].value);
        fetchData(element[0].value);
    };



    // const timezoneOffset = data.timezone;
    // const localTime = new Date(new Date().getTime() + timezoneOffset * 1000); // Convert seconds to milliseconds
    // const options = { hour: 'numeric', minute: 'numeric', hour12: true };
    // const formattedTime = localTime.toLocaleTimeString(undefined, options);

    // // Display the local time in your component
    // <div className="weatherTime">{formattedTime}</div>












    return (
        <div className='container'>
            <div className="top-bar">
                <input type="text" className="cityInput" placeholder='Search' />
                <div className="searchIcon" onClick={handleSearch}>
                    <img src={search_icon} alt="searchIcon" />
                </div>
            </div>
            <div className="weatherImage">
                <img src={wicon} alt="weather_image" />
            </div>
            {weatherData && (
                <>
                    <div className="weatherTemp">{Math.floor(weatherData.main.temp)}°C</div>
                    <div className="weatherLocation">{weatherData.name}</div>
                    <div className="weatherTime">{formattedTime}</div>
                </>
            )}
            <div className="dataContainer">
                <div className="element">
                    <img src={humidity_icon} className="icon" />
                    <div className="data">
                        {weatherData && (
                            <>
                                <div className="humidityPercentage">{weatherData.main.humidity}%</div>
                                <div className="text">Humidity</div>
                            </>
                        )}
                    </div>
                </div>
                <div className="element">
                    <img src={wind_icon} className="icon" />
                    <div className="data">
                        {weatherData && (
                            <>
                                <div className="windSpeed">{Math.floor(weatherData.wind.speed)} km/h</div>
                                <div className="text">Wind Speed</div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeatherApp;
