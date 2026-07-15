$(function () {
  var localizerOption = { resGetPath: '/assets/javascripts/vendor/localizer/__ns__-__lng__.json'};
  i18n.init(localizerOption);

  const rulesData = [
    { id: 1, name: 'меньше род на %' },
    { id: 2, name: 'больше род на %' },
    { id: 3, name: 'меньше род на мм'},
    { id: 4, name: 'больше род на мм',},
    { id: 5, name: 'род меньше на %',},
    { id: 6, name: 'род больше на %',},
    { id: 7, name: 'род меньше на мм',},
    { id: 8, name: 'род больше на мм',},
    { id: 9, name: 'шт на родителя',},
    { id: 10, name: '1шт каждые мм',},
  ]

  $('#add-profile-pls-form').on('submit', submitAddProfile);
  $('#edit-profile-pls-form').on('submit', submitEditProfile);
  $('#delete-profile-pls-form').on('submit', submitDeleteProfile);
  $('#add-link-element-pls-form').on('submit', submitAddLinkElement);
  $('#edit-link-element-pls-form').on('submit', submitEditLinkElement);
  $('#delete-link-element-pls-form').on('submit', submitDeleteLinkElement);

    /** Init popups */
  $(
    '#popup-add-profile-pls',
    '#popup-edit-profile-pls',
    '#popup-delete-profile-pls',
    '#popup-add-link-element-pls',
    '#popup-edit-link-element-pls',
    '#popup-delete-link-element-pls'
  ).popup({
    type: 'overlay',
    autoopen: false,
    scrolllock: true,
    transition: 'all 0.3s',
  });

  $('.btn-show-more').on('click', function () {
    var profileId = $(this).data('profile');
    var $target = $('.profile-elements[data-profile="' + profileId + '"]');
    var isVisible = $target.is(':visible');

    $('.profile-elements:visible').not($target).slideUp(150);

    if (isVisible) {
      $target.slideUp(150);
      return;
    }

    $target.slideDown(150);
  });

  $('.btn-add-profile').on('click', function (e) {
    e.preventDefault();

    $(
      '#popup-add-profile-pls input:not([type="submit"]):not([type="hidden"]):not([type="button"])'
    ).val('');
    $('#popup-add-profile-pls #pls-currency').find('option').remove();

    $.get('/base/shields/grids/profiles/getCurrencies',  {
      
      }, function(data) {
        if (data.status) {
          data.currencies.sort((a, b) => a.id - b.id);
          for (var i = 0, len = data.currencies.length; i < len; i++) {
            const currency = data.currencies[i];
            $('#popup-add-profile-pls #pls-currency').append(
              '<option value="' + currency.id + '">' + currency.name + '</option>'
            );
          }
        }

        setTimeout(function(){
          $('#popup-add-profile-pls').popup('show');
        },200)
    })
  });

  $('.add-element-to-profile').on('click', function (e) {
    e.preventDefault();

    const profileId = $(this).data('profile');
    $('#popup-add-link-element-pls input[name="parent_id"]').val(profileId);

    $.get('/base/shields/grids/profiles/getElements', {}, function(data) {
      if (data.status) {
        const $select = $('#popup-add-link-element-pls select.select-elements');
        const $selectRules = $('#popup-add-link-element-pls select.select-rules');
        
        $select.find('option').remove();
        $selectRules.find('option').remove();
        
        for (var i = 0, len = data.elements.length; i < len; i++) {
          const element = data.elements[i];
          $select.append(
            '<option value="' + element.id + '">' + element.name + ' / ' + element.sku + '</option>'
          );
        }

        for (var j = 0, len = rulesData.length; j < len; j++) {
          const rule = rulesData[j];
          $selectRules.append(
            '<option value="' + rule.id + '">' + rule.name + '</option>'
          );
        }
        
        setTimeout(function(){
          $('#popup-add-link-element-pls').popup('show');
        },200)
      }
    });
  });

  $('.btn-edit-item').on('click', onEditItemClick);

  function onEditItemClick(e) {
    e.preventDefault();

    const profileId = $(this).data('profile');
    const elementId = $(this).data('element');

    if (profileId && elementId) {
      openEditLinkedElement(profileId, elementId);
      return;
    }

    if (profileId) {
      openEditProfile(profileId);
    }
  }

  function openEditProfile(profileId) {
    $.get('/base/shields/grids/profiles/getCurrencies', {}, function(currencyData) {
      if (currencyData.status) {
        $('#popup-edit-profile-pls #pls-currency').find('option').remove();
        currencyData.currencies.sort((a, b) => a.id - b.id);
        for (var i = 0, len = currencyData.currencies.length; i < len; i++) {
          const currency = currencyData.currencies[i];
          $('#popup-edit-profile-pls #pls-currency').append(
            '<option value="' + currency.id + '">' + currency.name + '</option>'
          );
        }
      }

      $.get('/base/shields/grids/profiles/getProfile/' + profileId, function(data) {
        if (data.status) {
          const profile = data.profile;
          $('#popup-edit-profile-pls input[name="profile_id"]').val(profile.id);

          $('#popup-edit-profile-pls input[name="name"]').val(profile.name);
          $('#popup-edit-profile-pls input[name="sku"]').val(profile.sku);
          $('#popup-edit-profile-pls #pls-currency').val(profile.currency_id);
          $('#popup-edit-profile-pls input[name="price"]').val(profile.price);
          $('#popup-edit-profile-pls select[name="type"]').val(profile.type);
          $('#popup-edit-profile-pls input[name="waste"]').val(profile.waste);
          $('#popup-edit-profile-pls input[name="amendment_pruning"]').val(profile.amendment_pruning);
          $('#popup-edit-profile-pls input[name="weight"]').val(profile.weight);

          setTimeout(function(){
            $('#popup-edit-profile-pls').popup('show');
          },200);
        }
      });
    });
  }

  function openEditLinkedElement(profileId, elementId) {
    $.get('/base/shields/grids/profiles/getLinkElements/' + profileId + '/' + elementId, function(data) {
      if (data.status && data.linkElement) {
        const linkElement = data.linkElement;
        $('#popup-edit-link-element-pls input[name="link_id"]').val(linkElement.id);
        $('#popup-edit-link-element-pls input[name="rules_value"]').val(linkElement.rules_value);

        $.get('/base/shields/grids/profiles/getElements', {}, function(data) {
          if (data.status) {
            const $select = $('#popup-edit-link-element-pls select[name="element_id"]');
            const $selectRules = $('#popup-edit-link-element-pls select[name="rules_id"]');
            
            $select.find('option').remove();
            $selectRules.find('option').remove();
            
            for (var i = 0, len = data.elements.length; i < len; i++) {
              const element = data.elements[i];
              $select.append(
                '<option value="' + element.id + '">' + element.name + ' / ' + element.sku + '</option>'
              );
            }

            for (var j = 0, len = rulesData.length; j < len; j++) {
              const rule = rulesData[j];
              $selectRules.append(
                '<option value="' + rule.id + '">' + rule.name + '</option>'
              );
            }

            $select.val(String(linkElement.element_id));
            $selectRules.val(String(linkElement.rules_id));
            
            setTimeout(function(){
              $('#popup-edit-link-element-pls').popup('show');
            },200)
          }
        });
      }
    });
  }

  $('.btn-delete-item').on('click', onDeleteItemClick);

  function onDeleteItemClick(e) {
    e.preventDefault();

    const profileId = $(this).data('profile');
    const elementId = $(this).data('element');

    if (profileId && elementId) {
      openDeleteLinkedElement(profileId, elementId);
      return;
    }

    if (profileId) {
      openDeleteProfile(profileId);
    }
  }

  function openDeleteProfile(profileId) {
    $('#popup-delete-profile-pls input[name="profile_id"]').val(profileId);
    $('#popup-delete-profile-pls').popup('show');
  }

  function openDeleteLinkedElement(profileId, elementId) {
    $.get('/base/shields/grids/profiles/getLinkElements/' + profileId + '/' + elementId, function(data) {
      if (data.status && data.linkElement) {
        $('#popup-delete-link-element-pls input[name="link_id"]').val(data.linkElement.id);
        $('#popup-delete-link-element-pls').popup('show');
      }
    });
  }


  // Submit forms

  function submitAddProfile(e) {
    e.preventDefault();

    var formData = new FormData(this);
    var formAction = $(this).attr('action');

    submitForm({ action: formAction, data: formData }, onResponse);

    function onResponse (data) {
      stopLoader();
      if (data.status) {
        $('.pop-up').popup('hide');
        console.log('ADD new profile');
        setTimeout(function() {
          $('.pop-up').popup('hide');
          window.location.reload();
        }, 300);
      } else {
        console.log('error');
      }
    }
  }

  function submitEditProfile(e) {
    e.preventDefault();

    var formData = new FormData(this);
    var formAction = $(this).attr('action');

    submitForm({ action: formAction, data: formData }, onResponse);

    function onResponse (data) {
      stopLoader();
      if (data.status) {
        $('.pop-up').popup('hide');
        console.log('Edit profile');
        setTimeout(function() {
          $('.pop-up').popup('hide');
          window.location.reload();
        }, 300);
      } else {
        console.log('error');
      }
    }
  }

  function submitDeleteProfile(e) {
    e.preventDefault();

    var formData = new FormData(this);
    var formAction = $(this).attr('action');

    submitForm({ action: formAction, data: formData }, onResponse);

    function onResponse (data) {
      stopLoader();
      if (data.status) {
        $('.pop-up').popup('hide');
        console.log('Delete profile');
        setTimeout(function() {
          $('.pop-up').popup('hide');
          window.location.reload();
        }, 300);
      } else {
        console.log('error');
      }
    }
  }
  function submitAddLinkElement(e) {
    e.preventDefault();

    var formData = new FormData(this);
    var formAction = $(this).attr('action');
    var parentTypeId = 1;

    formData.set('parent_type_id', parentTypeId);

    submitForm({ action: formAction, data: formData }, onResponse);

    function onResponse (data) {
      stopLoader();
      if (data.status) {
        $('.pop-up').popup('hide');
        console.log('ADD new link element');
        setTimeout(function() {
          $('.pop-up').popup('hide');
          window.location.reload();
        }, 300);
      } else {
        console.log('error');
      }
    }
  }

  function submitEditLinkElement(e) {
    e.preventDefault();

    var formData = new FormData(this);
    var formAction = $(this).attr('action');

    submitForm({ action: formAction, data: formData }, onResponse);

    function onResponse (data) {
      stopLoader();
      if (data.status) {
        $('.pop-up').popup('hide');
        console.log('Edit link element');
        setTimeout(function() {
          $('.pop-up').popup('hide');
          window.location.reload();
        }, 300);
      } else {
        console.log('error');
      }
    }
  }

  function submitDeleteLinkElement(e) {
    e.preventDefault();

    var formData = new FormData(this);
    var formAction = $(this).attr('action');

    submitForm({ action: formAction, data: formData }, onResponse);

    function onResponse (data) {
      stopLoader();
      if (data.status) {
        $('.pop-up').popup('hide');
        console.log('Delete link element');
        setTimeout(function() {
          $('.pop-up').popup('hide');
          window.location.reload();
        }, 300);
      } else {
        console.log('error');
      }
    }
  }
});
