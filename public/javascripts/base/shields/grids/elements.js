$(function () {
  var localizerOption = { resGetPath: '/assets/javascripts/vendor/localizer/__ns__-__lng__.json'};
  i18n.init(localizerOption);

  $('#add-element-pls-form').on('submit', submitAddElem);
  $('#edit-element-pls-form').on('submit', submitEditElem);
  $('#delete-element-pls-form').on('submit', submitDeleteElem);


   /** Init popups */
  $(
    '#popup-add-element-pls',
    '#popup-edit-element-pls',
    '#popup-delete-element-pls'
  ).popup({
    type: 'overlay',
    autoopen: false,
    scrolllock: true,
    transition: 'all 0.3s',
  });


  // btns


  $('.btn-add-element').click(function (e) {
    e.preventDefault();
    $(
      '#popup-add-element-pls input:not([type="submit"]):not([type="hidden"]):not([type="button"])'
    ).val('');
    $('#popup-add-element-pls select[name="color_dependence"]').val('0');
    $('#popup-add-element-pls #pls-currency').find('option').remove();
  

    $.get('/base/shields/grids/elements/getCurrencies',  {
      
      }, function(data) {
        if (data.status) {
          data.currencies.sort((a, b) => a.id - b.id);
          for (var i = 0, len = data.currencies.length; i < len; i++) {
            const currency = data.currencies[i];
            $('#popup-add-element-pls #pls-currency').append(
              '<option value="' + currency.id + '">' + currency.name + '</option>'
            );
          }
        }

        setTimeout(function(){
          $('#popup-add-element-pls').popup('show');
        },200)
    })
  });

  $('.btn-edit-item').click(function (e) {
    e.preventDefault();
    const elementId = $(this).data('element');
    
    // Load currencies first
    $.get('/base/shields/grids/elements/getCurrencies', {}, function(currencyData) {
      if (currencyData.status) {
        $('#popup-edit-element-pls #pls-currency').find('option').remove();
        currencyData.currencies.sort((a, b) => a.id - b.id);
        for (var i = 0, len = currencyData.currencies.length; i < len; i++) {
          const currency = currencyData.currencies[i];
          $('#popup-edit-element-pls #pls-currency').append(
            '<option value="' + currency.id + '">' + currency.name + '</option>'
          );
        }
      }
      
      // Then load element data
      $.get('/base/shields/grids/elements/getElement/' + elementId, function(data) {
        if (data.status) {
          const element = data.element;
          $('#popup-edit-element-pls input[name="element_id"]').val(element.id);
          
          $('#popup-edit-element-pls input[name="name"]').val(element.name);
          $('#popup-edit-element-pls input[name="sku"]').val(element.sku);
          $('#popup-edit-element-pls #pls-currency').val(element.currency_id);
          $('#popup-edit-element-pls input[name="price"]').val(element.price);
          $('#popup-edit-element-pls select[name="unit_type_id"]').val(element.unit_type_id);
          $('#popup-edit-element-pls select[name="color_dependence"]').val(element.color_dependence);
          $('#popup-edit-element-pls input[name="waste"]').val(element.waste);
          $('#popup-edit-element-pls input[name="amendment_pruning"]').val(element.amendment_pruning);
          $('#popup-edit-element-pls input[name="weight"]').val(element.weight);

          setTimeout(function(){
            $('#popup-edit-element-pls').popup('show');
          },200)
        }
      });
    });
  });

  $('.btn-delete-item').click(function(e) {
    e.preventDefault();
    const elementId = $(this).data('element');
    $('#popup-delete-element-pls input[name="element_id"]').val(elementId);
    $('#popup-delete-element-pls').popup('show');
  })


  // Submit forms

  function submitAddElem(e) {
    e.preventDefault();

    var formData = new FormData(this);
    var formAction = $(this).attr('action');

    submitForm({ action: formAction, data: formData }, onResponse);

    function onResponse (data) {
      stopLoader();
      if (data.status) {
        $('.pop-up').popup('hide');
        console.log('ADD new element');
        setTimeout(function() {
          $('.pop-up').popup('hide');
          window.location.reload();
        }, 300);
      } else {
        console.log('error');
      }
    }
  }

  function submitEditElem(e) {
    e.preventDefault();

    var formData = new FormData(this);
    var formAction = $(this).attr('action');

    submitForm({ action: formAction, data: formData }, onResponse);

    function onResponse (data) {
      stopLoader();
      if (data.status) {
        $('.pop-up').popup('hide');
        console.log('Edit element');
        setTimeout(function() {
          $('.pop-up').popup('hide');
          window.location.reload();
        }, 300);
      } else {
        console.log('error');
      }
    }
  }

  function submitDeleteElem(e) {
    e.preventDefault();

    var formData = new FormData(this);
    var formAction = $(this).attr('action');

    submitForm({ action: formAction, data: formData }, onResponse);

    function onResponse (data) {
      stopLoader();
      if (data.status) {
        $('.pop-up').popup('hide');
        console.log('Delete element');
        setTimeout(function() {
          $('.pop-up').popup('hide');
          window.location.reload();
        }, 300);
      } else {
        console.log('error');
      }
    }
  }
});
