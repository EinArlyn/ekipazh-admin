$(function () {
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
    }
  });

  // work with color 
  $('.color-add').click(addNewColor);
  $('.btn-delete-color').click(removeColor);
  $('.btn-edit-color').click(editColor);
  $('.alert-remove-color input.pop-up-submit-btn').click(submitRemoveColor);
  $('.popup-add-color input.add-image-btn').click(addImageColor);
  $('.popup-edit-color input.add-image-btn').click(editImageColor);
  $('form#add-new-connector-color-form').on('submit', submitFolder);
  $('form#edit-connector-color-form').on('submit', submitFolder);

  $('.pop-up-close-wrap').click(function(e) {
    e.preventDefault();

    $('.pop-up').popup('hide');
    $('.pop-up-default').popup('hide');
  });

  $('.visor-folder-add').click(function(e) {
    e.preventDefault();

    $('.add-new-visor-folder-pop-up').popup('show');
    $('input[name="max_size"]').val('0');
    setTimeout(function() {
      $('#new-group-name').focus();
    }, 200);
  });

    /** Select image */
    $('#visor-group-img').click(function() {
      $('#select-visor-group-image').trigger('click');
    });

    /** On image change */
    $('#select-visor-group-image').change(function (evt) {
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
            $('#visor-group-image').attr('src', e.target.result);
          };
        })(f);
        reader.readAsDataURL(f);
      }
    });
    /** Submit adding new visor group */
    $('#submit-add-new-visor-group').click(function(e) {
      e.preventDefault();

      $('#add-new-visor-folder-form').submit();
      // var name = $('#new-group-name').val();
      // var position = $('#new-group-position-popup').val();
      // var link = $('#new-group-link').val();
      // var description = $('#new-group-description').val();
      // var img = $('#visor-group-image').attr('src');

      // $.post('/base/options/visors/add-new-folder', {
      //   name: name,
      //   position: position,
      //   link: link,
      //   description: description,
      //   img: img
      // }, function(data) {
      //   if (data.status) {
      //     window.location.reload();
      //   }
      // });
    });
    $('#add-new-visor-folder-form').on('submit', function(e) {
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
    });

  /** Edit visor folder */
  $('.visor-folder-edit').click(function(e) {
    e.preventDefault();

    var folderId = $(this).attr('data-folder');
    $('#edit-visor-folder-id').val(folderId);
    $.get('/base/options/visors/get-folder/' + folderId, function(data) {
      if (data.status) {
        var img = (data.folder.img ? data.folder.img : '/local_storage/default.png');

        $('#group-position-popup').val(data.folder.position);
        $('#group-name-popup').val(data.folder.name);
        $('#group-link-popup').val(data.folder.link);
        $('#group-description-popup').val(data.folder.description);
        $('input[name="max_size"]').val(data.folder.max_size);
        $('#edit-visor-group-image').attr('src', img);
        $('#submit-edit-visor-group').attr('data-folder', folderId);
        $('.edit-visor-folder-pop-up').popup('show');

        if (data.folder.is_push) {
          $('#checkbox-visor-push').prop('checked', true);
        } else {
          $('#checkbox-visor-push').prop('checked', false);
        }
      }
    });
  });

    /** Change edit glass group image */
    $('#edit-visor-group-img').click(function() {
      $('#edit-select-visor-group-image').trigger('click');
    });

    /** On image change */
    $('#edit-select-visor-group-image').change(function (evt) {
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
            $('#edit-visor-group-image').attr('src', e.target.result);
          };
        })(f);
        reader.readAsDataURL(f);
      }
    });

    /** Submit editing group */
    $('#submit-edit-visor-group').click(function(e) {
      e.preventDefault();

      $('#edit-visor-folder-form').submit();
      // var folderId = $(this).attr('data-folder');
      // var name = $('.edit-visor-folder-pop-up #group-name-popup').val();
      // var link = $('.edit-visor-folder-pop-up #group-link-popup').val();
      // var position = $('.edit-visor-folder-pop-up #group-position-popup').val();
      // var description = $('.edit-visor-folder-pop-up #group-description-popup').val();
      // var img = $('.edit-visor-folder-pop-up #edit-visor-group-image').attr('src');

      // $.post('/base/options/visors/save-folder/' + folderId, {
      //   name: name,
      //   link: link,
      //   position: position,
      //   description: description,
      //   img: img
      // }, function(data) {
      //   if (data.status) {
      //     $('.pop-up').popup('hide');
      //     window.location.reload();
      //   }
      // });
    });
    $('#edit-visor-folder-form').on('submit', function(e) {
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
    });

  /** Delete visor folder */
  $('.visor-folder-delete').click(function(e) {
    e.preventDefault();

    var folderId = $(this).attr('data-folder');
    $('#delete-visor-folder-submit').attr('data-folder', folderId);
    $('.delete-visor-folder-alert').popup('show');
  });

    /** Submit delete folder */
    $('#delete-visor-folder-submit').click(function(e) {
      e.preventDefault();

      var folderId = $(this).attr('data-folder');
      $.post('/base/options/visors/remove-folder', {
        folderId: folderId
      }, function(data) {
        if (data.status) {
          window.location.reload();
        }
      });
    });
    /** Cancel delete folder */
    $('#delete-visor-folder-deny').click(function(e) {
      e.preventDefault();
      $('.delete-visor-folder-alert').popup('hide');
    });

  /** Init popups */
  $('.add-new-visor-folder-pop-up').popup({
    type: 'overlay',
    autoopen: false,
    scrolllock: true,
    transition: 'all 0.3s'
  });
  $('.edit-visor-folder-pop-up').popup({
    type: 'overlay',
    autoopen: false,
    scrolllock: true,
    transition: 'all 0.3s'
  });
  $('.delete-visor-folder-alert').popup({
    type: 'overlay',
    autoopen: false,
    scrolllock: true,
    transition: 'all 0.3s'
  });

  function showToaster (message, isError) {
    if (isError) {
      $.toast({
        text : message,
        showHideTransition: 'fade',
        allowToastClose: true,
        hideAfter: 3000,
        stack: 5,
        position: {top: '60px', right: '30px'},
        bgColor: '#FF6633',
        textColor: '#fff'
      });
    } else {
      $.toast({
        text : message,
        showHideTransition: 'fade',
        allowToastClose: true,
        hideAfter: 3000,
        stack: 5,
        position: {top: '60px', right: '30px'}
      });
    }
  }

  // country checkbox
  $('td.country-item-visors input').click(function() {
    countryId = $(this).attr('value');
    country_status = $(this).is(":checked");
    var CheckCountry ={};
    if (country_status)
    {
       CheckCountry[countryId] = 1;
    }
    else
    {
       CheckCountry[countryId] = 0;
    }
   setAddElemsCountry($(this).attr('data-addElems-id'), CheckCountry);
  });

  function setAddElemsCountry(addElemsId, CheckCountry) {
    $.post('/base/options/getAddElemsCountry/' + addElemsId, CheckCountry
    , function(data) {
      if (!CheckCountry)
      {
        $("[name='checkAddElems']").each(function() {
            if (data[$(this).attr('value')]){
              $(this).prop('checked', true);
            }
            else{
              $(this).prop('checked', false);
            }
        });
      }
    });
  }
  
  // work with color
  function addNewColor (e) {
    $('.popup-add-color').popup('show');
  }
  function editColor (e) {
    var colorId = $(this).attr('data-color');
    $.get('/base/options/colors/get/' + colorId, function (data) {
      if (data.status) {
        $('.popup-edit-color input[name="color_id"]').val(data.color.id);
        $('.popup-edit-color input[name="name"]').val(data.color.name);
        $('.popup-edit-color img.color-image').attr('src', data.color.img);
        $('.popup-edit-color').popup('show');
      }
    })
  }
  function removeColor (e) {
    var colorId = $(this).attr('data-color');
    window.localStorage.setItem('colorId', colorId);
    $('.alert-remove-color').popup('show');
  }
  function submitRemoveColor (e) {
    var colorId = window.localStorage.getItem('colorId');
    
    $.post('/base/options/colors/remove', {
      colorId: colorId
    }, function (data) {
      if (data.status) {
        $('.alert-remove-color').popup('hide');
        window.location.reload();
      }
    })
  }
  function addImageColor (e) {
    selectImageColor('.popup-add-color');
  }
  function editImageColor (e) {
    selectImageColor('.popup-edit-color');
  }
  function selectImageColor (popup) {
    $(popup + ' input.color-image-file').trigger('click');
  }
  function submitFolder (e) {
    e.preventDefault();

    var formData = new FormData(this);
    var formAction = $(this).attr('action');

    submitForm({ action: formAction, data: formData }, onResponse);

    function onResponse (data) {
      if (data.status) {
        window.location.reload();
      }
    }
  }
});
