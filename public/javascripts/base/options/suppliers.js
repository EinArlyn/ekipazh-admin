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
    } else if (selectedOption == 17) {
      $('.checked-option').addClass('disabled');
      window.location.href = '/base/options/holes';
    } else if (selectedOption == 16) {
      $('.checked-option').addClass('disabled');
      window.location.href = '/base/options/otherelems';
    } else if (selectedOption == 18) {
      $('.checked-option').addClass('disabled');
      window.location.href = '/base/options/presets';
    }
  });

  /** Remove supplier */
  $('.btn-remove').click(function(e) {
    e.preventDefault();

    var supplierId = $(this).attr('data-supplier');
    $('#delete-supplier-submit').attr('data-supplier', supplierId);
    $('.delete-supplier-alert').popup('show');    
  });

    /** Submit removing supplier */
    $('#delete-supplier-submit').click(function(e) {
      e.preventDefault();

      var supplierId = $(this).attr('data-supplier');
      $.post('/base/options/suppliers/remove', {
        supplierId: supplierId
      }, function(data) {
        if (data.status) {
          $('.delete-supplier-alert').popup('hide');
          $('tr.supplier-table-tr[data-supplier=' + supplierId + ']').remove();
        }
      });
    });
    /** Deny removing supplier */
    $('#delete-supplier-deny').click(function(e) {
      e.preventDefault();
      $('.delete-supplier-alert').popup('hide');
    });

  /** Add new supplier */
  $('#add-supplier').click(function(e) {
    e.preventDefault();

    $('.add-new-supplier-pop-up').popup('show');
    setTimeout(function() {
      $('#new-supplier-name').focus();
    }, 200);
  });

    /** Submit add new supplier */
    $('#submit-add-new-supplier').click(function(e) {
      e.preventDefault();

      $('#add-new-supplier-form').submit();
      $('.add-new-supplier-pop-up').popup('hide');
    });

  $('.editable-name').editable('/base/options/suppliers/edit-name', {
    id: 'supplierId',
    name: 'value',
    indicator: 'Сохранение..',
    tooltip: 'Нажмите для редактирования',
    submit: 'Ok',
    cssclass : 'edit-input',
    height: '12px',
    width: '110px',
    callback: function() {
      
    }
  });

  /** Init popups */
  $('.add-new-supplier-pop-up').popup({
    type: 'overlay',
    autoopen: false,
    scrolllock: true,
    transition: 'all 0.3s'
  });
  $('.delete-supplier-alert').popup({
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
