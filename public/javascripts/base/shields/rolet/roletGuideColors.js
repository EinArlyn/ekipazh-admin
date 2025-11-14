$(function () {
  var localizerOption = {
    resGetPath: '/assets/javascripts/vendor/localizer/__ns__-__lng__.json',
  };
  i18n.init(localizerOption);

  /** Init popups */

  $(document).on('change', '.color-guide-select', function() {
    const selected = $(this).find('option:selected');
    const newGroupId = selected.val();
    const color = selected.data('color');

    const container = $(this).closest('.color-guide-item');
    const guideId = container.data('guide-id');
    const colorId = container.data('color-id');

    container.css({
      backgroundColor: color || '#e6e6e6'
    });
    $(this).css({
      backgroundColor: color || '#e6e6e6'
    });

    $.post('/base/shields/rolet/roletGuideColors/table/updateRow', {
        guideId,
        colorId,
        newGroupId
      });
  });

  $.get('/base/shields/rolet/roletGuideColors/table/getRows', function(data) {
    $('.color-guide-select').each(function() {
      const container = $(this).closest('.color-guide-item');
      const guideId = container.data('guide-id');
      const colorId = container.data('color-id');
      
      const row = data.find(r => r.rol_guide_id === guideId && r.rol_color_id === colorId);
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
