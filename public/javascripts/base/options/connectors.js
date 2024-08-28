$(function() {
  /** add new folder */
  $('.folder-add').click(addNewFolder);
  $('.popup-add-folder input.add-image-btn').click(addImage);
  $('.popup-add-folder input.folder-image-file').change(validateNewImage);
  $('form#add-new-connector-folder-form').on('submit', submitFolder);
  /** edit folder */
  $('.btn-edit-folder').click(editFolder);
  $('.popup-edit-folder input.add-image-btn').click(editImage);
  $('.popup-edit-folder input.folder-image-file').change(validateEditedImage);
  $('form#edit-connector-folder-form').on('submit', submitFolder);
  /** remove folder */
  $('.btn-delete-folder').click(removeFolder);
  $('.alert-remove-folder input.pop-up-submit-btn').click(submitRemoveFolder);


  // work with color 
  $('.color-add').click(addNewColor);
  $('.btn-delete-color').click(removeColor);
  $('.btn-edit-color').click(editColor);
  $('.alert-remove-color input.pop-up-submit-btn').click(submitRemoveColor);
  $('.popup-add-color input.add-image-btn').click(addImageColor);
  $('.popup-edit-color input.add-image-btn').click(editImageColor);
  $('form#add-new-connector-color-form').on('submit', submitFolder);
  $('form#edit-connector-color-form').on('submit', submitFolder);

  /** Init popups */
  initPopups([
    '.popup-add-folder',
    '.popup-edit-folder',
    '.alert-remove-folder',
    '.popup-add-color',
    '.popup-edit-color',
    '.alert-remove-color'
  ]);

  function addNewFolder (e) {
    $('input[name="max_size"]').val('0');
    $('.popup-add-folder').popup('show');
  }

  function addImage (e) {
    selectImage('.popup-add-folder');
  }

  function validateNewImage (e) {
    parseImage(e, '.popup-add-folder');
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

  function editFolder (e) {
    var folderId = $(this).attr('data-folder');

    $.get('/base/options/folders/get/' + folderId, function (data) {
      if (data.status) {
        $('.popup-edit-folder input[name="folder_id"]').val(data.folder.id);
        $('.popup-edit-folder input[name="position"]').val(data.folder.position);
        $('.popup-edit-folder input[name="name"]').val(data.folder.name);
        $('.popup-edit-folder input[name="link"]').val(data.folder.link);
        $('.popup-edit-folder textarea[name="description"]').val(data.folder.description);
        $('input[name="max_size"]').val(data.folder.max_size);
        $('.popup-edit-folder img.folder-image').attr('src', data.folder.img);
        $('.popup-edit-folder').popup('show');
      }
    });
  }

  function editImage (e) {
    selectImage('.popup-edit-folder');
  }

  function validateEditedImage (e) {
    parseImage(e, '.popup-edit-folder');
  }

  function removeFolder (e) {
    var folderId = $(this).attr('data-folder');
    window.localStorage.setItem('folderId', folderId);
    $('.alert-remove-folder').popup('show');
  }

  function submitRemoveFolder (e) {
    var folderId = window.localStorage.getItem('folderId');
    
    $.post('/base/options/folders/remove', {
      folderId: folderId
    }, function (data) {
      if (data.status) {
        $('.alert-remove-folder').popup('hide');
        window.location.reload();
      }
    })
  }

  /**
   * Utils 
   */
  function selectImage (popup) {
    $(popup + ' input.folder-image-file').trigger('click');
  }

  function parseImage (evt, popup) {
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
          $(popup + ' img.folder-image').attr('src', e.target.result);
        };
      })(f);
      reader.readAsDataURL(f);
    }
  }

  function initPopups (popupsArray) {
    popupsArray.forEach(function (popupName) {
      $(popupName).popup({
        type: 'overlay',
        autoopen: false,
        scrolllock: true,
        transition: 'all 0.3s'
      });
    });
  }

  // country checkbox
  $('td.country-item-connectors input').click(function() {
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
