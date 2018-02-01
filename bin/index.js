#! /usr/bin/env node

const https = require('https');
const querystring = require('querystring');

const arguments = process.argv.splice(2, process.argv.length -1).join(' ');
const search = querystring.stringify({ address: arguments });

https
    .get('https://maps.googleapis.com/maps/api/geocode/json?' + search, function(res){
    var data = '';

    res.on('data', function(newData){
        data += newData;

    });
    res.on('end', function(){
        var location = JSON.parse(data).results[0].geometry.location;
        var options = querystring.stringify({ units: 'si', lang: 'pt' });

        https.get('https://api.darksky.net/forecast/[api key]/' + location.lat + ',' + location.lng + '?' + options, function(resForecast){
            var data = '';
            resForecast.on('data', function(newData){
                data += newData;
            });

            resForecast.on('end', function(){
                var json = JSON.parse(data);
                    console.log('Temperatura Atual ' + json.currently.temperature + ' °C');
                console.log('Sensação termica ' + json.currently.apparentTemperature + ' °C');

                console.log(json.daily.summary)
            });
        });
    });

});
