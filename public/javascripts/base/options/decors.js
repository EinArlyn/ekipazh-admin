$(function() {
    /** add new folder */
    
    /** edit folder */
    
    // edit color
    $('.color-add').click(addNewColor);
    $('.popup-add-color input.color-image-file').change(validateNewImageColor);
    $('.popup-add-color input.add-image-btn').click(addImageColor);
    $('.popup-edit-color input.add-image-btn').click(editImageColor);
    $('.popup-edit-color input.color-image-file').change(validateEditedImageColor);
    $('.btn-edit-color').click(editColor);
    $('form#edit-connector-color-form').on('submit', submitFolder);
    $('form#add-new-connector-color-form').on('submit', submitFolder);
    $('.btn-delete-color').click(removeColor);
    $('.alert-remove-color input.pop-up-submit-btn').click(submitRemoveColor);
  
    /** remove folder */
      
    $('#max-sizes').hide();
  
    /** Init popups */
    initPopups([
      '.popup-add-color',
      '.popup-edit-color',
      '.alert-remove-color'
    ]);
  
    
    function addNewColor (e) {
      $('.popup-add-color').popup('show');
    }
  
    
    
    function addImageColor (e) {
      selectImageColor('.popup-add-color');
    }
  
    
    
    function validateNewImageColor (e) {
      parseImage(e, '.popup-add-color');
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
  
    
    
    function editImageColor (e) {
      selectImageColor('.popup-edit-color');
    }
  
    
    function validateEditedImageColor (e) {
      parseImage(e, '.popup-edit-color');
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
  
    /**
     * Utils 
     */
    
    
    function selectImageColor (popup) {
      $(popup + ' input.color-image-file').trigger('click');
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
  });
  