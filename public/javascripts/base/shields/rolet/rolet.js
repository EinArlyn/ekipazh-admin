$(function () {
  var localizerOption = { resGetPath: '/assets/javascripts/vendor/localizer/__ns__-__lng__.json'};
  i18n.init(localizerOption);

   const typeSizes = [
    {
      id: 1,
      name: 'A'
    },
    {
      id: 2,
      name: 'B'
    },
    {
      id: 3,
      name: 'C'
    }
  ]
  
  $('#add-group-rolet-form').on('submit', submitAddNewGroupSystem);
  $('#add-system-rolet-form').on('submit', submitAddNewSystem);
  $('#edit-group-rolet-form').on('submit', submitEditGroup);
  $('#edit-system-rolet-form').on('submit', submitEditSystem);
  $('#delete-group-rolet-form').on('submit', submitDeleteGroupSystem);
  $('#delete-system-rolet-form').on('submit', submitDeleteSystem);

  $('#add-group-rolet-form input.add-image-btn').click(addImgGroup);
  $('#edit-group-rolet-form input.add-image-btn').click(editImgGroup);
  $('#add-system-rolet-form input.add-image-btn').click(addImgSystem);
  $('#edit-system-rolet-form input.add-image-btn').click(editImgSystem);


  /** Init popups */
  $(
    '#popup-add-group-rolet',
    '#popup-edit-group-rolet',
    '#popup-delete-group-rolet',
    '#popup-add-system-rolet',
    '#popup-edit-system-rolet',
    '#popup-delete-system-rolet',
  ).popup({
    type: 'overlay',
    autoopen: false,
    scrolllock: true,
    transition: 'all 0.3s'
  });

  // btns 
    // groups
  $('.btn-delete-group').click(function(e) {
    e.preventDefault();
    const groupId = $(this).data('group');
    $('#popup-delete-group-rolet .empty-text').remove();
    $('#popup-delete-group-rolet input[name="group_id"]').val(groupId);
    $('#popup-delete-group-rolet').popup('show');
  })

  $('.btn-edit-group').click(function(e) {
    e.preventDefault();
    const groupId = $(this).data('group');
    $.get('/base/shields/rolet/rolet/group/getGroup/' + groupId, function(data) {
      $('#popup-edit-group-rolet input[name="name"]').val(data.group.name);
      $('#popup-edit-group-rolet input[name="position"]').val(data.group.position);
      $('#popup-edit-group-rolet textarea[name="description"]').val(data.group.description);
      $('#popup-edit-group-rolet input[name="group_id"]').val(groupId);
      $('#popup-edit-group-rolet img.rolet-image').attr('src', data.group.img);
      $('#popup-edit-group-rolet input[type="checkbox"]').val('');
      $('#popup-edit-group-rolet input[type="checkbox"]').prop('checked', false);
      
      $('#popup-edit-group-rolet input[type="checkbox"]').each(function(){
        const country_id = $(this).data('countryId');
        const checkCountry = data.country_ids.includes(country_id);
        if (checkCountry) {
          $(this).val(1);
          $(this).prop('checked', true);
        }
      });

      $('#popup-edit-group-rolet #rolet-currency').find('option').remove();
      $('#popup-edit-group-rolet .for-type-checkboses').empty();

      const types = JSON.parse(data.group.for_type) || []; // ["1","2"]
      
      for (var t = 0, len = typeSizes.length; t < len; t++) {
        const idValue = String(typeSizes[t].id);
        const id = 'for-type-checkbox-' + idValue;
        const checked = types.includes(idValue) ? 'checked' : '';

        $('#popup-edit-group-rolet .for-type-checkboses').append(
          '<div class="checkbox-item">' +
            '<input type="checkbox" ' +
              'id="' + id + '" ' +
              'data-country-id="' + idValue + '" ' +
              'name="checkForType" ' +
              'value="' + idValue + '" ' +
              checked + '>' +
            '<label for="' + id + '">' + typeSizes[t].name + '</label>' +
          '</div>'
        );
      }

        $.get('/base/shields/rolet/rolet/group/getCurrencies',  {
          
          }, function(dataCurrency) {
            if (dataCurrency.status) {
              for (var i = 0, len = dataCurrency.currencies.length; i < len; i++) {
                const currency = dataCurrency.currencies[i];
                const selected = dataCurrency.currencies[i].id == data.group.currency_id ? ' selected' : '';
                $('#popup-edit-group-rolet #rolet-currency').append(
                  '<option value="' + currency.id + '"' + selected + '>' + currency.name + '</option>'
                );
              }
            }

            setTimeout(function(){
              $('#popup-edit-group-rolet').popup('show');
            },200)
        })
      
      })
  })
  
  $('.btn-add-group').click(function(e) {
    e.preventDefault();
    $('#popup-add-group-rolet input.input-default').val('');

    $('#popup-add-group-rolet #rolet-currency').find('option').remove();
    $('#popup-add-group-rolet .for-type-checkboses').empty();

    for (var t = 0, len = typeSizes.length; t < len; t++) {
      const id = 'for-type-checkbox-' + typeSizes[t].id;

      $('#popup-add-group-rolet .for-type-checkboses').append(
        '<div class="checkbox-item">' +
          '<input type="checkbox" ' +
            'id="' + id + '" ' +
            'data-country-id="' + typeSizes[t].id + '" ' +
            'name="checkForType" ' +
            'value="' + typeSizes[t].id + '">' +
          '<label for="' + id + '">' + typeSizes[t].name + '</label>' +
        '</div>'
      );
    }

    $.get('/base/shields/rolet/rolet/group/getCurrencies',  {
      
      }, function(data) {
        if (data.status) {
          for (var i = 0, len = data.currencies.length; i < len; i++) {
            const currency = data.currencies[i];
            $('#popup-add-group-rolet #rolet-currency').append(
              '<option value="' + currency.id + '">' + currency.name + '</option>'
            );
          }
        }

        setTimeout(function(){
          $('#popup-add-group-rolet').popup('show');
        },200)
    })
  })
    // systems
  $('.btn-add-system').click(function(e) {
    e.preventDefault();
    const groupId = $(this).data('group')
    $('#popup-add-system-rolet input:not([type="submit"]):not([type="button"])').val('')
    $('#popup-add-system-rolet input[type="checkbox"]').prop('checked', false);
    $('#popup-add-system-rolet input[type="hidden"]').val(groupId);

    $('#popup-add-system-rolet .field-height-width').remove();
    const countRowsSizes = 6;
    for (let i = 0; i < countRowsSizes; i++) {
        $('#popup-add-system-rolet .height-width-box').append(
          `<div class="field-height-width">
            <input class="input-default height-box" type="number" name="height" value="">
            <input class="input-default width-box" type="number" name="width" value="">
            <input class="input-default box-price" type="number" name="box_price" value="" step="0.01">
          </div>`
        )
    }
    initSizes();
    $('#popup-add-system-rolet').popup('show');
  })

  $('.btn-edit-system').click(function(e) {
    e.preventDefault();
    const systemId = $(this).data('system');
    $('#popup-edit-system-rolet input:not([type="submit"]):not([type="hidden"]):not([type="button"])').val('');
    $('#popup-edit-system-rolet .field-height-width').remove();
    $('#popup-edit-system-rolet input[name="system_id"]').val(systemId);
    if (systemId) {
      $.get('/base/shields/rolet/rolet/system/getSystem/' + systemId, {
      }, function(system) {
        $('#popup-edit-system-rolet input[name="name"]').val(system.box.name)
        $('#popup-edit-system-rolet input[name="position"]').val(system.box.position)
        $('#popup-edit-system-rolet textarea[name="description"]').val(system.box.description)
        $('#popup-edit-system-rolet img.rolet-image').attr('src', system.box.img);
        if (system.box.is_color) {
          $('#popup-edit-system-rolet input[name="is_color"]').prop('checked', true);
        } else {
          $('#popup-edit-system-rolet input[name="is_color"]').prop('checked', false);
        }
        if (system.box.is_grid) {
          $('#popup-edit-system-rolet input[name="is_grid"]').prop('checked', true);
        } else {
          $('#popup-edit-system-rolet input[name="is_grid"]').prop('checked', false);
        }
        if (system.box.is_security) {
          $('#popup-edit-system-rolet input[name="is_security"]').prop('checked', true);
        } else {
          $('#popup-edit-system-rolet input[name="is_security"]').prop('checked', false);
        }
        if (system.box.is_revision) {
          $('#popup-edit-system-rolet input[name="is_revision"]').prop('checked', true);
        } else {
          $('#popup-edit-system-rolet input[name="is_revision"]').prop('checked', false);
        }
        if (system.box.is_engine) {
          $('#popup-edit-system-rolet input[name="is_engine"]').prop('checked', true);
        } else {
          $('#popup-edit-system-rolet input[name="is_engine"]').prop('checked', false);
        }
        if (system.box.is_split) {
          $('#popup-edit-system-rolet input[name="is_split"]').val(system.box.is_split);
        } else {
          $('#popup-edit-system-rolet input[name="is_split"]').val(1);
        }
        if (system.box.split_price) {
          $('#popup-edit-system-rolet input[name="split_price"]').val(system.box.split_price);
        } else {
          $('#popup-edit-system-rolet input[name="split_price"]').val(0);
        }
        if (system.box.min_width) {
          $('#popup-edit-system-rolet input[name="min_width"]').val(system.box.min_width);
        } else {
          $('#popup-edit-system-rolet input[name="min_width"]').val(0);
        }
        if (system.box.min_square_price) {
          $('#popup-edit-system-rolet input[name="min_square_price"]').val(system.box.min_square_price);
        } else {
          $('#popup-edit-system-rolet input[name="min_square_price"]').val(0);
        }

        $('#popup-edit-system-rolet input[name="is_color"]').val(system.box.is_color)
        $('#popup-edit-system-rolet input[name="is_grid"]').val(system.box.is_grid)
        $('#popup-edit-system-rolet input[name="is_security"]').val(system.box.is_security)
        $('#popup-edit-system-rolet input[name="is_revision"]').val(system.box.is_revision)
        $('#popup-edit-system-rolet input[name="is_engine"]').val(system.box.is_engine)

        const countRowsSizes = 6;
        for (let i = 0; i < countRowsSizes; i++) {
            $('#popup-edit-system-rolet .height-width-box').append(
              `<div class="field-height-width" data-size-id=${system.sizes[i] ? system.sizes[i].id : ''}>
                <input class="input-default height-box" type="number" name="height" value=${system.sizes[i] ? system.sizes[i].height : ''}>
                <input class="input-default width-box" type="number" name="width" value=${system.sizes[i] ? system.sizes[i].width : ''}>
                <input class="input-default box-price" type="number" name="box_price" value=${system.sizes[i] ? (system.sizes[i].box_price || 0) : ''} step="0.01">
              </div>`
            )
        }
        initSizes();


        $('#popup-edit-system-rolet #rolet-group').find('option').remove();
        $.get('/base/shields/rolet/rolet/group/getGroups',  {
          
        }, function(data) {
          if (data.status) {
            for (var i = 0, len = data.groups.length; i < len; i++) {
              const group = data.groups[i];
              const selected = group.id == system.box.rol_group_id ? ' selected' : '';
              
              $('#popup-edit-system-rolet #rolet-group').append(
                '<option value="' + group.id + '"' + selected + '>' + group.name + '</option>'
              );
            }
          }

          setTimeout(function(){
            $('#popup-edit-system-rolet').popup('show');
          },200)
        })
      })
    }
  })

  $('.btn-delete-system').click(function(e) {
    e.preventDefault();
    const systemId = $(this).data('system');
    $('#popup-delete-system-rolet input[name="system_id"]').val(systemId);
    $('#popup-delete-system-rolet').popup('show');
  })

  $('.btn-active').click(function(e) {
    e.preventDefault();
    $(this).toggleClass('btn-unactive');
    const groupId = $(this).data('group');
    const systemId = $(this).data('system');
    
    if (groupId) {
      $.post('/base/shields/rolet/rolet/group/active/' + groupId, {
        
      }, function(data) {        
      
      });
    }
    if (systemId) {
      $.post('/base/shields/rolet/rolet/system/active/' + systemId, {

      },function (data) {

      })
    }
  })

  // checkboxes 

  $('input[type="checkbox"]').change(function() {
    const isChecked = $(this).is(':checked');
    if (isChecked) {
      $(this).val('1');
    } else {
      $(this).val('0');
    }
  })

  function initSizes(){
    $('#popup-add-system-rolet input.height-box, #popup-edit-system-rolet input.height-box').on('change', function () {
      const currentHeight = $(this).val();
      const nextWidth = $(this).nextAll('input.width-box').first();
      if (!nextWidth.val()) {
        nextWidth.val(currentHeight);
      }
    })
  }

  function submitAddNewGroupSystem(e) {
    e.preventDefault();

    const country_list = [];
    const types = [];
    var formData = new FormData(this);
    var formAction = $(this).attr('action');

    $('#popup-add-group-rolet input[name="checkForType"]:checked').each(function () {
      types.push($(this).val());
    });

    $('#popup-add-group-rolet input[name="checkGroup"]').each(function(){
      const is_check = $(this).val();
      const country_id = $(this).data('countryId');
      if (is_check) {
        const resObj = {
          is_check: is_check,
          country_id: country_id
        };
        country_list.push(resObj);
      }
    })

    formData.append('country_list', JSON.stringify(country_list));
    formData.append('types', JSON.stringify(types));
    submitForm({ action: formAction, data: formData }, onResponse);

    function onResponse (data) {
      stopLoader();
      if (data.status) {
        $('.pop-up').popup('hide');
        console.log('success');
        setTimeout(function() {
          $('.pop-up').popup('hide');
          window.location.reload();
        }, 300);
      } else {
        console.log('error');
      }
    }
  }
  function submitDeleteGroupSystem(e) {
    e.preventDefault();

    var formData = new FormData(this);
    var formAction = $(this).attr('action');

    submitForm({ action: formAction, data: formData }, onResponse);

    function onResponse (data) {
      stopLoader();
      if (data.status) {
        $('.pop-up').popup('hide');
        console.log('Delete');
        setTimeout(function() {
          $('.pop-up').popup('hide');
          window.location.reload();
        }, 300);
      } else {
        $('#popup-delete-group-rolet .pop-up-header').append('<div class="empty-text">Group is not empty</div>')
        console.log('error');
      }
    }
  }
  function submitAddNewSystem(e) {
    e.preventDefault();

    const size_list = [];
    $('#popup-add-system-rolet .field-height-width').each(function () {
      const height = $(this).find('input[name="height"]').val();
      const width = $(this).find('input[name="width"]').val();
      const box_price = $(this).find('input[name="box_price"]').val();

      const sizeObj = {};
      if (height && width) {
        sizeObj.height = height;
        sizeObj.width = width;
        sizeObj.box_price = box_price || 0;
        size_list.push(sizeObj);
      }
    });
    var formData = new FormData(this);
    var formAction = $(this).attr('action');

    formData.append('size_list', JSON.stringify(size_list));
    submitForm({ action: formAction, data: formData }, onResponse);

    function onResponse (data) {
      stopLoader();
      if (data.status) {
        $('.pop-up').popup('hide');
        console.log('addSystem');
        setTimeout(function() {
          $('.pop-up').popup('hide');
          window.location.reload();
        }, 300);
      } else {
        console.log('error');
      }
    }
  }
  function submitEditGroup(e) {
    e.preventDefault();

    const country_list = [];
    const types = [];

    var formData = new FormData(this);
    var formAction = $(this).attr('action');

    $('#popup-edit-group-rolet input[name="checkForType"]:checked').each(function () {
      types.push($(this).val());
    });

    $('#popup-edit-group-rolet input[name="checkGroup"]').each(function(){
      const is_check = $(this).val();
      const country_id = $(this).data('countryId');
      if (is_check > 0) {
        const resObj = {
          is_check: is_check,
          country_id: country_id
        };
        country_list.push(resObj);
      }
    })

    formData.append('country_list', JSON.stringify(country_list));
    formData.append('types', JSON.stringify(types));

    submitForm({ action: formAction, data: formData }, onResponse);

    function onResponse (data) {
      stopLoader();
      if (data.status) {
        $('.pop-up').popup('hide');
        console.log('editGroup');
        setTimeout(function() {
          $('.pop-up').popup('hide');
          window.location.reload();
        }, 300);
      } else {
        console.log('error');
      }
    }
  }

  function submitEditSystem(e) {
    e.preventDefault();

    var formData = new FormData(this);
    var formAction = $(this).attr('action');

    const size_list = [];
    $('#popup-edit-system-rolet .field-height-width').each(function () {
  
      const id = $(this).data('size-id');
      const height = $(this).find('input[name="height"]').val();
      const width = $(this).find('input[name="width"]').val();
      const box_price = $(this).find('input[name="box_price"]').val();
      const sizeObj = {};
      if (height && width) {
        sizeObj.id = id || 0;
        sizeObj.height = height;
        sizeObj.width = width;
        sizeObj.box_price = box_price;
        size_list.push(sizeObj);
      }
    });
    
    formData.append('size_list', JSON.stringify(size_list));  
    submitForm({ action: formAction, data: formData }, onResponse);

    function onResponse (data) {
      stopLoader();
      if (data.status) {
        $('.pop-up').popup('hide');
        console.log('editSystem');
        setTimeout(function() {
          $('.pop-up').popup('hide');
          window.location.reload();
        }, 300);
      } else {
        console.log('error');
      }
    }
  }
  function submitDeleteSystem(e) {
    e.preventDefault();

    var formData = new FormData(this);
    var formAction = $(this).attr('action');

    submitForm({ action: formAction, data: formData }, onResponse);

    function onResponse (data) {
      stopLoader();
      if (data.status) {
        $('.pop-up').popup('hide');
        console.log('deleteSystem');
        setTimeout(function() {
          $('.pop-up').popup('hide');
          window.location.reload();
        }, 300);
      } else {
        console.log('error');
      }
    }
  }


  function addImgGroup (e) {
    selectImageRolet('#popup-add-group-rolet');
  }
  function editImgGroup (e) {
    selectImageRolet('#popup-edit-group-rolet');
  }
  function addImgSystem (e) {
    selectImageRolet('#popup-add-system-rolet');
  }
  function editImgSystem (e) {
    selectImageRolet('#popup-edit-system-rolet');
  }
  function selectImageRolet (popup) {
    $(popup + ' input.rolet-image-file').trigger('click');
  }

  
});
