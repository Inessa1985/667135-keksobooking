'use strict';

(function () {

  window.pin = {};

  var PIN_WIDTH = 50; // Ширина элемента сгенерированного маркера на карте
  var PIN_HEIGHT = 70;// Высота элемента сгенерированного маркера на карте

  var template = document.querySelector('template');
  var pinTemplate = template.content.querySelector('.map__pin');

  // Функция создания элемента маркера на карте
  var createPinElement = function (pinData) {
    var pinElement = pinTemplate.cloneNode(true);

    pinElement.style.left = (pinData.location.x - PIN_WIDTH * 0.5) + 'px';
    pinElement.style.top = (pinData.location.y - PIN_HEIGHT) + 'px';
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
