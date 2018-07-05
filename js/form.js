'use strict';

(function () {

  window.form = {};

  var MAIN_PIN_X = 570; // Координата X метки адреса (.map__pin--main) в неактивном состоянии
  var MAIN_PIN_Y = 375; // Координата Y метки адреса (.map__pin--main) в неактивном состоянии
  var MAIN_PIN_WIDTH = 62; // Ширина главной метки адреса (.map__pin--main) в неактивном состоянии
  var MAIN_PIN_HEIGHT = 58; // Высота главной метки адреса (.map__pin--main) в неактивном состоянии
  var MAIN_PIN_END_HEIGHT = 22; // Высота хвостика главной метки адреса (.map__pin--main) в активном состоянии
  var MIN_PRICE_BUNGALO = 0;
  var MIN_PRICE_FLAT = 1000;
  var MIN_PRICE_HOUSE = 5000;
  var MIN_PRICE_PALACE = 10000;
  var ESC_KEYCODE = 27;
  var pinCenterX = Math.round(MAIN_PIN_X + MAIN_PIN_WIDTH * 0.5); // Координата центра по оси X главной метки адреса (.map__pin--main) в неактивном состоянии
  var pinCenterY = Math.round(MAIN_PIN_Y + MAIN_PIN_HEIGHT * 0.5); // Координата центра по оси Y главной метки адреса (.map__pin--main) в неактивном состоянии

  var map = document.querySelector('.map');
  var mapPinsBlock = document.querySelector('.map__pins');
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
  var successPopup = document.querySelector('.success'); // Находит блок сообщения об успешном размещении объевления
  var formReset = formContent.querySelector('.ad-form__reset'); // Находит кнопку для сброса формы отправки объявления
  var formElementList = formContent.querySelectorAll('fieldset'); // Находит поля формы для отправки объявления
  var mapFilters = document.querySelector('.map__filters');


  // Функция для деактивации элементов формы в изначальном состоянии
  window.form.disableFormElements = function (arr) {
    for (var i = 0; i < arr.length; i++) {
      arr[i].disabled = 'true';
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

  var onPopupEscPress = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      closePopup();
    }
  };

  var openPopup = function () {
    successPopup.classList.remove('hidden');
    document.addEventListener('keydown', onPopupEscPress);
  };

  var closePopup = function () {
    successPopup.classList.add('hidden');
    document.removeEventListener('keydown', onPopupEscPress);
  };

  window.form.removeMapPins = function () {
    var pins = mapPinsBlock.querySelectorAll('.map__pin:not(.map__pin--main)');

    for (var i = 0; i < pins.length; i++) {
      mapPinsBlock.removeChild(pins[i]);
    }
  };

  // Функция перевода страницы в неактивное состояние
  var deactivatePage = function () {

    formContent.reset(); // Сбрасывает значения формы на изначальные
    map.classList.add('map--faded'); // У блока .map добавляет класс .map--faded
    formContent.classList.add('ad-form--disabled'); // У блока .ad-form добавляет класс .ad-form--disabled (деактивация формы объявления)
    mainPin.style.left = MAIN_PIN_X + 'px'; // Координата X главной метки на карте
    mainPin.style.top = MAIN_PIN_Y + 'px'; // Координата Y главной метки на карте

    // Удаляет пин-элементы с карты
    window.form.removeMapPins();

    // Удаляет созданную карточку объявления
    window.map.erasePromoCard();

    // Выводит координаты главной метки адреса (.map__pin--main) в нижней форме объявления в неактивном состоянии
    addressInput.value = pinCenterX + ', ' + pinCenterY;

    // Деактивация полей нижней формы объявления
    window.form.disableFormElements(formElementList);

  };

  var onSuccessForm = function () {
    openPopup();
    successPopup.addEventListener('keydown', onPopupEscPress);
    successPopup.addEventListener('click', closePopup);
    deactivatePage();
  };

  var typeSelectOnChange = function () {
    checkMinPrice(typeOptions, typeSelect);
  };

  var roomsSelectOnChange = function () {
    selectedRooms = Number(roomsSelect.value);
    validateCapacity();
  };

  var removeFormEvent = function () {
    checkinSelect.removeEventListener('change', onCheckinSelectChangeHandler);
    checkoutSelect.removeEventListener('change', onCheckoutSelectChangeHandler);
    capacitySelect.removeEventListener('change', validateCapacity);
    typeSelect.removeEventListener('change', typeSelectOnChange);
    roomsSelect.removeEventListener('change', roomsSelectOnChange);
  };

  var formSubmit = function (evt) {
    evt.preventDefault();
    window.map.isLoaded = false;
    window.backend.save(new FormData(formContent), onSuccessForm, window.map.onError);
    mapFilters.reset();
    formContent.removeEventListener('submit', formSubmit);
    removeFormEvent();
  };

  var formResetOnClick = function () {
    window.map.isLoaded = false;
    deactivatePage();
    mapFilters.reset();
    formReset.removeEventListener('click', formResetOnClick);
    removeFormEvent();
  };

  // Функция подготовки формы к отправке
  window.form.prepareForm = function () {
    // Выводит координаты главной метки адреса (.map__pin--main) в нижней форме объявления в неактивном состоянии
    window.form.getAddressFromPin();

    // Проверка цены для дефолтного значения типа жилья
    typeSelect.addEventListener('change', typeSelectOnChange);

    // Синхронизация "Количество комнат" и "Количество мест" (Валидация формы)
    validateCapacity();
    capacitySelect.addEventListener('change', validateCapacity);
    roomsSelect.addEventListener('change', roomsSelectOnChange);

    // Синхронизация "Время заезда" и "Время выезда"
    checkinSelect.addEventListener('change', onCheckinSelectChangeHandler);
    checkoutSelect.addEventListener('change', onCheckoutSelectChangeHandler);
  };

  // Отправка формы
  formContent.addEventListener('submit', formSubmit);

  // Сброс формы кнопкой "очистить"
  formReset.addEventListener('click', formResetOnClick);

})();
