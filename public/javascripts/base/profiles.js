$(function () {
  var localizerOption = { resGetPath: '/assets/javascripts/vendor/localizer/__ns__-__lng__.json'};
  i18n.init(localizerOption);

  /** Open profile group */
  $('.profile-group-button').click(function(e) {
    e.preventDefault();

    var profileGroupId = $(this).attr('value');
    if ($('#open' + profileGroupId).is('.group-opened')) {
      $('#open' + profileGroupId).hide(200);
      $('#open' + profileGroupId).removeClass('group-opened');
    } else {
      $('.group-opened').hide(200);
      $('.group-opened').removeClass('group-opened');
      $('#open' + profileGroupId).show(200);
      $('#open' + profileGroupId).addClass('group-opened');
    }
  });

  /** Edit profile group name */
  $('.profile-group-edit-button').click(function(e) {
    e.preventDefault();

    var profileGroupId = $(this).attr('value');

    $.get('/base/profiles/getProfileGroup/' + profileGroupId, function(data) {
      if (data.status) {
        var img = (data.profileGroup.img ? data.profileGroup.img : '/local_storage/default.png');

        $('#edit-profile-group-id-hidden').attr('value', data.profileGroup.id);
        $('#profile-group-name-edit-input').val(data.profileGroup.name);
        $('#profile-group-position-edit-input').val(data.profileGroup.position);
        $('#profile-group-link-edit-input').val(data.profileGroup.link);
        $('#profile-group-description-edit-input').val(data.profileGroup.description);
        $('#profile-edit-group-image').attr('src', img);
        $('.edit-profile-group-pop-up').popup('show');
      }
    });
  });
    /** Change hardware group image */
    $('#edit-profile-group-img').click(function() {
      $('#select-profile-edit-group-image').trigger('click');
    });

    /** On image change */
    $('#select-profile-edit-group-image').change(function (evt) {
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
            $('#profile-edit-group-image').attr('src', e.target.result);
          };
        })(f);
        reader.readAsDataURL(f);
      }
    });
    /** Submit editing group name */
    $('#profile-group-name-edit-pop-up-btn').click(function(e) {
      e.preventDefault();

      $('#edit-profile-group-form').submit();
      //var groupId = $(this).attr('value');
      //var groupName = $('#profile-group-name-edit-input').val();
      //var groupLink = $('#profile-group-link-edit-input').val();
      //var groupDescription = $('#profile-group-description-edit-input').val();
      //var groupImgSrc = $('#profile-edit-group-image').attr('src');

      // $.post('/base/profiles/saveProfileGroup', {
      //   groupId: groupId,
      //   groupName: groupName,
      //   groupLink: groupLink,
      //   groupDescription: groupDescription,
      //   groupImgSrc: groupImgSrc
      // }, function(data) {
      //   if (data.status) {
      //     $('.pop-up').popup('hide');
      //     window.location.reload();
      //   }
      // });
    });

    $('#edit-profile-group-form').on('submit', function(e) {
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
          var groupId = $('#edit-profile-group-id-hidden').val();
          $('.profile-group-button[value="' + groupId + '"] .profile-group-button-text').text($('#profile-group-name-edit-input').val());
          $('.edit-profile-group-pop-up').popup('hide');
        },
        error: function(data){
          console.log("error");
          console.log(data);
        }
      });
    });

  /** Add new profile systems group */
  $('#add-profile-group').click(function(e) {
    e.preventDefault();
    $('.add-group-pop-up').popup('show');
    setTimeout(function() {
      $('#profile-group-name-input').focus();
    }, 200);
  });
    /** Change hardware group image */
    $('#profile-group-img').click(function() {
      $('#select-profile-group-image').trigger('click');
    });

    /** On image change */
    $('#select-profile-group-image').change(function (evt) {
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
            $('#profile-group-image').attr('src', e.target.result);
          };
        })(f);
        reader.readAsDataURL(f);
      }
    });
    /** Submit new group */
    $('#group-add-pop-up-btn').click(function(e) {
      e.preventDefault();


      var name = $('#profile-group-name-input').val();
      //var link = $('#profile-group-link-input').val();
      //var description = $('#profile-group-description-input').val();
      //var img = $('#profile-group-image').attr('src');

      if (name.length > 0) {
        $('#add-profile-group-form').submit();
      } else {
        $.toast({
          text : i18n.t('Fill the name of group'),
          showHideTransition: 'fade',
          allowToastClose: true,
          hideAfter: 3000,
          stack: 5,
          position: {top: '60px', right: '30px'},
          bgColor: '#FF6633',
          textColor: '#fff'
        });
      }
    });

    $('#add-profile-group-form').on('submit', function (e) {
      e.preventDefault();

      var formData = new FormData(this);

      $.ajax({
        type:'POST',
        url: $(this).attr('action'),
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        success: function(data){
          window.location.reload();
        },
        error: function(data){
          console.log("error");
          console.log(data);
        }
      });
    });

  /** Add profile system to group from default */
  $('.add-profile-to-group').click(function(e) {
    e.preventDefault();

    var profileGroupId = $(this).attr('value');
    $('.add-profile-from-default-pop-up #profile-name-default-select').find('option').remove();
    $.get('/base/profiles/getDefaultProfiles', function(data) {
      if (data.status) {
        $('#profile-add-from-default-pop-up-btn').attr('value', profileGroupId);
        for (var i = 0, len = data.profileSystems.length; i < len; i++) {
          $('.add-profile-from-default-pop-up #profile-name-default-select').append('<option value="' + data.profileSystems[i].id + '">' +
            data.profileSystems[i].name +
          '</option>');
        }
        $('.add-profile-from-default-pop-up').popup('show');
      }
    });
  });

    /** Submit adding profile from deafault to group */
    $('#profile-add-from-default-pop-up-btn').click(function(e) {
      e.preventDefault();

      var profileGroupId = $('#profile-add-from-default-pop-up-btn').attr('value');
      var profileSystemId = $('.add-profile-from-default-pop-up #profile-name-default-select option:selected').val();

      $.post('/base/profiles/addProfileFromDefault', {
        profileGroupId: profileGroupId,
        profileSystemId: profileSystemId
      }, function(data) {
        if (data.status) {
          $('.pop-up').popup('hide');
          window.location.reload();
        }
      });
    });

  /** Edit profile system image */
  $('#edit-profile-system-img').click(function(e) {
    e.preventDefault();

    $('#select-profile-edit-system-image').trigger('click');
  });

    $('#select-profile-edit-system-image').change(function(evt) {
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
            $('#profile-edit-system-image').attr('src', e.target.result);
          };
        })(f);
        reader.readAsDataURL(f);
      }
    });
  // /** Add new profile system */
  // $('.add-new-profile-system').click(function(e) {
  //   e.preventDefault();

  //   $.get('/base/profiles/getProfileSystemFolders', function(data) {
  //     if (data.status) {
  //       $('#new-profile-system-group-input').find('option').remove();
  //       for (var i = 0, len = data.profileSystemGroups.length; i < len; i++) {
  //         if (data.profileSystemGroups[i].name !== 'Default') {
  //           $('#new-profile-system-group-input').append('<option ' +
  //             'value="' + data.profileSystemGroups[i].id + '">' +
  //             data.profileSystemGroups[i].name +
  //             '</option>');
  //         } else {
  //           $('#new-profile-system-group-input').append('<option ' +
  //             'value="' + data.profileSystemGroups[i].id + '">' +
  //             'Отсутствует' +
  //             '</option>');
  //         }
  //       }
  //       //$('#new-profile-system-name-input').val(data.profileSystem.name);
  //       //$('#new-profile-system-cameras-input').val(data.profileSystem.cameras);
  //       //$('#new-profile-system-country-input').val(data.profileSystem.country);
  //       //$('#new-profile-system-edit-pop-up-btn').attr('value', profileSystemId);
  //       //$('#new-profile-system-heat-input option[value="' + data.profileSystem.heat_coeff + '"]').attr('selected', 'selected');
  //       //$('#new-profile-system-noise-input option[value="' + data.profileSystem.noise_coeff + '"]').attr('selected', 'selected');
  //       $('.add-new-profile-system-pop-up').popup('show');
  //     }
  //   });
  // });

  //   /** Submit adding new profile system */
  //   $('#new-profile-system-add-pop-up-btn').click(function(e) {
  //     e.preventDefault();

  //     var groupId = $('#new-profile-system-group-input option:selected').val();
  //     var name = $('#new-profile-system-name-input').val();
  //     var cameras = $('#new-profile-system-cameras-input').val();
  //     var country = $('#new-profile-system-country-input').val();
  //     var heat_coeff = $('#new-profile-system-heat-input option:selected').val();
  //     var noise_coeff = $('#new-profile-system-noise-input option:selected').val();

  //     $.post('/base/profiles/addNewProfileSystem', {
  //       groupId: groupId,
  //       name: name,
  //       cameras: cameras,
  //       country: country,
  //       heat_coeff: heat_coeff,
  //       noise_coeff: noise_coeff
  //     }, function(data) {
  //       if (data.status) {
  //         $('.pop-up').popup('hide');
  //         window.location.reload();
  //       } else {
  //         $.toast({
  //           text : 'Неправильно заполнены поля',
  //           showHideTransition: 'fade',
  //           allowToastClose: true,
  //           hideAfter: 3000,
  //           stack: 5,
  //           position: {top: '60px', right: '30px'},
  //           bgColor: '#FF6633',
  //           textColor: '#fff',
  //         });
  //       }
  //     });
  //   });

  /** Edit profile system */
  $('.profile-system-edit').click(function(e) {
    e.preventDefault();

    var profileSystemId = $(this).attr('value');
    editProfileSystem(profileSystemId);
  });

    /** Submit editing profile system */
    $('#profile-system-edit-pop-up-btn').click(function(e) {
      $('#edit-profile-system-form').submit();
      // e.preventDefault();

      // var isDefault = 0;
      // var profileSystemId = $(this).attr('value');
      // var profileSystemGroupId = $('#profile-system-group-input option:selected').val();
      // var profileSystemName = $('#profile-system-name-input').val();
      // var position = $('#profile-system-position-input').val();
      // var cameras = $('#profile-system-cameras-input').val();
      // var country = $('#profile-system-country-input').val();
      // var heatCoeff = $('#profile-system-heat-input option:selected').val();
      // var heatCoeffValue = $('#profile-system-heat-coeff-input').val();
      // var noiseCoeff = $('#profile-system-noise-input option:selected').val();
      // var isDefaultChecked = $('#checkbox-profile-default').prop('checked');

      // if (isDefaultChecked) {
      //   isDefault = 1;
      // }

      // $.post('/base/profiles/editProfileSystem', {
      //   profileSystemId: profileSystemId,
      //   profileSystemGroupId: profileSystemGroupId,
      //   profileSystemName: profileSystemName,
      //   position: position,
      //   cameras: cameras,
      //   country: country,
      //   heatCoeff: heatCoeff,
      //   heatCoeffValue: heatCoeffValue,
      //   noiseCoeff: noiseCoeff,
      //   isDefault: isDefault
      // }, function(data) {
      //   if (data.status) {
      //     $('.pop-up').popup('hide');
      //     window.location.reload();
      //   }
      // });
    });

    $('#edit-profile-system-form').on('submit', function (e) {
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
          //var groupId = $('#edit-profile-group-id-hidden').val();
          //$('.profile-group-button[value="' + groupId + '"] .profile-group-button-text').text($('#profile-group-name-edit-input').val());
          $('.edit-profile-system-pop-up').popup('hide');
          window.location.reload();
        },
        error: function(data){
          console.log("error");
          console.log(data);
        }
      });
    });

  /** Additional info about profile system */
  $('.profile-system-add-info').click(function(e) {
    e.preventDefault();
    var profileId = $(this).attr('data-id');

    if (!$(this).hasClass('rotated')) {
      startLoader();
      openAdditionalInfo(profileId);
    } else {
      $(this).removeClass('rotated');
      $('.edit-profile-lists[data-id="' + profileId + '"]').hide();
      $('.add-profile-lamination[data-id="' + profileId + '"]').hide();
      $('.additional-dependencies[data-id="' + profileId + '"]').remove();
    }
  });

  /** Add new lamination dependency */
  $('.btn-add-profile-lamination').click(function(e) {
    e.preventDefault();

    var profileId = $(this).parent().attr('data-id');
    addLaminationDependencyBtn(profileId);
  });

  // /** Remove profile system button */
  // $('.profile-system-remove').click(function(e) {
  //   e.preventDefault();

  //   var profileSystemId = $(this).attr('value');
  //   $.post('/base/profiles/removeProfileSystem', {
  //     profileSystemId: profileSystemId
  //   }, function(data) {
  //     if (data.status) {
  //       $('.pop-up').popup('hide');
  //       window.location.reload();
  //     }
  //   });
  // });
  $('.pop-up-default-close').click(function() {
    $('.delete-alert').popup('hide');
  });

  /** Remove profile system group button */
  $('.profile-group-remove').click(function(e) {
    e.preventDefault();

    var profileGroupId = $(this).attr('value');

    $('#delete-profile-group-submit').attr('data-group', profileGroupId);
    $('.delete-alert').popup('show');
  });

    $('#delete-profile-group-submit').click(function(e) {
      e.preventDefault();

      var profileGroupId = $(this).attr('data-group');

      $.get('/base/profiles/removeProfileGroup/' + profileGroupId, function(data) {
        if (data.status) {
          setTimeout(function() {
            window.location.reload();
          }, 500);
        }
      });
    });

    $('#delete-profile-group-deny').click(function(e) {
      e.preventDefault();

      $('.delete-alert').popup('hide');
    });

  /** Edit profile system lists */
  $('.default-option.td-select').change(function () {
    var profileSystemId = $(this).attr('data-profile');
    var field = $(this).attr('data-field');
    var value = $(this).val();

    $.post('/base/profiles/changeList', {
      profileSystemId: profileSystemId,
      field: field,
      value: value
    }, function(data) {
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
        $.toast({
          text : data.error,
          showHideTransition: 'fade',
          allowToastClose: true,
          hideAfter: 3000,
          stack: 5,
          position: {top: '60px', right: '30px'},
          bgColor: '#FF6633',
          textColor: '#fff'
        });
      }
    });
  });

  /** Activate profile system */
  $('.active-btn-profile').click(function() {
    var profileSystemId = $(this).attr('value');
    var isChecked = $(this).prop('checked');

    if (isChecked) {
      $.post('/base/profiles/activate', {
        profileSystemId: profileSystemId,
        isActivated: 1
      }, function(data) {
        if (data.status) {
          $.toast({
            text : i18n.t('Profile has been activated'),
            showHideTransition: 'fade',
            allowToastClose: true,
            hideAfter: 3000,
            stack: 5,
            position: {top: '60px', right: '30px'}
          });
        }
      });
    } else {
      $.post('/base/profiles/activate', {
        profileSystemId: profileSystemId,
        isActivated: 0
      }, function(data) {
        if (data.status) {
          $.toast({
            text : i18n.t('Profile has been deactivated'),
            showHideTransition: 'fade',
            allowToastClose: true,
            hideAfter: 3000,
            stack: 5,
            position: {top: '60px', right: '30px'}
          });
        }
      });
    }
  });

  /** Initialize pop-ups */
  $('.add-group-pop-up').popup({
    type: 'overlay',
    autoopen: false,
    scrolllock: true,
    transition: 'all 0.3s'
  });
  $('.edit-profile-system-pop-up').popup({
    type: 'overlay',
    autoopen: false,
    scrolllock: true,
    transition: 'all 0.3s'
  });
  $('.add-profile-from-default-pop-up').popup({
    type: 'overlay',
    autoopen: false,
    scrolllock: true,
    transition: 'all 0.3s'
  });
  $('.edit-profile-group-pop-up').popup({
    type: 'overlay',
    autoopen: false,
    scrolllock: true,
    transition: 'all 0.3s'
  });
  $('.delete-alert').popup({
    type: 'overlay',
    autoopen: false,
    scrolllock: true,
    transition: 'all 0.3s'
  });

  // $('.add-new-profile-system-pop-up').popup({
  //   type: 'overlay',
  //   autoopen: false,
  //   scrolllock: true,
  //   transition: 'all 0.3s'
  // });

  /** Close pop-up */
  $('.pop-up-close-wrap').click(function(e) {
    e.preventDefault();

    var currentPopup = $(this).attr('value');
    $('.pop-up').popup('hide');
  });

  function editProfileSystem(profileSystemId) {
    $.get('/base/profiles/getProfileSystem/' + profileSystemId, function(data) {
      if (data.status) {
        var img = (data.profileSystem.img ? data.profileSystem.img : '/local_storage/hardware/default.png');
        $('#profile-system-group-input').find('option').remove();
        for (var i = 0, len = data.profileSystemGroups.length; i < len; i++) {
          if (data.profileSystemGroups[i].name !== 'Default') {
            $('#profile-system-group-input').append('<option ' +
              'value="' + data.profileSystemGroups[i].id + '">' +
              data.profileSystemGroups[i].name +
              '</option>');
          } else {
            $('#profile-system-group-input').append('<option ' +
              'value="' + data.profileSystemGroups[i].id + '">' +
              'Отсутствует' +
              '</option>');
          }
        }
        $('#profile-system-group-input').val(data.profileSystem.folder_id);
        // console.log(data.profileSystem.folder_id);
        $('#sync-code').val(data.profileSystem.code_sync);
        $('#profile-system-name-input').val(data.profileSystem.name);
        $('#edit-profile-system-id-input').val(data.profileSystem.id);
        $('#profile-system-position-input').val(data.profileSystem.position);
        $('#profile-system-cameras-input').val(data.profileSystem.cameras);
        $('#profile-system-heat-coeff-input').val(data.profileSystem.heat_coeff_value);
        $('#profile-system-country-input').val(data.profileSystem.country);
        $('#profile-system-edit-pop-up-btn').attr('value', profileSystemId);
        $('#profile-system-link-input').val(data.profileSystem.link);
        $('#profile-system-description-input').val(data.profileSystem.description);
        $('#profile-system-heat-input option[value="' + data.profileSystem.heat_coeff + '"]').attr('selected', 'selected');
        $('#profile-system-noise-input option[value="' + data.profileSystem.noise_coeff + '"]').attr('selected', 'selected');
        $('#profile-edit-system-image').attr('src', img);
        if (parseInt(data.profileSystem.is_default, 10)) {
          $('#checkbox-profile-default').prop('checked', true);
        } else {
          $('#checkbox-profile-default').prop('checked', false);
        }

        if (parseInt(data.profileSystem.is_push, 10)) {
          $('#checkbox-profile-push').prop('checked', true);
        } else {
          $('#checkbox-profile-push').prop('checked', false);
        }

        $('.edit-profile-system-pop-up').popup('show');
      }
    });
  }

  $('#checkbox-profile-push').click(function (e) {
    if (!$(this).prop('checked')) return;

    var folderId = $('.edit-profile-system-pop-up #edit-profile-system-id-input').val();
    e.preventDefault();
    checkHardwarePushAvailability(folderId, '.edit-profile-system-pop-up #checkbox-profile-push');
  });

  /** Set additional folder as a push popup */
  function checkHardwarePushAvailability (folderId, input) {
    $.get('/base/profiles/is-push/' + folderId, function (data) {
      if (data.status) {
        if (data.isAvailable) {
          $(input).prop('checked', true);
        } else {
          showToaster(data.message, true);
        }
      }
    });
  }

  function openAdditionalInfo(id) {
    $.get('/base/profiles/laminations/' + id, function(data) {
      if (data.status) {
        //$('tr.edit-profile-lists[data-id="' + id + '"]') data.laminations.length
        var content = '';
        var frameOptions = '';
        var frameWithSillOptions = '';
        var leafOptions = '';
        var impostOptions = '';
        var shtulpOptions = '';
        var laminationColors = '';

        /** Create frame options */
        for (var fI = 0, lenFI = data.frameLists[0].length; fI < lenFI; fI++) {
          frameOptions += '<option value="' + data.frameLists[0][fI].id + '">' + data.frameLists[0][fI].name + '</option>';
        }
        /** Create frameWithSill options */
        for (var fsI = 0, lenFSI = data.frameWithSillLists[0].length; fsI < lenFSI; fsI++) {
          frameWithSillOptions += '<option value="' + data.frameWithSillLists[0][fsI].id + '">' + data.frameWithSillLists[0][fsI].name + '</option>';
        }
        /** Create leaf options */
        for (var lI = 0, lenLI = data.leafs[0].length; lI < lenLI; lI++) {
          leafOptions += '<option value="' + data.leafs[0][lI].id + '">' + data.leafs[0][lI].name + '</option>';
        }
        /** Create impost options */
        for (var iI = 0, lenII = data.impostLists[0].length; iI < lenII; iI++) {
          impostOptions += '<option value="' + data.impostLists[0][iI].id + '">' + data.impostLists[0][iI].name + '</option>';
        }
        /** Create shtulp options */
        for (var sI = 0, lenSI = data.shtulpLists[0].length; sI < lenSI; sI++) {
          shtulpOptions += '<option value="' + data.shtulpLists[0][sI].id + '">' + data.shtulpLists[0][sI].name + '</option>';
        }
        /** Create lamination colors options */
        for (var lcI = 0, lenLC = data.laminationColors.length; lcI < lenLC; lcI++) {
          laminationColors += '<option value="' + data.laminationColors[lcI].id + '">' + data.laminationColors[lcI].name + '</option>';
        }

        /** Create additional info content */
        for (var i = 0, len = data.laminations.length; i < len; i++) {
          content += '<tr class="edit-profile-lists additional-dependencies" data-id="' + id + '" data-dependency="' + data.laminations[i].id + '">' +
            '<td colspan="4" style="width: 920px;">' +
              '<table class="edit-profile-lists-table" cellspacing="0" cellpadding="0">' +
                '<tr class="tr-lamination-type">' +
                  '<td colspan="6">' +
                    i18n.t('Lamination') + ': ' +
                    '<select class="select-default new-option select-lamination td-select select-lamination-first" data-dependency="' + data.laminations[i].id + '" data-field="lamination_in_id">' +
                      '<option value="1">' + i18n.t('White') + '</option>' +
                      laminationColors +
                    '</select>' +
                    ' - ' +
                    '<select class="select-default new-option select-lamination td-select select-lamination-last" data-dependency="' + data.laminations[i].id + '" data-field="lamination_out_id">' +
                      '<option value="1">' + i18n.t('White') + '</option>' +
                      laminationColors +
                    '</select>' +
                    i18n.t('Code Sync') +
                    ': ' +
                    '<input type="text" class="input-default new-option td-select option-code-sync input-code-sync" data-dependency="' + data.laminations[i].id + '" data-field="code_sync" value="' + data.laminations[i].code_sync + '">' +
                    i18n.t('Color code') +
                    ': ' +
                    '<input type="text" class="input-default new-option td-select option-color-sync input-color-sync" data-dependency="' + data.laminations[i].id + '" data-field="color_sync" value="' + data.laminations[i].color_sync + '">' +
                  '</td>' +
                '</tr>' +
                '<tr class="tr-header">' +
                  '<td class="td-header header-select">' + i18n.t('Frame') + ': ' +
                  '</td>' +
                  '<td class="td-header header-select">' + i18n.t('Frame with sill profile') + ': ' +
                  '</td>' +
                  '<td class="td-header header-select">' + i18n.t('Leaf') + ': ' +
                  '</td>' +
                  '<td class="td-header header-select">' + i18n.t('Impost') + ': ' +
                  '</td>' +
                  '<td class="td-header header-select">' + i18n.t('Face plate') + ': ' +
                  '</td>' +
                '</tr>' +
                '<tr>' +
                  '<td class="td-content">' +
                    '<select class="select-default new-option td-select option-rama" data-profile="' + id + '" data-dependency="' + data.laminations[i].id + '" data-field="rama_list_id" style="width: 150px;">' +
                      '<option value="0" selected>' + i18n.t('Not exist single') +
                      '</option>' +
                      frameOptions +
                    '</select>' +
                  '</td>' +
                  '<td class="td-content">' +
                    '<select class="select-default new-option td-select option-rama-still" data-profile="' + id + '" data-dependency="' + data.laminations[i].id + '" data-field="rama_still_list_id" style="width: 150px;">' +
                      '<option value="0" selected>' + i18n.t('Not exist single') +
                      '</option>' +
                      frameWithSillOptions +
                    '</select>' +
                  '</td>' +
                  '<td class="td-content">' +
                    '<select class="select-default new-option td-select option-stvorka" data-profile="' + id + '" data-dependency="' + data.laminations[i].id + '" data-field="stvorka_list_id" style="width: 150px;">' +
                      '<option value="0" selected>' + i18n.t('Not exist single') +
                      '</option>' +
                      leafOptions +
                    '</select>' +
                  '</td>' +
                  '<td class="td-content">' +
                    '<select class="select-default new-option td-select option-impost" data-profile="' + id + '" data-dependency="' + data.laminations[i].id + '" data-field="impost_list_id" style="width: 150px;">' +
                      '<option value="0" selected>' + i18n.t('Not exist single') +
                      '</option>' +
                      impostOptions +
                    '</select>' +
                  '</td>' +
                  '<td class="td-content">' +
                    '<select class="select-default new-option td-select option-shtulp" data-profile="' + id + '" data-dependency="' + data.laminations[i].id + '" data-field="shtulp_list_id" style="width: 150px;">' +
                      '<option value="0" selected>' + i18n.t('Not exist single') +
                      '</option>' +
                      shtulpOptions +
                    '</select>' +
                  '</td>' +
                '</tr>' +
              '</table>' +
            '</td>' +
          '</tr>';
        }
        $(content).insertAfter('tr.edit-profile-lists.default-lamination[data-id="' + id + '"]');
        for (var j = 0, len = data.laminations.length; j < len; j++) {
          var qrSelector = 'tr.edit-profile-lists[data-dependency="' + data.laminations[j].id + '"] ';
          $(qrSelector + '.select-lamination-first').val(data.laminations[j].lamination_in_id);
          $(qrSelector + '.select-lamination-last').val(data.laminations[j].lamination_out_id);
          $(qrSelector + '.option-code-sync').val(data.laminations[j].code_sync );
          $(qrSelector + '.option-rama').val(data.laminations[j].rama_list_id);
          $(qrSelector + '.option-rama-still').val(data.laminations[j].rama_still_list_id);
          $(qrSelector + '.option-stvorka').val(data.laminations[j].stvorka_list_id);
          $(qrSelector + '.option-impost').val(data.laminations[j].impost_list_id);
          $(qrSelector + '.option-shtulp').val(data.laminations[j].shtulp_list_id);
          $(qrSelector + '.new-option.td-select').change(updateLaminationList);
        }
        $('.profile-system-add-info[data-id="' + id + '"]').addClass('rotated');
        $('.edit-profile-lists[data-id="' + id + '"]').show();
        $('.add-profile-lamination[data-id="' + id + '"]').show();
        stopLoader();
      }
    });
  }

  function addLaminationDependencyBtn(id) {
    $.get('/base/profiles/getLaminationDependency', function(data) {
      if (data.status) {
        var content = '';
        var frameOptions = '';
        var frameWithSillOptions = '';
        var leafOptions = '';
        var impostOptions = '';
        var shtulpOptions = '';
        var laminationColors = '';
        var newDependencyId = Math.floor(Math.random() * (4000000 - 1) + 1);

        /** Create frame options */
        for (var fI = 0, lenFI = data.frameLists[0].length; fI < lenFI; fI++) {
          frameOptions += '<option value="' + data.frameLists[0][fI].id + '">' + data.frameLists[0][fI].name + '</option>';
        }
        /** Create frameWithSill options */
        for (var fsI = 0, lenFSI = data.frameWithSillLists[0].length; fsI < lenFSI; fsI++) {
          frameWithSillOptions += '<option value="' + data.frameWithSillLists[0][fsI].id + '">' + data.frameWithSillLists[0][fsI].name + '</option>';
        }
        /** Create leaf options */
        for (var lI = 0, lenLI = data.leafs[0].length; lI < lenLI; lI++) {
          leafOptions += '<option value="' + data.leafs[0][lI].id + '">' + data.leafs[0][lI].name + '</option>';
        }
        /** Create impost options */
        for (var iI = 0, lenII = data.impostLists[0].length; iI < lenII; iI++) {
          impostOptions += '<option value="' + data.impostLists[0][iI].id + '">' + data.impostLists[0][iI].name + '</option>';
        }
        /** Create shtulp options */
        for (var sI = 0, lenSI = data.shtulpLists[0].length; sI < lenSI; sI++) {
          shtulpOptions += '<option value="' + data.shtulpLists[0][sI].id + '">' + data.shtulpLists[0][sI].name + '</option>';
        }
        /** Create lamination colors options */
        for (var lcI = 0, lenLC = data.laminationColors.length; lcI < lenLC; lcI++) {
          laminationColors += '<option value="' + data.laminationColors[lcI].id + '">' + data.laminationColors[lcI].name + '</option>';
        }

        /** Create additional info content */
        content = '<tr class="edit-profile-lists new-dependency additional-dependencies" data-id="' + id + '" data-new-dependency="' + id + newDependencyId + '">' +
          '<td colspan="4" style="width: 920px;">' +
            '<table class="edit-profile-lists-table" cellspacing="0" cellpadding="0">' +
              '<tr class="tr-lamination-type">' +
                '<td colspan="4">' +
                  i18n.t('Lamination') +
                  ': ' +
                  '<select class="select-default select-lamination select-lamination-first option-lamination-in" data-dependency="">' +
                    '<option value="1">' + i18n.t('White') + '</option>' +
                    laminationColors +
                  '</select>' +
                  ' - ' +
                  '<select class="select-default select-lamination select-lamination-last option-lamination-out" data-dependency="">' +
                    '<option value="1">' + i18n.t('White') + '</option>' +
                    laminationColors +
                  '</select> ' +
                  i18n.t('Code Sync') +
                  ': ' +
                  '<input type="text" class="input-default option-code-sync input-code-sync" data-dependency="" value="">' +
                '</td>' +
                '<td>' +
                  '<input data-id="' + id + '" data-new-dependency="' + id + newDependencyId + '" type="button" class="ok-button add-new-dependency-submit" value="' + i18n.t('Ok') + '"></input>' +
                '</td>' +
              '</tr>' +
              '<tr class="tr-header">' +
                '<td class="td-header header-select">' + i18n.t('Frame') + ': ' +
                '</td>' +
                '<td class="td-header header-select">' + i18n.t('Frame with sill profile') + ': ' +
                '</td>' +
                '<td class="td-header header-select">' + i18n.t('Leaf') + ': ' +
                '</td>' +
                '<td class="td-header header-select">' + i18n.t('Impost') + ': ' +
                '</td>' +
                '<td class="td-header header-select">' + i18n.t('Face plate') + ': ' +
                '</td>' +
              '</tr>' +
              '<tr>' +
                '<td class="td-content">' +
                  '<select class="select-default td-select option-frame" data-profile="' + id + '" data-dependency="" data-field="rama_list_id" style="width: 150px;">' +
                    '<option value="0" selected>' + i18n.t('Not exist single') +
                    '</option>' +
                    frameOptions +
                  '</select>' +
                '</td>' +
                '<td class="td-content">' +
                  '<select class="select-default td-select option-frameWithSill" data-profile="' + id + '" data-dependency="" data-field="rama_still_list_id" style="width: 150px;">' +
                    '<option value="0" selected>' + i18n.t('Not exist single') +
                    '</option>' +
                    frameWithSillOptions +
                  '</select>' +
                '</td>' +
                '<td class="td-content">' +
                  '<select class="select-default td-select option-leaf" data-profile="' + id + '" data-dependency="" data-field="stvorka_list_id" style="width: 150px;">' +
                    '<option value="0" selected>' + i18n.t('Not exist single') +
                    '</option>' +
                    leafOptions +
                  '</select>' +
                '</td>' +
                '<td class="td-content">' +
                  '<select class="select-default td-select option-impost" data-profile="' + id + '" data-dependency="" data-field="impost_list_id" style="width: 150px;">' +
                    '<option value="0" selected>' + i18n.t('Not exist single') +
                    '</option>' +
                    impostOptions +
                  '</select>' +
                '</td>' +
                '<td class="td-content">' +
                  '<select class="select-default td-select option-shtulp" data-profile="' + id + '" data-dependency="" data-field="shtulp_list_id" style="width: 150px;">' +
                    '<option value="0" selected>' + i18n.t('Not exist single') +
                    '</option>' +
                    shtulpOptions +
                  '</select>' +
                '</td>' +
              '</tr>' +
            '</table>' +
          '</td>' +
        '</tr>';
        $(content).insertBefore('tr.add-profile-lamination[data-id="' + id + '"]');
        $('.edit-profile-lists.new-dependency[data-new-dependency="' + id + newDependencyId + '"] .add-new-dependency-submit').click(function(e) {
          e.preventDefault();

          $(this).prop('disabled', true);
          submitNewDependency($(this).attr('data-id'), $(this).attr('data-new-dependency'));
        })
      }
    });
  }

  function submitNewDependency(profileId, dependencyId) {
    var trSelector = '.edit-profile-lists.new-dependency[data-new-dependency="' + dependencyId + '"]';
    var codeSync = $(trSelector + ' .option-code-sync').val();
    var lamination_in_id = $(trSelector + ' .option-lamination-in').val();
    var lamination_out_id = $(trSelector + ' .option-lamination-out').val();
    var frame_id = $(trSelector + ' .option-frame').val();
    var frame_with_sill_id = $(trSelector + ' .option-frameWithSill').val();
    var leaf_id = $(trSelector + ' .option-leaf').val();
    var impost_id = $(trSelector + ' .option-impost').val();
    var shtulp_id = $(trSelector + ' .option-shtulp').val();

    $.post('/base/profiles/submitLaminationDependency', {
      code_sync: codeSync,
      profile_id: profileId,
      lamination_in_id: lamination_in_id,
      lamination_out_id: lamination_out_id,
      frame_id: frame_id,
      frame_with_sill_id: frame_with_sill_id,
      leaf_id: leaf_id,
      impost_id: impost_id,
      shtulp_id: shtulp_id
    }, function(data) {
      if (data.status) {
        $('.add-new-dependency-submit[data-id="' + profileId + '"][data-new-dependency="' + dependencyId + '"]').remove();
        $(trSelector + ' select').addClass('new-option').attr('data-dependency', data.id).change(updateLaminationList);
        $(trSelector + ' input').addClass('new-option').attr('data-dependency', data.id).change(updateLaminationList);
      } else {
        $('.add-new-dependency-submit[data-id="' + profileId + '"][data-new-dependency="' + dependencyId + '"]').prop('disabled', false);
        $.toast({
          text : i18n.t('Current dependency is exist'),
          showHideTransition: 'fade',
          allowToastClose: true,
          hideAfter: 3000,
          stack: 5,
          position: {top: '60px', right: '30px'},
          bgColor: '#FF6633',
          textColor: '#fff'
        });
      }
    });
  }

  function updateLaminationList(e) {
    var dependencyId = $(this).attr('data-dependency');
    var field = $(this).attr('data-field');
    var value = $(this).val();

    console.log(dependencyId, field, value);
    $.post('/base/profiles/editLaminationDependency', {
      dependencyId: dependencyId,
      field: field,
      value: value
    }, function(data) {
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
        $.toast({
          text : data.error,
          showHideTransition: 'fade',
          allowToastClose: true,
          hideAfter: 3000,
          stack: 5,
          position: {top: '60px', right: '30px'},
          bgColor: '#FF6633',
          textColor: '#fff'
        });
      }
    });
  }

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
