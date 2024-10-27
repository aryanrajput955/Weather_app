import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');

  const apiKey = '895284fb2d2c50a520ea537456963d9c';

  useEffect(() => {
    // Request location access when the component mounts
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherByCoords(latitude, longitude);
        },
        (error) => {
          setError('Location access denied. Please enter a city name.');
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  }, []);

  const fetchWeatherByCoords = (lat, lon) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;
    axios.get(url).then((response) => {
      setData(response.data);
      setError(''); // Clear any previous error
    }).catch((error) => {
      setError('Failed to fetch weather data.');
    });
  };

  const searchLocation = (event) => {
    if (event.key === 'Enter') {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=${apiKey}`;
      axios.get(url).then((response) => {
        setData(response.data);
        setError(''); // Clear any previous error
      }).catch((error) => {
        setError('Location not found.');
      });
      setLocation('');
    }
  };

  return (
    <div className="app">
      <video src="./bgvideo.mp4" autoPlay loop muted></video>
      <div className="search">
        <input
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          onKeyPress={searchLocation}
          placeholder='Enter Location'
          type="text"
        />
      </div>
      
      {error && <p className="error">{error}</p>}
      
      <div className="container">
        <div className="top">
          <div className="location">
            <p>{data.name}</p>
          </div>
          <div className="temp">
            {data.main ? <h1>{data.main.temp.toFixed()}°F</h1> : null}
          </div>
          <div className="description">
            {data.weather ? <p>{data.weather[0].main}</p> : null}
          </div>
        </div>

        {data.name !== undefined && (
          <div className="bottom">
            <div className="feels">
              {data.main ? <p className='bold'>{data.main.feels_like.toFixed()}°F</p> : null}
              <p>Feels Like</p>
            </div>
            <div className="humidity">
              {data.main ? <p className='bold'>{data.main.humidity}%</p> : null}
              <p>Humidity</p>
            </div>
            <div className="wind">
              {data.wind ? <p className='bold'>{data.wind.speed.toFixed()} MPH</p> : null}
              <p>Wind Speed</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
