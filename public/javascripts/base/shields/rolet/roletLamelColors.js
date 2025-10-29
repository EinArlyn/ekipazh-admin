$(function () {
  var localizerOption = {
    resGetPath: '/assets/javascripts/vendor/localizer/__ns__-__lng__.json',
  };
  i18n.init(localizerOption);

  // $('#add-lamel-rolet-form').on('submit', submitAddNewLamel);
  // $('#edit-lamel-rolet-form').on('submit', submitEditLamel);
  // $('#delete-lamel-rolet-form').on('submit', submitDeleteLamel);

  // $('#add-lamel-rolet-form input.add-image-btn').click(addImgEndLamel);
  // $('#edit-lamel-rolet-form input.add-image-btn').click(editImgEndLamel);

  /** Init popups */

  $(document).on('change', '.color-lamel-select', function() {
    const selected = $(this).find('option:selected');
    const newGroupId = selected.val();
    const color = selected.data('color');

    const container = $(this).closest('.color-lamel-item');
    const lamelId = container.data('lamel-id');
    const colorId = container.data('color-id');

    container.css({
      backgroundColor: color || '#e6e6e6'
    });
    $(this).css({
      backgroundColor: color || '#e6e6e6'
    });

    $.post('/base/shields/rolet/roletLamelColors/table/updateRow', {
        lamelId,
        colorId,
        newGroupId
      });
  });

  $.get('/base/shields/rolet/roletLamelColors/table/getRows', function(data) {
    $('.color-lamel-select').each(function() {
      const container = $(this).closest('.color-lamel-item');
      const lamelId = container.data('lamel-id');
      const colorId = container.data('color-id');
      
      const row = data.find(r => r.rol_lamel_id === lamelId && r.rol_color_id === colorId);
      if (row) {
        $(this).val(row.rol_color_group_id);
      } else {
        $(this).val(0);
      }
      const selected = $(this).find('option:selected');
      const color = selected.data('color');
      container.css({
        backgroundColor: color || '#e6e6e6'
      });
      $(this).css({
        backgroundColor: color || '#e6e6e6'
      });

    });
  });


});
