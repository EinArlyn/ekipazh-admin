$(function () {
  var localizerOption = { resGetPath: '/assets/javascripts/vendor/localizer/__ns__-__lng__.json'};
  var datepickerState = false;

  i18n.init(localizerOption);

  /** Update order counter button */
  // setInterval(function() {
  //   updateNewOrderCounter();
  // }, 10000);

  /** Update orders */
  $('#new-orders-counter').click(function(e) {
    window.location.href = '/orders';
  });

  /** Show datepicker */
  $("#select-month-from").click(function (event) {
    event.preventDefault();
    if (datepickerState) {
      $(".date-picker-from").hide();
      datepickerState = false;
    } else {
      $(".date-picker-from").show();
      datepickerState = true;
    }
  });
  $("#select-month-to").click(function (event) {
    event.preventDefault();
    if (datepickerState) {
      $(".date-picker-to").hide();
      datepickerState = false;
    } else {
      $(".date-picker-to").show();
      datepickerState = true;
    }
  });

  /** Get orders by date */
  $('#ok-date').click(function (event) {
    event.preventDefault();
    $('#submit-date').submit();
  });

  /** Get orders by state */
  $('#select-order').change(function (e) {
    e.preventDefault();
    $('#submit-date').submit();
  });

  /* on click - edit order */
  $('.order-edit').click(function(e) {
    e.preventDefault();
    startLoader();

    var orderId = $(this).attr('value');
    $.get('/orders/getOrder/' + orderId, function (data) {
      var perimeter = square = 0.0;
      var profileSystems = '';
      var hardwares = '';
      var laminations = '';
      var created = new Date(data.order.order.created);

      $('#pop-up-delete-order-wrap').attr('data', data.order.order.id);
      $('#pop-up-report-order-wrap').attr('data', data.order.order.id);
      $('#pop-up-factory-number-submit').attr('data-order', data.order.order.id);
      $('#pop-up-delete-order-wrap').removeClass('disabled');
      $('#pop-up-acount-price-order, #pop-up-specification-order').removeAttr('download').attr('href', '#').parent().addClass('disabled');

      /** Set order sended date */
      if (new Date(data.order.order.sended) > new Date(0)) {
        var sended = new Date(data.order.order.sended);
        $('#pop-up-sended').html(("0" + sended.getDate()).slice(-2) + '.' + ("0" + (sended.getMonth() + 1)).slice(-2) + '.' + sended.getFullYear() + ' <span class="order-time">' + ("0" + sended.getHours()).slice(-2) + ':' + ("0" + sended.getMinutes()).slice(-2) + '</span>');
        $('#pop-up-delete-order-wrap').addClass('disabled');
      } else {
        $('#pop-up-sended').text('---');
      }

      /** Set order buch state date */
      if (new Date(data.order.order.state_buch) > new Date(0)) {
        var buch = new Date(data.order.order.state_buch);
        $('#pop-up-buch').html(("0" + buch.getDate()).slice(-2) + '.' + ("0" + (buch.getMonth() + 1)).slice(-2) + '.' + buch.getFullYear() + ' <span class="order-time">' + ("0" + buch.getHours()).slice(-2) + ':' + ("0" + buch.getMinutes()).slice(-2) + '</span>');
        $('#pop-up-delete-order-wrap').addClass('disabled');
      } else {
        $('#pop-up-buch').text('---');
      }

      /** Set order Tech. Department state date */
      if (new Date(data.order.order.state_to) > new Date(0)) {
        var to = new Date(data.order.order.state_to);
        $('#pop-up-to').html(("0" + to.getDate()).slice(-2) + '.' + ("0" + (to.getMonth() + 1)).slice(-2) + '.' + to.getFullYear() + ' <span class="order-time">' + ("0" + to.getHours()).slice(-2) + ':' + ("0" + to.getMinutes()).slice(-2) + '</span>');
        $('#pop-up-delete-order-wrap').addClass('disabled');

        /** Append Acc and Spec links */
        if (data.ACC_PRICE_LINK) {
          $('#pop-up-acount-price-order').attr('href', data.ACC_PRICE_LINK).attr('download', 'download').parent().removeClass('disabled');
        }
        if (data.SPEC_LINK) {
          $('#pop-up-specification-order').attr('href', data.SPEC_LINK).attr('download', 'download').parent().removeClass('disabled');
        }
      } else {
        $('#pop-up-to').text('---');
      }

      if (data.order.order.order_products.length) {
        /** Count perimeter */
        for (var k = 0, len = data.order.order.order_products.length; k < len; k++) {
          perimeter += 2 * (+data.order.order.order_products[k].template_width + +data.order.order.order_products[k].template_height)
        }
        /** Count square */
        for (var j = 0; j < len; j++) {
          square += +data.order.order.order_products[j].template_square;
        }
        /** Count profile systems */
        for (var l = 0; l < len; l++) {
          if (l !== len - 1) {
            profileSystems += data.order.order.order_products[l].profile_system ? data.order.order.order_products[l].profile_system.name + ', ' ? data.order.order.order_products[l].doors_group : data.order.order.order_products[l].doors_group.name + ', ' : '';
          } else {
            profileSystems += data.order.order.order_products[l].profile_system ? data.order.order.order_products[l].profile_system.name + ' ' ?  data.order.order.order_products[l].doors_group : data.order.order.order_products[l].doors_group.name + ' ' : '';
          }
        }
        /** Count hardwares */
        if (data.parsedOrder.hardwares.length) {
          for (var m = 0, len2 = data.parsedOrder.hardwares.length; m < len2; m++) {
            if (m !== len2 - 1) {
              hardwares += data.parsedOrder.hardwares[m].name + ', ';
            } else {
              hardwares += data.parsedOrder.hardwares[m].name + ' ';
            }
          }
        } else {
          hardwares = i18n.t('Not exist single');
        }
        /** Count laminations */
        for (var n = 0, len3 = data.parsedOrder.laminations.length; n < len3; n++) {
          if (n !== len3 - 1) {
            laminations += data.parsedOrder.laminations[n].name + ', ';
          } else {
            laminations += data.parsedOrder.laminations[n].name + ' ';
          }
        }
      }

      /** Append id to specified export link */
      $('#pop-up-export-order').attr('href', function (i, val) {
        return val + data.order.order.id;
      });

      if (!data.user.code_kb) {
        $('#pop-up-specification-order-wrap').hide();
        $('#pop-up-acount-price-order-wrap').hide();
        $('.pop-up-bill').hide();
      }

      $('#pop-up-created').html(("0" + created.getDate()).slice(-2) + '.' + ("0" + (created.getMonth() + 1)).slice(-2) + '.' + created.getFullYear() + ' <span class="order-time">' + ("0" + created.getHours()).slice(-2) + ':' + ("0" + created.getMinutes()).slice(-2) + '</span>');
      $('#pop-up-number').text(data.order.order.order_number);
      $('#pop-up-furniture').text(hardwares);
      $('#pop-up-batch').text(data.order.order.batch);
      $('#pop-up-customer-name').text(data.order.order.customer_name);
      $('#pop-up-customer-city').text(data.order.order.customer_city);
      $('#pop-up-factory-number').val(data.order.order.order_hz);
      $('#pop-up-customer-adress').text(data.order.order.customer_address);
      $('#pop-up-customer-phone').text(data.order.order.customer_phone);
      $('#pop-up-customer-phone-city').text(data.order.order.customer_phone_city);
      $('#pop-up-customer-email').text(data.order.order.customer_email);
      $('#pop-up-base-price').text(parseFloat(data.order.base_price).toFixed(2));
      $('#pop-up-margin').text(data.order.margin_price);
      $('#pop-up-bill').text(data.order.order.bill || '---');
      // $('#pop-up-payment').text(parseFloat(data.order.order.additional_payment).toFixed(2));
      $('#pop-up-payment').text('---');
      $('#pop-up-perimeter').text(perimeter/1000);
      $('#pop-up-square').text(square);
      $('#pop-up-profile-list').text(profileSystems);
      $('#pop-up-color').text(laminations);
      $('#pop-up-seller-name').text(data.order.user.name);
      $('#pop-up-seller-city').text(data.order.user.city.name);
      $('#pop-up-seller-adress').text(data.order.user.address);
      $('#pop-up-seller-phone').text(data.order.user.phone);
      $('#pop-up-seller-phone-city').text(data.order.user.city_phone);
      $('#pop-up-seller-email').text(data.order.user.name);
      $('#pop-up-purchase-price').text(parseFloat(data.order.purchase_price).toFixed(2));
      $('#pop-up-sale-price').text(parseFloat(data.order.sale_price).toFixed(2));
      $('.pop-up').popup('show');
      stopLoader();
    });
  });

  /** Close popups */
  $('.pop-up-close-wrap').click(function (e) {
    e.preventDefault();

    $('.pop-up, .report-pop-up, .pop-up-default, .buh-pop-up').popup('hide');
    $('#pop-up-factory-number-submit').hide();
  });

  /** Change order factory number */
  $('#pop-up-factory-number').keypress(function() {
    $('#pop-up-factory-number-submit').show();
  });
    /** submit order factory number */
    $('#pop-up-factory-number-submit').click(function(e) {
      var newFactoryNumber = $('#pop-up-factory-number').val();
      var orderId = $(this).attr('data-order');
      $('#pop-up-factory-number-submit').hide();

      $.post('/orders/change-factory-number/' + orderId, {
        newFactoryNumber: newFactoryNumber
      }, function(data) {
        if (data.status) {
          $('.factory-number[data-order="' + orderId + '"]').text(newFactoryNumber);
        }
      })
    });

  /**
   * Delete order
   */
  $('#pop-up-delete-order-wrap').click(function (e) {
    e.preventDefault();
    if (!$(this).hasClass('disabled')) {
      var orderId = $(this).attr('data');

      $('.pop-up').popup('hide');
      $('.delete-alert .pop-up-header').text(i18n.t('Removing order'));
      $('#delete-submit').attr('data-item', orderId);
      $('.delete-alert').popup('show');
    } else {

    }
  });

    /** Submit removing */
    $('#delete-submit').click(function(e) {
      e.preventDefault();

      var orderId = $(this).attr('data-item');

      $.post('/orders/deleteOrder/', {orderId: orderId}, function () {
        $('.delete-alert').popup('hide');
        window.location.reload();
      });
    });

    /** Deny removing */
    $('#delete-deny, .pop-up-deny-btn').click(function(e) {
      e.preventDefault();

      $('.delete-alert, .pop-up-default').popup('hide');
    });

  /** On change checkboxes (send/to/buch) */
    /* sended state */
    $('.sended-checkbox').click(function (e) {
      e.preventDefault();

      var _self = this;
      var orderId = $(_self).attr('value');
      var checked = $(_self).prop('checked');
      var currentTO = $('#to' + orderId).prop('checked');
      var sendId = $(_self).attr('id');

      if (currentTO) {
        $.toast({
          text : i18n.t('Order cannot be canceled'),
          showHideTransition: 'fade',
          allowToastClose: true,
          hideAfter: 3000,
          stack: 5,
          position: {top: '60px', right: '30px'},
          bgColor: '#FF6633',
          textColor: '#fff'
        });
      } else {
        window.localStorage.setItem('sendId', sendId);
        if (checked) {
          $('#order-action-type').text(i18n.t('Send order to factory for invoicing?'));
        } else {
          $('#order-action-type').text(i18n.t('Attention! Unchecking this box does not cancel the processing of the previously sent order by the factory. Uncheck the box?'));
        }
        showSendAlert();
      }
    });

    function showSendAlert () {
      $('.alert-send-order').popup('show');
    }

    $('#send-order-btn').click(function (e) {
      var sendId = window.localStorage.getItem('sendId', sendId);
      var $input = $('input.sended-checkbox#' + sendId);
      sendOrder($input);
    })

    function sendOrder ($input) {
      $input.prop('disabled', true);
      var orderId = $input.attr('value');
      var checked = $input.prop('checked');
      var currentTO = $('#to' + orderId).prop('checked');
      var value = checked ? new Date(0) : new Date();

      $.post('/orders/changeOrderState/', {
        orderId: orderId,
        state: 'sended',
        value: value
      }, function (data) {
        $input.prop('disabled', false);
        if (!data.status) {
          $.toast({
            text : data.error,
            showHideTransition: 'fade',
            allowToastClose: true,
            hideAfter: 3000,
            stack: 5,
            position: {top: '60px', right: '30px'},
            bgColor: '#FF6633',
            textColor: '#fff'
          });
        } else {
          if (!checked) {
            $input.prop('checked', true);
            $input.prop('disabled', true);
            $.toast({
              text : i18n.t('Order has been sent to the factory'),
              showHideTransition: 'fade',
              allowToastClose: true,
              hideAfter: 3000,
              stack: 5,
              position: {top: '60px', right: '30px'}
            });
          } else {
            $input.prop('checked', false);
            $.toast({
              text : i18n.t('Order canceled'),
              showHideTransition: 'fade',
              allowToastClose: true,
              hideAfter: 3000,
              stack: 5,
              position: {top: '60px', right: '30px'},
            });
          }
          $('.alert-send-order').popup('hide');
        }
      });
    }

    /* to state */
    $('.to-checkbox').click(function(e) {
      var orderId = $(this).attr('value');
      var isSended = $('#sended' + orderId).prop('checked');
      if (isSended) {
        var checked = $(this).prop('checked');
        if (checked) {
          var value = new Date();
          $.toast({
            text : i18n.t('Order has been sent to the tech department'),
            showHideTransition: 'fade',
            allowToastClose: true,
            hideAfter: 3000,
            stack: 5,
            position: {top: '60px', right: '30px'}
          });
        } else {
          var value = new Date(0);
        }

        $.post('/orders/changeOrderState/', {
          orderId: orderId,
          state: 'state_to',
          value: value
        }, function(data) {

        });
      } else {
        e.preventDefault();
        $.toast({
          text : i18n.t('Order is not sent to the factory'),
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

    /* buh state */
    $('.buh-checkbox').click(function(e) {
      var orderId = $(this).attr('value');
      var isSended = $('#sended' + orderId).prop('checked');
      var isSendedTO = $('#to' + orderId).prop('checked');
      if (isSended && isSendedTO) {
        // $('.buh-pop-up').popup('show');
        var checked = $(this).prop('checked');
        if (checked) {
          var value = new Date();
          $.toast({
            text : i18n.t('Order has been sent to the accounting department'),
            showHideTransition: 'fade',
            allowToastClose: true,
            hideAfter: 3000,
            stack: 5,
            position: {top: '60px', right: '30px'}
          });
        } else {
          var value = new Date(0);
        }

        $.post('/orders/changeOrderState/', {
          orderId: orderId,
          state: 'state_buch',
          value: value
        }, function(data) {

        });
      } else {
        e.preventDefault();
        $.toast({
          text : i18n.t('Order is not sent to the tech department'),
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

  /** Orders */
  /** Get order report */
  $('#pop-up-report-order-wrap').click(function(e) {
    e.preventDefault();

    var orderId = $(this).attr('data');
    _getReportElements(orderId, 1);

    $('.checked-action').removeClass('checked-action');
    $('.report-action-btn[data-type="1"]').addClass('checked-action');
  });

    /** Change element type */
    $('.report-action-btn').click(function(e) {
      e.preventDefault();

      var orderId = $('#pop-up-report-order-wrap').attr('data');
      var type = $(this).attr('data-type');

      $('.checked-action').removeClass('checked-action');
      $(this).addClass('checked-action');

      _getReportElements(orderId, type);
    });

  /** Get report elements */
  function _getReportElements(orderId, type) {
    $.get('/orders/get-order-report/' + orderId + '?type=' + type, function(data) {
      if (data.status) {
        //console.log(data.elements);
        $('#report-table tbody').empty();
        if (data.elements.length) {
          for (var i = 0, len = data.elements.length; i < len; i++) {
            // if (data.elements[i].element.element_group_id === 1 || data.elements[i].element.element_group_id === 3 || data.elements[i].element.element_group_id === 8 || data.elements[i].element.element_group_id === 5) {
            //   //size = data.elements[i]
            // }

            $('#report-table tbody').append('<tr class="table-content">' +
              '<td>' +
                '<div class="table-text">' + data.elements[i].element.name + '</div>' +
              '</td>' +
              '<td>' +
                '<div class="table-text">' + data.elements[i].element.sku + '</div>' +
              '</td>' +
              '<td>' +
                '<div class="table-text table-text-center">' + data.elements[i].amount + '</div>' +
              '</td>' +
              '<td>' +
                '<div class="table-text table-text-center">' + data.elements[i].size + '</div>' +
              '</td>' +
            '</tr>');
          }
        } else {
          $('#report-table tbody').append('<tr class="table-content">' +
              '<td colspan="4">' +
                '<div class="table-text table-text-center">' + i18n.t('Empty') + '</div>' +
              '</td>' +
            '</tr>');
        }
        $('.pop-up').popup('hide');
        $('.report-pop-up').popup('show');
      }
    });
  }
  /* Pop up init */
  $('.pop-up').popup({
    type: 'overlay',
    autoopen: false,
    scrolllock: true,
    transition: 'all 0.3s'
  });
  $('.report-pop-up').popup({
    type: 'overlay',
    autoopen: false,
    scrolllock: true,
    transition: 'all 0.3s'
  });
  $('.delete-alert').popup({
    type: 'overlay',
    autoopen: false,
    scrolllock: true,
    transition: 'all 0.3s'
  });
  $('.buh-pop-up').popup({
    type: 'overlay',
    autoopen: false,
    scrolllock: true,
    transition: 'all 0.3s'
  });
  $('.alert-send-order').popup({
    type: 'overlay',
    autoopen: false,
    scrolllock: true,
    transition: 'all 0.3s'
  });

  /** Datepicker Init */
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
            position: {top: '60px', right: '30px'},
          });
        } else {
          $(".date-picker-to").hide();
          $("#date-to").val(date);
        }
      }
  });

  function updateNewOrderCounter() {
    $.get('/orders/get-amount-of-orders/' + 1, function(data) {
      if (data.status) {
        var previousCount = parseInt($('.main-options').attr('data-total'), 10);

        if (previousCount < parseInt(data.count, 10)) {
          $('#new-orders-count').text(parseInt(data.count, 10) - previousCount);
        }
      }
    });
  }
});
