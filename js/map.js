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
var TYPE_RUS = ['Дворец', 'Квартира', 'Дом', 'Бунгало'];
var CHECKIN = ['12:00', '13:00', '14:00'];
var CHECKOUT = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var DESCRIPTION = ' ';
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

var getRandomElement = function (arr) {
  return arr[Math.floor(Math.random() * (arr.length - 1))];
};

var getNumberAddressImg = function () {
  var amounts = [];

  for (var i = 1; i <= AMOUNT_ADDRESS_IMG; i++) {
    amounts.push(i);
  }
  return amounts[i];
};

var getRandomInRange = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

// Функция создающая объявления
var createPosterData = function () {
  var listFeature = {
    author: {
      avatar: 'img/avatars/user0' + getNumberAddressImg(AMOUNT_ADDRESS_IMG) + '.png'
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

similarListElement.appendChild(createPinsFragment(NUMBER_OF_ADS));

// 5-ЫЙ ПУНКТ ЗАДАНИЯ: "На основе первого по порядку элемента из сгенерированного
// массива и шаблона .map__card создайте DOM-элемент объявления, заполните его данными из
// объекта и вставьте полученный DOM-элемент в блок .map перед блоком .map__filters-container:"

// Функция для перевода типа жилья на русский язык
var getRusTypeOfHouse = function (adNumber) {
  var type = adNumber.offer.type;

  for (var i = 0; i <= (TYPE.length - 1); i++) {
    TYPE[i].replaceContents(TYPE_RUS[i]);
  }

  return type;
};

// Функция получения описания цены в объявлении
var getPriceHouse = function (adNumber) {
  var price = adNumber.offer.price + '₽/ночь';

  return price;
};

// Функция получения описания вместимости жилья
var getGuestsOfHouse = function (adNumber) {
  var rooms = adNumber.offer.rooms;
  var guests = adNumber.offer.guests;

  return rooms + ' комнаты для ' + guests + ' гостей';
};

// Функция получения описания часов заезда и выезда
var getCheckinCheckoutTimes = function (adNumber) {
  var checkin = 'Заезд после ' + adNumber.offer.checkin;
  var checkout = ', выезд до ' + adNumber.offer.checkout;

  return checkin + checkout;
};


var cardTemplate = template.content.querySelector('.map__card');

// Функция создания фрагмента карточки с объявлением
var generateInfoPromo = function (adNumber) {
  var card = cardTemplate.cloneNode(true);

  card.querySelector('.popup__title').textContent = adNumber.offer.title; // + Выводит заголовок объявления offer.title в заголовок .popup__title
  card.querySelector('.popup__text--address').textContent = adNumber.offer.address; // + Выводит адрес offer.address в блок .popup__text--address
  card.querySelector('.popup__text--price').textContent = getPriceHouse(adNumber); // + Выводит цену offer.price в блок .popup__text--price строкой вида {{offer.price}}₽/ночь. Например, 5200₽/ночь.
  card.querySelector('.popup__type').textContent = getRusTypeOfHouse(adNumber); // - В блок .popup__type выведите тип жилья offer.type: Квартира для flat, Бунгало для bungalo, Дом для house, Дворец для palace
  card.querySelector('.popup__text--capacity').textContent = getGuestsOfHouse(adNumber); // + Выведите количество гостей и комнат offer.rooms и offer.guests в блок .popup__text--capacity строкой вида {{offer.rooms}} комнаты для {{offer.guests}} гостей. Например, 2 комнаты для 3 гостей
  card.querySelector('.popup__text--time').textContent = getCheckinCheckoutTimes(adNumber); // + Время заезда и выезда offer.checkin и offer.checkout в блок .popup__text--time строкой вида Заезд после {{offer.checkin}}, выезд до {{offer.checkout}}. Например, заезд после 14:00, выезд до 12:00.
  card.querySelector('.popup__features').textContent = FEATURES; // + В список .popup__features выведите все доступные удобства в объявлении
  card.querySelector('.popup__description').textContent = adNumber.offer.description; // + В блок .popup__description выведите описание объекта недвижимости offer.description
  card.querySelector('.popup__photos').src = adNumber.offer.photos; // - В блок .popup__photos выведите все фотографии из списка offer.photos. Каждая из строк массива photos должна записываться как src соответствующего изображения
  card.querySelector('.popup__avatar').src = adNumber.author.avatar; // + Замена src у аватарки пользователя на значения поля author.avatar

  return card;
};

map.appendChild(generateInfoPromo(createPosterData()));
