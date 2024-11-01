$(function () {
  var localizerOption = { resGetPath: '/assets/javascripts/vendor/localizer/__ns__-__lng__.json'};
  i18n.init(localizerOption);

  var datepickerState = false;

  /** Reset password popup */
  $('.popup-reset-password input[name="old_password"]').change(validateCurrentPassword);
  $('.popup-reset-password input[name="new_password"]').keyup(validateNewPassword);
  $('.popup-reset-password input[name="new_password_repeat"]').keyup(validateNewRepeatPassword);
  $('.popup-reset-password input.pop-up-submit-btn').click(editNewPassword);
  $('form#form-reset-password').on('submit', submitNewPassword);

  initPopups([
    '.popup-reset-password'
  ]);

  init();


  /** Show datepickers */
  $("#select-month-from").click(function (event) {
    event.preventDefault();
    if (datepickerState) {
      $(".date-pickers").hide();
      //$(".date-picker-from").show(200);
      datepickerState = false;
    } else {
      $(".date-picker-from").show(200);
      datepickerState = true;
    }
  });
  $("#select-month-to").click(function (event) {
    event.preventDefault();
    if (datepickerState) {
      $(".date-pickers").hide();
      //$(".date-picker-to").show(200);
      datepickerState = false;
    } else {
      $(".date-picker-to").show(200);
      datepickerState = true;
    }
  });

  function closeOptions() {
    $(".user-tabs").remove();
  }

  function saveUser(e) {
    e.preventDefault();
    $('#edit-user-form').submit();
  }

  function saveUserDiscounts() {
    var userId = $(this).attr('data-user');
    var maxConst = $('#option-discount-max-const').val();
    var maxAddEl = $('#option-discount-max-add-elem').val();
    var defaultConst = $('#option-discount-default-const').val();
    var defaultAddEl = $('#option-discount-default-add-elem').val();
    var week1Const = $('#option-discount-week1-const').val();
    var week1AddEl = $('#option-discount-week1-add-elem').val();
    var week2Const = $('#option-discount-week2-const').val();
    var week2AddEl = $('#option-discount-week2-add-elem').val();
    var week3Const = $('#option-discount-week3-const').val();
    var week3AddEl = $('#option-discount-week3-add-elem').val();
    var week4Const = $('#option-discount-week4-const').val();
    var week4AddEl = $('#option-discount-week4-add-elem').val();
    var week5Const = $('#option-discount-week5-const').val();
    var week5AddEl = $('#option-discount-week5-add-elem').val();
    var week6Const = $('#option-discount-week6-const').val();
    var week6AddEl = $('#option-discount-week6-add-elem').val();
    var week7Const = $('#option-discount-week7-const').val();
    var week7AddEl = $('#option-discount-week7-add-elem').val();
    var week8Const = $('#option-discount-week8-const').val();
    var week8AddEl = $('#option-discount-week8-add-elem').val();

    $.post('/mynetwork/save-discounts/' + userId, {
      maxConst: maxConst,
      maxAddEl: maxAddEl,
      defaultConst: defaultConst,
      defaultAddEl: defaultAddEl,
      week1Const: week1Const,
      week1AddEl: week1AddEl,
      week2Const: week2Const,
      week2AddEl: week2AddEl,
      week3Const: week3Const,
      week3AddEl: week3AddEl,
      week4Const: week4Const,
      week4AddEl: week4AddEl,
      week5Const: week5Const,
      week5AddEl: week5AddEl,
      week6Const: week6Const,
      week6AddEl: week6AddEl,
      week7Const: week7Const,
      week7AddEl: week7AddEl,
      week8Const: week8Const,
      week8AddEl: week8AddEl
    }, function(data) {
      if (data.status) {
        setTimeout(function() {
          getUserHistory(userId);
        }, 400);
        $.toast({
          text : i18n.t('Changes saved'),
          showHideTransition: 'fade',
          allowToastClose: true,
          hideAfter: 3000,
          stack: 5,
          position: {top: '60px', right: '30px'}
        });
      } else {
console.error(data.error ?? data.error_1);
        $.toast({
          text : i18n.t('Discount cannot be over than') + ' ' + data.parentValue + '%',
          showHideTransition: 'fade',
          allowToastClose: true,
          hideAfter: 3000,
          stack: 5,
          position: {top: '60px', right: '30px'},
          bgColor: '#FF6633',
          textColor: '#fff'
        });
      }
    });
  }

  function onCountriesChange() {
    var countryId = $('#option-user-country').val();

    $.get('/services/get-regions/' + countryId, function(data) {
      if (data.status) {
        $('#option-user-region').find('option').remove();
        for (var i = 0, len = data.regions.length; i < len; i++) {
          $('#option-user-region').append('<option value="' + data.regions[i].id + '">' +
            data.regions[i].name +
          '</option>');
        }
        $('#option-user-region').trigger('change');
      }
    });
  }

  function onRegionsChange() {
    var regionId = $('#option-user-region').val();

    $.get('/services/get-cities/' + regionId, function(data) {
      if (data.status) {
        $('#option-user-city').find('option').remove();
        for (var i = 0, len = data.cities.length; i < len; i++) {
          $('#option-user-city').append('<option value="' + data.cities[i].id + '">' +
            data.cities[i].name +
          '</option>');
        }
      }
    });
  }

  function changeAvatar(e) {
    e.preventDefault();
    $('#avatar-input').trigger('click');
  }

  function setUserRights() {
    var userId = $('td.user-tabs').attr('data-user');
    var menuId = $(this).attr('data-type');
    var isChecked = $(this).prop('checked');

    $.post('/mynetwork/set-user-rights/' + userId, {
      menuId: menuId,
      isChecked: isChecked
    }, function(data) {
      if (data.status) {
        getUserHistory(userId)
        $.toast({
          text : i18n.t('Permissions changed'),
          showHideTransition: 'fade',
          allowToastClose: true,
          hideAfter: 3000,
          stack: 5,
          position: {top: '60px', right: '30px'}
        });
      }
    });
  }

  function activateDeliveries(e) {
    var userId = $('td.user-tabs').attr('data-user');
    var rowId = $(e.target).attr('data-row');
    var isChecked = $(e.target).prop('checked');

    $.post('/mynetwork/activate-deliveries/' + userId, {
      rowId: rowId,
      isChecked: isChecked
    }, function(data) {
      if (data.status) {
        if (isChecked) {
          $.toast({
            text : i18n.t('Delivery activated'),
            showHideTransition: 'fade',
            allowToastClose: true,
            hideAfter: 3000,
            stack: 5,
            position: {top: '60px', right: '30px'}
          });
        } else {
          $.toast({
            text : i18n.t('Delivery deactivated'),
            showHideTransition: 'fade',
            allowToastClose: true,
            hideAfter: 3000,
            stack: 5,
            position: {top: '60px', right: '30px'}
          });
        }
      }
    });
  }

  function editDelivery(e) {
    var userId = $('td.user-tabs').attr('data-user');
    var rowId = $(e.target).attr('data-row');
    var field = $(e.target).attr('data-field');
    var value = $(e.target).val();

    $.post('/mynetwork/edit-delivery/' + userId, {
      field: field,
      rowId: rowId,
      value: value
    }, function(data) {
      if (data.status) {
        getUserHistory(userId)
        $.toast({
          text : i18n.t('Delivery changed'),
          showHideTransition: 'fade',
          allowToastClose: true,
          hideAfter: 3000,
          stack: 5,
          position: {top: '60px', right: '30px'}
        });
      }
    });
  }

  function activateMountings(e) {
    var userId = $('td.user-tabs').attr('data-user');
    var rowId = $(e.target).attr('data-row');
    var isChecked = $(e.target).prop('checked');

    $.post('/mynetwork/activate-mountings/' + userId, {
      rowId: rowId,
      isChecked: isChecked
    }, function(data) {
      if (data.status) {
        if (isChecked) {
          $.toast({
            text : i18n.t('Mounting activated'),
            showHideTransition: 'fade',
            allowToastClose: true,
            hideAfter: 3000,
            stack: 5,
            position: {top: '60px', right: '30px'}
          });
        } else {
          $.toast({
            text : i18n.t('Mounting deactivated'),
            showHideTransition: 'fade',
            allowToastClose: true,
            hideAfter: 3000,
            stack: 5,
            position: {top: '60px', right: '30px'}
          });
        }
      }
    });
  }

  function editMounting(e) {
    var userId = $('td.user-tabs').attr('data-user');
    var rowId = $(e.target).attr('data-row');
    var field = $(e.target).attr('data-field');
    var value = $(e.target).val();

    $.post('/mynetwork/edit-mounting/' + userId, {
      field: field,
      rowId: rowId,
      value: value
    }, function(data) {
      if (data.status) {
        getUserHistory(userId)
        $.toast({
          text : i18n.t('Mounting changed'),
          showHideTransition: 'fade',
          allowToastClose: true,
          hideAfter: 3000,
          stack: 5,
          position: {top: '60px', right: '30px'}
        });
      }
    });
  }

  function editAdditionalParams() {
    var userId = $('td.user-tabs').attr('data-user');
    var paramName = $(this).attr('data-type');
    var isChecked = $(this).prop('checked');

    $.post('/mynetwork/set-user-additional-params/' + userId, {
      paramName: paramName,
      isChecked: isChecked
    }, function(data) {
      if (data.status) {
        getUserHistory(userId)
        $.toast({
          text : i18n.t('Permissions changed'),
          showHideTransition: 'fade',
          allowToastClose: true,
          hideAfter: 3000,
          stack: 5,
          position: {top: '60px', right: '30px'}
        });
      }
    });
  }

  /** ?? */
  function deleteUser(e) {
    e.preventDefault();

    var userId = $('td.user-tabs').attr('data-user');
    // $.post('/mynetwork/delete-user/' + userId, {}, function(data) {
    //   if (data.status) {
    //     window.location.reload();
    //   }
    // });
  }

  function avatarSelectHandler(evt) {
    var file = evt.target.files[0];
    var reader  = new FileReader();

    reader.onload = (function(theFile) {
      return function(e) {
        $('#option-user-avatar').attr('src', e.target.result);
      };
    })(file);

    reader.readAsDataURL(file);
  }

  function getUserHistory(userId) {
    $.get('/mynetwork/get-user-history/' + userId, function(userHistory) {
      if (userHistory.status) {
        $('#history-body').empty();
        if (userHistory.histories.length) {
          for (var i = 0, len = userHistory.histories.length; i < len; i++) {
            $('#history-body').append('<tr class="user-information_text">' +
                '<td class="user-information">' + userHistory.histories[i].parent + '</td>' +
                '<td class="">' +
                  '<span class="user-day">' +
                    ("0" + new Date(userHistory.histories[i].modified).getDate()).slice(-2) +
                    '.' + ("0" + (new Date(userHistory.histories[i].modified).getMonth() + 1)).slice(-2) +
                    '.' + new Date(userHistory.histories[i].modified).getFullYear() +
                  ' </span>' +
                  '<span class="user-time">' +
                    ("0" + new Date(userHistory.histories[i].modified).getHours()).slice(-2) +
                    ':' + ("0" + new Date(userHistory.histories[i].modified).getMinutes()).slice(-2) +
                  '</span>' +
                '</td>' +
                '<td class="user-information">' + userHistory.histories[i].type + '</td>' +
              '</tr>');
          }
        } else {
          $('#history-body').append('<tr class="user-information_text">' +
            '<td class="user-information" colspan="3" style="text-align: center;">' +
              i18n.t('History is missing') +
            '</td>' +
          '</tr>');
        }
      }
    });
  }

  function addNewMounting() {
    var userId = $('td.user-tabs').attr('data-user');
    $.post('/mynetwork/add-new-mounting/' + userId, {}, function(data) {
      if (data.status) {
        $('#mounting-type-table tbody').find('tr.mountings-empty').remove();
        $('#mounting-type-table tbody').append('<tr class="content-mounting-type-tr">' +
          '<td class="mounting-check-type-td">' +
            '<input class="mounting-active" ' +
              'type="checkbox" ' +
              'id="mounting-active-' + data.mounting.id + '" ' +
            'data-row="' + data.mounting.id + '">' +
            '<label for="mounting-active-' + data.mounting.id + '">' +
              '<span id="hide"></span>' +
            '<label>' +
          '</td>' +
          '<td class="mounting-title-type-td">' +
            '<input class="input-default mounting-edit" ' +
              'type="text" ' +
              'data-field="name" ' +
              'data-row="' + data.mounting.id + '" ' +
            'value="' + data.mounting.name + '">' +
          '</td>' +
          '<td class="mounting-select-type-td">' +
            '<select class="select-default mounting-edit" ' +
                'data-field="type" ' +
            'data-row="' + data.mounting.id + '">' +
              '<option value="1">' + i18n.t('Price per 1 construction') + '</option>' +
              '<option value="2">' + i18n.t('Price for 1 meter construction') + '</option>' +
              '<option value="3">' + i18n.t('Price for 1 mp construction') + '</option>' +
              '<option value="4">' + i18n.t('Price as a percent of the cost') + '</option>' +
            '</select>' +
          '</td>' +
          '<td class="mounting-price-type-td">' +
            '<input class="input-default mounting-edit" ' +
              'type="text" ' +
              'data-field="price" ' +
              'data-row="' + data.mounting.id + '" ' +
            'value="' + data.mounting.price + '">' +
          '</td>' +
        '</tr>');
        $('#mounting-type-table tbody').on('click', '.mounting-active', function(e) {
          e.stopImmediatePropagation();
          activateMountings(e);
        });

        $('#mounting-type-table tbody').on('change', '.mounting-edit', function(e) {
          e.stopImmediatePropagation();
          editMounting(e)
        });
      }
    });
  }

  function addNewDelivery(e) {
    var userId = $('td.user-tabs').attr('data-user');
    $.post('/mynetwork/add-new-delivery/' + userId, {}, function(data) {
      if (data.status) {
        $('#delivery-type-table tbody').find('tr.deliveries-empty').remove();
        $('#delivery-type-table tbody').append('<tr class="content-delivery-type-tr">' +
          '<td class="delivery-check-type-td">' +
            '<input class="delivery-active" ' +
              'type="checkbox" ' +
              'id="delivery-active-' + data.delivery.id + '" ' +
            'data-row="' + data.delivery.id + '">' +
            '<label for="delivery-active-' + data.delivery.id + '">' +
              '<span id="hide"></span>' +
            '<label>' +
          '</td>' +
          '<td class="delivery-title-type-td">' +
            '<input class="input-default delivery-edit" ' +
              'type="text" ' +
              'data-field="name" ' +
              'data-row="' + data.delivery.id + '" ' +
            'value="' + data.delivery.name + '">' +
          '</td>' +
          '<td class="delivery-select-type-td">' +
            '<select class="select-default delivery-edit" ' +
              'data-field="type" ' +
            'data-row="' + data.delivery.id + '">' +
              '<option value="1">' + i18n.t('Price per 1 construction') + '</option>' +
              '<option value="2">' + i18n.t('Price for 1 meter construction') + '</option>' +
              '<option value="3">' + i18n.t('Price for 1 mp construction') + '</option>' +
              '<option value="4">' + i18n.t('Price as a percent of the cost') + '</option>' +
            '</select>' +
          '</td>' +
          '<td class="delivery-price-type-td">' +
            '<input class="input-default delivery-edit" ' +
              'type="text" ' +
              'data-field="price" ' +
              'data-row="' + data.delivery.id + '" ' +
            'value="' + data.delivery.price + '">' +
          '</td>' +
        '</tr>');
        $('#delivery-type-table tbody').on('click', '.delivery-active', function(e) {
          e.stopImmediatePropagation();
          activateDeliveries(e);
        });

        $('#delivery-type-table tbody').on('change', '.delivery-edit', function(e) {
          e.stopImmediatePropagation();
          editDelivery(e)
        });
      }
    });
  }

  function editMountingsByDay(e) {
    var userId = $('td.user-tabs').attr('data-user');
    var field = $(e.target).attr('data-field');
    var value = $(e.target).val();

    $.post('/mynetwork/edit-mounting-by-day/' + userId, {
      field: field,
      value: value
    }, function(data) {
      if (data.status) {
        getUserHistory(userId);
        $.toast({
          text : i18n.t('The price of the installation is changed'),
          showHideTransition: 'fade',
          allowToastClose: true,
          hideAfter: 3000,
          stack: 5,
          position: {top: '60px', right: '30px'},
        });
      }
    });
  }

  function deactivateFactoryDelivery(e) {
    var userId = $('td.user-tabs').attr('data-user');
    var deliveryId = $(e.target).attr('data-row');
    var isChecked = $(e.target).prop('checked');

    $.post('/mynetwork/deactivate-factory-delivery/' + userId, {
      deliveryId: deliveryId,
      isChecked: isChecked
    }, function(data) {
      if (data.status) {
        if (!isChecked) {
          $.toast({
            text : i18n.t('Factory delivery is deactivated'),
            showHideTransition: 'fade',
            allowToastClose: true,
            hideAfter: 3000,
            stack: 5,
            position: {top: '60px', right: '30px'}
          });
        } else {
          $.toast({
            text : i18n.t('Factory delivery is activated'),
            showHideTransition: 'fade',
            allowToastClose: true,
            hideAfter: 3000,
            stack: 5,
            position: {top: '60px', right: '30px'}
          });
        }
      }
    });
  }

  function deactivateFactoryMounting(e) {
    var userId = $('td.user-tabs').attr('data-user');
    var mountingId = $(e.target).attr('data-row');
    var isChecked = $(e.target).prop('checked');

    $.post('/mynetwork/deactivate-factory-mounting/' + userId, {
      mountingId: mountingId,
      isChecked: isChecked
    }, function(data) {
      if (data.status) {
        if (!isChecked) {
          $.toast({
            text : i18n.t('Factory mounting is deactivated'),
            showHideTransition: 'fade',
            allowToastClose: true,
            hideAfter: 3000,
            stack: 5,
            position: {top: '60px', right: '30px'}
          });
        } else {
          $.toast({
            text : i18n.t('Factory mounting is activated'),
            showHideTransition: 'fade',
            allowToastClose: true,
            hideAfter: 3000,
            stack: 5,
            position: {top: '60px', right: '30px'}
          });
        }
      }
    });
  }

  /** Init popovers */
  $('.lighter-r').webuiPopover();

  /** Init datepickers */
  $("#calendar-from").ionCalendar({
    lang: "ru",
    sundayFirst: false,
    years: "80",
    format: "DD.MM.YYYY",
    onClick: function(date) {
      datepickerState = false;
      var dateTo = $("#date-to").val();
      var parsedDateFrom = date.split('.');
      var parsedDateTo = dateTo.split('.');

      var fromDate = new Date(parsedDateFrom[2], parsedDateFrom[1], parsedDateFrom[0]);
      var toDate = new Date(parsedDateTo[2], parsedDateTo[1], parsedDateTo[0]);

      if (fromDate > toDate) {
        $.toast({
          text : i18n.t('The start date can not exceed the final'),
          showHideTransition: 'fade',
          allowToastClose: true,
          hideAfter: 3000,
          stack: 5,
          position: {top: '60px', right: '30px'}
        });
      } else {
        $(".date-picker-from").hide();
        $("#date-from").val(date);
      }
    }
  });
  $("#calendar-to").ionCalendar({
    lang: "ru",
    sundayFirst: false,
    years: "80",
    format: "DD.MM.YYYY",
    onClick: function(date) {
      datepickerState = false;
      var dateFrom = $("#date-from").val();
      var parsedDateFrom = dateFrom.split('.');
      var parsedDateTo = date.split('.');

      var fromDate = new Date(parsedDateFrom[2], parsedDateFrom[1], parsedDateFrom[0]);
      var toDate = new Date(parsedDateTo[2], parsedDateTo[1], parsedDateTo[0]);
      if (toDate < fromDate) {
        $.toast({
          text : i18n.t('End date can not be less than the initial'),
          showHideTransition: 'fade',
          allowToastClose: true,
          hideAfter: 3000,
          stack: 5,
          position: {top: '60px', right: '30px'}
        });
      } else {
        $(".date-picker-to").hide();
        $("#date-to").val(date);
      }
    }
  });

  /** Date and Light filter buttons */
  $('.light-filter-btn').click(filterLighters);
  $('#ok-date-filter').click(rerenderWithParams);
  /** On/off filters */
  $('#on-filters').click(switchOnAllFilters);
  $('#off-filters').click(switchOffAllFilters);

  function filterLighters () {
    var _self = this;
    startLoader();
    $('.prefetched-data').css('opacity', '0.2');
    setTimeout(function () {
      $('.tbltree-expander').css('visibility', 'visible');
      var closestUser = $('.identificator-round.r-' + $(_self).val()).closest('tr.user-info');
      if ($(_self).prop('checked')) {
        closestUser.removeClass('hidden');
      } else {
        closestUser.addClass('hidden');
      }
      stopLoader();
      $('.prefetched-data').css('opacity', '1');
      $('tr.user-info').find('.user-expander').each(function (i) {
        var userId = $(this).closest('tr.user-info').attr('data-user-id');
        $('tr.user-info[row-id*="' + userId + '."][data-user-id!=' + userId + ']').addClass('hidden');
      });
    }, 300);
  }

  function _updateFilteredDate () {
    $('.light-filter-btn:not(:checked)').each(function () {
      $('.identificator-round.r-' + $(this).val()).closest('tr.user-info').addClass('hidden');
    });
  }

  function switchOnAllFilters (e) {
    e.preventDefault();

    var _self = this;
    startLoader();
    $('.prefetched-data').css('opacity', '0.2');
    setTimeout(function () {
      $('.light-filter-btn').prop('checked', true);
      $('.tbltree-expander').css('visibility', 'visible');
      $('.identificator-round').each(function () {
        var closestUser = $(this).closest('tr.user-info');
        if (closestUser.attr('row-id') === '1') return;
        closestUser.show();
      });
      stopLoader();
      $('.prefetched-data').css('opacity', '1');
    }, 300);
  }

  function switchOffAllFilters (e) {
    e.preventDefault();

    var _self = this;
    startLoader();
    $('.prefetched-data').css('opacity', '0.2');
    setTimeout(function () {
      $('.light-filter-btn').prop('checked', false);
      $('.tbltree-expander').css('visibility', 'hidden');
      $('.identificator-round').each(function () {
        var closestUser = $(this).closest('tr.user-info');
        if (closestUser.attr('row-id') === '1') return;
        closestUser.hide();
      });
      stopLoader();
      $('.prefetched-data').css('opacity', '1');
    }, 300);
  }

  function rerenderWithParams () {
    var lights = [];
    $('.light-filter-btn:checked').each(function() {
      lights.push($(this).val());
    });
    var from = $('#date-from').val();
    var to = $('#date-to').val();

    window.location.href = '/mynetwork?from=' + from + '&to=' + to + '&lights=' + lights.join();
  }

  function handleSaveUser (data) {
    if (data.status) {
      var querySelector = 'tr.user-info[data-user-id="' + data.userId + '"] ';
      var identificatorId = $('input[name="identificator"]:checked', '#edit-user-form').val();
      var avatarSrc = $('img#option-user-avatar').attr('src');
      var userName = $('#option-user-name').val();

      if (parseInt(data.identificators.prev, 10) !== parseInt(data.identificators.new, 10)) {
        $(querySelector + '.identificator-round')
          .removeClass('r-' + data.identificators.prev)
          .addClass('r-' + data.identificators.new);
        if (parseInt(data.userId, 10) !== parseInt($('#users-table').attr('data-user'), 10)) {
          __recalculateIdentificators(data.identificators);
        }
      }

      $(querySelector + '.user-name').text(userName);
      $(querySelector + 'img.user-avatar').attr('src', avatarSrc);

      $.toast({
        text : i18n.t('Changes saved'),
        showHideTransition: 'fade',
        allowToastClose: true,
        hideAfter: 3000,
        stack: 5,
        position: {top: '60px', right: '30px'}
      });
    }
  }

  var totalCounterSelector = '.lights-total-counter.lighter-group-';

  function __recalculateIdentificators (identificators) {
    var _prev = identificators.prev;
    var _new = identificators.new;

    $('#counter-r-' + _prev).text(parseInt($('#counter-r-' + _prev).text(), 10) - 1);
    $('#counter-r-' + identificators.new).text(parseInt($('#counter-r-' + identificators.new).text(), 10) + 1);

    if ([1, 2].indexOf(parseInt(_prev, 10)) >= 0) {
      $(totalCounterSelector + 1).text(parseInt($(totalCounterSelector + 1).text(), 10) - 1);
    } else if ([3, 4, 5, 6, 7, 8, 9, 14].indexOf(parseInt(_prev, 10)) >= 0) {
      $(totalCounterSelector + 2).text(parseInt($(totalCounterSelector + 2).text(), 10) - 1);
    } else {
      $(totalCounterSelector + 3).text(parseInt($(totalCounterSelector + 3).text(), 10) - 1);
    }

    if ([1, 2].indexOf(parseInt(_new, 10)) >= 0) {
      $(totalCounterSelector + 1).text(parseInt($(totalCounterSelector + 1).text(), 10) + 1);
    } else if ([3, 4, 5, 6, 7, 8, 9, 14].indexOf(parseInt(_new, 10)) >= 0) {
      $(totalCounterSelector + 2).text(parseInt($(totalCounterSelector + 2).text(), 10) + 1);
    } else {
      $(totalCounterSelector + 3).text(parseInt($(totalCounterSelector + 3).text(), 10) + 1);
    }
  }

  function getUserData (e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    e.stopPropagation();

    startLoader();
    $(".user-tabs").remove();
    var userId = $(this).attr('data-user');
    var rowId = $(this).attr('data-row');
    var optionRow = 'tr.user-option[data-row="' + rowId + '"]';
    $(optionRow).append($('#test').html());
    $.get('/services/get-countries', function(dataCountries) {
      if (dataCountries.status) {
        $.get('/mynetwork/get-user/' + userId, function(data) {
          if (data.status) {
            var PARENT_ID = data.user.parent_id;
            var USER_TABLE = $('#users-table').attr('data-user');

            if (data.factoryFolders.length) {
              for (var ffi = 0, lenFfi = data.factoryFolders.length; ffi < lenFfi; ffi++) {
                $('select#option-user-export-folder').append('<option value="' + data.factoryFolders[ffi].id + '">' +
                  data.factoryFolders[ffi].name +
                '</option>');
              }
            }

            $('select#option-user-export-folder').val(data.user.export_folder);

            $.get('/services/get-location/' + data.userLocation[0].region.id +
                '/' + data.userLocation[0].region.country_id,
              function(dataLocations) {
                var shortId = (data.user.short_id ? data.user.short_id : '--');

                $('input.user-base-info#color_in_' + data.user.identificator).prop('checked', true);

                $('#edit-user-form').on('submit', function(e) {
                  e.preventDefault();
                  var formData = new FormData(this);

                  $.ajax({
                    type:'POST',
                    url: $(this).attr('action'),
                    data: formData,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: handleSaveUser,
                    error: function(data){
                      console.log("error");
                      console.log(data);
                    }
                  });
                });

                $('#edit-user-form').attr('action', '/mynetwork/user/save/' + data.user.id);

                if (parseInt(USER_TABLE, 10) === data.user.id && data.user.user_type === 7) {
                  $('ul.lc-list > li').show();
                  $('ul.add-el-list > li').show();
                  setAccesses(false);
                } else if (parseInt(PARENT_ID, 10) == parseInt(USER_TABLE, 10)) {
                  showParentAccesses();
                  setAccesses(true);
                } else {
                  setAccesses(false);
                }

                function setAccesses(access) {
                  for (var q = 0, len0 = data.userAccess.length; q < len0; q++) {
                    switch (data.userAccess[q].menu_id) {
                      case 1:
                        $('#glass-calc-cb').prop('checked', true).parent().show();
                        break;
                      case 2:
                        $('#instalment-cb').prop('checked', true).parent().show();
                        break;
                      case 3:
                        $('#my-network-cb').prop('checked', true).parent().show();
                        break;
                      case 4:
                        $('#mail-cb').prop('checked', true).parent().show();
                        break;
                      case 5:
                        $('#orders-history-cb').prop('checked', true).parent().show();
                        break;
                      case 6:
                        $('#documents-cb').prop('checked', true).parent().show();
                        break;
                      case 7:
                        $('#metering-cb').prop('checked', true).parent().show();
                        break;
                      case 8:
                        $('#profile-order-cb').prop('checked', true).parent().show();
                        break;
                      case 9:
                        $('#production-cb').prop('checked', true).parent().show();
                        break;
                      case 10:
                        $('#base-cb').prop('checked', true).parent().show();
                        break;
                      case 11:
                        $('#analitycs-cb').prop('checked', true).parent().show();
                        break;
                    }
                  }

                  if (data.user.is_payer === 1) {
                    $('#payer-cb').prop('checked', true).parent().show();
                  }
                  if (data.user.is_employee === 0) {
                    $('#employee-cb').prop('checked', true).parent().show();
                  }
                  if (data.user.is_buch === 1) {
                    $('#buch-cb').prop('checked', true).parent().show();
                  }
                  if (data.user.is_to === 1) {
                    $('#to-cb').prop('checked', true).parent().show();
                  }
                  if (data.user.is_all_calcs === 1) {
                    $('#all-calcs-cb').prop('checked', true).parent().show();
                  }

                  if (access) {
                    $('input.edit-add-params').prop('disabled', false);
                    $('input.lc-rights').prop('disabled', false);
                  }
                }

                function showParentAccesses() {
                  data.parentAccesses.map(function(accessId) {
                    $('input.lc-rights[data-type="' + accessId + '"]').prop('disabled', false).parent().show();
                  });

                  for (var prntType in data.parentTypes) {
                    if (data.parentTypes[prntType] === 1 && prntType !== 'is_employee') {
                      $('input.edit-add-params[data-type="' + prntType + '"]').prop('disabled', false).parent().show();
                    } else if (data.parentTypes[prntType] === 0 && prntType === 'is_employee') {
                      $('input.edit-add-params[data-type="' + prntType + '"]').prop('disabled', false).parent().show();
                    }
                  }
                }

                for (var i = 0, len = dataCountries.countries.length; i < len; i++) {
                  $(optionRow).find('#option-user-country').append('<option ' +
                    'value="' + dataCountries.countries[i].id + '">' +
                      dataCountries.countries[i].name +
                  '</option>');
                }

                for (var j = 0, len2 = dataLocations.regions.length; j < len2; j++) {
                  $(optionRow).find('#option-user-region').append('<option ' +
                    'value="' + dataLocations.regions[j].id + '">' +
                      dataLocations.regions[j].name +
                  '</option>');
                }

                for (var k = 0, len3 = dataLocations.cities.length; k < len3; k++) {
                  $(optionRow).find('#option-user-city').append('<option ' +
                    'value="' + dataLocations.cities[k].id + '">' +
                      dataLocations.cities[k].name +
                  '</option>');
                }

                $('td.user-tabs').attr('data-user', userId);
                $('#close-options').click(closeOptions);
                $('#option-user-avatar').attr('src', data.user.avatar);
                $('#option-user-id').val(shortId);
                $('#option-user-name').val(data.user.name);
                $('#option-user-contact-name').val(data.user.contact_name);
                $('#option-user-mob-phone').val(data.user.phone);
                $('#option-user-code-sync').val(data.user.code_sync);
                $('#option-user-password').attr('data-id', data.user.id);
                $('#option-user-email').val(data.user.email);
                $('#option-user-city-phone').val(data.user.city_phone);
                $('#option-user-fax').val(data.user.fax);
                $('#option-user-address').val(data.user.address);
                $('#option-user-director').val(data.user.director);
                $('#option-user-legal-name').val(data.user.legal_name);
                $('#option-user-inn').val(data.user.inn);
                $('#option-user-okpo').val(data.user.okpo);
                $('#option-user-mfo').val(data.user.mfo);
                $('#option-user-bank').val(data.user.bank_name);
                $('#option-user-bank-acc').val(data.user.bank_acc_no);
                $('#option-user-country').val(data.userLocation[0].region.country_id);
                $('#option-user-region').val(data.userLocation[0].region.id);
                $('#option-user-city').val(data.user.city_id);
                $('.option-save').attr('data-user', userId);
                $('#save-discount').attr('data-user', userId);

                /** add event listeners */
                $('#option-user-country').change(onCountriesChange);
                $('#option-user-region').change(onRegionsChange);
                $('.option-save').click(saveUser);
                $('.lc-rights').click(setUserRights);
                //$('.delivery-active').click(activateDeliveries);
                //$('.delivery-edit').change(editDelivery);
                //$('.mounting-active').click(activateMountings);
                $('.edit-add-params').click(editAdditionalParams);

                if (parseInt(USER_TABLE, 10) === data.user.id) {
                  $('tr.add-mounting').click(addNewMounting);
                  $('tr.add-delivery').click(addNewDelivery);
                }

                if (parseInt(USER_TABLE, 10) !== data.user.id) {
                  $('input.mounting-day-edit').prop('disabled', true);
                  if (parseInt(PARENT_ID, 10) !== parseInt(USER_TABLE, 10)) {
                    $('.user-base-info').prop('disabled', true);
                  }
                }

                if (parseInt(USER_TABLE, 10) !== parseInt(data.user.id, 10)) {
                  $('.user-base-info').prop('disabled', false);
                }

                if (parseInt(USER_TABLE, 10) !== data.user.id && parseInt(PARENT_ID, 10) !== parseInt(USER_TABLE, 10)) {
                  $('#change-avatar').click(function(e) { e.preventDefault(); });
                  $('#delete-user').click(function(e) { e.preventDefault(); });
                  $('#save-discount').click(function(e) { e.preventDefault(); });
                } else {
                  $('#change-avatar').click(changeAvatar);
                  $('#avatar-input').change(avatarSelectHandler);
                  $('#delete-user').click(deleteUser);
                  $('#save-discount').click(saveUserDiscounts);
                }

                if (parseInt(USER_TABLE, 10) === parseInt(PARENT_ID, 10) || parseInt(USER_TABLE, 10) === data.user.id && data.user.user_type === 7) {
                  $('#option-user-mob-phone').prop('disabled', false);
                }

                if (parseInt(USER_TABLE, 10) !== parseInt(PARENT_ID, 10)) {
                  $('.discount-edit-input').prop('disabled', true);
                }

                if (parseInt(USER_TABLE, 10) === data.user.id && data.user.user_type === 7) {
                  $('.discount-edit-input').prop('disabled', false);
                }

                if (parseInt(USER_TABLE, 10) === parseInt(data.user.id, 10) && $('table#users-table').attr('data-user-type') == 7 || parseInt(USER_TABLE, 10) === parseInt(PARENT_ID, 10) && $('table#users-table').attr('data-user-type') == 7) {
                  $('.lighter-r.pro_lighter').css('display', 'inline-block');
                  //$('.lighter-r.pro_lighter input.user-base-info').prop('disabled', false);
                } else {
                  $('.lighter-r.pro_lighter').css('display', 'none');
                  //$('.lighter-r.pro_lighter input.user-base-info').prop('disabled', true);
                }

                if (parseInt(USER_TABLE, 10) === parseInt(PARENT_ID, 10) || parseInt(USER_TABLE, 10) === parseInt(data.user.id, 10) && $('table#users-table').attr('data-user-type') == 7) {
                  $('.editable-identificator').css('display', 'inline-block');
                  $('.default_lighter').css('display', 'inline-block');
                } else {
                  $('.editable-identificator').hide();
                  $('.default_lighter').hide();
                }
                /** User is available to set own default mountings */
                if (parseInt(USER_TABLE, 10) === parseInt(data.user.id, 10)) {
                  $('#option-discount-default-const').prop('disabled', false);
                  $('#option-discount-default-add-elem').prop('disabled', false);
                  $('#save-discount').prop('disabled', false);
                }

                // if ($('table#users-table').attr('data-user-type') === 7 && )

                $('input.mounting-day-edit').change(editMountingsByDay);

                $('.lighter-r.r-' + data.user.identificator)
                  .css('display', 'inline-block');

                if (data.childs.length) {
                  $('#option-move-user').change(function(e) {
                    $('#option-move-user-hidder').val($(this).val());
                  });
                  $('#option-move-user').find('option').remove();
                  for (var v = 0; v < data.childs.length; v++) {
                    $('#option-move-user').append('<option ' +
                      'value="' + data.childs[v].id + '">' + data.childs[v].name +
                    '</option>');
                    if (v === data.childs.length - 1) {
                      $('#option-move-user').append('<option value="0" disabled>-----------</option>');
                    }
                  }

                  if (data.userParent) {
                    $('#option-move-user').append('<option ' +
                      'value="' + data.userParent.id + '">' + data.userParent.name +
                    '</option>');
                    $('#option-move-user').append('<option value="0" disabled>-----------</option>');
                  }
                  for (var c = 0; c < data.neighborhoods.length; c++) {
                    $('#option-move-user').append('<option ' +
                      'value="' + data.neighborhoods[c].id + '">' + data.neighborhoods[c].name +
                    '</option>');
                    if (c === data.neighborhoods.length - 1) {
                      $('#option-move-user').append('<option value="0" disabled>-----------</option>');
                    }
                  }
                  $('#option-move-user').val(data.user.parent_id);
                  $('#option-move-user-hidder').val(data.user.parent_id);
                  $('.move-user').show();
                } else {
                  $('.move-user').hide();
                }
                $('.user-tabs').show();

                if (parseInt(USER_TABLE, 10) !== parseInt(PARENT_ID, 10) && parseInt(USER_TABLE, 10) !== parseInt(data.user.id, 10)) {
                  $('.user-base-info').prop('disabled', true);
                }
            });
            $.get('/mynetwork/get-user-discounts/' + userId, function(userDiscounts) {
              if (userDiscounts.status) {
                var disabled;

                if (PARENT_ID == USER_TABLE || PARENT_ID == 0) {
                  disabled = false;
                } else {
                  disabled = true;
                }

                $('#option-discount-max-const').val(userDiscounts.discounts.max_construct).prop('disabled', disabled);
                $('#option-discount-max-add-elem').val(userDiscounts.discounts.max_add_elem).prop('disabled', disabled);
                $('#option-discount-default-const').val(userDiscounts.discounts.default_construct);
                $('#option-discount-default-add-elem').val(userDiscounts.discounts.default_add_elem);
                $('#option-discount-week1-const').val(userDiscounts.discounts.week_1_construct);
                $('#option-discount-week1-add-elem').val(userDiscounts.discounts.week_1_add_elem);
                $('#option-discount-week2-const').val(userDiscounts.discounts.week_2_construct);
                $('#option-discount-week2-add-elem').val(userDiscounts.discounts.week_2_add_elem);
                $('#option-discount-week3-const').val(userDiscounts.discounts.week_3_construct);
                $('#option-discount-week3-add-elem').val(userDiscounts.discounts.week_3_add_elem);
                $('#option-discount-week4-const').val(userDiscounts.discounts.week_4_construct);
                $('#option-discount-week4-add-elem').val(userDiscounts.discounts.week_4_add_elem);
                $('#option-discount-week5-const').val(userDiscounts.discounts.week_5_construct);
                $('#option-discount-week5-add-elem').val(userDiscounts.discounts.week_5_add_elem);
                $('#option-discount-week6-const').val(userDiscounts.discounts.week_6_construct);
                $('#option-discount-week6-add-elem').val(userDiscounts.discounts.week_6_add_elem);
                $('#option-discount-week7-const').val(userDiscounts.discounts.week_7_construct);
                $('#option-discount-week7-add-elem').val(userDiscounts.discounts.week_7_add_elem);
                $('#option-discount-week8-const').val(userDiscounts.discounts.week_8_construct);
                $('#option-discount-week8-add-elem').val(userDiscounts.discounts.week_8_add_elem);
                /** User is available to set own default mountings */
                if (parseInt(USER_TABLE, 10) === parseInt(data.user.id, 10)) {
                  $('#option-discount-default-const').prop('disabled', false);
                  $('#option-discount-default-add-elem').prop('disabled', false);
                }
              }
            });

            $.get('/mynetwork/get-user-deliveries/' + userId, function(userDeliveries) {
              if (userDeliveries.status) {
                if (userDeliveries.factoryDeliveries && userDeliveries.factoryDeliveries.length) {
                  for (var i = 0, len = userDeliveries.factoryDeliveries.length; i < len; i++) {
                    $('#delivery-type-table tbody').append('<tr class="content-delivery-type-factory-tr">' +
                      '<td class="delivery-check-type-td">' +
                        '<input class="deactivate-factory-delivery" ' +
                          'type="checkbox" ' +
                          'id="delivery-active-' + userDeliveries.factoryDeliveries[i].id + '" ' +
                          'data-row="' + userDeliveries.factoryDeliveries[i].id + '" ' +
                        'checked>' +
                        '<label for="delivery-active-' + userDeliveries.factoryDeliveries[i].id + '">' +
                          '<span id="hide"></span>' +
                        '<label>' +
                      '</td>' +
                      '<td class="delivery-title-type-td">' +
                        '<input class="input-default" ' +
                          'type="text" ' +
                          'data-field="name" ' +
                          'data-row="' + userDeliveries.factoryDeliveries[i].id + '" ' +
                          'value="' + userDeliveries.factoryDeliveries[i].name + '" ' +
                        'disabled>' +
                      '</td>' +
                      '<td class="delivery-select-type-td">' +
                        '<select class="select-default" ' +
                            'data-field="type" ' +
                            'data-row="' + userDeliveries.factoryDeliveries[i].id + '" ' +
                        'disabled>' +
                          '<option value="1">' + i18n.t('Price per 1 construction') + '</option>' +
                          '<option value="2">' + i18n.t('Price for 1 meter construction') + '</option>' +
                          '<option value="3">' + i18n.t('Price for 1 mp construction') + '</option>' +
                          '<option value="4">' + i18n.t('Price as a percent of the cost') + '</option>' +
                        '</select>' +
                      '</td>' +
                      '<td class="delivery-price-type-td">' +
                        '<input class="input-default" ' +
                          'type="text" ' +
                          'data-field="price" ' +
                          'data-row="' + userDeliveries.factoryDeliveries[i].id +'" ' +
                          'value="' + userDeliveries.factoryDeliveries[i].price + '" ' +
                        'disabled>' +
                      '</td>' +
                    '</tr>');
                    $('#delivery-type-table tbody select[data-row="' + userDeliveries.factoryDeliveries[i].id + '"]').val(userDeliveries.factoryDeliveries[i].type);
                    if (userDeliveries.dDeliveries.indexOf(userDeliveries.factoryDeliveries[i].id) >= 0) {
                      $('#delivery-active-' + userDeliveries.factoryDeliveries[i].id).prop('checked', false);
                    }
                    if (parseInt(USER_TABLE, 10) !== data.user.id) {
                      $('input.deactivate-factory-delivery').prop('disabled', true);
                    }
                  }
                  $('#delivery-type-table tbody').on('click', '.deactivate-factory-delivery', function(e) {
                    e.stopImmediatePropagation();
                    deactivateFactoryDelivery(e);
                  });
                }
                if (userDeliveries.deliveries && userDeliveries.deliveries.length) {
                  for (var i = 0, len = userDeliveries.deliveries.length; i < len; i++) {
                    $('#delivery-type-table tbody').append('<tr class="content-delivery-type-tr">' +
                      '<td class="delivery-check-type-td">' +
                        '<input class="delivery-active" ' +
                          'type="checkbox" ' +
                          'id="delivery-active-' + userDeliveries.deliveries[i].id + '" ' +
                        'data-row="' + userDeliveries.deliveries[i].id + '">' +
                        '<label for="delivery-active-' + userDeliveries.deliveries[i].id + '"><span id="hide"></span><label>' +
                      '</td>' +
                      '<td class="delivery-title-type-td">' +
                        '<input class="input-default delivery-edit" ' +
                          'type="text" ' +
                          'data-field="name" ' +
                          'data-row="' + userDeliveries.deliveries[i].id + '" ' +
                        'value="' + userDeliveries.deliveries[i].name + '">' +
                      '</td>' +
                      '<td class="delivery-select-type-td">' +
                        '<select class="select-default delivery-edit" ' +
                            'data-field="type" ' +
                          'data-row="' + userDeliveries.deliveries[i].id + '">' +
                          '<option value="1">' + i18n.t('Price per 1 construction') + '</option>' +
                          '<option value="2">' + i18n.t('Price for 1 meter construction') + '</option>' +
                          '<option value="3">' + i18n.t('Price for 1 mp construction') + '</option>' +
                          '<option value="4">' + i18n.t('Price as a percent of the cost') + '</option>' +
                          '<option value="5">' + i18n.t('Price per order') + '</option>' +
                        '</select>' +
                      '</td>' +
                      '<td class="delivery-price-type-td">' +
                        '<input class="input-default delivery-edit" ' +
                          'type="text" ' +
                          'data-field="price" ' +
                          'data-row="' + userDeliveries.deliveries[i].id + '" ' +
                        'value="' + userDeliveries.deliveries[i].price + '">' +
                      '</td>' +
                    '</tr>');
                    $('#delivery-type-table tbody select[data-row="' + userDeliveries.deliveries[i].id + '"]').val(userDeliveries.deliveries[i].type);
                    if (userDeliveries.deliveries[i].active === 1) {
                      $('#delivery-active-' + userDeliveries.deliveries[i].id).prop('checked', true);
                    }
                    if (parseInt(USER_TABLE, 10) !== data.user.id) {
                      $('input.delivery-active, input.delivery-edit, select.delivery-edit').prop('disabled', true);
                    }
                  }
                  $('#delivery-type-table tbody').on('click', '.delivery-active', function(e) {
                    e.stopImmediatePropagation();
                    activateDeliveries(e);
                  });

                  $('#delivery-type-table tbody').on('change', '.delivery-edit', function(e) {
                    e.stopImmediatePropagation();
                    editDelivery(e)
                  });
                } else {
                  $('#delivery-type-table tbody').append('<tr class="content-delivery-type-tr deliveries-empty">' +
                    '<td colspan="4">' +
                      i18n.t('Types of deliveries are missing') +
                    '</td>' +
                  '</tr>');
                }
              }
            });
            $.get('/mynetwork/get-user-mountings/' + userId, function(userMountings) {
              if (userMountings.status) {
                $('#mounting-mon').val(data.user.mount_mon);
                $('#mounting-tue').val(data.user.mount_tue);
                $('#mounting-wed').val(data.user.mount_wed);
                $('#mounting-thu').val(data.user.mount_thu);
                $('#mounting-fri').val(data.user.mount_fri);
                $('#mounting-sat').val(data.user.mount_sat);
                $('#mounting-sun').val(data.user.mount_sun);
                if (userMountings.factoryMountings && userMountings.factoryMountings.length) {
                  for (var i = 0, len = userMountings.factoryMountings.length; i < len; i++) {
                    $('#mounting-type-table tbody').append('<tr class="content-mounting-type-factory-tr">' +
                      '<td class="mounting-check-type-td">' +
                        '<input class="deactivate-factory-mounting" ' +
                          'type="checkbox" ' +
                          'id="mounting-active-' + userMountings.factoryMountings[i].id + '" ' +
                          'data-row="' + userMountings.factoryMountings[i].id + '" ' +
                        'checked>' +
                        '<label for="mounting-active-' + userMountings.factoryMountings[i].id + '">' +
                          '<span id="hide"></span>' +
                        '<label>' +
                      '</td>' +
                      '<td class="mounting-title-type-td">' +
                        '<input class="input-default mounting-edit" ' +
                          'type="text" ' +
                          'data-field="name" ' +
                          'data-row="' + userMountings.factoryMountings[i].id + '" ' +
                          'value="' + userMountings.factoryMountings[i].name + '" ' +
                        'disabled>' +
                      '</td>' +
                      '<td class="mounting-select-type-td">' +
                        '<select class="select-default mounting-edit" ' +
                            'data-field="type" ' +
                            'data-row="' + userMountings.factoryMountings[i].id + '" ' +
                        'disabled>' +
                          '<option value="1">' + i18n.t('Price per 1 construction') + '</option>' +
                          '<option value="2">' + i18n.t('Price for 1 meter construction') + '</option>' +
                          '<option value="3">' + i18n.t('Price for 1 mp construction') + '</option>' +
                          '<option value="4">' + i18n.t('Price as a percent of the cost') + '</option>' +
                        '</select>' +
                      '</td>' +
                      '<td class="mounting-price-type-td">' +
                        '<input class="input-default mounting-edit" ' +
                          'type="text" ' +
                          'data-field="price" ' +
                          'data-row="' + userMountings.factoryMountings[i].id + '" ' +
                          'value="' + userMountings.factoryMountings[i].price + '" ' +
                        'disabled>' +
                      '</td>' +
                    '</tr>');
                    $('#mounting-type-table tbody select[data-row="' + userMountings.factoryMountings[i].id + '"]').val(userMountings.factoryMountings[i].type);
                    if (userMountings.dMountings.indexOf(userMountings.factoryMountings[i].id) >= 0) {
                      $('#mounting-active-' + userMountings.factoryMountings[i].id).prop('checked', false);
                    }
                    if (parseInt(USER_TABLE, 10) !== data.user.id) {
                      $('input.deactivate-factory-mounting').prop('disabled', true);
                    }
                  }
                  $('#mounting-type-table tbody').on('click', '.deactivate-factory-mounting', function(e) {
                    e.stopImmediatePropagation();
                    deactivateFactoryMounting(e);
                  });
                }
                if (userMountings.mountings && userMountings.mountings.length) {
                  for (var i = 0, len = userMountings.mountings.length; i < len; i++) {
                    $('#mounting-type-table tbody').append('<tr class="content-mounting-type-tr">' +
                      '<td class="mounting-check-type-td">' +
                        '<input class="mounting-active" ' +
                          'type="checkbox" ' +
                          'id="mounting-active-' + userMountings.mountings[i].id + '" ' +
                        'data-row="' + userMountings.mountings[i].id + '">' +
                        '<label for="mounting-active-' + userMountings.mountings[i].id + '">' +
                          '<span id="hide"></span>' +
                        '<label>' +
                      '</td>' +
                      '<td class="mounting-title-type-td">' +
                        '<input class="input-default mounting-edit" ' +
                          'type="text" ' +
                          'data-field="name" ' +
                          'data-row="' + userMountings.mountings[i].id + '" ' +
                        'value="' + userMountings.mountings[i].name + '">' +
                      '</td>' +
                      '<td class="mounting-select-type-td">' +
                        '<select class="select-default mounting-edit" ' +
                          'data-field="type" ' +
                        'data-row="' + userMountings.mountings[i].id + '">' +
                        // tyta
                          '<option value="1">' + i18n.t('Price per 1 construction') + '</option>' +
                          '<option value="2">' + i18n.t('Price for 1 meter construction') + '</option>' +
                          '<option value="3">' + i18n.t('Price for 1 mp construction') + '</option>' +
                          '<option value="4">' + i18n.t('Price as a percent of the cost') + '</option>' +
                        '</select>' +
                      '</td>' +
                      '<td class="mounting-price-type-td">' +
                        '<input class="input-default mounting-edit" ' +
                          'type="text" ' +
                          'data-field="price" ' +
                          'data-row="' + userMountings.mountings[i].id + '" ' +
                        'value="' + userMountings.mountings[i].price + '">' +
                      '</td>' +
                    '</tr>');
                    $('#mounting-type-table tbody select[data-row="' + userMountings.mountings[i].id + '"]').val(userMountings.mountings[i].type);
                    if (userMountings.mountings[i].active === 1) {
                      $('#mounting-active-' + userMountings.mountings[i].id).prop('checked', true);
                    }
                    if (parseInt(USER_TABLE, 10) !== data.user.id) {
                      $('input.mounting-active, input.mounting-edit, select.mounting-edit').prop('disabled', true);
                    }
                  }
                  $('#mounting-type-table tbody').on('click', '.mounting-active', function(e) {
                    e.stopImmediatePropagation();
                    activateMountings(e);
                  });

                  $('#mounting-type-table tbody').on('change', '.mounting-edit', function(e) {
                    e.stopImmediatePropagation();
                    editMounting(e)
                  });

                } else {
                  $('#mounting-type-table tbody').append('<tr ' +
                      'class="content-mounting-type-tr mountings-empty">' +
                    '<td colspan="4">' +
                      i18n.t('Types of installations are missing') +
                    '</td>' +
                  '</tr>');
                }
              }
            });
            stopLoader();
            getUserHistory(userId);

            $('input#option-user-password').click(resetUserPasswordPopup);

            if (parseInt(USER_TABLE, 10) !== parseInt(PARENT_ID, 10)) {
              $('.del-user').hide();
            }

            if (parseInt(USER_TABLE, 10) !== parseInt(PARENT_ID, 10) && parseInt(USER_TABLE, 10) !== parseInt(data.user.id, 10)) {
              $('.user-base-info').prop('disabled', true);
            }

          } else {

          }
        });
      }
    });
  }

  function init () {
    var lights = [];

    var userId = $('#users-table').attr('data-user');
    var _from = $('#date-from').val();
    var _to = $('#date-to').val();

    $('.light-filter-btn:checked').each(function() {
      lights.push($(this).val());
    });

    $.get('/mynetwork/users/' + userId + '?from=' + _from + '&to=' + _to + '&lights=' + lights, function (data) {
      if (data.status) {
        var parentTR = '<tr row-id="1" ' +
          'data-user-id="' + data.parent.id + '" ' +
          'class="user-info lvl-1">' +
            '<td>' +
              '<div class="user-info_pic1">' +
                '<img src="' + data.parent.avatar + '" class="user-avatar">' +
              '</div>' +
              '<span class="user-name">' +
                data.parent.name +
              '</span>' +
            '</td>' +
            '<td class="data">' +
              '<div class="right_cell">' +
                '<img src="/assets/images/23.png" alt="" class="user-info_pic2" id="add-user-icon">' +
                '<img src="/assets/images/22.png" alt="" data-row="1" data-user="' + data.parent.id + '" class="user-info_pic3">' +
                '<div class="identificator-round r-' + data.parent.identificator + '"></div>' +
              '</div>' +
            '</td>' +
            '<td class="data">' +
              '<span class="user-day">' +
                + ('0' + new Date(data.parent.updated_at).getDate()).slice(-2) + '.' +
                + ('0' + (new Date(data.parent.updated_at).getMonth() + 1)).slice(-2) + '.' +
                + new Date(data.parent.updated_at).getFullYear() +
              '</span> ' +
              '<span class="user-time">' +
                + ('0' + new Date(data.parent.updated_at).getHours()).slice(-2) + ':' +
                + ('0' + (new Date(data.parent.updated_at).getMinutes() + 1)).slice(-2) +
              '</span>' +
            '</td>' +
        '</tr>' +
        '<tr class="user-option" data-user-id="' + data.parent.id + '" data-row="1">' +
        '</tr>';

        $('#users-table tbody').append(parentTR);

        if (data.users.fulfillmentValue && data.users.fulfillmentValue.length) {
          $('<span class="user-action user-expander has-childs"></span>').insertBefore('tr[data-user-id="' + data.parent.id + '"] .user-info_pic1');
          buildParentNetwork(data.users.fulfillmentValue, data.parent.id, data.parent.id, 2);
        } else {
          $('<span class="user-childs-empty"></span>').insertBefore('tr[data-user-id="' + data.parent.id + '"] .user-info_pic1');
        }

        $('span.user-action').click(actionLvl);
        $(".user-info_pic3").click(getUserData);
        $('#add-user-icon').click(function() {
          window.location.href = '/mynetwork/add_user';
        });

        $("#users-table tbody.prefetched-data").show();
        $('tr.users-preload').hide();
      }
    });
  }

  function actionLvl (e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    e.stopPropagation();
    
    var $parent = $(this).closest('tr.user-info');
    var parentId = $parent.attr('data-user-id');
    var rowId = $parent.attr('row-id');
    var lvlIndex = $parent.attr('class').indexOf('lvl-');
    var lvlId = parseInt($parent.attr('class').substring(lvlIndex + 4, lvlIndex + 5), 10) + 1;

    if ($(this).hasClass('user-expander')) {
      if (!$(this).hasClass('has-childs')) return expandLvl($(this), parentId, rowId, lvlId);
      $('tr.user-info[row-id*="' + parentId + '."]').removeClass('hidden');
      $(this).removeClass('user-expander').addClass('user-collapser');
      $('tr.user-info').find('.user-expander').each(function (i) {
        var userId = $(this).closest('tr.user-info').attr('data-user-id');
        $('tr.user-info[row-id*="' + userId + '."][data-user-id!=' + userId + ']').addClass('hidden');
      });
      _updateFilteredDate();
    } else { 
      $('tr.user-info[row-id*="' + parentId + '."][data-user-id!=' + parentId + ']').addClass('hidden');
      $(this).removeClass('user-collapser').addClass('user-expander');
    }
  }

  function expandLvl ($element, parentId, rowId, lvlId) {
    var lights = [];
    var _from = $('#date-from').val();
    var _to = $('#date-to').val();

    $('.light-filter-btn:checked').each(function() {
      lights.push($(this).val());
    });

    $.get('/mynetwork/childs/' + parentId + '?from=' + _from + '&to=' + _to + '&lights=' + lights, function (data) {
      if (data.status) {
        if (data.users.fulfillmentValue && data.users.fulfillmentValue.length) {
          buildParentNetwork(data.users.fulfillmentValue, parentId, rowId, lvlId);
          $('tr.user-info[row-id*="' + parentId + '."]').removeClass('hidden');
          _updateFilteredDate();
          $element.removeClass('user-expander').addClass('user-collapser').addClass('has-childs'); 
          $('span.user-action').click(actionLvl);
        }
      }
    });
  }

  function buildParentNetwork (fulfillmentValue, parentId, rowId, lvl) {
    var networkTRs = '';

    for (var i = 0, len = fulfillmentValue.length; i < len; i++) {
      networkTRs += buildChilds(fulfillmentValue[i], parentId, rowId, i, lvl);
    }

    $(networkTRs).insertAfter('tr.user-option[data-user-id="' + parentId + '"]');
    $('tr.user-info[row-id*="' + parentId + '."] .user-info_pic3').click(getUserData);
    _updateFilteredDate();
  }

  function buildChilds (user, parentRowId, rowId, i, lvl) {
    var includedChilds = '';

    if (user.includedUsers && user.includedUsers.fulfillmentValue && user.includedUsers.fulfillmentValue.length) {
      includedChilds = '<span class="user-action user-expander"></span>';
    } else {
      includedChilds = '<span class="user-childs-empty"></span>';
    }

    return '<tr class="user-info hidden lvl-' + lvl + '" row-id="' + rowId + '.' + user.id + '.' + (+i + 1) + '" ' +
      'data-user-id="' + user.id + '" ' +
      'parent-id="' + parentRowId + '">' +
        '<td>' +
          includedChilds +
          '<span class="user-index">' +
            (+i + 1) + '.' +
          '</span>' +
          '<div class="user-info_pic1">' +
            '<img src="' + user.avatar + '" class="user-avatar">' +
          '</div>' +
          '<span class="user-name">' +
            user.name +
          '</span>' +
        '</td>' +
        '<td class="data">' +
          '<div class="right_cell">' +
            '<img src="/assets/images/22.png" data-row="' + parentRowId + '.' + (+i + 1) + '" data-user="' + user.id + '" alt="" class="user-info_pic3">' +
            '<div class="identificator-round r-' + user.identificator + '"></div>' +
          '</div>' +
        '</td>' +
        '<td class="data">' +
          '<span class="user-day">' +
            + ('0' + new Date(user.updated_at).getDate()).slice(-2) + '.' +
            + ('0' + (new Date(user.updated_at).getMonth() + 1)).slice(-2) + '.' +
            + new Date(user.updated_at).getFullYear() +
          '</span> ' +
          '<span class="user-time">' +
            + ('0' + new Date(user.updated_at).getHours()).slice(-2) + ':' +
            + ('0' + (new Date(user.updated_at).getMinutes() + 1)).slice(-2) +
          '</span>' +
        '</td>' +
    '</tr>' +
    '<tr class="user-option" data-user-id="' + user.id + '" data-row="' + parentRowId + '.' + (+i + 1) + '">' +
    '</tr>';
  }

  $('#show-all-picker').click(function() {
    // function showAllNetwork () {
    //   if ($('span.user-action.user-expander').length) {
    //     $('span.user-action.user-expander').trigger('click');
    //     setTimeout(showAllNetwork, 3200);
    //   } else {
    //     stopLoader();
    //   }
    // }
    // startLoader();
    // showAllNetwork();
  });

  $('#hide-all-picker').click(function() {
    // $('tr.user-info[row-id="1"]').find('.user-action.user-collapser').trigger('click');
  });

  function resetUserPasswordPopup () {
    var userId = $(this).attr('data-id');
    $('.popup-reset-password input[name="user_id"]').val(userId);

    $('.popup-reset-password input[name="old_password"], ' +
      '.popup-reset-password input[name="new_password"], ' +
      '.popup-reset-password input[name="new_password_repeat"]').removeClass('password-success, password-incorrect').val('');
    $('.popup-reset-password').popup('show');
  }

  function validateCurrentPassword (e) {
    var self = this;
    var id = $('td.user-tabs').attr('data-user');
    var password = $(self).val();

    $.post('/mynetwork/password/validate', {
      id: id,
      password: password
    }, function (data) {
      if (data.status) {
        $(self).addClass('password-success').removeClass('password-incorrect');
      } else {
        $(self).addClass('password-incorrect').removeClass('password-success');
      }
    });
  }

  function validateNewPassword (e) {
    var password = $(this).val();
    var repeatPassword = $('.popup-reset-password input[name="new_password_repeat"]').val();

    if (password && password.length > 3) {
      $(this).addClass('password-success').removeClass('password-incorrect');
    } else {
      $(this).addClass('password-incorrect').removeClass('password-success');
    }

    if (repeatPassword && repeatPassword.length > 0) {
      $('.popup-reset-password input[name="new_password_repeat"]').trigger('keyup');
    }
  }

  function validateNewRepeatPassword (e) {
    var newPassword = $('.popup-reset-password input[name="new_password"]').val();
    var newRepeatPassword = $(this).val();

    if (newPassword === newRepeatPassword) {
      $(this).addClass('password-success').removeClass('password-incorrect');
    } else {
      $(this).addClass('password-incorrect').removeClass('password-success');
    }
  }


  function editNewPassword (e) {
    e.preventDefault();

    var oldPassword = $('.popup-reset-password input[name="old_password"]');
    var newPassword = $('.popup-reset-password input[name="new_password"]');
    var newRepeatPassword = $('.popup-reset-password input[name="new_password_repeat"]');

    if (oldPassword.val() && oldPassword.val().length &&
        newPassword.val() && newPassword.val().length &&
        newRepeatPassword.val() && newRepeatPassword.val().length &&
        oldPassword.hasClass('password-success') &&
        newPassword.hasClass('password-success') &&
        newRepeatPassword.hasClass('password-success')) {
      $('form#form-reset-password').submit();
    } else {
      showToaster(i18n.t('Please fill all required fields correctly'), true);
    }
  }

  function submitNewPassword (e) {
    e.preventDefault();

    var formData = new FormData(this);
    var formAction = $(this).attr('action');

    submitForm({ action: formAction, data: formData }, onResponse);

    function onResponse (data) {
      if (data.status) {
        $('.popup-reset-password').popup('hide');
        showToaster(i18n.t('Password was successfully changed'), false);
        $('.popup-reset-password input[name="old_password"], ' +
          '.popup-reset-password input[name="new_password"], ' +
          '.popup-reset-password input[name="new_password_repeat"]').removeClass('password-success');
      } else {
        showToaster(i18n.t('Internal server error'), true);
      }
    }
  }

  /** Utils */
  function initPopups (popupsArray) {
    popupsArray.forEach(function (popupName) {
      $(popupName).popup({
        type: 'overlay',
        autoopen: false,
        scrolllock: true,
        transition: 'all 0.3s'
      });
    });
  }

  function showToaster (message, isError) {
    if (isError) {
      $.toast({
        text : message,
        showHideTransition: 'fade',
        allowToastClose: true,
        hideAfter: 3000,
        stack: 5,
        position: {top: '60px', right: '30px'},
        bgColor: '#FF6633',
        textColor: '#fff'
      });
    } else {
      $.toast({
        text : message,
        showHideTransition: 'fade',
        allowToastClose: true,
        hideAfter: 3000,
        stack: 5,
        position: {top: '60px', right: '30px'}
      });
    }
  }
});
