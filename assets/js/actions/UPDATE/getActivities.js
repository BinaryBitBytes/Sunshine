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
