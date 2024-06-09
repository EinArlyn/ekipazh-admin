$(function () {
  var localizerOption = { resGetPath: '/assets/javascripts/vendor/localizer/__ns__-__lng__.json'};
  i18n.init(localizerOption);

  $('#user-country').change(function() {
    var countryId = $(this).val();

    $.get('/mynetwork/add_user/get-regions/' + countryId, function(data) {
      if (data.status) {
        $('#user-region').find('option').remove();
        for (var i = 0, len = data.regions.length; i < len; i++) {
          $('#user-region').append('<option value="' + data.regions[i].id + '">' + data.regions[i].name + '</option>');
        }
        $('#user-region').trigger('change');
      }
    });
  });

  $('#user-region').change(function() {
    var regionId = $(this).val();

    $.get('/mynetwork/add_user/get-cities/' + regionId, function(data) {
      if (data.status) {
        $('#user-city').find('option').remove();
        console.log(data.cities)
        for (var i = 0, len = data.cities.length; i < len; i++) {
          $('#user-city').append('<option value="' + data.cities[i].id + '">' + data.cities[i].name + '</option>');
        }
      }
    });
  });

  $('#add-user-avatar').click(function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();

    $('#user-avatar-input').trigger('click');
  });

  $('#user-avatar-input').change(function (evt) {
    var file = evt.target.files[0];
    var reader  = new FileReader();

    reader.onload = (function(theFile) {
      return function(e) {
        $('#user-avatar').attr('src', e.target.result);                         
      };
    })(file);

    reader.readAsDataURL(file);
  });

  $('#add-user-submit').click(addNewUserClick);

  $('#submit-new-user').on('submit', submitNewUser);

  function addNewUserClick (e) {
    e.preventDefault();

    var name = $('#user-name').val();
    var mobPhone = $('#user-mob-phone').val();
    var password = $('#user-password').val();

    if (name.length > 0) {
      if (mobPhone.length > 0) {
        if (password.length > 0) {
          $('#submit-new-user').submit();
        } else {
          $.toast({
            text : i18n.t('Fill in the password'),
            showHideTransition: 'fade',
            allowToastClose: true,
            hideAfter: 3000,
            stack: 5,
            position: {top: '60px', right: '30px'},
            bgColor: '#FF6633',
            textColor: '#fff'
          }); 
        }
      } else {
        $.toast({
          text : i18n.t('Fill in the mob. phone'),
          showHideTransition: 'fade',
          allowToastClose: true,
          hideAfter: 3000,
          stack: 5,
          position: {top: '60px', right: '30px'},
          bgColor: '#FF6633',
          textColor: '#fff'
        }); 
      }
    } else {
      $.toast({
        text : i18n.t('Fill in the username'),
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

  function submitNewUser (e) {
    e.preventDefault();

    var formData = new FormData(this);

    $.ajax({
      type: 'POST',
      url: $(this).attr('action'),
      data: formData,
      cache: false,
      contentType: false,
      processData: false,
      success: function (data) {
        if (data.status) {
          window.location.href = '/mynetwork';
        } else {
          $.toast({
            text : i18n.t('User with current phone number already exist'),
            showHideTransition: 'fade',
            allowToastClose: true,
            hideAfter: 3000,
            stack: 5,
            position: {top: '60px', right: '30px'},
            bgColor: '#FF6633',
            textColor: '#fff'
          }); 
        }
      },
      error: function (data) {
        console.log("error");
        console.log(data);
      }
    });
  }

});