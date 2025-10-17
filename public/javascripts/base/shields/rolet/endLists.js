$(function () {
  var localizerOption = { resGetPath: '/assets/javascripts/vendor/localizer/__ns__-__lng__.json'};
  i18n.init(localizerOption);

  
  $('#add-end-list-rolet-form').on('submit', submitAddNewEndList);
  $('#edit-end-list-rolet-form').on('submit', submitEditEndList);
  $('#delete-end-list-rolet-form').on('submit', submitDeleteEndList);

  $('#add-end-list-rolet-form input.add-image-btn').click(addImgEndList);
  $('#edit-end-list-rolet-form input.add-image-btn').click(editImgEndList);


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
    $('#popup-add-end-list-rolet input:not([type="submit"]):not([type="button"])').val('')
    $('#popup-add-end-list-rolet input[type="checkbox"]').prop('checked', false);
    $('#popup-add-end-list-rolet').popup('show');
  })

  $('.btn-edit-system').click(function(e) {
    e.preventDefault();
    const endListsId = $(this).data('end_list');
    $('#popup-edit-end-list-rolet input[name="end_list_id"]').val(endListsId);
    $.get('/base/shields/rolet/endLists/endList/getEndList/' + endListsId, function(data) {
      if (data) {
        $('#popup-edit-end-list-rolet input[name="name"]').val(data.end_list.name);
        $('#popup-edit-end-list-rolet input[name="description"]').val(data.end_list.description);
        $('#popup-edit-end-list-rolet img.rolet-image').attr('src', data.end_list.img);
        if (data.end_list.is_color) {
          $('#popup-edit-end-list-rolet input[name="is_color"]').prop('checked', true);
        } else {
          $('#popup-edit-end-list-rolet input[name="is_color"]').prop('checked', false);
        }
        if (data.end_list.is_key) {
          $('#popup-edit-end-list-rolet input[name="is_key"]').prop('checked', true);
        } else {
          $('#popup-edit-end-list-rolet input[name="is_key"]').prop('checked', false);
        }

        $('#popup-edit-end-list-rolet input[name="is_color"]').val(data.end_list.is_color);
        $('#popup-edit-end-list-rolet input[name="is_key"]').val(data.end_list.is_key);

        $('#popup-edit-end-list-rolet').popup('show');
      }
    })
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
        setTimeout(function() {
          $('.pop-up').popup('hide');
          window.location.reload();
        }, 300);
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
        setTimeout(function() {
          $('.pop-up').popup('hide');
          window.location.reload();
        }, 300);
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
        setTimeout(function() {
          $('.pop-up').popup('hide');
          window.location.reload();
        }, 300);
      } else {
        console.log('error');
      }
    }
  }

  function addImgEndList (e) {
    selectImageRolet('#popup-add-end-list-rolet');
  }
  function editImgEndList (e) {
    selectImageRolet('#popup-edit-end-list-rolet');
  }
  function selectImageRolet (popup) {
    $(popup + ' input.rolet-image-file').trigger('click');
  }

  
});
