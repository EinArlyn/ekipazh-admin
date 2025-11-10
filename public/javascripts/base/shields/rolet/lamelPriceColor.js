$(function () {
  var localizerOption = { resGetPath: '/assets/javascripts/vendor/localizer/__ns__-__lng__.json'};
  i18n.init(localizerOption);

  $.get('/base/shields/rolet/lamelPriceColor/getPrices', function(data){
    if (data.status) {
      $('.price-field-color input').each( function () {
        const groupColorId = $(this).data('group-color-id');
        const lamelId = $(this).data('lamel-id');
        const findPrice = data.prices.find(price => price.rol_lamel_id === lamelId && price.rol_color_group_id === groupColorId);
        if (findPrice) {
          $(this).val(findPrice.price);
        }
        
      })
    }
  })

  $('.price-field-color input').on('blur', function(){
    const rules = $('.select-rules-price').val();
    const groupColorId = $(this).data('group-color-id');
    const lamelId = $(this).data('lamel-id');
    const value = Number($(this).val());
    if (value || value === 0) {
      $.post('/base/shields/rolet/lamelPriceColor/changePrice', {
        lamelId: lamelId,
        groupColorId: groupColorId,
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
        const lamelId = $(this).data('lamel-id');
        values.push({
          lamelId: lamelId,
          groupColorId: groupColorId,}
        );
      }
      
    })
    if (values.length > 0) {
      $.post('/base/shields/rolet/lamelPriceColor/globalChangeRules', {
        values: JSON.stringify(values),
        rules: rules
      }, function () {

      });
    }
  })
  
});
