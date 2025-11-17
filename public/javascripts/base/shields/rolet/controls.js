$(function () {
  var localizerOption = {
    resGetPath: '/assets/javascripts/vendor/localizer/__ns__-__lng__.json',
  };
  i18n.init(localizerOption);

  $('#add-group-controls-form').on('submit', submitAddNewGroupControls);
  $('#edit-group-controls-form').on('submit', submitEditGroupControls);
  $('#delete-group-controls-form').on('submit', submitDeleteGroupControls);
  $('#add-control-rolet-form').on('submit', submitAddNewControl);
  $('#edit-control-rolet-form').on('submit', submitEditControl);
  $('#delete-control-rolet-form').on('submit', submitDeleteControl);

  $('#add-control-rolet-form input.add-image-btn').click(addImgControl);
  $('#edit-control-rolet-form input.add-image-btn').click(editImgControl);

  /** Init popups */
  $(
    '#popup-add-group-controls',
    '#popup-edit-group-controls',
    '#popup-delete-group-controls',
    '#popup-add-control-rolet',
    '#popup-edit-control-rolet',
    '#popup-delete-control-rolet'
  ).popup({
    type: 'overlay',
    autoopen: false,
    scrolllock: true,
    transition: 'all 0.3s',
  });

  // btns
    // groups
  $('.btn-delete-group').click(function(e) {
    e.preventDefault();
    const groupId = $(this).data('group');
    $('#popup-delete-group-controls .empty-text').remove();
    $('#popup-delete-group-controls input[name="group_id"]').val(groupId);
    $('#popup-delete-group-controls').popup('show');
  })

  $('.btn-edit-group').click(function(e) {
    e.preventDefault();
    const groupId = $(this).data('group');
    $.get('/base/shields/rolet/controls/getGroup/' + groupId, function(data) {
      $('#popup-edit-group-controls input[name="group_id"]').val(groupId);
      $('#popup-edit-group-controls input[name="name"]').val(data.group.name);
      $('#popup-edit-group-controls input[name="position"]').val(data.group.position);
      $('#popup-edit-group-controls input[name="description"]').val(data.group.description);
      $('#popup-edit-group-controls img.rolet-image').attr('src', data.group.img);
      
      $('#popup-edit-group-controls').popup('show');
    })
  })
  
  $('.btn-add-group').click(function(e) {
    e.preventDefault();
    $('#popup-add-group-controls input.input-default').val('');
    $('#popup-add-group-controls').popup('show');
  })

  // systems
  $('.btn-add-system').click(function (e) {
    e.preventDefault();
    const groupId = $(this).data('group')
    $('#popup-add-control-rolet input:not([type="submit"]):not([type="button"])').val('')
    $('#popup-add-control-rolet input[type="hidden"]').val(groupId);
    $('#popup-add-control-rolet').popup('show');
  });

  $('.btn-edit-system').click(function (e) {
    e.preventDefault();
    const controlId = $(this).data('control');
    $('#popup-edit-control-rolet input[name="control_id"]').val(controlId);
    $.get('/base/shields/rolet/controls/getControl/' + controlId, function(data){
      if (data) {
        $('#popup-edit-control-rolet input[name="name"]').val(data.control.name);
        $('#popup-edit-control-rolet input[name="description"]').val(data.control.description);
        $('#popup-edit-control-rolet input[name="position"]').val(data.control.position);
        $('#popup-edit-control-rolet input[name="price"]').val(data.control.price);
        $('#popup-edit-control-rolet img.rolet-image').attr('src', data.control.img);

        if (data.control.is_side) {
          $('#popup-edit-control-rolet input[name="is_side"]').prop('checked', true);
        } else {
          $('#popup-edit-control-rolet input[name="is_side"]').prop('checked', false);
        }
        $('#popup-edit-control-rolet input[name="is_side"]').val(data.control.is_side);



        $('#popup-edit-control-rolet #rolet-proup').find('option').remove();
        $.get('/base/shields/rolet/controls/getGroups',  {
          
        }, function(dataGroup) {
          if (dataGroup.status) {
            for (var i = 0, len = dataGroup.groups.length; i < len; i++) {
              const group = dataGroup.groups[i];
              const selected = group.id == data.control.rol_control_group_id ? ' selected' : '';
              
              $('#popup-edit-control-rolet #rolet-proup').append(
                '<option value="' + group.id + '"' + selected + '>' + group.name + '</option>'
              );
            }
          }

          setTimeout(function(){
            $('#popup-edit-control-rolet').popup('show');
          },200)
        })
      }
    })
  });

  $('.btn-delete-system').click(function (e) {
    e.preventDefault();
    const controlId = $(this).data('control');
    $('#popup-delete-control-rolet input[name="control_id"]').val(controlId);
    $('#popup-delete-control-rolet').popup('show');
  });

  // $('.btn-active').click(function (e) {
  //   e.preventDefault();
  //   $(this).toggleClass('btn-unactive');
  //   const controlId = $(this).data('control');
  //   if (controlId) {
  //     $.post(
  //       '/base/shields/rolet/controls/active/' + controlId,
  //       {},
  //       function (data) {}
  //     );
  //   }
  // });

  $('.btn-active').click(function(e) {
    e.preventDefault();
    $(this).toggleClass('btn-unactive');
    const groupId = $(this).data('group');
    const controlId = $(this).data('control');
    
    if (groupId) {
      $.post('/base/shields/rolet/controls/activeGr/' + groupId, {
        
      }, function(data) {        
      
      });
    }
    if (controlId) {
      $.post('/base/shields/rolet/controls/active/' + controlId, {

      },function (data) {

      })
    }
  })

  $('.btn-standart').click(function (e) {
    e.preventDefault();
    if($(this).hasClass('btn-unstandart')) {
      $('.btn-standart').each(function() {
        $(this).addClass('btn-unstandart');
      });
      $(this).toggleClass('btn-unstandart');
      const controlId = $(this).data('control');
      if (controlId) {
        $.post(
          '/base/shields/rolet/controls/isStandart/' + controlId,
          {},
          function (data) {}
        );
      }
    }
  });

  // checkboxes

  $('input[type="checkbox"]').change(function () {
    const isChecked = $(this).is(':checked');
    if (isChecked) {
      $(this).val('1');
    } else {
      $(this).val('0');
    }
  });

   function submitAddNewGroupControls(e) {
    e.preventDefault();

    var formData = new FormData(this);
    var formAction = $(this).attr('action');

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

  function submitEditGroupControls(e) {
    e.preventDefault();

    var formData = new FormData(this);
    var formAction = $(this).attr('action');

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

  function submitDeleteGroupControls(e) {
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
        $('#popup-delete-group-controls .pop-up-header').append('<div class="empty-text">Group is not empty</div>')
        console.log('error');
      }
    }
  }

  function submitAddNewControl(e) {
    e.preventDefault();

    var formData = new FormData(this);
    var formAction = $(this).attr('action');

    submitForm({ action: formAction, data: formData }, onResponse);

    function onResponse(data) {
      stopLoader();
      if (data.status) {
        $('.pop-up').popup('hide');
        console.log('ADD control');
        setTimeout(function() {
          $('.pop-up').popup('hide');
          window.location.reload();
        }, 300);
      } else {
        console.log('error');
      }
    }
  }

  function submitEditControl(e) {
    e.preventDefault();

    var formData = new FormData(this);
    var formAction = $(this).attr('action');

    submitForm({ action: formAction, data: formData }, onResponse);

    function onResponse(data) {
      stopLoader();
      if (data.status) {
        $('.pop-up').popup('hide');
        console.log('Edit control');
        setTimeout(function() {
          $('.pop-up').popup('hide');
          window.location.reload();
        }, 300);
      } else {
        console.log('error');
      }
    }
  }
  function submitDeleteControl(e) {
    e.preventDefault();

    var formData = new FormData(this);
    var formAction = $(this).attr('action');

    submitForm({ action: formAction, data: formData }, onResponse);

    function onResponse(data) {
      stopLoader();
      if (data.status) {
        $('.pop-up').popup('hide');
        console.log('Delete control');
        setTimeout(function() {
          $('.pop-up').popup('hide');
          window.location.reload();
        }, 300);
      } else {
        console.log('error');
      }
    }
  }

  function addImgControl (e) {
    selectImageRolet('#popup-add-control-rolet');
  }
  function editImgControl (e) {
    selectImageRolet('#popup-edit-control-rolet');
  }
  function selectImageRolet (popup) {
    $(popup + ' input.rolet-image-file').trigger('click');
  }
});
