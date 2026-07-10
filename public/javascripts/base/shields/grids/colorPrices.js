$(function () {
  var localizerOption = {
    resGetPath: '/assets/javascripts/vendor/localizer/__ns__-__lng__.json',
  };
  i18n.init(localizerOption);

  
 $.get('/base/shields/grids/colorPrices/getPrices', function(data){
    if (data.status) {
      $('.price-field').each( function () {
        const colorGroupId = $(this).data('color-group-id');
        const systemId = $(this).data('system-id');
        const findValue = data.prices.find(price => price.color_group_id === colorGroupId && price.system_id === systemId);
        if (findValue) {
          $(this).find('input').val(findValue.value);
        }
        
      })
    }
  })

  $('.price-field input').on('blur', function(){

    const colorGroupId = $(this).data('color-group-id');
    const systemId = $(this).data('system-id');
    const value = Number($(this).val());
    if (value || value === 0) {
      $.post('/base/shields/grids/colorPrices/changePrice', {
        colorGroupId: colorGroupId,
        systemId: systemId,
        value: value
      }, function () {

      })
    }
  })


});
