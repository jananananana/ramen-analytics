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

const getPeople = function() {

    let people = [];

    var arrayLength = jsonObj.length;
    for (let i = 0; i < arrayLength; i++) {
        let isPersonInTheList = people.filter(person => (person.name === jsonObj[i].person)).length;
        // Check if the person is on the list
        if (!isPersonInTheList) {
            // Add all unique individuals to the list
            people.push({name: jsonObj[i].person, cupsOfRamen: 1, ramenType: jsonObj[i]["ramen-type"]});
        }
        else {
            // Create callback to find the correct person by name
            function callbackFxToGetPersonByNameObj(person) {
                return person.name === jsonObj[i].person;
            }
            let name = people.find(callbackFxToGetPersonByNameObj);
            // Add an extra cup of ramen to the existing individual
            name.cupsOfRamen++
            //console.log(name);
        }

    }
    console.log(people);
}();


//console.log(jsonObj);


// Requests
app.get('/', (req, res) => res.send('Hello World!'))
app.get('/all-people', (req, res) => res.send(people))
app.get('/all-ramen', (req, res) => res.send('Ramen'))
app.get('/month-days', (req, res) => res.send('Month Days'))

app.listen(3000, () => console.log('Example app listening on port 3000!'))
