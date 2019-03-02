(function (win) {
  'use strict';

  var validation = (function () {
    return {
      isValidURL: function isValidURL(url) {
        var pattern = /(?:http|https):\/\/(?:\w+:{0,1}\w*)?(?:\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/g;
        return pattern.test(url);
      },
      isValidYear: function isValidYear(year) {
        return /^\d{4}$/.test(year);
      },
      isValidPlate: function isValidPlate(plate) {
        return /^[a-z]{3}\d{4}$|^[a-z]{3}-\d{4}$/i.test(plate);
      }
    };
  })();

  win.Validation = validation;
})(window);
