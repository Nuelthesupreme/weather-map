$(document).ready(function () {
    //on clicking the button to search for a city we are taking the input value and assigning it to a variable
    const apikey = "75d05eb8415e6fdeec45f08da3e4566a";

    function searchCityFunction(searchedCity) {
        $.ajax({
            type: "GET",
            url: `http://api.openweathermap.org/data/2.5/weather?q=${searchedCity}&appid=${apikey}`,
            dataType: "json",
            success: function (data) {
                $('#city').text(data.name)
                $('#currentDay').text(moment().format('MMMM Do YYYY'))
                $('#temp').text(data.main.temp);
                $('#humid').text(data.main.humidity);
                $('#winspd').text(data.wind.speed);

                //dynamically display the information you are getting back in your html page.Remember that before you do this you want to clear down the area you are going to display this data so you dont have data for the previous city searched at the same time. This should all happen right here - inside the function which is called on 'success' 


                //the below call needs to remain at the very end of the success function
                //you will want to then take the longitude and latitude and pass it onto a function to get the UV - this is shown above. 
                console.log(data.coord.lat); // latitude
                console.log(data.coord.lon); //longitude
                searchCityUV(data.coord.lat, data.coord.lon);
            }
        })
    }

    function searchCityForecast(searchedCity) {
        $.ajax({
            type: "GET",
            url: `https://api.openweathermap.org/data/2.5/forecast?q=${searchedCity}&cnt=40&appid=${apikey}`,
            dataType: 'json',
            success: function (data) {
                const filteredData = data.list.filter(forcast => {
                    const fdt = new Date(forcast.dt_txt);
                    return (fdt.getHours() === 12)
                })

                const container = document.getElementById('fiveDaysForcast');
                container.innerHTML = '';

                filteredData.forEach(forcast => {
                    container.innerHTML += 
                     `<section class="card bg-light" style="width: 12rem;">
                        <section class="card-body">
                            <h5 class="card-title">${moment(forcast.dt_txt).format('MMMM Do YYYY')}</h5>
                            <p class="card-text">🌞</p>
                            <a href="#" class="card-link">Temp: ${forcast.main.temp} F</a>
                            <br />
                            <a href="#" class="card-link">Humid: ${forcast.main.humidity}%</a>
                        </section>
                      </section>`  
                });
            }
        })
        //ajax call to get the forecast like we got the citys current weather above
        //dynamically add it to the html etc just like above. 
    }

    
    function updateHistory(searchedCity = ''){
        const searchedCities = JSON.parse(localStorage.getItem('searchedCities') || '[]');    
        if (searchedCity) searchedCities.push(searchedCity)
        $('#history').html('');
        searchedCities.reverse().forEach(city => $('#history').append(`<li>${city}</li>`))
        localStorage.setItem('searchedCities', JSON.stringify(searchedCities.reverse()))
    }

    searchCityForecast('London');
    searchCityFunction('London');
    updateHistory();
    
    $("#searchButton").on("click", function () {
        let searchedCity = $("#searchCity").val();
        //we are clearing down the input box to an empty string
        $("#searchCity").val("");
        //executing our function which calls the weather api using the variable containing the searched for city
        searchCityFunction(searchedCity);
        searchCityForecast(searchedCity);

        // function where you add the searchedCity to local storage and then another where you gets all the cities currently stored in local storage and added them to the unordered list in the html 

        updateHistory(searchedCity)
    });

    

    function searchCityUV(latitude, longitude) {
        //api xall to get a cities latitude and longitude
        //dynamically add it to the html like above. 
    }
});

