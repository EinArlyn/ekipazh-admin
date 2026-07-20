$(function () {
  var localizerOption = {
    resGetPath: '/assets/javascripts/vendor/localizer/__ns__-__lng__.json',
  };
  i18n.init(localizerOption);

  

  $('#add-template-pls-form').on('submit', submitAddTemplate);
  $('#edit-template-pls-form').on('submit', submitEditTemplate);
  $('#delete-template-pls-form').on('submit', submitDeleteTemplate);

  $('#popup-add-template-pls input.add-image-btn').click(addImgTemplate);
  $('#popup-edit-template-pls input.add-image-btn').click(editImgTemplate);

  /** Init popups */
  $(
    '#popup-add-template-pls',
    '#popup-edit-template-pls',
    '#popup-delete-template-pls',
  ).popup({
    type: 'overlay',
    autoopen: false,
    scrolllock: true,
    transition: 'all 0.3s',
  });

  $('.btn-show-more').on('click', function () {
    var groupId = $(this).data('group');
    var $target = $('.templates-list[data-group="' + groupId + '"]');
    var isVisible = $target.is(':visible');

    $('.templates-list:visible').not($target).slideUp(150);

    if (isVisible) {
      $target.slideUp(150);
      $('.group-row').removeClass('opacity-content');
      return;
    }

    $('.group-row').addClass('opacity-content');
    $target.slideDown(150);
  });



  $('.btn-active').click(function(e) {
    e.preventDefault();
    $(this).toggleClass('btn-unactive');
    const templateId = $(this).data('template');
    if (templateId) {
      $.post('/base/shields/grids/templates/active/' + templateId, {
        
      }, function(data) {        
      
      });
    }
  });

  // ---------------------


  $('.btn-add-template').click(function(e) {
    e.preventDefault();
    const groupId = $(this).data('group');
     $(
      '#popup-add-template-pls input:not([type="submit"]):not([type="hidden"]):not([type="button"])'
    ).val('');
    $('#popup-add-template-pls input[name="group_id"]').val(groupId);
    $.get('/base/shields/grids/templates/getSystems', function (data) {
      if (data.status) {
        const linksContainer = $('#popup-add-template-pls .row-templates-links');
        linksContainer.empty();

        if (data.systems && Array.isArray(data.systems)) {
          data.systems.forEach(function (system) {
            const systemBlock = $('<div class="system-checkbox-block"></div>');
            const checkboxId = 'system-checkbox-' + system.id;
            const checkbox = $(
              '<input type="checkbox" id="' +
                checkboxId +
                '" name="system_links[]" value="' +
                system.id +
                '" data-system-id="' +
                system.id +
                '">'
            );
            const label = $(
              '<label for="' + checkboxId + '">' + system.name + '</label>'
            );

            systemBlock.append(checkbox);
            systemBlock.append(' ');
            systemBlock.append(label);
            linksContainer.append(systemBlock);
          });
        }

        $('#popup-add-template-pls').popup('show');
      }
    });
  });


  $('.btn-edit-item').on('click', onEditItemClick);

  function onEditItemClick(e) {
    e.preventDefault();

    const templateId = $(this).data('template');

    if (templateId) {
      openEditTemplate(templateId);
      return;
    }
  }

  function openEditTemplate(templateId) {
    $(
      '#popup-edit-template-pls input:not([type="submit"]):not([type="hidden"]):not([type="button"])'
    ).val('');
    $('#popup-edit-template-pls input[name="template_id"]').val(templateId);
    $.get('/base/shields/grids/templates/getTemplate/' + templateId, function (data) {
      if (data.status) {
        $('#popup-edit-template-pls input[name="name"]').val(data.template.name);
        $('#popup-edit-template-pls input[name="position"]').val(data.template.position);
        $('#popup-edit-template-pls input[name="default_w"]').val(data.template.default_w);
        $('#popup-edit-template-pls input[name="default_h"]').val(data.template.default_h);
        $('#popup-edit-template-pls input[name="work_price"]').val(data.template.work_price);
        $('#popup-edit-template-pls select[name="open_type"]').val(data.template.open_type);
        $('#popup-edit-template-pls select[name="direction"]').val(data.template.direction);

        const linksContainer = $('#popup-edit-template-pls .row-templates-links');
        linksContainer.empty();

        const selectedSystemIds = (data.links || []).map(function (link) {
          return String(link.system_id);
        });

        $.get('/base/shields/grids/templates/getSystems', function (systemsData) {
          if (systemsData.status && Array.isArray(systemsData.systems)) {
            systemsData.systems.forEach(function (system) {
              const systemBlock = $('<div class="system-checkbox-block"></div>');
              const checkboxId = 'edit-system-checkbox-' + system.id;
              const isChecked = selectedSystemIds.indexOf(String(system.id)) !== -1;
              const checkbox = $(
                '<input type="checkbox" id="' +
                  checkboxId +
                  '" name="system_links[]" value="' +
                  system.id +
                  '" data-system-id="' +
                  system.id +
                  '"' +
                  (isChecked ? ' checked' : '') +
                  '>'
              );
              const label = $(
                '<label for="' + checkboxId + '">' + system.name + '</label>'
              );

              systemBlock.append(checkbox);
              systemBlock.append(' ');
              systemBlock.append(label);
              linksContainer.append(systemBlock);
            });
          }

          $('#popup-edit-template-pls').popup('show');
        });
      }
    });
  }


  $('.btn-delete-item').on('click', onDeleteItemClick);

  function onDeleteItemClick(e) {
    e.preventDefault();
    var templateId = $(this).data('template');

    if (templateId) {
      $('#popup-delete-template-pls input[name="template_id"]').val(templateId);
      $('#popup-delete-template-pls').popup('show');
      return;
    }
  }


  // Submit forms



  function submitAddTemplate(e) {
    e.preventDefault();

    var formData = new FormData(this);
    var formAction = $(this).attr('action');

    var systemLinks = [];
    $('#popup-add-template-pls input[name="system_links[]"]:checked').each(function () {
      systemLinks.push($(this).val());
    });

    formData.append('system_links', JSON.stringify(systemLinks));

    submitForm({ action: formAction, data: formData }, onResponse);

    function onResponse(data) {
      stopLoader();
      if (data.status) {
        $('.pop-up').popup('hide');
        console.log('ADD new system');
        setTimeout(function () {
          $('.pop-up').popup('hide');
          window.location.reload();
        }, 300);
      } else {
        console.log('error');
      }
    }
  }

  function submitEditTemplate(e) {
    e.preventDefault();

    var formData = new FormData(this);
    var formAction = $(this).attr('action');

    var systemLinks = [];
    $('#popup-edit-template-pls input[name="system_links[]"]:checked').each(function () {
      systemLinks.push($(this).val());
    });

    formData.append('system_links', JSON.stringify(systemLinks));

    submitForm({ action: formAction, data: formData }, onResponse);

    function onResponse(data) {
      stopLoader();
      if (data.status) {
        $('.pop-up').popup('hide');
        console.log('Edit system');
        setTimeout(function () {
          $('.pop-up').popup('hide');
          window.location.reload();
        }, 300);
      } else {
        console.log('error');
      }
    }
  }

  function submitDeleteTemplate(e) {
    e.preventDefault();

    var formData = new FormData(this);
    var formAction = $(this).attr('action');

    submitForm({ action: formAction, data: formData }, onResponse);

    function onResponse(data) {
      stopLoader();
      if (data.status) {
        $('.pop-up').popup('hide');
        console.log('Delete system');
        setTimeout(function () {
          $('.pop-up').popup('hide');
          window.location.reload();
        }, 300);
      } else {
        console.log('error');
      }
    }
  }

  function addImgTemplate (e) {
    selectImageTemplate('#popup-add-template-pls');
  }
  function editImgTemplate (e) {
    selectImageTemplate('#popup-edit-template-pls');
  }
  
  function selectImageTemplate (popup) {
    $(popup + ' input.pls-image-file').trigger('click');
  }
});
