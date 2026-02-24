$(function () {
  var localizerOption = { resGetPath: '/assets/javascripts/vendor/localizer/__ns__-__lng__.json'};
  i18n.init(localizerOption);

  $.get('/base/shields/rolet/guidePriceColor/getPrices', function(data){
    if (data.status) {
      $('.price-field-color input').each( function () {
        const groupColorId = $(this).data('group-color-id');
        const priceType = $(this).data('price-type');
        const guideId = $(this).data('guide-id');
        const findPrice = data.prices.find(price => price.rol_guide_id === guideId && price.rol_color_group_id === groupColorId);
        if (findPrice && priceType === 0) {
          $(this).val(findPrice.price);
        } 
        if (findPrice && priceType === 1) {
          $(this).val(findPrice.price_m);
        } 
        
      })
    }
  })

  $('.price-field-color input').on('blur', function(){
    const rules = $('.select-rules-price').val();
    const priceType = $(this).data('price-type');
    const groupColorId = $(this).data('group-color-id');
    const guideId = $(this).data('guide-id');
    const value = Number($(this).val());
    if (value || value === 0) {
      $.post('/base/shields/rolet/guidePriceColor/changePrice', {
        guideId: guideId,
        groupColorId: groupColorId,
        price: value,
        priceType: priceType,
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
        const guideId = $(this).data('guide-id');
        values.push({
          guideId: guideId,
          groupColorId: groupColorId,}
        );
      }
      
    })
    if (values.length > 0) {
      $.post('/base/shields/rolet/guidePriceColor/globalChangeRules', {
        values: JSON.stringify(values),
        rules: rules
      }, function () {

      });
    }
  })
  
});
