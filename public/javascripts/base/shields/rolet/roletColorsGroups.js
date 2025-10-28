$(function () {
  var localizerOption = {
    resGetPath: '/assets/javascripts/vendor/localizer/__ns__-__lng__.json',
  };
  i18n.init(localizerOption);

  $('#add-color-group-rolet-form').on('submit', submitAddNewColorGroup);

  // $('#add-lamel-rolet-form').on('submit', submitAddNewLamel);
  // $('#edit-lamel-rolet-form').on('submit', submitEditLamel);
  // $('#delete-lamel-rolet-form').on('submit', submitDeleteLamel);

  // $('#add-lamel-rolet-form input.add-image-btn').click(addImgEndLamel);
  // $('#edit-lamel-rolet-form input.add-image-btn').click(editImgEndLamel);

 
  const radioColorsGroup = [
    '#F4C2C2', // мягкий пастельно-розовый
    '#F7D9A6', // тёплый кремово-песочный
    '#F4E3B2', // ванильный / светлый тепло-бежевый
    '#D8E2A9', // спокойный салатово-оливковый
    '#B6D7A8', // зелёный «мята спокойная»

    '#A6D6D6', // нежный морской голубой
    '#A7C2E3', // пастельно-синий
    '#C4B7E8', // светло-сиреневый
    '#E3B8D4', // спокойный розово-лиловый
    '#E8C7A6', // пудрово-персиковый (тёплый, но не резкий)
    ];

     /** Init popups */
  $(
    '#popup-add-color-group-rolet',
    '#popup-edit-color-group-rolet',
    '#popup-delete-color-group-rolet',
    '#popup-add-color-rolet',
    '#popup-edit-color-rolet',
    '#popup-delete-color-rolet',
  ).popup({
    type: 'overlay',
    autoopen: false,
    scrolllock: true,
    transition: 'all 0.3s',
  });



  $('.btn-add-group').click( function(e) {
    e.preventDefault();
    $('#popup-add-color-group-rolet .radio-colors-block').empty();
    $('#popup-add-color-group-rolet .radio-colors-block').append(
      radioColorsGroup.map( (color, index) => 
        `<label class="color-radio-tile">
          <input 
            type="radio" 
            id="add-color-group-rolet-radio-${index}" 
            name="colorGroup" 
            value="${color}" 
            ${index === 0 ? 'checked' : ''}/>
          <span class="color-swatch" style="background:${color};"></span>
        </label>`
      )
    );
    $('#popup-add-color-group-rolet').popup('show');
  })


  $('.btn-edit-group').click(function(e) {
    // e.preventDefault();
    // const groupId = $(this).data('group');
    // $.get('/base/shields/rolet/rolet/group/getGroup/' + groupId, function(data) {
    //   $('#popup-edit-group-rolet input[name="name"]').val(data.group.name);
    //   $('#popup-edit-group-rolet input[name="position"]').val(data.group.position);
    //   $('#popup-edit-group-rolet input[name="description"]').val(data.group.description);
    //   $('#popup-edit-group-rolet input[name="group_id"]').val(groupId);
    //   $('#popup-edit-group-rolet img.rolet-image').attr('src', data.group.img);
    //   $('#popup-edit-group-rolet input[type="checkbox"]').val('');
    //   $('#popup-edit-group-rolet input[type="checkbox"]').prop('checked', false);
      
    //   $('#popup-edit-group-rolet input[type="checkbox"]').each(function(){
    //     const country_id = $(this).data('countryId');
    //     const checkCountry = data.country_ids.includes(country_id);
    //     if (checkCountry) {
    //       $(this).val(1);
    //       $(this).prop('checked', true);
    //     }
    //   });
      
    //   $('#popup-edit-group-rolet').popup('show');
    // })
  })
});
