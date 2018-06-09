'use strict';

// 1-ЫЙ ПУНКТ ЗАДАНИЯ: "Создайте массив, состоящий из 8 сгенерированных JS объектов,
// которые будут описывать похожие объявления неподалёку"
var AMOUNT_ADDRESS_IMG = 8;
var TITLE = ['Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'];
var TYPE = ['palace', 'flat', 'house', 'bungalo'];
var CHECKIN = ['12:00', '13:00', '14:00'];
var CHECKOUT = CHECKIN;
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var DESCRIPTION = null;
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var PRICE_MIN = 1000;
var PRICE_MAX = 1000000;
var ROOMS_MIN = 1;
var ROOMS_MAX = 5;
var GUESTS_MIN = 1;
var GUESTS_MAX = 6;
var LOCATION_X_MIN = 300;
var LOCATION_X_MAX = 900;
var LOCATION_Y_MIN = 130;
var LOCATION_Y_MAX = 630;
var NUMBER_OF_ADS = 8;


var getRandomNumberAddressImg = function (amount) {
  var randomAmount = Math.floor(Math.random() * amount + 1);
  return randomAmount;
};

var getRandomElement = function (arr) {
  return arr[Math.floor(Math.random() * (arr.length - 1))];
};

var getRandomInRange = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Функция создающая объявления
var createPosterData = function () {
  var listFeature = {
    author: {
      avatar: 'img/avatars/user0' + getRandomNumberAddressImg(AMOUNT_ADDRESS_IMG) + '.png'
    },

    offer: {
      title: getRandomElement(TITLE),
      address: 'location.x, location.y',
      price: getRandomInRange(PRICE_MIN, PRICE_MAX),
      type: getRandomElement(TYPE),
      rooms: getRandomInRange(ROOMS_MIN, ROOMS_MAX),
      guests: getRandomInRange(GUESTS_MIN, GUESTS_MAX),
      checkin: getRandomElement(CHECKIN),
      checkout: getRandomElement(CHECKOUT),
      features: getRandomElement(FEATURES),
      description: DESCRIPTION,
      photos: PHOTOS
    },

    location: {
      x: getRandomInRange(LOCATION_X_MIN, LOCATION_X_MAX),
      y: getRandomInRange(LOCATION_Y_MIN, LOCATION_Y_MAX)
    }
  };

  return listFeature;
};

// Функция создания массива похожих объявлений
var createPostersAds = function () {
  var randomAds = [];

  for (var i = 0; i < NUMBER_OF_ADS; i++) {
    randomAds.push(createPosterData(i));
  }

  return randomAds;
};

createPostersAds();

// 2-ОЙ ПУНКТ ЗАДАНИЯ: "У блока .map уберите класс .map--faded"
var map = document.querySelector('.map');
map.classList.remove('map--faded');

// 3-ИЙ ПУНКТ ЗАДАНИЯ: "На основе данных, созданных в первом пункте, создайте DOM-элементы,
// соответствующие меткам на карте, и заполните их данными из массива.
// Итоговую разметку метки .map__pin можно взять из шаблона .map__card"
var template = document.querySelector('template');
var pinTemplate = template.content.querySelector('.map__pin');
var cardTemplate = template.content.querySelector('.map__card');

var PIN_WIDTH = 65;
var PIN_HEIGHT = 65;

// Функция создания элемента маркера на карте
var createPinElement = function (pinNumber) {
  var pinElement = pinTemplate.cloneNode(true);

  pinElement.style.left = (pinNumber.location.x - PIN_WIDTH * 0.5) + 'px';
  pinElement.style.top = (pinNumber.location.y - PIN_HEIGHT) + 'px';
  pinElement.querySelector('img').src = pinNumber.author.avatar;
  pinElement.querySelector('img').alt = pinNumber.offer.title;

  return pinElement;
};

// 4-ЫЙ ПУНКТ ЗАДАНИЯ: "Отрисуйте сгенерированные DOM-элементы в блок .map__pins.
// Для вставки элементов используйте DocumentFragment"
var similarListElement = document.querySelector('.map__pins');

// Функция создания фрагмента с маркерами на карте
var createPinsFragment = function (postsCount) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < postsCount; i++) {
    fragment.appendChild(createPinElement(createPosterData()));
  }

  return fragment;
};

var postsCount = NUMBER_OF_ADS;

similarListElement.appendChild(createPinsFragment(postsCount));

// 5-ЫЙ ПУНКТ ЗАДАНИЯ: "На основе первого по порядку элемента из сгенерированного
// массива и шаблона .map__card создайте DOM-элемент объявления, заполните его данными из
// объекта и вставьте полученный DOM-элемент в блок .map перед блоком .map__filters-container:"
// 5.1 Выведите заголовок объявления offer.title в заголовок .popup__title
