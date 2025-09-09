$(function () {
  var localizerOption = { resGetPath: '/assets/javascripts/vendor/localizer/__ns__-__lng__.json'};
  i18n.init(localizerOption);

  var addElementToHardware = false;
  var linearElement = [3, 5, 1, 19];
  var linearSet = [7, 22, 4, 21, 10, 19, 9, 8, 2, 13, 12, 25, 5];
  /**
   * On click Hardware group button
   */
  $('.hardware-group-button').click(function (e) {
    e.preventDefault();
    var hardwareGroupId = $(this).attr('value');
    var windowHardwareTypeId = 2;

    $('.checked-feature').removeClass('checked-feature');
    if ($("#edit" + hardwareGroupId).is('.hardware-editable')) {
      $("#edit" + hardwareGroupId).hide(200).removeClass('hardware-editable');
      $("#add-set, #add-element, #edit-hardware-type, #profile-system-body").hide();
      $('.hardware-items-list').remove();
      $('#hardware-items-list').append('<tr class="hardware-items-list">' +
      '<td colspan="8" align="center" height="100" class="empty">' +
        i18n.t('Select a hardware group') +
      '</td></tr>');
      $('.paginator').empty();
    } else {
      $('.hardware-editable').hide(200).removeClass('hardware-editable');
      $("#add-set, #add-element, #edit-hardware-type, #profile-system-body").hide(200);
      $('.hardware-items-list').remove();
      $('#hardware-items-list').append('<tr class="hardware-items-list">' +
      '<td colspan="8" align="center" height="100" class="empty">' +
        i18n.t('Select a hardware group') +
      '</td></tr>');
      $('.paginator').empty();
      $('#edit' + hardwareGroupId).show(200).addClass('hardware-editable');
    }
    /* Set default value for .select-hardware-type */
    $('.select-hardware-type').val('2');
  });

  $('.hardware-features-exist').click(function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    var featureId = $(this).attr('data');
//    console.log(featureId);
    $('#profile-system-body').attr('featureId', featureId);
    $('.checked-feature').removeClass('checked-feature');
    $(this).addClass('checked-feature');
    $("#add-set, #add-element, #edit-hardware-type, #profile-system-body").show(200);
    $('.select-hardware-type').trigger('change');
    setHardwareProfile(featureId);
  });

 /** change profile items */
$('div.profile_item input').click(function() {
  profileId = $(this).attr('value');
  profile_status = $(this).is(":checked");
  var CheckProfiles ={};
  if (profile_status)
  {
     CheckProfiles[profileId] = 1;
  }
  else
  {
     CheckProfiles[profileId] = 0;
  }
//  console.log(CheckProfiles);
  setHardwareProfile($('#profile-system-body').attr('featureId'), CheckProfiles);
});

  /** select all profile items */
  $("#select-all-profiles").change(function() {
 console.log($('#profile-system-body').attr('featureId'));
//    if ($(this).is(":checked")) {
//      $("[name='foo']").each(function() {
//        $(this).prop('checked', true);
//      });
//    } else {
//      $("[name='foo']").each(function() {
//        $(this).prop('checked', false);
//      });
//    }
  });

  /** Edit feature for others */
  $('.hardware-features-others-edit').click(function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();

    var groupId = $(this).attr('value');
    editGroup(groupId);
  });

  /** Edit feature for others */
  $('.hardware-features-others-remove').click(function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();

    var featureId = $(this).attr('value');
    removeFeature(featureId);
  });

  /**
   * On hardware type change
   */
  $('.select-hardware-type').change(function (e) {
    e.preventDefault();

    var folderId, windowHardwareTypeId, groupId;

    if ($('.hardware-features-exist').hasClass('checked-feature')) {
      folderId = $('.hardware-edit.hardware-editable').attr('data');
      windowHardwareTypeId = $(this).val();
      groupId = $('.hardware-features-exist.checked-feature').attr('data');
      changeHardwareType(folderId, windowHardwareTypeId, 0, groupId);
    } else if ($('.hardware-features-other').hasClass('checked-feature')) {
      windowHardwareTypeId = $(this).val();
      folderId = $('.hardware-features-other.checked-feature').attr('data-folder');
      groupId = $('.hardware-features-other.checked-feature').attr('data');
      changeHardwareType(folderId, windowHardwareTypeId, 0, groupId);
    }
  });

  /**
   * Add element to hardware
   */
  $('#add-element').click(function (e) {
    e.preventDefault();
    addElementToHardware = true;
    $('.pop-up #item-save-btn').addClass('disabled');

    $('.pop-up #pop-up-header').text(i18n.t('Add element'));
    $('.pop-up #item-group-pop-up-text').text(i18n.t('Element group'));
    $('.pop-up #item-name-pop-up-text').text(i18n.t('Element'));
    $('.pop-up #num-input').val('0');

    $.get('/base/hardware/get-elements-groups', function (data) {
      $.get('/base/hardware/get-hardware-colors', function (colors) {
        $(".pop-up #item-group-pop-up-input").find('option').remove().end();
        $(".pop-up #select-lamination-id").find('option').remove().end();
        $(".pop-up #select-lamination-out-id").find('option').remove().end();
        for (var i = 0, len = data.length; i < len; i++) {
          $('.pop-up #item-group-pop-up-input').append('<option ' +
            'value="' + data[i].id + '">' + data[i].name +
          '</option>');
        }
        $('.pop-up #item-group-pop-up-input').val('2');
        // in colors
        $(".pop-up #select-lamination-id").append('<option ' +
          'value="0" selected>' + i18n.t('Ignore') +
        '</option>');
        $(".pop-up #select-lamination-id").append('<option ' +
          'value="1">' + i18n.t('White') +
        '</option>');
        for (var j = 0, len2 = colors.length; j < len2; j++) {
          $(".pop-up #select-lamination-id").append('<option ' +
            'value="' + colors[j].id + '">' + colors[j].name +
          '</option>');
        }
        // out colors
        $(".pop-up #select-lamination-out-id").append('<option ' +
          'value="0" selected>' + i18n.t('Ignore') +
        '</option>');
        $(".pop-up #select-lamination-out-id").append('<option ' +
          'value="1">' + i18n.t('White') +
        '</option>');
        for (var j = 0, len2 = colors.length; j < len2; j++) {
          $(".pop-up #select-lamination-out-id").append('<option ' +
            'value="' + colors[j].id + '">' + colors[j].name +
          '</option>');
        }
        $('.pop-up #select-lamination-id').val('0');
        $('.pop-up #select-lamination-out-id').val('0');
        $('.pop-up #length-input').val('0');
        $('.pop-up #item-group-pop-up-input').trigger('change');
        $('.pop-up').popup('show');
      });
    });
  });

  /**
   * Add set to hardware
   */
  $('#add-set').click(function (e) {
    e.preventDefault();
    $('.pop-up #item-save-btn').addClass('disabled');

    addElementToHardware = false;
    $('.pop-up #pop-up-header').text(i18n.t('Add a set of elements'));
    $('.pop-up #item-group-pop-up-text').text(i18n.t('Set group'));
    $('.pop-up #item-name-pop-up-text').text(i18n.t('Set'));
    $('.pop-up #num-input').val('0');

    $.get('/base/hardware/get-lists-group', function (data) {
      $.get('/base/hardware/get-hardware-colors', function (colors) {
        $(".pop-up #item-group-pop-up-input").find('option').remove().end();
        $(".pop-up #select-lamination-id").find('option').remove().end();
        $(".pop-up #select-lamination-out-id").find('option').remove().end();
        for (var i = 0, len = data.length; i < len; i++) {
          $('.pop-up #item-group-pop-up-input').append('<option ' +
            'value="' + data[i].id + '">' + data[i].name +
          '</option>');
        }
        $('.pop-up #item-group-pop-up-input').val('16');
        // in colors
        $(".pop-up #select-lamination-id").append('<option ' +
          'value="0" selected>' + i18n.t('Ignore') +
        '</option>');
        $(".pop-up #select-lamination-id").append('<option ' +
          'value="1">' + i18n.t('White') +
        '</option>');
        for (var j = 0, len2 = colors.length; j < len2; j++) {
          $(".pop-up #select-lamination-id").append('<option ' +
            'value="' + colors[j].id + '">' + colors[j].name +
          '</option>');
        }
        // out colors
        $(".pop-up #select-lamination-out-id").append('<option ' +
          'value="0" selected>' + i18n.t('Ignore') +
        '</option>');
        $(".pop-up #select-lamination-out-id").append('<option ' +
          'value="1">' + i18n.t('White') +
        '</option>');
        for (var j = 0, len2 = colors.length; j < len2; j++) {
          $(".pop-up #select-lamination-out-id").append('<option ' +
            'value="' + colors[j].id + '">' + colors[j].name +
          '</option>');
        }
        $('.pop-up #select-lamination-id').val('0');
        $('.pop-up #select-lamination-out-id').val('0');
        $('.pop-up #length-input').val('0');
        $('.pop-up #item-group-pop-up-input').trigger('change');
        $('.pop-up').popup('show');
      });
    });
  });

  $('.pop-up #item-query-search-input').keyup(function() {
    $('.pop-up #item-group-pop-up-input').trigger('change');
  });

  /** On hardware amount change - allow/disallow save new hardware button */
  $('#num-input').keyup(function() {
    if ($(this).val() > 0) {
      $('#item-save-btn').removeClass('disabled');
    } else {
      $('#item-save-btn').addClass('disabled');
    }
  });
  /**
   * On group change
   */
  $('.pop-up #item-group-pop-up-input').change(function () {
    var group = $(".pop-up #item-group-pop-up-input option:selected");
    var query = $('.pop-up #item-query-search-input').val();

    if (addElementToHardware) {
      if (linearElement.indexOf(parseInt(group.val(), 10)) >= 0) {
        $('.item-length-pop-up').removeClass('disabled');
        $('.pop-up #length-input').prop('disabled', false);
        $('#item_rule_length').removeClass('disabled');
        $('#item_rule_length').prop('disabled', false);
      } else {
        $('.item-length-pop-up').addClass('disabled');
        $('.pop-up #length-input').prop('disabled', true);
        $('#item_rule_length').addClass('disabled');
        $('#item_rule_length').prop('disabled', true);
        $('.pop-up #length-input').val('0');
      }
      $.get('/base/hardware/get-elements-of-group/' + group.val() + '?tquery=' + query, function (data) {
        $(".pop-up #item-name-pop-up-input").find('option').remove().end();
        if (data.length) {
          for (var i = 0, len = data.length; i < len; i++) {
            $(".pop-up #item-name-pop-up-input").append('<option ' +
              'value="' + data[i].id + '">' + data[i].name +
            '</option>');
          }
          $('.pop-up #item-save-btn').show();
        } else {
          $(".pop-up #item-name-pop-up-input").append('<option ' +
            'value="0">' + i18n.t('Not exist') +
          '</option>');
          $('.pop-up #item-save-btn').hide();
        }
      });
    } else {
      if (linearSet.indexOf(parseInt(group.val(), 10)) >= 0) {
        $('.item-length-pop-up').removeClass('disabled');
        $('.pop-up #length-input').prop('disabled', false);
        $('#item_rule_length').removeClass('disabled');
        $('#item_rule_length').prop('disabled', false);
      } else {
        $('.item-length-pop-up').addClass('disabled');
        $('.pop-up #length-input').prop('disabled', true);
        $('#item_rule_length').addClass('disabled');
        $('#item_rule_length').prop('disabled', true);
        $('.pop-up #length-input').val('0');
      }
      $.get('/base/hardware/get-lists-of-group/' + group.val() + '?tquery=' + query, function (data) {
        $(".pop-up #item-name-pop-up-input").find('option').remove().end();
        if (data.length) {
          for (var i = 0, len = data.length; i < len; i++) {
            $(".pop-up #item-name-pop-up-input").append('<option ' +
              'value="' + data[i].id + '">' + data[i].name +
            '</option>');
          }
          $('.pop-up #item-save-btn').show();
        } else {
          $(".pop-up #item-name-pop-up-input").append('<option ' +
            'value="0">' + i18n.t('Not exist') +
          '</option>');
          $('.pop-up #item-save-btn').hide();
        }
      });
    }
  });

  /**
   * Add item to hardware
   */
  $('#item-save-btn').click(function (e) {
    e.preventDefault();

    if (!$(this).hasClass('disabled')) {
      var hardwareGroupId = $('.checked-feature').attr('data');
      var hardwareTypeId = $('.select-hardware-type option:selected').val();
      var featureId = $('.checked-feature').attr('data');
      var minWidth = $('.pop-up #min_width').val();
      var maxWidth = $('.pop-up #max_width').val();
      var minHeight = $('.pop-up #min_height').val();
      var maxHeight = $('.pop-up #max_height').val();
      var directionId = $('.pop-up #select-direction-id').val();
      var windowHardwareColorId = $('.pop-up #select-lamination-id').val();
      var windowHardwareColorOutId = $('.pop-up #select-lamination-out-id').val();
      var length = $('.pop-up #length-input').val();
      var count = $('.pop-up #num-input').val();
      var childId = $('.pop-up #item-name-pop-up-input').val();
      var position = $('.pop-up #select-position-id').val();;
      var item_rules = $('.pop-up #item_rule_length option:selected').val();
      var childType;

      if (addElementToHardware) {
        childType = 'element';
        $.post('/base/hardware/add-element', {
          hardwareTypeId: hardwareTypeId,
          //featureId: featureId,
          minWidth: minWidth,
          maxWidth: maxWidth,
          minHeight: minHeight,
          maxHeight: maxHeight,
          directionId: directionId,
          windowHardwareColorId: windowHardwareColorId,
          windowHardwareColorOutId: windowHardwareColorOutId,
          length: length,
          count: count,
          childId: childId,
          childType: childType,
          position: position,
          hardwareGroupId: hardwareGroupId,
          item_rules: item_rules
        }, function () {
          setTimeout(function() {
            $('.paginator-link.current-page').trigger('click');
            $('.pop-up').popup('hide');
          }, 200);
        });

      } else {
        childType = 'list';
        $.post('/base/hardware/add-element', {
          hardwareTypeId: hardwareTypeId,
          //featureId: featureId,
          minWidth: minWidth,
          maxWidth: maxWidth,
          minHeight: minHeight,
          maxHeight: maxHeight,
          directionId: directionId,
          windowHardwareColorId: windowHardwareColorId,
          windowHardwareColorOutId: windowHardwareColorOutId,
          length: length,
          count: count,
          childId: childId,
          childType: childType,
          position: position,
          hardwareGroupId: hardwareGroupId,
          item_rules: item_rules
        }, function () {
          setTimeout(function() {
            $('.paginator-link.current-page').trigger('click');
            $('.pop-up').popup('hide');
          }, 200);
        });
      }
    } else {
      $.toast({
        text : i18n.t('Specify the number of hardwares'),
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

  /**
   * Add new feature to hardware group pop up
   */
  $('.add-future').click(function (e) {
    e.preventDefault();
    var hwId = $(this).attr('value');
    $('.add-feature-pop-up #feature-add-pop-up-btn').attr('value', hwId);
    $('#feature-select-from-default').find('option').remove();
    $.get('/base/hardware/get-groups-from-default', function(data) {
      if (data.status) {
        if (data.groups.length) {
          for (var i = 0, len = data.groups.length; i < len; i++) {
            $('#feature-select-from-default').append('<option ' +
              'value="' + data.groups[i].id + '">' +
              data.groups[i].name +
              '</option>');
          }
          $('.add-feature-pop-up').popup('show');
        } else {
          $.toast({
            text : i18n.t('Groups not exist'),
            showHideTransition: 'fade',
            allowToastClose: true,
            hideAfter: 3000,
            stack: 5,
            position: {top: '60px', right: '30px'}
          });
        }
      }
    });
  });

    /* image loader */
    $('#new-feature-image').click(function(e) {
      e.preventDefault();
      $('#feature-image-input').trigger('click');
    });
    $('#feature-image-input').change(function (evt) {
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
            $('#new-feature-image-list').attr('src', e.target.result);
          };
        })(f);
        reader.readAsDataURL(f);
      }
    });

    /**
     * Add new feature to hardware group submit
     */
    $('#feature-add-pop-up-btn').click(function (e) {
      e.preventDefault();

      var groupId = $('#feature-select-from-default option:selected').val();
      var folderId = $(this).attr('value');

      $.post('/base/hardware/add-group-to-group', {
        groupId: groupId,
        folderId: folderId
      }, function(data) {
        if (data.status) {
          window.location.reload();
        }
      });
    });

  /**
   * Edit feature
   */
  $('#feature-edit-pop-up-btn').click(function (e) {
    e.preventDefault();
    $('#edit-feature-form').submit();
  });

    /* on image change */
    $('#add-feature-image').click(function(e) {
      $('#select-feature-image').trigger('click');
    });

      $('#select-feature-image').change(function (evt) {
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
              $('#feature-image').attr('src', e.target.result);
            };
          })(f);
          reader.readAsDataURL(f);
        }
      });

  /**
   * Add new hardware group pop-up
   */
  $('#add-hardware-group').click(function (e) {
    e.preventDefault();
    $('.add-hardware-pop-up').popup('show');
    setTimeout(function() {
      $('#hardware-name-pop-up-input').focus();
    }, 200);

  });
    /** Change hardware group image */
    $('#hardware-group-img').click(function() {
      $('#select-hardware-group-image').trigger('click');
    });

    /** On image change */
    $('#select-hardware-group-image').change(function (evt) {
      var file = evt.target.files[0];

      if (file.type.match('image.*')) {
        $('#hardware-group-image').attr('src', URL.createObjectURL(file));
      }
    });
    /* Submit new hardware group */
    $('#hardware-add-pop-up-btn').click(function (e) {
      $('#add-hardware-folder-form').submit();
      // e.preventDefault();

      // var folderName = $('#hardware-name-pop-up-input').val();
      // var folderLink = $('#hardware-link-pop-up-input').val();
      // var folderDescription = $('#hardware-description-pop-up-input').val();
      // var folderImg = $('#select-hardware-group-image').val();

      // $.post('/base/hardware/add-hardware-folder', {
      //   folderName: folderName,
      //   folderLink: folderLink,
      //   folderDescription: folderDescription,
      //   folderImg: folderImg
      // }, function (data) {
      //   window.location.reload();
      // });
    });

  $('.pop-up-default-close').click(function() {
    $('.delete-alert').popup('hide');
  });

  /** Remove hardware-group */
  $('.hardware-group-remove-button').click(function(e) {
    e.preventDefault();

    var hardwareFolderId = $(this).attr('value');

    $('#delete-hardware-group-submit').attr('data-group', hardwareFolderId);
    $('.delete-alert').popup('show');
  });

    $('#delete-hardware-group-submit').click(function(e) {
      e.preventDefault();

      var hardwareFolderId = $(this).attr('data-group');

      $.post('/base/hardware/remove-hardware-folder', {
        hardwareFolderId: hardwareFolderId
      }, function(data) {
        if (data.status) {
          window.location.reload();
        }
      });
    });

    $('#delete-hardware-group-deny').click(function(e) {
      e.preventDefault();

      $('.delete-alert').popup('hide');
    });

  /**
   * Edit window_hardware
   */
  $('#hardware-save-pop-up-btn').click(function (e) {
    e.preventDefault();

    var minWidth = $('.edit-hardware-item-pop-up #min_width').val();
    var maxWidth = $('.edit-hardware-item-pop-up #max_width').val();
    var minHeight = $('.edit-hardware-item-pop-up #min_height').val();
    var maxHeight = $('.edit-hardware-item-pop-up #max_height').val();
    var directionId = $('.edit-hardware-item-pop-up #select-direction-id').val();
    var positionId = $('#select-position-id-edit').val();
    var windowHardwareColorId = $('.edit-hardware-item-pop-up #select-lamination-id').val();
    var windowHardwareColorOutId = $('.edit-hardware-item-pop-up #select-lamination-out-id').val();
    var length = $('.edit-hardware-item-pop-up #length-input-edit').val();
    var count = $('.edit-hardware-item-pop-up #num-input').val();
    var hardwareId = $('.edit-hardware-item-pop-up .hardware-name-pop-up').attr('id');
    var item_rule = $('.edit-hardware-item-pop-up #item_rule_length_edit option:selected').val();

    /** after save - edit in tr */
    var directionName = $('.edit-hardware-item-pop-up #select-direction-id option:selected').text();
    var colorName = $('.edit-hardware-item-pop-up #select-lamination-id option:selected').text();
    var colorOutName = $('.edit-hardware-item-pop-up #select-lamination-out-id option:selected').text();

    $.post('/base/hardware/edit-hardware', {
      hardwareId: hardwareId,
      minWidth: minWidth,
      maxWidth: maxWidth,
      minHeight: minHeight,
      maxHeight: maxHeight,
      directionId: directionId,
      positionId: positionId,
      windowHardwareColorId: windowHardwareColorId,
      windowHardwareColorOutId: windowHardwareColorOutId,
      length: length,
      item_rule: item_rule,
      count: count
    },function (data) {

      const positionMap = {
        "1": i18n.t('Ignore'),
        "2": i18n.t('front'),
        "3": i18n.t('sliding (passive)'),
        "4": i18n.t('back')
      };
      const positionText = positionMap[positionId] || i18n.t('Not exist');
      
      $('tr[data="' + hardwareId + '"]').find('.item-direction').text(directionName);
      $('tr[data="' + hardwareId + '"]').find('.item-position').text(positionText);
      $('tr[data="' + hardwareId + '"]').find('.item-count').text(count);
      $('tr[data="' + hardwareId + '"]').find('.item-width').text(minWidth + '-' + maxWidth);
      $('tr[data="' + hardwareId + '"]').find('.item-height').text(minHeight + '-' + maxHeight);
      $('tr[data="' + hardwareId + '"]').find('.item-color').text(colorName);
      $('tr[data="' + hardwareId + '"]').find('.item-color').text(colorOutName);
      $('tr[data="' + hardwareId + '"]').find('.item-length').text(length);
      $('.edit-hardware-item-pop-up').popup('hide');
    });
  });

  /**
   * Edit hardware group name popup
   */
  $('.hardware-group-edit-button').click(function(e) {
    e.preventDefault();

    var hardwareGroupId = $(this).attr('value');

    $.get('/base/hardware/getHardwareFolder/' + hardwareGroupId, function(hardware_group) {
      var img = (hardware_group.img ? hardware_group.img : '/local_storage/default.png');

      $('#hardware-edit-name-pop-up-input').val(hardware_group.name);
      //$('#hardware-edit-shortname-pop-up-input').val(hardware_group.short_name);
      $('#hardware-edit-link-pop-up-input').val(hardware_group.link);
      $('#hardware-edit-description-pop-up-input').val(hardware_group.description);
      $('#hardware-edit-group-image').attr('src', img);
      $('#hidden-edit-hardware-folder').attr('value', hardwareGroupId);
      $('.edit-hardware-pop-up').popup('show');
    });
  });

    /** Change image for group */
    $('#edit-hardware-group-img').click(function() {
      $('#select-hardware-edit-group-image').trigger('click');
    });

    /** On image change */
    $('#select-hardware-edit-group-image').change(function (evt) {
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
            $('#hardware-edit-group-image').attr('src', e.target.result);
          };
        })(f);
        reader.readAsDataURL(f);
      }
    });

    /* submit editing */
    $('#hardware-edit-pop-up-btn').click(function(e) {
      e.preventDefault();

      $('#edit-hardware-folder-form').submit();
    });

      $('#edit-hardware-folder-form').on('submit', function(e) {
        e.preventDefault();
        var formData = new FormData(this);

        $.ajax({
          type:'POST',
          url: $(this).attr('action'),
          data: formData,
          cache: false,
          contentType: false,
          processData: false,
          success:function(data){
            var folderId = $('#hidden-edit-hardware-folder').val();
            $('.hardware-group-button[value="' + folderId + '"] .hardware-group-button-text').text($('#hardware-edit-name-pop-up-input').val());
            $('.edit-hardware-pop-up').popup('hide');
          },
          error: function(data){
            console.log("error");
            console.log(data);
          }
        });
      });

  /** On hardware-other click */
  $('.hardware-features-other').click(function(e) {
    e.preventDefault();
    $('.checked-feature').removeClass('checked-feature');
    $(this).addClass('checked-feature');
    var groupId = $(this).attr('data');
    var windowHardwareTypeId = $('.select-hardware-type').val();
    var folderId = $(this).attr('data-folder');
    $("#add-set, #add-element, #edit-hardware-type, #profile-system-body").show(200);

    changeHardwareType(folderId, windowHardwareTypeId, 0, groupId);
  });
  /**
   * Operations with hardwares
   */
  $('#content-footer-ok').click(function (e) {
    e.preventDefault();
    var operation = $("#selectOption").val();
    var elementsType = $("#radioSelected").prop('checked');
    var checkedElements = $("input[name='checkedElements']");

    if (operation === 'удалить') {
      deleteElements();
    } else if (operation === 'редактировать') {
      editElemetns();
    }

    function deleteElements() {
      if (elementsType) {                       // operation with selected elements
        for (var i = 0, len = checkedElements.length; i < len; i++) {
          if (checkedElements[i].checked) {
            var hardwareId = $(checkedElements[i]).attr('value');
            __removeItemHandler(hardwareId);
          }
        }
      } else {                                  // operation with unselected elements
        for (var i = 0, len = checkedElements.length; i < len; i++) {
          if (!checkedElements[i].checked) {
            var hardwareId = $(checkedElements[i]).attr('value');
            __removeItemHandler(hardwareId);
          }
        }
      }
    }

    function editElemetns() {
      if (elementsType) {                       // operation with selected elements
        for (var i = 0, len = checkedElements.length; i < len; i++) {
          if (checkedElements[i].checked) {
            //window.open("/base/element/" + checkedElements[i].value, '_blank');
          }
        }
      } else {                                  // operation with unselected elements
        for (var i = 0, len = checkedElements.length; i < len; i++) {
          if (!checkedElements[i].checked) {
            //window.open("/base/element/" + checkedElements[i].value, '_blank');
          }
        }
      }
    }
  });

  /** Edit hardwate type btn click. */
  $('#edit-hardware-type').click(editHardwareType);
  $('#save-hardware-type-btn').click(submitHardwareType);
  $('#edit-hardware-type-form').on('submit', submitHardwareTypeForm)

  /**
   * Pop up init
   * ЧТО ЗА Х??????????????????????????
   */
  $('.pop-up').popup({
    type: 'overlay',
    autoopen: false,
    scrolllock: true,
    transition: 'all 0.3s'
  });
  $('.add-feature-pop-up').popup({
    type: 'overlay',
    autoopen: false,
    scrolllock: true,
    transition: 'all 0.3s'
  });
  $('.edit-feature-pop-up').popup({
    type: 'overlay',
    autoopen: false,
    scrolllock: true,
    transition: 'all 0.3s'
  });
  $('.add-hardware-pop-up').popup({
    type: 'overlay',
    autoopen: false,
    scrolllock: true,
    transition: 'all 0.3s'
  });
  $('.edit-hardware-item-pop-up').popup({
    type: 'overlay',
    autoopen: false,
    scrolllock: true,
    transition: 'all 0.3s'
  });
  $('.edit-hardware-pop-up').popup({
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
  $('.edit-hardware-type-pop-up').popup({
    type: 'overlay',
    autoopen: false,
    scrolllock: true,
    transition: 'all 0.3s'
  });

  /**
   * Pop up close
   * ЧТО ЗА Х??????????????????????????
   */
  $('#pop-up-close-wrap, .pop-up-close-wrap').click(function (e) {
    e.preventDefault();
    $('.pop-up').popup('hide');
  });
  $('#pop-up-add-feature-close-wrap').click(function (e) {
    e.preventDefault();
    $('.add-feature-pop-up').popup('hide');
  });
  $('#pop-up-edit-feature-close-wrap').click(function (e) {
    e.preventDefault();
    $('.edit-feature-pop-up').popup('hide');
  });
  $('#pop-up-add-hardware-close-wrap').click(function (e) {
    e.preventDefault();
    $('.add-hardware-pop-up').popup('hide');
  });
  $('#edit-hardware-item-pop-up-close-wrap').click(function (e) {
    e.preventDefault();
    $('.edit-hardware-item-pop-up').popup('hide');
  });
  $('#pop-up-edit-hardware-close-wrap').click(function (e) {
    e.preventDefault();
    $('.edit-hardware-pop-up').popup('hide');
  });

  $('.pop-up-close-wrap').click(function (e) {
    e.preventDefault();
    $('.edit-hardware-type-pop-up').popup('hide');
  });

  function initPaginator (totalPages, currentPage, folderId, windowHardwareTypeId, groupId) {
    var from = currentPage;
    var to = totalPages;
    var firstCount = Math.min(3, totalPages);
    $('.paginator').empty();

    if ((totalPages > 3) && (currentPage == 2)) firstCount = 4;

    if (totalPages === 0) {
      $('.paginator').append('<a class="paginator-link current-page hidden-paginator" data-page=' + currentPage + ' data-folder-id=' + folderId + ' data-windowHardwareTypeId=' + windowHardwareTypeId + ' data-group-id=' + groupId + ' href="#">0</a>');
    }

    if (currentPage > 0) {
      $('.paginator').append('<a class="paginator-link" data-page=' + (currentPage - 1) + ' data-folder-id=' + folderId + ' data-windowHardwareTypeId=' + windowHardwareTypeId + ' data-group-id=' + groupId + ' href="#"><</a>');
    }

    if ((from >= 3) && (totalPages != 4)) {
      $('.paginator').append('<a class="paginator-link" data-page=' + 0 + ' data-folder-id=' + folderId + ' data-windowHardwareTypeId=' + windowHardwareTypeId + ' data-group-id=' + groupId + ' href="#">1</a> ... ');
      if (totalPages - 3 > currentPage) {
        n = currentPage - 1;
        while (n < currentPage + 2) {
          if (currentPage == n) {
            $('.paginator').append('<a class="paginator-link current-page" data-page=' + n + ' data-folder-id=' + folderId + ' data-windowHardwareTypeId=' + windowHardwareTypeId + ' data-group-id=' + groupId + ' href="#">' + ++n + '</a>');
          } else {
            $('.paginator').append('<a class="paginator-link" data-page=' + n + ' data-folder-id=' + folderId + ' data-windowHardwareTypeId=' + windowHardwareTypeId + ' data-group-id=' + groupId + ' href="#">' + ++n + '</a>');
          }
        }
        $('.paginator').append(' ... ');
        if (currentPage == totalPages - 1) {
          $('.paginator').append('<a class="paginator-link current-page" data-page=' + (totalPages - 1) + ' data-folder-id=' + folderId + ' data-windowHardwareTypeId=' + windowHardwareTypeId + ' data-group-id=' + groupId + ' href="#">' + totalPages + '</a>');
        } else {
          $('.paginator').append('<a class="paginator-link" data-page=' + (totalPages - 1) + ' data-folder-id=' + folderId + ' data-windowHardwareTypeId=' + windowHardwareTypeId + ' data-group-id=' + groupId + ' href="#">' + totalPages + '</a>');
        }
      } else {
        n = totalPages - 3
        if (currentPage == totalPages - 3) {
          n = totalPages - 4;
          while (n < totalPages) {
            if (currentPage == n) {
              $('.paginator').append('<a class="paginator-link current-page" data-page=' + n + ' data-folder-id=' + folderId + ' data-windowHardwareTypeId=' + windowHardwareTypeId + ' data-group-id=' + groupId + ' href="#">' + ++n + '</a>');
            } else {
              $('.paginator').append('<a class="paginator-link" data-page=' + n + ' data-folder-id=' + folderId + ' data-windowHardwareTypeId=' + windowHardwareTypeId + ' data-group-id=' + groupId + ' href="#">' + ++n + '</a>');
            }
          }
        }
      }
    } else {
      n = 0
      if (totalPages == 4) firstCount = 4;
      while (n < firstCount) {
        if (currentPage == n) {
          $('.paginator').append('<a class="paginator-link current-page" data-page=' + n + ' data-folder-id=' + folderId + ' data-windowHardwareTypeId=' + windowHardwareTypeId + ' data-group-id=' + groupId + ' href="#">' + ++n + '</a>');
        } else {
          $('.paginator').append('<a class="paginator-link" data-page=' + n + ' data-folder-id=' + folderId + ' data-windowHardwareTypeId=' + windowHardwareTypeId + ' data-group-id=' + groupId + ' href="#">' + ++n + '</a>');
        }
      }
      if (totalPages > firstCount) {
        if (currentPage == totalPages - 1) {
          $('.paginator').append('<a class="paginator-link current-page" data-page=' + (totalPages - 1) + ' data-folder-id=' + folderId + ' data-windowHardwareTypeId=' + windowHardwareTypeId + ' data-group-id=' + groupId + ' href="#">' + totalPages + '</a>');
        } else {
          $('.paginator').append('<a class="paginator-link" data-page=' + (totalPages - 1) + ' data-folder-id=' + folderId + ' data-windowHardwareTypeId=' + windowHardwareTypeId + ' data-group-id=' + groupId + ' href="#">' + totalPages + '</a>');
        }
      }

    }

    if (currentPage < totalPages - 1) {
      $('.paginator').append('<a class="paginator-link" data-page=' + (currentPage + 1) + ' data-folder-id=' + folderId + ' data-windowHardwareTypeId=' + windowHardwareTypeId + ' data-group-id=' + groupId + ' href="#">></a>');
    }

    /* add event listener on paginator link */
    $('.paginator').on('click', '.paginator-link', function (e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      //e.preventDefault();
      var folderId = $(this).attr('data-folder-id');
      var windowHardwareTypeId = $(this).attr('data-windowHardwareTypeId');
      var page = $(this).attr('data-page');
      var groupId = $(this).attr('data-group-id');
      changeHardwareType(folderId, windowHardwareTypeId, page, groupId);
    });
  }

  function setHardwareProfile(HardwarefolderId, CheckProfiles) {
    $.post('/base/hardware/getHardwareProfile/' + HardwarefolderId, CheckProfiles
    , function(data) {
      if (!CheckProfiles)
      {
        $("[name='foo']").each(function() {
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

  function changeHardwareType(folderId, windowHardwareTypeId, page, groupId) {
    var page = page || 0;
    /* get all elements of feature */
    $.get('/base/hardware/get-group-elements?folderId=' + folderId + '&windowHardwareTypeId=' + windowHardwareTypeId + '&page=' + page + '&groupId=' + groupId, function (data) {
      var featuresElements = data.featuresElements;
      var elementsChilds = data.elementsChilds;
      var listsChilds = data.listsChilds;
      initPaginator(data.totalPages, data.currentPage, folderId, windowHardwareTypeId, groupId);
      $.get('/base/hardware/get-hardware-colors', function (colors) {
          
        if (!featuresElements.length) {
          $('.hardware-items-list').remove();
          $('#hardware-items-list').append('<tr class="hardware-items-list">' +
          '<td colspan="8" align="center" height="100" class="empty">' +
            i18n.t('Elements not exist') +
          '</td></tr>');
        } else {
          var hardwareColor;
          var hardwareColorOut;

          $('.hardware-items-list').remove();
          for (var n = 0, len = featuresElements.length, name; n < len; n++) {
            if (featuresElements[n].lamination_factory_color) {
              hardwareColor = featuresElements[n].lamination_factory_color.name;
            } else if (featuresElements[n].window_hardware_color_id === 0) {
              hardwareColor = i18n.t('Ignore');
            } else {
              hardwareColor = i18n.t('White');
            }

            const findColorOut = colors.find(color => color.id === featuresElements[n].window_hardware_color_out_id);

            if (findColorOut) {
              hardwareColorOut = findColorOut.name;
            } else if (featuresElements[n].window_hardware_color_out_id === 0) {
              hardwareColorOut = i18n.t('Ignore');
            } else {
              hardwareColorOut = i18n.t('White');
            }

            if (featuresElements[n].child_type == 'list') {
              listsChilds.filter(function (value) {
                if (value.id == featuresElements[n].child_id) {
                  name = value.name;
                }
                return;
              });
            } else {
              elementsChilds.filter(function (value) {
                if (value.id == featuresElements[n].child_id) {
                  name = value.name;
                }
                return;
              });
            }

            const positionMap = {
              "1": i18n.t('Ignore'),
              "2": i18n.t('front'),
              "3": i18n.t('middle'),
              "4": i18n.t('back')
            };
            const positionText = positionMap[featuresElements[n].position] || i18n.t('Not exist');

            $('#hardware-items-list').append('<tr class="hardware-items-list" data="' + featuresElements[n].id + '">' +
            '<td class="item-input-choose">' +
              '<input class="hardware-checkbox" id="checkbox' + featuresElements[n].id + '" type="checkbox" value="' + featuresElements[n].id + '" name="checkedElements" style="margin-left: 25px;">' +
              '<label for="checkbox' + featuresElements[n].id + '"><span id="hide"></span></label>' +
            '</td>' +
            '<td class="item-name">' +
              '' + name +
            '</td>' +
            '<td class="item-count">' +
              '' + featuresElements[n].count +
            '</td>' +
            '<td class="item-width">' +
              '' + featuresElements[n].min_width + '-' + featuresElements[n].max_width +
            '</td>' +
            '<td class="item-height">' +
              '' + featuresElements[n].min_height + '-' + featuresElements[n].max_height +
            '</td>' +
            '<td class="item-position">' +
              '' + positionText +
            '</td>' +
            '<td class="item-direction">' +
              '' + (featuresElements[n].direction.name === '_не учитыв' ? i18n.t('Ignore') : featuresElements[n].direction.name) +
            '</td>' +
            '<td class="item-color">' +
              '' + hardwareColor +
            '</td>' +
            '<td class="item-color test">' +
              '' + hardwareColorOut +
            '</td>' +
            '<td class="item-length">' +
              '' + featuresElements[n].length +
            '</td>></tr>');
            /* Add event listener on hardware edit */
            $('#hardware-items-list').on('click', '.hardware-items-list', function (e) {
              if (!$(e.target).is('.hardware-checkbox')) {
                e.preventDefault();
                e.stopImmediatePropagation();
                var hardwareId = $(this).attr('data');
                var hardwareName = $(this).find('.item-name').text();
                $('.edit-hardware-item-pop-up .hardware-name-pop-up').attr('id', hardwareId).text(hardwareName);
                $.get('/base/hardware/get-hardware-colors', function (colors) {
                  $('.edit-hardware-item-pop-up #select-lamination-id').find('option').remove().end();
                  $('.edit-hardware-item-pop-up #select-lamination-out-id').find('option').remove().end();
                  $('.edit-hardware-item-pop-up #select-position-id-edit').find('option').remove().end();
                  // in colors
                  $(".edit-hardware-item-pop-up #select-lamination-id").append('<option ' +
                    'value="0" selected>' + i18n.t('Ignore') +
                  '</option>');
                  $(".edit-hardware-item-pop-up #select-lamination-id").append('<option ' +
                    'value="1">' + i18n.t('White') +
                  '</option>');
                  for (var j = 0, len = colors.length; j < len; j++) {
                    $('.edit-hardware-item-pop-up #select-lamination-id').append('<option value="' + colors[j].id + '">' + colors[j].name + '</option>');
                  }
                  // out colors
                  $(".edit-hardware-item-pop-up #select-lamination-out-id").append('<option ' +
                    'value="0" selected>' + i18n.t('Ignore') +
                  '</option>');
                  $(".edit-hardware-item-pop-up #select-lamination-out-id").append('<option ' +
                    'value="1">' + i18n.t('White') +
                  '</option>');
                  for (var j = 0, len = colors.length; j < len; j++) {
                    $('.edit-hardware-item-pop-up #select-lamination-out-id').append('<option value="' + colors[j].id + '">' + colors[j].name + '</option>');
                  }
                  for (let s in positionMap) {
                    $('.edit-hardware-item-pop-up #select-position-id-edit').append('<option value="' + s + '">' + positionMap[s] + '</option>');
                  }
                  $.get('/base/hardware/get-hardware/' + hardwareId, function (data) {
                    if (data.status) {
                      $('.edit-hardware-item-pop-up #select-direction-id option[value="' + data.hardware.direction_id + '"]').attr('selected', 'selected');
                      $('.edit-hardware-item-pop-up #select-position-id-edit option[value="' + data.hardware.position + '"]').attr('selected', 'selected');
                      $('.edit-hardware-item-pop-up #select-lamination-id option[value="' + data.hardware.window_hardware_color_id + '"]').attr('selected', 'selected');
                      $('.edit-hardware-item-pop-up #select-lamination-out-id option[value="' + data.hardware.window_hardware_color_out_id + '"]').attr('selected', 'selected');
                      $('.edit-hardware-item-pop-up #length-input-edit').val(data.hardware['length']);
                      $('.edit-hardware-item-pop-up #num-input').val(data.hardware.count);
                      $('.edit-hardware-item-pop-up #min_width').val(data.hardware.min_width);
                      $('.edit-hardware-item-pop-up #max_width').val(data.hardware.max_width);
                      $('.edit-hardware-item-pop-up #min_height').val(data.hardware.min_height);
                      $('.edit-hardware-item-pop-up #max_height').val(data.hardware.max_height);
                      $('.edit-hardware-item-pop-up #item_rule_length_edit').val(data.hardware.rules_type);
                      $('.edit-hardware-item-pop-up').popup('show');
                      if (data.is_linear) {
                        $('.edit-hardware-item-pop-up .item-length-pop-up').removeClass('disabled');
                        $('.edit-hardware-item-pop-up #length-input-edit').prop('disabled', false);
                        $('.edit-hardware-item-pop-up #item_rule_length_edit').removeClass('disabled');
                        $('.edit-hardware-item-pop-up #item_rule_length_edit').prop('disabled', false);
                      } else {
                        $('.edit-hardware-item-pop-up .item-length-pop-up').addClass('disabled');
                        $('.edit-hardware-item-pop-up #length-input-edit').prop('disabled', true);
                        $('.edit-hardware-item-pop-up #item_rule_length_edit').addClass('disabled');
                        $('.edit-hardware-item-pop-up #item_rule_length_edit').prop('disabled', true);
                        $('.pop-up #length-input').val('0');
                      }
                    } else {

                    }
                  });
                });
              }
            });
          }
        }
      })
    });
  }

  function editGroup(groupId) {
    $('.edit-feature-pop-up #feature-group-pop-up-input').find('option').remove();
    $.get('/base/hardware/get-group/' + groupId, function (data) {
      for (var i = 0, len = data.groupFolders.length; i < len; i++) {
        if (data.groupFolders[i].name !== 'Default') {
          $('.edit-feature-pop-up #feature-group-pop-up-input').append('' +
            '<option value="' + data.groupFolders[i].id + '">' +
              data.groupFolders[i].name +
            '</option>');
        } else {
          $('.edit-feature-pop-up #feature-group-pop-up-input').append('' +
            '<option value="' + data.groupFolders[i].id + '">' +
              'Отсутствует' +
            '</option>');
        }
      }
      $('#sync-code').val(data.group.code_sync);
      $('.edit-feature-pop-up #feature-id-pop-up-input').val(data.group.id);
      $('.edit-feature-pop-up #feature-name-pop-up-input').val(data.group.name);
      $('.edit-feature-pop-up #feature-producer-pop-up-input').val(data.group.producer);
      $('.edit-feature-pop-up #feature-country-pop-up-input').val(data.group.country);
      $('.edit-feature-pop-up #feature-link-pop-up-input').val(data.group.link);
      $('.edit-feature-pop-up #feature-description-pop-up').val(data.group.description);
      // $('.edit-feature-pop-up #feature-min-width-pop-up-input').val(data.group.min_width);
      // $('.edit-feature-pop-up #feature-max-width-pop-up-input').val(data.group.max_width);
      // $('.edit-feature-pop-up #feature-min-height-pop-up-input').val(data.group.min_height);
      // $('.edit-feature-pop-up #feature-max-height-pop-up-input').val(data.group.max_height);
      $('.edit-feature-pop-up #feature-coeff-heat-pop-up-input option[value="' + data.group.heat_coeff + '"]').attr('selected', 'selected');
      $('.edit-feature-pop-up #feature-coeff-noise-pop-up-input option[value="' + data.group.noise_coeff + '"]').attr('selected', 'selected');
      $('.edit-feature-pop-up #feature-image').attr('src', data.group.img)
      $('#feature-edit-pop-up-btn').attr('value', groupId);
      //$('.edit-feature-pop-up #feature-group-pop-up-input').append('<option value="0">Отсутствует</option>');
      $('.edit-feature-pop-up #feature-group-pop-up-input option[value="' + data.group.folder_id + '"]').attr('selected', 'selected');
      if (data.group.is_default) {
        $('.edit-feature-pop-up #checkbox-hardware-default').prop('checked', true);
      } else {
        $('.edit-feature-pop-up #checkbox-hardware-default').prop('checked', false);
      }

      if (data.group.is_in_calculation) {
        $('.edit-feature-pop-up #checkbox-hardware-active').prop('checked', true);
      } else {
        $('.edit-feature-pop-up #checkbox-hardware-active').prop('checked', false);
      }

      if (data.group.is_push) {
        $('.edit-feature-pop-up #checkbox-hardware-push').prop('checked', true);
      } else {
        $('.edit-feature-pop-up #checkbox-hardware-push').prop('checked', false);
      }

      $('.edit-feature-pop-up').popup('show');
    });
  }

    // $('#checkbox-new-hardware-push').click(function (e) {
    //   if (!$(this).prop('checked')) return;
    //
    //   e.preventDefault();
    //   checkHardwarePushAvailability(0, '.edit-feature-pop-up #checkbox-new-visor-push');
    // });

    $('#checkbox-hardware-push').click(function (e) {
      if (!$(this).prop('checked')) return;

      var folderId = $('.edit-feature-pop-up #feature-id-pop-up-input').val();
      e.preventDefault();
      checkHardwarePushAvailability(folderId, '.edit-feature-pop-up #checkbox-hardware-push');
    });

    /** Set additional folder as a push popup */
    function checkHardwarePushAvailability (folderId, input) {
      $.get('/base/hardware/is-push/' + folderId, function (data) {
        if (data.status) {
          if (data.isAvailable) {
            $(input).prop('checked', true);
          } else {
            showToaster(data.message, true);
          }
        }
      });
    }

  function removeFeature(featureId) {
    $.post('/base/hardware/removeFeature', {
      featureId: featureId
    }, function(response) {
      if (response.status) {
        window.location.reload();
      } else {
        $.toast({
          text : response.error,
          showHideTransition: 'fade',
          allowToastClose: true,
          hideAfter: 3000,
          stack: 5,
          position: {top: '60px', right: '30px'},
          bgColor: '#FF6633',
          textColor: '#fff',
        });
      }
    });
  }

  function editHardwareType(e) {
    var checkedWindowHardwareGroup = $('.checked-feature').attr('data');
    var hardwareTypeId = $('select.select-hardware-type').val();
    $.get('/base/hardware/type-options/' + hardwareTypeId + '/' + checkedWindowHardwareGroup, function(data) {
      if (data.status) {
        $('.edit-hardware-type-pop-up input[name="max_height"]').val(data.type.max_height);
        $('.edit-hardware-type-pop-up input[name="max_width"]').val(data.type.max_width);
        $('.edit-hardware-type-pop-up input[name="min_height"]').val(data.type.min_height);
        $('.edit-hardware-type-pop-up input[name="min_width"]').val(data.type.min_width);
        $('#hardware-type-id-pop-up-input').val(hardwareTypeId);
        $('#hardware-group-id-pop-up-input').val(checkedWindowHardwareGroup);
        $('.edit-hardware-type-pop-up').popup('show');
      } else {
        $.toast({
          text : 'Internal server error. Please, notify administrator.',
          showHideTransition: 'fade',
          allowToastClose: true,
          hideAfter: 3000,
          stack: 5,
          position: {top: '60px', right: '30px'},
          bgColor: '#FF6633',
          textColor: '#fff',
        });
      }
    });
  }

  function submitHardwareType(e) {
    e.preventDefault();
    $('#edit-hardware-type-form').submit();
  }

  function submitHardwareTypeForm(e) {
    e.preventDefault();
    var formData = new FormData(this);

    $.ajax({
      type:'POST',
      url: $(this).attr('action'),
      data: formData,
      cache: false,
      contentType: false,
      processData: false,
      success: function (data) {
        $('.edit-hardware-type-pop-up').popup('hide');
      },
      error: function (data) {
        console.log("error");
        console.log(data);
      }
    });
  }

  function __removeItemHandler(id) {
    $.post('/base/hardware/delete-hardware', {hardwareId: id}, function(data) {
      //window.location.reload();
      setTimeout(function() {
        $('tr.hardware-items-list[data="' + id + '"]').remove();
        $('.paginator-link.current-page').trigger('click');
      }, 600);
      $('tr.hardware-items-list[data="' + id + '"]').css('background','#ffcc99');
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

  $('div.country-item input').click(function() {
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
   setHardwareCountry($(this).attr('data-hardware-id'), CheckCountry);
  });

  function setHardwareCountry(HardwarefolderId, CheckCountry) {
    $.post('/base/hardware/getHardwareCountry/' + HardwarefolderId, CheckCountry
    , function(data) {
      if (!CheckCountry)
      {
        $("[name='checkHardware']").each(function() {
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
  
});
