$(function() {
  var localizerOption = { resGetPath: '/assets/javascripts/vendor/localizer/__ns__-__lng__.json'};
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
    }
  });

  /** Remove currency */
  $('.btn-remove').click(function(e) {
    e.preventDefault();

    var currencyId = $(this).attr('data-currency');
    $('#delete-currency-submit').attr('data-currency', currencyId);
    $('.delete-currency-alert').popup('show');    
  });

    /** Submit removing currency */
    $('#delete-currency-submit').click(function(e) {
      e.preventDefault();
      $('.delete-currency-alert').popup('hide');
      $('.loader-wrapper').show();

      var currencyId = $(this).attr('data-currency');
      $.post('/base/options/currency/remove-currency', {
        currencyId: currencyId
      }, function(data) {
        if (data.status) {
          $('.loader-wrapper').hide();
          $('tr.currency-table-tr[data-currency=' + currencyId + ']').remove();
        }
      });
    });
    /** Deny removing currency */
    $('#delete-currency-deny').click(function(e) {
      e.preventDefault();
      $('.delete-currency-alert').popup('hide');
    });

  /** Add new currency */
  $('#add-currency').click(function(e) {
    e.preventDefault();

    $('.add-new-currency-pop-up').popup('show');
    setTimeout(function() {
      $('#new-currency-name').focus();
    }, 200);
  });

    /** Submit add new supplier */
    $('#submit-add-new-currency').click(function(e) {
      e.preventDefault();

      $('#add-new-currency-form').submit();
      $('.add-new-currency-pop-up').popup('hide');
    });

  /** Change base currency */
  $('.currency-radio').click(function() {
    var currencyId = $(this).attr('value');
    
    $.post('/base/options/currency/change-base-currency', {
      currencyId: currencyId
    }, function(data) {
      if (data.status) {
        $('.hidden').removeClass('hidden');
        $('.btn-remove[data-currency="' + currencyId + '"]').addClass('hidden');
      }
    });
  });

  /** Edit currency name */
  $('.editable-name').editable('/base/options/currency/edit-name', {
    id: 'currencyId',
    name: 'value',
    indicator: '...',
    tooltip: 'Нажмите для редактирования',
    submit: 'Ok',
    cssclass : 'edit-input',
    height: '12px',
    width: '110px',
    callback: function() {
      
    }
  });

  /** Edit currency value */
  $('.editable-value').editable('/base/options/currency/edit-value', {
    id: 'currencyId',
    name: 'value',
    indicator: '...',
    tooltip: 'Нажмите для редактирования',
    submit: 'Ok',
    cssclass : 'edit-input',
    height: '12px',
    width: '90px',
    callback: function() {
      
    }
  });

  /** Init popups */
  $('.add-new-currency-pop-up').popup({
    type: 'overlay',
    autoopen: false,
    scrolllock: true,
    transition: 'all 0.3s'
  });
  $('.delete-currency-alert').popup({
    type: 'overlay',
    autoopen: false,
    scrolllock: true,
    transition: 'all 0.3s'
  });
  /** Close popups */
  $('.pop-up-close-wrap').click(function(e) {
    e.preventDefault();

    $('.pop-up').popup('hide');
    $('.pop-up-default').popup('hide');
  });
});
