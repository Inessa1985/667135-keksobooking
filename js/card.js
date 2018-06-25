'use strict';

(function () {

  window.card = {};

  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

  var template = document.querySelector('template');
  var cardTemplate = template.content.querySelector('.map__card');
  var img = cardTemplate.cloneNode(true).querySelector('.popup__photo');


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
  window.card.generateInfoPromo = function (advData) {
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

})();
