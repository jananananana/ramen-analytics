# Ramen Analytics
- To run: `cd` into directory and run: 
  * `npm install` 
  * `node index.js`
- Four paths for the API are:
  * http://localhost:3000/all-ramen
  * http://localhost:3000/all-people
  * http://localhost:3000/streaks
  * http://localhost:3000/month-days

- First step was getting the API running. For this I used Express since the routing is set up.
- Then, I set up basic routes to make sure that they're working. 
- Next step was convering the CSV to JSON. For this I added fs and csvjson dependencies.
- I added delimiters and tested the output to ensure it matched the CSV.
- For output, I use `res.json()` which converts non-objects into JSON objects

### Notes

- For streaks, each array in streaks array is a seperate streak. It includes the days and the streak.
    * One day "streaks" are included as well.
    * Depending on the definition of a "streak" we could eliminate shorter streaks.

- For months, years weren't taken into account intentionally.
- If there is a tie for high ramen consumption, then the first date and high consumption is used.
    * I think this is what I might change or adjust. Perhaps, I could add logic to save additional
      dates in an array of dates on those that the same consumption of ramen happened.

### Unit Test Cases For Last Two Routes
- `http://localhost:3000/streaks`
    * Test consecutive days with same ramen consumption
        ** Expected behavior: different streak arrays
    * Test function by having no streaks in data
        ** Number of arrays should match the length of the data array
    * Test function with one long streak
        ** Expected behavior: one array should be returned
- `http://localhost:3000/month-days`
    * Test same months of different years
        ** Expected behavior: month with day with highest ramen consumption is saved
    * Test same months with same high ramen consumption
      ** Expected behavior: only the first instance of this high consumption is saved
    * Test month with zero consumption
      ** Expected behavior: Day of the month is set to 0.
    * Test dates in different time zones
      ** Expected behavior: UTC month is used, so even different time zones shouldn't make a difference


## Project Description

Implement a JSON REST-style API that processes and exposes data about
delicious cup ramen.

## Requirements

* Tools are up to you. Use whatever language/framework you’re most
  familiar with.

* Ingest the accompanying [ramen.csv](ramen.csv) file.

* Expose four REST-style `GET` routes returning the following data:

   * All people, the total number of ramen cups they’ve each consumed,
     and their favorite kind(s) of ramen.

   * All ramen cup consumptions.

   * All streaks of days when more and more ramen cups were eaten than
     the day before (you can ignore days with no consumption).
     e.g. People ate 2 cups on 03/02, 3 cups on 03/05 and 6 cups on
     03/06. That’s a streak.

   * For each month, which day of the month saw the most cups
     consumed.

* The actual schema of the returned JSON doesn’t really matter as long
  as it’s something you believe would be comfortably usable by a REST
  client.

* There are no requirements around persistence. Feel free to save this
  data in some in-memory data structure, in an in-memory database, in
  a real database, or just re-read the file for each request!

* Write a couple unit test cases for the logic in the last two
  routes. Don’t bother with integration tests unless you really feel
  like it.

* Please leave comments in places where you weren’t quite sure if you
  were solving the problem right or well to let us know that you
  thought about it and made a conscious decision.

* Please make sure that the application will actually run on someone
  else’s machine without complicated setup steps.

* We will be reviewing your solution commit-by-commit so that we can
  follow along with your thought process. Please make frequent
  cohesive commits so we can see what your work progression looks like
  vs. giant single blob.

