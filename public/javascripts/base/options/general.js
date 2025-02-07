$(function () {
  var localizerOption = { resGetPath: '/assets/javascripts/vendor/localizer/__ns__-__lng__.json'};
  var NEW_FOLDER_ID = -50;
  i18n.init(localizerOption);

  $('#lamination-select').change(function () {
    var selectedOption = $('#lamination-select option:selected').val();
    if (selectedOption == 1) {
      $('.checked-option').addClass('disabled');
      window.location.href = '/base/options/laminations';
    } else if (selectedOption == 2) {
      $('.checked-option').addClass('disabled');
      window.location.href = '/base/options/discounts';
    } else if (selectedOption == 3) {
      $('.checked-option').addClass('disabled');
      window.location.href = '/base/options/coefficients';
    } else if (selectedOption == 4) {
      $('.checked-option').addClass('disabled');
      window.location.href = '/base/options/glazed-window';
    } else if (selectedOption == 5) {
      $('.checked-option').addClass('disabled');
      window.location.href = '/base/options/window-sills';
    } else if (selectedOption == 6) {
      $('.checked-option').addClass('disabled');
      window.location.href = '/base/options/spillways';
    } else if (selectedOption == 7) {
      $('.checked-option').addClass('disabled');
      window.location.href = '/base/options/visors';
    } else if (selectedOption == 8) {
      $('.checked-option').addClass('disabled');
      window.location.href = '/base/options/suppliers';
    } else if (selectedOption == 9) {
      $('.checked-option').addClass('disabled');
      window.location.href = '/base/options/currency';
    } else if (selectedOption == 10) {
      $('.checked-option').addClass('disabled');
      window.location.href = '/base/options/general';
    } else if (selectedOption == 11) {
      $('.checked-option').addClass('disabled');
      window.location.href = '/base/options/application';
    } else if (selectedOption == 12) {
      $('.checked-option').addClass('disabled');
      window.location.href = '/base/options/connectors';
    } else if (selectedOption == 13) {
      $('.checked-option').addClass('disabled');
      window.location.href = '/base/options/mosquitos';
    } else if (selectedOption == 14) {
      $('.checked-option').addClass('disabled');
      window.location.href = '/base/options/doorhandles';
    } else if (selectedOption == 15) {
      $('.checked-option').addClass('disabled');
      window.location.href = '/base/options/decors';
    } else if (selectedOption == 16) {
      $('.checked-option').addClass('disabled');
      window.location.href = '/base/options/otherelems';
    }
  });

  /** email container */
  $('.email-input').keypress(emailPress);
  $('.submit-factory-email').click(submitFactoryEmail);
  $('#add-email').click(addEmail);

  /** folders container */
  $('.folder-input').keypress(folderPress);
  $('.submit-factory-folder').click(submitFactoryFolder);
  $('#add-folder').click(addFolder);

  /** change option */
  $('.option-input').change(changeOption);

  /** change identificator */
  $('.identificator-input').keypress(function() {
    $('#submit-identificators').prop('disabled', false);
  });

  function isValidEmailAddress(email) {
    var pattern = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return pattern.test(email);
  }

  function addEmail(e) {
    $.post('/base/options/general/add-email', function(data) {
     if (data.status) {
        $('#email-table tbody').append('<tr><td><input ' +
          'class="input-default email-input" ' +
          'type="text" ' +
          'data-row="' + data.id + '" ' +
          'value="" ' +
          'placeholder="' + i18n.t('Type email address') + '"' +
        '>' +
        '<input class="ok-button submit-factory-email" ' +
          'type="button" ' +
          'data-row="' + data.id + '" ' +
          'value="' + i18n.t('Ok') +
        '"></td></tr>');
        $('#email-table tbody').on('keypress', '.email-input', emailPress);
        $('#email-table tbody').on('click', '.submit-factory-email', submitFactoryEmail);
     }
    });
  }

  function addFolder(e) {
    $('#folders-table tbody').append('<tr><td><input ' +
      'class="input-default folder-input" ' +
      'type="text" ' +
      'data-row="' + NEW_FOLDER_ID + '" ' +
      'value="" ' +
      'placeholder="' + i18n.t('Type folder name') + '"' +
    '>' +
    '<input class="ok-button submit-factory-folder" ' +
      'type="button" ' +
      'data-row="' + NEW_FOLDER_ID + '" ' +
      'value="' + i18n.t('Ok') +
    '"></td></tr>');
    $('#folders-table tbody').on('keypress', '.folder-input[data-row="' + NEW_FOLDER_ID + '"]', folderPress);
    $('#folders-table tbody').on('click', '.submit-factory-folder[data-row="' + NEW_FOLDER_ID + '"]', submitFactoryFolder);
    NEW_FOLDER_ID++;
  }

  function emailPress(e) {
    e.stopImmediatePropagation();

    var rowId = $(this).attr('data-row');
    $('.submit-factory-email[data-row=' + rowId + ']').show();
  }

  function folderPress(e) {
    e.stopImmediatePropagation();

    var rowId = $(this).attr('data-row');
    $('.submit-factory-folder[data-row=' + rowId + ']').show();
  }

  function submitFactoryEmail(e) {
    e.preventDefault();

    var rowId = $(this).attr('data-row');
    var email = $('.email-input[data-row=' + rowId + ']').val();

    if (isValidEmailAddress(email)) {
      $.post('/base/options/general/change-email', {
        rowId: rowId,
        email: email
      }, function(data) {
        if (data.status) {
          $('.submit-factory-email[data-row=' + rowId + ']').hide();
          $.toast({
            text : i18n.t('Order mail has been changed'),
            showHideTransition: 'fade',
            allowToastClose: true,
            hideAfter: 3000,
            stack: 5,
            position: {top: '60px', right: '30px'}
          });
        } else {
          $.toast({
            text : data.error,
            showHideTransition: 'fade',
            allowToastClose: true,
            hideAfter: 3000,
            stack: 5,
            position: {top: '60px', right: '30px'},
            bgColor: '#FF6633',
            textColor: '#fff'
          });
        }
      });
    } else {
      $.toast({
        text : i18n.t('Incorrect email address'),
        showHideTransition: 'fade',
        allowToastClose: true,
        hideAfter: 3000,
        stack: 5,
        position: {top: '60px', right: '30px'},
        bgColor: '#FF6633',
        textColor: '#fff'
      });
    }
  }

  function submitFactoryFolder(e) {
    e.preventDefault();

    var rowId = $(this).attr('data-row');
    var name = $('.folder-input[data-row=' + rowId + ']').val();

    if (name.length > 0) {
      if (parseInt(rowId, 10) > 0) {
        updateFolderName();
      } else {
        createFolder();
      }
    } else {
      $.toast({
        text : i18n.t('Type folder name') + '.',
        showHideTransition: 'fade',
        allowToastClose: true,
        hideAfter: 3000,
        stack: 5,
        position: {top: '60px', right: '30px'},
        bgColor: '#FF6633',
        textColor: '#fff'
      });
    }

    function updateFolderName () {
      $.post('/base/options/general/folder/update', {
        rowId: rowId,
        name: name
      }, function (data) {
        if (data.status) {
          $('.submit-factory-folder[data-row=' + rowId + ']').hide();

          $.toast({
            text : i18n.t('Orders folder has been changed'),
            showHideTransition: 'fade',
            allowToastClose: true,
            hideAfter: 3000,
            stack: 5,
            position: {top: '60px', right: '30px'}
          });
        }
      });
    }

    function createFolder () {
      $.post('/base/options/general/folder/add', {
        name: name
      }, function (data) {
        if (data.status) {
          $('.folder-input[data-row=' + rowId + ']').attr('data-row', data.rowId);
          $('.submit-factory-folder[data-row=' + rowId + ']').attr('data-row', data.rowId).hide();
          // rebind event listener
          $('.folder-input[data-row="' + data.rowId + '"]').keypress(folderPress);
          $('.submit-factory-folder[data-row="' + data.rowId + '"]').click(submitFactoryFolder);

          $.toast({
            text : i18n.t('Orders folder has been added'),
            showHideTransition: 'fade',
            allowToastClose: true,
            hideAfter: 3000,
            stack: 5,
            position: {top: '60px', right: '30px'}
          });
        }
      });
    }
  }

  function changeOption (e) {
    $.post('/base/options/general/change-option', {
      type: $(this).attr('data-type'),
      value: $(this).val()
    }, function(data) {
      if (data.status) {
        $.toast({
          text : i18n.t('Changes saved'),
          showHideTransition: 'fade',
          allowToastClose: true,
          hideAfter: 3000,
          stack: 5,
          position: {top: '60px', right: '30px'}
        });
      } else {
        $.toast({
          text : 'Internal server error',
          showHideTransition: 'fade',
          allowToastClose: true,
          hideAfter: 3000,
          stack: 5,
          position: {top: '60px', right: '30px'},
          bgColor: '#FF6633',
          textColor: '#fff'
        });
      }
    });
  }
});
