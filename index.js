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

// Create an array of just the dates that ramen was consumed
// Keeping it simple here
let datesRamenWasConsumed = [];

const getDatesWhenRamenWasConsumed = function() {
    for (let i = 0; i < ramenDataLength; i++) {
        // First, get rid of the time since we're only dealing with days
        let d = jsonObj[i].date;
        d = d.split('T')[0];
        jsonObj[i].shortDate = d;

        // Here we parse out the month as well
        // This gave me trouble as I ran into some timezone issues with the first month
        let ramenDate = new Date(jsonObj[i].date);

        let isDateOnTheList = datesRamenWasConsumed.filter(day => (day.shortDate === jsonObj[i].shortDate)).length;

        // Check if the person is on the list
        if (!isDateOnTheList) {
            // Add all unique dates to the list
            // Using getUTCMonth for consistency
            datesRamenWasConsumed.push({shortDate: jsonObj[i].shortDate, cupsOfRamen: 1, month: ramenDate.getUTCMonth()});
        }
        else {
            // Otherwise increase the amount of ramen that was eaten on that day
            function callbackFxToGetDate(day) {
                return day.shortDate === jsonObj[i].shortDate;
            }
            let day = datesRamenWasConsumed.find(callbackFxToGetDate);
            day.cupsOfRamen++
        }
    }
}();

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
    // This also solves the issue of dealing with date formats and sorting those

    function custom_sort(a, b) {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
    jsonObj.sort(custom_sort);

    let streaks = [];
    let streakIterator = -1;

    for (let i = 0; i < datesRamenWasConsumed.length; i++) {
        // if the date before has a higher number of cups of ramen, create a new current streak
        let previousDateHasMoreRamen = (i === 0) || (datesRamenWasConsumed[i].cupsOfRamen <= datesRamenWasConsumed[i-1].cupsOfRamen);
        if (previousDateHasMoreRamen) {
            // move the iterator to a new streak
            streakIterator++
            // add the date to the new streak array in streaks
            streaks.push([datesRamenWasConsumed[i]]);
        } else {
            streaks[streakIterator].push(datesRamenWasConsumed[i]);
        }
    }
    return streaks;
};
 const getMostRamenOnDayInMonth = function() {
    let monthRamenConsumption = [];
    const months = [
        'January', 'February', 'March', 'April', 'May',
        'June', 'July', 'August', 'September',
        'October', 'November', 'December'
    ];

    for (let i = 0; i < 12; i++) {
        monthRamenConsumption.push({month: i, amountOfRamenConsumedThatDay: 0, dateMostRamenWasConsumed: 0, monthName: months[i]});
    }
    for (let i = 0; i < datesRamenWasConsumed.length; i++) {
        function callbackFxToGetMonth(month) {
            return month.month === datesRamenWasConsumed[i].month;
        }
        let monthForEachRamenDay = monthRamenConsumption.find(callbackFxToGetMonth);
        if (monthForEachRamenDay.amountOfRamenConsumedThatDay < datesRamenWasConsumed[i].cupsOfRamen) {
            monthForEachRamenDay.amountOfRamenConsumedThatDay = datesRamenWasConsumed[i].cupsOfRamen;
            monthForEachRamenDay.dateMostRamenWasConsumed = datesRamenWasConsumed[i].shortDate;
        }
    }
    return monthRamenConsumption;
 };

// Requests
app.get('/', (req, res) => res.send('Hello World!'))
app.get('/all-people', (req, res) => res.json(getPeople()))
app.get('/all-ramen', (req, res) => res.json({totalRamenConsumed : ramenDataLength}))
app.get('/streaks', (req, res) => res.json(getStreaks()))
app.get('/month-days', (req, res) => res.json(getMostRamenOnDayInMonth()))

app.listen(3000, () => console.log('Example app listening on port 3000!'))
