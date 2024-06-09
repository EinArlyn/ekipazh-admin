$(function () {
  var localizerOption = { resGetPath: '/assets/javascripts/vendor/localizer/__ns__-__lng__.json'};
  i18n.init(localizerOption);

  /** Get mosquitos */
  $('.profile-system-btn').click(getMosquitos); // related to Profile systems
  $('.unbinded-btn').click(getUnbindedMosquitos);


  /** Add new mosquito */
  $('.add-mosquito-btn').click(addNewMosquito);
  $('#submit-mosquito').click(triggerAddMosquitoSubmit);
  $('#add-mosquito-form').on('submit', submitMosquito);

  /** Edit mosquito name */
  $('#submit-mosquito-name').click(triggerChangeMosquitoNameSubmit);
  $('#edit-mosquito-form').on('submit', submitChangeMosquito);

  /** Init popups */
  $('#add-misquito-pop-up, #edit-misquito-pop-up').popup({
    type: 'overlay',
    autoopen: false,
    scrolllock: true,
    transition: 'all 0.3s'
  });

  function getMosquitos (e) {
    e.preventDefault();

    var profileId = $(this).attr('data-id');

    if ($(this).hasClass('opened')) {
      $('.mosquitos-list[data-id="' + profileId + '"]').empty();
      $('.mosquito-container[data-id="' + profileId + '"]').hide();
      $(this).removeClass('opened');
    } else {
      startLoader();
      $(this).addClass('opened');

      $.get('/base/mosquito/profile/' + profileId, function (data) {
        if (data.status) {
          if (data.mosquitos.length) {
            for (var i = 0, len = data.mosquitos.length; i < len; i++) {
              __appendMosquitoTemplate(data.mosquitos[i], data.mosquitoProfiles, data.mosquitoCloths, profileId);
            }
          } else {
            $('.mosquitos-list[data-id="' + profileId + '"]').append('<div class="empty-mosquito-list">' + i18n.t('Mosquitos are missing') + '</div>');
          }
          $('.mosquito-container[data-id="' + profileId + '"]').show();
          stopLoader();
        }
      });
    }
  }

  function getUnbindedMosquitos (e) {
    e.preventDefault();

    if ($(this).hasClass('opened')) {
      $('.mosquitos-list[data-id="0"]').empty();
      $('.mosquito-container[data-id="0"]').hide();
      $(this).removeClass('opened');
    } else {
      startLoader();
      $(this).addClass('opened');

      $.get('/base/mosquito/unbinded', function (data) {
        if (data.status) {
          if (data.mosquitos.length) {
            for (var i = 0, len = data.mosquitos.length; i < len; i++) {
              __appendMosquitoTemplate(data.mosquitos[i], data.mosquitoProfiles, data.mosquitoCloths, 0);
            }
          } else {
            $('.mosquitos-list[data-id="' + 0 + '"]').append('<div class="empty-mosquito-list">' + i18n.t('Mosquitos are missing') + '</div>');
          }
          $('.mosquito-container[data-id="' + 0 + '"]').show();
          stopLoader();
        }
      });
    }
  }

  function __appendMosquitoTemplate (mosquito, mosquitoProfiles, mosquitoCloths, profileId) {
    var mosquitoProfileOptions = '<option value="0">' + i18n.t('Not exist') + '</option>';
    var mosquitoClothOptions = '<option value="0">' + i18n.t('Not exist') + '</option>';
    var selectQuery = 'table.mosquito-list-table[data-id="' + mosquito.id + '"] ';

    for (var i = 0, len1 = mosquitoProfiles.length; i < len1; i++) {
      mosquitoProfileOptions += '<option value="' + mosquitoProfiles[i].id + '">' +
        mosquitoProfiles[i].name +
      '</option>';
    }

    for (var j = 0, len2 = mosquitoCloths.length; j < len2; j++) {
      mosquitoClothOptions += '<option value="' + mosquitoCloths[j].id + '">' +
        mosquitoCloths[j].name +
      '</option>';
    }

    $('.mosquitos-list[data-id="' + profileId + '"]').append('<table data-id="' + mosquito.id + '" class="mosquito-list-table" border="0" cellspacing="0" cellpadding="2">' +
      '<tr class="mosquito-header">' +
        '<td class="mosquito-name-td" colspan="5">' +
          '<span class="mosquito-name-holder" data-id="' + mosquito.id + '">' +
            mosquito.name +
          '</span>' +
          '<a href="#" class="edit-btn edit-mosquito-name-btn" data-profile-id="' + profileId + '" data-id="' + mosquito.id + '" data-group-id="' + mosquito.group_id + '"></a>' +
        '</td>' +
      '</tr>' +
      '<tr>' +
        '<th>' + i18n.t('Bottom') + '</th>' +
        '<th>' + i18n.t('Left') + '</th>' + '<th>'+ i18n.t('Top') + '</th>' +
        '<th>' + i18n.t('Right') + '</th>' + '<th>' + i18n.t('Cloth') + '</th>' +
      '</tr>' +
      '<tr>' +
        '<td>' +
          '<select class="select-default mosquito-input" data-profile-id="' + profileId + '" data-id="' + mosquito.id + '" name="bottom_id">' +
            mosquitoProfileOptions +
          '</select>' +
          '<input class="input-default input-waste mosquito-input" data-profile-id="' + profileId + '" data-id="' + mosquito.id + '" type="text" name="bottom_waste" value="' + mosquito.bottom_waste + '">' +
        '</td>' +
        '<td>' +
          '<select class="select-default mosquito-input" data-profile-id="' + profileId + '" data-id="' + mosquito.id + '" name="left_id">' +
            mosquitoProfileOptions +
          '</select>' +
          '<input class="input-default input-waste mosquito-input" data-profile-id="' + profileId + '" data-id="' + mosquito.id + '" type="text" name="left_waste" value="' + mosquito.left_waste + '">' +
        '</td>' +
        '<td>' +
          '<select class="select-default mosquito-input" data-profile-id="' + profileId + '" data-id="' + mosquito.id + '" name="top_id">' +
            mosquitoProfileOptions +
          '</select>' +
          '<input class="input-default input-waste mosquito-input" data-profile-id="' + profileId + '" data-id="' + mosquito.id + '" type="text" name="top_waste" value="' + mosquito.top_waste + '">' +
        '</td>' +
        '<td>' +
          '<select class="select-default mosquito-input" data-profile-id="' + profileId + '" data-id="' + mosquito.id + '" name="right_id">' +
            mosquitoProfileOptions +
          '</select>' +
          '<input class="input-default input-waste mosquito-input" data-profile-id="' + profileId + '" data-id="' + mosquito.id + '" type="text" name="right_waste" value="' + mosquito.right_waste + '">' +
        '</td>' +
        '<td>' +
          '<select class="select-default mosquito-input" data-profile-id="' + profileId + '" data-id="' + mosquito.id + '" name="cloth_id">' +
            mosquitoClothOptions +
          '</select>' +
          '<input class="input-default input-waste mosquito-input" data-profile-id="' + profileId + '" data-id="' + mosquito.id + '" type="text" name="cloth_waste" value="' + mosquito.cloth_waste + '">' +
        '</td>' +
      '</tr>' +
    '</table>');
    $(selectQuery + 'select[name="bottom_id"]').val(mosquito.bottom_id);
    $(selectQuery + 'select[name="left_id"]').val(mosquito.left_id);
    $(selectQuery + 'select[name="top_id"]').val(mosquito.top_id);
    $(selectQuery + 'select[name="right_id"]').val(mosquito.right_id);
    $(selectQuery + 'select[name="cloth_id"]').val(mosquito.cloth_id);
    $(selectQuery + '.mosquito-input').change(changeMosquitoOption);
    $(selectQuery + '.edit-mosquito-name-btn').click(editMosquitoName);
  }

  function changeMosquitoOption (e) {
    var value = $(this).val();
    var type = $(this).attr('name');
    var mosquitoId = $(this).attr('data-id');
    var profileId = $(this).attr('data-profile-id');
    startLoader();

    $.post('/base/mosquito/option/' + mosquitoId, {
      type: type,
      value: value,
      profileId: profileId
    }, function (data) {
      if (data.status) {
        $.toast({
          text : i18n.t('Changes saved'),
          showHideTransition: 'fade',
          allowToastClose: true,
          hideAfter: 3000,
          stack: 5,
          position: {top: '60px', right: '30px'}
        });
      } else {
        console.log(error);
      }
      stopLoader();
    });
  }

  function addNewMosquito (e) {
    e.preventDefault();

    var profileId = $(this).attr('data-id');
    $('#add-misquito-pop-up select[name="group_id"]').empty();

    $.get('/base/mosquito/folders', function (data) {
      var foldersOptions = '' +
        '<option value="0">' +
          i18n.t('Not exist') +
        '</option>';

      if (data.status) {
        if (data.folders && data.folders.length) {
          for (var i = 0, len = data.folders.length; i < len; i++) {
            foldersOptions += '' +
              '<option value="' + data.folders[i].id + '">' +
                data.folders[i].name +
              '</option>';
          }
        }
        $('#add-misquito-pop-up select[name="group_id"]').append(foldersOptions);
        $('#add-misquito-pop-up input[name="profile_id"]').val(profileId);
        $('#add-misquito-pop-up').popup('show');
      }
    });
  }

  function triggerAddMosquitoSubmit (e) {
    e.preventDefault();

    if ($('#input-mosquito-name').val().length > 0) {
      startLoader();
      $('#add-mosquito-form').submit();
    } else {
      $.toast({
        text : i18n.t('Fill the name field'),
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

  function submitMosquito (e) {
    e.preventDefault();

    var formData = new FormData(this);
    var formAction = $(this).attr('action');

    submitForm({ action: formAction, data: formData }, onResponse);

    function onResponse (data) {
      stopLoader();
      if (data.status) {
        $('.pop-up').popup('hide');
        __appendMosquitoTemplate(data.mosquito, data.mosquitoProfiles, data.mosquitoCloths, data.profileId);
        $('.mosquitos-list[data-id="' + data.profileId + '"] .empty-mosquito-list').remove();
      } else {
        console.log('error');
      }
    }
  }

  function editMosquitoName (e) {
    e.preventDefault();

    var mosquitoId = $(this).attr('data-id');
    var profileId = $(this).attr('data-profile-id');
    var groupId = $(this).attr('data-group-id');
    var name = $('.mosquito-name-holder[data-id="' + mosquitoId + '"]').text();

    $('#edit-misquito-pop-up select[name="group_id"]').empty();

    $.get('/base/mosquito/folders', function (data) {
      var foldersOptions = '' +
        '<option value="0">' +
          i18n.t('Not exist') +
        '</option>';

      if (data.status) {
        if (data.folders && data.folders.length) {
          for (var i = 0, len = data.folders.length; i < len; i++) {
            foldersOptions += '' +
              '<option value="' + data.folders[i].id + '">' +
                data.folders[i].name +
              '</option>';
          }
        }
        $('#edit-misquito-pop-up select[name="group_id"]').append(foldersOptions);
        $('#edit-misquito-pop-up select[name="group_id"]').val(groupId);
        $('#edit-misquito-pop-up input[name="mosquito_id"]').val(mosquitoId);
        $('#edit-misquito-pop-up input[name="profile_id"]').val(profileId);
        $('#edit-misquito-pop-up input[name="name"]').val(name);
        $('#edit-misquito-pop-up').popup('show');
      }
    });
  }

  function triggerChangeMosquitoNameSubmit (e) {
    e.preventDefault();

    if ($('#input-edit-mosquito-name').val().length > 0) {
      startLoader();
      $('#edit-mosquito-form').submit();
    } else {
      $.toast({
        text : i18n.t('Fill the name field'),
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

  function submitChangeMosquito (e) {
    e.preventDefault();

    var formData = new FormData(this);
    var formAction = $(this).attr('action');

    submitForm({ action: formAction, data: formData }, onResponse);

    function onResponse (data) {
      stopLoader();
      if (data.status) {
        $('.pop-up').popup('hide');
        $('.mosquito-name-holder[data-id="' + data.mosquitoId + '"]').text(data.name);
        $('a.edit-btn.edit-mosquito-name-btn[data-id="' + data.mosquitoId + '"]').attr('data-group-id', data.groupId);
      } else {
        console.log('error');
      }
    }
  }
});
