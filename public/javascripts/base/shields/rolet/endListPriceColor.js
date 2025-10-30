$(function () {
  var localizerOption = { resGetPath: '/assets/javascripts/vendor/localizer/__ns__-__lng__.json'};
  i18n.init(localizerOption);

  $.get('/base/shields/rolet/endListPriceColor/getPrices', function(data){
    if (data.status) {
      $('.price-field-color input').each( function () {
        const groupColorId = $(this).data('group-color-id');
        const endListId = $(this).data('end-list-id');
        const findPrice = data.prices.find(price => price.rol_end_list_id === endListId && price.rol_color_group_id === groupColorId);
        if (findPrice) {
          $(this).val(findPrice.price);
        }
        
      })
    }
  })

  $('.price-field-color input').on('blur', function(){
    const rules = $('.select-rules-price').val();
    const groupColorId = $(this).data('group-color-id');
    const endListId = $(this).data('end-list-id');
    const value = parseInt($(this).val(), 10);
    if (value || value === 0) {
      $.post('/base/shields/rolet/endListPriceColor/changePrice', {
        endListId: endListId,
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
        const endListId = $(this).data('end-list-id');
        values.push({
          endListId: endListId,
          groupColorId: groupColorId,}
        );
      }
      
    })
    if (values.length > 0) {
      $.post('/base/shields/rolet/endListPriceColor/globalChangeRules', {
        values: JSON.stringify(values),
        rules: rules
      }, function () {

      });
    }
  })
  
});
