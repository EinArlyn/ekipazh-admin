$(function () {
  var localizerOption = {
    resGetPath: '/assets/javascripts/vendor/localizer/__ns__-__lng__.json',
  };
  i18n.init(localizerOption);

  $('#add-add-element-rolet-form').on('submit', submitAddNewElem);
  $('#edit-add-element-rolet-form').on('submit', submitEditAddElem);
  $('#delete-add-element-rolet-form').on('submit', submitDeleteAddElem);

  $('#add-add-element-rolet-form input.add-image-btn').click(addImgAddElem);
  $('#edit-add-element-rolet-form input.add-image-btn').click(editImgAddElem);

  /** Init popups */
  $(
    '#popup-add-add-element-rolet',
    '#popup-edit-add-element-rolet',
    '#popup-delete-add-element-rolet'
  ).popup({
    type: 'overlay',
    autoopen: false,
    scrolllock: true,
    transition: 'all 0.3s',
  });

  // checkboxes 

  $('input[type="checkbox"]').change(function() {
    const isChecked = $(this).is(':checked');
    if (isChecked) {
      $(this).val('1');
    } else {
      $(this).val('0');
    }
  })

  // btns
  // systems
  $('.btn-add-system').click(function (e) {
    e.preventDefault();
    $(
      '#popup-add-add-element-rolet input:not([type="submit"]):not([type="hidden"]):not([type="button"])'
    ).val('');
  
    $('#popup-add-add-element-rolet').popup('show');
  });

  $('.btn-edit-system').click(function (e) {
    e.preventDefault();
    const elemId = $(this).data('elem');
    $(
      '#popup-edit-add-element-rolet input:not([type="submit"]):not([type="hidden"]):not([type="button"])'
    ).val('');
    $('#popup-edit-add-element-rolet input[name="add_element_id"]').val(elemId);
    

    
    $.get('/base/shields/rolet/addElements/getAddElem/' + elemId, function (data) {
      $('#popup-edit-add-element-rolet input[name="name"]').val(data.addElem.name);
      $('#popup-edit-add-element-rolet input[name="position"]').val(data.addElem.position);
      $('#popup-edit-add-element-rolet input[name="price"]').val(data.addElem.price);
      $('#popup-edit-add-element-rolet input[name="min_qty"]').val(data.addElem.min_qty);
      $('#popup-edit-add-element-rolet select[name="rule"]').val(data.addElem.rule);
      $('#popup-edit-add-element-rolet textarea[name="description"]').val(data.addElem.description);
      $('#popup-edit-add-element-rolet img.rolet-image').attr('src', data.addElem.img);
      $('#popup-edit-add-element-rolet input[name="checkbox"]').val(data.addElem.is_fix_price);
      if (data.addElem.is_fix_price) {
        $('#popup-edit-add-element-rolet input[name="is_fix_price"]').prop('checked', true);
      } else {
        $('#popup-edit-add-element-rolet input[name="is_fix_price"]').prop('checked', false);
      }
      $('#popup-edit-guide-rolet input[name="is_fix_price"]').val(data.addElem.is_fix_price);
      

      $('#popup-edit-add-element-rolet').popup('show');     
    });
  });

  $('.btn-delete-system').click(function (e) {
    e.preventDefault();
    const elemId = $(this).data('elem');
    $('#popup-delete-add-element-rolet input[name="add_element_id"]').val(elemId);
    $('#popup-delete-add-element-rolet').popup('show');
  });

  $('.btn-active').click(function (e) {
    e.preventDefault();
    $(this).toggleClass('btn-unactive');
    const elemId = $(this).data('elem');
    if (elemId) {
      $.post(
        '/base/shields/rolet/addElements/addElem/active/' + elemId,
        {},
        function (data) {}
      );
    }
  });


  function submitAddNewElem(e) {
    e.preventDefault();

    var formData = new FormData(this);
    var formAction = $(this).attr('action');

    submitForm({ action: formAction, data: formData }, onResponse);

    function onResponse(data) {
      console.log(data)
      stopLoader();
      if (data.status) {
        $('.pop-up').popup('hide');
        console.log('ADD add elem');
        setTimeout(function() {
          $('.pop-up').popup('hide');
          window.location.reload();
        }, 300);
      } else {
        console.log('error');
      }
    }
  }

  function submitEditAddElem(e) {
    e.preventDefault();

    var formData = new FormData(this);
    var formAction = $(this).attr('action');

    submitForm({ action: formAction, data: formData }, onResponse);

    function onResponse(data) {
      stopLoader();
      if (data.status) {
        $('.pop-up').popup('hide');
        console.log('Edit add elem');
        setTimeout(function() {
          $('.pop-up').popup('hide');
          window.location.reload();
        }, 300);
      } else {
        console.log('error');
      }
    }
  }
  function submitDeleteAddElem(e) {
    e.preventDefault();

    var formData = new FormData(this);
    var formAction = $(this).attr('action');

    submitForm({ action: formAction, data: formData }, onResponse);

    function onResponse(data) {
      stopLoader();
      if (data.status) {
        $('.pop-up').popup('hide');
        console.log('Delete add elem');
        setTimeout(function() {
          $('.pop-up').popup('hide');
          window.location.reload();
        }, 300);
      } else {
        console.log('error');
      }
    }
  }

  function addImgAddElem (e) {
    selectImageRolet('#popup-add-add-element-rolet');
  }
  function editImgAddElem (e) {
    selectImageRolet('#popup-edit-add-element-rolet');
  }
  function selectImageRolet (popup) {
    $(popup + ' input.rolet-image-file').trigger('click');
  }
});
