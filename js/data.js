'use strict';

(function () {

  window.data = {};
  /*
  var TITLES = ['Большая уютная квартира',
    'Маленькая неуютная квартира',
    'Огромный прекрасный дворец',
    'Маленький ужасный дворец',
    'Красивый гостевой домик',
    'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря',
    'Неуютное бунгало по колено в воде'];
  var TYPES = ['palace', 'flat', 'house', 'bungalo'];
  var CHECKIN = ['12:00', '13:00', '14:00'];
  var CHECKOUT = ['12:00', '13:00', '14:00'];
  window.data.feauters = function () {
    return ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  };
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
  var avatarNumber = 1;

  // Функция получения случайного элемента
  var getRandomElement = function (arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  };

  // Функция для получения номера аватарки пользователя
  var getNumberImg = function () {
    return avatarNumber++;
  };

  // Функция для получения значения между максимальным и минимальным
  var getRandomInRange = function (min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  };


  var getShuffledFeauters = function (arr) {
    var newArray = arr.slice(0);

    for (var i = 0; i < newArray.length - 1; i++) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }

    return newArray;
  };

  var getFeauters = function (arr) {
    var randomNumberFeauters = Math.floor(Math.random() * (arr.length - 1));
    var shuffledArray = getShuffledFeauters(arr);
    var feauters = '';

    for (var i = 0; i <= randomNumberFeauters; i++) {
      feauters += shuffledArray[i] + ', ';
    }

    return feauters;
  };

  // Функция создающая объявления
  var createPosterData = function () {
    var locationX = getRandomInRange(LOCATION_X_MIN, LOCATION_X_MAX);
    var locationY = getRandomInRange(LOCATION_Y_MIN, LOCATION_Y_MAX);

    return {
      author: {
        avatar: 'img/avatars/user0' + getNumberImg() + '.png'
      },

      offer: {
        title: getRandomElement(TITLES),
        address: locationX + ', ' + locationY,
        price: getRandomInRange(PRICE_MIN, PRICE_MAX),
        type: getRandomElement(TYPES),
        rooms: getRandomInRange(ROOMS_MIN, ROOMS_MAX),
        guests: getRandomInRange(GUESTS_MIN, GUESTS_MAX),
        checkin: getRandomElement(CHECKIN),
        checkout: getRandomElement(CHECKOUT),
        features: getFeauters(window.data.feauters()),
        description: '',
        photos: PHOTOS
      },

      location: {
        x: locationX,
        y: locationY
      }
    };
  };

  // Функция создания массива похожих объявлений
  window.data.createPostersAds = function () {
    var randomAds = [];

    for (var i = 0; i < NUMBER_OF_ADS; i++) {
      randomAds.push(createPosterData());
    }

    return randomAds;
  };
*/

  window.data.onSuccess = function (cardsArray) {
    var fragment = document.createDocumentFragment();
    // window.library.getShuffleArray(cardsArray);

    for (var i = 0; i < cardsArray.length; i++) {
      fragment.appendChild(window.card.generateInfoPromo(cardsArray[i]));
    }
    // map.appendChild(fragment);
  };

  window.data.onError = function (errorMessage) {
    var node = document.createElement('div');
    node.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: rgba(255, 50, 0, 0.7); top: 200px; left: 50%; transform: translateX(-50%); box-shadow: 0 0 50px rgba(0, 0, 0, 0.4); border: 1px solid rgba(255, 50, 0, 0.7); border-radius: 20px';
    node.style.position = 'fixed';
    node.style.padding = '50px 30px';
    node.style.fontfamily = 'Arial';
    node.style.fontSize = '24px';
    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);
  };

})();
