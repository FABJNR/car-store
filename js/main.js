(function ($, messageBox, validation) {
  'use strict';
  var app = (function () {
    var $carImage = $('[data-js="image"]').get();
    var $carBrandModel = $('[data-js="brand-model"]').get();
    var $carYear = $('[data-js="year"]').get();
    var $carLicensePlate = $('[data-js="license-plate"]').get();
    var $carColor = $('[data-js="color"]').get();
    var $tableCar = $('[data-js="table-car"]').get();

    return {
      init: function init() {
        this.companyInfo();
        this.loadCars();
        this.initEvents();
      },
      initEvents: function initEvents() {
        $('[data-js="form-register"]').on('submit', this.handleSubmit);
      },
      handleSubmit: function handleSubmit(event) {
        event.preventDefault();
        if (app.validate()) {
          app.insertCar();
          app.loadCars();
          app.clearForm();
        }
      },
      validate: function validate() {
        var errors = [];

        if (!$carImage.value)
          errors.push('Imagem do carro deve ser preenchida.');
        else if (!validation.isValidURL($carImage.value))
          errors.push('Imagem do carro deve ser uma URL válida.');

        if (!$carBrandModel.value)
          errors.push('Marca / Modelo deve ser preenchido.');

        if (!$carYear.value)
          errors.push('Ano deve ser preenchido.');
        else if (!validation.isValidYear($carYear.value))
          errors.push('Ano deve ser um valor numérico com 4 dígitos.');

        if (!$carLicensePlate.value)
          errors.push('Placa deve ser preenchida.');
        else if (!validation.isValidPlate($carLicensePlate.value))
          errors.push('Placa deve estar no formato ZZZ9999 ou ZZZ-9999.');

        if (!$carColor.value)
          errors.push('Cor deve ser preenchida.');

        messageBox.showMessageBoxError(errors);

        return errors.length === 0;
      },
      clearForm: function clearForm() {
        $carImage.value = '';
        $carBrandModel.value = '';
        $carYear.value = '';
        $carLicensePlate.value = '';
        $carColor.value = '';
      },
      insertCar: function insertCar() {
        var ajax = new XMLHttpRequest();
        ajax.open('POST', 'http://localhost:3000/car');
        ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        ajax.send('image=' + $carImage.value +
          '&brandModel=' + $carBrandModel.value +
          '&year=' + $carYear.value +
          '&plate=' + $carLicensePlate.value +
          '&color=' + $carColor.value);

        ajax.addEventListener('readystatechange', this.onInsertedCar, false);
      },
      onInsertedCar: function onInsertedCar() {
        if (!app.isReady.call(this))
          return;

        messageBox.showMessageBoxSuccess('Veículo cadastrado com sucesso!');
      },
      createNewCar: function createNewCar(car) {
        var $fragment = $.createFragment();
        var $tr = $.createTableRow();
        var $tdImage = $.createTableData();
        var $image = $.createImage();
        var $tdBrand = $.createTableData();
        var $tdYear = $.createTableData();
        var $tdLicensePlate = $.createTableData();
        var $tdColor = $.createTableData();
        var $tdRemove = $.createTableData();
        var $buttonRemove = app.configureRemoveButton();

        $image.src = car.image;
        $tdImage.appendChild($image);
        $tdBrand.textContent = car.brandModel;
        $tdYear.textContent = car.year;
        $tdLicensePlate.textContent = car.plate;
        $tdColor.textContent = car.color;
        $tdRemove.appendChild($buttonRemove);

        $tr.appendChild($tdImage);
        $tr.appendChild($tdBrand);
        $tr.appendChild($tdYear);
        $tr.appendChild($tdLicensePlate);
        $tr.appendChild($tdColor);
        $tr.appendChild($tdRemove);

        return $fragment.appendChild($tr);
      },
      applyCarEvents: function applyCarEvents() {
        $('[data-js="btn-remove-car"]').on('click', app.removeCar);
      },
      configureRemoveButton: function configureRemoveButton() {
        var $button = $.createButton();
        $button.type = 'button';
        $button.textContent = 'Remover';
        $button.setAttribute('class', 'btn btn-default');
        $button.setAttribute('data-js', 'btn-remove-car');

        return $button;
      },
      removeCar: function removeCar(event) {
        event.preventDefault();
        var row = this.parentNode.parentNode;
        row.parentNode.removeChild(row);
      },
      companyInfo: function companyInfo() {
        var ajax = new XMLHttpRequest();
        ajax.open('GET', 'data/company.json');
        ajax.send(null);
        ajax.addEventListener('readystatechange', this.getCompanyInfo, false);
      },
      getCompanyInfo: function getCompanyInfo() {
        if (!app.isReady.call(this))
          return;

        var data = JSON.parse(this.responseText);
        var $companyName = $('[data-js="company-name"]').get();
        var $companyPhone = $('[data-js="company-phone"]');
        var $companyPhoneLink = $('[data-js="company-phone-link"]');

        $companyName.textContent = data.name;
        $companyPhone.forEach(function (item) {
          item.textContent = data.phone;
        });
        $companyPhoneLink.forEach(function (item) {
          item.setAttribute('href', 'tel:' + data.phone);
        });
      },
      loadCars: function loadCars() {
        var ajax = new XMLHttpRequest();
        ajax.open('GET', 'http://localhost:3000/car');
        ajax.send(null);
        ajax.addEventListener('readystatechange', this.getCars, false);
      },
      getCars: function getCars() {
        if (!app.isReady.call(this))
          return;

        $tableCar.innerText = '';
        var data = JSON.parse(this.responseText);
        data.forEach(function (car) {
          $tableCar.appendChild(app.createNewCar(car));
        });
        app.applyCarEvents();
      },
      isReady: function isReady() {
        return this.readyState === 4 && this.status === 200;
      }
    };
  })();

  app.init();
})(window.DOM, window.MessageBox, window.Validation);
