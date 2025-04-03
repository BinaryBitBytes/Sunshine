export default async function success(position) {
  longitude = position.coords.longitude;
  latitude = position.coords.latitude;

  //Render Weather
  function getLocalWeatherData(latitude, longitude) {
    var url =
      "https://api.openweathermap.org/data/2.5/weather?lat=" +
      latitude +
      "&lon=" +
      longitude +
      "&units=imperial&appid=75cb326e22036d2782293ee5a922582b";
    fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        if (data != null && data.cod == 200) {
          //Capture local weather in a global variable
          localWeatherData = data;

          //Render the local weather page elements
          $("#weather")
            .text(localWeatherData.weather[0].description)
            .css("text-transform", "capitalize")
            .append(
              $("<img>")
                .attr("alt", localWeatherData.weather[0].description)
                .attr(
                  "src",
                  "http://openweathermap.org/img/wn/" +
                    localWeatherData.weather[0].icon +
                    "@2x.png"
                )
            );
        } else {
          console.log("Error from API");
        }
      });
  }

  getLocalWeatherData(latitude, longitude);
}
