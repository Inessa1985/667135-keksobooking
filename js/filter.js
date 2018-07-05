'use strict';

(function () {

  window.filter = {};

  var PRICE_RANGES = {
    low: {
      min: 0,
      max: 10000
    },

    middle: {
      min: 10000,
      max: 50000
    },

    hight: {
      min: 50000,
      max: Infinity
    }
  };

  var filterType = document.querySelector('#housing-type');
  var filterPrice = document.querySelector('#housing-price');
  var filterRooms = document.querySelector('#housing-rooms');
  var filterGuests = document.querySelector('#housing-guests');
  var filterFeatures = document.querySelectorAll('.map__checkbox');
  var similarListElement = document.querySelector('.map__pins');
  var adverts = [];

  var onHousingTypeChange = function (advert) {
    if (filterType[filterType.selectedIndex].value === 'any') {
      return true;
    }
    return advert.offer.type === filterType[filterType.selectedIndex].value;
  };

  var onHousingPriceChange = function (advert) {
    switch (filterPrice[filterPrice.selectedIndex].value) {
      case 'low':
        return advert.offer.price <= PRICE_RANGES.low.max;
      case 'middle':
        return advert.offer.price >= PRICE_RANGES.middle.min && advert.offer.price <= PRICE_RANGES.middle.max;
      case 'high':
        return advert.offer.price >= PRICE_RANGES.hight.min;
      default:
        return true;
    }
  };

  var onHousingRoomsChange = function (advert) {
    if (filterRooms[filterRooms.selectedIndex].value === 'any') {
      return true;
    }
    return advert.offer.rooms === parseInt(filterRooms[filterRooms.selectedIndex].value, 10);
  };

  var onHousingGuestChange = function (advert) {
    if (filterGuests[filterGuests.selectedIndex].value === 'any') {
      return true;
    }
    return advert.offer.guests === parseInt(filterGuests[filterGuests.selectedIndex].value, 10);
  };

  var onHousingFeaturesChange = function (advert) {
    for (var i = 0; i < filterFeatures.length; i++) {
      if (filterFeatures[i].checked && advert.offer.features.indexOf(filterFeatures[i].value) < 0) {
        return false;
      }
    }
    return true;
  };

  window.filter.updateAdvert = function () {
    adverts = window.map.posterArr.slice();
    var filteredAdverts = adverts.filter(onHousingTypeChange)
                                 .filter(onHousingPriceChange)
                                 .filter(onHousingRoomsChange)
                                 .filter(onHousingGuestChange)
                                 .filter(onHousingFeaturesChange);

    window.map.erasePromoCard(); // Удаляет карточку объявления
    window.form.removeMapPins(); // Удаляет пин-элемент
    similarListElement.appendChild(window.pin.createPinsFragment(filteredAdverts)); // Добавляет пин-элемент
    window.map.pinClickHandler(filteredAdverts); // Добавляет карточку объявления по клику на пин-элемент
  };

})();
