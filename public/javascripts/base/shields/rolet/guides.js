$(function () {
  var localizerOption = { resGetPath: '/assets/javascripts/vendor/localizer/__ns__-__lng__.json'};
  i18n.init(localizerOption);

  
  $('#add-guide-rolet-form').on('submit', submitAddNewGuide);
  $('#edit-guide-rolet-form').on('submit', submitEditGuide);
  $('#delete-guide-rolet-form').on('submit', submitDeleteGuide);


  $('#popup-add-guide-rolet input.add-image-btn').click(addImgGuide);
  $('#popup-edit-guide-rolet input.add-image-btn').click(editImgGuide);

  /** Init popups */
  $(
    '#popup-add-guide-rolet',
    '#popup-edit-guide-rolet',
    '#popup-delete-guide-rolet',
  ).popup({
    type: 'overlay',
    autoopen: false,
    scrolllock: true,
    transition: 'all 0.3s'
  });

  // btns 
    // systems
  $('.btn-add-system').click(function(e) {
    e.preventDefault();
    $('#popup-add-guide-rolet input:not([type="submit"]):not([type="button"])').val('')
    $('#popup-add-guide-rolet input[type="checkbox"]').prop('checked', false);

    $.get('/base/shields/rolet/guides/guide/getBoxes', function(data){
      if (data.status) {
        console.log('boxesGroups', data.groups);
        const boxesGroups = data.groups || [];
        const rowBoxLinks = $('#popup-add-guide-rolet').find('.row-guide-box-links');
        rowBoxLinks.empty();
        renderBoxesGroups(boxesGroups, rowBoxLinks);
      }
      $('#popup-add-guide-rolet').popup('show');
    })

  })

  $('.btn-edit-system').click(function(e) {
    e.preventDefault();
    const guideId = $(this).data('guide');
    $('#popup-edit-guide-rolet input[name="guide_id"]').val(guideId);
    $.get('/base/shields/rolet/guides/guide/getGuide/' + guideId, function(data){
      if (data) {
        $('#popup-edit-guide-rolet input[name="name"]').val(data.guide.name);
        $('#popup-edit-guide-rolet input[name="position"]').val(data.guide.position);
        $('#popup-edit-guide-rolet input[name="height"]').val(data.guide.height);
        $('#popup-edit-guide-rolet input[name="thickness"]').val(data.guide.thickness);
        $('#popup-edit-guide-rolet textarea[name="description"]').val(data.guide.description);
        $('#popup-edit-guide-rolet input[name="price"]').val(data.guide.price);
        $('#popup-edit-guide-rolet input[name="price_m"]').val(data.guide.price_m);
        $('#popup-edit-guide-rolet img.rolet-image').attr('src', data.guide.img);
        if (data.guide.is_color) {
          $('#popup-edit-guide-rolet input[name="is_color"]').prop('checked', true);
        } else {
          $('#popup-edit-guide-rolet input[name="is_color"]').prop('checked', false);
        }
        if (data.guide.is_grid) {
          $('#popup-edit-guide-rolet input[name="is_grid"]').prop('checked', true);
        } else {
          $('#popup-edit-guide-rolet input[name="is_grid"]').prop('checked', false);
        }

        $('#popup-edit-guide-rolet input[name="is_color"]').val(data.guide.is_color);
        $('#popup-edit-guide-rolet input[name="is_grid"]').val(data.guide.is_grid);


        $.get('/base/shields/rolet/guides/guide/getBoxes', function(dataBoxLinks){
          if (dataBoxLinks.status) {
            const rules = dataBoxLinks.rules.filter( rule => rule.rol_guide_id === guideId) || [];
            const boxesGroups = dataBoxLinks.groups || [];
            const rowBoxLinks = $('#popup-edit-guide-rolet').find('.row-guide-box-links');
            rowBoxLinks.empty();
            renderBoxesGroups(boxesGroups, rowBoxLinks, rules);
          }
          $('#popup-edit-guide-rolet').popup('show');
        })
      }
    })
  })

  $('.btn-delete-system').click(function(e) {
    e.preventDefault();
    const guideId = $(this).data('guide');
    $('#popup-delete-guide-rolet input[name="guide_id"]').val(guideId);
    $('#popup-delete-guide-rolet').popup('show');
  })

  $('.btn-active').click(function(e) {
    e.preventDefault();
    $(this).toggleClass('btn-unactive');
    const guideId = $(this).data('guide');
    if (guideId) {
      $.post('/base/shields/rolet/guides/guide/active/' + guideId, {
        
      }, function(data) {        
      
      });
    }
  })

  // checkboxes 

  $(document).on('change', 'input[type="checkbox"]', function() {
    const isChecked = $(this).is(':checked');
    if (isChecked) {
      $(this).val('1');
    } else {
      $(this).val('0');
    }
  })

  
  function submitAddNewGuide(e) {
    e.preventDefault();

    var formData = new FormData(this);
    var m2OrMData = {};

    $('#popup-add-guide-rolet input[name^="m2_or_m_"]').each(function() {
      var name = $(this).attr('name');
      var groupId = name.replace('m2_or_m_', '');
      if (groupId) {
        m2OrMData[groupId] = $(this).val();
      }
    });

    formData.append('m2_or_m', JSON.stringify(m2OrMData));
    var formAction = $(this).attr('action');

    submitForm({ action: formAction, data: formData }, onResponse);

    function onResponse (data) {
      stopLoader();
      if (data.status) {
        $('.pop-up').popup('hide');
        console.log('ADD GUIDE');
        setTimeout(function() {
          $('.pop-up').popup('hide');
          window.location.reload();
        }, 300);
      } else {
        console.log('error');
      }
    }
  }
  
  function submitEditGuide(e) {
    e.preventDefault();

    var formData = new FormData(this);
    var m2OrMData = {};

    $('#popup-edit-guide-rolet input[name^="m2_or_m_"]').each(function() {
      var name = $(this).attr('name');
      var groupId = name.replace('m2_or_m_', '');
      if (groupId) {
        m2OrMData[groupId] = $(this).val();
      }
    });

    formData.append('m2_or_m', JSON.stringify(m2OrMData));
    var formAction = $(this).attr('action');

    submitForm({ action: formAction, data: formData }, onResponse);

    function onResponse (data) {
      stopLoader();
      if (data.status) {
        $('.pop-up').popup('hide');
        console.log('Edit guide');
        setTimeout(function() {
          $('.pop-up').popup('hide');
          window.location.reload();
        }, 300);
      } else {
        console.log('error');
      }
    }
  }
  function submitDeleteGuide(e) {
    e.preventDefault();

    var formData = new FormData(this);
    var formAction = $(this).attr('action');

    submitForm({ action: formAction, data: formData }, onResponse);

    function onResponse (data) {
      stopLoader();
      if (data.status) {
        $('.pop-up').popup('hide');
        console.log('Delete guide');
        setTimeout(function() {
          $('.pop-up').popup('hide');
          window.location.reload();
        }, 300);
      } else {
        console.log('error');
      }
    }
  }

  function addImgGuide (e) {
    selectImageRolet('#popup-add-guide-rolet');
  }
  function editImgGuide (e) {
    selectImageRolet('#popup-edit-guide-rolet');
  }
  
  function selectImageRolet (popup) {
    $(popup + ' input.rolet-image-file').trigger('click');
  }

  function renderBoxesGroups(boxesGroups, rowBoxLinks, rules) {
    if (!Array.isArray(boxesGroups)) {
      return;
    }

    const rulesByGroupId = Array.isArray(rules)
      ? rules.reduce(function(acc, rule) {
          acc[rule.rol_groups_id] = rule.rol_price_rules_id;
          return acc;
        }, {})
      : {};

    boxesGroups.forEach(function(group) {
      const groupBox = $('<div>').addClass('group-boxes');
      const groupName = group && group.name ? group.name : '';
      const groupId = group && group.id ? group.id : '';
      const isActive = rulesByGroupId[groupId] === 1;
      const groupTitle = $('<div>').addClass('title-group-boxes title').text(groupName);
      const textM2 = $('<span>').addClass('text-m2').text('m²');
      const label = $('<label>').addClass('checkbox-label');
      const checkbox = $('<input>')
        .addClass('input-default checkbox-rolet-popup')
        .attr({ type: 'checkbox', name: 'm2_or_m_' + groupId })
        .val(isActive ? '1' : '0');
      if (isActive) {
        checkbox.prop('checked', true);
      }
      const checkboxCustom = $('<span>').addClass('checkbox-custom');
      const textM = $('<span>').addClass('text-m').text('m');

      label.append(checkbox, checkboxCustom);
      groupBox.append(groupTitle, textM2, label, textM);

      rowBoxLinks.append(groupBox);
    });
  }

  
});
