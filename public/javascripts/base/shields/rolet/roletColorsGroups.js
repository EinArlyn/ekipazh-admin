$(function () {
  var localizerOption = {
    resGetPath: '/assets/javascripts/vendor/localizer/__ns__-__lng__.json',
  };
  i18n.init(localizerOption);

  $('#add-color-group-rolet-form').on('submit', submitAddColorGroup);
  $('#add-color-rolet-form').on('submit', submitAddColor);
  $('#edit-color-group-rolet-form').on('submit', submitEditColorGroup);
  $('#edit-color-rolet-form').on('submit', submitEditColor);
  $('#delete-color-group-rolet-form').on('submit', submitDeleteColorGroup);
  $('#delete-color-rolet-form').on('submit', submitDeleteColor);

  $('#add-color-rolet-form input.add-image-btn').click(addImgColor);
  $('#edit-color-rolet-form input.add-image-btn').click(editImgColor);

 
  const radioColorsGroup = [
    '#FFF', // белый
    '#F7D9A6', // тёплый кремово-песочный
    '#F4E3B2', // ванильный / светлый тепло-бежевый
    '#D8E2A9', // спокойный салатово-оливковый
    '#B6D7A8', // зелёный «мята спокойная»

    '#A6D6D6', // нежный морской голубой
    '#A7C2E3', // пастельно-синий
    '#C4B7E8', // светло-сиреневый
    '#E3B8D4', // спокойный розово-лиловый
    '#E8C7A6', // пудрово-персиковый (тёплый, но не резкий)
    ];

     /** Init popups */
  $(
    '#popup-add-color-group-rolet',
    '#popup-edit-color-group-rolet',
    '#popup-delete-color-group-rolet',
    '#popup-add-color-rolet',
    '#popup-edit-color-rolet',
    '#popup-delete-color-rolet',
  ).popup({
    type: 'overlay',
    autoopen: false,
    scrolllock: true,
    transition: 'all 0.3s',
  });


  $('.btn-active').click(function(e) {
    e.preventDefault();

    const is_unactive = $(this).hasClass('btn-unactive');
    const groupId = $(this).data('group');
    const colorId = $(this).data('color');
    
    if (groupId && is_unactive) {
      $(this).toggleClass('btn-unactive');
      $.post('/base/shields/rolet/roletColorsGroups/group/active/' + groupId, {
        
      }, function(data) {     
        $('.is-standart-group').remove();   
        $('.btn-active-group').each(function() {
          if ($(this).data('group') === groupId) {
            $(this).before('<span class="is-standart-group">standart </span>');
          } else {
            $(this).addClass('btn-unactive');
          }
        });
      });
    }
    if (colorId) {
      $(this).toggleClass('btn-unactive');
      $.post('/base/shields/rolet/roletColorsGroups/color/active/' + colorId, {

      },function (data) {

      })
    }
  });

  $('input[type="checkbox"]').change(function() {
    const isChecked = $(this).is(':checked');
    if (isChecked) {
      $(this).val('1');
    } else {
      $(this).val('0');
    }
  });



  $('.btn-add-group').click( function(e) {
    e.preventDefault();
    $('#popup-add-color-group-rolet .radio-colors-block').empty();
    $('#popup-add-color-group-rolet .radio-colors-block').append(
      radioColorsGroup.map( (color, index) => 
        `<label class="color-radio-tile">
          <input 
            type="radio" 
            id="add-color-group-rolet-radio-${index}" 
            name="colorGroup" 
            value="${color}" 
            ${index === 0 ? 'checked' : ''}/>
          <span class="color-swatch" style="background:${color};"></span>
        </label>`
      )
    );
    $('#popup-add-color-group-rolet').popup('show');
  })


  $('.btn-edit-group-colors').click(function(e) {
    e.preventDefault();
    const groupId = $(this).data('group');
    $.get('/base/shields/rolet/roletColorsGroups/color/getGroup/' + groupId, function(data) {
      console.log(data)
      $('#popup-edit-color-group-rolet input[name="name"]').val(data.group.name);
      $('#popup-edit-color-group-rolet input[name="position"]').val(data.group.position);
      $('#popup-edit-color-group-rolet input[name="group_id"]').val(groupId);
      
      $('#popup-edit-color-group-rolet .radio-colors-block').empty();
      $('#popup-edit-color-group-rolet .radio-colors-block').append(
        radioColorsGroup.map( (color, index) => 
          `<label class="color-radio-tile">
            <input 
              type="radio" 
              id="add-color-group-rolet-radio-${index}" 
              name="colorGroup" 
              value="${color}" 
              ${color === data.group.img ? 'checked' : ''}/>
            <span class="color-swatch" style="background:${color};"></span>
          </label>`
        )
      );
      
      $('#popup-edit-color-group-rolet').popup('show');
    })
  })

  $('.btn-delete-group-colors').click(function(e) {
    e.preventDefault();
    const groupId = $(this).data('group');
    $('#popup-delete-color-group-rolet input[name="group_id"]').val(groupId);
    $('#popup-delete-color-group-rolet').popup('show');
  })


  $('.btn-add-color').click( function(e) {
    e.preventDefault();
    $('#popup-add-color-rolet input.input-default').val('');
    $('#popup-add-color-rolet').popup('show');
  })

  $('.btn-edit-color').click(function(e) {
    e.preventDefault();
    const colorId = $(this).data('color');
    $.get('/base/shields/rolet/roletColorsGroups/color/getColor/' + colorId, function(data) {
      console.log(data)
      $('#popup-edit-color-rolet input[name="name"]').val(data.color.name);
      $('#popup-edit-color-rolet input[name="position"]').val(data.color.position);
      $('#popup-edit-color-rolet input[name="color_id"]').val(colorId);
      $('#popup-edit-color-rolet img.rolet-image').attr('src', data.color.img);
      
      $('#popup-edit-color-rolet').popup('show');
    })
  })

  $('.btn-delete-color').click(function(e) {
    e.preventDefault();
    const groupId = $(this).data('color');
    $('#popup-delete-color-rolet input[name="color_id"]').val(groupId);
    $('#popup-delete-color-rolet').popup('show');
  })

  function submitAddColorGroup(e) {
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

  function submitEditColorGroup(e) {
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

  function submitDeleteColorGroup(e) {
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
        console.log('error');
      }
    }
  }
  

  function submitAddColor(e) {
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

  function submitEditColor(e) {
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

  function submitDeleteColor(e) {
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
        console.log('error');
      }
    }
  }

  function addImgColor (e) {
    selectImageRolet('#popup-add-color-rolet');
  }
  function editImgColor (e) {
    selectImageRolet('#popup-edit-color-rolet');
  }

  function selectImageRolet (popup) {
    $(popup + ' input.rolet-image-file').trigger('click');
  }
});
