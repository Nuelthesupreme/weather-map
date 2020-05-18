$(document).ready(function () {
    const apikey = "75d05eb8415e6fdeec45f08da3e4566a";

    function searchCityFunction(searchedCity) {
        $.ajax({
            type: "GET",
            url: `http://api.openweathermap.org/data/2.5/weather?q=${searchedCity}&appid=${apikey}`,
            dataType: "json",
            success: function (data) {
                console.log(data.main.temp);
                if(data.main.temp < 59) {
                    // changes color to yellow or blue depending on temp. 
                    document.getElementById('city').style.backgroundColor = "aqua"
                    document.getElementById('city').style.fontSize = "160"

                } else {
                    document.getElementById('city').style.backgroundColor = "yellow"
                    document.getElementById('city').style.fontSize = "160"

                }
                $('#city').text(data.name)
                $('#currentDay').text(moment().format('MMMM Do YYYY'))
                $('#temp').text(data.main.temp);
                $('#humid').text(data.main.humidity);
                $('#winspd').text(data.wind.speed);
 
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
                    (forcast.weather[0].icon)
                    container.innerHTML += 
                     `<section class="card bg-light" style="width: 12rem;">
                        <section class="card-body">
                            <h5 class="card-title">${moment(forcast.dt_txt).format('MMMM Do YYYY')}</h5>
                            <img src="http://openweathermap.org/img/w/${forcast.weather[0].icon}.png"  alt="current weather icon">
                            <hr />
                            <a href="#" class="card-link">Temp: ${forcast.main.temp} F</a>
                            <br />
                            <a href="#" class="card-link">Humid: ${forcast.main.humidity}%</a>
                        </section>
                      </section>`  
                });
            }
        }) 
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
        $("#searchCity").val("");
        searchCityFunction(searchedCity);
        searchCityForecast(searchedCity);

        updateHistory(searchedCity)
    });

    $("#history").on("click", "li", function() {
        searchCityFunction($(this).text());
      });
    

    

    function searchCityUV(latitude, longitude) {
        $.ajax({
            type: "GET",
            url: `http://api.openweathermap.org/data/2.5/uvi?appid=${apikey}&lat=${latitude}&lon=${longitude}`,
            dataType: "json",
            success: function (data){
                $('#ultraV').text(data.value);
            }
        })
    }
});

