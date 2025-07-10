$(function () {
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
    } else if (selectedOption == 19) {
      $('.checked-option').addClass('disabled');
      window.location.href = '/base/options/reinforcement';
    }
  });
  // work with color for window sill
  // 
  $('.color-add').click(addNewColor);
  $('.btn-delete-color').click(removeColor);
  $('.btn-edit-color').click(editColor);
  $('.alert-remove-color input.pop-up-submit-btn').click(submitRemoveColor);
  $('.popup-add-color input.add-image-btn').click(addImageColor);
  $('.popup-edit-color input.add-image-btn').click(editImageColor);
  $('form#add-new-connector-color-form').on('submit', submitFolder);
  $('form#edit-connector-color-form').on('submit', submitFolder);
  // 
  /* Coefficients */
  /*
    Editable coefficients
  */
  $('.editable-coef').editable('/base/options/coef/save', {
    id: 'name',
    name: 'value',
    indicator: 'Сохранение..',
    tooltip: 'Нажмите для редактирования',
    submit: 'Ок',
    cssclass : 'edit-input',
    height: '12px',
    width: '50px',
    callback: function() {
      showLoader();
    }
  });

  $('.editable-percent').editable('/base/options/percent/save', {
    id: 'position',
    name: 'value',
    indicator: 'Сохранение..',
    tooltip: 'Нажмите для редактирования',
    submit: 'Ок',
    cssclass : 'edit-input',
    height: '12px',
    width: '50px',
    callback: function() {
      showLoader();
    }
  });

  /**
   * Save coeffs
   */
  $('.coeffs-save').click(function (e) {
    e.preventDefault();
    var margin = $('#coeffs_margin').val();
    var coeff = $('#coeff_value').val();
    var isFormula = $('#radio-formula').prop('checked');

    if (isFormula) {
      coeff = 0;
    }
    $.post('/base/options/coef/save_base', {
      margin: margin,
      coeff: coeff
    }, function (data) {
      window.location.reload();
    });
  });

  // armir parametr
  $('.parametr').editable('/base/options/reinforcement/save-parametr', {
    id: 'id',
    name: 'value',
    submitdata: function () {
      return {
        profile_id: $(this).attr('profile_id'),
        type: $(this).attr('type'),
        rule: $(this).attr('rule')
      };
    },
    indicator: 'Сохранение..',
    tooltip: 'Нажмите для редактирования',
    submit: 'Ок',
    cssclass : 'edit-input',
    height: '12px',
    width: '50px',
    onsubmit: function (settings, original) {
      const $input = $('input', this);
      if ($input.val().trim() === '') {
        $input.val('0');
      }
    },
    callback: function() {
      showLoader();
    }
  });

  $('.armir-name').editable('/base/options/reinforcement/save-armir-name', {
    id: 'id',
    name: 'value',
    indicator: 'Сохранение..',
    tooltip: 'Нажмите для редактирования',
    submit: 'Ок',
    cssclass : 'edit-input',
    height: '12px',
    width: '50px',
    onsubmit: function (settings, original) {
      const $input = $('input', this);
      if ($input.val().trim() === '') {
        $input.val('0');
      }
    },
    callback: function() {
      showLoader();
    }
  });

  $('.armir-priority').editable('/base/options/reinforcement/save-armir-priority', {
    id: 'id',
    name: 'value',
    indicator: 'Сохранение..',
    tooltip: 'Нажмите для редактирования',
    submit: 'Ок',
    cssclass : 'edit-input',
    height: '12px',
    width: '50px',
    onsubmit: function (settings, original) {
      const $input = $('input', this);
      if ($input.val().trim() === '') {
        $input.val('0');
      }
    },
    callback: function() {
      showLoader();
    }
  });
  
  /* Laminations */
  /*
    Editable laminations
  */

  // $('.editable-lamination').editable(function (value) {
  //   return value;
  // }, {
  //   id: 'name',
  //   name: 'value',
  //   indicator: 'Сохранение..',
  //   tooltip: 'Нажмите для редактирования',
  //   submit: 'Ок',
  //   cssclass : 'edit-input',
  //   height: '12px',
  //   width: '120px'
  // });

  /*
    Save laminations
  */
  $('#content-footer-save-lamination').click(function (event) {
    event.preventDefault();
    $('.lamination-color-items input[type="checkbox"].laminations-cb').each(function (value) {
      if ($(this).prop('checked')) {
        var laminationId = $(this).attr('value');
        var boxId = $(this).attr('id');
        // var laminationName = $('label[for=' + boxId + ']').text();

        $.post('/base/options/lamination/save', {
          laminationId: laminationId,
          // laminationName: laminationName
        }, function (data) {
          window.location.reload();
        });
      } else {
        var laminationId = $(this).attr('value');
        const delFromListCountry = $(this).attr('data-delete-lamin');

        $.post('/base/options/lamination/delete', {
          laminationId: laminationId,
          delFromListCountry : delFromListCountry
        }, function (data) {
          window.location.reload();
        });
      }
    });
  });

  // lamination folders


  $('#add-lamination-group').click(function(e) {
    e.preventDefault();
    
    $('.add-group-pop-up_1').popup('show');

    setTimeout(function() {
        $('#lamination-group-name-input').focus();
    }, 200);
    
  });

  $('#add-lamination-color').click(function(e) {
    e.preventDefault();
    
    $('.add-color-pop-up').popup('show');

    setTimeout(function() {
        $('#lamination-color-name-input').focus();
    }, 200);
    
  });
  
  $('.pop-up-close-wrap').click(function(e) {
    e.preventDefault();

    $('.pop-up').popup('hide');
    $('.pop-up-default').popup('hide');
  });
  
  $('#add-lamination-group-form_1').on('submit', function (e) {
    e.preventDefault();
    var formData = new FormData(this);
    $.ajax({
      type:'POST',
      url: $(this).attr('action'),
      data: formData,
      cache: false,
      contentType: false,
      processData: false,
      success: function(data){
        if (data.status) {
          setTimeout(function() {
            $('.pop-up').popup('hide');
            window.location.reload();
          }, 300);
        }
      },
      error: function(data){
        console.log("error");
        console.log(data);
      }
    });
  });
  $('#add-lamination-color-form').on('submit', function (e) {
    e.preventDefault();
    var formData = new FormData(this);
    $.ajax({
      type:'POST',
      url: $(this).attr('action'),
      data: formData,
      cache: false,
      contentType: false,
      processData: false,
      success: function(data){
        if (data.status) {
          setTimeout(function() {
            $('.pop-up').popup('hide');
            window.location.reload();
          }, 300);
        }
      },
      error: function(data){
        console.log("error");
        console.log(data);
      }
    });
  });
  
  
    $('#group-add-pop-up-btn').click(function(e) {
      e.preventDefault();
  
  
      var name = $('#lamination-group-name-input').val();
      //var link = $('#lamination-group-link-input').val();
      //var description = $('#lamination-group-description-input').val();
      //var img = $('#lamination-group-image').attr('src');
      if (name.length > 0) {
        $('#add-lamination-group-form_1').submit();
        // $('.add-group-pop-up_1').popup('hide');

      } else {
        $.toast({
          text : i18n.t('Fill the name of group'),
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
  
    $('.add-group-pop-up').popup({
      type: 'overlay',
      autoopen: false,
      scrolllock: true,
      transition: 'all 0.3s'
    });

    $('#delete-lamination-folder-submit').click(function(e) {
      e.preventDefault();
      showLoader();
      var folderId = $(this).attr('data-folder');
      $.post('/base/options/lamination/remove-folder', {
        folderId: folderId
      }, function(data) {
        if (data.status) {
          $('.delete-lamination-folder-alert').popup('hide');
          window.location.reload();
        }
      });
    });

    $('.btn-delete-lamination-folder').click(function(e) {
      e.stopPropagation()
  
      var folderId = $(this).attr('data-folder');
      $('#delete-lamination-folder-submit').attr('data-folder', folderId);
      $('.delete-alert').popup('show');
    });


    $('#lamination-group-img').click(function() {
      $('#select-lamination-group-image').trigger('click');
    });

    /** On image change */
    $('#select-lamination-group-image').change(function (evt) {
      var files = evt.target.files;
      for (var i = 0, f; f = files[i]; i++) {
        // Only process image files.
        if (!f.type.match('image.*')) {
          continue;
        }
        var reader = new FileReader();
        // Closure to capture the file information.
        reader.onload = (function(theFile) {
          return function(e) {
            $('#lamination-group-image').attr('src', e.target.result);
          };
        })(f);
        reader.readAsDataURL(f);
      }
    });

    $('#lamination-color-img').click(function() {
      $('#select-edit-lamination-color-image').trigger('click');
    });

    /** On image change */
    $('#select-edit-lamination-color-image').change(function (evt) {
      var files = evt.target.files;
      for (var i = 0, f; f = files[i]; i++) {
        // Only process image files.
        if (!f.type.match('image.*')) {
          continue;
        }
        var reader = new FileReader();
        // Closure to capture the file information.
        reader.onload = (function(theFile) {
          return function(e) {
            $('#lamination-color-image').attr('src', e.target.result);
          };
        })(f);
        reader.readAsDataURL(f);
      }
    });

    
    $('.lamination-color-edit').click(function(e) {
      e.preventDefault();
  
      var colorId = $(this).attr('data-color');
      $('.edit-lamination-color-submit').attr('colorId', colorId);
      $('#edit-lamination-color-input-id').val(colorId);
      $('.edit-lamination-color-pop-up').popup('show');
  
      

    });

    $('#edit-lamination-color-form').on('submit', function (e) {
      e.preventDefault();
  
      var formData = new FormData(this);
  
      $.ajax({
        type:'POST',
        url: $(this).attr('action'),
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        success: function(data) {
          if (data.status) {
            setTimeout(function() {
              $('.pop-up').popup('hide');
              window.location.reload();
            }, 300);
          }
        },
        error: function(data){
          console.log("error");
          console.log(data);
        }
      });
    });

    $('.edit-lamination-color-submit').click(function(e) {
      e.preventDefault();  
      $('#edit-lamination-color-form').submit();
    });
    // ---------------------------------------

    

    $('.lamination-folders').on('change', function (e) {
      // e.stopPropagation();
      // e.stopImmediatePropagation();
      // e.preventDefault();

      let laminationFolder = $(this).val();
      let laminationColorId = $(this).find(':selected').data('lamination'); // Аналог `getAttribute('data-lamination')`
  
      $.post('/base/options/lamination/changeLaminationFolder', {
        laminationFolder: laminationFolder,
        laminationColorId: laminationColorId
      }, function(data) {
        if(data.status) {
          window.location.reload();
        } else {
          console.log('lamination not new folder')
        }
      });
     
    });

  $(document).on('click', '.folder-name', function () {
    
    let content = $(this).siblings('.folder-colors');

    if (content.hasClass('open')) {
        content.removeClass('open');
    } else {
        content.addClass('open');
    }
  });


  $('.lamination-folder-edit').click(function(e) {
    e.preventDefault();

    var folderId = $(this).attr('data-folder');
    $('#edit-lamination-folder-input-id').val(folderId);

    $.get('/base/options/lamination/get-folder/' + folderId, function(data) {
      if (data.status) {

        $('#group-position-popup').val(data.folder.position);
        $('#group-name-popup').val(data.folder.name);
        $('.edit-lamination-folder-pop-up').popup('show');
      }
    });
  });

  $('#submit-edit-group-lamination').click(function(e) {
    e.preventDefault();  
    $('#edit-lamination-folder-form').submit();
  });
    

  $('.edit-lamination-folder-pop-up').popup({
    type: 'overlay',
    autoopen: false,
    scrolllock: true,
    transition: 'all 0.3s'
  });

  $('#edit-lamination-folder-form').on('submit', function (e) {
    e.preventDefault();

    var formData = new FormData(this);

    $.ajax({
      type:'POST',
      url: $(this).attr('action'),
      data: formData,
      cache: false,
      contentType: false,
      processData: false,
      success: function(data) {
        if (data.status) {
          setTimeout(function() {
            $('.pop-up').popup('hide');
            window.location.reload();
          }, 300);
        }
      },
      error: function(data){
        console.log("error");
        console.log(data);
      }
    });
  });


  $('.lamination-settings-edit').click(function (e) {
    e.preventDefault();

    var colorId = $(this).attr('data-color');
    $('.edit-lamination-color-submit').attr('colorIdimg', colorId);
    $('#edit-lamination-color-input-id').val(colorId);

    var laminationId = $(this).attr('data-lamination');
    editLaminationSettings(laminationId);

  })

  function editLaminationSettings (laminationId) {
    $.get('/base/options/lamination/getLaminationSettings/' + laminationId, function (data) {
      if (data.status) {
        $('#lamination-group-input').find('option').remove();
        for (var i = 0, len = data.lamination_folders.length; i < len; i++) {
          if (data.lamination_folders[i].id === data.lamination.lamination_folders_id) {
            $('#lamination-group-input').append('<option ' +
              'value="' + data.lamination.lamination_folders_id + '"' + 'selected' + '>' +
              data.lamination_folders[i].name +
              '</option>');
          } else {
            $('#lamination-group-input').append('<option ' +
              'value="' + data.lamination_folders[i].id + '">' +
              data.lamination_folders[i].name +
              '</option>');
          }
        }

        $('#lamination-decor-input').find('option').remove();
        for (var i = 0, len = data.decorColors.length; i < len; i++) {
          if (data.decorColors[i].id === data.lamination.addition_colors_id) {
            $('#lamination-decor-input').append('<option ' +
              'value="' + data.decorColors[i].id + '"' + 'selected' + '>' +
              data.decorColors[i].name +
              '</option>');
          } else {
            $('#lamination-decor-input').append('<option ' +
              'value="' + data.decorColors[i].id + '">' +
              data.decorColors[i].name +
              '</option>');
          }
        }

        
        $('#lamination-settings-edit-input-id').val(laminationId);
        $('#lamination-name-popup').val(data.lamination.name);
        $('#lamination-position-popup').val(data.lamination.position);
       
        $('.lamination-settings-edit-pop-up').popup('show');
      }

    })
  }
  $('#submit-lamination-settings-edit').click(function(e) {
    e.preventDefault();  
    $('#lamination-settings-edit-form').submit();
  });

  $('#lamination-settings-edit-form').on('submit', function (e) {
    e.preventDefault();

    var formData = new FormData(this);

    $.ajax({
      type:'POST',
      url: $(this).attr('action'),
      data: formData,
      cache: false,
      contentType: false,
      processData: false,
      success: function(data) {
        if (data.status) {
          setTimeout(function() {
            $('.pop-up').popup('hide');
            window.location.reload();
          }, 300);
        }
      },
      error: function(data){
        console.log("error");
        console.log(data);
      }
    });
  });

// Presets

  $('.edit-set').click(function (e) {
    e.preventDefault();

    var dataSetId = $(this).attr('data-set-data-id');
    var setId = $(this).attr('data-set');
    var categoriesId = $(this).attr('data-categories-id');
    $('.edit-preset-set-submit').attr('setId', setId);
    $('#edit-preset-set-input-id').val(setId);

    editSetSettings(setId);

  })

  // Edit Set
  function editSetSettings (setId) {
    $.get('/base/options/presets/getPresetsSettings/' + setId, function (data) {
      if (data.status) {

        $('#preset-group-input').find('option').remove();
        for (var i = 0, len = data.groups.length; i < len; i++) {
          if (data.preset && data.groups[i].id === data.preset.categories_sets_id) {
            $('#preset-group-input').append('<option ' +
              'value="' + data.preset.categories_sets_id + '"' + 'selected' + '>' +
              data.groups[i].name +
              '</option>');
          } else {
            $('#preset-group-input').append('<option ' +
              'value="' + data.groups[i].id + '">' +
              data.groups[i].name +
              '</option>');
          }
        }

        $('#preset-profile-input').find('option').remove();
        for (var i = 0, len = data.profiles.length; i < len; i++) {
          if (data.data_set && data.profiles[i].id === data.data_set.profile_systems_id) {
            $('#preset-profile-input').append('<option ' +
              'value="' + data.data_set.profile_systems_id + '"' + 'selected' + '>' +
              data.profiles[i].name +
              '</option>');
          } else {
            $('#preset-profile-input').append('<option ' +
              'value="' + data.profiles[i].id + '">' +
              data.profiles[i].name +
              '</option>');
          }
        }

        const profileSelect = $('#preset-profile-input option:selected').val();
        data.profile_hardware = data.profile_hardware.filter(hardware => hardware.profile_system_id == profileSelect);
        
        $('#preset-hardware-input').find('option').remove();
        for (var i = 0, len = data.hardwares.length; i < len; i++) {
          let checkHardware = data.profile_hardware.find(hardware => hardware.window_hardware_group_id == data.hardwares[i].id);
          if (checkHardware) {
            if (data.data_set && data.hardwares[i].id === data.data_set.window_hardware_groups_id) {
              $('#preset-hardware-input').append('<option ' +
                'value="' + data.data_set.window_hardware_groups_id + '"' + 'selected' + '>' +
                data.hardwares[i].name +
                '</option>');
              } else {
              $('#preset-hardware-input').append('<option ' +
                'value="' + data.hardwares[i].id + '">' +
                data.hardwares[i].name +
                '</option>');
              }
            }
          }
          
        data.profileGlasDeps = data.profileGlasDeps.filter(glas => glas.profile_system_id == profileSelect);

        $('#preset-glass-input').find('option').remove();
        for (var i = 0, len = data.glasses.length; i < len; i++) {
          let checkGlas = data.profileGlasDeps.find(glas => glas.element_id == data.glasses[i].parent_element_id);
          if (checkGlas) {
            if (data.data_set && data.glasses[i].id === data.data_set.list_id) {
              $('#preset-glass-input').append('<option ' +
                'value="' + data.data_set.list_id + '"' + 'selected' + '>' +
                data.glasses[i].name +
                '</option>');
            } else {
              $('#preset-glass-input').append('<option ' +
                'value="' + data.glasses[i].id + '">' +
                data.glasses[i].name +
                '</option>');
            }
          }
        }

        $('#description').val(data.preset.description);

        $('#preset-name-popup').val(data.preset.name);
        $('#preset-position-popup').val(data.preset.position);
        $('.edit-preset-set-submit').data_set
       
        $('.edit-preset-set-pop-up').popup('show');
        $('#edit-preset-set-input-id').val(setId)
      }
    })
  }

  $("#preset-profile-input").change(function() {
      changePresetProfile();
    });

  // filter glass list by profile 
  function changePresetProfile() {
    const setId =  $('#edit-preset-set-input-id').val();

    $.get('/base/options/presets/getPresetsSettings/' + setId, function (data) {
        const profileSelect = $('#preset-profile-input option:selected').val();
        data.profile_hardware = data.profile_hardware.filter(hardware => hardware.profile_system_id == profileSelect);
        
        $('#preset-hardware-input').find('option').remove();
        for (var i = 0, len = data.hardwares.length; i < len; i++) {
          let checkHardware = data.profile_hardware.find(hardware => hardware.window_hardware_group_id == data.hardwares[i].id);
          if (checkHardware) {
            if (data.data_set && data.hardwares[i].id === data.data_set.window_hardware_groups_id) {
              $('#preset-hardware-input').append('<option ' +
                'value="' + data.data_set.window_hardware_groups_id + '"' + 'selected' + '>' +
                data.hardwares[i].name +
                '</option>');
              } else {
              $('#preset-hardware-input').append('<option ' +
                'value="' + data.hardwares[i].id + '">' +
                data.hardwares[i].name +
                '</option>');
              }
            }
          }
          
        data.profileGlasDeps = data.profileGlasDeps.filter(glas => glas.profile_system_id == profileSelect);

        $('#preset-glass-input').find('option').remove();
        for (var i = 0, len = data.glasses.length; i < len; i++) {
          let checkGlas = data.profileGlasDeps.find(glas => glas.element_id == data.glasses[i].parent_element_id);
          if (checkGlas) {
            if (data.data_set && data.glasses[i].id === data.data_set.list_id) {
              $('#preset-glass-input').append('<option ' +
                'value="' + data.data_set.list_id + '"' + 'selected' + '>' +
                data.glasses[i].name +
                '</option>');
            } else {
              $('#preset-glass-input').append('<option ' +
                'value="' + data.glasses[i].id + '">' +
                data.glasses[i].name +
                '</option>');
            }
          }
        }
    })
  }
  
  $('.edit-preset-set-submit').click(function(e) {
    e.preventDefault();  
    $('#edit-preset-set-form').submit();
  });

  $('#edit-preset-set-form').on('submit', function (e) {
    e.preventDefault();

    var formData = new FormData(this);

    $.ajax({
      type:'POST',
      url: $(this).attr('action'),
      data: formData,
      cache: false,
      contentType: false,
      processData: false,
      success: function(data) {
        if (data.status) {
          setTimeout(function() {
            $('.pop-up').popup('hide');
            window.location.reload();
          }, 300);
        }
      },
      error: function(data){
        console.log("error");
        console.log(data);
      }
    });
  });

  $('#preset-set-img').click(function() {
      $('#select-edit-preset-set-image').trigger('click');
    });

    /** On image change */
    $('#select-edit-preset-set-image').change(function (evt) {
      var files = evt.target.files;
      for (var i = 0, f; f = files[i]; i++) {
        // Only process image files.
        if (!f.type.match('image.*')) {
          continue;
        }
        var reader = new FileReader();
        // Closure to capture the file information.
        reader.onload = (function(theFile) {
          return function(e) {
            $('#preset-set-image').attr('src', e.target.result);
          };
        })(f);
        reader.readAsDataURL(f);
      }
    });


  // Preset remove
  $('.delete-set').click(function(e) {
    e.preventDefault();

    var setId = $(this).attr('data-set');
    $('#delete-preset-set-submit').attr('data-set', setId);
    $('.delete-alert.delete-preset-set-alert').popup('show');
  });

    /** Submit removing folder */
    $('#delete-preset-set-submit').click(function(e) {
      e.preventDefault();
      showLoader();
      var setId = $(this).attr('data-set');
      $.post('/base/options/presets/removeSet', {
        setId: setId
      }, function(data) {
        if (data.status) {
          $('.delete-preset-set-alert').popup('hide');
          window.location.reload();
        }
      });
    });
    /** Deny removing folder */
    $('#delete-preset-set-deny').click(function(e) {
      e.preventDefault();

      $('.delete-preset-set-alert').popup('hide');
    });

  $('.pop-up-close-wrap').click(function(e) {
    e.preventDefault();

    $('.pop-up').popup('hide');
    $('.pop-up-default').popup('hide');
  });


  // add Preset Set
  $('.add-preset-btn').click(function(e) {
    e.preventDefault();
    const folderId = $(this).attr('data-set-folder');
    $('#add-preset-set-input-id').val(folderId);

    $.get('/base/options/presets/getPresetsForm/', function (data) {
      if (data.status) {
        $('#add-preset-group-input').find('option').remove();
        for (var i = 0, len = data.groups.length; i < len; i++) {
          if (data.groups[i].id == folderId) {
            $('#add-preset-group-input').append('<option ' +
              'value="' + folderId + '"' + 'selected' + '>' +
              data.groups[i].name +
              '</option>');
          } else {
            $('#add-preset-group-input').append('<option ' +
              'value="' + data.groups[i].id + '">' +
              data.groups[i].name +
              '</option>');
          }
        }

        $('#add-preset-profile-input').find('option').remove();
        for (var i = 0, len = data.profiles.length; i < len; i++) {
          if (i === 0 ) {
            $('#add-preset-profile-input').append('<option ' +
              'value="' + data.profiles[i].id + '"' + 'selected' + '>' +
              data.profiles[i].name +
              '</option>');
          } else {
            $('#add-preset-profile-input').append('<option ' +
              'value="' + data.profiles[i].id + '">' +
              data.profiles[i].name +
              '</option>');
          }
        }

        const profileSelect = $('#add-preset-profile-input option:selected').val();
        data.profile_hardware = data.profile_hardware.filter(hardware => hardware.profile_system_id == profileSelect);
        
        $('#add-preset-hardware-input').find('option').remove();
        for (var i = 0, len = data.hardwares.length; i < len; i++) {
          let checkHardware = data.profile_hardware.find(hardware => hardware.window_hardware_group_id == data.hardwares[i].id);
          if (checkHardware) {
            if (i === 0) {
              $('#add-preset-hardware-input').append('<option ' +
                'value="' + data.hardwares[i].id + '"' + 'selected' + '>' +
                data.hardwares[i].name +
                '</option>');
              } else {
              $('#add-preset-hardware-input').append('<option ' +
                'value="' + data.hardwares[i].id + '">' +
                data.hardwares[i].name +
                '</option>');
              }
            }
          }
          
        data.profileGlasDeps = data.profileGlasDeps.filter(glas => glas.profile_system_id == profileSelect);

        $('#add-preset-glass-input').find('option').remove();
        for (var i = 0, len = data.glasses.length; i < len; i++) {
          let checkGlas = data.profileGlasDeps.find(glas => glas.element_id == data.glasses[i].parent_element_id);
          if (checkGlas) {
            if (i === 0) {
              $('#add-preset-glass-input').append('<option ' +
                'value="' + data.glasses[i].id + '"' + 'selected' + '>' +
                data.glasses[i].name +
                '</option>');
            } else {
              $('#add-preset-glass-input').append('<option ' +
                'value="' + data.glasses[i].id + '">' +
                data.glasses[i].name +
                '</option>');
            }
          }
        }

        $('#add-description').val('');

        $('#add-preset-name-popup').val('');
        $('#add-preset-position-popup').val(0);
       
        $('.add-preset-set-pop-up').popup('show');
      }
    })

  });

  $('#add-preset-set-img').click(function() {
      $('#select-add-preset-set-image').trigger('click');
    });

    /** On image change */
    $('#select-add-preset-set-image').change(function (evt) {
      var files = evt.target.files;
      for (var i = 0, f; f = files[i]; i++) {
        // Only process image files.
        if (!f.type.match('image.*')) {
          continue;
        }
        var reader = new FileReader();
        // Closure to capture the file information.
        reader.onload = (function(theFile) {
          return function(e) {
            $('#add-preset-set-image').attr('src', e.target.result);
          };
        })(f);
        reader.readAsDataURL(f);
      }
    });

  $("#add-preset-profile-input").change(function() {
      changeAddPresetProfile();
    });

    // filter glass list by profile 
  function changeAddPresetProfile() {

    $.get('/base/options/presets/getPresetsForm/', function (data) {
        const profileSelect = $('#add-preset-profile-input option:selected').val();
        data.profile_hardware = data.profile_hardware.filter(hardware => hardware.profile_system_id == profileSelect);
        
        $('#add-preset-hardware-input').find('option').remove();
        for (var i = 0, len = data.hardwares.length; i < len; i++) {
          let checkHardware = data.profile_hardware.find(hardware => hardware.window_hardware_group_id == data.hardwares[i].id);
          if (checkHardware) {
            if (i === 0) {
              $('#add-preset-hardware-input').append('<option ' +
                'value="' + data.hardwares[i].id + '"' + 'selected' + '>' +
                data.hardwares[i].name +
                '</option>');
              } else {
              $('#add-preset-hardware-input').append('<option ' +
                'value="' + data.hardwares[i].id + '">' +
                data.hardwares[i].name +
                '</option>');
              }
            }
          }
          
        data.profileGlasDeps = data.profileGlasDeps.filter(glas => glas.profile_system_id == profileSelect);

        $('#add-preset-glass-input').find('option').remove();
        for (var i = 0, len = data.glasses.length; i < len; i++) {
          let checkGlas = data.profileGlasDeps.find(glas => glas.element_id == data.glasses[i].parent_element_id);
          if (checkGlas) {
            if (i === 0) {
              $('#add-preset-glass-input').append('<option ' +
                'value="' + data.glasses[i].id + '"' + 'selected' + '>' +
                data.glasses[i].name +
                '</option>');
            } else {
              $('#add-preset-glass-input').append('<option ' +
                'value="' + data.glasses[i].id + '">' +
                data.glasses[i].name +
                '</option>');
            }
          }
        }
    })
  }

  
  $('.add-preset-set-submit').click(function(e) {
    e.preventDefault();  
    $('#add-preset-set-form').submit();
  });

  $('#add-preset-set-form').on('submit', function (e) {
    e.preventDefault();

    var formData = new FormData(this);

    $.ajax({
      type:'POST',
      url: $(this).attr('action'),
      data: formData,
      cache: false,
      contentType: false,
      processData: false,
      success: function(data) {
        if (data.status) {
          setTimeout(function() {
            $('.pop-up').popup('hide');
            window.location.reload();
          }, 300);
        }
      },
      error: function(data){
        console.log("error");
        console.log(data);
      }
    });
  });

  // add Preset Folder
  $('.add-group-presets-btn').click(function(e) {
    e.preventDefault();
    $('.add-presets-folder-pop-up').popup('show');
  });

  $('#submit-add-presets-folder').click(function(e) {
    e.preventDefault();  
    $('#add-presets-folder-form').submit();
  });
  
  $('#add-presets-folder-form').on('submit', function (e) {
    e.preventDefault();

    var formData = new FormData(this);

    $.ajax({
      type:'POST',
      url: $(this).attr('action'),
      data: formData,
      cache: false,
      contentType: false,
      processData: false,
      success: function(data) {
        if (data.status) {
          setTimeout(function() {
            $('.pop-up').popup('hide');
            window.location.reload();
          }, 300);
        }
      },
      error: function(data){
        console.log("error");
        console.log(data);
      }
    });
  });

  // remove Preset Folder
  $('.delete-presets-folder-btn').click(function(e) {
    e.preventDefault();
    const folderId = $(this).attr('data-set-folder');
    $.get('/base/options/presets/getPresetsList', {
      folderId: folderId
    }, function(result) {
      if (result.status) {
        showToaster(i18n.t('delete_message'), true);
      } else {
        $('#delete-preset-folder-submit').attr('data-folder', folderId);
        $('.delete-alert.delete-preset-folder-alert').popup('show');
      }
    })

  });

  

    /** Submit removing folder */
    $('#delete-preset-folder-submit').click(function(e) {
      e.preventDefault();
      showLoader();
      var folderId = $(this).attr('data-folder');
      $.post('/base/options/presets/removePresetsFolder', {
        folderId: folderId
      }, function(data) {
        if (data.status) {
          $('.delete-preset-folder-alert').popup('hide');
          window.location.reload();
        }
      });
    });
    /** Deny removing folder */
    $('#delete-preset-folder-deny').click(function(e) {
      e.preventDefault();

      $('.delete-preset-folder-alert').popup('hide');
    });

  $('.pop-up-close-wrap').click(function(e) {
    e.preventDefault();

    $('.pop-up').popup('hide');
    $('.pop-up-default').popup('hide');
  });

  // edit Preset Folder
  $('.edit-presets-folder-btn').click(function(e) {
    e.preventDefault();
    const folderId = $(this).attr('data-set-folder');
    
    $.get('/base/options/presets/getPresetsFolder/' + folderId, function (data) {
      if (data.status) {
        $('#edit-preset-folder-name-popup').val(data.name);
        $('#edit-preset-folder-position-popup').val(data.position);

        $('#edit-presets-folder-input-id').val(folderId);
        $('.edit-presets-folder-pop-up').popup('show');
      }
    })
  });

  $('#submit-edit-presets-folder').click(function(e){
    e.preventDefault();
    $('#edit-presets-folder-form').submit();
  })

  $('#edit-presets-folder-form').on('submit', function (e) {
    e.preventDefault();

    var formData = new FormData(this);

    $.ajax({
      type:'POST',
      url: $(this).attr('action'),
      data: formData,
      cache: false,
      contentType: false,
      processData: false,
      success: function(data) {
        if (data.status) {
          setTimeout(function() {
            $('.pop-up').popup('hide');
            window.location.reload();
          }, 300);
        }
      },
      error: function(data){
        console.log("error");
        console.log(data);
      }
    });
  });

  $("[name='checkPreset']").click(function(e) {
    // e.preventDefault();
    const presetId = $(this).attr('value');
    const checkBoxInfo = ($(this).prop('checked') == true) ? 1 : 0;

    $.post('/base/options/presets/isVisiblePreset', {
      presetId: presetId,
      checkBoxInfo: checkBoxInfo
    }, function(result){})
    
  })

  $("[name='checkPresetSliding']").click(function(e) {
    // e.preventDefault();
    const presetId = $(this).attr('value');
    const checkBoxInfo = ($(this).prop('checked') == true) ? 1 : 0;

    $.post('/base/options/presets/isSlidingPreset', {
      presetId: presetId,
      checkBoxInfo: checkBoxInfo
    }, function(result){})
    
  })

  // ---------------------------------------------------------------
  // lamination folders end 
  /** Change discounts */
  $('.editable-discount').editable(function(value) {
    //
    var name = $(this).attr('id');
    if (name === 'standart_time') {
      var minTime = $('#min_time').text();
      if (parseInt(value, 10) > parseInt(minTime, 10)) {
        $.post('/base/options/discount/save', {
          name: name,
          value: value
        }, function(data) {
          window.location.reload();
          return data;
        });
        return value;
      } else {
        $.toast({
          text : i18n.t('The minimum term can not exceed the standart'),
          showHideTransition: 'fade',
          allowToastClose: true,
          hideAfter: 3000,
          stack: 5,
          position: {top: '60px', right: '30px'},
          bgColor: '#FF6633',
          textColor: '#fff'
        });
        $.post('/base/options/discount/save', {
          name: name,
          value: +minTime + 1
        }, function(data) {
          window.location.reload();
          return data;
        });
        return +minTime + 1;
      }
    } else if (name === 'min_time') {
      var standartTime = $('#standart_time').text();
      if (parseInt(value, 10) < parseInt(standartTime, 10)) {
        $.post('/base/options/discount/save', {
          name: name,
          value: value
        }, function(data) {
          window.location.reload();
          return data;
        });
        return value;
      } else {
        $.toast({
          text : i18n.t('The minimum term can not exceed the standart'),
          showHideTransition: 'fade',
          allowToastClose: true,
          hideAfter: 3000,
          stack: 5,
          position: {top: '60px', right: '30px'},
          bgColor: '#FF6633',
          textColor: '#fff'
        });
        $.post('/base/options/discount/save', {
          name: name,
          value: +standartTime - 1
        }, function(data) {
          return data;
        });
        return +standartTime - 1;
      }
    } else {
      $.post('/base/options/discount/save', {
        name: name,
        value: value
      }, function(data) {
        window.location.reload();
        return data;
      });
      return value;
    }
  }, {
    id: 'name',
    name: 'value',
    indicator: 'Сохранение..',
    tooltip: 'Нажмите для редактирования',
    submit: 'Ок',
    cssclass : 'edit-input',
    height: '12px',
    width: '30px',
    submitdata: function(value) {
      console.log(value);
      console.log(this);
      $(this).attr('id');
      return {foo: 'bar'};
    },
    callback: function() {
      showLoader();
    }
  });

  // /** Activate profile system */
  // $('.active-btn-profile').click(function() {
  //   var profileSystemId = $(this).attr('value');
  //   var isChecked = $(this).prop('checked');

  //   if (isChecked) {
  //     $.post('/base/options/profileSystem/activate', {
  //       profileSystemId: profileSystemId,
  //       isActivated: 1
  //     }, function(data) {
  //       if (data.status) {
  //         $.toast({
  //           text : 'Профиль активирован.',
  //           showHideTransition: 'fade',
  //           allowToastClose: true,
  //           hideAfter: 3000,
  //           stack: 5,
  //           position: {top: '60px', right: '30px'},
  //         });
  //       }
  //     });
  //   } else {
  //     $.post('/base/options/profileSystem/activate', {
  //       profileSystemId: profileSystemId,
  //       isActivated: 0
  //     }, function(data) {
  //       if (data.status) {
  //         $.toast({
  //           text : 'Профиль деактивирован.',
  //           showHideTransition: 'fade',
  //           allowToastClose: true,
  //           hideAfter: 3000,
  //           stack: 5,
  //           position: {top: '60px', right: '30px'},
  //         });
  //       }
  //     });
  //   }
  // });

  // /** Activate hardware */
  // $('.active-btn-hardware').click(function() {
  //   var hardwareId = $(this).attr('value');
  //   var isChecked = $(this).prop('checked');

  //   if (isChecked) {
  //     $.post('/base/options/hardware/activate', {
  //       hardwareId: hardwareId,
  //       isActivated: 1
  //     }, function(data) {
  //       if (data.status) {
  //         $.toast({
  //           text : 'Фурнитура активирована.',
  //           showHideTransition: 'fade',
  //           allowToastClose: true,
  //           hideAfter: 3000,
  //           stack: 5,
  //           position: {top: '60px', right: '30px'},
  //         });
  //       }
  //     });
  //   } else {
  //     $.post('/base/options/hardware/activate', {
  //       hardwareId: hardwareId,
  //       isActivated: 0
  //     }, function(data) {
  //       if (data.status) {
  //         $.toast({
  //           text : 'Фурнитура деактивирована.',
  //           showHideTransition: 'fade',
  //           allowToastClose: true,
  //           hideAfter: 3000,
  //           stack: 5,
  //           position: {top: '60px', right: '30px'},
  //         });
  //       }
  //     });
  //   }
  // });

  // /** On change select */
  // $('.td-select').change(function() {
  //   var profileSystemId = $(this).attr('data-profile');
  //   var field = $(this).attr('data-field');
  //   var value = $(this).find('option:selected').val();

  //   $.post('/base/options/profileSystem/changeList', {
  //     profileSystemId: profileSystemId,
  //     field: field,
  //     value: value
  //   }, function(data) {
  //     if (data.status) {

  //     }
  //   });
  // });

  function showLoader() {
    $('.loader-ico').show();
    setTimeout(function() {
      $('.loader-ico').hide();
    }, 1400);
  }

  /** Glazed window */
    /** Add new folder */
  $('.glass-folder-add').click(function() {
    $('.add-new-glass-folder-pop-up').popup('show');
    setTimeout(function() {
      $('#new-group-name').focus();
    }, 200);
  });

    /** Change add glass group image */
    $('#glass-group-img').click(function() {
      $('#select-glass-group-image').trigger('click');
    });

    /** On image change */
    $('#select-glass-group-image').change(function (evt) {
      var files = evt.target.files;
      for (var i = 0, f; f = files[i]; i++) {
        // Only process image files.
        if (!f.type.match('image.*')) {
          continue;
        }
        var reader = new FileReader();
        // Closure to capture the file information.
        reader.onload = (function(theFile) {
          return function(e) {
            $('#glass-group-image').attr('src', e.target.result);
          };
        })(f);
        reader.readAsDataURL(f);
      }
    });

    /** Submit adding new folder */
    $('#submit-add-new-group').click(function(e) {
      e.preventDefault();

      //var name = $('.add-new-glass-folder-pop-up #new-group-name').val();
      //var position = $('.add-new-glass-folder-pop-up #new-group-position-popup').val();
      //var link = $('.add-new-glass-folder-pop-up #new-group-link').val();
      //var description = $('.add-new-glass-folder-pop-up #new-group-description').val();
      //var img = $('.add-new-glass-folder-pop-up #glass-group-image').attr('src');
      $('#add-new-glass-folder-form').submit();
    });

    $('#add-new-glass-folder-form').on('submit', function (e) {
      e.preventDefault();

      var formData = new FormData(this);

      $.ajax({
        type:'POST',
        url: $(this).attr('action'),
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        success: function(data) {
          if (data.status) {
            setTimeout(function() {
              $('.pop-up').popup('hide');
              window.location.reload();
            }, 300);
          }
        },
        error: function(data){
          console.log("error");
          console.log(data);
        }
      });
    });

  /** Edit glass folder */
  $('.glass-folder-edit').click(function(e) {
    var folderId = $(this).attr('data-folder');
    $('.edit-glass-folder-pop-up #edit-glass-fodler-input-id').val(folderId);

    $.get('/base/options/glazed-window/get-folder/' + folderId, function(data) {
      if (data.status) {
        var img = (data.folder.img ? data.folder.img : '/local_storage/default.png');

        $('.edit-glass-folder-pop-up #group-name-popup').val(data.folder.name);
        $('.edit-glass-folder-pop-up #group-link-popup').val(data.folder.link);
        $('.edit-glass-folder-pop-up #group-position-popup').val(data.folder.position);
        $('.edit-glass-folder-pop-up #group-description-popup').val(data.folder.description);
        $('.edit-glass-folder-pop-up #edit-glass-group-image').attr('src', img);
        $('.edit-glass-folder-pop-up').popup('show');
      }
    });
  });

    /** Change edit glass group image */
    $('#edit-glass-group-img').click(function() {
      $('#edit-select-glass-group-image').trigger('click');
    });

    /** On image change */
    $('#edit-select-glass-group-image').change(function (evt) {
      var files = evt.target.files;
      for (var i = 0, f; f = files[i]; i++) {
        // Only process image files.
        if (!f.type.match('image.*')) {
          continue;
        }
        var reader = new FileReader();
        // Closure to capture the file information.
        reader.onload = (function(theFile) {
          return function(e) {
            $('#edit-glass-group-image').attr('src', e.target.result);
          };
        })(f);
        reader.readAsDataURL(f);
      }
    });

    /** Submit editing group */
    $('#submit-edit-group').click(function(e) {
      e.preventDefault();

      $('#edit-glass-fodler-form').submit();
      //var folderId = $(this).attr('data-folder');
      //var name = $('.edit-glass-folder-pop-up #group-name-popup').val();
      //var link = $('.edit-glass-folder-pop-up #group-link-popup').val();
      //var position = $('.edit-glass-folder-pop-up #group-position-popup').val();
      //var description = $('.edit-glass-folder-pop-up #group-description-popup').val();
      //var img = $('.edit-glass-folder-pop-up #edit-glass-group-image').attr('src');

      // $.post('/base/options/glazed-window/save-folder/' + folderId, {
      //   name: name,
      //   link: link,
      //   position: position,
      //   description: description,
      //   img: img
      // }, function(data) {
      //   if (data.status) {
      //     $('.pop-up').popup('hide');
      //     window.location.reload();
      //   }
      // });
    });
    $('#edit-glass-fodler-form').on('submit', function (e) {
      e.preventDefault();

      var formData = new FormData(this);

      $.ajax({
        type:'POST',
        url: $(this).attr('action'),
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        success: function(data) {
          if (data.status) {
            setTimeout(function() {
              $('.pop-up').popup('hide');
              window.location.reload();
            }, 300);
          }
        },
        error: function(data){
          console.log("error");
          console.log(data);
        }
      });
    });

  /** Remove glass folder */
  $('.glass-folder-delete').click(function(e) {
    e.preventDefault();

    var folderId = $(this).attr('data-folder');
    $('#delete-glass-folder-submit').attr('data-folder', folderId);
    $('.delete-alert').popup('show');
  });

    /** Submit removing folder */
    $('#delete-glass-folder-submit').click(function(e) {
      e.preventDefault();
      showLoader();
      var folderId = $(this).attr('data-folder');
      $.post('/base/options/glazed-window/remove-folder', {
        folderId: folderId
      }, function(data) {
        if (data.status) {
          $('.delete-glass-folder-alert').popup('hide');
          window.location.reload();
        }
      });
    });
    /** Deny removing folder */
    $('#delete-glass-folder-deny').click(function(e) {
      e.preventDefault();

      $('.delete-glass-folder-alert').popup('hide');
    });

  $('.pop-up-close-wrap').click(function(e) {
    e.preventDefault();

    $('.pop-up').popup('hide');
    $('.pop-up-default').popup('hide');
  });

  /** Init popups */
  $('.add-new-glass-folder-pop-up').popup({
    type: 'overlay',
    autoopen: false,
    scrolllock: true,
    transition: 'all 0.3s'
  });
  $('.edit-glass-folder-pop-up').popup({
    type: 'overlay',
    autoopen: false,
    scrolllock: true,
    transition: 'all 0.3s'
  });
  $('.delete-glass-folder-alert').popup({
    type: 'overlay',
    autoopen: false,
    scrolllock: true,
    transition: 'all 0.3s'
  });

  /** Window sills */
  function addNewColor (e) {
    $('.popup-add-color').popup('show');
  }
  function editColor (e) {
    var colorId = $(this).attr('data-color');
    $.get('/base/options/colors/get/' + colorId, function (data) {
      if (data.status) {
        $('.popup-edit-color input[name="color_id"]').val(data.color.id);
        $('.popup-edit-color input[name="name"]').val(data.color.name);
        $('.popup-edit-color img.color-image').attr('src', data.color.img);
        $('.popup-edit-color').popup('show');
      }
    })
  }
  function removeColor (e) {
    var colorId = $(this).attr('data-color');
    window.localStorage.setItem('colorId', colorId);
    $('.alert-remove-color').popup('show');
  }
  function submitRemoveColor (e) {
    var colorId = window.localStorage.getItem('colorId');
    
    $.post('/base/options/colors/remove', {
      colorId: colorId
    }, function (data) {
      if (data.status) {
        $('.alert-remove-color').popup('hide');
        window.location.reload();
      }
    })
  }
  function addImageColor (e) {
    selectImageColor('.popup-add-color');
  }
  function editImageColor (e) {
    selectImageColor('.popup-edit-color');
  }
  function selectImageColor (popup) {
    $(popup + ' input.color-image-file').trigger('click');
  }
  function submitFolder (e) {
    e.preventDefault();

    var formData = new FormData(this);
    var formAction = $(this).attr('action');

    submitForm({ action: formAction, data: formData }, onResponse);

    function onResponse (data) {
      if (data.status) {
        window.location.reload();
      }
    }
  }

  $('.sill-folder-add').click(function(e) {
    e.preventDefault();

    $('.add-new-sill-folder-pop-up').popup('show');
    $('input[name="max_size"]').val('0');
    setTimeout(function() {
      $('#new-group-name').focus();
    }, 200);
  });

    /** Select image */
    $('#sill-group-img').click(function() {
      $('#select-sill-group-image').trigger('click');
    });

    /** On image change */
    $('#select-sill-group-image').change(function (evt) {
      var files = evt.target.files;
      for (var i = 0, f; f = files[i]; i++) {
        // Only process image files.
        if (!f.type.match('image.*')) {
          continue;
        }
        var reader = new FileReader();
        // Closure to capture the file information.
        reader.onload = (function(theFile) {
          return function(e) {
            $('#sill-group-image').attr('src', e.target.result);
          };
        })(f);
        reader.readAsDataURL(f);
      }
    });
    /** Submit adding new sill group */
    $('#submit-add-new-sill-group').click(function(e) {
      e.preventDefault();

      $('#add-new-sill-folder-form').submit();
      // var name = $('#new-group-name').val();
      // var position = $('#new-group-position-popup').val();
      // var link = $('#new-group-link').val();
      // var description = $('#new-group-description').val();
      // var img = $('#sill-group-image').attr('src');

      // $.post('/base/options/window-sills/add-new-folder', {
      //   name: name,
      //   position: position,
      //   link: link,
      //   description: description,
      //   img: img
      // }, function(data) {
      //   if (data.status) {
      //     window.location.reload();
      //   }
      // });
    });

    $('#add-new-sill-folder-form').on('submit', function (e) {
      e.preventDefault();

      var formData = new FormData(this);

      $.ajax({
        type:'POST',
        url: $(this).attr('action'),
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        success: function(data) {
          if (data.status) {
            setTimeout(function() {
              $('.pop-up').popup('hide');
              window.location.reload();
            }, 300);
          }
        },
        error: function(data){
          console.log("error");
          console.log(data);
        }
      });
    });

  /** Delete sill folder */
  $('.sill-folder-delete').click(function(e) {
    e.preventDefault();

    var folderId = $(this).attr('data-folder');
    $('#delete-sill-folder-submit').attr('data-folder', folderId);
    $('.delete-sill-folder-alert').popup('show');
  });

    /** Submit delete folder */
    $('#delete-sill-folder-submit').click(function(e) {
      e.preventDefault();

      var folderId = $(this).attr('data-folder');
      $.post('/base/options/window-sills/remove-folder', {
        folderId: folderId
      }, function(data) {
        if (data.status) {
          window.location.reload();
        }
      });
    });
    /** Cancel delete folder */
    $('#delete-sill-folder-deny').click(function(e) {
      e.preventDefault();
      $('.delete-sill-folder-alert').popup('hide');
    });

  /** Edit sill folder */
  $('.sill-folder-edit').click(function(e) {
    e.preventDefault();

    var folderId = $(this).attr('data-folder');
    $('#edit-sill-folder-id').val(folderId);

    $.get('/base/options/window-sills/get-folder/' + folderId, function(data) {
      if (data.status) {
        var img = (data.folder.img ? data.folder.img : '/local_storage/default.png');

        $('#group-position-popup').val(data.folder.position);
        $('#group-name-popup').val(data.folder.name);
        $('#group-link-popup').val(data.folder.link);
        $('#group-description-popup').val(data.folder.description);
        $('input[name="max_size"]').val(data.folder.max_size);
        $('#edit-sill-group-image').attr('src', img);
        $('#submit-edit-sill-group').attr('data-folder', folderId);
        $('.edit-sill-folder-pop-up').popup('show');
      }
    });
  });

    /** Change edit glass group image */
    $('#edit-sill-group-img').click(function() {
      $('#edit-select-sill-group-image').trigger('click');
    });

    /** On image change */
    $('#edit-select-sill-group-image').change(function (evt) {
      var files = evt.target.files;
      for (var i = 0, f; f = files[i]; i++) {
        // Only process image files.
        if (!f.type.match('image.*')) {
          continue;
        }
        var reader = new FileReader();
        // Closure to capture the file information.
        reader.onload = (function(theFile) {
          return function(e) {
            $('#edit-sill-group-image').attr('src', e.target.result);
          };
        })(f);
        reader.readAsDataURL(f);
      }
    });

    /** Submit editing group */
    $('#submit-edit-sill-group').click(function(e) {
      e.preventDefault();

      $('#edit-sill-folder-form').submit();
      // var folderId = $(this).attr('data-folder');
      // var name = $('.edit-sill-folder-pop-up #group-name-popup').val();
      // var link = $('.edit-sill-folder-pop-up #group-link-popup').val();
      // var position = $('.edit-sill-folder-pop-up #group-position-popup').val();
      // var description = $('.edit-sill-folder-pop-up #group-description-popup').val();
      // var img = $('.edit-sill-folder-pop-up #edit-sill-group-image').attr('src');

      // $.post('/base/options/window-sills/save-folder/' + folderId, {
      //   name: name,
      //   link: link,
      //   position: position,
      //   description: description,
      //   img: img
      // }, function(data) {
      //   if (data.status) {
      //     $('.pop-up').popup('hide');
      //     window.location.reload();
      //   }
      // });
    });
    $('#edit-sill-folder-form').on('submit', function(e) {
      e.preventDefault();

      var formData = new FormData(this);

      $.ajax({
        type:'POST',
        url: $(this).attr('action'),
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        success: function(data) {
          if (data.status) {
            setTimeout(function() {
              $('.pop-up').popup('hide');
              window.location.reload();
            }, 300);
          }
        },
        error: function(data){
          console.log("error");
          console.log(data);
        }
      });
    });

  /** Init popups */
  $('.add-new-sill-folder-pop-up').popup({
    type: 'overlay',
    autoopen: false,
    scrolllock: true,
    transition: 'all 0.3s'
  });
  $('.delete-sill-folder-alert').popup({
    type: 'overlay',
    autoopen: false,
    scrolllock: true,
    transition: 'all 0.3s'
  });
  $('.edit-sill-folder-pop-up').popup({
    type: 'overlay',
    autoopen: false,
    scrolllock: true,
    transition: 'all 0.3s'
  });
  $('.edit-lamination-folder-pop-up').popup({
    type: 'overlay',
    autoopen: false,
    scrolllock: true,
    transition: 'all 0.3s'
  });

  function showToaster (message, isError) {
    if (isError) {
      $.toast({
        text : message,
        showHideTransition: 'fade',
        allowToastClose: true,
        hideAfter: 3000,
        stack: 5,
        position: {top: '60px', right: '30px'},
        bgColor: '#FF6633',
        textColor: '#fff'
      });
    } else {
      $.toast({
        text : message,
        showHideTransition: 'fade',
        allowToastClose: true,
        hideAfter: 3000,
        stack: 5,
        position: {top: '60px', right: '30px'}
      });
    }
  }

  // checkboxes country
    // glassesCountry

  $('td.country-item input').click(function() {
    countryId = $(this).attr('value');
    country_status = $(this).is(":checked");
    var CheckCountry ={};
    if (country_status)
    {
       CheckCountry[countryId] = 1;
    }
    else
    {
       CheckCountry[countryId] = 0;
    }
   setGlassesCountry($(this).attr('data-glasses-id'), CheckCountry);
  });

  function setGlassesCountry(GlassesfolderId, CheckCountry) {
    $.post('/base/options/getGlassesCountry/' + GlassesfolderId, CheckCountry
    , function(data) {
      if (!CheckCountry)
      {
        $("[name='checkGlass']").each(function() {
            if (data[$(this).attr('value')]){
              $(this).prop('checked', true);
            }
            else{
              $(this).prop('checked', false);
            }
        });
      }
    });
  }

    // laminationCountry
  $('div.country-item input').click(function() {
    countryId = $(this).attr('value');
    country_status = $(this).is(":checked");
    var CheckCountry ={};
    if (country_status)
    {
       CheckCountry[countryId] = 1;
    }
    else
    {
       CheckCountry[countryId] = 0;
    }
   setLaminationCountry($(this).attr('data-lamination-id'), CheckCountry);
  });

  function setLaminationCountry(LaminationfolderId, CheckCountry) {
    $.post('/base/options/getLaminationCountry/' + LaminationfolderId, CheckCountry
    , function(data) {
      if (!CheckCountry)
      {
        $("[name='checkLamination']").each(function() {
            if (data[$(this).attr('value')]){
              $(this).prop('checked', true);
            }
            else{
              $(this).prop('checked', false);
            }
        });
      }
    });
  }

    // addElems
  $('td.country-item-sills input').click(function() {
    countryId = $(this).attr('value');
    country_status = $(this).is(":checked");
    var CheckCountry ={};
    if (country_status)
    {
       CheckCountry[countryId] = 1;
    }
    else
    {
       CheckCountry[countryId] = 0;
    }
   setAddElemsCountry($(this).attr('data-addElems-id'), CheckCountry);
  });

  function setAddElemsCountry(addElemsId, CheckCountry) {
    $.post('/base/options/getAddElemsCountry/' + addElemsId, CheckCountry
    , function(data) {
      if (!CheckCountry)
      {
        $("[name='checkAddElems']").each(function() {
            if (data[$(this).attr('value')]){
              $(this).prop('checked', true);
            }
            else{
              $(this).prop('checked', false);
            }
        });
      }
    });
  }

  // ARmir

  /** Add new reinforcement */
  $('.add-armir').click(function(e) {
    e.preventDefault();

    $('.add-new-reinforcement-pop-up').popup('show');
    setTimeout(function() {
      $('#new-reinforcement-name').focus();
    }, 200);
  });

  $('#submit-add-new-reinforcement').click(function(e) {
      e.preventDefault();

      $('#add-new-reinforcement-form').submit();
      $('.add-new-reinforcement-pop-up').popup('hide');
    });



  $('.btn-remove').click(function(e) {
    e.preventDefault();

    var reinforcementId = $(this).attr('data-reinforcement');
    $('#delete-reinforcement-submit').attr('data-reinforcement', reinforcementId);
    $('.delete-reinforcement-alert').popup('show');    
  });

    /** Submit removing reinforcement */
    $('#delete-reinforcement-submit').click(function(e) {
      e.preventDefault();

      var reinforcementId = $(this).attr('data-reinforcement');
      $.post('/base/options/reinforcement/remove', {
        reinforcementId: reinforcementId
      }, function(data) {
        if (data.status) {
          $('.delete-reinforcement-alert').popup('hide');
          $('.armir-item[data-reinforcement=' + reinforcementId + ']').remove();
          $('.armir-parametr[data-armir-id=' + reinforcementId + ']').remove();
        }
      });
    });
    /** Deny removing reinforcement */
    $('#delete-reinforcement-deny').click(function(e) {
      e.preventDefault();
      $('.delete-reinforcement-alert').popup('hide');
    });



});
