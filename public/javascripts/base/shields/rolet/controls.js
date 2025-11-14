$(function () {
  var localizerOption = {
    resGetPath: '/assets/javascripts/vendor/localizer/__ns__-__lng__.json',
  };
  i18n.init(localizerOption);

  $('#add-control-rolet-form').on('submit', submitAddNewControl);
  $('#edit-control-rolet-form').on('submit', submitEditControl);
  $('#delete-control-rolet-form').on('submit', submitDeleteControl);

  $('#add-control-rolet-form input.add-image-btn').click(addImgControl);
  $('#edit-control-rolet-form input.add-image-btn').click(editImgControl);

  /** Init popups */
  $(
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
  // systems
  $('.btn-add-system').click(function (e) {
    e.preventDefault();
    $('#popup-add-control-rolet input:not([type="submit"]):not([type="button"])').val('')
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

        $('#popup-edit-control-rolet').popup('show');
      }
    })
  });

  $('.btn-delete-system').click(function (e) {
    e.preventDefault();
    const controlId = $(this).data('control');
    $('#popup-delete-control-rolet input[name="control_id"]').val(controlId);
    $('#popup-delete-control-rolet').popup('show');
  });

  $('.btn-active').click(function (e) {
    e.preventDefault();
    $(this).toggleClass('btn-unactive');
    const controlId = $(this).data('control');
    if (controlId) {
      $.post(
        '/base/shields/rolet/controls/active/' + controlId,
        {},
        function (data) {}
      );
    }
  });

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
