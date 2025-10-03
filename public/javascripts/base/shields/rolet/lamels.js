$(function () {
  var localizerOption = { resGetPath: '/assets/javascripts/vendor/localizer/__ns__-__lng__.json'};
  i18n.init(localizerOption);

  
  $('#add-lamel-rolet-form').on('submit', submitAddNewLamel);
  $('#edit-lamel-rolet-form').on('submit', submitEditLamel);
  $('#delete-lamel-rolet-form').on('submit', submitDeleteLamel);


  /** Init popups */
  $(
    '#popup-add-lamel-rolet',
    '#popup-edit-lamel-rolet',
    '#popup-delete-lamel-rolet',
  ).popup({
    type: 'overlay',
    autoopen: false,
    scrolllock: true,
    transition: 'all 0.3s'
  });

  // btns 
    // systems
  $('.btn-add-system').click(function(e) {
    e.preventDefault();
    $('#popup-add-lamel-rolet input:not([type="submit"]):not([type="radio"]):not([type="hidden"])').val('')
    $('#popup-add-lamel-rolet input[type="checkbox"]').prop('checked', false);
    $('#popup-add-lamel-rolet').popup('show');
  })

  $('.btn-edit-system').click(function(e) {
    e.preventDefault();
    const lamelId = $(this).data('lamel');
    $('#popup-edit-lamel-rolet input[name="lamel_id"]').val(lamelId);
    $('#popup-edit-lamel-rolet').popup('show');
  })

  $('.btn-delete-system').click(function(e) {
    e.preventDefault();
    const lamelId = $(this).data('lamel');
    $('#popup-delete-lamel-rolet input[name="lamel_id"]').val(lamelId);
    $('#popup-delete-lamel-rolet').popup('show');
  })

  $('.btn-active').click(function(e) {
    e.preventDefault();
    $(this).toggleClass('btn-unactive');
    const lamelId = $(this).data('lamel');
    console.log(lamelId)
    if (lamelId) {
      $.post('/base/shields/rolet/lamels/lamel/active/' + lamelId, {
        
      }, function(data) {        
      
      });
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

  
  function submitAddNewLamel(e) {
    e.preventDefault();

    var formData = new FormData(this);
    var formAction = $(this).attr('action');

    submitForm({ action: formAction, data: formData }, onResponse);

    function onResponse (data) {
      stopLoader();
      if (data.status) {
        $('.pop-up').popup('hide');
        console.log('ADD lamel');
        // setTimeout(function() {
        //   $('.pop-up').popup('hide');
        //   window.location.reload();
        // }, 300);
      } else {
        console.log('error');
      }
    }
  }
  
  function submitEditLamel(e) {
    e.preventDefault();

    var formData = new FormData(this);
    var formAction = $(this).attr('action');

    submitForm({ action: formAction, data: formData }, onResponse);

    function onResponse (data) {
      stopLoader();
      if (data.status) {
        $('.pop-up').popup('hide');
        console.log('Edit lamel');
        // setTimeout(function() {
        //   $('.pop-up').popup('hide');
        //   window.location.reload();
        // }, 300);
      } else {
        console.log('error');
      }
    }
  }
  function submitDeleteLamel(e) {
    e.preventDefault();

    var formData = new FormData(this);
    var formAction = $(this).attr('action');

    submitForm({ action: formAction, data: formData }, onResponse);

    function onResponse (data) {
      stopLoader();
      if (data.status) {
        $('.pop-up').popup('hide');
        console.log('Delete lamel');
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
