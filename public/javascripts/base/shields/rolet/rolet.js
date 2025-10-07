$(function () {
  var localizerOption = { resGetPath: '/assets/javascripts/vendor/localizer/__ns__-__lng__.json'};
  i18n.init(localizerOption);

  
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
      $('#popup-edit-group-rolet input[name="description"]').val(data.group.description);
      $('#popup-edit-group-rolet input[name="group_id"]').val(groupId);

      $('#popup-edit-group-rolet').popup('show');
    })
  })
  
  $('.btn-add-group').click(function(e) {
    e.preventDefault();
    $('input.input-default').val('');
    $('#popup-add-group-rolet').popup('show');
  })
    // systems
  $('.btn-add-system').click(function(e) {
    e.preventDefault();
    const groupId = $(this).data('group')
    $('#popup-add-system-rolet input:not([type="submit"])').val('')
    $('#popup-add-system-rolet input[type="checkbox"]').prop('checked', false);
    $('#popup-add-system-rolet input[type="hidden"]').val(groupId);
    $('#popup-add-system-rolet').popup('show');
  })

  $('.btn-edit-system').click(function(e) {
    e.preventDefault();
    const systemId = $(this).data('system');
    $('#popup-edit-system-rolet input:not([type="submit"]:not([type="hidden"]))').val('');
    
    $('#popup-edit-system-rolet input[name="system_id"]').val(systemId);
    if (systemId) {
      $.get('/base/shields/rolet/rolet/system/getSystem/' + systemId, {
      }, function(system) {
        console.log(system)
        $('#popup-edit-system-rolet input[name="name"]').val(system.box.name)
        $('#popup-edit-system-rolet input[name="position"]').val(system.box.position)
        $('#popup-edit-system-rolet input[name="description"]').val(system.box.description)
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
          $('#popup-edit-system-rolet input[name="is_split"]').prop('checked', true);
        } else {
          $('#popup-edit-system-rolet input[name="is_split"]').prop('checked', false);
        }

        $('#popup-edit-system-rolet input[name="is_color"]').val(system.box.is_color)
        $('#popup-edit-system-rolet input[name="is_grid"]').val(system.box.is_grid)
        $('#popup-edit-system-rolet input[name="is_security"]').val(system.box.is_security)
        $('#popup-edit-system-rolet input[name="is_revision"]').val(system.box.is_revision)
        $('#popup-edit-system-rolet input[name="is_engine"]').val(system.box.is_engine)
        $('#popup-edit-system-rolet input[name="is_split"]').val(system.box.is_revision)

        let height = $('#popup-edit-system-rolet input.height-box');
        let width = $('#popup-edit-system-rolet input.width-box');
        height.each((index,field) => {
         if (system.sizes[index]) {
            $(field).val(system.sizes[index].height);
            $(field).attr('size_id', system.sizes[index].id);
            $(width[index]).val(system.sizes[index].width);
            $(width[index]).attr('size_id', system.sizes[index].id);
          }
        })


        $('#popup-edit-system-rolet #rolet-proup').find('option').remove();
        $.get('/base/shields/rolet/rolet/group/getGroups',  {
          
        }, function(data) {
          console.log(data)
          if (data.status) {
            for (var i = 0, len = data.groups.length; i < len; i++) {
              const group = data.groups[i];
              const selected = group.id == system.box.rol_group_id ? ' selected' : '';
              
              $('#popup-edit-system-rolet #rolet-proup').append(
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
    console.log(groupId)
    console.log(systemId)
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

  $('#popup-add-system-rolet input.height-box, #popup-edit-system-rolet input.height-box').on('change', function () {
    const currentHeight = $(this).val();
    const nextWidth = $(this).nextAll('input.width-box').first();
    if (!nextWidth.val()) {
      nextWidth.val(currentHeight);
    }
  })

  function submitAddNewGroupSystem(e) {
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

    var formData = new FormData(this);
    var formAction = $(this).attr('action');

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

  function submitEditSystem(e) {
    e.preventDefault();

    var formData = new FormData(this);
    var formAction = $(this).attr('action');

    const size_ids = $('#popup-edit-system-rolet input.height-box')
      .map(function() {
        const id = parseInt($(this).attr('size_id'), 10);
        return id > 0 ? id : null; 
      })
      .get()
      .filter(id => id !== null); 
      
    formData.append('size_ids', size_ids);

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
