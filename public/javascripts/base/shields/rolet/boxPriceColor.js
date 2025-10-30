$(function () {
  var localizerOption = { resGetPath: '/assets/javascripts/vendor/localizer/__ns__-__lng__.json'};
  i18n.init(localizerOption);

  $.get('/base/shields/rolet/boxPriceColor/getPrices', function(data){
    if (data.status) {
      $('.price-field-color input').each( function () {
        const groupColorId = $(this).data('group-color-id');
        const boxId = $(this).data('box-id');
        const sizeId = $(this).data('size-id');
        const findPrice = data.prices.find(price => price.id_rol_box_size === sizeId && price.rol_color_group_id === groupColorId);
        if (findPrice) {
          $(this).val(findPrice.price);
          if (findPrice.rol_price_rules_id) {
            $('.select-rules-price').val(findPrice.rol_price_rules_id);
          }
        }
        
      })
    }
  })

  $('.price-field-color input').on('blur', function(){
    const rules = $('.select-rules-price').val();
    const groupColorId = $(this).data('group-color-id');
    const boxId = $(this).data('box-id');
    const sizeId = $(this).data('size-id');
    const value = parseInt($(this).val(), 10);
    if (value || value === 0) {
      $.post('/base/shields/rolet/boxPriceColor/changePrice', {
        boxId: boxId,
        groupColorId: groupColorId,
        sizeId: sizeId,
        price: value,
        rules: rules
      }, function () {

      })
    }
  })

  $('.select-rules-price').on('change', function(){
    const rules = $(this).val();
    const values = [];
    $('.price-field-color input').each( function () {
      if ($(this).val()) {
        const groupColorId = $(this).data('group-color-id');
        const sizeId = $(this).data('size-id');
        values.push({
          sizeId: sizeId,
          groupColorId: groupColorId,}
        );
      }
      
    })
    if (values.length > 0) {
      $.post('/base/shields/rolet/boxPriceColor/globalChangeRules', {
        values: JSON.stringify(values),
        rules: rules
      }, function () {

      });
    }
  })
  
});
