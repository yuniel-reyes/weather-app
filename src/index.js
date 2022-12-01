import style from './style.css';

export default function App() {
  const nodeRef = {
    search: document.querySelector('#form2 input'),
    city_name: document.getElementById('city-and-description'),
    temp: document.getElementById('temperature-container'),
    feels_like: document.getElementById('temp-feels-like'),
    theImage: document.getElementById('the-giphy'),
  };

  const handlers = (() => {
    nodeRef.search.addEventListener('blur', (e) => {
      e.preventDefault();
      let description = hitTheWeatherAPI(nodeRef.search.value);
      hitGiphy(description);
    });
    nodeRef.search.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        let description = hitTheWeatherAPI(nodeRef.search.value);
        hitGiphy(description);
      }
    });
  })();

  async function hitGiphy(description) {
    const API_KEY = 't2beZGGfotGSCAOPfRoixQjvJ2OwkSYF';

    try {
      let response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${description}&limit=25&offset=0&rating=g&lang=en`
      );
      let image = await response.json();
      populateWebGiphy(image);
    } catch (err) {
      console.log(err);
    }
  }

  async function hitTheWeatherAPI(value) {
    const API_KEY = 'e7c22274ac8f436f89da04b9dfd58cde';
    let weather = {};

    try {
      let response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${value}&appid=${API_KEY}&units=metric`
      );
      let city = await response.json();
      weather.city_name = city.name;
      weather.temp = city.main.temp;
      weather.feels_like = city.main.feels_like;
      weather.description = city.weather[0].description;
      populateWeb(weather);
      hitGiphy(weather.description);
      return city.description;
    } catch (err) {
      console.log(err);
    }
  }

  function populateWeb(obj) {
    nodeRef.city_name.firstElementChild.textContent = `${obj.city_name} |`;
    nodeRef.city_name.lastElementChild.textContent = obj.description;
    nodeRef.temp.firstElementChild.textContent = `${Math.trunc(obj.temp)}°C`;
    nodeRef.feels_like.firstElementChild.textContent = `Feels like: ${Math.trunc(
      obj.feels_like
    )}°C`;
  }

  function populateWebGiphy(obj) {
    nodeRef.theImage.firstElementChild.src = obj.data[0].images.original.url;
    // console.log(obj.data[0].images.original.url);
  }

  window.document.onload = hitTheWeatherAPI('Madrid');
}

App();
