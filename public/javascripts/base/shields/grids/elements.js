$(function () {
  var localizerOption = { resGetPath: '/assets/javascripts/vendor/localizer/__ns__-__lng__.json'};
  i18n.init(localizerOption);

  const rulesData = [
    { id: 1, name: 'меньше род на %' },
    { id: 2, name: 'больше род на %' },
    { id: 3, name: 'меньше род на мм'},
    { id: 4, name: 'больше род на мм',},
    // { id: 5, name: 'род меньше на %',},
    // { id: 6, name: 'род больше на %',},
    // { id: 7, name: 'род меньше на мм',},
    // { id: 8, name: 'род больше на мм',},
    { id: 9, name: 'шт на родителя',},
    { id: 10, name: '1шт каждые мм',},
  ]

  $('#add-element-pls-form').on('submit', submitAddElem);
  $('#edit-element-pls-form').on('submit', submitEditElem);
  $('#delete-element-pls-form').on('submit', submitDeleteElem);
  $('#add-link-element-pls-form').on('submit', submitAddLinkElement);
  $('#edit-link-element-pls-form').on('submit', submitEditLinkElement);
  $('#delete-link-element-pls-form').on('submit', submitDeleteLinkElement);


   /** Init popups */
  $(
    '#popup-add-element-pls',
    '#popup-edit-element-pls',
    '#popup-delete-element-pls',
    '#popup-add-link-element-pls',
    '#popup-edit-link-element-pls',
    '#popup-delete-link-element-pls'
  ).popup({
    type: 'overlay',
    autoopen: false,
    scrolllock: true,
    transition: 'all 0.3s',
  });


  // btns

  $('.btn-show-more').on('click', function () {
    var elementId = $(this).data('element');
    var $target = $('.elements-elements[data-element="' + elementId + '"]');
    var isVisible = $target.is(':visible');

    $('.elements-elements:visible').not($target).slideUp(150);

    if (isVisible) {
      $target.slideUp(150);
      return;
    }

    $target.slideDown(150);
  });


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

  $('.add-element-to-element').on('click', function (e) {
    e.preventDefault();

    const elementId = $(this).data('element');
    $('#popup-add-link-element-pls input[name="parent_id"]').val(elementId);

    $.get('/base/shields/grids/elements/getElements', {}, function(data) {
      if (data.status) {
        const $select = $('#popup-add-link-element-pls select.select-elements');
        const $selectRules = $('#popup-add-link-element-pls select.select-rules');
        
        $select.find('option').remove();
        $selectRules.find('option').remove();
        
        for (var i = 0, len = data.elements.length; i < len; i++) {
          const element = data.elements[i];

          if (String(element.id) === String(elementId)) {
            continue;
          }

          $select.append(
            '<option value="' + element.id + '">' + element.name + ' / ' + element.sku + '</option>'
          );
        }

        for (var j = 0, len = rulesData.length; j < len; j++) {
          const rule = rulesData[j];
          $selectRules.append(
            '<option value="' + rule.id + '">' + rule.name + '</option>'
          );
        }
        
        setTimeout(function(){
          $('#popup-add-link-element-pls').popup('show');
        },200)
      }
    });
  });

  $('.btn-edit-item').on('click', onEditItemClick);

  function onEditItemClick(e) {
    e.preventDefault();

    const elementId = $(this).data('element');
    const subElementId = $(this).data('sub-element');

    if (elementId && subElementId) {
      openEditLinkedElement(elementId, subElementId);
      return;
    }

    if (elementId) {
      openEditElement(elementId);
    }
  }

  function openEditElement(elementId) {
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
  }

  function openEditLinkedElement(elementId, subElementId) {
    $.get('/base/shields/grids/elements/getLinkElements/' + elementId + '/' + subElementId, function(data) {
      if (data.status && data.linkElement) {
        const linkElement = data.linkElement;
        $('#popup-edit-link-element-pls input[name="link_id"]').val(linkElement.id);
        $('#popup-edit-link-element-pls input[name="rules_value"]').val(linkElement.rules_value);

        $.get('/base/shields/grids/elements/getElements', {}, function(data) {
          if (data.status) {
            const $select = $('#popup-edit-link-element-pls select[name="element_id"]');
            const $selectRules = $('#popup-edit-link-element-pls select[name="rules_id"]');
            
            $select.find('option').remove();
            $selectRules.find('option').remove();
            
            for (var i = 0, len = data.elements.length; i < len; i++) {
              const element = data.elements[i];
              $select.append(
                '<option value="' + element.id + '">' + element.name + ' / ' + element.sku + '</option>'
              );
            }

            for (var j = 0, len = rulesData.length; j < len; j++) {
              const rule = rulesData[j];
              $selectRules.append(
                '<option value="' + rule.id + '">' + rule.name + '</option>'
              );
            }

            $select.val(String(linkElement.element_id));
            $selectRules.val(String(linkElement.rules_id));
            
            setTimeout(function(){
              $('#popup-edit-link-element-pls').popup('show');
            },200)
          }
        });
      }
    });
  }

  $('.btn-delete-item').on('click', onDeleteItemClick);

  function onDeleteItemClick(e) {
    e.preventDefault();

    const subElementId = $(this).data('sub-element');
    const elementId = $(this).data('element');

    if (elementId && subElementId) {
      openDeleteLinkedElement(elementId, subElementId);
      return;
    }

    if (elementId) {
      openDeleteElement(elementId);
    }
  }

  function openDeleteElement(elementId) {
    $('#popup-delete-element-pls input[name="element_id"]').val(elementId);
    $('#popup-delete-element-pls').popup('show');
  }

  function openDeleteLinkedElement(elementId, subElementId) {
    $.get('/base/shields/grids/elements/getLinkElements/' + elementId + '/' + subElementId, function(data) {
      if (data.status && data.linkElement) {
        $('#popup-delete-link-element-pls input[name="link_id"]').val(data.linkElement.id);
        $('#popup-delete-link-element-pls').popup('show');
      }
    });
  }


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

  function submitAddLinkElement(e) {
    e.preventDefault();

    var formData = new FormData(this);
    var formAction = $(this).attr('action');
    var parentTypeId = 3;

    formData.set('parent_type_id', parentTypeId);

    submitForm({ action: formAction, data: formData }, onResponse);

    function onResponse (data) {
      stopLoader();
      if (data.status) {
        $('.pop-up').popup('hide');
        console.log('ADD new link element');
        setTimeout(function() {
          $('.pop-up').popup('hide');
          window.location.reload();
        }, 300);
      } else {
        console.log('error');
      }
    }
  }

  function submitEditLinkElement(e) {
    e.preventDefault();

    var formData = new FormData(this);
    var formAction = $(this).attr('action');

    submitForm({ action: formAction, data: formData }, onResponse);

    function onResponse (data) {
      stopLoader();
      if (data.status) {
        $('.pop-up').popup('hide');
        console.log('Edit link element');
        setTimeout(function() {
          $('.pop-up').popup('hide');
          window.location.reload();
        }, 300);
      } else {
        console.log('error');
      }
    }
  }

  function submitDeleteLinkElement(e) {
    e.preventDefault();

    var formData = new FormData(this);
    var formAction = $(this).attr('action');

    submitForm({ action: formAction, data: formData }, onResponse);

    function onResponse (data) {
      stopLoader();
      if (data.status) {
        $('.pop-up').popup('hide');
        console.log('Delete link element');
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
