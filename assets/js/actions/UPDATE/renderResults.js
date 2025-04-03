// TODO : Show section of activities
export default async function renderResults() {
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
