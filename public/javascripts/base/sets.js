$(function() {
  var localizerOption = { resGetPath: '/assets/javascripts/vendor/localizer/__ns__-__lng__.json'};
  i18n.init(localizerOption);

  /* On load show search bar */
  $('.nav-search').fadeIn(800);

  /* Search set */
  $('#search-btn').click(function() {
    $('#search-query').submit();
  });

  /*
    sort sets by set type
  */
  $("#select-type").change(function() {
    $("#select-type option:selected").each(function() {
      window.location = "/base/sets/?type=" + $(this).val();
    });
  });

  /**
   * Stop propagation on set edit
   */
  $('.list-edit').click(function(e) {
    if (!$(e.target).is('.items-checkbox')) {
      var setId = $(this).attr('data');
      window.location = "/base/set/" + setId;
    }
  });
  

  /*
    select operation for sets (edit / delete)
  */
  $("#content-footer-ok").click(function() {
    var operation = $("#selectOption").val();

    if (operation === 'удалить') {
      $('.delete-alert').popup('show');
    } 
  });

    $('#delete-sets-submit').click(function() {
      deleteSets();
      $('.delete-alert').popup('hide');
    });

    $('#delete-sets-deny').click(function() {
      $('.delete-alert').popup('hide');
    });

    function deleteSets() {
      //var operation = $("#selectOption").val();
      var elementsType = $("#radioSelected").prop('checked');
      var checkedElements = $("input[name='checkedLists']");
      
      if (elementsType) {                       // operation with selected sets
        for (var i = 0, len = checkedElements.length; i < len; i++) {
          if (checkedElements[i].checked) {
            var elementId = $(checkedElements[i]).attr('value');
            removeItemHandler(elementId);
          }
        }
      } else {                                  // operation with unselected sets
        for (var i = 0, len = checkedElements.length; i < len; i++) {
          if (!checkedElements[i].checked) {
            var elementId = $(checkedElements[i]).attr('value');
            removeItemHandler(elementId);
          }
        }
      }
    }


  function removeItemHandler(id) {
    $.post('/base/sets/removeSet/' + id, {}, function (data) {
      if (data.status) {
        setTimeout(function() {          
          $('li[data="' + id + '"]').remove();
        }, 600);
        
        $('li[data="' + id + '"]').css('background', '#ffcc99');
        $.toast({
          text : i18n.t('Set of elements has been removed'),
          showHideTransition: 'fade',
          allowToastClose: true,
          hideAfter: 3000,
          stack: 5,
          position: {top: '60px', right: '30px'}
        });
      } else {
        $.toast({
          //heading: 'Уведомление',
          text : i18n.t('Elements consist in this set'),
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

  $('.pop-up-close-wrap').click(function() {
    $('.pop-up-default').popup('hide');
  });
  
  /** Init popups */
  $('.delete-alert').popup({
    type: 'overlay',
    autoopen: false,
    scrolllock: true,
    transition: 'all 0.3s'
  });
});