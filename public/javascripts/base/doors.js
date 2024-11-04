$(function () {
  var localizerOption = { resGetPath: '/assets/javascripts/vendor/localizer/__ns__-__lng__.json'};
  var temporDependencyId = 'tempor-1';

  i18n.init(localizerOption);
  $('#add-new-folder').click(addNewFolder); // add new folder
  $('#form-new-folder').on('submit', submitNewFolder); // submit new folder
  $('.folder-edit').click(editFolder); // edit folder
  $('#form-edit-folder').on('submit', submitEditFolder); // edit folder
  $('.folder-open').click(openFolder); // open folder
  $('.add-dependency-btn').click(addDoorGroupDependency); // add lamination dependency
  $('.tr-group-item').click(openDoorGroup); // open door group
  $('#add-new-group').click(addDoorGroup); // add new door group
  $('#form-new-group').on('submit', submitNewGroup); // submit new door group
  $('.group-edit').click(editDoorGroup); // edit door group
  $('#form-edit-group').on('submit', submitEditGroup); // submit edit group
  $('table.door-lamination-table select').change(updateDependency); // update dependency values

  /** Init popups */
  initPopups([
    '.popup-add-new-group',
    '.popup-edit-group',
    '.popup-add-new-folder',
    '.popup-edit-folder'
  ]);

  /** Event listeners */
  function addNewFolder (e) {
    e.preventDefault();

    $('.popup-add-new-folder').popup('show');
  }

  function submitNewFolder (e) {
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
    e.preventDefault();

    var folderId = $(this).attr('data-id');
    var currentName = $('.folder-btn[data-id="' + folderId + '"]').val();

    $('.popup-edit-folder input[name="folder_id"]').val(folderId);
    $('.popup-edit-folder input[name="name"]').val(currentName);
    $('.popup-edit-folder').popup('show');
  }

  function submitEditFolder (e) {
    e.preventDefault();

    var formData = new FormData(this);
    var formAction = $(this).attr('action');

    submitForm({ action: formAction, data: formData }, onResponse);

    function onResponse (data) {
      if (data.status) {
        $('.folder-btn[data-id="' + data.folder.id + '"]').val(data.folder.name);
        $('.pop-up').popup('hide');
        showToaster('Изменения сохранены', false);
      }
    }
  }

  function openFolder (e) {
    e.preventDefault();
    var self = this;
    var folderId = $(this).attr('data-id');

    startLoader();

    $('table.table-door-groups[data-id=' + folderId + '] tbody').empty();

    if(!$(self).hasClass('opened')) {
      $.get('/base/doors/folder/open/' + folderId, function (data) {
        if (data.status) {
          if (data.groups.length) {
            for (var i = 0, len = data.groups.length; i < len; i++) {
              _appendGroup(data.groups[i]);
            }
            $('table.table-door-groups[data-id=' + folderId + '] table.door-lamination-table[data-id="0"] select').change(updateDependency);
          } else {
            _appendEmptyFolder(folderId);
          }

          $(self).addClass('opened');
          stopLoader();

          function _appendGroup(group) {
            var selector = 'table.table-door-groups[data-id=' + group.folder_id + ']';
            var newGroup = _returnNewGroup(data.default, group);
            $(selector + ' > tbody').append(newGroup);
            $(selector + ' .tr-group-item[data-id="' + group.id + '"]').click(openDoorGroup);
            $(selector + ' .group-edit').click(editDoorGroup);
            $(selector + ' .add-door-group[data-id="' + group.id + '"] .add-dependency-btn').click(addDoorGroupDependency);

            $(selector + ' table.door-lamination-table[data-id="0"] select[data-field="rama_list_id"]').val(group.rama_list_id);
            $(selector + ' table.door-lamination-table[data-id="0"] select[data-field="door_sill_list_id"]').val(group.door_sill_list_id);
            $(selector + ' table.door-lamination-table[data-id="0"] select[data-field="stvorka_list_id"]').val(group.stvorka_list_id);
            $(selector + ' table.door-lamination-table[data-id="0"] select[data-field="impost_list_id"]').val(group.impost_list_id);
            $(selector + ' table.door-lamination-table[data-id="0"] select[data-field="impost_in_stvorka_list_id"]').val(group.impost_in_stvorka_list_id);
            $(selector + ' table.door-lamination-table[data-id="0"] select[data-field="shtulp_list_id"]').val(group.shtulp_list_id);
            $(selector + ' table.door-lamination-table[data-id="0"] select[data-field="rama_sill_list_id"]').val(group.rama_sill_list_id);
          }
        }
      });
    } else {
      $(self).removeClass('opened');
      stopLoader();
    }
  }

  function addDoorGroupDependency (e) {
    e.preventDefault();
    var self = this;

    $.get('/base/doors/options', function (data) {
      if (data.status) {
        var folderId = $(self).attr('data-id');
        var selector = 'tr.edit-dependencies[data-id="' + folderId + '"]';
        var temporDependency = {
          id: temporDependencyId,
          rama_list_id: 0,
          door_sill_list_id: 0,
          stvorka_list_id: 0,
          impost_list_id: 0,
          impost_in_stvorka_list_id: 0,
          shtulp_list_id: 0,
          rama_sill_list_id: 0,
          code_sync_white: null
        };
        var newDependency = _returnDependencyTemplate(temporDependency, data.options);
        temporDependencyId = temporDependencyId.slice(0, -1) + (parseInt(temporDependencyId.slice(-1), 10) + 1); // update new Id

        $(selector + ' > td').append(newDependency);
        $(selector + ' > td' + ' input.dependency-add').click(submitNewDependency);
      }
    });
  }

  function submitNewDependency (e) {
    e.preventDefault();

    var self = this;
    var selector = $(this).closest('table.door-lamination-table');
    var groupId = selector.closest('tr.edit-dependencies').attr('data-id');
    var dependencyId = selector.attr('data-id');
    var laminationIn = selector.find('select.option-lamination-in').val();
    var laminationOut = selector.find('select.option-lamination-out').val();
    var codeSync = selector.find('input.option-code-sync').val();
    var ramaListId = selector.find('select[data-field="rama_list_id"]').val();
    var doorSillListId = selector.find('select[data-field="door_sill_list_id"]').val();
    var stvorkaListId = selector.find('select[data-field="stvorka_list_id"]').val();
    var impostListId = selector.find('select[data-field="impost_list_id"]').val();
    var impostStvorkaListId = selector.find('select[data-field="impost_in_stvorka_list_id"]').val();
    var shtulpListId = selector.find('select[data-field="shtulp_list_id"]').val();
    var ramaSillListId = selector.find('select[data-field="rama_sill_list_id"]').val();

    $.post('/base/doors/dependency/add', {
      groupId: groupId,
      laminationIn: laminationIn,
      laminationOut: laminationOut,
      codeSync: codeSync,
      ramaListId: ramaListId,
      doorSillListId: doorSillListId,
      stvorkaListId: stvorkaListId,
      impostListId: impostListId,
      impostStvorkaListId: impostStvorkaListId,
      shtulpListId: shtulpListId,
      ramaSillListId: ramaSillListId
    }, function (data) {
      if (data.status) {
        selector.attr('data-id', data.dependency.id);
        selector.addClass('existed');
        selector.find('select').change(updateDependency);
        showToaster('Зависимость добавлена', false);
        $(self).remove();
      }
    });
  }

  function updateDependency (e) {
    var folderId = null;
    var field = $(this).attr('data-field');
    var value = $(this).val();
    var dependencyId = $(this).closest('table.door-lamination-table').attr('data-id');

    if (dependencyId == '0') { // default white dependency
      folderId = $(this).closest('tr.edit-dependencies').attr('data-id');
      __updateDefaultDependency();
    } else {
      __updateDependency();
    }

    function __updateDefaultDependency () {
      $.post('/base/doors/group/update', {
        field: field,
        value: value,
        folderId: folderId
      }, function (data) {
        if (data.status) {
          showToaster('Изменения сохранены', false);
        }
      });
    }

    function __updateDependency () {
      $.post('/base/doors/dependency/update', {
        field: field,
        value: value,
        dependencyId: dependencyId
      }, function (data) {
        if (data.status) {
          showToaster('Изменения сохранены', false);
        }
      });
    }
  }

  function openDoorGroup (e) {
    e.preventDefault();

    var groupId = $(this).attr('data-id');
    var selector = 'tr.edit-dependencies[data-id="' + groupId + '"]';

    if ($(this).find('.group-show').hasClass('rotated')) {
      $(selector + ', ' +
        'tr.add-door-group[data-id="' + groupId + '"]').hide();
      $(selector + ' ' +
        'table.door-lamination-table.existed').remove();
      return $('.group-show[data-id="' + groupId + '"]').removeClass('rotated');
    }

    $.get('/base/doors/dependency/get/' + groupId, function (data) {
      if (data.status) {
        if (data.dependencies.length) {
          for (var i = 0, len = data.dependencies.length; i < len; i++) {
            initDependency(data.dependencies[i], data.options, selector);
          }
        }
        $(selector + ', ' +
          'tr.add-door-group[data-id="' + groupId + '"]').show();
        $('.group-show[data-id="' + groupId + '"]').addClass('rotated');
      }
    });

    function initDependency (dependency, options, selector) {
      var newDependency = _returnDependencyTemplate(dependency, options, true);

      $(selector + ' > td').append(newDependency);
      $(selector + ' table.door-lamination-table[data-id="' + dependency.id + '"] select[data-field="lamination_in"]').val(dependency.lamination_in);
      $(selector + ' table.door-lamination-table[data-id="' + dependency.id + '"] select[data-field="lamination_out"]').val(dependency.lamination_out);
      $(selector + ' table.door-lamination-table[data-id="' + dependency.id + '"] select[data-field="rama_list_id"]').val(dependency.rama_list_id);
      $(selector + ' table.door-lamination-table[data-id="' + dependency.id + '"] select[data-field="door_sill_list_id"]').val(dependency.door_sill_list_id);
      $(selector + ' table.door-lamination-table[data-id="' + dependency.id + '"] select[data-field="stvorka_list_id"]').val(dependency.stvorka_list_id);
      $(selector + ' table.door-lamination-table[data-id="' + dependency.id + '"] select[data-field="impost_list_id"]').val(dependency.impost_list_id);
      $(selector + ' table.door-lamination-table[data-id="' + dependency.id + '"] select[data-field="impost_in_stvorka_list_id"]').val(dependency.impost_in_stvorka_list_id);
      $(selector + ' table.door-lamination-table[data-id="' + dependency.id + '"] select[data-field="shtulp_list_id"]').val(dependency.shtulp_list_id);
      $(selector + ' table.door-lamination-table[data-id="' + dependency.id + '"] select[data-field="rama_sill_list_id"]').val(dependency.rama_sill_list_id);
      $(selector + ' table.door-lamination-table[data-id="' + dependency.id + '"] select').change(updateDependency);
    }
  }

  function addDoorGroup (e) {
    e.preventDefault();

    $('.popup-add-new-group').popup('show');
  }

  function submitNewGroup (e) {
    e.preventDefault();

    var formData = new FormData(this);
    var formAction = $(this).attr('action');

    submitForm({ action: formAction, data: formData }, onResponse);

    function onResponse (data) {
      if (data.status) {
        var selector = 'table.table-door-groups[data-id=' + data.group.folder_id + ']';
        var newGroup = _returnNewGroup(data.default, data.group);
        $(selector + ' td.td-empty').parent().remove();
        $(selector + ' > tbody').append(newGroup);
        $(selector + ' .tr-group-item[data-id="' + data.group.id + '"]').click(openDoorGroup);
        $(selector + ' .tr-group-item[data-id="' + data.group.id + '"] .group-edit').click(editDoorGroup);
        $(selector + ' .add-door-group[data-id="' + data.group.id + '"] .add-dependency-btn').click(addDoorGroupDependency);
        $('.pop-up').popup('hide');
        showToaster('Группа добавлена', false);
      }
    }
  }

  function _appendEmptyFolder (folderId) {
    $('table.table-door-groups[data-id="' + folderId + '"]').append(_returnEmptyMessage());
  }

  function editDoorGroup (e) {
    e.preventDefault();
    e.stopPropagation();

    var groupId = $(this).attr('data-id');
    var currentName = $('.tr-group-item[data-id="' + groupId + '"]').find('span.group-description').text();
    var currentFolder = $(this).closest('.table-door-groups').attr('data-id');

    $.get('/base/doors/folder/open/' + currentFolder, function (data) {

      const findGroup = data.groups.find(group => group.id == groupId);
      var img = (findGroup.img ? findGroup.img : '/local_storage/hardware/default.png');

      $('#doors-group-edit-system-image').attr('src', img);
      $('#doors-group-description-input').val(findGroup.description);
      $('.popup-edit-group input[name="group_id"]').val(groupId);
      $('.popup-edit-group input[name="name"]').val(currentName);
      $('.popup-edit-group select[name="folder_id"]').val(currentFolder);
      $('.popup-edit-group').popup('show');
    })
  }

  $('#edit-doors-group-system-img').click(function(e) {
    e.preventDefault();

    $('#select-doors-group-edit-system-image').trigger('click');
  });

    $('#select-doors-group-edit-system-image').change(function(evt) {
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
            $('#doors-group-edit-system-image').attr('src', e.target.result);
          };
        })(f);
        reader.readAsDataURL(f);
      }
    });

  function submitEditGroup (e) {
    e.preventDefault();

    var formData = new FormData(this);
    var formAction = $(this).attr('action');

    submitForm({ action: formAction, data: formData }, onResponse);

    function onResponse (data) {
      if (data.status) {
        if (data.newFolder) {
          __updateFolders();
          $('.pop-up').popup('hide');
        } else {
          $('.tr-group-item[data-id="' + data.group.id + '"]').find('span.group-description').text(data.group.name);
          $('.pop-up').popup('hide');
        }
        showToaster('Изменения сохранены', false);

        /** Update folders on change */
        function __updateFolders () {
          $('.tr-group-item[data-id="' + data.group.id + '"], ' +
            '.edit-dependencies[data-id="' + data.group.id + '"]').remove();
          if (!$('.table-door-groups[data-id="' + data.group.folder_id + '"] tr').length) {
            $('.table-door-groups[data-id="' + data.group.folder_id + '"] tbody').append(_returnEmptyMessage);
          }
        }
      }

    }
  }

  /** Templates */
  function _returnDependencyTemplate (dependency, options, isExist) {
    var options = _compileOptions(options);

    return '' +
      '<table data-id="' + dependency.id + '" class="door-lamination-table ' + (isExist ? 'existed': '') + '" cellpadding="0" cellspacing="0">' +
        '<tbody>' +
          '<tr class="tr-lamination-type">' +
            '<td colspan="6">' +
              i18n.t('Lamination') + ': ' +
              '<select class="select-default select-lamination option-lamination-in" data-field="lamination_in">' +
                '<option value="1">' + i18n.t('White') + '</option>' +
                options.laminationOptions +
              '</select> ' +
              '- ' +
              '<select class="select-default select-lamination select-lamination-last option-lamination-out" data-field="lamination_out">' +
                '<option value="1">' + i18n.t('White') + '</option>' +
                options.laminationOptions +
              '</select> ' +
              i18n.t('Code Sync') + ': ' +
              '<input class="default-option td-select input-default option-code-sync input-code-sync" ' +
                      'type="text" ' +
                      'data-dependency="' + dependency.id + '" ' +
                      'data-field="code_sync_white" ' +
                      'disabled ' +
              'value="' + (dependency.code_sync ? dependency.code_sync : '') + '">' +
              '<input class="ok-btn dependency-add" type="' + (isExist ? 'hidden' : 'button') + '" value="' + i18n.t('Ok') + '">' +
            '</td>' +
          '</tr>' +
          '<tr class="tr-header">' +
            '<td class="td-header header-select">' +
              i18n.t('Frame') + ': ' +
            '</td>' +
            '<td class="td-header header-select">' +
              i18n.t('Doorsill') + ': ' +
            '</td>' +
            '<td class="td-header header-select">' +
              i18n.t('Leaf') + ': ' +
            '</td>' +
            '<td class="td-header header-select">' +
              i18n.t('Impost') + ': ' +
            '</td>' +
            '<td class="td-header header-select">' +
              i18n.t('ImpostStvorka') + ': ' +
            '</td>' +
            '<td class="td-header header-select">' +
              i18n.t('Face plate') + ': ' +
            '</td>' +
          '</tr>' +
          '<tr class="tr-content">' +
            '<td class="td-content">' +
              '<select class="select-default td-select option-frame" data-dependency="' + dependency.id + '" data-field="rama_list_id" style="width: 150px;">' +
                '<option value="0" selected>' + i18n.t('Not exist single') +
                '</option>' +
                options.frameOptions +
              '</select>' +
            '</td>' +
            '<td class="td-content">' +
              '<select class="select-default td-select option-doorSill" data-dependency="' + dependency.id + '" data-field="door_sill_list_id" style="width: 150px;">' +
                '<option value="0" selected>' + i18n.t('Not exist single') +
                '</option>' +
                options.doorSillOptions +
              '</select>' +
            '</td>' +
            '<td class="td-content">' +
              '<select class="select-default td-select option-leaf" data-dependency="' + dependency.id + '" data-field="stvorka_list_id" style="width: 150px;">' +
                '<option value="0" selected>' + i18n.t('Not exist single') +
                '</option>' +
                options.leafOptions +
              '</select>' +
            '</td>' +
            '<td class="td-content">' +
              '<select class="select-default td-select option-impost" data-dependency="' + dependency.id + '" data-field="impost_list_id" style="width: 150px;">' +
                '<option value="0" selected>' + i18n.t('Not exist single') +
                '</option>' +
                options.impostOptions +
              '</select>' +
            '</td>' +
            '<td class="td-content">' +
              '<select class="select-default td-select option-impost-stvorka" data-dependency="' + dependency.id + '" data-field="impost_in_stvorka_list_id" style="width: 150px;">' +
                '<option value="0" selected>' + i18n.t('Not exist single') +
                '</option>' +
                options.impostOptions +
              '</select>' +
            '</td>' +
            '<td class="td-content">' +
              '<select class="select-default td-select option-shtulp" data-dependency="' + dependency.id + '" data-field="shtulp_list_id" style="width: 150px;">' +
                '<option value="0" selected>' + i18n.t('Not exist single') +
                '</option>' +
                options.shtulpOptions +
              '</select>' +
            '</td>' +
          '</tr>' +
          '<tr class="tr-header">' +
            '<td class="td-header header-select">' +
              i18n.t('Frame bottom') + ': ' +
            '</td>' +
          '</tr>' +
          '<tr class="tr-content">' +
            '<td class="td-content">' +
              '<select class="select-default td-select option-frame" data-dependency="' + dependency.id + '" data-field="rama_sill_list_id" style="width: 150px;">' +
                '<option value="0" selected>' + i18n.t('Not exist single') +
                '</option>' +
                options.bottomFrameOptions +
              '</select>' +
            '</td>' +
          '</tr>' +
        '</tbody>' +
      '</table>';
  }

  function _returnEmptyMessage () {
    return '' +
      '<tr>' +
        '<td class="td-empty" colspan="5">' +
          i18n.t('Empty') +
        '</td>' +
      '</tr>';
  }

  function _returnNewGroup (dataDefault, group) {
    var options = _compileOptions(dataDefault);

    return '' +
      '<tr class="tr-group-item" data-id="' + group.id + '">' +
        '<td colspan="5">' +
          '<span class="group-description">' +
            group.name +
          '</span>' +
          '<input class="edit-btn group-edit" type="button" data-id="' + group.id + '">' +
          '<input class="show-info group-show" type="button" data-id="' + group.id + '">' +
        '</td>' +
      '</tr>' +
      '<tr class="edit-dependencies" data-id="' + group.id + '">' +
        '<td colspan="5" style="width: 920px;">' +
          '<table class="door-lamination-table" data-id="0" cellpadding="0" cellspacing="0">' +
            '<tbody>' +
              '<tr class="tr-lamination-type">' +
                '<td colspan="6">' +
                  i18n.t('Lamination') + ': ' +
                  '<select disabled class="select-default select-lamination option-lamination-in" data-field="lamination_in">' +
                    '<option value="1">' + i18n.t('White') + '</option>' +
                  '</select> ' +
                  '- ' +
                  '<select disabled class="select-default select-lamination select-lamination-last option-lamination-out" data-field="lamination_out">' +
                    '<option value="1">' + i18n.t('White') + '</option>' +
                  '</select> ' +
                  i18n.t('Code Sync') + ': ' +
                  '<input class="default-option td-select input-default option-code-sync input-code-sync" ' +
                          'type="text" ' +
                          'data-group="' + group.id + '" ' +
                          'data-field="code_sync_white" ' +
                          'disabled ' +
                  'value="' + (group.code_sync_white ? group.code_sync_white : '') + '">' +
                '</td>' +
              '</tr>' +
              '<tr class="tr-header">' +
                '<td class="td-header header-select">' +
                  i18n.t('Frame') + ': ' +
                '</td>' +
                '<td class="td-header header-select">' +
                  i18n.t('Doorsill') + ': ' +
                '</td>' +
                '<td class="td-header header-select">' +
                  i18n.t('Leaf') + ': ' +
                '</td>' +
                '<td class="td-header header-select">' +
                  i18n.t('Impost') + ': ' +
                '</td>' +
                '<td class="td-header header-select">' +
                  i18n.t('ImpostStvorka') + ': ' +
                '</td>' +
                '<td class="td-header header-select">' +
                  i18n.t('Face plate') + ': ' +
                '</td>' +
              '</tr>' +
              '<tr class="tr-content">' +
                '<td class="td-content">' +
                  '<select class="select-default td-select option-frame" data-group="' + group.id + '" data-field="rama_list_id" style="width: 150px;">' +
                    '<option value="0" selected>' + i18n.t('Not exist single') +
                    '</option>' +
                    options.frameOptions +
                  '</select>' +
                '</td>' +
                '<td class="td-content">' +
                  '<select class="select-default td-select option-doorSill" data-group="' + group.id + '" data-field="door_sill_list_id" style="width: 150px;">' +
                    '<option value="0" selected>' + i18n.t('Not exist single') +
                    '</option>' +
                    options.doorSillOptions +
                  '</select>' +
                '</td>' +
                '<td class="td-content">' +
                  '<select class="select-default td-select option-leaf" data-group="' + group.id + '" data-field="stvorka_list_id" style="width: 150px;">' +
                    '<option value="0" selected>' + i18n.t('Not exist single') +
                    '</option>' +
                    options.leafOptions +
                  '</select>' +
                '</td>' +
                '<td class="td-content">' +
                  '<select class="select-default td-select option-impost" data-group="' + group.id + '" data-field="impost_list_id" style="width: 150px;">' +
                    '<option value="0" selected>' + i18n.t('Not exist single') +
                    '</option>' +
                    options.impostOptions +
                  '</select>' +
                '</td>' +
                '<td class="td-content">' +
                  '<select class="select-default td-select option-impost-stvorka" data-group="' + group.id + '" data-field="impost_in_stvorka_list_id" style="width: 150px;">' +
                    '<option value="0" selected>' + i18n.t('Not exist single') +
                    '</option>' +
                    options.impostOptions +
                  '</select>' +
                '</td>' +
                '<td class="td-content">' +
                  '<select class="select-default td-select option-shtulp" data-group="' + group.id + '" data-field="shtulp_list_id" style="width: 150px;">' +
                    '<option value="0" selected>' + i18n.t('Not exist single') +
                    '</option>' +
                    options.shtulpOptions +
                  '</select>' +
                '</td>' +
              '</tr>' +
              '<tr class="tr-header">' +
                '<td class="td-header header-select">' +
                  i18n.t('Frame bottom') + ': ' +
                '</td>' +
              '</tr>' +
              '<tr class="tr-content">' +
                '<td class="td-content">' +
                  '<select class="select-default td-select option-frame-sill" data-group="' + group.id + '" data-field="rama_sill_list_id" style="width: 150px;">' +
                    '<option value="0" selected>' + i18n.t('Not exist single') +
                    '</option>' +
                    options.bottomFrameOptions +
                  '</select>' +
                '</td>' +
              '</tr>' +
            '</tbody>' +
            '<tfoot>' +
              '<tr class="add-door-group">' +
                '<td class="add-dependency-btn" colspan="5" data-id="' + group.id + '">' +
                  i18n.t('Add') +
                '</td>' +
              '</tr>' +
            '</tfoot>' +
          '</table>' +
        '</td>' +
      '</tr>' +
      '<tr class="add-door-group" data-id="' + group.id + '">' +
        '<td colspan="5" class="add-dependency-btn" data-id="' + group.id + '">' +
          i18n.t('Add') +
        '</td>' +
      '</tr>';
  }


  function _compileOptions (options) {
    var frameOptions = '';
    var doorSillOptions = '';
    var leafOptions = '';
    var impostOptions = '';
    var shtulpOptions = '';
    var laminationOptions = '';
    var bottomFrameOptions = '';

    /** Create frame options */
    for (var fI = 0, lenFI = options.frameLists[0].length; fI < lenFI; fI++) {
      frameOptions += '<option value="' + options.frameLists[0][fI].id + '">' + options.frameLists[0][fI].name + '</option>';
    }
    /** Create door sill options */
    for (var dsI = 0, lenFSI = options.doorSillLists[0].length; dsI < lenFSI; dsI++) {
      doorSillOptions += '<option value="' + options.doorSillLists[0][dsI].id + '">' + options.doorSillLists[0][dsI].name + '</option>';
    }
    /** Create leaf options */
    for (var lI = 0, lenLI = options.leafs[0].length; lI < lenLI; lI++) {
      leafOptions += '<option value="' + options.leafs[0][lI].id + '">' + options.leafs[0][lI].name + '</option>';
    }
    /** Create impost options */
    for (var iI = 0, lenII = options.impostLists[0].length; iI < lenII; iI++) {
      impostOptions += '<option value="' + options.impostLists[0][iI].id + '">' + options.impostLists[0][iI].name + '</option>';
    }
    /** Create shtulp options */
    for (var sI = 0, lenSI = options.shtulpLists[0].length; sI < lenSI; sI++) {
      shtulpOptions += '<option value="' + options.shtulpLists[0][sI].id + '">' + options.shtulpLists[0][sI].name + '</option>';
    }
    /** Create lamination options */
    for (var lamI = 0, lenLam = options.laminations.length; lamI < lenLam; lamI++) {
      laminationOptions += '<option value="' + options.laminations[lamI].id + '">' + options.laminations[lamI].name + '</option>';
    }
    /** Create bottom frame options */
    for (var fbI = 0, lenFbI = options.frameBottomLists[0].length; fbI < lenFbI; fbI++) {
      bottomFrameOptions += '<option value="' + options.frameBottomLists[0][fbI].id + '">' + options.frameBottomLists[0][fbI].name + '</option>';
    }

    return {
      frameOptions: frameOptions,
      doorSillOptions: doorSillOptions,
      leafOptions: leafOptions,
      impostOptions: impostOptions,
      shtulpOptions: shtulpOptions,
      laminationOptions: laminationOptions,
      bottomFrameOptions: bottomFrameOptions
    };
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
