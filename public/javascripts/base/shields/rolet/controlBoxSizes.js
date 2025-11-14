$(function () {
  var localizerOption = { resGetPath: '/assets/javascripts/vendor/localizer/__ns__-__lng__.json'};
  i18n.init(localizerOption);

  $.get('/base/shields/rolet/controlBoxSizes/getLinks', function(data) {
    if (!data || !data.status || !Array.isArray(data.links)) {
      console.error('bad links payload', data);
      return;
    }

    // строим быстрый индекс по "controlId|boxSizeId"
    const linkMap = {};
    data.links.forEach(function(link) {
      const key = link.rol_control_id + '|' + link.rol_box_size_id;
      linkMap[key] = true;
    });

    $('.rolet-control-box-size-check').each(function() {
      const curCheck  = $(this);
      const controlId = Number(curCheck.data('controlId'));
      const boxSizeId = Number(curCheck.data('sizeId'));

      const key = controlId + '|' + boxSizeId;

      if (linkMap[key]) {
        curCheck.removeClass('btn-unactive');
      } else {
        curCheck.addClass('btn-unactive');
      }
    });

    console.log(data);
  });


  $('.rolet-control-box-size-check').on('click', function() {
    const curCheck   = $(this);
    const controlId  = Number(curCheck.data('controlId'));
    const boxSizeId  = Number(curCheck.data('sizeId'));

    if (!controlId || !boxSizeId) {
      console.error('Нет controlId или boxSizeId');
      return;
    }

    let status = curCheck.hasClass('btn-unactive') ? 1 : 0;

    // сразу визуально переключаем
    curCheck.toggleClass('btn-unactive', status === 0);

    $.post('/base/shields/rolet/controlBoxSizes/changeLinks', {
      status,
      controlId,
      boxSizeId
    })
    .fail(function(err) {
      console.error('changeLinks error', err);
      // откат UI, если запрос упал
      curCheck.toggleClass('btn-unactive', status === 1);
    });
  });
  
});
