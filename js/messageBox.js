(function (win, $) {
  'use strict';

  var messageBox = (function () {
    var $messageBox = $('[data-js="message-box"]').get();

    function showMessageBoxError(errors) {
      clearMessageBox($messageBox);

      var $fragment = $.createFragment();

      errors.forEach(function (error) {
        var $paragraph = $.createParagraph();
        $paragraph.textContent = error;
        $fragment.appendChild($paragraph);
      });

      $messageBox.setAttribute('class', 'alert alert-danger');

      return $messageBox.appendChild($fragment);
    }

    function showMessageBoxSuccess(message) {
      clearMessageBox($messageBox);
      var $fragment = $.createFragment();
      var $paragraph = $.createParagraph();

      $paragraph.textContent = message;
      $fragment.appendChild($paragraph);
      $messageBox.setAttribute('class', 'alert alert-success');

      return $messageBox.appendChild($fragment);
    }

    function clearMessageBox(messageBox) {
      while (messageBox.hasChildNodes()) {
        messageBox.removeChild(messageBox.lastChild);
      }
    }

    return {
      showMessageBoxError: showMessageBoxError,
      showMessageBoxSuccess: showMessageBoxSuccess
    };
  })();

  win.MessageBox = messageBox;

})(window, window.DOM);
