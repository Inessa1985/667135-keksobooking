'use strict';

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
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
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
var PIN_WIDTH = 50; // Ширина элемента сгенерированного маркера на карте
var PIN_HEIGHT = 70;// Высота элемента сгенерированного маркера на карте
// var MAIN_PIN_X = 570; // Координата X главной метки адреса (.map__pin--main) в неактивном состоянии
// var MAIN_PIN_Y = 375; // Координата Y главной метки адреса (.map__pin--main) в неактивном состоянии
var MAIN_PIN_WIDTH = 62; // Ширина главной метки адреса (.map__pin--main) в неактивном состоянии
var MAIN_PIN_HEIGHT = 58; // Ширина главной метки адреса (.map__pin--main) в неактивном состоянии
// var ESC_KEYCODE = 27;
// var pinCenterX = Math.round(MAIN_PIN_X + MAIN_PIN_WIDTH * 0.5); // Координата центра по оси X главной метки адреса (.map__pin--main) в неактивном состоянии
// var pinCenterY = Math.round(MAIN_PIN_Y + MAIN_PIN_HEIGHT * 0.5); // Координата центра по оси Y главной метки адреса (.map__pin--main) в неактивном состоянии
var MIN_PRICE_BUNGALO = 0;
var MIN_PRICE_FLAT = 1000;
var MIN_PRICE_HOUSE = 5000;
var MIN_PRICE_PALACE = 10000;
var posterArr = null;
var TOP_LIMIT = 130; // Верхняя граница ограничения передвижения маркера на карте
var BOTTOM_LIMIT = 630; // Нижняя граница ограничения передвижения маркера на карте

var map = document.querySelector('.map');
var template = document.querySelector('template');
var pinTemplate = template.content.querySelector('.map__pin');
var cardTemplate = template.content.querySelector('.map__card');
var similarListElement = document.querySelector('.map__pins');
var img = cardTemplate.cloneNode(true).querySelector('.popup__photo');
var avatarNumber = 1;

var formContent = document.querySelector('.ad-form'); // Находит форму для отправки объявления
var formElementList = formContent.querySelectorAll('fieldset'); // Находит поля формы для отправки объявления
var mainPin = document.querySelector('.map__pin--main');
var addressInput = formContent.querySelector('#address'); // Находит поле адреса в нижней форме для отправки объявления
var typeSelect = formContent.querySelector('#type'); // Находит поле "Тип жилья"
var typeOptions = typeSelect.querySelectorAll('option'); // Находит все 'option' поля "Тип жилья"
var priceInput = formContent.querySelector('#price'); // Находит поле "Цена за ночь"
var roomsSelect = formContent.querySelector('#room_number'); // Находит поле "Кол-во комнат"
var capacitySelect = formContent.querySelector('#capacity'); // Находит поле "Количество мест"
var selectedRooms = Number(roomsSelect.value); // Приводит значение поля "Кол-во комнат" к числовому
var checkinSelect = formContent.querySelector('#timein'); // Находит поле "Время заезда"
var checkoutSelect = formContent.querySelector('#timeout'); // Находит поле "Время выезда"
// var submitBtn = formContent.querySelector('.ad-form__submit'); // Находит кнопку "Опубликовать"
// var resetBtn = formContent.querySelector('.ad-form__reset'); // Находит кнопку сброса формы "очистить"
// var successPopup = document.querySelector('.success'); // Находит сообщение об успешной отправки формы


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
      features: getFeauters(FEATURES),
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
var createPostersAds = function () {
  var randomAds = [];

  for (var i = 0; i < NUMBER_OF_ADS; i++) {
    randomAds.push(createPosterData());
  }

  return randomAds;
};

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
var createPinsFragment = function (arr) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < arr.length; i++) {
    fragment.appendChild(createPinElement(arr[i]));
  }

  return fragment;
};

// Функция для перевода типа жилья на русский язык
var getTypeHouse = function (advData) {
  var type = advData.offer.type;

  switch (type) {
    case 'flat':
      return 'Квартира';
    case 'bungalo':
      return 'Бунгало';
    case 'house':
      return 'Дом';
    case 'palace':
      return 'Дворец';
  }

  return type;
};

// Функция для создания иконок доступных удобств в объявлении
var getFeaturesIcons = function (list, amount) {
  var currentAdFeatures = amount.offer.features;
  var allFeatures = FEATURES;

  for (var i = 0; i < allFeatures.length; i++) {
    if (!currentAdFeatures.includes(allFeatures[i])) {
      var featureItem = list.querySelector('.popup__feature--' + allFeatures[i]);
      list.removeChild(featureItem);
    }
  }
};

// Функция для создания фотографий в объявлении
var getPhotoList = function (advData) {
  var imgFragment = document.createDocumentFragment();
  var photos = advData.offer.photos;

  for (var i = 0; i < photos.length; i++) {
    var imgTemplate = img.cloneNode(true);
    imgTemplate.src = advData.offer.photos[i];
    imgFragment.appendChild(imgTemplate);
  }

  return imgFragment;
};

// Функция создания фрагмента карточки с объявлением
var generateInfoPromo = function (advData) {
  var card = cardTemplate.cloneNode(true);
  var fragment = document.createDocumentFragment();
  var featuresList = card.querySelector('.popup__features');
  var photoTemplate = card.querySelector('.popup__photos').querySelector('.popup__photo');

  card.querySelector('.popup__title').textContent = advData.offer.title; // Выводит заголовок объявления offer.title в заголовок .popup__title
  card.querySelector('.popup__text--address').textContent = advData.offer.address; // Выводит адрес offer.address в блок .popup__text--address
  card.querySelector('.popup__text--price').textContent = advData.offer.price + ' ₽/ночь'; // Выводит цену offer.price в блок .popup__text--price строкой вида {{offer.price}}₽/ночь. Например, 5200₽/ночь.
  card.querySelector('.popup__type').textContent = getTypeHouse(advData); // Выводит в блок .popup__type выводит тип жилья offer.type: Квартира для flat, Бунгало для bungalo, Дом для house, Дворец для palace
  card.querySelector('.popup__text--capacity').textContent = advData.offer.rooms + ' комнаты для ' + advData.offer.guests + ' гостей'; // Выводит количество гостей и комнат offer.rooms и offer.guests в блок .popup__text--capacity строкой вида {{offer.rooms}} комнаты для {{offer.guests}} гостей. Например, 2 комнаты для 3 гостей
  card.querySelector('.popup__text--time').textContent = 'Заезд после ' + advData.offer.checkin + ', выезд до ' + advData.offer.checkout; // Время заезда и выезда offer.checkin и offer.checkout в блок .popup__text--time строкой вида Заезд после {{offer.checkin}}, выезд до {{offer.checkout}}. Например, заезд после 14:00, выезд до 12:00.
  getFeaturesIcons(featuresList, advData); // В список .popup__features выводит все доступные удобства в объявлении
  card.querySelector('.popup__description').textContent = advData.offer.description; // В блок .popup__description выводит описание объекта недвижимости offer.description
  card.querySelector('.popup__photos').appendChild(getPhotoList(advData)); // Вставляет в блок .popup__photos выводит все фотографии из списка offer.photos. Каждая из строк массива photos должна записываться как src соответствующего изображения
  card.querySelector('.popup__avatar').src = advData.author.avatar; // Замена src у аватарки пользователя на значения поля author.avatar
  photoTemplate.parentNode.removeChild(photoTemplate); // Удаляет шаблон вставки фотографии из объявления

  fragment.appendChild(card);

  return fragment;
};

// Функция для деактивации элементов формы в изначальном состоянии
var disableFormElements = function (arr) {
  for (var i = 0; i < arr.length; i++) {
    arr[i].disabled = 'true';
  }
};

// Функция возвращает активное состояние элементам формы в изначальное состояние
var enableFormElements = function (arr) {
  for (var i = 0; i < arr.length; i++) {
    arr[i].disabled = '';
  }
};

// Функция для удаления созданной карточки объявления
var erasePromoCard = function () {
  var previousCard = map.querySelector('.map__card');

  if (previousCard) {
    map.removeChild(previousCard);
  }
};

// Функция для закрытия карточки объявления с описанием
var closeCardPopup = function () {
  var cardCloseButton = map.querySelector('.popup__close');

  cardCloseButton.addEventListener('click', function () {
    erasePromoCard();
  });
};

// Функция для активация страницы
var enablePage = function (addArray) {
  map.classList.remove('map--faded'); // У блока .map убирает класс .map--faded
  enableFormElements(formElementList); // Активация нижней формы объявления
  formContent.classList.remove('ad-form--disabled'); // У блока .ad-form убирает класс .ad-form--disabled (Активация формы объявления)
  similarListElement.appendChild(createPinsFragment(addArray)); // Добавляет на карту фрагменты с маркерами
};

// Метод для отрисовки карточки предложения по клику на соответствующий пин
var pinElementAddHandler = function (element, addObject) {
  element.addEventListener('click', function () {
    erasePromoCard(); // Удаляет предыдущую карточку объявления с описанием
    map.appendChild(generateInfoPromo(addObject)); // Добавляет карточку объявления с описанием
    closeCardPopup(); // Закрывает карточку объявления с описанием
  });
};

var pinClickHandler = function (arr) {
  var renderedPinList = similarListElement.querySelectorAll('.map__pin:not(:first-of-type)');

  for (var i = 0; i < renderedPinList.length; i++) {
    pinElementAddHandler(renderedPinList[i], arr[i]);
  }
};


// Синхронизация "Количество комнат" и "Количество мест" (Валидация формы)
var validateCapacity = function () {
  var selectedCapacity = Number(capacitySelect.value);
  var message = '';
  switch (selectedRooms) {
    case (1): {
      if (selectedCapacity > 1) {
        message = 'Для указанного количества комнат можно выбрать количество мест: для 1 гостя';
      }
      break;
    }
    case (2): {
      if ((selectedCapacity > 2)) {
        message = 'Для указанного количества комнат можно выбрать количество мест: для 1 гостя или для 2 гостей';
      }
      break;
    }
    case (3): {
      if (selectedCapacity > 3) {
        message = 'Для указанного количества комнат можно выбрать количество мест: для 1 гостя; для 2 гостей; для 3 гостей';
      }
      break;
    }
    case (100): {
      if (selectedCapacity !== 100) {
        message = 'Для указанного количества комнат можно выбрать количество мест: не для гостей';
      }
      break;
    }
  }
  capacitySelect.setCustomValidity(message);
};

// Синхронизация "Время заезда" и "Время выезда"
var changeCheckTime = function (checkField, index) {
  checkField.selectedIndex = index;
};

var onCheckinSelectChangeHandler = function () {
  changeCheckTime(checkoutSelect, checkinSelect.selectedIndex);
};

var onCheckoutSelectChangeHandler = function () {
  changeCheckTime(checkinSelect, checkoutSelect.selectedIndex);
};

// Зависимость минимально допустимой цены предложения от типа жилья
var modifyMinPrice = function (input, minPrice) {
  input.min = minPrice;
  input.placeholder = minPrice;
};

var checkMinPrice = function (optionsCollection, typeSelection) {
  var type = optionsCollection[typeSelection.options.selectedIndex].value;

  switch (type) {
    case 'bungalo':
      return modifyMinPrice(priceInput, MIN_PRICE_BUNGALO);
    case 'flat':
      return modifyMinPrice(priceInput, MIN_PRICE_FLAT);
    case 'house':
      return modifyMinPrice(priceInput, MIN_PRICE_HOUSE);
    case 'palace':
      return modifyMinPrice(priceInput, MIN_PRICE_PALACE);
  }

  return type;
};


// Функции добавляют в поле адреса координаты метки
var isMapActive = function () {
  return !(map.classList.contains('map--faded'));
};

var calculateAddress = function () {
  var pinX = parseInt(mainPin.style.left, 10) + MAIN_PIN_WIDTH / 2;
  var pinY = parseInt(mainPin.style.top, 10) + MAIN_PIN_HEIGHT / 2;
  if (isMapActive()) {
    pinY += MAIN_PIN_HEIGHT / 2 + 22;
  }
  return Math.round(pinX) + ', ' + Math.round(pinY);
};

var getAddressFromPin = function () {
  var addressValue = calculateAddress();
  addressInput.value = addressValue;
};

// Функция подготовки формы к отправке
var prepareForm = function () {
  // Выводит координаты главной метки адреса (.map__pin--main) в нижней форме объявления в неактивном состоянии
  // addressInput.value = pinCenterX.toString() + ', ' + pinCenterY.toString();
  getAddressFromPin();

  // Проверка цены для дефолтного значения типа жилья
  typeSelect.addEventListener('change', function () {
    checkMinPrice(typeOptions, typeSelect);
  });

  // Синхронизация "Количество комнат" и "Количество мест" (Валидация формы)
  validateCapacity();
  capacitySelect.addEventListener('change', validateCapacity);
  roomsSelect.addEventListener('change', function () {
    selectedRooms = Number(roomsSelect.value);
    validateCapacity();
  });

  // Синхронизация "Время заезда" и "Время выезда"
  checkinSelect.addEventListener('change', onCheckinSelectChangeHandler);
  checkoutSelect.addEventListener('change', onCheckoutSelectChangeHandler);
};

// Метод активации сраницы при "перетаскивании" главной метки адреса (.map__pin--main)
var onPageActive = function () {
  enablePage(posterArr); // Активация сраницы
  pinClickHandler(posterArr); // Добавляет карточку объявления по клику на пин-элемент
  mainPin.removeEventListener('mouseup', onPageActive);
};


// Функция для инициализации страницы
var init = function () {

  // Создает массив похожих объявлений
  posterArr = createPostersAds();

  // Подготовка формы к отправке
  prepareForm();

  // Деактивация нижней формы объявления
  disableFormElements(formElementList);

  // Активация страницы
  mainPin.addEventListener('mouseup', onPageActive);

};

// Инициализирует страницу
init();

// Метод перетаскивания главной метки
mainPin.addEventListener('mousedown', function (event) {
  event.preventDefault();
  var startCoords = {
    x: event.clientX,
    y: event.clientY
  };

  var dragged = false;

  var onMouseMove = function (moveEvt) {
    moveEvt.preventDefault();
    dragged = true;
    var mapPinParent = mainPin.offsetParent;

    var shift = {
      x: startCoords.x - moveEvt.clientX,
      y: startCoords.y - moveEvt.clientY
    };

    startCoords = {
      x: moveEvt.clientX,
      y: moveEvt.clientY
    };

    var limits = {
      top: TOP_LIMIT - MAIN_PIN_HEIGHT,
      bottom: BOTTOM_LIMIT - MAIN_PIN_HEIGHT,
      left: mapPinParent.offsetLeft,
      right: mapPinParent.offsetWidth - MAIN_PIN_WIDTH
    };

    var calculateNewCoords = function () {
      var newCoords = {
        x: mainPin.offsetLeft - shift.x,
        y: mainPin.offsetTop - shift.y
      };
      if (mainPin.offsetLeft - shift.x > limits.right) {
        newCoords.x = limits.right;
      }
      if (mainPin.offsetLeft - shift.x < limits.left) {
        newCoords.x = limits.left;
      }
      if (mainPin.offsetTop - shift.y > limits.bottom) {
        newCoords.y = limits.bottom;
      }
      if (mainPin.offsetTop - shift.y < limits.top) {
        newCoords.y = limits.top;
      }
      return newCoords;
    };

    var newMapPinCoords = calculateNewCoords();
    mainPin.style.left = newMapPinCoords.x + 'px';
    mainPin.style.top = newMapPinCoords.y + 'px';
  };

  var onMouseUp = function (upEvt) {
    upEvt.preventDefault();
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);

    if (dragged) {
      var onClickPreventDefault = function (clickEvt) {
        clickEvt.preventDefault();
        mainPin.removeEventListener('click', onClickPreventDefault);
      };
      mainPin.addEventListener('click', onClickPreventDefault);
    }
  };

  getAddressFromPin();

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
});
