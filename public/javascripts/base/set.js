$(function () {
  var localizerOption = { resGetPath: '/assets/javascripts/vendor/localizer/__ns__-__lng__.json'};
  var setsWithPosition = [23, 26, 21, 27, 19, 9, 8, 13, 24, 12, 6, 25];
  var pushGroups = [32, 26, 21, 27, 20, 31, 19, 9, 8, 28, 24, 6];

  /** Addition component for storing data */
  // TODO: use locale storage
  var Temprorary = {
    id: null,
    accessoryId: null,
    init: function (id, accessoryId) {
      this.id = id;
      this.accessoryId = accessoryId;
    },
    get: function (type) {
      return this[type];
    },
    destroy: function () {
      this.id = null;
      this.accessoryId = null;
    }
  };

  /** It should be get out to main.js */
  var popups = {
    removeLockList: function () {
      $('.alert-remove-popup span.pop-up-header').text(i18n.t('Unbind handle'));
      $('.alert-remove-popup').popup('show');
    }
  };

  $('input#is-push').click(checkListAvalabilityAsPush);

  $('#referrer').attr('value', document.referrer);

  /** Init client localizer */
  i18n.init(localizerOption);
  /** Init image picker */
  $('#glass-picker').imagepicker();



  /** Edit child item button */
  $('.edit-btn').click(function (e) {
    e.preventDefault();
    var itemId = $(this).attr('data');
    var itemName = $(this).attr('data-item-name');
    var setId = $(this).attr('data-set-id') || 0; 
    $('.rule-1, .rule-2').hide();
    $.get('/base/set/item/get/' + itemId + '/' + setId, function (data) {
      console.log(data, setId)

      if (setId !== 0 && data.set_item.list_group_id === 7) {
        $("#edit-item-reinforcement-type").find('option').remove().end();
        $("#edit-item-reinforcement-type").append("<option value='0'>" + i18n.t('Not exist') + "</option>");
        for (var i = 0; i < data.armir_types.length; i++) {
          var selected = (data.armir_types[i].id === data.child.reinforcement_type_id) ? ' selected' : '';
          $("#edit-item-reinforcement-type").append("<option value='" + data.armir_types[i].id + "'" + selected + ">" + data.armir_types[i].name + "</option>");
        }
        $(".child-item-reinforcement").show();
      } else {
        $(".child-item-reinforcement").hide();
      }

      $('.edit-child-item-pop-up .child-item-name').text(itemName);
      if (data.child.direction_id === 1) {
        $('#edit-popup-direction-none').prop('checked', true);
      } else if (data.child.direction_id === 2) {
        $('#edit-popup-direction-right').prop('checked', true);
      } else {
        $('#edit-popup-direction-left').prop('checked', true);
      }
      $('#edit-item-color-profile').find('option').remove().end();
      for (var i = 0, len = data.laminationTypes.length; i < len; i++) {
        $('#edit-item-color-profile').append('<option value="' + data.laminationTypes[i].id + '">' + data.laminationTypes[i].name + '</option>')
      }
      $('#edit-item-color-profile').val(data.child.lamination_type_id);

      $('#edit-item-color-hardware').find('option').remove().end();
      for (var j = 0, len2 = data.windowHardwareColors.length; j < len2; j++) {
        $('#edit-item-color-hardware').append('<option value="' + data.windowHardwareColors[j].id + '">' + data.windowHardwareColors[j].name + '</option>')
      }
      $('#edit-item-color-hardware').val(data.child.window_hardware_color_id);

      if (data.child.rules_type_id === 2 || data.child.rules_type_id === 3 || data.child.rules_type_id === 12 || data.child.rules_type_id === 24 || data.child.rules_type_id === 23 || data.child.rules_type_id === 6 || data.child.rules_type_id === 7) {
        $('.rule-1').show();
        $('.rule-1').find('input[name="edit_item_rule_value1"]').val(parseFloat(data.child.value));
        $('.rule-1').find('select[name="edit_item_rule1"]').val(data.child.rules_type_id);
        $('.edit-child-item-save').attr('data-rule', '1')
      } else {
        $('.rule-2').show();
        $('.rule-2').find('input[name="edit_item_rule_value2"]').val(data.child.value);
        $('.rule-2').find('select[name="edit_item_rule2"]').val(data.child.rules_type_id);
        $('.edit-child-item-save').attr('data-rule', '2')
      }
      $('#edit-item-rounding-type').val(data.child.rounding_type);
      $('#edit-item-rounding-value').val(data.child.rounding_value);
      $('.edit-child-item-save').attr('data', data.child.id);
      $('.edit-child-item-pop-up').popup('show');
    });
  });


  // for copy form element
  $('.copy-settings-list').click(function(e){
    e.preventDefault();
    var idElem = $('.copy-settings-list').attr('data');
    $('.alert-copy-list-popup').popup('show');

    $.get('/base/set/getElementsGroup/' + idElem, function (data) {
      if (data) {
        for (var i = 0; i < data.length; i++){
          $('.select-copy-type').append("<option value='" + data[i].id + "'>" + data[i].name + " / " + data[i].id + "</option>")
        }
      }
    });
  });

  $('#search-input-copy-list').keyup(function(){
    const idElem = $('.copy-settings-list').attr('data');
    const searchField = $('#search-input-copy-list').val().toLowerCase(); 
    if(searchField.length > 0) {
      $.get('/base/set/getElementsGroup/' + idElem, function (data) {
        if (data) {
          let filteredData = data.filter(item => item.name.toLowerCase().includes(searchField));
          data = filteredData;
          $('.select-copy-type').empty();
          for (var i = 0; i < data.length; i++){
            $('.select-copy-type').append("<option value='" + data[i].id + "'>" + data[i].name + " / " + data[i].id + "</option>")
          }
        }
      });
    }
  })

  $('#submit-copy').click(function(e){
    e.preventDefault();
    const idElem = $('.copy-settings-list').attr('data');
    const copyForm = $('.select-copy-type').val();

    $.post('/base/set/save-copy-group/' + copyForm + '/' + idElem, function(copy) {
      window.location.reload();      
    })
            
  })

  // sendvich lamin deps
  $('.btn-show-sendvich-check').click(function(e) {
    e.preventDefault();
    $('.sendvich-check-lamination').removeClass('hidden');
  });

  $('.btn-close-sendvich-check').click(function(e) {
    e.preventDefault();
    $('.sendvich-check-lamination').addClass('hidden');
  });

  $('div.lamination-item input').click(function() {
    laminationId = $(this).attr('value');
    lamination_status = $(this).is(":checked");
    var CheckLamination ={};
    if (lamination_status)
    {
       CheckLamination[laminationId] = 1;
    }
    else
    {
       CheckLamination[laminationId] = 0;
    }
   setSendvichLamination($(this).attr('data-sendvich-id'), CheckLamination);
  });

  function setSendvichLamination(SendvichId, CheckLamination) {
    $.post('/base/set/getSendvichLamination/' + SendvichId, CheckLamination
    , function(data) {
      if (!CheckLamination)
      {
        $("[name='checkLamination']").each(function() {
            if (data[$(this).attr('value')]){
              $(this).prop('checked', true);
            }
            else{
              $(this).prop('checked', false);
            }
        });
      }
    });
  }


  $('.pop-up-deny-btn, .pop-up-close').click(function (e) {
    e.preventDefault();
    $('.alert-copy-list-popup').popup('hide');
  })


  // ---

    /** Submit editing */
    $('.edit-child-item-save').click(function (e) {
      e.preventDefault();

      var childId = $(this).attr('data');
      if ($(this).attr('data-rule') === '1') {
        var value = $('input[name="edit_item_rule_value1"]').val();
        var ruleId = $('select[name="edit_item_rule1"]').val();
      } else {
        var value = $('input[name="edit_item_rule_value2"]').val();
        var ruleId = $('select[name="edit_item_rule2"]').val();
      }
      var profileColorId = $('#edit-item-color-profile').val();
      var hardwareColorId = $('#edit-item-color-hardware').val();
      var directionId = $('input[name="direction-edit"]:checked').val();
      var roundingType = $('#edit-item-rounding-type').val();
      var roundingValue = $('#edit-item-rounding-value').val();
      var reinforcementType = $('select[name="edit_item_reinforcement_type"]').val() || 0;
      $.post('/base/set/item/edit', {
        childId: childId,
        value: value,
        ruleId: ruleId,
        profileColorId: profileColorId,
        hardwareColorId: hardwareColorId,
        directionId: directionId,
        roundingType: roundingType,
        roundingValue: roundingValue,
        reinforcementType: reinforcementType
      }, function (data) {
        if (data.status) {
          $('.edit-child-item-pop-up').popup('hide');
          window.location.reload();
        }
      });
    });

  $('.add-lock-set').click(showAvailableLockLists);
  $('.submit-lock-set').click(submitLockList);
  $('.remove-lock-set').click(removeLockList);
  $('.alert-remove-popup #submit-remove').click(submitRemoveLockList);

  $('#pop-up-edit-child-item-close-wrap').click(function (e) {
    e.preventDefault();
    $('.edit-child-item-pop-up').popup('hide');
  });
  /*
    * Type-name onchange - change img of frame
  */
  $("#type-name").change(function() {
    var group = $("#group-name option:selected").val();
    var type = $("#type-name option:selected");
    $('.additional-folders').hide();
    $('.glass-options, ul.thumbnails.image_picker_selector').hide();
    $('.header-position').removeClass('visible-position');

    if (pushGroups.indexOf(parseInt(group, 10)) >= 0) {
      $('.set-is-push').show();
    } else {
      $('.set-is-push').hide();
    }

    if (setsWithPosition.indexOf(parseInt(group)) !== -1) {
      $('.header-position').addClass('visible-position');
    }

    $(".main-frame, .glass-width, .main-furniture").removeClass("checkedType");
    if (group == 6 || group == 17 || group == 18 || group == 16 || group == 20 || group == 24 || group == 23) {
      $("#amendment_pruning").hide();
    } else {
      $("#amendment_pruning").show();
    }

    if (group == 8 || group == 9 || group == 21) {
      $("#size").show();
    } else {
      $("#size").hide();  
    }
    if (group == 8) {
      $(".sill-color").show();
    } else {
      $(".sill-color").hide();
    } 
    if (group == 9) {
      $(".spillway-color").show();
    } else {
      $(".spillway-color").hide();
    }
    if (group == 12) {
      $(".connectors-color").show();
    } else {
      $(".connectors-color").hide();
    }
    if (group == 10) {
      $(".mosquitos-color").show();
    } else {
      $(".mosquitos-color").hide();
    }
    if (group == 21) {
      $(".visors-color").show();
    } else {
      $(".visors-color").hide();
    }
    // console.log(group);


    if (group == 8) {
      $('.additional-sills').show();
    } else if (group == 9) {
      $('.additional-spillways').show();
    } else if (group == 21) {
      $('.additional-visors').show();
    } else if (group == 6) {
      $('.glass-options, ul.thumbnails.image_picker_selector').show();
    } else if (group == 12) {
      $('.additional-connectors').show();
    } else if (group == 24) {
      $('.additional-doorhandles').show();
    } else if (group == 18) {
      $('.additional-otherElems').show();
    } else if (group == 14) {
      $('.additional-holes').show();
    } else if (group == 16) {
      $('.additional-decors').show();
    }

    if (group == 17 || group == 16 || group == 18 || group == 20 || group == 24 || group == 23) {
      $(".markup").hide();
    } else {
      $(".markup").show();
    }

    if (group == 2 && type.val() == 5 || group == 3 && type.val() == 6 || group == 3 && type.val() == 7) {
      $('.door-options').show();
    } else {
      $('.door-options').hide();
    }

    if (group == 2 && type.val() == 2) {
      $('.doorstep').show();
    } else {
      $('.doorstep').hide();
    }

    if (type.val() == 38 || type.val() == 40 || type.val() == 37 || type.val() == 39) {
      $('.locks').show();
    } else {
      $('.locks').hide();
    }

    if (type.val() == 5 || type.val() == 34) {
      $("#renov").css("display", "inline");
    } else {
      $("#renov").css("display", "none");
    }

    if (type.val() == 2 && group == 2 || type.val() == 3 && group == 4 || type.val() == 5 && group == 2 || type.val() == 6 && group == 3 || type.val() == 7 && group == 3 || type.val() == 9 && group == 11) {
      $("#frame-image").css({ "background-image": "url(/assets/images/frame/" + type.val() + ".gif)", "background-size": "cover" });
      $(".main-frame").addClass("checkedType");
      $("#frame-name").text(type.text() + ":");
    } else if (group == 5) {
      $('.glass-width').addClass("checkedType");
    } else if (group == 16 && type.val() == 11) {
      $('.main-furniture').addClass("checkedType");
    } else if (group == 2) {
      $("#frame-image").css({ "background": "url(/assets/images/frame/" + 5 + ".gif)", "background-size": "cover" });
      $(".main-frame").addClass("checkedType");
      $("#frame-name").text(type.text() + ":");
      if (type.val() == 2) {
        $("#doorsil").css("display", "none");
      } else {
        $("#doorsil").css("display", "inline");
      }
    } else {
      $("#frame-image").css("background", "none");
    }
    $('.opener').hide();
  });

  /*
    * Check if group name is frame
  */
  $("#group-name").change(function() {
    $("#type-name").trigger("change");
    var setGroup = $("#group-name option:selected").val();

    if (addNewItem) {
      var allowedGroups = [];
      if (addElement) {
        if (mouldedSet.indexOf(parseInt(setGroup)) !== -1) {
          allowedGroups = pieceElement.concat(mouldedElement, weigthElement, liquidElement);
        } else if (surfaceSet.indexOf(parseInt(setGroup)) !== -1) {
          allowedGroups = mouldedElement.concat(surfaceElement, pieceElement);
        } else if (pieceSet.indexOf(parseInt(setGroup)) !== -1) {
          allowedGroups = weigthElement.concat(liquidElement, pieceElement, mouldedElement);
        }
        $.get("/base/set/item/get_element_group?groups=" + allowedGroups.join(), function (elements_groups) {
          $("#add-item-select-group").find('option').remove().end();
          for (var i = 0; i < elements_groups.length; i++) {
            $("#add-item-select-group").append("<option value='" + elements_groups[i].id + "'>" + elements_groups[i].name + "</option>");
          }
          $('.checked-rule input[name="item_rule_value"]').val('')
          $('input[name="item_rule_value"]').trigger('keyup');
          $("#add-item-select-group").trigger("change");
        });
      } else {
        if (mouldedSet.indexOf(parseInt(setGroup)) !== -1) {
          allowedGroups = pieceSet.concat(mouldedSet);
        } else if (surfaceSet.indexOf(parseInt(setGroup)) !== -1) {
          allowedGroups = mouldedSet.concat(surfaceSet, pieceSet);
        } else if (pieceSet.indexOf(parseInt(setGroup)) !== -1) {
          allowedGroups = pieceSet.concat(mouldedSet);
        }
        $.get("/base/set/item/get_set_group?groups=" + allowedGroups.join(), function (sets_group) {
          $("#add-item-select-group").find('option').remove().end();
          for (var i = 0; i < sets_group.length; i++) {
            $("#add-item-select-group").append("<option value='" + sets_group[i].id + "'>" + sets_group[i].name + "</option>");
          }
          $('.checked-rule input[name="item_rule_value"]').val('')
          $('input[name="item_rule_value"]').trigger('keyup');
          $("#add-item-select-group").trigger("change");
        });
      }
    }
    $('.opener').hide();
  });

  /*
    * Onload check set type
  */
  $("#type-name").trigger('change');
  $("#add-item-select-group").trigger("change");


  /** Remove element/set from set(lists_contents) */
  $('.remove-item').click(function(e) {
    e.preventDefault();
    var itemId = $(this).attr('data');
    var parentId = $(this).attr('value');
    var contentsId = $(this).attr('data-list');

    $.post('/base/set/contents/removeItem', {
      itemId: itemId,
      parentId: parentId,
      contentsId: contentsId
    }, function(data) {
      if (data.status) {
        $('p[data="' + contentsId + '"]').remove();
        $.toast({
          text : i18n.t('The child element removed'),
          showHideTransition: 'fade',
          allowToastClose: true,
          hideAfter: 3000,
          stack: 5,
          position: {top: '60px', right: '30px'},
        });
      } else {
        $.toast({
          text : 'Error.',
          showHideTransition: 'fade',
          allowToastClose: true,
          hideAfter: 3000,
          stack: 5,
          position: {top: '60px', right: '30px'},
          bgColor: '#FF6633',
          textColor: '#fff',
        });
      }
    });
  });
  /*
    * Add element/set to set
  */

    /*
      * Rules logic
    */
    // Sets
    var mouldedSet = [3, 7, 22, 4, 21, 10, 19, 9, 8, 2, 13, 12, 25, 5, 11]; // Погонажные: !Уплотнители отсутствуют
    var surfaceSet = [20, 6, 26]; // Поверхностные:
    var pieceSet = [23, 24, 16, 17, 18, 27, 33]; // Штучные:
    var weigthSet = []; // Весовые: Отсутствуют
    var liquidSet = []; // Жидкие: Отсутствуют
    // Elements
    var mouldedElement = [3, 5, 1]; // Погонажные: !Дистанционные рамки, !Импост, !Козырьки/Нащельники, !Москитные сетки профиль, !Откосы, !Отливы, !Подоконники, !Рама, !Расширительные профиля, !Соединительные профиля, !Шпрос, !Штапик
    var surfaceElement = [9, 8]; // Поверхностные: !Москитные сетки, !Створка
    var pieceElement = [17, 2, 6]; // Штучные: !Ручки, !Штучные прочее
    var weigthElement = [21]; // Весовые:
    var liquidElement = [10]; // Жидкие:
    //var liquidElement = [10]; // Жидкие:
    var addElement = false;
    var addNewItem = false;
    var getItemsRoute = '';

    // On click "Add element" - get all elements groups
    $("#addElement").click(function (event) {
      event.preventDefault();
      startLoader();
      addNewItem = true;
      var allowedGroups = [];
      var setGroup = $('#group-name').val();
      if (mouldedSet.indexOf(parseInt(setGroup)) !== -1) {
        allowedGroups = pieceElement.concat(mouldedElement, weigthElement, liquidElement);
      } else if (surfaceSet.indexOf(parseInt(setGroup)) !== -1) {
        allowedGroups = mouldedElement.concat(surfaceElement, pieceElement);
      } else if (pieceSet.indexOf(parseInt(setGroup)) !== -1) {
        allowedGroups = weigthElement.concat(liquidElement, pieceElement, mouldedElement, surfaceElement);
      }

      $(".add-item-block").hide();
      $('.add-item-btn').removeClass('add-item-typed');
      $('.checked-rule input[name="item_rule_value"]').val('');
      $('input[name="item_rule_value"]').trigger('keyup');
      addElement = true;
      $(".header-add-item").text(i18n.t('Add element'));
      $("#group-item").text(i18n.t('Element group'));
      $("#item-name").text(i18n.t('Element'));
      $.get("/base/set/item/get_element_group?groups=" + allowedGroups.join(), function (elements_groups) {
        $("#add-item-select-group").find('option').remove().end();
        for (var i = 0; i < elements_groups.length; i++) {
          $("#add-item-select-group").append("<option value='" + elements_groups[i].id + "'>" + elements_groups[i].name + "</option>");
        }
        stopLoader();
        $(".add-item-block").show(200).addClass("add-item-click");
        $("#add-item-select-group").trigger("change"); // get all elements of selected group
      });
      $.get('/base/set/item/get_hardware_colors', function (hardware_colors) {
        $("#add-item-color-furniture").find('option').remove().end();
        for (var i = 0, len = hardware_colors.length; i < len; i++) {
          $('#add-item-color-furniture').append('<option value="' + hardware_colors[i].id + '">' + hardware_colors[i].name + '</option>');
        }
        $('#add-item-color-furniture').val('0');
      });
      $.get('/base/set/item/get_lamination_types', function (lamination_types) {
        $('#add-item-color-profile').find('option').remove().end();
        for (var i = 0, len = lamination_types.length; i < len; i++) {
          $('#add-item-color-profile').append('<option value="' + lamination_types[i].id + '">' + lamination_types[i].name + '</option>');
        }
        $('#add-item-color-profile').val('0');
      });
    });

    // On click "Add set" - get all sets groups
    $("#addSet").click(function (event) {
      event.preventDefault();
      startLoader();
      addNewItem = true;
      var allowedGroups = [];
      var setGroup = $('#group-name').val();
      if (mouldedSet.indexOf(parseInt(setGroup)) !== -1) {
        allowedGroups = pieceSet.concat(mouldedSet);
      } else if (surfaceSet.indexOf(parseInt(setGroup)) !== -1) {
        allowedGroups = mouldedSet.concat(surfaceSet, pieceSet);
      } else if (pieceSet.indexOf(parseInt(setGroup)) !== -1) {
        allowedGroups = pieceSet.concat(mouldedSet, surfaceSet);
      }

      $(".add-item-block").hide();
      $('.add-item-btn').removeClass('add-item-typed');
      $('.checked-rule input[name="item_rule_value"]').val('')
      addElement = false;
      $(".header-add-item").text(i18n.t('Add set'));
      $("#group-item").text(i18n.t('Set group'));
      $("#item-name").text(i18n.t('Set'));
      $.get("/base/set/item/get_set_group?groups=" + allowedGroups.join(), function (data_group) {
        $("#add-item-select-group").find('option').remove().end();
        for (var i = 0; i < data_group.lists_groups.length; i++) {
          $("#add-item-select-group").append("<option value='" + data_group.lists_groups[i].id + "'>" + data_group.lists_groups[i].name + "</option>");
        }

        $("#add-item-select-reinforcement").find('option').remove().end();
        $("#add-item-select-reinforcement").append("<option value='0'>" + i18n.t('Not exist') + "</option>");
        for (var i = 0; i < data_group.armir_types.length; i++) {
          $("#add-item-select-reinforcement").append("<option value='" + data_group.armir_types[i].id + "'>" + data_group.armir_types[i].name + "</option>");
        }

        $(".add-item-block").show(200).addClass("add-item-click");
        $("#add-item-select-group").trigger("change"); // get all elements of selected group
        stopLoader();
      });
      $.get('/base/set/item/get_hardware_colors', function (hardware_colors) {
        $("#add-item-color-furniture").find('option').remove().end();
        for (var i = 0, len = hardware_colors.length; i < len; i++) {
          $('#add-item-color-furniture').append('<option value="' + hardware_colors[i].id + '">' + hardware_colors[i].name + '</option>');
        }
        $('#add-item-color-furniture').val('0');
      });
      $.get('/base/set/item/get_lamination_types', function (lamination_types) {
        $('#add-item-color-profile').find('option').remove().end();
        for (var i = 0, len = lamination_types.length; i < len; i++) {
          $('#add-item-color-profile').append('<option value="' + lamination_types[i].id + '">' + lamination_types[i].name + '</option>');
        }
        $('#add-item-color-profile').val('0');
      });
    });

    // On select "group of element/set" - get all elements/sets of selected group
    $("#add-item-select-group").change(function() {
      changeItemGroup();
    });

    function changeItemGroup() {
      var tquery = $('#query-search-input').val();
      $('.checked-rule input[name="item_rule_value"]').val('');
      $('input[name="item_rule_value"]').trigger('keyup');
      var itemGroup = $("#add-item-select-group option:selected").val();
      var setGroup = $("#group-name option:selected").val();

      if (parseFloat(itemGroup) === 7) {
        $(".add-reinforcement-type").show();
      } else {
        $(".add-reinforcement-type").hide();
      }

      if (addElement) {
        console.log('add element = true');
        var getItemsRoute = '/base/set/item/get_elements/';
        var pieceItem = pieceElement;
        var mouldedItem = mouldedElement;
        var weigthItem = weigthElement;
        var liquidItem = liquidElement;
        var surfaceItem = surfaceElement;
      } else {
        console.log('add element = false');
        var getItemsRoute = '/base/set/item/get_sets/';
        var pieceItem = pieceSet;
        var mouldedItem = mouldedSet;
        var weigthItem = weigthSet;
        var liquidItem = liquidSet;
        var surfaceItem = surfaceSet;
      }

      $(".checked-rule").removeClass("checked-rule");
      /* Погонажный набор */
      if (mouldedSet.indexOf(parseInt(setGroup)) !== -1 && pieceItem.indexOf(parseInt(itemGroup)) !== -1) { // Погонажный (набор) + Штучный (элемент)
        $(".linear-peace").addClass("checked-rule");
      } else if (mouldedSet.indexOf(parseInt(setGroup)) !== -1 && mouldedItem.indexOf(parseInt(itemGroup)) !== -1) { // Погонажный (набор) + Погонажный (элемент)
        $(".linear-linear").addClass("checked-rule");
      } else if (mouldedSet.indexOf(parseInt(setGroup)) !== -1 && weigthItem.indexOf(parseInt(itemGroup)) !== -1) { // Погонажный (набор) + Весовой (элемент)
        $(".linear-weight ").addClass("checked-rule");
      } else if (mouldedSet.indexOf(parseInt(setGroup)) !== -1 && liquidItem.indexOf(parseInt(itemGroup)) !== -1) { // Погонажный (набор) + Жидкий (элемент)
        $(".linear-liquid ").addClass("checked-rule");
      }
      /* Поверхностный набор */
        else if (surfaceSet.indexOf(parseInt(setGroup)) !== -1 && mouldedItem.indexOf(parseInt(itemGroup)) !== -1) { // Поверхностный (набор) + Погонажный (элемент)
        $(".surface-linear").addClass("checked-rule");
      } else if (surfaceSet.indexOf(parseInt(setGroup)) !== -1 && surfaceItem.indexOf(parseInt(itemGroup)) !== -1) { // Поверхностный (набор) + Поверхностный (элемент)
        $(".surface-surface").addClass("checked-rule");
      } else if (surfaceSet.indexOf(parseInt(setGroup)) !== -1 && pieceItem.indexOf(parseInt(itemGroup)) !== -1) { // Поверхностный (набор) + Штучный (элемент)
        $(".surface-peace").addClass("checked-rule");
      }
      /* Штучный набор */
        else if (pieceSet.indexOf(parseInt(setGroup)) !== -1 && pieceItem.indexOf(parseInt(itemGroup)) !== -1) { // Штучный (набор) + Штучный (элемент)
        $(".peace-peace").addClass("checked-rule");
      } else if (pieceSet.indexOf(parseInt(setGroup)) !== -1 && weigthItem.indexOf(parseInt(itemGroup)) !== -1) { // Штучный (набор) + Весовой/Жидкий (элемент)
        $(".peace-weight").addClass("checked-rule");
      } else if (pieceSet.indexOf(parseInt(setGroup)) !== -1 && liquidItem.indexOf(parseInt(itemGroup)) !== -1) { // Штучный (набор) + Весовой/Жидкий (элемент)
        $(".peace-liquid").addClass("checked-rule");
      } else if (pieceSet.indexOf(parseInt(setGroup)) !== -1 && mouldedItem.indexOf(parseInt(itemGroup)) !== -1) {
        $(".size-parent").addClass("checked-rule");
      } else if (pieceSet.indexOf(parseInt(setGroup)) !== -1 && surfaceItem.indexOf(parseInt(itemGroup)) !== -1) {
        $(".size-square-parent").addClass("checked-rule");
      } 
      else {
        $(".not-exist").addClass("checked-rule");
      }
      console.log(getItemsRoute + itemGroup)
      $.get(getItemsRoute + itemGroup + '?tquery=' + tquery, function (items) {
        $("#add-item-select-name").find('option').remove().end();
        for (var i = 0; i < items.length; i++) {
          $("#add-item-select-name").append("<option value='" + items[i].id + "'>" + items[i].name + "</option>")
        }
        if (!items.length) {
          $("#add-item-select-name").append("<option value='-1'>" + i18n.t('Elements not exist') + "</option>")
        }
      });
    }


  $(".add-item-btn").click(function (event) {
    event.preventDefault();
    var setId = $(this).attr('value');
    var groupId = $('#add-item-select-group option:selected').val();
    var itemId = $('#add-item-select-name option:selected').val();
    var ruleId = $('.checked-rule select[name="item_rule"]').val();
    var ruleValue = $('.checked-rule input[name="item_rule_value"]').val();
    var directionId = $('input[name="direction"]:checked').val();
    var itemType = (addElement) ? 'element' : 'list';
    var laminationId = $('#add-item-color-profile option:selected').val();
    var hardwareColorId = $('#add-item-color-furniture option:selected').val();
    var item_rounding_type = $('select[name="item_rounding_type"]').val();
    var item_rounding_value = $('input[name="item_rounding_value"]').val() || 0.00;
    var reinforcementType = $('#add-item-select-reinforcement option:selected').val() || 0;

    $.post('/base/set/item/add_new/' + setId, {
      child_id: itemId,
      child_type: itemType,
      value: ruleValue,
      rules_type_id: ruleId,
      direction_id: directionId,
      window_hardware_color_id: hardwareColorId,
      lamination_type_id: laminationId,
      item_rounding_type: item_rounding_type,
      item_rounding_value: item_rounding_value,
      reinforcement_type: reinforcementType
    }, function() {
      window.location = '/base/set/' + setId;
    });
  });

  $('input[name="item_rule_value"]').keyup(function() {
    var value = $('.checked-rule input[name="item_rule_value"]').val();

    if (value && value.replace(',', '.') > 0 && $('#add-item-select-name').val() > -1) {
      $('.add-item-btn').addClass('add-item-typed');
    } else {
      $('.add-item-btn').removeClass('add-item-typed');
    }
  });

  /*
    * Close button - close add element/set
  */
  $(".close-button-item").click(function (event) {
    event.preventDefault();
    addNewItem = false;
    $(".add-item-click").removeClass("add-item-click").hide(200);
  });

  /*
    * Close button - close frame block
  */
  $(".close-button-frame").click(function (event) {
    event.preventDefault();
    $('.opener').show();
    $(".main-frame").removeClass("checkedType");
  });

  /** Open frame block */
  $('.open-button-frame').click(function (event) {
    event.preventDefault();
    $('.opener').hide();
    $(".main-frame").addClass("checkedType");
  })

  /** Add item query search */
  $('#query-search-input').keyup(function() {
    changeItemGroup();
  });

  /** Add img */
  $('#set-img').click(function(e) {
    e.preventDefault();
    $('#select-set-image').trigger('click');
  });

  $('#select-set-image').change(function (evt) {
    var files = evt.target.files;
    for (var i = 0, f; f = files[i]; i++) {
      // Only process image files.
      if (!f.type.match('image.*')) {
        continue;
      }
      var reader = new FileReader();
      // Closure to capture the file information.
      reader.onload = (function(theFile) {
        return function(e) {
          $('#set-image').attr('src', e.target.result);
        };
      })(f);
      reader.readAsDataURL(f);
    }
  });

  /*
    * Save set
  */
  $("#saveSet").click(function (event) {
    event.preventDefault();
    var beeds_widths = [];
    var setId = $(this).attr('data-set');
    var groupId = $('#group-name').val();
    var additionalFolderId = 0;

    var checkedProfiles = [];
    var uncheckedProfiles = [];

    if (groupId == 8) {
      additionalFolderId = $('#sills-group').val();
      _saveAdditionalFolder(setId, additionalFolderId);
      additionalFolderId = $('#sill-group-color').val();
      _saveAdditionalColor(setId, additionalFolderId);
    } else if (groupId == 9) {
      additionalFolderId = $('#spillways-group').val();
      _saveAdditionalFolder(setId, additionalFolderId);
      additionalFolderId = $('#spillway-group-color').val();
      _saveAdditionalColor(setId, additionalFolderId);
    } else if (groupId == 14) {
      additionalFolderId = $('#holes-group').val();
      _saveAdditionalFolder(setId, additionalFolderId);
    } else if (groupId == 21) {
      additionalFolderId = $('#visors-group').val();
      _saveAdditionalFolder(setId, additionalFolderId);
      additionalFolderId = $('#visors-group-color').val();
      _saveAdditionalColor(setId, additionalFolderId);
    } else if (groupId == 12) {
      additionalFolderId = $('#connectors-group').val();
      _saveAdditionalFolder(setId, additionalFolderId);
      additionalFolderId = $('#connectors-group-color').val();
      _saveAdditionalColor(setId, additionalFolderId);
    } else if (groupId == 24) {
      additionalFolderId = $('#doorhandles-group').val();
      _saveAdditionalFolder(setId, additionalFolderId);
      additionalFolderId = $('#doorhandles-group-color').val();
      _saveAdditionalColor(setId, additionalFolderId);
    } else if (groupId == 18) {
      additionalFolderId = $('#otherElems-group').val();
      _saveAdditionalFolder(setId, additionalFolderId);
      additionalFolderId = $('#otherElems-group-color').val();
      _saveAdditionalColor(setId, additionalFolderId);
    } else if (groupId == 10) {
      additionalFolderId = $('#mosquitos-group-color').val();
      _saveAdditionalColor(setId, additionalFolderId);
    } else if (groupId == 16) {
      additionalFolderId = $('#decors-group-color').val();
      _saveAdditionalColor(setId, additionalFolderId);
    }

    $("input[name='foo']").each(function() {
      if ($(this).prop('checked')) {
        checkedProfiles.push($(this).val());
      } else {
        uncheckedProfiles.push($(this).val());
      }
    });
    $.post('/base/set/setListProfileSystems/' + setId, {
      checked: checkedProfiles.join(','),
      unchecked: uncheckedProfiles.join(',')
    }, function(data) {        
    });

    $('.beed_width').each(function() {
      var profileSystemId = $(this).attr('data-beed');
      var beedWidth = $(this).val();
      beeds_widths.push(JSON.stringify({profileSystemId: profileSystemId, beedWidth: beedWidth}));
    });
    if (beeds_widths.length) {
      for (var i = 0, len = beeds_widths.length; i < len; i++) {
        $.post('/base/set/saveBeedWidths/' + setId, {
          beeds_widths: beeds_widths[i]
        }, function(data) {
          if (data.status) {
          }
        });
      }
      $("#main-form").submit();
    } else {
      $("#main-form").submit();
    }
  });
  /** Init pop up */
  $('.edit-child-item-pop-up').popup({
    type: 'overlay',
    autoopen: false,
    scrolllock: true,
    transition: 'all 0.3s'
  });
  $('.alert-remove-popup').popup({
    type: 'overlay',
    autoopen: false,
    scrolllock: true,
    transition: 'all 0.3s'
  });

  function showAvailableLockLists (e) {
    e.preventDefault();
    $(this).prop('disabled', true);
    $('.available-lock-lists').show();
  }

  function submitLockList (e) {
    e.preventDefault();

    var listId = $(this).attr('data-list');
    var accessoryId = $('#lock-set-select option:selected').val();
    var accessoryName = $('#lock-set-select option:selected').text();
    $.post('/base/set/lock/accessory', {
      listId: listId,
      accessoryId: accessoryId
    }, function (data) {
      if (data.status) {
        $('.empty-lock-list').remove();

        $('ul.lock-list-container').append('<li class="lock-list-item" data-id="' + data.id + '">' +
          accessoryName +
          '<input type="button" ' +
            'data-id="' + data.id + '"' +
            'data-list-id="' + listId + '" ' +
            'data-accessory-id="' + accessoryId + '" ' +
            'class="remove-btn remove-lock-set pull-right" ' +
          'value="">' +
        '</li>');
        $('input.remove-lock-set[data-id="' + data.id + '"]').click(removeLockList);
        $('.available-lock-lists').show();
        $.toast({
          text : i18n.t('Accessory added'),
          showHideTransition: 'fade',
          allowToastClose: true,
          hideAfter: 3000,
          stack: 5,
          position: {top: '60px', right: '30px'},
        });
      }
    });
  }

  function removeLockList (e) {
    e.preventDefault();

    var id = $(this).attr('data-id');
    var accessoryId = $(this).attr('data-accessory-id');

    Temprorary.init(id, accessoryId);
    popups.removeLockList();
  }

  function submitRemoveLockList (e) {
    e.preventDefault();

    /** WTF? there are not DELETE method in JQUERY */
    $.post('/base/set/lock/accessory/remove', {
      id: Temprorary.get('id'),
      accessoryId: Temprorary.get('accessoryId')
    }, function (data) {
      if (data.status) {
        $('li.lock-list-item[data-id="' + Temprorary.get('id') + '"]').remove();
        $.toast({
          text : i18n.t('Accessory removed'),
          showHideTransition: 'fade',
          allowToastClose: true,
          hideAfter: 3000,
          stack: 5,
          position: {top: '60px', right: '30px'},
        });

        if ($('ul.lock-list-container li').length === 0) {
          $('ul.lock-list-container').append('<li class="pull-center empty-lock-list">' +
            i18n.t('Empty') +
          '</li>');
        }

        $('.delete-alert').popup('hide');

        Temprorary.destroy();
      }
    });
  }

  function _saveAdditionalFolder(setId, folderId) {
    $.post('/base/set/save-additional-folder/' + setId, {
      folderId: folderId
    }, function(data) {});
  }
  function _saveAdditionalColor(setId, colorId) {
    $.post('/base/set/save-additional-color/' + setId, {
      colorId
    }, function(data) {});
  }

  function checkListAvalabilityAsPush (e) {
    console.log('her')
    if (!$(this).prop('checked')) return;

    e.preventDefault();
    var self = this;
    var listId = $('#saveSet').attr('data-set');
    var groupId = $('#group-name').val();

    $.get('/base/set/is-push/' + listId + '/' + groupId, function (data) {
      console.log(data)
      if (data.status) {
        if (data.isAvailable) {
          $(self).prop('checked', true);
        } else {
          showToaster(data.message, true);
        }
      }
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
