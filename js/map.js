'use strict';

(function () {

  window.map = {};

  var MAIN_PIN_WIDTH = 62; // Ширина главной метки адреса (.map__pin--main) в неактивном состоянии
  var MAIN_PIN_HEIGHT = 58; // Высота главной метки адреса (.map__pin--main) в неактивном состоянии
  var TOP_LIMIT = 130; // Верхняя граница ограничения передвижения маркера на карте
  var BOTTOM_LIMIT = 630; // Нижняя граница ограничения передвижения маркера на карте
  var posterArr = null;

  var map = document.querySelector('.map');
  var similarListElement = document.querySelector('.map__pins');
  var formContent = document.querySelector('.ad-form'); // Находит форму для отправки объявления
  var formElementList = formContent.querySelectorAll('fieldset'); // Находит поля формы для отправки объявления
  var mainPin = document.querySelector('.map__pin--main');


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
    similarListElement.appendChild(window.pin.createPinsFragment(addArray)); // Добавляет на карту фрагменты с маркерами
  };

  // Метод для отрисовки карточки предложения по клику на соответствующий пин
  var pinElementAddHandler = function (element, addObject) {
    element.addEventListener('click', function () {
      erasePromoCard(); // Удаляет предыдущую карточку объявления с описанием
      map.appendChild(window.card.generateInfoPromo(addObject)); // Добавляет карточку объявления с описанием
      closeCardPopup(); // Закрывает карточку объявления с описанием
    });
  };

  var pinClickHandler = function (arr) {
    var renderedPinList = similarListElement.querySelectorAll('.map__pin:not(:first-of-type)');

    for (var i = 0; i < renderedPinList.length; i++) {
      pinElementAddHandler(renderedPinList[i], arr[i]);
    }
  };


  // Метод активации сраницы при "перетаскивании" главной метки адреса (.map__pin--main)
  var onPageActive = function () {
    enablePage(posterArr); // Активация сраницы
    pinClickHandler(posterArr); // Добавляет карточку объявления по клику на пин-элемент
    mainPin.removeEventListener('mouseup', onPageActive);
  };

  // Функция взаимодействия страницы и главной метки
  var clickMainPin = function () {
    // Активация страницы
    mainPin.addEventListener('mouseup', onPageActive);

    // Метод перетаскивания главной метки
    mainPin.addEventListener('mousedown', function (event) {
      event.preventDefault();
      var startCoords = {
        x: event.clientX,
        y: event.clientY
      };

      var onMouseMove = function (moveEvt) {
        moveEvt.preventDefault();
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

        window.form.getAddressFromPin();
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });
  };

  var onSuccess = function (cardsArray) {
    posterArr = cardsArray;

    // Активация страницы и претаскивание главной метки
    clickMainPin();
  };

  window.map.onError = function (errorMessage) {
    var node = document.createElement('div');
    node.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: rgba(255, 50, 0, 0.7); top: 200px; left: 50%; transform: translateX(-50%); box-shadow: 0 0 50px rgba(0, 0, 0, 0.4); border: 1px solid rgba(255, 50, 0, 0.7); border-radius: 20px';
    node.style.position = 'fixed';
    node.style.padding = '50px 30px';
    node.style.fontfamily = 'Arial';
    node.style.color = 'white';
    node.style.fontSize = '24px';
    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);
  };

  // Функция для инициализации страницы
  var init = function () {

    // Подготовка формы к отправке
    window.form.prepareForm();

    // Деактивация нижней формы объявления
    window.form.disableFormElements(formElementList);

    // Скачивание массива с сервера и активация страницы, пертаскивание главной метки
    window.backend.load(onSuccess, window.map.onError);
  };

  // Инициализирует страницу
  init();

})();
