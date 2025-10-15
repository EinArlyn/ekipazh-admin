$(function () {
  var localizerOption = { resGetPath: '/assets/javascripts/vendor/localizer/__ns__-__lng__.json'};
  i18n.init(localizerOption);

  $.get('/base/shields/rolet/roletPrice/getPrices', function(data){
    if (data.status) {
      $('.price-field').each( function () {
        const lamId = $(this).data('lamel-id');
        const boxId = $(this).data('box-id');
        const findPrice = data.prices.find(price => price.rol_lamel_id === lamId && price.id_rol_box === boxId);
        if (findPrice) {
          $(this).find('input').val(findPrice.price);
        }
        
      })
    }
  })

  $('.price-field input').on('blur', function(){

    const lamId = $(this).data('lamel-id');
    const boxId = $(this).data('box-id');
    const value = parseInt($(this).val(), 10);
    if (value || value === 0) {
      $.post('/base/shields/rolet/roletPrice/changePrice', {
        lamId: lamId,
        boxId: boxId,
        price: value
      }, function () {

      })
    }
  })
  
});
