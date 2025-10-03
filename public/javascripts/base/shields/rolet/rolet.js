$(function () {
  var localizerOption = { resGetPath: '/assets/javascripts/vendor/localizer/__ns__-__lng__.json'};
  i18n.init(localizerOption);

  
  $('#add-group-rolet-form').on('submit', submitAddNewGroupSystem);
  $('#add-system-rolet-form').on('submit', submitAddNewSystem);
  $('#edit-system-rolet-form').on('submit', submitEditSystem);
  $('#delete-group-rolet-form').on('submit', submitDeleteGroupSystem);
  $('#delete-system-rolet-form').on('submit', submitDeleteSystem);


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
    $('#popup-delete-group-rolet input[name="group_id"]').val(groupId);
    $('#popup-delete-group-rolet').popup('show');
  })

  $('.btn-edit-group').click(function(e) {
    e.preventDefault();
    const groupId = $(this).data('group');
    $('#popup-edit-group-rolet input[name="group_id"]').val(groupId);
    $('#popup-edit-group-rolet').popup('show');
  })
  
  $('.btn-add-group').click(function(e) {
    e.preventDefault();
    $('input.input-default').val('');
    $('#popup-add-group-rolet').popup('show');
  })
    // systems
  $('.btn-add-system').click(function(e) {
    e.preventDefault();
    $('#popup-add-system-rolet input:not([type="submit"]').val('')
    $('#popup-add-system-rolet input[type="checkbox"]').prop('checked', false);
    $('#popup-add-system-rolet').popup('show');
  })

  $('.btn-edit-system').click(function(e) {
    e.preventDefault();
    const systemId = $(this).data('system');
    $('#popup-edit-system-rolet input[name="system_id"]').val(systemId);
    $('#popup-edit-system-rolet').popup('show');
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

  function submitAddNewGroupSystem(e) {
    e.preventDefault();

    var formData = new FormData(this);
    var formAction = $(this).attr('action');

    submitForm({ action: formAction, data: formData }, onResponse);

    function onResponse (data) {
      stopLoader();
      if (data.status) {
        $('.pop-up').popup('hide');
        $('.block-groups').append('<div class="group-rolet-system-item">' + data.name + '</div>');
        console.log('success');
        // setTimeout(function() {
        //   $('.pop-up').popup('hide');
        //   window.location.reload();
        // }, 300);
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
        // setTimeout(function() {
        //   $('.pop-up').popup('hide');
        //   window.location.reload();
        // }, 300);
      } else {
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
        // setTimeout(function() {
        //   $('.pop-up').popup('hide');
        //   window.location.reload();
        // }, 300);
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

    function onResponse (data) {
      stopLoader();
      if (data.status) {
        $('.pop-up').popup('hide');
        console.log('editSystem');
        // setTimeout(function() {
        //   $('.pop-up').popup('hide');
        //   window.location.reload();
        // }, 300);
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
        // setTimeout(function() {
        //   $('.pop-up').popup('hide');
        //   window.location.reload();
        // }, 300);
      } else {
        console.log('error');
      }
    }
  }

  
});
