$(function () {
  var localizerOption = {
    resGetPath: '/assets/javascripts/vendor/localizer/__ns__-__lng__.json',
  };
  i18n.init(localizerOption);

  const rulesData = [
    { id: 1, name: 'меньше род на %' },
    { id: 2, name: 'больше род на %' },
    { id: 3, name: 'меньше род на мм' },
    { id: 4, name: 'больше род на мм' },
    { id: 5, name: 'род меньше на %' },
    { id: 6, name: 'род больше на %' },
    { id: 7, name: 'род меньше на мм' },
    { id: 8, name: 'род больше на мм' },
    { id: 9, name: 'шт на родителя' },
    { id: 10, name: '1шт каждые мм' },
  ];

  $('#add-grid-pls-form').on('submit', submitAddGrid);
  $('#edit-grid-pls-form').on('submit', submitEditGrid);
  $('#delete-grid-pls-form').on('submit', submitDeleteGrid);
  $('#add-link-element-pls-form').on('submit', submitAddLinkElement);
  $('#edit-link-element-pls-form').on('submit', submitEditLinkElement);
  $('#delete-link-element-pls-form').on('submit', submitDeleteLinkElement);

  $('#popup-add-grid-pls input.add-image-btn').click(addImgGrid);
  $('#popup-edit-grid-pls input.add-image-btn').click(editImgGrid);

  /** Init popups */
  $(
    '#popup-add-grid-pls',
    '#popup-edit-grid-pls',
    '#popup-delete-grid-pls',
    '#popup-add-link-element-pls',
    '#popup-edit-link-element-pls',
    '#popup-delete-link-element-pls',
  ).popup({
    type: 'overlay',
    autoopen: false,
    scrolllock: true,
    transition: 'all 0.3s',
  });

  $('.btn-show-more').on('click', function () {
    var gridId = $(this).data('grid');
    var $target = $('.grid-elements[data-grid="' + gridId + '"]');
    var isVisible = $target.is(':visible');

    $('.grid-elements:visible').not($target).slideUp(150);

    if (isVisible) {
      $target.slideUp(150);
      return;
    }

    $target.slideDown(150);
  });

  $('.btn-add-grid').on('click', function (e) {
    e.preventDefault();

    $(
      '#popup-add-grid-pls input:not([type="submit"]):not([type="hidden"]):not([type="button"])'
    ).val('');
    $('#popup-add-grid-pls #pls-currency').find('option').remove();

    $.get('/base/shields/grids/grids/getCurrencies',  {

      }, function(data) {
        if (data.status) {
          data.currencies.sort((a, b) => a.id - b.id);
          for (var i = 0, len = data.currencies.length; i < len; i++) {
            const currency = data.currencies[i];
            $('#popup-add-grid-pls #pls-currency').append(
              '<option value="' + currency.id + '">' + currency.name + '</option>'
            );
          }
        }

        setTimeout(function(){
          $('#popup-add-grid-pls').popup('show');
        },200)
    })
  });

  $('.add-element-to-grid').on('click', function (e) {
    e.preventDefault();

    const gridId = $(this).data('grid');
    $('#popup-add-link-element-pls input[name="parent_id"]').val(gridId);

    $.get('/base/shields/grids/grids/getElements', {}, function(data) {
      if (data.status) {
        const $select = $('#popup-add-link-element-pls select.select-elements');
        const $selectRules = $('#popup-add-link-element-pls select.select-rules');

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

        setTimeout(function(){
          $('#popup-add-link-element-pls').popup('show');
        },200)
      }
    });
  });

  $('.btn-edit-item').on('click', onEditItemClick);

  function onEditItemClick(e) {
    e.preventDefault();

    const gridId = $(this).data('grid');
    const elementId = $(this).data('element');

    if (gridId && elementId) {
      openEditLinkedElement(gridId, elementId);
      return;
    }

    if (gridId) {
      openEditGrid(gridId);
    }
  }

  function openEditGrid(gridId) {
    $.get('/base/shields/grids/grids/getCurrencies', {}, function(currencyData) {
      if (currencyData.status) {
        $('#popup-edit-grid-pls #pls-currency').find('option').remove();
        currencyData.currencies.sort((a, b) => a.id - b.id);
        for (var i = 0, len = currencyData.currencies.length; i < len; i++) {
          const currency = currencyData.currencies[i];
          $('#popup-edit-grid-pls #pls-currency').append(
            '<option value="' + currency.id + '">' + currency.name + '</option>'
          );
        }
      }

      $.get('/base/shields/grids/grids/getGrid/' + gridId, function(data) {
        if (data.status) {
          const grid = data.grid;
          $('#popup-edit-grid-pls input[name="grid_id"]').val(grid.id);

          $('#popup-edit-grid-pls input[name="name"]').val(grid.name);
          $('#popup-edit-grid-pls input[name="sku"]').val(grid.sku);
          $('#popup-edit-grid-pls #pls-currency').val(grid.currency_id);
          $('#popup-edit-grid-pls input[name="price"]').val(grid.price);
          $('#popup-edit-grid-pls input[name="edit_size_w"]').val(grid.edit_size_w);
          $('#popup-edit-grid-pls input[name="edit_size_h"]').val(grid.edit_size_h);
          $('#popup-edit-grid-pls input[name="size_wave"]').val(grid.size_wave);
          $('#popup-edit-grid-pls input[name="weight"]').val(grid.weight);
          $('#popup-edit-grid-pls img.pls-image').attr('src', grid.img);
          $('#popup-edit-grid-pls textarea[name="description"]').val(grid.description);

          setTimeout(function(){
            $('#popup-edit-grid-pls').popup('show');
          },200);
        }
      });
    });
  }

  function openEditLinkedElement(profileId, elementId) {
    $.get('/base/shields/grids/grids/getLinkElements/' + profileId + '/' + elementId, function(data) {
      if (data.status && data.linkElement) {
        const linkElement = data.linkElement;
        $('#popup-edit-link-element-pls input[name="link_id"]').val(linkElement.id);
        $('#popup-edit-link-element-pls input[name="rules_value"]').val(linkElement.rules_value);

        $.get('/base/shields/grids/grids/getElements', {}, function(data) {
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

    const gridId = $(this).data('grid');
    const elementId = $(this).data('element');

    if (gridId && elementId) {
      openDeleteLinkedElement(gridId, elementId);
      return;
    }

    if (gridId) {
      openDeleteGrid(gridId);
    }
  }

  function openDeleteGrid(gridId) {
    $('#popup-delete-grid-pls input[name="grid_id"]').val(gridId);
    $('#popup-delete-grid-pls').popup('show');
  }

  function openDeleteLinkedElement(gridId, elementId) {
    $.get('/base/shields/grids/grids/getLinkElements/' + gridId + '/' + elementId, function(data) {
      if (data.status && data.linkElement) {
        $('#popup-delete-link-element-pls input[name="link_id"]').val(data.linkElement.id);
        $('#popup-delete-link-element-pls').popup('show');
      }
    });
  }

  // Submit forms

  function submitAddGrid(e) {
    e.preventDefault();

    var formData = new FormData(this);
    var formAction = $(this).attr('action');

    submitForm({ action: formAction, data: formData }, onResponse);

    function onResponse(data) {
      stopLoader();
      if (data.status) {
        $('.pop-up').popup('hide');
        console.log('ADD new grid');
        setTimeout(function () {
          $('.pop-up').popup('hide');
          window.location.reload();
        }, 300);
      } else {
        console.log('error');
      }
    }
  }

  function submitEditGrid(e) {
    e.preventDefault();

    var formData = new FormData(this);
    var formAction = $(this).attr('action');

    submitForm({ action: formAction, data: formData }, onResponse);

    function onResponse(data) {
      stopLoader();
      if (data.status) {
        $('.pop-up').popup('hide');
        console.log('Edit grid');
        setTimeout(function () {
          $('.pop-up').popup('hide');
          window.location.reload();
        }, 300);
      } else {
        console.log('error');
      }
    }
  }

  function submitDeleteGrid(e) {
    e.preventDefault();

    var formData = new FormData(this);
    var formAction = $(this).attr('action');

    submitForm({ action: formAction, data: formData }, onResponse);

    function onResponse(data) {
      stopLoader();
      if (data.status) {
        $('.pop-up').popup('hide');
        console.log('Delete grid');
        setTimeout(function () {
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
    var parentTypeId = 2;

    formData.set('parent_type_id', parentTypeId);

    submitForm({ action: formAction, data: formData }, onResponse);

    function onResponse(data) {
      stopLoader();
      if (data.status) {
        $('.pop-up').popup('hide');
        console.log('ADD new link element');
        setTimeout(function () {
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

    function onResponse(data) {
      stopLoader();
      if (data.status) {
        $('.pop-up').popup('hide');
        console.log('Edit link element');
        setTimeout(function () {
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

    function onResponse(data) {
      stopLoader();
      if (data.status) {
        $('.pop-up').popup('hide');
        console.log('Delete link element');
        setTimeout(function () {
          $('.pop-up').popup('hide');
          window.location.reload();
        }, 300);
      } else {
        console.log('error');
      }
    }
  }


  function addImgGrid (e) {
    selectImageGrid('#popup-add-grid-pls');
  }
  function editImgGrid (e) {
    selectImageGrid('#popup-edit-grid-pls');
  }
  
  function selectImageGrid (popup) {
    $(popup + ' input.pls-image-file').trigger('click');
  }
});
