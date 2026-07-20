$(function () {
  var localizerOption = {
    resGetPath: '/assets/javascripts/vendor/localizer/__ns__-__lng__.json',
  };
  i18n.init(localizerOption);

  

  $('#add-system-group-pls-form').on('submit', submitAddSystemGroup);
  $('#edit-system-group-pls-form').on('submit', submitEditSystemGroup);
  $('#delete-system-group-pls-form').on('submit', submitDeleteSystemGroup);
  $('#add-system-pls-form').on('submit', submitAddSystem);
  $('#edit-system-pls-form').on('submit', submitEditSystem);
  $('#delete-system-pls-form').on('submit', submitDeleteSystem);

  $('#popup-add-system-pls input.add-image-btn').click(addImgSystem);
  $('#popup-edit-system-pls input.add-image-btn').click(editImgSystem);

  /** Init popups */
  $(
    '#popup-add-system-group-pls',
    '#popup-edit-system-group-pls',
    '#popup-delete-system-group-pls',
    '#popup-add-system-pls',
    '#popup-edit-system-pls',
    '#popup-delete-system-pls',
  ).popup({
    type: 'overlay',
    autoopen: false,
    scrolllock: true,
    transition: 'all 0.3s',
  });

  $('.btn-show-more').on('click', function () {
    var groupId = $(this).data('group');
    var $target = $('.system-list[data-group="' + groupId + '"]');
    var isVisible = $target.is(':visible');

    $('.system-list:visible').not($target).slideUp(150);

    if (isVisible) {
      $target.slideUp(150);
      $('.group-row').removeClass('opacity-content');
      return;
    }

    $('.group-row').addClass('opacity-content');
    $target.slideDown(150);
  });



   $('.btn-active').click(function(e) {
    e.preventDefault();
    $(this).toggleClass('btn-unactive');
    const groupId = $(this).data('group');
    const systemId = $(this).data('system');
    if (groupId) {
      $.post('/base/shields/grids/systems/group/active/' + groupId, {
        
      }, function(data) {        
      
      });
    }
    if (systemId) {
      $.post('/base/shields/grids/systems/system/active/' + systemId, {
        
      }, function(data) {        
      
      });
    }
  });

  // ---------------------

  $('.btn-add-group').click(function(e) {
    e.preventDefault();
    $(
      '#popup-add-system-group-pls input:not([type="submit"]):not([type="hidden"]):not([type="button"])'
    ).val('');
    $('#popup-add-system-group-pls').popup('show');
  });

  $('.btn-add-system').click(function(e) {
    e.preventDefault();
    const groupId = $(this).data('group');
     $(
      '#popup-add-system-pls input:not([type="submit"]):not([type="hidden"]):not([type="button"])'
    ).val('');
    $('#popup-add-system-pls input[name="group_id"]').val(groupId);
    $.get('/base/shields/grids/systems/getProfiles', function (data) {
      if (data.status) {
        fillProfileSelects('#popup-add-system-pls', data.profiles);

        $('#popup-add-system-pls').popup('show');
      }
    });
  });

  function fillProfileSelects(popupSelector, profiles) {
    const selectNames = ['top_id', 'right_id', 'left_id', 'bottom_id', 'center_id', 'sash_id'];

    selectNames.forEach(function(selectName) {
      const $select = $(popupSelector + ' select[name="' + selectName + '"]');
      $select.empty();
      $select.append($('<option>').val(0).text('Не выбрано'));

      profiles.forEach(function(profile) {
        const optionText = profile.name + ' / ' + (profile.sku || '');
        const $option = $('<option>').val(profile.id).text(optionText);
        $select.append($option);
      });
    });
  }

  $('.btn-edit-item').on('click', onEditItemClick);

  function onEditItemClick(e) {
    e.preventDefault();

    const groupId = $(this).data('group');
    const systemId = $(this).data('system');

    if (groupId) {
      openEditSystemGroup(groupId);
      return;
    }

    if (systemId) {
      openEditSystem(systemId);
    }
  }

  function openEditSystemGroup(groupId) {
    $(
      '#popup-edit-system-group-pls input:not([type="submit"]):not([type="hidden"]):not([type="button"])'
    ).val('');
    $('#popup-edit-system-group-pls input[name="group_id"]').val(groupId);
    $.get('/base/shields/grids/systems/getGroup/' + groupId, function (data) {
      if (data.status) {
        $('#popup-edit-system-group-pls input[name="name"]').val(data.group.name);
        $('#popup-edit-system-group-pls input[name="position"]').val(data.group.position);
        $('#popup-edit-system-group-pls textarea[name="description"]').val(data.group.description);
        $('#popup-edit-system-group-pls').popup('show');
      }
    });
  }

  function openEditSystem(systemId) {
    $(
      '#popup-edit-system-pls input:not([type="submit"]):not([type="hidden"]):not([type="button"])'
    ).val('');
    $('#popup-edit-system-pls input[name="system_id"]').val(systemId);

    $.get('/base/shields/grids/systems/getSystem/' + systemId, function (data) {
      if (data.status) {
        const system = data.system;
        $('#popup-edit-system-pls input[name="name"]').val(system.name);
        $('#popup-edit-system-pls input[name="position"]').val(system.position);
        $('#popup-edit-system-pls textarea[name="description"]').val(system.description);
        $('#popup-edit-system-pls input[name="image"]').val(system.image);
        $('#popup-edit-system-pls input[name="min_w"]').val(system.min_w);
        $('#popup-edit-system-pls input[name="min_h"]').val(system.min_h);
        $('#popup-edit-system-pls input[name="max_w"]').val(system.max_w);
        $('#popup-edit-system-pls input[name="max_h"]').val(system.max_h);
        $('#popup-edit-system-pls input[name="edit_grid_w"]').val(system.edit_grid_w);
        $('#popup-edit-system-pls input[name="edit_grid_h"]').val(system.edit_grid_h);
        $('#popup-edit-system-pls input[name="sash_reduction"]').val(system.sash_reduction);
        $.get('/base/shields/grids/systems/getProfiles', function (data) {
          if (data.status) {
            fillProfileSelects('#popup-edit-system-pls', data.profiles);

            $('#popup-edit-system-pls select[name="top_id"]').val(String(system.top_id || 0));
            $('#popup-edit-system-pls select[name="right_id"]').val(String(system.right_id || 0));
            $('#popup-edit-system-pls select[name="left_id"]').val(String(system.left_id || 0));
            $('#popup-edit-system-pls select[name="bottom_id"]').val(String(system.bottom_id || 0));
            $('#popup-edit-system-pls select[name="center_id"]').val(String(system.center_id || 0));
            $('#popup-edit-system-pls select[name="sash_id"]').val(String(system.sash_id || 0));
          }
          $('#popup-edit-system-pls').popup('show');
        });
      }
    });
  }

  $('.btn-delete-item').on('click', onDeleteItemClick);

  function onDeleteItemClick(e) {
    e.preventDefault();
    var systemId = $(this).data('system');
    var groupId = $(this).data('group');

    if (groupId) {
      $('#popup-delete-system-group-pls input[name="group_id"]').val(groupId);
      $('#popup-delete-system-group-pls').popup('show');
      return;
    }
    if (systemId) {
      $('#popup-delete-system-pls input[name="system_id"]').val(systemId);
      $('#popup-delete-system-pls').popup('show');
    }
  }


  // Submit forms

  function submitAddSystemGroup(e) {
    e.preventDefault();

    var formData = new FormData(this);
    var formAction = $(this).attr('action');

    submitForm({ action: formAction, data: formData }, onResponse);

    function onResponse(data) {
      stopLoader();
      if (data.status) {
        $('.pop-up').popup('hide');
        console.log('ADD new system group');
        setTimeout(function () {
          $('.pop-up').popup('hide');
          window.location.reload();
        }, 300);
      } else {
        console.log('error');
      }
    }
  }

  function submitEditSystemGroup(e) {
    e.preventDefault();

    var formData = new FormData(this);
    var formAction = $(this).attr('action');

    submitForm({ action: formAction, data: formData }, onResponse);

    function onResponse(data) {
      stopLoader();
      if (data.status) {
        $('.pop-up').popup('hide');
        console.log('Edit system group');
        setTimeout(function () {
          $('.pop-up').popup('hide');
          window.location.reload();
        }, 300);
      } else {
        console.log('error');
      }
    }
  }

  function submitDeleteSystemGroup(e) {
    e.preventDefault();

    var formData = new FormData(this);
    var formAction = $(this).attr('action');

    submitForm({ action: formAction, data: formData }, onResponse);

    function onResponse(data) {
      stopLoader();
      if (data.status) {
        $('.pop-up').popup('hide');
        console.log('Delete system group');
        setTimeout(function () {
          $('.pop-up').popup('hide');
          window.location.reload();
        }, 300);
      } else {
        console.log('error');
      }
    }
  }


  function submitAddSystem(e) {
    e.preventDefault();

    var formData = new FormData(this);
    var formAction = $(this).attr('action');

    submitForm({ action: formAction, data: formData }, onResponse);

    function onResponse(data) {
      stopLoader();
      if (data.status) {
        $('.pop-up').popup('hide');
        console.log('ADD new system');
        setTimeout(function () {
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

    submitForm({ action: formAction, data: formData }, onResponse);

    function onResponse(data) {
      stopLoader();
      if (data.status) {
        $('.pop-up').popup('hide');
        console.log('Edit system');
        setTimeout(function () {
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

    function onResponse(data) {
      stopLoader();
      if (data.status) {
        $('.pop-up').popup('hide');
        console.log('Delete system');
        setTimeout(function () {
          $('.pop-up').popup('hide');
          window.location.reload();
        }, 300);
      } else {
        console.log('error');
      }
    }
  }

  function addImgSystem (e) {
    selectImageGrid('#popup-add-system-pls');
  }
  function editImgSystem (e) {
    selectImageGrid('#popup-edit-system-pls');
  }
  
  function selectImageGrid (popup) {
    $(popup + ' input.pls-image-file').trigger('click');
  }
});
