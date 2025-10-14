$(function () {
  var localizerOption = { resGetPath: '/assets/javascripts/vendor/localizer/__ns__-__lng__.json'};
  i18n.init(localizerOption);

  $.get('/base/shields/rolet/roletPrices/getPrices', function(data){
    if (data.status) {
      $('.price-field').each( function () {
        const lamId = $(this).data('lamel-id');
        const boxId = $(this).data('box-id');
        // console.log(lamId)
        // console.log(boxId)
      })
    }
  })
  
});
