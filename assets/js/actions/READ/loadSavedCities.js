export default async function loadSavedCities() {
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
