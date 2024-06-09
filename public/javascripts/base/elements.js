$(function () {
  var localizerOption = { resGetPath: '/assets/javascripts/vendor/localizer/__ns__-__lng__.json'};
  i18n.init(localizerOption);

  /* On load show search bar */
  $('.nav-search').fadeIn(800);
  /* On load get sets count */
  var setsValues = $('.element-set');
  setsValues.each(function(child) {
    getSetsCount(this);
  });

  function getSetsCount(element) {
    $.get('/base/elements/getSetsCount/' + $(element).attr('value'), function(lists) {
      if (lists) {
        $(element).html(lists.length);        
      } 
    });
  }

  /* Search element */
  $('#search-btn').click(function() {
    $('#search-query').submit();
  });
  /*
    sort elements by element group
  */
  $("#select-group").change(function() {
    $("#select-group option:selected").each(function() {
      window.location = "/base/elements/?type=" + $(this).val();
    });
  });

  /**
   * Prevent propagation on checkbox click
   */
  $('.element-edit').click(function(e) {
    if (!$(e.target).is('.items-checkbox')) {
      var elementId = $(this).attr('data');
      window.location = "/base/element/" + elementId;
    }
  });

  /** Activate operations if checkboxes is checked */
  $('.items-checkbox').click(function() {
    var checkedElements = $(".items-checkbox:checked").length;
    if (checkedElements > 0) {
      $('#selectOption, #radioSelected, #radioUnSelected').prop('disabled', false);
      $('.content-footer-operation, #content-footer-ok').css('opacity', '1');
    } else {
      $('#selectOption, #radioSelected, #radioUnSelected').prop('disabled', true);
      $('.content-footer-operation, #content-footer-ok').css('opacity', '0.3');
    }
  });

  /**
   * Duplicate element
   */
  $('#addItem').click(function(e) {
    e.preventDefault();
    if (!$(this).hasClass('disabled')) {
      var type = $('#select-group option:selected').val();
      window.location.href = "/base/element/create/" + type;
    }
  });

  /*
    select operation for elements (edit / delete)
  */
  $("#content-footer-ok").click(function(e) {
    e.preventDefault();
    if (!$("#selectOption").prop('disabled')) {
      var operation = $("#selectOption").val();
      var elementsType = $("#radioSelected").prop('checked');
      var checkedElements = $("input[name='checkedElements']");

      if (operation === 'удалить') {
        $('.delete-alert').popup('show');
      } else if (operation === 'дублировать') {
        duplicateElemetns();
      } else {
      }

      function duplicateElemetns() {
        if (elementsType) {                       // operation with selected elements
          for (var i = 0, len = checkedElements.length; i < len; i++) {
            if (checkedElements[i].checked) {
              $.post('/base/elements/duplicateElement/' + checkedElements[i].value, {}, function(data) {
                if (data.status) {
                  $.toast({
                    text : i18n.t('Duplicated element') + ' ' + data.name + '.',
                    showHideTransition: 'fade',
                    allowToastClose: true,
                    hideAfter: 3000,
                    stack: 5,
                    position: {top: '60px', right: '30px'}
                  });
                  setTimeout(function() {
                    window.location.reload();
                  }, 300);
                }
              });
            }
          }
        } else {                                  // operation with unselected elements
          for (var i = 0, len = checkedElements.length; i < len; i++) {
            if (!checkedElements[i].checked) {
              $.post('/base/elements/duplicateElement/' + checkedElements[i].value, {}, function(data) {
                if (data.status) {
                  $.toast({
                    text : i18n.t('Duplicated element') + ' ' + data.name + '.',
                    showHideTransition: 'fade',
                    allowToastClose: true,
                    hideAfter: 3000,
                    stack: 5,
                    position: {top: '60px', right: '30px'}
                  });
                  setTimeout(function() {
                    window.location.reload();
                  }, 300);
                }
              });
            }
          }
        }
      }
    }
  });

    $('#delete-elements-submit').click(function() {
      deleteElements();
      $('.delete-alert').popup('hide');
    });

    $('#delete-elements-deny').click(function() {
      $('.delete-alert').popup('hide');
    });
  
    function deleteElements() {
      var operation = $("#selectOption").val();
      var elementsType = $("#radioSelected").prop('checked');
      var checkedElements = $("input[name='checkedElements']");

      if (elementsType) {                       // operation with selected elements
        for (var i = 0, len = checkedElements.length; i < len; i++) {
          if (checkedElements[i].checked) {
            var elementId = $(checkedElements[i]).attr('value');
            removeItemHandler(elementId);
          }
        }
      } else {                                  // operation with unselected elements
        for (var i = 0, len = checkedElements.length; i < len; i++) {
          if (!checkedElements[i].checked) {
            var elementId = $(checkedElements[i]).attr('value');
            removeItemHandler(elementId);
          }
        }
      }
    }

  function removeItemHandler(id) {
    $.post('/base/elements/deleteElement/', {
      elementId: id
    }, function(data) {
      if (data.status) {  
        setTimeout(function() {
          $('li[data="' + id + '"]').remove();
        }, 600);
        $('#selectOption, #radioSelected, #radioUnSelected').prop('disabled', true);
        $('.content-footer-operation, #content-footer-ok').css('opacity', '0.3');
        $('li[data="' + id + '"]').css('background', '#ffcc99');
        $.toast({
          text : i18n.t('The element has been removed'),
          showHideTransition: 'fade',
          allowToastClose: true,
          hideAfter: 3000,
          stack: 5,
          position: {top: '60px', right: '30px'}
        });      
      } else {
        if (data.err === 'lists') {
          $.toast({
            text : i18n.t('The element belongs to the set'),
            showHideTransition: 'fade',
            allowToastClose: true,
            hideAfter: 3000,
            stack: 5,
            position: {top: '60px', right: '30px'},
            bgColor: '#FF6633',
            textColor: '#fff'
          });  
        } else if (data.err === 'profile_systems') {
          $.toast({
            text : i18n.t('The element belongs to the profile systems'),
            showHideTransition: 'fade',
            allowToastClose: true,
            hideAfter: 3000,
            stack: 5,
            position: {top: '60px', right: '30px'},
            bgColor: '#FF6633',
            textColor: '#fff'
          }); 
        }
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
