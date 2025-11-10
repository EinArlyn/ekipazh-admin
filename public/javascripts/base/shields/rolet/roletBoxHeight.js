$(function () {
  var localizerOption = { resGetPath: '/assets/javascripts/vendor/localizer/__ns__-__lng__.json'};
  i18n.init(localizerOption);

  $.get('/base/shields/rolet/roletBoxHeight/getBoxHeight', function(data){
    if (data.status) {
      $('.field-type-not, .field-type-is').each(function () {
        const $field = $(this);
        const input =  $(this).find('input')
        const lamId = input.data('lamel-id');
        const boxId = input.data('box-id');
        const sizeId = input.data('size-id');

        const findHeight = data.heights.find(h =>
          h.rol_lamel_id === lamId &&
          h.id_rol_box === boxId &&
          h.rol_box_size_id === sizeId
        );

        if (!findHeight) return;

        if ($field.hasClass('field-type-not')) {
          $field.find('input').val(findHeight.height_not_grid);
        } else if ($field.hasClass('field-type-is')) {
          $field.find('input').val(findHeight.height_is_grid);
        }
      });
    }
  })

  $('.field-type-not input, .field-type-is input')
  .on('blur', function () {
    const $input = $(this);
    const lamId = $input.data('lamel-id');
    const boxId = $input.data('box-id');
    const sizeId = $input.data('size-id');
    const height = Number($input.val());

    if (height || height === 0) {
      const isGrid = $input.closest('.field-type-is').length ? 1 : 0;

      $.post('/base/shields/rolet/roletBoxHeight/changeHeight', {
        lamId,
        boxId,
        sizeId,
        isGrid,
        height
      });
    }
  })
  .on('keydown', function (e) {
    if (e.keyCode === 13) {
      e.preventDefault();
      $(this).blur();
    }
  });


  
});
