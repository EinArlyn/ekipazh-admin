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
    }
  });

  $('.pop-up-close-wrap').click(function(e) {
    e.preventDefault();

    $('.pop-up').popup('hide');
    $('.pop-up-default').popup('hide');
  });

  $('.spillway-folder-add').click(function(e) {
    e.preventDefault();

    $('.add-new-spillway-folder-pop-up').popup('show');
    $('input[name="max_size"]').val('0');
    setTimeout(function() {
      $('#new-group-name').focus();
    }, 200);
  });

    /** Select image */
    $('#spillway-group-img').click(function() {
      $('#select-spillway-group-image').trigger('click');
    });

    /** On image change */
    $('#select-spillway-group-image').change(function (evt) {
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
            $('#spillway-group-image').attr('src', e.target.result);
          };
        })(f);
        reader.readAsDataURL(f);
      }
    });
    /** Submit adding new spillway group */
    $('#submit-add-new-spillway-group').click(function(e) {
      e.preventDefault();

      $('#add-new-spillway-folder-form').submit();
      // var name = $('#new-group-name').val();
      // var position = $('#new-group-position-popup').val();
      // var link = $('#new-group-link').val();
      // var description = $('#new-group-description').val();
      // var img = $('#spillway-group-image').attr('src');

      // $.post('/base/options/spillways/add-new-folder', {
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
    $('#add-new-spillway-folder-form').on('submit', function(e) {
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

  /** Edit spillway folder */
  $('.spillway-folder-edit').click(function(e) {
    e.preventDefault();

    var folderId = $(this).attr('data-folder');
    $('#edit-spillway-folder-id').val(folderId);
    $.get('/base/options/spillways/get-folder/' + folderId, function(data) {
      if (data.status) {
        var img = (data.folder.img ? data.folder.img : '/local_storage/default.png');

        $('#group-position-popup').val(data.folder.position);
        $('#group-name-popup').val(data.folder.name);
        $('#group-link-popup').val(data.folder.link);
        $('#group-description-popup').val(data.folder.description);
        $('input[name="max_size"]').val(data.folder.max_size);
        $('#edit-spillway-group-image').attr('src', img);
        $('#submit-edit-spillway-group').attr('data-folder', folderId);
        $('.edit-spillway-folder-pop-up').popup('show');

        if (data.folder.is_push) {
          $('#checkbox-spillway-push').prop('checked', true);
        } else {
          $('#checkbox-spillway-push').prop('checked', false);
        }
      }
    });
  });

    /** Change edit glass group image */
    $('#edit-spillway-group-img').click(function() {
      $('#edit-select-spillway-group-image').trigger('click');
    });

    /** On image change */
    $('#edit-select-spillway-group-image').change(function (evt) {
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
            $('#edit-spillway-group-image').attr('src', e.target.result);
          };
        })(f);
        reader.readAsDataURL(f);
      }
    });

    /** Submit editing group */
    $('#submit-edit-spillway-group').click(function(e) {
      e.preventDefault();

      $('#edit-spillway-folder-form').submit();
      // var folderId = $(this).attr('data-folder');
      // var name = $('.edit-spillway-folder-pop-up #group-name-popup').val();
      // var link = $('.edit-spillway-folder-pop-up #group-link-popup').val();
      // var position = $('.edit-spillway-folder-pop-up #group-position-popup').val();
      // var description = $('.edit-spillway-folder-pop-up #group-description-popup').val();
      // var img = $('.edit-spillway-folder-pop-up #edit-spillway-group-image').attr('src');

      // $.post('/base/options/spillways/save-folder/' + folderId, {
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
    $('#edit-spillway-folder-form').on('submit', function(e){
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

  /** Delete spillway folder */
  $('.spillway-folder-delete').click(function(e) {
    e.preventDefault();

    var folderId = $(this).attr('data-folder');
    $('#delete-spillway-folder-submit').attr('data-folder', folderId);
    $('.delete-spillway-folder-alert').popup('show');
  });

    /** Submit delete folder */
    $('#delete-spillway-folder-submit').click(function(e) {
      e.preventDefault();

      var folderId = $(this).attr('data-folder');
      $.post('/base/options/spillways/remove-folder', {
        folderId: folderId
      }, function(data) {
        if (data.status) {
          window.location.reload();
        }
      });
    });
    /** Cancel delete folder */
    $('#delete-spillway-folder-deny').click(function(e) {
      e.preventDefault();
      $('.delete-spillway-folder-alert').popup('hide');
    });

  /** Init popups */
  $('.add-new-spillway-folder-pop-up').popup({
    type: 'overlay',
    autoopen: false,
    scrolllock: true,
    transition: 'all 0.3s'
  });
  $('.edit-spillway-folder-pop-up').popup({
    type: 'overlay',
    autoopen: false,
    scrolllock: true,
    transition: 'all 0.3s'
  });
  $('.delete-spillway-folder-alert').popup({
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
});
