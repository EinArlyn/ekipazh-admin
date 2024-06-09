$(function () {
  $(window).load(function() {
    setTimeout(function() {
      $('.loader-wrapper').hide();
    }, 600);
    setTimeout(function() {
      $(".load-content").show();
    }, 600);
  });

  // TODO: Use similar classes
  $('.pop-up-close-wrap, .delete-alert #deny-remove, input.pop-up-deny-btn').click(function(e) {
    e.preventDefault();
    $('.delete-alert, .popup, .pop-up').popup('hide');
    // TODO: reset TEMPORARY variables
  });
});

function startLoader () {
  var loaderDiv = document.getElementsByClassName('loader-ico');
  loaderDiv[0].style.visibility = 'visible';
}

function stopLoader () {
  var loaderDiv = document.getElementsByClassName('loader-ico');
  setTimeout(function() {
    loaderDiv[0].style.visibility = 'hidden';
  }, 2000);
}

function submitForm (form, onResponse) {
  $.ajax({
    type: 'POST',
    url: form.action,
    data: form.data,
    cache: false,
    contentType: false,
    processData: false,
    success: onResponse,
    error: function (data) {
      stopLoader();
      console.log("error");
      console.log(data);
    }
  });
}


function getInputImage (evt, cb) {
  var files = evt.target.files;

  for (var i = 0, f; f = files[i]; i++) {
    // Only process image files.
    if (!f.type.match('image.*')) {
      cb(new Error('Invalid image'));
    }

    var reader = new FileReader();
    // Closure to capture the file information.
    reader.onload = (function(theFile) {
      return function(e) {
        cb(null, e.target.result);
      };
    })(f);

    reader.readAsDataURL(f);
  }
}
