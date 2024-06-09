$(function () {
  /** Open sills group */
  $('.open-group').click(function(e) {
    e.preventDefault();

    var groupId = $(this).attr('data-group');

    if ($(this).hasClass('opened-group')) {
      $(this).removeClass('opened-group');
      $('.sills-group-content[data-group="' + groupId + '"]').hide(200);
      $('tr.sill-from-group').remove();
    } else {
      $('.opened-group').removeClass('opened-group');
      $('.sills-group-content').hide(200);
      $('tr.sill-from-group').remove();
      $(this).addClass('opened-group');
      openGroup(groupId);
    }
  });

  /** Edit group name */
  $('.edit-group-name').click(function(e) {
    e.preventDefault();

    var groupId = $(this).attr('data-group');
    editGroupName(groupId);
  });
    /** Submit editing group name */
    $('#submit-edit-group-name').click(function(e) {
      e.preventDefault();

      var groupId = $(this).attr('data-group');
      var newGroupName = $('#edit-group-name-input').val();
      submitEditGroup(groupId, newGroupName);
    });

  /** Add new group */
  $('#add-new-group').click(function(e) {
    e.preventDefault();

    addNewGroup();
  });
    /** Submit add new group */
    $('#submit-add-new-group').click(function(e) {
      e.preventDefault();

      var groupName = $('#new-group-name').val();
      submitAddNewGroup(groupName);
    });

  /** Add sill to group */
  $('.add-sill-tr').click(function(e) {
    e.preventDefault();

    var groupId = $(this).attr('data-group');
    $('#submit-add-sill-to-group').attr('data-group', groupId);
    addSillToGroup();
  });
    /** Submit adding sill to group */
    $('#submit-add-sill-to-group').click(function(e) {
      e.preventDefault();

      var groupId = $(this).attr('data-group');
      var sillId = $('#add-sill-select').val();
      submitAddSillToGroup(groupId, sillId);
    });

  /** Edit sill */
  $('.edit-sill').click(function(e) {
    e.preventDefault();

    var sillId = $(this).attr('data-sill');
    $('#submit-edit-sill-group').attr('data-sill', sillId);
    editSillPopup(sillId);
  });
    /** Submit editing sill */
    $('#submit-edit-sill-group').click(function(e) {
      e.preventDefault();

      var sillId = $(this).attr('data-sill');
      var groupId = $('#edit-sill-group-select').val();
      submitEditingSill(sillId, groupId);
    });

  /** Close pop-up */
  $('.pop-up-close-wrap').click(function() {
    $('.pop-up').popup('hide');
  });

  function openGroup(groupId) {
    $.get('/base/sills/get-sills-from-group/' + groupId, function(data) {
      if (data.status) {
        //$('.sills-table[data-group="' + groupId + '"]').empty();
        for (var i = 0, len = data.sills.length; i < len; i++) {
          $('.sills-table[data-group="' + groupId + '"]').prepend('<tr class="sill-tr sill-from-group">' + 
            '<td class="sill-td">' + data.sills[i].name + 
              ' <input class="btn-edit edit-sill" type="button" value="2" data-sill="' + data.sills[i].id + '">' +
            '</td>' +
          '</tr>');
        }
        $('.sills-table[data-group="' + groupId + '"]').on('click', '.edit-sill', function(e) {
          e.preventDefault();
          e.stopImmediatePropagation();

          var sillId = $(this).attr('data-sill');
          $('#submit-edit-sill-group').attr('data-sill', sillId);
          editSillPopup(sillId);
        });
        $('.sills-group-content[data-group="' + groupId + '"]').show(200);
      }
    });
  }

  function addNewGroup() {
    $('.add-new-group-pop-up').popup('show');
  }

  function submitAddNewGroup(name) {
    $.post('/base/sills/add-new-group', {
      name: name
    }, function(data) {
      if (data.status) {
        $('.pop-up').popup('hide');
        window.location.reload();
      }
    });
  }

  function editGroupName(groupId) {
    $.get('/base/sills/get-group/' + groupId, function(data) {
      if (data.status) {
        $('#edit-group-name-input').val(data.group.name);
        $('#submit-edit-group-name').attr('data-group', data.group.id);
        $('.edit-group-name-pop-up').popup('show');
      }
    });
  }

  function submitEditGroup(groupId, newName) {
    $.post('/base/sills/edit-group/' + groupId, {
      name: newName
    }, function(data) {
      if (data.status) {
        $('.pop-up').popup('hide');
        window.location.reload();
      }
    });
  }

  function addSillToGroup() {
    $.get('/base/sills/get-sills-without-group', function(data) {
      if (data.status) {
        $('#add-sill-select').find('option').remove();
        for (var i = 0, len = data.sills.length; i < len; i++) {
          $('#add-sill-select').append('<option value="' + data.sills[i].id + '">' + data.sills[i].name + '</option>');
        }
        $('.add-sill-to-group-pop-up').popup('show');
      }
    });
  }

  function submitAddSillToGroup(groupId, sillId) {
    $.post('/base/sills/add-sill-to-group/' + groupId, {
      sillId: sillId
    }, function(data) {
      if (data.status) {
        $('.pop-up').popup('hide');
        window.location.reload();
      }
    });
  }

  function editSillPopup(sillId) {
    $.get('/base/sills/get-sill/' + sillId, function(data) {
      if (data.status) {
        $('#edit-sill-group-select').find('option').remove();
        for (var i = 0, len = data.sillsGroups.length; i < len; i++) {
          $('#edit-sill-group-select').append('<option value="' + data.sillsGroups[i].id + '">' + 
            data.sillsGroups[i].name +
          '</option>');
        }
        $('#edit-sill-group-select').append('<option value="0">Отсутствует</option>');
        $('#edit-sill-group-select').val(data.sill.sills_group);
        $('.edit-sill-pop-up').popup('show');
      }
    });
  }

  function submitEditingSill(sillId, groupId) {
    $.post('/base/sills/edit-sill/' + sillId, {
      groupId: groupId
    }, function(data) {
      if (data.status) {
        $('.pop-up').popup('hide');
        window.location.reload();
      }
    });
  }
  /** Init popup */
  $('.add-new-group-pop-up').popup({
    type: 'overlay',
    autoopen: false,
    scrolllock: true,
    transition: 'all 0.3s'
  });
  $('.edit-group-name-pop-up').popup({
    type: 'overlay',
    autoopen: false,
    scrolllock: true,
    transition: 'all 0.3s'
  });
  $('.add-sill-to-group-pop-up').popup({
    type: 'overlay',
    autoopen: false,
    scrolllock: true,
    transition: 'all 0.3s'
  });
  $('.edit-sill-pop-up').popup({
    type: 'overlay',
    autoopen: false,
    scrolllock: true,
    transition: 'all 0.3s'
  });
});