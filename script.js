'use strict';

const apiKey = 'AlHCwtTc801vWn0kX4cZwIaNgbLgYrwmJ0XZf2hk';
const searchURL = 'https://developer.nps.gov/api/v1/parks';

//watch form 
//prevent submit btn default 
//collect values for user input
function watchForm() {
  $('form').submit(event => {
  //display wait msg  
  $('#wait-msg').removeClass('hidden');
    event.preventDefault();
    const searchTerm = $('#js-search-term').val();
    const maxResults = $('#js-max-results').val();
    getNationalParks(searchTerm, maxResults);
  });
}

//format url 
function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function getNationalParks(searchTerm, maxResults=10) {
  const params = {
    api_key: apiKey,
    limit: maxResults,
    stateCode: searchTerm
  };
  
  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString;
  console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function displayResults(responseJson) {
  // if there are previous results, remove them
  console.log(responseJson);
  $('#results-list').empty();

  //"your <insert max #> parks found in <insert state>"
  $('#results-for-state').append(`Your ${$('#js-max-results').val()} Park(s) Found in ${$('#js-search-term').val()}`);

  // iterate through the items array
  for (let i = 0; i < responseJson.data.length; i++){
    
    // for each park object in the items array, add a list item to the results 
    //list with the full name, description, url
    $('#results-list').append(
      `<li class="each-park-result">
      <h3 class="park-name">${responseJson.data[i].fullName}</h3>
      <img src="${responseJson.data[i].images[0].url}" class="park-img">
      <p class="park-description">${responseJson.data[i].description}</p>
      <a class="park-url" href="${responseJson.data[i].url}" target=_blank>Website</a>
      </li>`
    )};

    //display the results section  
    $('#results').removeClass('hidden');
    //hide wait msg  
    $('#wait-msg').addClass('hidden');
    //clear input after results load, default max 10 
    $('#js-search-term').val('')
    $('#js-max-results').val(10);
};

$(watchForm);