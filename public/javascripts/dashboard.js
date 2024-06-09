$(function () {
  /** On .btn block hover */
  $('.btn').hover(function () {
    $(this).find('.box-hover').fadeIn(2);
  }, function () {
    $(this).find('.box-hover').fadeOut(2);
  });

  /** Element base on click */
  $("#base").click(function () {
    if (!$(this).hasClass('disabled')) {
      $(".base-field").addClass("base-menu");
    }
  });

  /** Orders history on click */
  $('#orders-history').click(function() {
    if (!$(this).hasClass('disabled')) {
      window.location = '/orders';
    }
  });
  /** My network on click */
  $('#mynetwork').click(function() {
    if (!$(this).hasClass('disabled')) {
      if (window.location.hostname.indexOf('steko') > -1) {
        window.open('http://admin.ekipazh.windowscalculator.net:8182/token/' + $('.btn#mynetwork').attr('data-id'), '_blank');
      } else {
        window.location = '/mynetwork';
      }
    }
  });
  /** Analytics on click */
  $('#analytics').click(function() {
    if (!$(this).hasClass('disabled')) {
      $('#analitycs-submit').submit();
    }
  });
  /** Pro on click */
  $('#pro').click(function() {
    if (!$(this).hasClass('disabled')) {
      $('#pro-submit').submit();
    }
  });
 /** documents on click */
  $('#documents').click(function() {
    if (!$(this).hasClass('disabled')) {
      $('#documents-submit').submit();
    }
  });
  /** Calcs on click */
  $('#calcs').click(function() {
    if (!$(this).hasClass('disabled')) {
      window.open($(this).attr('data-link'), '_blank');
    }
  });
  /** stats click */
  $('#stats').click(function() {
    if (!$(this).hasClass('disabled')) {
      // window.open($(this).attr('data-link'), '_blank');
      $('#stats-submit').submit();
    }
  });


  $('.btn, .base-btn').click(function() {
    if (!$(this).hasClass('disabled') && !$(this).hasClass('base-access')) {
      // $.loader({
      //   className:"loader",
      //   content: '',
      // });
    }
  });
});
