$(function () {
  var localizerOption = { resGetPath: '/assets/javascripts/vendor/localizer/__ns__-__lng__.json'};
  var urlRegExp = /[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/;
  i18n.init(localizerOption);

  $('#lamination-select').change(function () {
    var selectedOption = $('#lamination-select option:selected').val();
    if (selectedOption == 1) {
      $('.checked-option').addClass('disabled');
      window.location.href = '/base/options/laminations';
    } else if (selectedOption == 2) {
      $('.checked-option').addClass('disabled');
      window.location.href = '/base/options/discounts';
    } else if (selectedOption == 3) {
      $('.checked-option').addClass('disabled');
      window.location.href = '/base/options/coefficients';
    } else if (selectedOption == 4) {
      $('.checked-option').addClass('disabled');
      window.location.href = '/base/options/glazed-window';
    } else if (selectedOption == 5) {
      $('.checked-option').addClass('disabled');
      window.location.href = '/base/options/window-sills';
    } else if (selectedOption == 6) {
      $('.checked-option').addClass('disabled');
      window.location.href = '/base/options/spillways';
    } else if (selectedOption == 7) {
      $('.checked-option').addClass('disabled');
      window.location.href = '/base/options/visors';
    } else if (selectedOption == 8) {
      $('.checked-option').addClass('disabled');
      window.location.href = '/base/options/suppliers';
    } else if (selectedOption == 9) {
      $('.checked-option').addClass('disabled');
      window.location.href = '/base/options/currency';
    } else if (selectedOption == 10) {
      $('.checked-option').addClass('disabled');
      window.location.href = '/base/options/general';
    } else if (selectedOption == 11) {
      $('.checked-option').addClass('disabled');
      window.location.href = '/base/options/application';
    } else if (selectedOption == 12) {
      $('.checked-option').addClass('disabled');
      window.location.href = '/base/options/connectors';
    } else if (selectedOption == 13) {
      $('.checked-option').addClass('disabled');
      window.location.href = '/base/options/mosquitos';
    } else if (selectedOption == 14) {
      $('.checked-option').addClass('disabled');
      window.location.href = '/base/options/doorhandles';
    } else if (selectedOption == 15) {
      $('.checked-option').addClass('disabled');
      window.location.href = '/base/options/decors';
    } else if (selectedOption == 17) {
      $('.checked-option').addClass('disabled');
      window.location.href = '/base/options/holes';
    } else if (selectedOption == 16) {
      $('.checked-option').addClass('disabled');
      window.location.href = '/base/options/otherelems';
    } else if (selectedOption == 18) {
      $('.checked-option').addClass('disabled');
      window.location.href = '/base/options/presets';
    }
  });

  /** Link for application */
  $('#app-link-input').keyup(activateEditLinkBtn);
  $('#app-link-sumbit').click(editLink);

  /** Add new template */
  $('.template-add-td').click(addTemplatePopup);
  $('#template-add-img').click(selectNewTemplateImg);
  $('#select-template-add-image').change(validateImgAndCreateBlob);
  $('#submit-add-new-template').click(addNewTemplateBtn);
  $('#add-new-tempalte-form').on('submit', submitAddNewTemplate)
  $('#add-tmplt-select-type').change(changeNewTemplateType);

  /** Edit template */
  $('.edit-template-btn').click(editTemplate);
  $('#submit-edit-template').click(submitEditTemplate);
  $('#template-edit-img').click(selectEditTemplateImg);
  $('#select-template-edit-image').change(editImgAndCreateBlob)
  $('#edit-tempalte-form').on('submit', onSubmitEditTemplate);
  $('#edit-type-select').change(changeEditTemplateType);

  /** Remove template */
  $('.remove-template-btn').click(removeTemplate);
  $('#delete-template-deny').click(denyRemoving);
  $('#delete-template-submit').click(submitRemoveTemplate);

  function activateEditLinkBtn(e) {
    $('#app-link-sumbit').prop('disabled', false);
  }

  function editLink(e) {
    e.preventDefault();

    var link = $('#app-link-input').val();
    if (!link || link.match(urlRegExp)) {
      $.post('/base/options/application/edit-link', {
        link: link
      }, function(data) {
        if (data.status) {
          $('#app-link-sumbit').prop('disabled', true);
          $.toast({
            text : 'Ссылка изменена',
            showHideTransition: 'fade',
            allowToastClose: true,
            hideAfter: 3000,
            stack: 5,
            position: {top: '60px', right: '30px'}
          });
        }
      });
    } else {
      $.toast({
        text : 'Неверный адрес ссылки',
        showHideTransition: 'fade',
        allowToastClose: true,
        hideAfter: 3000,
        stack: 5,
        position: {top: '60px', right: '30px'},
        bgColor: '#FF6633',
        textColor: '#fff'
      });
    }
  }

  function addTemplatePopup() {
    $('.add-new-tempalte-pop-up').popup('show');
  }

  function selectNewTemplateImg(e) {
    e.preventDefault();
    $('#select-template-add-image').trigger('click');
  }

  function validateImgAndCreateBlob(evt) {
    var files = evt.target.files;
    for (var i = 0, f; f = files[i]; i++) {
      // Only process image files.
      if (!f.type.match('image.*')) {
        continue;
      }
      var reader = new FileReader();
      // Closure to capture the file information.
      reader.onload = (function(theFile) {
        return function(e) {
          $('#template-add-img-box').attr('src', e.target.result);
        };
      })(f);
      reader.readAsDataURL(f);
    }
  }

  function addNewTemplateBtn(e) {
    var image = $('#select-template-add-image').val();
    if (image) {
      $('#add-new-tempalte-form').submit();
    } else {
      $.toast({
        text : 'Выбирите картинку',
        showHideTransition: 'fade',
        allowToastClose: true,
        hideAfter: 3000,
        stack: 5,
        position: {top: '60px', right: '30px'},
        bgColor: '#FF6633',
        textColor: '#fff'
      });
    }
  }

  function submitAddNewTemplate(e) {
    e.preventDefault();

    var formData = new FormData(this);

    $.ajax({
      type:'POST',
      url: $(this).attr('action'),
      data: formData,
      cache: false,
      contentType: false,
      processData: false,
      success: function(data) {
        if (data.status) {
          setTimeout(function() {
            $('.pop-up').popup('hide');
            window.location.reload();
          }, 300);
        }
      },
      error: function(data){
        console.log("error");
        console.log(data);
      }
    });
  }

  function changeNewTemplateType(e) {
    e.preventDefault();
    $('#add-tmplt-select-template').find('option').remove();

    if ($(this).val() == '1') {
      for (var i = 1; i < 12; i++) {
        $('#add-tmplt-select-template').append('<option value="' + i + '">' + i + '</option>');
      }
    } else {
      $('#add-tmplt-select-template').append('<option value="1">1</option>');
    }
  }

  function editTemplate(e) {
    e.preventDefault();

    var templateId = $(this).attr('data-template');

    $.get('/base/options/application/get-template/' + templateId, function(data) {
      if (data.status) {
        $('#edit-type-select').val(data.template.group_id);
        changeEditTemplateType();
        $('#template-id-input').val(data.template.id);
        $('#edit-desc-1').val(data.template.desc_1);
        $('#edit-desc-2').val(data.template.desc_2);
        $('#edit-position').val(data.template.position);
        $('#template-edit-img-box').attr('src', data.template.img);
        $('#edit-template-select').val(data.template.template_id);
        $('.edit-tempalte-pop-up').popup('show');
      }
    });
  }

  function submitEditTemplate(e) {
    e.preventDefault();
    $('#edit-tempalte-form').submit();
  }

  function onSubmitEditTemplate(e) {
    e.preventDefault();

    var formData = new FormData(this);

    $.ajax({
      type:'POST',
      url: $(this).attr('action'),
      data: formData,
      cache: false,
      contentType: false,
      processData: false,
      success: function(data) {
        if (data.status) {
          setTimeout(function() {
            $('.pop-up').popup('hide');
            window.location.reload();
          }, 300);
        }
      },
      error: function(data){
        console.log("error");
        console.log(data);
      }
    });
  }

  function changeEditTemplateType(e) {
    $('#edit-template-select').find('option').remove();

    if ($('#edit-type-select').val() == '1') {
      for (var i = 1; i < 12; i++) {
        $('#edit-template-select').append('<option value="' + i + '">' + i + '</option>');
      }
    } else {
      $('#edit-template-select').append('<option value="1">1</option>');
    }
  }

  function selectEditTemplateImg(e) {
    e.preventDefault();
    $('#select-template-edit-image').trigger('click');
  }

  function editImgAndCreateBlob(evt) {
    var files = evt.target.files;
    for (var i = 0, f; f = files[i]; i++) {
      // Only process image files.
      if (!f.type.match('image.*')) {
        continue;
      }
      var reader = new FileReader();
      // Closure to capture the file information.
      reader.onload = (function(theFile) {
        return function(e) {
          $('#template-edit-img-box').attr('src', e.target.result);
        };
      })(f);
      reader.readAsDataURL(f);
    }
  }

  function removeTemplate(e) {
    e.preventDefault();
    var tempalteId = $(this).attr('data-template');

    $('#delete-template-submit').attr('data-template', tempalteId)
    $('.delete-template-alert').popup('show');
  }

  function denyRemoving(e) {
    e.preventDefault();
    $('.pop-up').popup('hide');
    $('.pop-up-default').popup('hide');
  }

  function submitRemoveTemplate(e) {
    e.preventDefault();

    var templateId = $(this).attr('data-template');

    $.post('/base/options/application/remove-template', {
      id: templateId
    }, function(data) {
      if (data.status) {
        $('.pop-up').popup('hide');
        $('.pop-up-default').popup('hide');
        window.location.reload();
      }
    });
  }

  /** Init popups */
  $('.add-new-tempalte-pop-up').popup({
    type: 'overlay',
    autoopen: false,
    scrolllock: true,
    transition: 'all 0.3s'
  });
  $('.edit-tempalte-pop-up').popup({
    type: 'overlay',
    autoopen: false,
    scrolllock: true,
    transition: 'all 0.3s'
  });
  $('.delete-template-alert').popup({
    type: 'overlay',
    autoopen: false,
    scrolllock: true,
    transition: 'all 0.3s'
  });

  $('.pop-up-close-wrap').click(function(e) {
    e.preventDefault();

    $('.pop-up').popup('hide');
    $('.pop-up-default').popup('hide');
  });
});
