import createDom from "./domHandler";

// The module is responsible for extracting and displaying location data
const WeatherDataModule = (() => {
  // Call the API to extract the data in json
  async function loadJson(url) {
    try {
      const response = await fetch(url, {
        mode: "cors",
      });

      if (!response.ok) {
        const error = new Error(`HTTP error! Status: ${response.status}`);
        error.originalError = await response.json();
        throw error;
      }
      const json = await response.json();
      return json;
    } catch (error) {
      const newError = new Error(
        `Error fetching or parsing JSON: ${error.message}`,
      );
      if (error.originalError) {
        newError.originalError = error.originalError;
      }
      throw newError;
    }
  }

  // Helper function processing json and parsing data
  function parseLocationData(url) {
    loadJson(url)
      .then((json) => {
        console.log(json);

        const todayWeather = {
          current: {
            city: json.location.name,
            country: json.location.country,
            conditionText: json.current.condition.text,
            conditionIcon: json.current.condition.icon,
            feelsLikeC: json.current.feelslike_c,
            feelsLikeF: json.current.feelslike_f,
            tempC: json.current.temp_c,
            tempF: json.current.temp_f,
            localTime: json.location.localtime,
            humidity: json.current.humidity,
            visibility: json.current.vis_km,
            cloudiness: json.current.cloud,
            sunrise: json.forecast.forecastday[0].astro.sunrise,
            sunset: json.forecast.forecastday[0].astro.sunset,
          },
          forecast: [
            {
              day: "tomorrow",
              date: json.forecast.forecastday[1].date,
              conditionIcon: json.forecast.forecastday[1].day.condition.icon,
              conditionText: json.forecast.forecastday[1].day.condition.text,
              avgtemp_c: json.forecast.forecastday[1].day.avgtemp_c,
              avgtemp_f: json.forecast.forecastday[1].day.avgtemp_f,
            },
            {
              day: "day after tomorrow",
              date: json.forecast.forecastday[2].date,
              conditionIcon: json.forecast.forecastday[2].day.condition.icon,
              conditionText: json.forecast.forecastday[2].day.condition.text,
              avgtemp_c: json.forecast.forecastday[2].day.avgtemp_c,
              avgtemp_f: json.forecast.forecastday[2].day.avgtemp_f,
            },
            {
              day: "fourth day",
              date: json.forecast.forecastday[3].date,
              conditionIcon: json.forecast.forecastday[3].day.condition.icon,
              conditionText: json.forecast.forecastday[3].day.condition.text,
              avgtemp_c: json.forecast.forecastday[3].day.avgtemp_c,
              avgtemp_f: json.forecast.forecastday[3].day.avgtemp_f,
            },
          ],
        };

        console.log(todayWeather);

        createDom.deleteDynamicDomElements();
        createDom.createDynamicDomElements(
          createDom.defineDynamicDomTree(todayWeather),
          document.querySelector(".wrapper"),
        );
      })
      .catch((error) => {
        console.log(error.message);
        if (error.originalError) {
          console.log("Original error object: ", error.originalError);
        }
      });
  }

  // Show data based on user location during page load
  function showDefaultLocationData() {
    const cityName = "London";
    const url = `https://api.weatherapi.com/v1/forecast.json?key=027eb181bc914763a0e140125232911&q=${cityName}&days=4`;
    parseLocationData(url);
  }

  // Show data based on user search
  function showSearchedLocationData() {
    const searchForm = document.querySelector(".search-form");
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const cityName = document.querySelector("#search");
      const url = `https://api.weatherapi.com/v1/forecast.json?key=027eb181bc914763a0e140125232911&q=${cityName.value}&days=4`;
      parseLocationData(url);
    });
  }

  // Show data based on determiend user's location
  async function showUserLocationData() {
    let ipAddress;
    try {
      const ipResponse = await fetch("https://api.ipify.org?format=json");
      const ipData = await ipResponse.json();
      ipAddress = ipData.ip;
    } catch (error) {
      showDefaultLocationData();
    }

    if (ipAddress) {
      try {
        const locationResponse = await fetch(
          `https://ipapi.co/${ipAddress}/json/`,
        );
        const locationData = await locationResponse.json();
        const { latitude, longitude } = locationData;
        const url = `https://api.weatherapi.com/v1/forecast.json?key=027eb181bc914763a0e140125232911&q=${latitude},${longitude}&days=4`;
        parseLocationData(url);
        return;
      } catch (error) {
        showDefaultLocationData();
      }
    }
    showDefaultLocationData();
  }

  return {
    showSearchedLocationData,
    showUserLocationData,
    showDefaultLocationData,
  };
})();

export default WeatherDataModule;
