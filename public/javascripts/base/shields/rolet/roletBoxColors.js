$(function () {
  var localizerOption = {
    resGetPath: '/assets/javascripts/vendor/localizer/__ns__-__lng__.json',
  };
  i18n.init(localizerOption);

  /** Init popups */

  $(document).on('change', '.color-box-select', function() {
    const selected = $(this).find('option:selected');
    const newGroupId = selected.val();
    const color = selected.data('color');

    const container = $(this).closest('.color-box-item');
    const boxSizeId = container.data('box-size-id');
    const colorId = container.data('color-id');
    const pvcAlum = container.data('pvc-alum');

    container.css({
      backgroundColor: color || '#e6e6e6'
    });
    $(this).css({
      backgroundColor: color || '#e6e6e6'
    });

    $.post('/base/shields/rolet/roletBoxColors/table/updateRow', {
        boxSizeId,
        colorId,
        newGroupId,
        pvcAlum
      });
  });

  $.get('/base/shields/rolet/roletBoxColors/table/getRows', function(data) {
    $('.color-box-select').each(function() {
      const container = $(this).closest('.color-box-item');
      const boxSizeId = container.data('box-size-id');
      const colorId = container.data('color-id');
      const pvcAlum = container.data('pvc-alum');
      
      const row = data.find(r => r.id_rol_box_size === boxSizeId && r.rol_color_id === colorId && r.pvc_or_alum === pvcAlum);
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

  $('.box-item-wrap').on('click', function() {
    const boxId = $(this).find('.box-item').data('box-id');
    
    $(this).find('.box-sizes-wrap').toggleClass('show');
    
    $('.color-box-item[data-box-id="' + boxId + '"]').toggleClass('show');
  });

});
