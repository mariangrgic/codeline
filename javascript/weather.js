
// Weather Javascript Object - Marian Grgiæ <marian.grgic@gmail.com>

function round(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

weather = {

    containerId: "section#weather",
    iconUrl: 'https://www.metaweather.com/static/img/weather/png/64/',
    locations: {
        0: {name: 'DUBLIN', id: '560743'},
        1: {name: 'LONDON', id: '44418'},
        2: {name: 'BERLIN', id: '638242'},
        3: {name: 'HELSINKI', id: '565346'},
        4: {name: 'VANCUVER', id: '9807'},
        5: {name: 'ISTANBUL', id: '2344116'},
    },
    searchInput: 'form#searchForm input[name="term"]',

    showDefault: function(){

        var $this = this;
        var $container = $(this.containerId);
        var $searchInput = $(this.searchInput);

        $container.html('');
        $searchInput.val('');

        $.each($this.locations, function(i, v){
            $this.loadWeather(v.id, 'home');
        });
    },

    loadWeather: function(code, type){

        var $this = this;

        $.ajax({
            type: 'GET',
            url: 'weather.php',
            data: 'command=location&woeid=' + code,
            success:function(r){

                $this.displayWeather(r, type);
            }
        });
    },

    search: function(){

        var $this = this;
        var $container = $(this.containerId);
        var term = $(this.searchInput).val();

        if(typeof term === 'undefined' || term === '' || term === null){
            alert('please Enter valid Term');
            return;
        }

        var termUpper = term.toUpperCase();
        var found = false;

        $.each($this.locations, function(i, v){
            if(v.name == termUpper){
                $this.loadWeather(v.id, 'details');
                found = true;
                return;
            }
        });

        if(!found)
            $container.html('There are no results for search term: "' + term + '"');
    },

    displayWeather: function(data, type){

        var $this = this;
        var $container = $(this.containerId);

        switch(type){

            case 'home':

                var title = data.title;
                var icon = $this.iconUrl + data.consolidated_weather[0].weather_state_abbr + '.png';
                var temperature = round(data.consolidated_weather[0].the_temp, 2);
                var min_temperature = round(data.consolidated_weather[0].min_temp, 2);
                var max_temperature = round(data.consolidated_weather[0].max_temp, 2);
                var code = data.woeid;

                var html = '<div onClick="weather.loadWeather(\'' + code + '\', \'details\');">' +
                    '<h1>' + title + ' Today</h1>' +
                    '<img src="' + icon + '" alt=""/>' +
                    '<ul>' +
                    '<li><label>Temperature: </label>' + temperature + ' &deg;</li>' +
                    '<li><label>Minimum Temperature: </label>' + min_temperature + ' &deg;</li>' +
                    '<li><label>Maximum Temperature: </label>' + max_temperature + ' &deg;</li>' +
                    '</ul>' +
                    '</div>';

                $container.append(html);

                break;

            case 'details':

                var title = data.title;


                var html = '<h1>Weather Details for: ' + title + '</h1>';

                $.each(data.consolidated_weather, function(i, v){

                    var date = data.consolidated_weather[i].applicable_date;
                    var icon = $this.iconUrl + data.consolidated_weather[i].weather_state_abbr + '.png';
                    var weather_state = data.consolidated_weather[i].weather_state;
                    var temperature = round(data.consolidated_weather[i].the_temp, 2);
                    var min_temperature = round(data.consolidated_weather[i].min_temp, 2);
                    var max_temperature = round(data.consolidated_weather[i].max_temp, 2);
                    var wind_direction = data.consolidated_weather[i].wind_direction_compass;
                    var wind_speed = data.consolidated_weather[i].wind_speed;
                    var humidity = round(data.consolidated_weather[i].humidity, 2);
                    var visibility = round(data.consolidated_weather[i].visibility, 2);

                    html += '<div>' +
                        '<h2>Date: ' + date + '</h2>' +
                        '<img src="' + icon + '" alt=""/>' +
                        '<ul>' +
                        '<li><label>Weather State: </label>' + weather_state + '</li>' +
                        '<li><label>Temperature: </label>' + temperature + ' &deg;</li>' +
                        '<li><label>Minimum Temperature: </label>' + min_temperature + ' &deg;</li>' +
                        '<li><label>Maximum Temperature: </label>' + max_temperature + ' &deg;</li>' +
                        '<li><label>Wind Direction: </label>' + wind_direction + '</li>' +
                        '<li><label>Wind Speed: </label>' + wind_speed + ' mph</li>' +
                        '<li><label>Humidity: </label>' + humidity + ' &percnt;</li>' +
                        '<li><label>Visibility: </label>' + visibility + ' miles</li>' +
                        '</ul>' +
                        '</div>';
                });

                $container.html(html);

                break;
        }
    }
}

$(document).ready(function(){

    weather.showDefault();

});
