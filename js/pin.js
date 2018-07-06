'use strict';

(function () {

  window.pin = {};

  var template = document.querySelector('template');
  var pinTemplate = template.content.querySelector('.map__pin');
  var MAX_ADD_PINS = 5;

  // Функция создания элемента маркера на карте
  var createPinElement = function (pinData) {
    var pinElement = pinTemplate.cloneNode(true);

    pinElement.style.left = pinData.location.x + 'px';
    pinElement.style.top = pinData.location.y + 'px';
    pinElement.querySelector('img').src = pinData.author.avatar;
    pinElement.querySelector('img').alt = pinData.offer.title;

    return pinElement;
  };

  // Функция создания фрагмента с маркерами на карте
  window.pin.createPinsFragment = function (pinFragments) {
    var fragment = document.createDocumentFragment();
    var takeNumber = pinFragments.length > MAX_ADD_PINS ? MAX_ADD_PINS : pinFragments.length;

    for (var i = 0; i < takeNumber; i++) {
      fragment.appendChild(createPinElement(pinFragments[i]));
    }

    return fragment;
  };

})();
