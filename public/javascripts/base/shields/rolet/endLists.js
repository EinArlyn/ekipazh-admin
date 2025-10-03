$(function () {
  var localizerOption = { resGetPath: '/assets/javascripts/vendor/localizer/__ns__-__lng__.json'};
  i18n.init(localizerOption);

  
  $('#add-end-list-rolet-form').on('submit', submitAddNewEndList);
  $('#edit-end-list-rolet-form').on('submit', submitEditEndList);
  $('#delete-end-list-rolet-form').on('submit', submitDeleteEndList);


  /** Init popups */
  $(
    '#popup-add-end-list-rolet',
    '#popup-edit-end-list-rolet',
    '#popup-delete-end-list-rolet',
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
    $('#popup-add-end-list-rolet input:not([type="submit"]').val('')
    $('#popup-add-end-list-rolet input[type="checkbox"]').prop('checked', false);
    $('#popup-add-end-list-rolet').popup('show');
  })

  $('.btn-edit-system').click(function(e) {
    e.preventDefault();
    const endListsId = $(this).data('end_list');
    $('#popup-edit-end-list-rolet input[name="end_list_id"]').val(endListsId);
    $('#popup-edit-end-list-rolet').popup('show');
  })

  $('.btn-delete-system').click(function(e) {
    e.preventDefault();
    const endListsId = $(this).data('end_list');
    $('#popup-delete-end-list-rolet input[name="end_list_id"]').val(endListsId);
    $('#popup-delete-end-list-rolet').popup('show');
  })

  $('.btn-active').click(function(e) {
    e.preventDefault();
    $(this).toggleClass('btn-unactive');
    const endListsId = $(this).data('end_list');
    console.log(endListsId)
    if (endListsId) {
      $.post('/base/shields/rolet/endLists/endList/active/' + endListsId, {
        
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

  
  function submitAddNewEndList(e) {
    e.preventDefault();

    var formData = new FormData(this);
    var formAction = $(this).attr('action');

    submitForm({ action: formAction, data: formData }, onResponse);

    function onResponse (data) {
      stopLoader();
      if (data.status) {
        $('.pop-up').popup('hide');
        console.log('ADD end list');
        // setTimeout(function() {
        //   $('.pop-up').popup('hide');
        //   window.location.reload();
        // }, 300);
      } else {
        console.log('error');
      }
    }
  }
  
  function submitEditEndList(e) {
    e.preventDefault();

    var formData = new FormData(this);
    var formAction = $(this).attr('action');

    submitForm({ action: formAction, data: formData }, onResponse);

    function onResponse (data) {
      stopLoader();
      if (data.status) {
        $('.pop-up').popup('hide');
        console.log('Edit end list');
        // setTimeout(function() {
        //   $('.pop-up').popup('hide');
        //   window.location.reload();
        // }, 300);
      } else {
        console.log('error');
      }
    }
  }
  function submitDeleteEndList(e) {
    e.preventDefault();

    var formData = new FormData(this);
    var formAction = $(this).attr('action');

    submitForm({ action: formAction, data: formData }, onResponse);

    function onResponse (data) {
      stopLoader();
      if (data.status) {
        $('.pop-up').popup('hide');
        console.log('Delete end list');
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
