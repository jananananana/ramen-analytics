const express = require('express')
const csvjson = require('csvjson')
const fs = require('file-system')
const app = express()


const data = fs.readFileSync('ramen.csv', { encoding : 'utf8'});

const options = {
  delimiter : ',',
  quote     : '"'
};

const jsonObj = csvjson.toObject(data, options);
const ramenDataLength = jsonObj.length;

const getMostCommonString = function(arrOfStrings) {
    if (arrOfStrings.length == 0)
        return null;

    var modeMap = {},
        maxEl = arrOfStrings[0],
        maxCount = 1;

    for (let i = 0; i < arrOfStrings.length; i++) {
        var el = arrOfStrings[i];
        // Start the counter
        if (modeMap[el] == null)
            modeMap[el] = 1;
        // Each time the value appears, add to counter
        else
            modeMap[el]++;
        if (modeMap[el] > maxCount)
            {
                maxEl = el;
                maxCount = modeMap[el];
            }
        // Keep track of possible ties
        // Here is where I think this could get a bit more complex if there's a triple tie for example
        else if (modeMap[el] == maxCount)
            {
                maxEl += ' & ' + el;
                maxCount = modeMap[el];
            }
    }
    return maxEl;
};

const getPeople = function() {

    let people = [];

    for (let i = 0; i < ramenDataLength; i++) {
        let isPersonInTheList = people.filter(person => (person.name === jsonObj[i].person)).length;
        // Check if the person is on the list
        if (!isPersonInTheList) {
            // Add all unique individuals to the list
            people.push({name: jsonObj[i].person, cupsOfRamen: 1, ramenType: [jsonObj[i]["ramen-type"]]});
        }
        else {
            // Create callback to find the correct person by name
            function callbackFxToGetPersonByNameObj(person) {
                return person.name === jsonObj[i].person;
            }
            let name = people.find(callbackFxToGetPersonByNameObj);
            // Add an extra cup of ramen to the existing individual
            name.cupsOfRamen++;
            // Add each ramen type consumed into array
            name.ramenType.push(jsonObj[i]["ramen-type"]);
        }

    }
    people.forEach(function(person){
        // Pass in the array of the types of ramen consumed by each person
        person.favoriteRamen = getMostCommonString(person.ramenType);
    });
    return people;
};

const getStreaks = function() {
    // Sort the jsonObj by the dates to make it easier to manipulate
    // I think I'm going to need it sorted for some of the other functions, so I'm sorting it here to start
    // This also solves the issue of dealing with date formats and sorting those
    function custom_sort(a, b) {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
    jsonObj.sort(custom_sort);

    // Create an array of just the dates that ramen was consumed
    // Keeping it simple here
    let datesRamenWasConsumed = [];
    let streaks = [];
    for (let i = 0; i < ramenDataLength; i++) {
        // First, get rid of the time since we're only dealing with days
        let d = jsonObj[i].date;
        d = d.split('T')[0];
        jsonObj[i].shortDate = d;

        let isDateOnTheList = datesRamenWasConsumed.filter(day => (day.shortDate === jsonObj[i].shortDate)).length;

        // Check if the person is on the list
        if (!isDateOnTheList) {
            // Add all unique dates to the list
            datesRamenWasConsumed.push({shortDate: jsonObj[i].shortDate, cupsOfRamen: 1});
        }
        else {
            function callbackFxToGetDate(day) {
                return day.shortDate === jsonObj[i].shortDate;
            }
            let day = datesRamenWasConsumed.find(callbackFxToGetDate);
            day.cupsOfRamen++
        }
        // if the date before has a higher number of cups of ramen, create a new current streak
        let previousDateHasMoreRamen = (i === 0) || (jsonObj[i].cupsOfRamen < jsonObj[i-1].cupsOfRamen);
        if (previousDateHasMoreRamen) {
            console.log("Hey jana")
        }
        // if the date before has a smaller number of cups of ramen, add to current streak
        // for the simplicity, even 1 day can be a streak, but this can be adjusted based on the definition of streaks
    }
    console.log(datesRamenWasConsumed);
}();

//console.log(jsonObj);


// Requests
app.get('/', (req, res) => res.send('Hello World!'))
app.get('/all-people', (req, res) => res.json(getPeople()))
app.get('/all-ramen', (req, res) => res.json({totalRamenConsumed : ramenDataLength}))
app.get('/month-days', (req, res) => res.send('Month Days'))

app.listen(3000, () => console.log('Example app listening on port 3000!'))
