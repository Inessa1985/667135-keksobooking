'use strict';

(function () {

  window.pin = {};

  var template = document.querySelector('template');
  var pinTemplate = template.content.querySelector('.map__pin');

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
  window.pin.createPinsFragment = function (arr) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < arr.length; i++) {
      fragment.appendChild(createPinElement(arr[i]));
    }

    return fragment;
  };

})();
