export default async function clearSavedCities() {
  clearCityList = [];
  var clearCityList = localStorage.removeItem("previousSearches");
  searchedCitiesListEl.empty();
}
