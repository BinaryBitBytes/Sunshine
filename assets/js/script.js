// import onSearchBtnClick from "./actions/CREATE/onSearchBtnClick.esx";
// import clearSavedCities from "./actions/DELETE/clearSavedCities";
// import getWeatherData from "./actions/READ/getWeatherData";
// import handleSearchRequest from "./actions/READ/handleSearchRequest";
// import loadSavedCities from "./actions/READ/loadSavedCities";
// import getActivities from "./actions/UPDATE/getActivities";
// import renderResults from "./actions/UPDATE/renderResults";
// import fail from "./onStatus/fail";
// import success from "./onStatus/success";
// Declare global variables
var latitude = 0;
var longitude = 0;
var date = moment().format("dddd, MMMM Do, h:mm a");
var localWeatherData;
var cityWeatherData;
var trueWayPlaces;

// Capture HTML elements
var searchInput = $("#the-one-input-to-rule-them-all");
var mainSection = $("#main-section");
var currentWeather = $("#current-weather");
var resultsSection = $("#results-section");
var rulesInfo = $("#rules-info");
var btnsearchEl = $("#btnsearch");
var searchedCitiesListEl = $("#searchedCitiesList");
var clearCityBtnEl = $("#clearCityBtnEl");
var suggestedActivitiesHeadingEl = $("#suggested-activities-heading");

// Hide results section
resultsSection.hide();

//If the geolocation succeeds
function success(position) {
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

function fail(fail) {
  console.log(fail);
  $("#weather").text("Enable geolocation");
}

// Fetch Weather API
//!
function getWeatherData() {
  // Simulated weather data fetch (replace with your actual API call)
  return fetch(
    "https://api.openweathermap.org/data/2.5/weather?lat=33.3807&lon=-84.7997&appid=75cb326e22036d2782293ee5a922582b"
  )
    .then((response) => response.json())
    .then((data) => {
      window.cityWeatherData = data; // Store globally or pass differently
      const activities = getActivities();
      return handleSearchRequest(activities); // Returns a Promise
    })
    .then((results) => {
      // Process results (e.g., update UI)
      results.forEach(({ activity, data }) => {
        if (data && data.results) {
          console.log(
            `Found ${data.results.length} ${activity} places:`,
            data.results
          );
          // Update your UI here with data.results
        } else {
          console.log(`No results for ${activity}`);
        }
      });
    })
    .catch((err) => console.error("Error in getWeatherData:", err));
}

function onSearchBtnClick(event) {
  event.preventDefault();
  getWeatherData(); // Trigger the chain
}

// Assuming jQuery event binding from your stack trace
$("#search-btn").on("click", onSearchBtnClick);
//!
//?  function getWeatherData(city) {
//   var url =
//     "https://api.openweathermap.org/data/2.5/weather?q=" +
//     city +
//     "&units=imperial&appid=75cb326e22036d2782293ee5a922582b";
//   fetch(url)
//     .then(function (response) {
//       return response.json();
//     })
//     .then(function (data) {
//       if (data != null && data.cod == 200) {
//         cityWeatherData = data;
//         latitude = data.coord.lat;
//         longitude = data.coord.lon;

//         //Stores search info in local storage and gets TrueWay API info
//         handleSearchRequest(city);

//         loadSavedCities();

//         // Fetch Weather API
//         function getWeatherData(city) {
//           var url =
//             "https://api.openweathermap.org/data/2.5/weather?q=" +
//             city +
//             "&units=imperial&appid=75cb326e22036d2782293ee5a922582b";
//           fetch(url)
//             .then(function (response) {
//               return response.json();
//             })
//             .then(function (data) {
//               if (data != null && data.cod == 200) {
//                 cityWeatherData = data;
//                 latitude = data.coord.lat;
//                 longitude = data.coord.lon;
//               } else {
//                 console.log("Error from API");
//               }
//             });
//         }
//       } else {
//         console.log("error");

//         //Trigger/Open the Modal
//         document.getElementById("id01").style.display = "block";
//         searchInput.val("");
//       }
//     });
//?  }

// Saves search info to local storage and gets TrueWay API info
//!
async function handleSearchRequest(activities) {
  const lat = latitude; // Use global latitude from getWeatherData
  const lon = longitude; // Use global longitude from getWeatherData
  const radius = 10000;
  const language = "en";
  const apiKey = "734c30af31msh2b2dd1bb5c42b30p189756jsn09a96e76d550"; // Replace with your RapidAPI key
  const apiHost = "trueway-places.p.rapidapi.com";

  const validActivities = activities.filter(
    (activity) => activity !== "no_activities_suggested"
  );
  if (validActivities.length === 0) {
    console.log("No valid activities to search for.");
    return Promise.resolve([]);
  }

  const requests = validActivities.map((activity) => {
    const url = `https://trueway-places.p.rapidapi.com/FindPlacesNearby?location=${lat},${lon}&radius=${radius}&language=${language}&type=${activity}`;
    return fetch(url, {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": apiHost,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Failed to fetch ${activity} places: ${response.status}`
          );
        }
        return response.json().then((data) => ({ activity, data }));
      })
      .catch((err) => {
        console.error(`Error fetching ${activity}:`, err);
        return { activity, data: null };
      });
  });

  return Promise.all(requests)
    .then((results) => {
      console.log("Places for each activity:", results);
      return results;
    })
    .catch((err) => {
      console.error("Error in handleSearchRequest:", err);
      return [];
    });
} //!
//? function handleSearchRequest(city) {
//   /*****************************************/
//   //Store search values in local storage
//   var previousSearches;

//   if (JSON.parse(localStorage.getItem("previousSearches")) == null) {
//     previousSearches = [];
//   } else {
//     previousSearches = JSON.parse(localStorage.getItem("previousSearches"));
//   }

//   console.log(previousSearches);

//   var searchValues = {
//     cityName: city,
//     city_latitude: latitude,
//     city_longitude: longitude,
//     placeType: getActivities(),
//     searchRadius: 10000,
//   };

//   //The object is added to the previous searches array
//   var savedList = JSON.parse(localStorage.getItem("previousSearches"));
//   var cityExist = false;
//   if (savedList != null) {
//     for (var index = 0; index < savedList.length; index++) {
//       //const element = array[index];
//       if (
//         savedList[index].cityName.toLowerCase() ==
//         searchValues.cityName.toLowerCase()
//       ) {
//         cityExist = true;
//       }
//     }
//   }

//   if (!cityExist) {
//     previousSearches.unshift(searchValues);
//     //Limit max saved searches to 10
//     if (previousSearches.length >= 10) {
//       previousSearches.pop();
//     }
//   }

//   //The array is stored locally in JSON
//   localStorage.setItem("previousSearches", JSON.stringify(previousSearches));
//   /*****************************************/

//   /*****************************************/
//   //Fetch the TrueWay API

//   //Setup URL request
//   var trueWayURL =
//     "https://trueway-places.p.rapidapi.com/FindPlacesNearby?location=" +
//     searchValues.city_latitude +
//     "%2C" +
//     searchValues.city_longitude +
//     "&radius=" +
//     searchValues.searchRadius +
//     "&language=en" +
//     "&type=" +
//     searchValues.placeType;

//   var trueWayOptions = {
//     method: "GET",
//     headers: {
//       "x-rapidapi-host": "trueway-places.p.rapidapi.com",
//       "x-rapidapi-key": "734c30af31msh2b2dd1bb5c42b30p189756jsn09a96e76d550",
//     },
//   };

//   fetch(trueWayURL, trueWayOptions)
//     .then((response) => {
//       console.log(response);
//       //Save the place results to a global variable
//       response = response.json();
//       return response;
//     })
//     .then(function (response) {
//       trueWayPlaces = response.results;
//       suggestedActivitiesHeadingEl.text(`Suggested Activities in ${city}`);
//       renderResults();
//     })
//     .catch((err) => {
//       console.error(err);
//     });
//? }
/*****************************************/

//!------------------------/
function getActivities() {
  var time = moment(new Date(cityWeatherData.dt * 1000)).format("H"); // Use "H" for 24-hour format
  var cod = Number(String(cityWeatherData.weather[0].id).charAt(0));

  var outDoor = [
    "art_gallery",
    "tourist_attraction",
    "park",
    "zoo",
    "stadium",
    "car_wash",
  ];
  var indoor = [
    "library",
    "art_gallery",
    "bar",
    "casino",
    "museum",
    "restaurant",
    "gym",
    "cinema",
    "bowling",
  ];
  var evening = [
    "cafe",
    "night_club",
    "bar",
    "museum",
    "stadium",
    "liquor_store",
    "cinema",
    "bowling",
  ];

  // Helper function to get multiple random activities from an array
  function getRandomActivities(arr, count = 3) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random()); // Shuffle array
    return shuffled.slice(0, Math.min(count, arr.length)); // Return up to 'count' items
  }

  if (Number(time) > 18) {
    return getRandomActivities(evening);
  }

  switch (cod) {
    case 8:
      const outdoorActivities = getRandomActivities(outDoor);
      console.log(`Outdoor activities: ${outdoorActivities}`);
      return outdoorActivities;

    case 5:
      return ["Library", "Museum", "Cinema"]; // Fixed set for rain

    case 6:
    case 3:
      return getRandomActivities(indoor);

    default:
      return ["No activities suggested"]; // Default case returns a single-item array
  }
}

//!------------------------/
//? function getActivities() {
//   var time = moment(new Date(cityWeatherData.dt * 1000)).format("h");
//   var cod = Number(String(cityWeatherData.weather[0].id).charAt(0));

//   var outDoor = [
//     "art_gallery",
//     "tourist_attraction",
//     "park",
//     "zoo",
//     "stadium",
//     "car_wash",
//   ];
//   var indoor = [
//     "library",
//     "art_gallery",
//     "bar",
//     "casino",
//     "museum",
//     "restaurant",
//     "gym",
//     "cinema",
//     "bowling",
//   ];
//   var evening = [
//     "cafe",
//     "night_club",
//     "bar",
//     "museum",
//     "stadium",
//     "liquor_store",
//     "cinema",
//     "bowling",
//   ];

//   if (Number(time) > 18) {
//     return evening[Math.floor(Math.random() * evening.length)];
//   }

//   switch (cod) {
//     case 8:
//       res = outDoor[Math.floor(Math.random() * outDoor.length)];
//       console.log(`response of result`);
//       console.log(res);
//       //   console.log(`response data for outdoor`);
//       //   console.log(res.data);
//       return res;

//     case 5:
//       return "Library";

//     case 6:
//     case 3:
//       return indoor[Math.floor(Math.random() * indoor.length)];

//     default:
//       return "";
//   }
// }

// TODO : Show section of activities
function renderResults() {
  rulesInfo.hide();
  resultsSection.hide();

  //Assign jQuery references to results elements
  //var heroSection = $('.hero-section');

  $("#city-weather").empty();

  $("#city-weather")
    .text(cityWeatherData.weather[0].main)
    .append(
      $("<img>")
        .attr("alt", cityWeatherData.weather[0].description)
        .attr(
          "src",
          "http://openweathermap.org/img/wn/" +
            cityWeatherData.weather[0].icon +
            "@2x.png"
        )
    );

  $("#city-time").empty();

  $("#city-time").text(
    moment(new Date(cityWeatherData.dt * 1000)).format("hh:mm a")
  );

  var cards = $("#card-section");

  for (let i = 1; i <= cards[0].childElementCount; i++) {
    //This loop populates the card info

    //Reference cards
    var cardActivityID = `#card-${i}-activity-name`;
    var cardActivity = $(cardActivityID);

    var cardAddressID = `#card-${i}-activity-address`;
    var cardAddress = $(cardAddressID);

    var cardPhoneNumberID = `#card-${i}-activity-phoneNumber`;
    var cardPhoneNumber = $(cardPhoneNumberID);

    var cardWebsiteID = `#card-${i}-activity-website`;
    var cardWebsite = $(cardWebsiteID);

    //Write blank card listing info
    cardActivity.text("Not Enough Activities");

    cardAddress.text("Address Unlisted");

    cardPhoneNumber.text("Unlisted Telephone #");
    cardPhoneNumber.removeAttr("href");

    cardWebsite.removeAttr("href");
    cardWebsite.text("Website Unavailable");

    cardWebsite.css("background-color", "");
    cardPhoneNumber.css("background-color", "");

    if (trueWayPlaces && i <= trueWayPlaces.length) {
      //Write trueWayPlaces info
      cardActivity.text(trueWayPlaces[i - 1].name);

      cardAddress.text(trueWayPlaces[i - 1].address);

      cardPhoneNumber.attr("href", "tel:" + trueWayPlaces[i - 1].phone_number);
      cardPhoneNumber.text(trueWayPlaces[i - 1].phone_number);

      cardWebsite.attr("href", trueWayPlaces[i - 1].website);
      cardWebsite.text("Website");

      //Reset css rules for card listings
      cardWebsite.css("cursor", "pointer");
      cardWebsite.css("background-color", "green");

      cardPhoneNumber.css("cursor", "pointer");
      cardPhoneNumber.css("background-color", "green");

      //Validate card listing info
      if (cardWebsite.attr("href") == undefined) {
        cardWebsite.text("Website Unavailable");
        cardWebsite.css("cursor", "not-allowed");
        cardWebsite.css("background-color", "red");
      }

      var phoneListed = cardPhoneNumber.attr("href");
      if (phoneListed === "tel:" + undefined) {
        cardPhoneNumber.text("Unlisted Telephone #");
        cardPhoneNumber.removeAttr("href");
        cardPhoneNumber.css("cursor", "not-allowed");
        cardPhoneNumber.css("background-color", "red");
      }
    }
  }

  resultsSection.fadeIn("slow", "linear");
  searchInput.val("");
}

function loadSavedCities() {
  searchedCities = [];
  searchedCitiesListEl.empty();

  var savedCitylist = localStorage.getItem("previousSearches");
  if (savedCitylist != null && savedCitylist != "") {
    searchedCities = JSON.parse(savedCitylist);
    searchedCities.forEach((element) => {
      var buttonliEl = $("<li></li>");
      var searchedCityBtn = $(
        '<a class="button searchedCity">' + element.cityName + "</a>"
      );
      searchedCityBtn.css("min-width", "-webkit-fill-available");
      buttonliEl.append(searchedCityBtn);
      buttonliEl.css("list-style", "none");
      buttonliEl.css("text-transform", "capitalize");
      searchedCitiesListEl.append(buttonliEl);
    });
    var searchedCityBtnEl = $(".searchedCity");
    searchedCityBtnEl.on("click", onSearchBtnClick);
  }
}

function onSearchBtnClick(event) {
  event.preventDefault();

  console.log(event);
  //Gets the city weather data and forwards that information to the handleSearchRequest function
  //var cityName = event.target
  getWeatherData(
    searchInput.val() != "" ? searchInput.val() : event.target.innerHTML
  );
}

// Load the saved city information from local storage and display to screen.
loadSavedCities();

// Get user coordinates
var userCoordinates = navigator.geolocation.getCurrentPosition(success, fail);

//Sets an event listener on the search button
btnsearchEl.on("click", onSearchBtnClick);

// Get the modal
var modal = document.getElementById("id01");

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
    searchInput.val("");
  }
};

function clearSavedCities() {
  clearCityList = [];
  var clearCityList = localStorage.removeItem("previousSearches");
  searchedCitiesListEl.empty();
}

clearCityBtnEl.on("click", clearSavedCities);
