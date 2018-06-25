'use strict';

(function () {

  window.form = {};

  var MAIN_PIN_WIDTH = 62; // Ширина главной метки адреса (.map__pin--main) в неактивном состоянии
  var MAIN_PIN_HEIGHT = 58; // Высота главной метки адреса (.map__pin--main) в неактивном состоянии
  var MAIN_PIN_END_HEIGHT = 22; // Высота хвостика главной метки адреса (.map__pin--main) в активном состоянии
  var MIN_PRICE_BUNGALO = 0;
  var MIN_PRICE_FLAT = 1000;
  var MIN_PRICE_HOUSE = 5000;
  var MIN_PRICE_PALACE = 10000;

  var map = document.querySelector('.map');
  var mainPin = document.querySelector('.map__pin--main');
  var formContent = document.querySelector('.ad-form'); // Находит форму для отправки объявления
  var addressInput = formContent.querySelector('#address'); // Находит поле адреса в нижней форме для отправки объявления
  var typeSelect = formContent.querySelector('#type'); // Находит поле "Тип жилья"
  var typeOptions = typeSelect.querySelectorAll('option'); // Находит все 'option' поля "Тип жилья"
  var priceInput = formContent.querySelector('#price'); // Находит поле "Цена за ночь"
  var roomsSelect = formContent.querySelector('#room_number'); // Находит поле "Кол-во комнат"
  var capacitySelect = formContent.querySelector('#capacity'); // Находит поле "Количество мест"
  var selectedRooms = Number(roomsSelect.value); // Приводит значение поля "Кол-во комнат" к числовому
  var checkinSelect = formContent.querySelector('#timein'); // Находит поле "Время заезда"
  var checkoutSelect = formContent.querySelector('#timeout'); // Находит поле "Время выезда"

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
        if (selectedCapacity !== 0) {
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
      pinY += MAIN_PIN_HEIGHT / 2 + MAIN_PIN_END_HEIGHT;
    }
    return Math.round(pinX) + ', ' + Math.round(pinY);
  };

  window.form.getAddressFromPin = function () {
    var addressValue = calculateAddress();
    addressInput.value = addressValue;
  };

  // Функция подготовки формы к отправке
  window.form.prepareForm = function () {
    // Выводит координаты главной метки адреса (.map__pin--main) в нижней форме объявления в неактивном состоянии
    window.form.getAddressFromPin();

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


})();
