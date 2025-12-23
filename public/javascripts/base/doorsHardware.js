$(function () {
  var LINEAR_SET = [7, 22, 4, 21, 10, 19, 9, 8, 2, 13, 12, 25, 5];
  var LINEAR_ELEMENT = [3, 5];
  var localizerOption = { resGetPath: '/assets/javascripts/vendor/localizer/__ns__-__lng__.json'};
  i18n.init(localizerOption);

  $('.folder-show').click(showFolder);
  $('td.add-new-group').click(addNewGroup);
  $('.add-hardware-group-image').click(addImageToNewGroup);
  $('#form-new-group').on('submit', submitNewGroup);
  $('.edit-hardware-group-image').click(editGroupImage);
  $('#form-edit-group').on('submit', submitEditGroup);
  $('#select-all-door-group').change(toggleDoorsGroupSelection);
  $('.show-lock-set').click(showAvailableLockSet);
  $('.submit-lock-set').click(submitNewLockSet);
  $('#add-set').click(addNewSet);
  $('#add-element').click(addNewElement);
  $('#form-new-set, #form-new-element').on('submit', submitNewGroupItem);
  $('#form-edit-item').on('submit', submitEditItem);
  $('#content-footer-ok').click(submitOperation);

  $('.popup-add-new-group input[name="group_image"]').change(validateImage);
  $('.popup-edit-group input[name="group_image"]').change(validateImage);

  /** Is hardware group available as a Push popup */
  $('#checkbox-new-hardware-push').click(function (e) {
    if (!$(this).prop('checked')) return;

    e.preventDefault();
    checkGroupPushAvailability(0, '.popup-add-new-group #checkbox-new-hardware-push');
  });

  $('#checkbox-hardware-push').click(function (e) {
    if (!$(this).prop('checked')) return;

    var groupId = $('.popup-edit-group input[name="hardware_group_id"]').val();
    e.preventDefault();
    checkGroupPushAvailability(groupId, '.popup-edit-group #checkbox-hardware-push');
  });

  /** Set additional folder as a push popup */
  function checkGroupPushAvailability (groupId, input) {
    $.get('/base/doors/hardware/is-push/' + groupId, function (data) {
      if (data.status) {
        if (data.isAvailable) {
          $(input).prop('checked', true);
        } else {
          showToaster(data.message, true);
        }
      }
    });
  }

  /** Init popups */
  initPopups([
    '.popup-add-new-group',
    '.popup-edit-group',
    '.popup-add-new-set',
    '.popup-add-new-element',
    '.popup-edit-item'
  ]);

  function showFolder (e) {
    e.preventDefault();

    startLoader();
    var folderId = $(this).attr('data-id');

    if (!$(this).hasClass('opened')) {
      $(this).addClass('opened');
      _getGroups(folderId);
    } else {
      // hide preferences and empty items table
      if ($('table.groups-table[data-id="' + folderId + '"]').find('tr.group-list-item.opened').length) {
        $('table#group-items > tbody').empty().append(_returnUnselectedGroupTemplate());
        $('.hardware-group-preferences').hide();
        initPaginator(0, 0);
      }

      $(this).removeClass('opened');
      $('table.groups-table[data-id="' + folderId + '"]').hide();
      $('table.groups-table[data-id="' + folderId + '"] > tbody').empty();

      stopLoader();
    }
  }

  function _getGroups (folderId) {
    $.get('/base/doors/hardware/groups/get/' + folderId, function (data) {
      if (data.status) {
        if (data.groups.length) {
          var groupsBody = '';
          var selector = 'table.groups-table[data-id="' + folderId + '"] > tbody';

          for (var i = 0, len = data.groups.length; i < len; i++) {
            groupsBody += _returnHardwareGroupTemplate(data.groups[i]);
          }

          $(selector).append(groupsBody);
          $(selector + ' .edit-hardware-group').click(editHardwareGroup);
          $(selector + ' tr.group-list-item').click(openHardwareGroup);
        } else {

        }
        $('table.groups-table[data-id="' + folderId + '"]').show();
        stopLoader();
      }
    })
  }

  function addNewGroup (e) {
    e.preventDefault();

    var folderId = $(this).closest('table.groups-table').attr('data-id');
    $('.popup-add-new-group input[name="hardware_type_id"]').val(folderId);
    $('.popup-add-new-group img.image-preview').attr('src', '/local_storage/default.png');
    $('.popup-add-new-group').popup('show');
  }

  function addImageToNewGroup (e) {
    e.preventDefault();

    $('.popup-add-new-group input[name="group_image"]').trigger('click');
  }

  function editGroupImage (e) {
    e.preventDefault();

    $('.popup-edit-group input[name="group_image"]').trigger('click');
  }

  function submitNewGroup (e) {
    e.preventDefault();

    var formData = new FormData(this);
    var formAction = $(this).attr('action');

    submitForm({ action: formAction, data: formData }, onResponse);

    function onResponse (data) {
      if (data.status) {
        var selector = 'table.groups-table[data-id="' + data.group.hardware_type_id + '"] > tbody';
        var newGroupTemplate = _returnHardwareGroupTemplate(data.group);
        $(selector).append(newGroupTemplate);
        $(selector + ' tr.group-list-item[data-id="' + data.group.id + '"]').click(openHardwareGroup);
        $(selector + ' .edit-hardware-group[data-id="' + data.group.id + '"]').click(editHardwareGroup);
        $('.popup-add-new-group').popup('hide');
      }
    }
  }

  function editHardwareGroup (e) {
    e.preventDefault();
    e.stopPropagation();

    var hardwareGroupId = $(this).attr('data-id');

    $.get('/base/doors/hardware/group/get/' + hardwareGroupId, function (data) {
      if (data.status) {
        $('.popup-edit-group input[name="hardware_group_id"]').val(hardwareGroupId);
        $('.popup-edit-group select[name="type"]').val(data.group.type);
        $('.popup-edit-group input[name="name"]').val(data.group.name);
        $('.popup-edit-group input[name="producer"]').val(data.group.producer);
        $('.popup-edit-group input[name="country"]').val(data.group.country);
        $('.popup-edit-group input[name="link"]').val(data.group.link);
        $('.popup-edit-group textarea[name="description"]').val(data.group.description);
        $('.popup-edit-group select[name="anticorrosion_coeff"]').val(data.group.anticorrosion_coeff);
        $('.popup-edit-group select[name="burglar_coeff"]').val(data.group.burglar_coeff);
        $('.popup-edit-group input[name="width_min"]').val(data.group.width_min);
        $('.popup-edit-group input[name="width_max"]').val(data.group.width_max);
        $('.popup-edit-group input[name="height_min"]').val(data.group.height_min);
        $('.popup-edit-group input[name="height_max"]').val(data.group.height_max);
        $('.popup-edit-group img.image-preview').attr('src', data.group.image);

        if (parseInt(data.group.is_active, 10)) {
          $('.popup-edit-group input[name="is_active"]').prop('checked', true);
        } else {
          $('.popup-edit-group input[name="is_active"]').prop('checked', false);
        }

        if (parseInt(data.group.is_push, 10)) {
          $('.popup-edit-group input[name="is_push"]').prop('checked', true);
        } else {
          $('.popup-edit-group input[name="is_push"]').prop('checked', false);
        }

        $('.popup-edit-group').popup('show');
      }
    });
  }

  function submitEditGroup (e) {
    e.preventDefault();

    var formData = new FormData(this);
    var formAction = $(this).attr('action');

    submitForm({ action: formAction, data: formData }, onResponse);

    function onResponse (data) {
      if (data.status) {
        var selector = '.group-list-item[data-id="' + data.group.id + '"] ';
        // var anticorrosionBoxes = '';
        // var burglarBoxes = '';

        // for (var i = 0; i < data.group.anticorrosion_coeff; i++) {
        //   anticorrosionBoxes += '<div class="coeff-stength"></div>'
        // }
        //
        // for (var j = 0; j < data.group.burglar_coeff; j++) {
        //   burglarBoxes += '<div class="coeff-stength"></div>'
        // }

        $(selector + '.group-list-image img').attr('src', data.group.image);
        $(selector + '.group-list-name strong').text(data.group.name);
        $(selector + '.group-list-producer strong').text(data.group.producer);
        $(selector + '.group-list-country strong').text(data.group.country);
        // $(selector + '.anticorrosion-boxes-container').html(anticorrosionBoxes);
        // $(selector + '.burglar-boxes-container').html(burglarBoxes);
        $('.popup-edit-group').popup('hide');
      }
    }
  }

  function openHardwareGroup (e) {
    e.preventDefault();

    var hardwareGroupId = $(this).attr('data-id');

    if (!$(this).hasClass('opened')) {
      $('tr.group-list-item').removeClass('opened');
      $(this).addClass('opened');
      _getHardwareGroupElements(hardwareGroupId, 0);
      _updateDoorGroupsTable(hardwareGroupId);
      _updateLockLists(hardwareGroupId);
      $('.hardware-group-preferences').show();
    } else {
      $('tr.group-list-item').removeClass('opened');
      $('table#group-items > tbody').empty().append(_returnUnselectedGroupTemplate());
      $('.hardware-group-preferences').hide();
      initPaginator(0, 0);
    }
  }

  function _getHardwareGroupElements (hardwareGroupId, page) {
    $.get('/base/doors/hardware/group/items/' + hardwareGroupId + '?page=' + (page || 0), function (data) {
      if (data.status) {
        initPaginator(data.totalPages, page, hardwareGroupId);
        $('table#group-items > tbody').empty();

        if (data.items.rows.length) {
          var items = '';

          for (var i = 0, len = data.items.rows.length; i < len; i++) {
            var itemsData = data.items.rows[i].child_type === 'list' ? data.lists : data.elements;
            var color = data.items.rows[i].lamination_factory_color ? data.items.rows[i].lamination_factory_color.name : 'Не учитывать';

            items += _returnItemTemplate(data.items.rows[i], itemsData, color);
          }

          $('table#group-items > tbody').append(items);
          $('table#group-items > tbody tr.group-item').click(editGroupItem);
          $('table#group-items > tbody tr.group-item .hardware-checkbox').click(function (e) {
            e.stopPropagation();
          });
        } else {
          $('table#group-items > tbody').append(_returnEmptyElementsTableTemplate());
        }
      }
    });
  }

  /** group's items functionality */
    function editGroupItem (e) {
      e.preventDefault();

      var itemId = $(this).attr('data-id');
      var itemName = $(this).find('td.item-name').text();

      $.get('/base/doors/hardware/item/' + itemId, function (data) {
        if (data.status) {
          var colorOptions = '' +
            '<option value="0">' + i18n.t('Ignore') + '</option>' +
            '<option value="1">' + i18n.t('White') + '</option>';
          $('.popup-edit-item select[name="color_id"]').empty();

          for (var i = 0, len = data.colors.length; i < len; i++) {
            colorOptions += '' +
              '<option ' +
                'value="' + data.colors[i].id + '">' + data.colors[i].name +
              '</option>';
          }

          $('.popup-edit-item select[name="color_id"]').append(colorOptions);

          $('.popup-edit-item #item-name-container').text(itemName);
          $('.popup-edit-item select[name="direction_id"]').val(data.item.direction_id);
          $('.popup-edit-item select[name="color_id"]').val(data.item.hardware_color_id);
          $('.popup-edit-item input[name="length"]').val(data.item['length']);
          $('.popup-edit-item input[name="amount"]').val(data.item.count);
          $('.popup-edit-item input[name="width_min"]').val(data.item.min_width);
          $('.popup-edit-item input[name="width_max"]').val(data.item.max_width);
          $('.popup-edit-item input[name="height_min"]').val(data.item.min_height);
          $('.popup-edit-item input[name="height_max"]').val(data.item.max_height);
          $('.popup-edit-item input[name="item_id"]').val(data.item.id);
          $('.popup-edit-item').popup('show');
        }
      });
    }

  function _updateDoorGroupsTable (hardwareGroupId) {
    $.get('/base/doors/hardware/dependency/door/' + hardwareGroupId, function (data) {
      $('table#door-groups .door-groups-items').empty();

      if (data.status) {
        if (data.doorsGroups.length) {
          var doorGroupBoxes = '';

          for (var i = 0, len = data.doorsGroups.length; i < len; i++) {
            doorGroupBoxes += '' +
              '<span class="door-group-box">' +
                '<input id="box' + data.doorsGroups[i].id + '" ' +
                  'data-id="' + data.doorsGroups[i].id + '" ' +
                'type="checkbox">' +
                '<label for="box' + data.doorsGroups[i].id + '">' +
                  data.doorsGroups[i].name +
                '</label>' +
              '</span>';
          }

          $('table#door-groups .door-groups-items').append(doorGroupBoxes);

          data.dependenciesGroupsIds.map(function (doorGroupId) {
            $('table#door-groups .door-groups-items input[data-id="' + doorGroupId + '"]').prop('checked', true);
          });

          $('table#door-groups .door-groups-items input[type="checkbox"]').change(updateDoorGroupsDependecy);
        }
      }
    });
  }

  function _updateLockLists (hardwareGroupId) {
    $('ul.lock-list-container').empty();

    $.get('/base/doors/hardware/dependency/lock/' + hardwareGroupId, function (data) {
      if (data.status) {
        if (data.lockLists.length) {
          var lockListsContent = '';

          for (var i = 0, len = data.lockLists.length; i < len; i++) {
            lockListsContent += '' +
              '<li class="lock-list-item" ' +
                'data-id="' + data.lockLists[i].id + '">' +
                '<span class="pull-left">' +
                  data.lockLists[i].list.name +
                '</span>' +
                '<input class="remove-btn remove-lock-set pull-right" ' +
                  'type="button" ' +
                  'data-id="' + data.lockLists[i].id + '" ' +
                'value="">' +
              '</li>';
          }

          $('ul.lock-list-container').append(lockListsContent);
          $('ul.lock-list-container input.remove-lock-set').click(removeLockList);
        } else {
          $('ul.lock-list-container').append('<li class="empty-lock-list">' +
            i18n.t('Empty') +
          '</li>');
        }
      }
    });
  }

  function toggleDoorsGroupSelection (e) {
    if ($(this).prop('checked')) {
      $('.door-group-box input[type="checkbox"]').prop('checked', true);
      $('.door-group-box input[type="checkbox"]').trigger('change');
    } else {
      $('.door-group-box input[type="checkbox"]').prop('checked', false);
      $('.door-group-box input[type="checkbox"]').trigger('change');
    }
  }

  function showAvailableLockSet (e) {
    e.preventDefault();

    var lockSetContainer = $('.lock-set-select-container');
    $('select#lock-set-select').empty();

    if (lockSetContainer.hasClass('opened')) {
      $('ul.lock-list-container').css('max-height', '110px');
      lockSetContainer.removeClass('opened').hide();
    } else {
      $('ul.lock-list-container').css('max-height', '88px');

      $.get('/base/doors/hardware/locks/get', function (data) {
        if (data.status) {
          if (data.availableLockLists.length) {
            data.availableLockLists.sort((a, b) =>
              a.name.localeCompare(b.name)
            );
            var availableLockListsOptions = '';

            for (var i = 0, len = data.availableLockLists.length; i < len; i++) {
              availableLockListsOptions += '' +
              '<option value="' + data.availableLockLists[i].id + '">' +
                data.availableLockLists[i].name +
              '</option>';
            }

            $('select#lock-set-select').prop('disabled', false).append(availableLockListsOptions);
            $('input.submit-lock-set').prop('disabled', false);
          } else {
            $('select#lock-set-select').prop('disabled', true).append('<option value="0">' +
              i18n.t('Not exist') +
            '</option>');
            $('input.submit-lock-set').prop('disabled', true);
          }
          lockSetContainer.addClass('opened').show();
        }
      });
    }
  }

  function submitNewLockSet (e) {
    e.preventDefault();

    var lockSetId = $('select#lock-set-select option:selected').attr('value');
    var lockSetName = $('select#lock-set-select option:selected').text();
    var groupId = $('.group-list-item.opened').attr('data-id');

    $.post('/base/doors/hardware/lock/add', {
      groupId: groupId,
      lockSetId: lockSetId
    }, function (data) {
      if (data.status) {
        $('ul.lock-list-container').find('li.empty-lock-list').remove();
        $('ul.lock-list-container').append('<li class="lock-list-item" ' +
          'data-id="' + data.newLockList.id + '">' +
          '<span class="pull-left">' +
            lockSetName +
          '</span>' +
          '<input class="remove-btn remove-lock-set pull-right" ' +
            'type="button" ' +
            'data-id="' + data.newLockList.id + '" ' +
          'value="">' +
        '</li>');

        $('ul.lock-list-container input.remove-lock-set[data-id="' + data.newLockList.id + '"]').click(removeLockList);
        showToaster('Ручка добавлена.', false);
      } else {
        showToaster('Internal server error.', true);
      }
    });
  }

  function removeLockList (e) {
    e.preventDefault();

    var lockListId = $(this).attr('data-id');

    $.post('/base/doors/hardware/lock/remove', {
      lockListId: lockListId
    }, function (data) {
      if (data.status) {
        $('ul.lock-list-container li.lock-list-item[data-id="' + lockListId + '"]').remove();

        if (!$('ul.lock-list-container').find('li.lock-list-item').length) {
          $('ul.lock-list-container').append('<li class="empty-lock-list">' +
            i18n.t('Empty') +
          '</li>');
        }

        showToaster('Привязка к набору удалена.', false);
      } else {
        showToaster('Internal server error.', true);
      }
    });
  }

  function updateDoorGroupsDependecy (e) {
    var doorGroupId = $(this).attr('data-id');
    var hardwareGroupId = $('.group-list-item.opened').attr('data-id');
    var isChecked = this.checked;

    $.post('/base/doors/hardware/dependency/door', {
      doorGroupId: doorGroupId,
      hardwareGroupId: hardwareGroupId,
      isChecked: isChecked
    }, function (data) {
      if (data.status) {
        showToaster(i18n.t('Changes saved'), false);
      } else {
        showToaster(i18n.t('Internal server error'), true);
      }
    });
  }

  function addNewSet (e) {
    e.preventDefault();

    var hardwareGroupId = $('.group-list-item.opened').attr('data-id');
    localStorage.setItem('itemType', 'set');

    /**
     * Using an old route from hardware
     * TODO: rewrite route
     */
    $.get('/base/hardware/get-lists-group', function (listGroups) {
      $.get('/base/hardware/get-hardware-colors', function (colors) {
        var listGroupsOptions = '';
        var colorsOptions = '' +
          '<option value="0">' + i18n.t('Ignore') + '</option>' +
          '<option value="1">' + i18n.t('White') + '</option>';

        $('.popup-add-new-set select[name="group_id"]').empty();
        $('.popup-add-new-set select[name="color_id"]').empty();

        for (var i = 0, len = listGroups.length; i < len; i++) {
          listGroupsOptions += '' +
            '<option ' +
              'value="' + listGroups[i].id + '">' + listGroups[i].name +
            '</option>';
        }

        for (var j = 0, len2 = colors.length; j < len2; j++) {
          colorsOptions += '' +
            '<option ' +
              'value="' + colors[j].id + '">' + colors[j].name +
            '</option>';
        }

        $('.popup-add-new-set select[name="group_id"]').append(listGroupsOptions);
        $('.popup-add-new-set select[name="color_id"]').append(colorsOptions);
        $('.popup-add-new-set select[name="group_id"]').trigger('change');
        $('.popup-add-new-set select[name="group_id"]').val('16');
        $('.popup-add-new-set select[name="color_id"]').val('0');
        $('.popup-add-new-set input[name="length"]').val('0');
        $('.popup-add-new-set input[name="amount"]').val('0');
        $('.popup-add-new-set input[name="hardware_group_id"]').val(hardwareGroupId);
        $('.popup-add-new-set').popup('show');
      });
    });
  }

  /** Popup events */
    $('.popup-add-new-set select[name="group_id"]').change(function (e) {
      var group = $(this).val();
      var query = $('.popup-add-new-set .item-query-search-input').val();

      if (LINEAR_SET.indexOf(parseInt(group, 10)) >= 0) {
        $('.popup-add-new-set .length-preference').removeClass('disabled');
        $('.popup-add-new-set input[name="length"]').prop('disabled', false);
      } else {
        $('.popup-add-new-set .length-preference').addClass('disabled');
        $('.popup-add-new-set input[name="length"]').prop('disabled', true);
      }

      $.get('/base/hardware/get-lists-of-group/' + group + '?tquery=' + query, function (lists) {
        var listsOptions = '';

        $('.popup-add-new-set select[name="item_id"]').empty();

        if (lists.length) {
          for (var i = 0, len = lists.length; i < len; i++) {
            listsOptions += '' +
            '<option ' +
              'value="' + lists[i].id + '">' + lists[i].name +
            '</option>'
          }

          $('.popup-add-new-set select[name="item_id"]').append(listsOptions);
          $('.popup-add-new-set input[type="submit"]').show();
        } else {
          $('.popup-add-new-set select[name="item_id"]').append('<option ' +
            'value="0">' + i18n.t('Not exist') +
          '</option>');
          $('.popup-add-new-set input[type="submit"]').hide();
        }
      });
    });

    $('.popup-add-new-set input.item-query-search-input').keyup(function (e) {
      $('.popup-add-new-set select[name="group_id"]').trigger('change');
    });

  function addNewElement (e) {
    e.preventDefault();

    var hardwareGroupId = $('.group-list-item.opened').attr('data-id');
    localStorage.setItem('itemType', 'element');

    /**
     * Using an old route from hardware
     * TODO: rewrite route
     */
    $.get('/base/hardware/get-elements-groups', function (elementsGroups) {
      $.get('/base/hardware/get-hardware-colors', function (colors) {
        var elementsGroupsOptions = '';
        var colorsOptions = '' +
          '<option value="0">' + i18n.t('Ignore') + '</option>' +
          '<option value="1">' + i18n.t('White') + '</option>';

        $('.popup-add-new-element select[name="group_id"]').empty();
        $('.popup-add-new-element select[name="color_id"]').empty();

        for (var i = 0, len = elementsGroups.length; i < len; i++) {
          elementsGroupsOptions += '' +
            '<option ' +
              'value="' + elementsGroups[i].id + '">' + elementsGroups[i].name +
            '</option>';
        }

        for (var j = 0, len2 = colors.length; j < len2; j++) {
          colorsOptions += '' +
            '<option ' +
              'value="' + colors[j].id + '">' + colors[j].name +
            '</option>';
        }

        $('.popup-add-new-element select[name="group_id"]').append(elementsGroupsOptions);
        $('.popup-add-new-element select[name="color_id"]').append(colorsOptions);
        $('.popup-add-new-element select[name="group_id"]').trigger('change');
        $('.popup-add-new-element select[name="group_id"]').val('16');
        $('.popup-add-new-element select[name="color_id"]').val('0');
        $('.popup-add-new-element input[name="length"]').val('0');
        $('.popup-add-new-element input[name="amount"]').val('0');
        $('.popup-add-new-element input[name="hardware_group_id"]').val(hardwareGroupId);
        $('.popup-add-new-element').popup('show');
      });
    });
  }

  /** Popup events */
    $('.popup-add-new-element select[name="group_id"]').change(function (e) {
      var group = $(this).val();
      var query = $('.popup-add-new-element .item-query-search-input').val();

      if (LINEAR_ELEMENT.indexOf(parseInt(group, 10)) >= 0) {
        $('.popup-add-new-element .length-preference').removeClass('disabled');
        $('.popup-add-new-element input[name="length"]').prop('disabled', false);
      } else {
        $('.popup-add-new-element .length-preference').addClass('disabled');
        $('.popup-add-new-element input[name="length"]').prop('disabled', true);
      }

      $.get('/base/hardware/get-elements-of-group/' + group + '?tquery=' + query, function (elements) {
        var elementsOptions = '';

        $('.popup-add-new-element select[name="item_id"]').empty();

        if (elements.length) {
          for (var i = 0, len = elements.length; i < len; i++) {
            elementsOptions += '' +
            '<option ' +
              'value="' + elements[i].id + '">' + elements[i].name +
            '</option>'
          }

          $('.popup-add-new-element select[name="item_id"]').append(elementsOptions);
          $('.popup-add-new-element input[type="submit"]').show();
        } else {
          $('.popup-add-new-element select[name="item_id"]').append('<option ' +
            'value="0">' + i18n.t('Not exist') +
          '</option>');
          $('.popup-add-new-element input[type="submit"]').hide();
        }
      });
    });

    $('.popup-add-new-element input.item-query-search-input').keyup(function (e) {
      $('.popup-add-new-element select[name="group_id"]').trigger('change');
    });

  function submitNewGroupItem (e) {
    e.preventDefault();

    var formData = new FormData(this);
    var formAction = $(this).attr('action');
    var selector = '.popup-add-new-' + localStorage.getItem('itemType');
    // var color = $(selector + ' select[name="color_id"] option:selected').text();
    // var name =  option:selected').text();
    var hardwareGroupId = $('.group-list-item.opened').attr('data-id');
    var page = $('.paginator > a.current-page').attr('data-page') || 0;

    submitForm({ action: formAction, data: formData }, onResponse);

    function onResponse (data) {
      if (data.status) {
        // var itemTemplate = _returnItemTemplate(data.newGroupItem, name, color);
        _getHardwareGroupElements(hardwareGroupId, page);
        $('.pop-up').popup('hide');
      }
    }
  }

  function submitEditItem (e) {
    e.preventDefault();

    var formData = new FormData(this);
    var formAction = $(this).attr('action');
    var selector = '.popup-add-new-' + localStorage.getItem('itemType');
    var hardwareGroupId = $('.paginator > a.current-page').attr('data-group-id');
    var page = $('.paginator > a.current-page').attr('data-page');

    submitForm({ action: formAction, data: formData }, onResponse);

    function onResponse (data) {
      if (data.status) {
        // var itemTemplate = _returnItemTemplate(data.newGroupItem, name, color);
        _getHardwareGroupElements(hardwareGroupId, page);
        $('.pop-up').popup('hide');
      }
    }
  }

  /** Templates */
  function _returnHardwareGroupTemplate (hardwareGroup) {
    // var anticorrosionBoxes = '';
    // var burglarBoxes = '';

    // for (var i = 0; i < hardwareGroup.anticorrosion_coeff; i++) {
    //   anticorrosionBoxes += '<div class="coeff-stength"></div>'
    // }
    //
    // for (var j = 0; j < hardwareGroup.burglar_coeff; j++) {
    //   burglarBoxes += '<div class="coeff-stength"></div>'
    // }

    return '' +
      '<tr class="group-list-item" data-id="' + hardwareGroup.id + '">' +
        '<td>' +
          '<span class="group-list-image">' +
            '<img src="' + hardwareGroup.image + '">' +
          '</span>' +
        '</td>' +
        '<td class="group-list-name">' +
          i18n.t('Name') +
          '<br>' +
          '<strong>' + hardwareGroup.name + '</strong>' +
        '</td>' +
        '<td class="group-list-producer">' +
          i18n.t('Producer') +
          '<br>' +
          '<strong>' + hardwareGroup.producer + '</strong>' +
        '</td>' +
        '<td class="group-list-country">' +
          i18n.t('Country') +
          '<br>' +
          '<strong>' + hardwareGroup.country + '</strong>' +
          '<div class="row">' +
            '<input class="edit-btn edit-hardware-group" ' +
              'data-id="' + hardwareGroup.id + '" ' +
              'type="button" ' +
            'value="">' +
          '</div>' +
        '</td>' +
      '</tr>';
  }

  function _returnEmptyElementsTableTemplate () {
    return '' +
      '<tr class="group-item">' +
        '<td class="message-select-group" colspan="8">' +
          i18n.t('Empty') +
        '</td>' +
      '</tr>';
  }

  function _returnUnselectedGroupTemplate () {
    return '' +
      '<tr class="group-item">' +
        '<td class="message-select-group" colspan="8">' +
          i18n.t('Select group') +
        '</td>' +
      '</tr>';
  }

  function _returnItemTemplate (item, name, color) {
    var direction = 'Не учитывать';
    var itemName = name;

    if (typeof name !== 'string') {
      name.forEach(function (el) {
        if (item.child_id === el.id) {
          itemName = el.name;
        }
      });
    }

    if (item.direction_id === 2) {
      direction = 'Правое';
    } else if (item.direction_id === 3) {
      direction = 'Левое';
    }

    return '' +
      '<tr class="group-item" data-id="' + item.id + '">' +
        '<td class="item-input-choose">' +
          '<input class="hardware-checkbox" ' +
            'id="checkbox' + item.id + '" ' +
            'type="checkbox" ' +
            'value="' + item.id + '" ' +
            'name="checkedElements" ' +
          'style="margin-left: 25px;">' +
          '<label for="checkbox' + item.id + '">' +
            '<span id="hide">' +
            '</span>' +
          '</label>' +
        '</td>' +
        '<td class="item-name">' +
          itemName +
        '</td>' +
        '<td class="item-count">' +
          item.count +
        '</td>' +
        '<td class="item-width">' +
          item.min_width + ' - ' + item.max_width +
        '</td>' +
        '<td class="item-heigth">' +
          item.min_height + ' - ' + item.max_height +
        '</td>' +
        '<td class="item-direction">' +
          direction +
        '</td>' +
        '<td class="item-color">' +
          color +
        '</td>' +
        '<td class="item-length">' +
           item.length +
        '</td>' +
      '</tr>';
  }

  /** Utils */
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

  function validateImage (e) {
    var self = this;

    getInputImage(e, function (err, result) {
      if (err) {
        showToaster(i18n.t('Invalid image type'), true);
      } else {
        var closestFormId = '#' + $(self).closest('form').attr('id');
        $(closestFormId + ' img.image-preview').attr('src', result);
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

  function initPaginator (totalPages, currentPage, hardwareGroupId) {
    $('.paginator').empty();
    if (totalPages === 0 && currentPage === 0) return;

    var from = currentPage;
    var to = totalPages;
    var firstCount = Math.min(3, totalPages);

    if ((totalPages > 3) && (currentPage == 2)) firstCount = 4;

    if (totalPages === 0) {
      $('.paginator').append('<a class="paginator-link current-page hidden-paginator" data-page=' + currentPage + ' data-group-id=' + hardwareGroupId + ' href="#">0</a>');
    }

    if (currentPage > 0) {
      $('.paginator').append('<a class="paginator-link" data-page=' + (currentPage - 1) + ' data-group-id=' + hardwareGroupId + ' href="#"><</a>');
    }

    if ((from >= 3) && (totalPages != 4)) {
      $('.paginator').append('<a class="paginator-link" data-page=' + 0 + ' data-group-id=' + hardwareGroupId + ' href="#">1</a> ... ');
      if (totalPages - 3 > currentPage) {
        n = currentPage - 1;
        while (n < currentPage + 2) {
          if (currentPage == n) {
            $('.paginator').append('<a class="paginator-link current-page" data-page=' + n + ' data-group-id=' + hardwareGroupId + ' href="#">' + ++n + '</a>');
          } else {
            $('.paginator').append('<a class="paginator-link" data-page=' + n + ' data-group-id=' + hardwareGroupId + ' href="#">' + ++n + '</a>');
          }
        }
        $('.paginator').append(' ... ');
        if (currentPage == totalPages - 1) {
          $('.paginator').append('<a class="paginator-link current-page" data-page=' + (totalPages - 1) + ' data-group-id=' + hardwareGroupId + ' href="#">' + totalPages + '</a>');
        } else {
          $('.paginator').append('<a class="paginator-link" data-page=' + (totalPages - 1) + ' data-group-id=' + hardwareGroupId + ' href="#">' + totalPages + '</a>');
        }
      } else {
        n = totalPages - 3
        if (currentPage == totalPages - 3) {
          n = totalPages - 4;
          while (n < totalPages) {
            if (currentPage == n) {
              $('.paginator').append('<a class="paginator-link current-page" data-page=' + n + ' data-group-id=' + hardwareGroupId + ' href="#">' + ++n + '</a>');
            } else {
              $('.paginator').append('<a class="paginator-link" data-page=' + n + ' data-group-id=' + hardwareGroupId + ' href="#">' + ++n + '</a>');
            }
          }
        }
      }
    } else {
      n = 0
      if (totalPages == 4) firstCount = 4;
      while (n < firstCount) {
        if (currentPage == n) {
          $('.paginator').append('<a class="paginator-link current-page" data-page=' + n + ' data-group-id=' + hardwareGroupId + ' href="#">' + ++n + '</a>');
        } else {
          $('.paginator').append('<a class="paginator-link" data-page=' + n + ' data-group-id=' + hardwareGroupId + ' href="#">' + ++n + '</a>');
        }
      }
      if (totalPages > firstCount) {
        if (currentPage == totalPages - 1) {
          $('.paginator').append('<a class="paginator-link current-page" data-page=' + (totalPages - 1) + ' data-group-id=' + hardwareGroupId + ' href="#">' + totalPages + '</a>');
        } else {
          $('.paginator').append('<a class="paginator-link" data-page=' + (totalPages - 1) + ' data-group-id=' + hardwareGroupId + ' href="#">' + totalPages + '</a>');
        }
      }

    }

    if (currentPage < totalPages - 1) {
      $('.paginator').append('<a class="paginator-link" data-page=' + (currentPage + 1) + ' data-group-id=' + hardwareGroupId + ' href="#">></a>');
    }

    /* add event listener on paginator link */
    $('.paginator').on('click', '.paginator-link', function (e) {
      e.preventDefault();
      e.stopImmediatePropagation();

      var page = $(this).attr('data-page');
      var hardwareGroupId = $(this).attr('data-group-id');
      _getHardwareGroupElements(hardwareGroupId, page);
    });
  }

  function submitOperation (e) {
    e.preventDefault();
    e.stopPropagation();

    var operationType = $("select#selectOption").val();
    var elementsType = $("#radioSelected").prop('checked');
    var checkedElements = $("input[name='checkedElements']");

    if (!operationType) return;

    deleteElements();

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
  }

  function __removeItemHandler (itemId) {
    $.post('/base/doors/hardware/item/remove', {
      itemId: itemId
    }, function (data) {
      if (data.status) {
        setTimeout(function() {
          $('tr.group-item[data-id="' + itemId + '"]').remove();
          $('.paginator-link.current-page').trigger('click');
        }, 600);
        $('tr.group-item[data-id="' + itemId + '"]').css('background','#ffcc99');
      }
    });
  }
});
