function handleSearchRequest(activities) {
  const [lat, lon] = [33.3807, -84.7997]; // Replace with your actual lat/lon source (e.g., from cityWeatherData)
  const radius = 10000; // 10km radius
  const language = "en";
  const apiKey = "YOUR_API_KEY_HERE"; // Replace with your RapidAPI key
  const apiHost = "trueway-places.p.rapidapi.com";

  // Filter out invalid types and map to API requests
  const validActivities = activities.filter(
    (activity) => activity !== "no_activities_suggested"
  );
  if (validActivities.length === 0) {
    console.log("No valid activities to search for.");
    return Promise.resolve([]); // Return empty result if no valid activities
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
        return response.json().then((data) => ({ activity, data })); // Pair activity with its results
      })
      .catch((err) => {
        console.error(`Error fetching ${activity}:`, err);
        return { activity, data: null }; // Return null data for failed requests
      });
  });

  // Execute all requests and return combined results
  return Promise.all(requests)
    .then((results) => {
      console.log("Places for each activity:", results);
      return results; // Array of { activity, data } objects
    })
    .catch((err) => {
      console.error("Error in handleSearchRequest:", err);
      return []; // Return empty array on total failure
    });
}

// export default async function handleSearchRequest(city) {
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
// }
