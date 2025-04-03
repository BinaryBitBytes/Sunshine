export default async function getWeatherData(city) {
  var url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&units=imperial&appid=75cb326e22036d2782293ee5a922582b";
  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data != null && data.cod == 200) {
        cityWeatherData = data;
        latitude = data.coord.lat;
        longitude = data.coord.lon;

        //Stores search info in local storage and gets TrueWay API info
        handleSearchRequest(city);

        loadSavedCities();

        // Fetch Weather API
        function getWeatherData(city) {
          var url =
            "https://api.openweathermap.org/data/2.5/weather?q=" +
            city +
            "&units=imperial&appid=75cb326e22036d2782293ee5a922582b";
          fetch(url)
            .then(function (response) {
              return response.json();
            })
            .then(function (data) {
              if (data != null && data.cod == 200) {
                cityWeatherData = data;
                latitude = data.coord.lat;
                longitude = data.coord.lon;
              } else {
                console.log("Error from API");
              }
            });
        }
      } else {
        console.log("error");

        //Trigger/Open the Modal
        document.getElementById("id01").style.display = "block";
        searchInput.val("");
      }
    });
}
