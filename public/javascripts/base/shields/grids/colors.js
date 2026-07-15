$(function () {
  var localizerOption = {
    resGetPath: '/assets/javascripts/vendor/localizer/__ns__-__lng__.json',
  };
  i18n.init(localizerOption);

  

  $('#add-color-group-pls-form').on('submit', submitAddColorGroup);
  $('#edit-color-group-pls-form').on('submit', submitEditColorGroup);
  $('#delete-color-group-pls-form').on('submit', submitDeleteColorGroup);
  $('#add-color-pls-form').on('submit', submitAddColor);
  $('#edit-color-pls-form').on('submit', submitEditColor);
  $('#delete-color-pls-form').on('submit', submitDeleteColor);

  $('#popup-add-color-pls input.add-image-btn').click(addImgColor);
  $('#popup-edit-color-pls input.add-image-btn').click(editImgColor);

  /** Init popups */
  $(
    '#popup-add-color-group-pls',
    '#popup-edit-color-group-pls',
    '#popup-delete-color-group-pls',
    '#popup-add-color-pls',
    '#popup-edit-color-pls',
    '#popup-delete-color-pls',
  ).popup({
    type: 'overlay',
    autoopen: false,
    scrolllock: true,
    transition: 'all 0.3s',
  });

  $('.btn-show-more').on('click', function () {
    var groupId = $(this).data('group');
    var $target = $('.colors-list[data-group="' + groupId + '"]');
    var isVisible = $target.is(':visible');

    $('.colors-list:visible').not($target).slideUp(150);

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
    const colorId = $(this).data('color');
    if (groupId) {
      $.post('/base/shields/grids/colors/group/active/' + groupId, {
        
      }, function(data) {        
      
      });
    }
    if (colorId) {
      $.post('/base/shields/grids/colors/color/active/' + colorId, {
        
      }, function(data) {        
      
      });
    }
  });

  // ---------------------

  $('.btn-add-group').click(function(e) {
    e.preventDefault();
    $(
      '#popup-add-color-group-pls input:not([type="submit"]):not([type="hidden"]):not([type="button"])'
    ).val('');
    $('#popup-add-color-group-pls').popup('show');
  });

  $('.btn-add-color').click(function(e) {
    e.preventDefault();
    const groupId = $(this).data('group');
     $(
      '#popup-add-color-pls input:not([type="submit"]):not([type="hidden"]):not([type="button"])'
    ).val('');
    $('#popup-add-color-pls input[name="group_id"]').val(groupId);
    $('#popup-add-color-pls').popup('show');
  });

  $('.btn-edit-item').on('click', onEditItemClick);

  function onEditItemClick(e) {
    e.preventDefault();

    const groupId = $(this).data('group');
    const colorId = $(this).data('color');

    if (groupId) {
      openEditGroup(groupId);
      return;
    }

    if (colorId) {
      openEditColor(colorId);
    }
  }

  function openEditGroup(groupId) {
    $(
      '#popup-edit-color-group-pls input:not([type="submit"]):not([type="hidden"]):not([type="button"])'
    ).val('');
    $('#popup-edit-color-group-pls input[name="group_id"]').val(groupId);
    $.get('/base/shields/grids/colors/getGroup/' + groupId, function (data) {
      if (data.status) {
        $('#popup-edit-color-group-pls input[name="name"]').val(data.group.name);
        $('#popup-edit-color-group-pls input[name="position"]').val(data.group.position);
        $('#popup-edit-color-group-pls').popup('show');
      }
    });
  }

  function openEditColor(systemId) {
    $(
      '#popup-edit-color-pls input:not([type="submit"]):not([type="hidden"]):not([type="button"])'
    ).val('');
    $('#popup-edit-color-pls input[name="color_id"]').val(systemId);

    $.get('/base/shields/grids/colors/getColor/' + systemId, function (data) {
      if (data.status) {
        const color = data.color;
        $('#popup-edit-color-pls input[name="name"]').val(color.name);
        $('#popup-edit-color-pls input[name="sku"]').val(color.sku);
        $('#popup-edit-color-pls input[name="position"]').val(color.position);
        $('#popup-edit-color-pls input[name="price"]').val(color.price);
        $('#popup-edit-color-pls img.pls-image').attr('src', color.img);
        $('#popup-edit-color-pls').popup('show');
      }
    });
  }

  $('.btn-delete-item').on('click', onDeleteItemClick);

  function onDeleteItemClick(e) {
    e.preventDefault();
    var colorId = $(this).data('color');
    var groupId = $(this).data('group');

    if (groupId) {
      $('#popup-delete-color-group-pls input[name="group_id"]').val(groupId);
      $('#popup-delete-color-group-pls').popup('show');
      return;
    }
    if (colorId) {
      $('#popup-delete-color-pls input[name="color_id"]').val(colorId);
      $('#popup-delete-color-pls').popup('show');
    }
  }


  // Submit forms

  function submitAddColorGroup(e) {
    e.preventDefault();

    var formData = new FormData(this);
    var formAction = $(this).attr('action');

    submitForm({ action: formAction, data: formData }, onResponse);

    function onResponse(data) {
      stopLoader();
      if (data.status) {
        $('.pop-up').popup('hide');
        console.log('ADD new color group');
        setTimeout(function () {
          $('.pop-up').popup('hide');
          window.location.reload();
        }, 300);
      } else {
        console.log('error');
      }
    }
  }

  function submitEditColorGroup(e) {
    e.preventDefault();

    var formData = new FormData(this);
    var formAction = $(this).attr('action');

    submitForm({ action: formAction, data: formData }, onResponse);

    function onResponse(data) {
      stopLoader();
      if (data.status) {
        $('.pop-up').popup('hide');
        console.log('Edit color group');
        setTimeout(function () {
          $('.pop-up').popup('hide');
          window.location.reload();
        }, 300);
      } else {
        console.log('error');
      }
    }
  }

  function submitDeleteColorGroup(e) {
    e.preventDefault();

    var formData = new FormData(this);
    var formAction = $(this).attr('action');

    submitForm({ action: formAction, data: formData }, onResponse);

    function onResponse(data) {
      stopLoader();
      if (data.status) {
        $('.pop-up').popup('hide');
        console.log('Delete color group');
        setTimeout(function () {
          $('.pop-up').popup('hide');
          window.location.reload();
        }, 300);
      } else {
        console.log('error');
      }
    }
  }


  function submitAddColor(e) {
    e.preventDefault();

    var formData = new FormData(this);
    var formAction = $(this).attr('action');

    submitForm({ action: formAction, data: formData }, onResponse);

    function onResponse(data) {
      stopLoader();
      if (data.status) {
        $('.pop-up').popup('hide');
        console.log('ADD new color');
        setTimeout(function () {
          $('.pop-up').popup('hide');
          window.location.reload();
        }, 300);
      } else {
        console.log('error');
      }
    }
  }

  function submitEditColor(e) {
    e.preventDefault();

    var formData = new FormData(this);
    var formAction = $(this).attr('action');

    submitForm({ action: formAction, data: formData }, onResponse);

    function onResponse(data) {
      stopLoader();
      if (data.status) {
        $('.pop-up').popup('hide');
        console.log('Edit color');
        setTimeout(function () {
          $('.pop-up').popup('hide');
          window.location.reload();
        }, 300);
      } else {
        console.log('error');
      }
    }
  }

  function submitDeleteColor(e) {
    e.preventDefault();

    var formData = new FormData(this);
    var formAction = $(this).attr('action');

    submitForm({ action: formAction, data: formData }, onResponse);

    function onResponse(data) {
      stopLoader();
      if (data.status) {
        $('.pop-up').popup('hide');
        console.log('Delete color');
        setTimeout(function () {
          $('.pop-up').popup('hide');
          window.location.reload();
        }, 300);
      } else {
        console.log('error');
      }
    }
  }

  function addImgColor (e) {
    selectImageColor('#popup-add-color-pls');
  }
  function editImgColor (e) {
    selectImageColor('#popup-edit-color-pls');
  }
  
  function selectImageColor (popup) {
    $(popup + ' input.pls-image-file').trigger('click');
  }
});
