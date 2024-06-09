var calendarId;
$(function () {
  var datepickerState = false;
  $(".select-month-from").click(function (event) {
    event.preventDefault();
    calendarId = this.id.slice(-1);
    if (datepickerState) {
      $(".date-picker-from").hide();
      datepickerState = false;
    } else {
      $(".date-picker-from").show();
      datepickerState = true;
    }
  });
  $(".select-month-to").click(function (event) {
    event.preventDefault();
    calendarId = this.id.slice(-1);
    if (datepickerState) {
      $(".date-picker-to").hide();
      datepickerState = false;
    } else {
      $(".date-picker-to").show();
      datepickerState = true;
    }
  });

  /** Datepicker Init */
  $("#calendar-from").ionCalendar({
      lang: "ru",
      sundayFirst: false,
      years: "80",
      format: "DD.MM.YYYY",
      onClick: function(date) {
        datepickerState = false;
        var dateTo = $("#date-to-" + calendarId).val();
        var parsedDateFrom = date.split('.');
        var parsedDateTo = dateTo.split('.');

        var fromDate = new Date(parsedDateFrom[2], parsedDateFrom[1], parsedDateFrom[0]);
        var toDate = new Date(parsedDateTo[2], parsedDateTo[1], parsedDateTo[0]);

        if (fromDate > toDate) {
          $.toast({
            text : 'The start date can not exceed the final',
            showHideTransition: 'fade',
            allowToastClose: true,
            hideAfter: 3000,
            stack: 5,
            position: {top: '60px', right: '30px'}
          });
        } else {
          $(".date-picker-from").hide();
          $("#date-from-" + calendarId).val(date);
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
        var dateFrom = $("#date-from-" + calendarId).val();
        var parsedDateFrom = dateFrom.split('.');
        var parsedDateTo = date.split('.');

        var fromDate = new Date(parsedDateFrom[2], parsedDateFrom[1], parsedDateFrom[0]);
        var toDate = new Date(parsedDateTo[2], parsedDateTo[1], parsedDateTo[0]);
        if (toDate < fromDate) {
          $.toast({
            text : 'End date can not be less than the initial',
            showHideTransition: 'fade',
            allowToastClose: true,
            hideAfter: 3000,
            stack: 5,
            position: {top: '60px', right: '30px'},
          });
        } else {
          $(".date-picker-to").hide();
          $("#date-to-" + calendarId).val(date);
        }
      }
  });
  $('.btn-excel').click(function (event) {
    var btn = event.target;
    var index = btn.id.slice(-1);
    var from = $('#date-from-' + index).val();
    var to = $('#date-to-' + index).val();
    var kind = $(btn).data('type');
    $('#loader-img').css('display', 'inherit');
    $.get('/analytics/' + kind + '/' + from + '/' + to, function (data) {
      $('#loader-img').css('display', 'none');
      $('#downloadFile').attr('action', '/file/' + data.file);
      setTimeout(function () {
        $('#downloadFile').submit();
      }, 3000);
    }).fail(function () {
      $('#loader-img').css('display', 'none');
      $.toast({
        text : 'Не удалось загрузить данные',
        showHideTransition: 'fade',
        allowToastClose: true,
        hideAfter: 5000,
        stack: 5,
        position: {top: '60px', right: '30px'}
      });
    });
  });
});
