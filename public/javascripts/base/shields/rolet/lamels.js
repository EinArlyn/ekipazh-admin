$(function () {
  var localizerOption = {
    resGetPath: '/assets/javascripts/vendor/localizer/__ns__-__lng__.json',
  };
  i18n.init(localizerOption);

  $('#add-lamel-rolet-form').on('submit', submitAddNewLamel);
  $('#edit-lamel-rolet-form').on('submit', submitEditLamel);
  $('#delete-lamel-rolet-form').on('submit', submitDeleteLamel);

  /** Init popups */
  $(
    '#popup-add-lamel-rolet',
    '#popup-edit-lamel-rolet',
    '#popup-delete-lamel-rolet'
  ).popup({
    type: 'overlay',
    autoopen: false,
    scrolllock: true,
    transition: 'all 0.3s',
  });

  // btns
  // systems
  $('.btn-add-system').click(function (e) {
    e.preventDefault();
    $(
      '#popup-add-lamel-rolet input:not([type="submit"]):not([type="hidden"]):not([type="button"])'
    ).val('');
    $('#popup-add-lamel-rolet input[type="checkbox"]').prop('checked', false);
    $('#popup-add-lamel-rolet label.thickness-option').remove();
    $('#popup-add-lamel-rolet label.end-list-option').remove();
    $('#popup-add-lamel-rolet .guide-size-settings').remove();

    let thicknessBlock = $('#popup-add-lamel-rolet .thickness-list');
    let endListsBlock = $('#popup-add-lamel-rolet .end-lists');
    let guidesBlock = $('#popup-add-lamel-rolet .guide-lists');
    $.get('/base/shields/rolet/lamels/lamel/getGuides', function (guidesData) {
      $.get(
        '/base/shields/rolet/lamels/lamel/getEndLists',
        function (endListsData) {
          const guidesThicknesses = [];
          guidesData.guides.forEach((guide) => {
            if (
              guide.thickness &&
              !guidesThicknesses.includes(guide.thickness)
            ) {
              guidesThicknesses.push(guide.thickness);
              thicknessBlock.append(
                `<label class="thickness-option" data-guide-id="${guide.id}">
                  <input type="radio" name="thickness" value="${guide.thickness}">
                  <span>${guide.thickness}</span>
                </label>`
              );
            }

            guidesBlock.append(
              `<div class="guide-size-settings" data-guide-id="${guide.id}">
                <div class="guide-title">${guide.name}</div>
                <div class="guide-max-width-input">
                  <input class="input-default guide-box" type="text" value="" name="width">
                </div>
                <div class="guide-max-square-input">
                  <input class="input-default guide-box" type="text" value="" name="square">
                </div>
              </div>`
            );
          });

          endListsData.endLists.forEach((list) => {
            endListsBlock.append(
              `<label class="end-list-option">
                <input type="checkbox" name="${
                  list.name
                }" value="${0}" data-end-list-id="${list.id}">
                <span>${list.name}</span>
              </label>`
            );
          });

          $('input[type="checkbox"]').change(function () {
            const isChecked = $(this).is(':checked');
            if (isChecked) {
              $(this).val('1');
            } else {
              $(this).val('0');
            }
          });

          $('#popup-add-lamel-rolet').popup('show');
        }
      );
    });
  });

  $('.btn-edit-system').click(function (e) {
    e.preventDefault();
    const lamelId = $(this).data('lamel');
    $('#popup-edit-lamel-rolet input[name="lamel_id"]').val(lamelId);
    $(
      '#popup-edit-lamel-rolet input:not([type="submit"]):not([type="hidden"]):not([type="button"])'
    ).val('');
    $('#popup-edit-lamel-rolet input[type="checkbox"]').prop('checked', false);
    $('#popup-edit-lamel-rolet label.thickness-option').remove();
    $('#popup-edit-lamel-rolet label.end-list-option').remove();
    $('#popup-edit-lamel-rolet .guide-size-settings').remove();

    let thicknessBlock = $('#popup-edit-lamel-rolet .thickness-list');
    let endListsBlock = $('#popup-edit-lamel-rolet .end-lists');
    let guidesBlock = $('#popup-edit-lamel-rolet .guide-lists');
    $.get('/base/shields/rolet/lamels/lamel/getEditLamelInfo/' + lamelId, function (editLamelInfo) {
      $('#popup-edit-lamel-rolet input[name="name"]').val(editLamelInfo.lamel.name);
      $('#popup-edit-lamel-rolet input[name="height"]').val(editLamelInfo.lamel.height);
      $('#popup-edit-lamel-rolet input[name="description"]').val(editLamelInfo.lamel.description);
      $('#popup-edit-lamel-rolet img.rolet-image').attr('src', editLamelInfo.lamel.img);
      if (editLamelInfo.lamel.is_color) {
        $('#popup-edit-lamel-rolet input[name="is_color"]').prop('checked', true);
      } else {
        $('#popup-edit-lamel-rolet input[name="is_color"]').prop('checked', false);
      }
      $('#popup-edit-lamel-rolet input[name="is_color"]').val(editLamelInfo.lamel.is_color);

      const guidesThicknesses = [];
      editLamelInfo.guides.forEach((guide) => {
        if (
          guide.thickness &&
          !guidesThicknesses.includes(guide.thickness)
        ) {
          guidesThicknesses.push(guide.thickness);
          thicknessBlock.append(
            `<label class="thickness-option" data-guide-id="${guide.id}">
              <input type="radio" name="thickness" value="${guide.thickness}">
              <span>${guide.thickness}</span>
            </label>`
          );
        }

        const findSizes = editLamelInfo.lamelGuides.find(size => size.rol_guide_id === guide.id);
        guidesBlock.append(
          `<div class="guide-size-settings" data-guide-id="${guide.id}">
            <div class="guide-title">${guide.name}</div>
            <div class="guide-max-width-input">
              <input class="input-default guide-box" type="text" value="${findSizes ? findSizes.max_width : ''}" name="width">
            </div>
            <div class="guide-max-square-input">
              <input class="input-default guide-box" type="text" value="${findSizes ? findSizes.max_square : ''}" name="square">
            </div>
          </div>`
        );
      });

      editLamelInfo.endLists.forEach((list) => {
        const findLamelEndList = editLamelInfo.lamelEndLists.find(row => row.rol_end_list_id === list.id);
        endListsBlock.append(
          `<label class="end-list-option">
            <input type="checkbox" name="${list.name}" value="${findLamelEndList ? 1 : 0}"  ${findLamelEndList ? 'checked' : ''} data-end-list-id="${list.id}">
            <span>${list.name}</span>
          </label>`
        );
      });

      $('input[type="checkbox"]').change(function () {
        const isChecked = $(this).is(':checked');
        if (isChecked) {
          $(this).val('1');
        } else {
          $(this).val('0');
        }
      });

      $('#popup-edit-lamel-rolet').popup('show');     
    });
  });

  $('.btn-delete-system').click(function (e) {
    e.preventDefault();
    const lamelId = $(this).data('lamel');
    $('#popup-delete-lamel-rolet input[name="lamel_id"]').val(lamelId);
    $('#popup-delete-lamel-rolet').popup('show');
  });

  $('.btn-active').click(function (e) {
    e.preventDefault();
    $(this).toggleClass('btn-unactive');
    const lamelId = $(this).data('lamel');
    if (lamelId) {
      $.post(
        '/base/shields/rolet/lamels/lamel/active/' + lamelId,
        {},
        function (data) {}
      );
    }
  });

  // checkboxes

  $('input[type="checkbox"]').change(function () {
    const isChecked = $(this).is(':checked');
    if (isChecked) {
      $(this).val('1');
    } else {
      $(this).val('0');
    }
  });

  function submitAddNewLamel(e) {
    e.preventDefault();

    const end_list = [];
    $(
      '#popup-add-lamel-rolet .end-list-option input[type="checkbox"]:checked'
    ).each(function () {
      const guide_id = $(this).data('endListId');
      end_list.push(guide_id);
    });

    const size_list = [];
    $('#popup-add-lamel-rolet .guide-size-settings').each(function () {
      const id = $(this).data('guideId');
      const width = $(this).find('input[name="width"]').val();
      const square = $(this).find('input[name="square"]').val();

      const resObj = {};
      if (width && square) {
        resObj.id = id;
        resObj.width = width;
        resObj.square = square;
        size_list.push(resObj);
      }
    });

    var formData = new FormData(this);
    var formAction = $(this).attr('action');

    formData.append('end_list', JSON.stringify(end_list));
    formData.append('size_list', JSON.stringify(size_list));
    submitForm({ action: formAction, data: formData }, onResponse);

    function onResponse(data) {
      stopLoader();
      if (data.status) {
        $('.pop-up').popup('hide');
        console.log('ADD lamel');
        setTimeout(function() {
          $('.pop-up').popup('hide');
          window.location.reload();
        }, 300);
      } else {
        console.log('error');
      }
    }
  }

  function submitEditLamel(e) {
    e.preventDefault();

    const end_list = [];
    $(
      '#popup-edit-lamel-rolet .end-list-option input[type="checkbox"]:checked'
    ).each(function () {
      const guide_id = $(this).data('endListId');
      end_list.push(guide_id);
    });

    const size_list = [];
    $('#popup-edit-lamel-rolet .guide-size-settings').each(function () {
      const id = $(this).data('guideId');
      const width = $(this).find('input[name="width"]').val();
      const square = $(this).find('input[name="square"]').val();

      const resObj = {};
      if (width && square) {
        resObj.id = id;
        resObj.width = width;
        resObj.square = square;
        size_list.push(resObj);
      }
    });

    var formData = new FormData(this);
    var formAction = $(this).attr('action');

    formData.append('end_list', JSON.stringify(end_list));
    formData.append('size_list', JSON.stringify(size_list));

    submitForm({ action: formAction, data: formData }, onResponse);

    function onResponse(data) {
      stopLoader();
      if (data.status) {
        $('.pop-up').popup('hide');
        console.log('Edit lamel');
        setTimeout(function() {
          $('.pop-up').popup('hide');
          window.location.reload();
        }, 300);
      } else {
        console.log('error');
      }
    }
  }
  function submitDeleteLamel(e) {
    e.preventDefault();

    var formData = new FormData(this);
    var formAction = $(this).attr('action');

    submitForm({ action: formAction, data: formData }, onResponse);

    function onResponse(data) {
      stopLoader();
      if (data.status) {
        $('.pop-up').popup('hide');
        console.log('Delete lamel');
        setTimeout(function() {
          $('.pop-up').popup('hide');
          window.location.reload();
        }, 300);
      } else {
        console.log('error');
      }
    }
  }
});
