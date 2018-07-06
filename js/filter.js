'use strict';

(function () {

  window.filter = {};

  var PRICE_RANGES = {
    LOW: {
      MIN: 0,
      MAX: 10000
    },

    MIDDLE: {
      MIN: 10000,
      MAX: 50000
    },

    HIGHT: {
      MIN: 50000,
      MAX: Infinity
    }
  };

  var filterType = document.querySelector('#housing-type');
  var filterPrice = document.querySelector('#housing-price');
  var filterRooms = document.querySelector('#housing-rooms');
  var filterGuests = document.querySelector('#housing-guests');
  var filterFeatures = document.querySelectorAll('.map__checkbox');
  var similarListElement = document.querySelector('.map__pins');


  var filterTypeChange = function (advert) {
    if (filterType[filterType.selectedIndex].value === 'any') {
      return true;
    }
    return advert.offer.type === filterType[filterType.selectedIndex].value;
  };

  var filterPriceChange = function (advert) {
    switch (filterPrice[filterPrice.selectedIndex].value) {
      case 'low':
        return advert.offer.price <= PRICE_RANGES.LOW.MAX;
      case 'middle':
        return advert.offer.price >= PRICE_RANGES.MIDDLE.MIN && advert.offer.price <= PRICE_RANGES.MIDDLE.MAX;
      case 'high':
        return advert.offer.price >= PRICE_RANGES.HIGHT.MIN;
      default:
        return true;
    }
  };

  var filterRoomsChange = function (advert) {
    if (filterRooms[filterRooms.selectedIndex].value === 'any') {
      return true;
    }
    return advert.offer.rooms === parseInt(filterRooms[filterRooms.selectedIndex].value, 10);
  };

  var filterGuestChange = function (advert) {
    if (filterGuests[filterGuests.selectedIndex].value === 'any') {
      return true;
    }
    return advert.offer.guests === parseInt(filterGuests[filterGuests.selectedIndex].value, 10);
  };

  var filterFeaturesChange = function (advert) {
    for (var i = 0; i < filterFeatures.length; i++) {
      if (filterFeatures[i].checked && advert.offer.features.indexOf(filterFeatures[i].value) < 0) {
        return false;
      }
    }
    return true;
  };

  window.filter.updateAdvert = function () {
    var filteredAdverts = window.map.ads.filter(filterTypeChange)
                                              .filter(filterPriceChange)
                                              .filter(filterRoomsChange)
                                              .filter(filterGuestChange)
                                              .filter(filterFeaturesChange);

    window.map.erasePromoCard(); // Удаляет карточку объявления
    window.form.removeMapPins(); // Удаляет пин-элемент
    similarListElement.appendChild(window.pin.createPinsFragment(filteredAdverts)); // Добавляет пин-элемент
    window.map.pinClickHandler(filteredAdverts); // Добавляет карточку объявления по клику на пин-элемент
  };

})();
