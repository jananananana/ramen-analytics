(function() {
  'use strict';

  angular
    .module('app')
    .component('successProb', {
        templateUrl: './assets/javascripts/success/successProb.html',
        controller: ['Ramen', RamenDataController],
        controllerAs:'view'
    });
    function RamenDataController (Ramen) {
        // manipulate ramen here
        console.log("hey jana")
    }
})();
