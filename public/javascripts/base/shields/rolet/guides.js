$(function () {
  var localizerOption = { resGetPath: '/assets/javascripts/vendor/localizer/__ns__-__lng__.json'};
  i18n.init(localizerOption);

  
  $('#add-guide-rolet-form').on('submit', submitAddNewGuide);
  $('#edit-guide-rolet-form').on('submit', submitEditGuide);
  $('#delete-guide-rolet-form').on('submit', submitDeleteGuide);


  /** Init popups */
  $(
    '#popup-add-guide-rolet',
    '#popup-edit-guide-rolet',
    '#popup-delete-guide-rolet',
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
    $('#popup-add-guide-rolet input:not([type="submit"]').val('')
    $('#popup-add-guide-rolet input[type="checkbox"]').prop('checked', false);
    $('#popup-add-guide-rolet').popup('show');
  })

  $('.btn-edit-system').click(function(e) {
    e.preventDefault();
    const guideId = $(this).data('guide');
    $('#popup-edit-guide-rolet input[name="guide_id"]').val(guideId);
    $('#popup-edit-guide-rolet').popup('show');
  })

  $('.btn-delete-system').click(function(e) {
    e.preventDefault();
    const guideId = $(this).data('guide');
    $('#popup-delete-guide-rolet input[name="guide_id"]').val(guideId);
    $('#popup-delete-guide-rolet').popup('show');
  })

  $('.btn-active').click(function(e) {
    e.preventDefault();
    $(this).toggleClass('btn-unactive');
    const guideId = $(this).data('guide');
    console.log(guideId)
    if (guideId) {
      $.post('/base/shields/rolet/guides/guide/active/' + guideId, {
        
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

  
  function submitAddNewGuide(e) {
    e.preventDefault();

    var formData = new FormData(this);
    var formAction = $(this).attr('action');

    submitForm({ action: formAction, data: formData }, onResponse);

    function onResponse (data) {
      stopLoader();
      if (data.status) {
        $('.pop-up').popup('hide');
        console.log('ADD GUIDE');
        // setTimeout(function() {
        //   $('.pop-up').popup('hide');
        //   window.location.reload();
        // }, 300);
      } else {
        console.log('error');
      }
    }
  }
  
  function submitEditGuide(e) {
    e.preventDefault();

    var formData = new FormData(this);
    var formAction = $(this).attr('action');

    submitForm({ action: formAction, data: formData }, onResponse);

    function onResponse (data) {
      stopLoader();
      if (data.status) {
        $('.pop-up').popup('hide');
        console.log('Edit guide');
        // setTimeout(function() {
        //   $('.pop-up').popup('hide');
        //   window.location.reload();
        // }, 300);
      } else {
        console.log('error');
      }
    }
  }
  function submitDeleteGuide(e) {
    e.preventDefault();

    var formData = new FormData(this);
    var formAction = $(this).attr('action');

    submitForm({ action: formAction, data: formData }, onResponse);

    function onResponse (data) {
      stopLoader();
      if (data.status) {
        $('.pop-up').popup('hide');
        console.log('Delete guide');
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
