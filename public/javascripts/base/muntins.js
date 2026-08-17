$(function () {
  var localizerOption = {
    resGetPath: '/assets/javascripts/vendor/localizer/__ns__-__lng__.json',
  };
  i18n.init(localizerOption);

  $('#add-muntins-form').on('submit', submitAddNewSystem);
  $('#edit-muntins-form').on('submit', submitEditSystem);
  $('#delete-muntins-form').on('submit', submitDeleteSystem);
  $('#add-muntins-form input.add-image-btn').click(addImgSystem);
  $('#edit-muntins-form input.add-image-btn').click(editImgSystem);

  /** Init popups */
  $(
    '#popup-add-muntins',
    '#popup-edit-muntins',
    '#popup-delete-muntins',
  ).popup({
    type: 'overlay',
    autoopen: false,
    scrolllock: true,
    transition: 'all 0.3s',
  });

  

  // systems
  $('.btn-add-system').click(function (e) {
    e.preventDefault();
    const typeId = $(this).data('type');
    $(
      '#popup-add-muntins input:not([type="submit"]):not([type="button"])',
    ).val('');
    $('#popup-add-muntins input[type="checkbox"]').prop(
      'checked',
      false,
    );
    $('#popup-add-muntins #muntins-currency').find('option').remove();
    $('#popup-add-muntins input[type="hidden"]').val(typeId);
    $.get('/base/muntins/muntins/getProfilesLinks', {}, function (data) {
      $.get('/base/muntins/muntins/getPtProfilesLinks', {}, function (ptData) {
        if (data.status) {
          const profiles = data.profiles;
          const linksContainer = $('#popup-add-muntins .row-profile-links');
          linksContainer.empty();

          if (profiles && Array.isArray(profiles)) {
            profiles.forEach(function (profile) {
              const profileBlock = $('<div class="profile-checkbox-block"></div>');
              const checkboxId = 'profile-checkbox-' + profile.id;
              const checkbox = $(
                '<input type="checkbox" id="' +
                  checkboxId +
                  '" name="profile_links[]" value="' +
                  profile.id +
                  '" data-profile-id="' +
                  profile.id +
                  '">',
              );
              const label = $(
                '<label for="' + checkboxId + '">' + profile.name + '</label>',
              );

              profileBlock.append(checkbox);
              profileBlock.append(' ');
              profileBlock.append(label);
              linksContainer.append(profileBlock);
            });
          }

          if (ptData.status) {
            const ptProfiles = ptData.ptProfiles;
            const ptLinksContainer = $(
              '#popup-add-muntins .row-pt-profile-links',
            );
            ptLinksContainer.empty();

            if (ptProfiles && Array.isArray(ptProfiles)) {
              ptProfiles.forEach(function (profile) {
                const profileBlock = $(
                  '<div class="profile-checkbox-block"></div>',
                );
                const checkboxId = 'pt-profile-checkbox-' + profile.id;
                const checkbox = $(
                  '<input type="checkbox" id="' +
                    checkboxId +
                    '" name="pt_profile_links[]" value="' +
                    profile.id +
                    '" data-profile-id="' +
                    profile.id +
                    '">',
                );
                const label = $(
                  '<label for="' + checkboxId + '">' + profile.name + '</label>',
                );

                profileBlock.append(checkbox);
                profileBlock.append(' ');
                profileBlock.append(label);
                ptLinksContainer.append(profileBlock);
              });
            }

            $.get('/base/muntins/muntins/getCurrencies', {}, function (data) {
              if (data.status) {
                for (var i = 0, len = data.currencies.length; i < len; i++) {
                  const currency = data.currencies[i];
                  $('#popup-add-muntins #muntins-currency').append(
                    '<option value="' +
                      currency.id +
                      '">' +
                      currency.name +
                      '</option>',
                  );
                }
              }
              $('#popup-add-muntins').popup('show');
            });
          }
        }
      });
    });

  });

  $('.btn-edit-system').click(function (e) {
    e.preventDefault();
    const systemId = $(this).data('system');
    $(
      '#popup-edit-muntins input:not([type="submit"]):not([type="hidden"]):not([type="button"])',
    ).val('');
    $('#popup-edit-muntins #muntins-currency').find('option').remove();
    $('#popup-edit-muntins input[name="system_id"]').val(systemId);
    if (systemId) {
      $.get(
        '/base/muntins/muntins/getSystem/' + systemId,
        {},
        function (data) {
          $('#popup-edit-muntins input[name="name"]').val(
            data.system.name,
          );
          $('#popup-edit-muntins input[name="position"]').val(
            data.system.position,
          );
          $('#popup-edit-muntins input[name="min_gap"]').val(
            data.system.min_gap,
          );
          $('#popup-edit-muntins input[name="price"]').val(
            data.system.price,
          );
          $('#popup-edit-muntins textarea[name="description"]').val(
            data.system.description,
          );
          $('#popup-edit-muntins img.muntins-image').attr(
            'src',
            data.system.img,
          );

          $.get('/base/muntins/muntins/getWidths/' + systemId, {}, function (widthsData) {
            if (widthsData.status) {
              const widths = widthsData.widths;
              const popupSelector = '#popup-edit-muntins';

              for (let i = 1; i <= 5; i += 1) {
                const widthInput = $(
                  popupSelector + ' input[name="width_' + i + '"]',
                );
                const priceInput = $(
                  popupSelector + ' input[name="price_' + i + '"]',
                );

                widthInput.val('');
                priceInput.val('');
                widthInput.removeAttr('data-width-id');
                priceInput.removeAttr('data-width-id');
              }

              if (widths && Array.isArray(widths)) {
                widths.sort(function (a, b) {
                  return a.width - b.width;
                });

                widths.forEach(function (widthItem, index) {
                  const fieldIndex = index + 1;
                  const widthInput = $(
                    popupSelector +
                      ' input[name="width_' +
                      fieldIndex +
                      '"]',
                  );
                  const priceInput = $(
                    popupSelector +
                      ' input[name="price_' +
                      fieldIndex +
                      '"]',
                  );

                  widthInput.val(widthItem.width || '');
                  priceInput.val(widthItem.price || '');

                  if (widthItem.id) {
                    widthInput.attr('data-width-id', widthItem.id);
                    priceInput.attr('data-width-id', widthItem.id);
                  }
                });
              }

              $.get('/base/muntins/muntins/getProfilesLinks', {}, function (profileData) {
               $.get('/base/muntins/muntins/getPtProfilesLinks', {}, function (ptData) {
                
                 if (profileData.status) {
                   const profiles = profileData.profiles;
                   const systemProfileIds = (profileData.profileLinks || [])
                     .filter(function (link) {
                       return Number(link.muntins_id) === Number(systemId);
                     })
                     .map(function (link) {
                       return Number(link.profile_id);
                     });
                   const linksContainer = $('#popup-edit-muntins .row-profile-links');
                   linksContainer.empty();
    
                   if (profiles && Array.isArray(profiles)) {
                     profiles.forEach(function (profile) {
                       const profileBlock = $('<div class="profile-checkbox-block"></div>');
                       const checkboxId = 'profile-checkbox-' + profile.id;
                       const checkbox = $(
                         '<input type="checkbox" id="' +
                           checkboxId +
                           '" name="profile_links[]" value="' +
                           profile.id +
                           '" data-profile-id="' +
                           profile.id +
                           '">',
                       );
                       if (systemProfileIds.includes(Number(profile.id))) {
                         checkbox.prop('checked', true);
                       }
                       const label = $(
                         '<label for="' + checkboxId + '">' + profile.name + '</label>',
                       );
    
                       profileBlock.append(checkbox);
                       profileBlock.append(' ');
                       profileBlock.append(label);
                       linksContainer.append(profileBlock);
                     });
                   }
    
                   if (ptData.status) {
                     const ptProfiles = ptData.ptProfiles;
                     const systemPtProfileIds = (ptData.ptProfileLinks || [])
                       .filter(function (link) {
                         return Number(link.muntins_id) === Number(systemId);
                       })
                       .map(function (link) {
                         return Number(link.pt_profile_id);
                       });
                     const ptLinksContainer = $(
                       '#popup-edit-muntins .row-pt-profile-links',
                     );
                     ptLinksContainer.empty();
    
                     if (ptProfiles && Array.isArray(ptProfiles)) {
                       ptProfiles.forEach(function (profile) {
                         const profileBlock = $(
                           '<div class="profile-checkbox-block"></div>',
                         );
                         const checkboxId = 'pt-profile-checkbox-' + profile.id;
                         const checkbox = $(
                           '<input type="checkbox" id="' +
                             checkboxId +
                             '" name="pt_profile_links[]" value="' +
                             profile.id +
                             '" data-profile-id="' +
                             profile.id +
                             '">',
                         );
                         if (systemPtProfileIds.includes(Number(profile.id))) {
                           checkbox.prop('checked', true);
                         }
                         const label = $(
                           '<label for="' + checkboxId + '">' + profile.name + '</label>',
                         );
    
                         profileBlock.append(checkbox);
                         profileBlock.append(' ');
                         profileBlock.append(label);
                         ptLinksContainer.append(profileBlock);
                       });
                     }
                     

                     $.get('/base/muntins/muntins/getCurrencies', {}, function (dataCurrency) {
                        if (dataCurrency.status) {
                          for (
                            var i = 0, len = dataCurrency.currencies.length;
                            i < len;
                            i++
                          ) {
                            const currency = dataCurrency.currencies[i];
                            const selected =
                              dataCurrency.currencies[i].id == data.system.currency_id
                                ? ' selected'
                                : '';
                            $('#popup-edit-muntins #muntins-currency').append(
                              '<option value="' +
                                currency.id +
                                '"' +
                                selected +
                                '>' +
                                currency.name +
                                '</option>',
                            );
                          }
                        }

                        $('#popup-edit-muntins').popup('show');
                        
                      });
                   }
                 }
               });
             });
            }
          });


        },
      );
    }
  });

  $('.btn-delete-system').click(function (e) {
    e.preventDefault();
    const systemId = $(this).data('system');
    $('#popup-delete-muntins input[name="system_id"]').val(systemId);
    $('#popup-delete-muntins').popup('show');
  });

  $('.btn-active').click(function (e) {
    e.preventDefault();
    $(this).toggleClass('btn-unactive');
    const systemId = $(this).data('system');

    if (systemId) {
      $.post(
        '/base/muntins/muntins/active/' + systemId,
        {},
        function (data) {},
      );
    }
  });

  // checkboxes

  $('input[type="checkbox"]').change(function () {
    const isChecked = $(this).is(':checked');
    if (isChecked) {
      $(this).val('1');
    } else {
      $(this).val('0');
    }
  });


  function submitAddNewSystem(e) {
    e.preventDefault();

    var formData = new FormData(this);
    var formAction = $(this).attr('action');

    var profileLinks = [];
    $(
      '#popup-add-muntins .row-profile-links input[name="profile_links[]"]:checked',
    ).each(function () {
      profileLinks.push($(this).data('profile-id'));
    });

    var ptProfileLinks = [];
    $(
      '#popup-add-muntins .row-pt-profile-links input[name="pt_profile_links[]"]:checked',
    ).each(function () {
      ptProfileLinks.push($(this).data('profile-id'));
    });

    formData.delete('profile_links[]');
    formData.delete('pt_profile_links[]');
    formData.append('profile_links', JSON.stringify(profileLinks));
    formData.append('pt_profile_links', JSON.stringify(ptProfileLinks));

    submitForm({ action: formAction, data: formData }, onResponse);

    function onResponse(data) {
      stopLoader();
      if (data.status) {
        $('.pop-up').popup('hide');
        console.log('addSystem');
        setTimeout(function () {
          $('.pop-up').popup('hide');
          window.location.reload();
        }, 300);
      } else {
        console.log('error');
      }
    }
  }

  function submitEditSystem(e) {
    e.preventDefault();

    var formData = new FormData(this);
    var formAction = $(this).attr('action');

    var profileLinks = [];
    $(
      '#popup-edit-muntins .row-profile-links input[name="profile_links[]"]:checked',
    ).each(function () {
      profileLinks.push($(this).data('profile-id'));
    });

    var ptProfileLinks = [];
    $(
      '#popup-edit-muntins .row-pt-profile-links input[name="pt_profile_links[]"]:checked',
    ).each(function () {
      ptProfileLinks.push($(this).data('profile-id'));
    });

    var widthsList = [];
    for (let i = 1; i <= 5; i += 1) {
      const widthInput = $(
        '#popup-edit-muntins input[name="width_' + i + '"]',
      );
      const priceInput = $(
        '#popup-edit-muntins input[name="price_' + i + '"]',
      );
      const widthId = widthInput.attr('data-width-id');

      widthsList.push({
        id: widthId ? Number(widthId) : null,
        width: widthInput.val(),
        price: priceInput.val(),
      });
    }

    formData.delete('profile_links[]');
    formData.delete('pt_profile_links[]');
    formData.append('profile_links', JSON.stringify(profileLinks));
    formData.append('pt_profile_links', JSON.stringify(ptProfileLinks));
    formData.append('widths_list', JSON.stringify(widthsList));

    submitForm({ action: formAction, data: formData }, onResponse);

    function onResponse(data) {
      stopLoader();
      if (data.status) {
        $('.pop-up').popup('hide');
        console.log('editSystem');
        setTimeout(function () {
          $('.pop-up').popup('hide');
          window.location.reload();
        }, 300);
      } else {
        console.log('error');
      }
    }
  }
  function submitDeleteSystem(e) {
    e.preventDefault();

    var formData = new FormData(this);
    var formAction = $(this).attr('action');

    submitForm({ action: formAction, data: formData }, onResponse);

    function onResponse(data) {
      stopLoader();
      if (data.status) {
        $('.pop-up').popup('hide');
        console.log('deleteSystem');
        setTimeout(function () {
          $('.pop-up').popup('hide');
          window.location.reload();
        }, 300);
      } else {
        console.log('error');
      }
    }
  }

  function addImgSystem(e) {
    selectImageMuntins('#popup-add-muntins');
  }
  function editImgSystem(e) {
    selectImageMuntins('#popup-edit-muntins');
  }
  function selectImageMuntins(popup) {
    $(popup + ' input.muntins-image-file').trigger('click');
  }
});
