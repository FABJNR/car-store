(function (win, doc, $) {
  'use strict';
  var app = (function () {
    var $carImage = $('[data-js="image"]').get();
    var $carBrandModel = $('[data-js="brand-model"]').get();
    var $carYear = $('[data-js="year"]').get();
    var $carLicensePlate = $('[data-js="license-plate"]').get();
    var $carColor = $('[data-js="color"]').get();

    return {
      init: function init() {
        this.companyInfo();
        this.initEvents();
      },
      initEvents: function initEvents() {
        $('[data-js="form-register"]').on('submit', this.handleSubmit);
      },
      handleSubmit: function handleSubmit(event) {
        event.preventDefault();
        if (app.validate()) {
          var $tableCar = $('[data-js="table-car"]').get();
          $tableCar.appendChild(app.createNewCar());
          app.applyCarEvents();
          app.clearForm();
        }
      },
      clearForm: function clearForm() {
        $carImage.value = '';
        $carBrandModel.value = '';
        $carYear.value = '';
        $carLicensePlate.value = '';
        $carColor.value = '';
      },
      validate: function validate() {
        var errors = [];

        if (!$carImage.value)
          errors.push('Imagem do carro deve ser preenchida.');
        else if (!app.isValidURL($carImage.value))
          errors.push('Imagem do carro deve ser uma URL válida.');

        if (!$carBrandModel.value)
          errors.push('Marca / Modelo deve ser preenchido.');

        if (!$carYear.value)
          errors.push('Ano deve ser preenchido.');
        else if (!app.isValidYear($carYear.value))
          errors.push('Ano deve ser um valor numérico com 4 dígitos.');

        if (!$carLicensePlate.value)
          errors.push('Placa deve ser preenchida.');
        else if (!app.isValidPlate($carLicensePlate.value))
          errors.push('Placa deve estar no formato ZZZ9999 ou ZZZ-9999.');

        if (!$carColor.value)
          errors.push('Cor deve ser preenchida.');

        app.showMessageBox(errors);

        return errors.length === 0;
      },
      isValidURL: function isValidURL(url) {
        var pattern = /(?:http|https):\/\/(?:\w+:{0,1}\w*)?(?:\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/g;
        return pattern.test(url);
      },
      isValidYear: function isValidYear(year) {
        return /^\d{4}$/.test(year);
      },
      isValidPlate: function isValidPlate(plate) {
        return /^[a-z]{3}\d{4}$|^[a-z]{3}-\d{4}$/i.test(plate);
      },
      showMessageBox: function showMessageBox(errors) {
        var $messageBox = $('[data-js="message-box"]').get();

        app.clearMessageBox($messageBox);

        if (errors.length > 0)
          return app.showMessageBoxError($messageBox, errors);

        return app.showMessageBoxSuccess($messageBox);
      },
      showMessageBoxError: function showMessageBoxError(messageBox, errors) {
        var $fragment = app.createFragment();

        errors.forEach(function (error) {
          var $paragraph = app.createParagraph();
          $paragraph.textContent = error;
          $fragment.appendChild($paragraph);
        });

        messageBox.setAttribute('class', 'alert alert-danger');

        return messageBox.appendChild($fragment);
      },
      showMessageBoxSuccess: function showMessageBoxSuccess(messageBox) {
        var $fragment = app.createFragment();
        var $paragraph = app.createParagraph();

        $paragraph.textContent = 'Veículo cadastrado com sucesso!';
        $fragment.appendChild($paragraph);
        messageBox.setAttribute('class', 'alert alert-success');

        return messageBox.appendChild($fragment);
      },
      clearMessageBox: function clearMessageBox(messageBox) {
        while (messageBox.hasChildNodes()) {
          messageBox.removeChild(messageBox.lastChild);
        }
      },
      createNewCar: function createNewCar() {
        var $fragment = app.createFragment();
        var $tr = app.createTableRow();
        var $tdImage = app.createTableData();
        var $image = app.createImage();
        var $tdBrand = app.createTableData();
        var $tdYear = app.createTableData();
        var $tdLicensePlate = app.createTableData();
        var $tdColor = app.createTableData();
        var $tdRemove = app.createTableData();
        var $buttonRemove = app.configureRemoveButton();

        $image.src = $carImage.value;
        $tdImage.appendChild($image);
        $tdBrand.textContent = $carBrandModel.value;
        $tdYear.textContent = $carYear.value;
        $tdLicensePlate.textContent = $carLicensePlate.value;
        $tdColor.textContent = $carColor.value;
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
        var $button = app.createButton();
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
        ajax.open('GET', 'data/company.json', true);
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
      isReady: function isReady() {
        return this.readyState === 4 && this.status === 200;
      },
      createFragment: function createFragment() {
        return doc.createDocumentFragment();
      },
      createParagraph: function createParagraph() {
        return doc.createElement('p');
      },
      createTableRow: function createTableRow() {
        return doc.createElement('tr');
      },
      createTableData: function createTableData() {
        return doc.createElement('td');
      },
      createImage: function createImage() {
        return doc.createElement('img');
      },
      createButton: function createButton() {
        return doc.createElement('button');
      }
    };
  })();

  app.init();
})(window, document, window.DOM);
