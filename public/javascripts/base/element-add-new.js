$(function () {
  var localizerOption = { resGetPath: '/assets/javascripts/vendor/localizer/__ns__-__lng__.json'};
  i18n.init(localizerOption);

  var tableWidth = 1;
  /*
    * select all profile items
  */
  $("#select-all-profiles").change(function () {
    if ($(this).is(":checked")) {
      $("[name='foo']").each(function () {
        $(this).prop('checked', true);
      });
    } else {
      $("[name='foo']").each(function () {
        $(this).prop('checked', false);
      });
    }
  });
  
  /*
    * change content depending on kind of group
  */
  $("#group-name").change(function () {
    var elementId = $("#element-id").text();
    $("#group-name option:selected").each(function () {
      $(".checkedGroup").removeClass("checkedGroup");
      if ($(this).val() == 8) {
        $(".main-glass").addClass("checkedGroup");
        $(".header-main-body").text($(this).text() + ":");
      } else if ($(this).val() == 1) {
        $('.main-profile').addClass('checkedGroup');
        $(".header-main-body").text($(this).text() + ":");
      } else if ($(this).val() == 19 || $(this).val() == 2) {
        $("#type-name").trigger('change');
        $(".header-main-body").text($(this).text() + ":");
      } else {
        $(".header-main-body").text($(this).text() + ":");
      }
    });
  });

  /*
    * выпадающий список на -> Группа: "Профили дополнительные" + Тип элемента: "Козырек/Нащельник/Подоконник/Отлив"
    *                         Группа: "Фурнитура"              + Тип элемента: "Ручки"
  */
  $("#type-name").change(function () {
    $(".main-furniture").removeClass("checkedGroup");
    var groupName = $("#group-name option:selected").val();
    $("#type-name option:selected").each(function () {
      if ($(this).val() == 24 && groupName == 2) {
        $(".main-furniture").addClass("checkedGroup");
      }
    });
  });

  /**
   * Document on load
   */
  $("#group-name").trigger("change");    

  /*
    * Load element image
  */
  $('#add-element-image').click(function (event) {
    event.preventDefault();

    $('#select-element-image').trigger('click');
  });
  
  $('#select-element-image').change(function (evt) {
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
          $('#element-image').attr('src', e.target.result);
        };
      })(f);
      reader.readAsDataURL(f);
    }
  });
  /*
    * Submit form
  */
  $("#saveElement").click(function (e) {
    e.preventDefault();

    validate(function (data) {
      if (data.status) {
        $('.loader-ico').show();
        var formData = new FormData($('#main-form')[0]);
        $.ajax({
          url: '/base/element/add/1',
          type: 'POST',
          success: function(data) {
            submitSavingElement(data);
          },
          data: formData,
          cache: false,
          contentType: false,
          processData: false
        });
      } else {
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
      }
    });
  });

  /**
   * Glass prices table logic
   */
    /* primary column */
    $('#primary-select').change(function(e) {
      e.preventDefault();
      if ($(this).val() === '1') {
        var rangePrimary = parseFloat($('#primary-range').val()) || 0.00;
        tableWidth = 2;
        console.log('tableWidth: ' + tableWidth);
        $('#secondary-0-range').val((+rangePrimary + 0.01).toFixed(2));
        $('.secondary, .secondary-0').show();
      } else {
        tableWidth = 1;
        console.log('tableWidth: ' + tableWidth);
        $('.secondary-0, .secondary-1, .secondary, .tertiary, .tertiary-0, .tertiary-1, .fourth, .fourth-0, .fourth-1, .fifth').hide();
        $('#secondary-value, #tertiary-value, #fourth-value').css('width', '125px');
        $('.table-glass-price').css('width', '490px');
      }
    });
    /* secondary column */
    $('#secondary-0-select').change(function(e) {
      e.preventDefault();
      if ($(this).val() === '1') {
        var rangeSecondary1 = parseFloat($('#secondary-0-range').val()) || 0.00;
        tableWidth = 3;
        console.log('tableWidth: ' + tableWidth);
        $('#secondary-1-range').val(rangeSecondary1);
        $('#secondary-2-range').val((+rangeSecondary1 + 0.02).toFixed(2));
        $('#tertiary-0-range').val((+rangeSecondary1 + 0.03).toFixed(2));
        $('.secondary-0').hide();
        $('#secondary-value').css('width', '195px');
        $('.secondary-1, .tertiary, .tertiary-0').show();
        $(this).val('0');
      }
    });

    $('#secondary-1-select').change(function(e) {
      e.preventDefault();
      if ($(this).val() === '0') {
        tableWidth = 2;
        $('.secondary-1, .tertiary, .tertiary-0, .tertiary-1, .fourth, .fourth-0, .fourth-1, .fifth').hide();
        $('#secondary-value, #tertiary-value, #fourth-value').css('width', '125px');
        $('.table-glass-price').css('width', '490px');
        $('.secondary-0').show();
        $(this).val('1');
      }
    });

    /* tertiary column */
    $('#tertiary-0-select').change(function(e) {
      e.preventDefault();
      if ($(this).val() === '1') {
        tableWidth = 4;
        var rangeTeriary1 = parseFloat($('#tertiary-0-range').val());
        $('#tertiary-1-range').val(rangeTeriary1);
        $('#tertiary-2-range').val((+rangeTeriary1 + 0.02).toFixed(2));
        $('#fourth-0-range').val((+rangeTeriary1 + 0.03).toFixed(2));
        $('.tertiary-0').hide();
        $(this).val('0');
        $('.tertiary-1, .fourth, .fourth-0').show();
        $('#tertiary-value').css('width', '195px');
        $('.table-glass-price').css('width', '700px');
      }
    });

    $('#tertiary-1-select').change(function(e) {
      e.preventDefault();

      if ($(this).val() === '0') {
        tableWidth = 3;
        $('.tertiary-1, .fourth, .fourth-0, .fourth-1, .fifth').hide();
        $('.tertiary-0').show();
        $('#tertiary-value, #fourth-value').css('width', '125px');
        $('.table-glass-price').css('width', '490px');
        $(this).val('1');
      }
    });

    /* fourth column */
    $('#fourth-0-select').change(function(e) {
      e.preventDefault();
      if ($(this).val() === '1') {
        tableWidth = 5;
        var rangeFourth1 = parseFloat($('#fourth-0-range').val());
        $('#fourth-1-range').val(rangeFourth1);
        $('#fourth-2-range').val((+rangeFourth1 + 0.02).toFixed(2));
        $('#fifth-range').val((+rangeFourth1 + 0.03).toFixed(2));
        $('.fourth-0').hide();
        $(this).val('0');
        $('.fourth-1, .fifth').show();
        $('#fourth-value').css('width', '195px');
        $('.table-glass-price').css('width', '910px');
      }
    });

    $('#fourth-1-select').change(function(e) {
      e.preventDefault();
      if ($(this).val() === '0') {
        tableWidth = 4;
        $('.fourth-0').show();
        $(this).val('1');
        $('.fourth-1, .fifth').hide();
        $('#fourth-value').css('width', '125px');
        $('.table-glass-price').css('width', '700px');
      }
    });

  /**
   * Open image popup
   */
  $('#element-image').click(function (e) {
    e.preventDefault();
    var imgSrc = $(this).attr('src');
    $('#element-image-popup').attr('src', imgSrc);
    $('.element-image-popup').popup('show');
  });
  /**
   * Init popup
   */
  $('.element-image-popup').popup({
    type: 'overlay',
    autoopen: false,
    scrolllock: true,
    transition: 'all 0.3s'
  });

  /* On submit saving element */
  function saveElement(callback) {
    // /* get form data */
    // var data = {};
    // $('#main-form').serializeArray().map(function(x){data[x.name] = x.value;});

    /* get and save checked profiles */
    var checkedProfiles = [];
    var uncheckedProfiles = [];
    //var elementId = $("#element-id").text();
    $("input[name='foo']").each(function() {
      if ($(this).prop('checked')) {
        checkedProfiles.push($(this).val());
      } else {
        uncheckedProfiles.push($(this).val());
      }
    });
    // $.post('/base/element/setElementProfileSystems/' + elementId, {
    //   checked: checkedProfiles,
    //   unchecked: uncheckedProfiles
    // }, function(data) {        
    // });

    /* get and save glass prices */
    // if (tableWidth == 1) {
    //   var col_1_range = parseFloat($('#primary-range').val());
    //   var col_1_price = parseFloat($('#primary-value').val());
    // } else if (tableWidth == 2) {
    //   var col_1_range = parseFloat($('#primary-range').val());
    //   var col_1_price = parseFloat($('#primary-value').val());
    //   var col_2_range_1 = parseFloat($('#secondary-0-range').val());
    //   var col_2_price = parseFloat($('#secondary-value').val());
    // } else if (tableWidth == 3) {
    //   var col_1_range = parseFloat($('#primary-range').val());
    //   var col_1_price = parseFloat($('#primary-value').val());
    //   var col_2_range_1 = parseFloat($('#secondary-1-range').val());
    //   var col_2_range_2 = parseFloat($('#secondary-2-range').val());
    //   var col_2_price = parseFloat($('#secondary-value').val());
    //   var col_3_range_1 = parseFloat($('#tertiary-0-range').val());
    //   var col_3_price = parseFloat($('#tertiary-value').val());
    // } else if (tableWidth == 4) {
    //   var col_1_range = parseFloat($('#primary-range').val());
    //   var col_1_price = parseFloat($('#primary-value').val());
    //   var col_2_range_1 = parseFloat($('#secondary-1-range').val());
    //   var col_2_range_2 = parseFloat($('#secondary-2-range').val());
    //   var col_2_price = parseFloat($('#secondary-value').val());
    //   var col_3_range_1 = parseFloat($('#tertiary-1-range').val());
    //   var col_3_range_2 = parseFloat($('#tertiary-2-range').val());
    //   var col_3_price = parseFloat($('#tertiary-value').val());
    //   var col_4_range_1 = parseFloat($('#fourth-0-range').val());
    //   var col_4_price = parseFloat($('#fourth-value').val());
    // } else if (tableWidth == 5) {
    //   var col_1_range = parseFloat($('#primary-range').val());
    //   var col_1_price = parseFloat($('#primary-value').val());
    //   var col_2_range_1 = parseFloat($('#secondary-1-range').val());
    //   var col_2_range_2 = parseFloat($('#secondary-2-range').val());
    //   var col_2_price = parseFloat($('#secondary-value').val());
    //   var col_3_range_1 = parseFloat($('#tertiary-1-range').val());
    //   var col_3_range_2 = parseFloat($('#tertiary-2-range').val());
    //   var col_3_price = parseFloat($('#tertiary-value').val());
    //   var col_4_range_1 = parseFloat($('#fourth-1-range').val());
    //   var col_4_range_2 = parseFloat($('#fourth-2-range').val());
    //   var col_4_price = parseFloat($('#fourth-value').val());
    //   var col_5_range = parseFloat($('#fifth-range').val());
    //   var col_5_price = parseFloat($('#fifth-value').val());
    // }
    // $.post('/base/element/setGlassPrices/' + elementId, {
    //   col_1_range: col_1_range,
    //   col_1_price: col_1_price,
    //   col_2_range_1: col_2_range_1 || 0.00,
    //   col_2_range_2: col_2_range_2 || 0.00,
    //   col_2_price: col_2_price || 0.00,
    //   col_3_range_1: col_3_range_1 || 0.00,
    //   col_3_range_2: col_3_range_2 || 0.00,
    //   col_3_price: col_3_price || 0.00,
    //   col_4_range_1: col_4_range_1 || 0.00,
    //   col_4_range_2: col_4_range_2 || 0.00,
    //   col_4_price: col_4_price || 0.00,
    //   col_5_range: col_5_range || 0.00,
    //   col_5_price: col_5_price || 0.00,
    //   table_width: tableWidth
    // }, function(data) {
      callback();
    //});
  }
  /** Automatically change glass prices on change */
  $('#primary-range').change(function() {
    var value = $(this).val();
    if (isNaN(value)) {
      alert('Только числа');
    } else {
      value = parseFloat(value).toFixed(2);
      $('#secondary-0-range').val(parseFloat(+value + 0.01).toFixed(2));
      $('#secondary-1-range').val(parseFloat(+value + 0.01).toFixed(2));
      $('#secondary-1-range').trigger('change');
    }
  });

  $('#secondary-0-range').change(function () {
    var value = $(this).val();
    var prevValue = $('#primary-range').val();

    if(isNaN(value)) {
      alert('Только числа.');
    } else {
      value = parseFloat(value).toFixed(2);
      $('#primary-range').val(parseFloat(+value - 0.01).toFixed(2));
      // if (prevValue >= value) {
        
      // } else {
      //   value = parseFloat(value).toFixed(2);
      //   $('#primary-range').val(parseFloat(+value - 0.01).toFixed(2));
      // }
    }
  });

  $('#secondary-1-range').change(function() {
    var value = $(this).val();
    var nextValue = $('#secondary-2-range').val();
    var prevValue = $('#primary-range').val();
    if (isNaN(value)) {
      alert('Только числа');
    } else {
      value = parseFloat(value).toFixed(2);
      $('#primary-range').val(parseFloat(+value - 0.01).toFixed(2));
      if (nextValue < value) {
        $('#secondary-2-range').val(parseFloat(+value + 0.02).toFixed(2));
        $('#secondary-2-range').trigger('change');
      } 

      // if (prevValue >= value) {
        
      // } else {
      //   $('#primary-range').val(parseFloat(+value - 0.01).toFixed(2));
      // }
    }
  });

  $('#secondary-2-range').change(function() {
    var value = $(this).val();
    var nextValue = $('#tertiary-0-range').val();
    var prevValue = $('#secondary-1-range').val();
    var ter2 = $('#tertiary-2-range').val();
    if (isNaN(value)) {
      alert('Только числа');
    } else {
      value = parseFloat(value).toFixed(2);
      $('#tertiary-0-range').val(parseFloat(+value + 0.01).toFixed(2));
      $('#tertiary-1-range').val(parseFloat(+value + 0.01).toFixed(2));
      if (ter2 < (+value + 0.01)) {
        $('#tertiary-2-range').val(parseFloat(+parseFloat(+value + 0.01).toFixed(2) + 0.02).toFixed(2));
        $('#fourth-0-range').val(parseFloat(+parseFloat(+value + 0.02).toFixed(2) + 0.02).toFixed(2));
        $('#fourth-1-range').val(parseFloat(+parseFloat(+value + 0.02).toFixed(2) + 0.02).toFixed(2));
        $('#fourth-2-range').val(parseFloat(+parseFloat(+value + 0.04).toFixed(2) + 0.02).toFixed(2));
        $('#fourth-2-range').trigger('change');
      }
      // if (nextValue <= value) {
      //   //$('#secondary-1-range').val(parseFloat(+value + 0.01).toFixed(2));
      // } else {
      //   value = parseFloat(value).toFixed(2);
      //   $('#tertiary-0-range').val(parseFloat(+value + 0.01).toFixed(2));
      //   $('#tertiary-1-range').val(parseFloat(+value + 0.01).toFixed(2));
      // }
      if (prevValue >= value) {
        $('#secondary-1-range').val(parseFloat(+value - 0.02).toFixed(2));
        $('#secondary-1-range').trigger('change');
      }
    }
  });

  $('#tertiary-0-range').change(function () {
    var value = $(this).val();
    //var nextValue = $('#tertiary-0-range').val();
    var prevValue = $('#secondary-2-range').val();
    if (isNaN(value)) {
      alert('Только числа.');
    } else {
      value = parseFloat(value).toFixed(2);
      $('#secondary-2-range').val(parseFloat(+value - 0.01).toFixed(2));
      $('#secondary-2-range').trigger('change');
    }
  });

  $('#tertiary-1-range').change(function () {
    var value = $(this).val();
    var prevValue = $('#secondary-2-range').val();
    var nextValue = $('#tertiary-2-range').val();
    if (isNaN(value)) {
      // alert('Только числа.');
    } else {
      value = parseFloat(value).toFixed(2);
      $('#secondary-2-range').val(parseFloat(+value - 0.01).toFixed(2));
      $('#secondary-2-range').trigger('change');
      if (value > nextValue) {
        $('#tertiary-2-range').val(parseFloat(+value + 0.02).toFixed(2));
        $('#fourth-0-range').val(parseFloat(+value + 0.03).toFixed(2));
        $('#fourth-1-range').val(parseFloat(+value + 0.03).toFixed(2));
        $('#fourth-2-range').val(parseFloat(+value + 0.05).toFixed(2));
        $('#fourth-2-range').trigger('change');
      }
    }
  });

  $('#tertiary-2-range').change(function () {
    var value = $(this).val();
    var prevValue = $('#tertiary-1-range').val();
    if (isNaN(value)) {
      // alert('Только числа.');
    } else {
      value = parseFloat(value).toFixed(2);
      $('#fourth-0-range').val(parseFloat(+value + 0.01).toFixed(2));
      $('#fourth-1-range').val(parseFloat(+value + 0.01).toFixed(2));
      $('#fourth-2-range').val(parseFloat(+value + 0.03).toFixed(2));
      $('#fourth-2-range').trigger('change');
      if (prevValue > value) {
        $('#tertiary-1-range').val(parseFloat(+value - 0.02).toFixed(2));
        $('#tertiary-1-range').trigger('change');
      }
    }
  });

  $('#fourth-0-range').change(function () {
    var value = $(this).val();
    if (isNaN(value)) {
      // alert('Только числа.');
    } else {
      value = parseFloat(value).toFixed(2);
      $('#tertiary-2-range').val(parseFloat(+value - 0.01).toFixed(2));
      $('#tertiary-2-range').trigger('change');
    }
  });

  $('#fourth-1-range').change(function () {
    var value = $(this).val();
    var nextValue = $('#fourth-2-range').val();
    if (isNaN(value)) {
      // alert('Только числа.');
    } else {
      value = parseFloat(value).toFixed(2);
      $('#tertiary-2-range').val(parseFloat(+value - 0.01).toFixed(2));
      $('#tertiary-2-range').trigger('change');
      if (value > nextValue) {
        $('#fourth-2-range').val(parseFloat(+value + 0.02).toFixed(2));
        $('#fourth-2-range').trigger('change');
      }
    }
  });

  $('#fourth-2-range').change(function () {
    var value = $(this).val();
    var prevValue = $('#fourth-1-range').val();
    if (isNaN(value)) {
      // alert('Только числа.');
    } else {
      value = parseFloat(value).toFixed(2);
      $('#fifth-range').val(parseFloat(+value + 0.01).toFixed(2));
      if (prevValue > value) {
        $('#fourth-1-range').val(parseFloat(+value - 0.02).toFixed(2));
        $('#fourth-1-range').trigger('change');
      }
      //$('#tertiary-2-range').trigger('change');
    }
  });

  function submitSavingElement(id) {
    var checkedProfiles = [];
    var uncheckedProfiles = [];
    var checkedGlasses = [];
    var uncheckedGlasses = [];
    var elementId = id;
    var col_1_range, col_1_price, col_2_range_1, col_2_range_2, col_2_price,
        col_3_range_1, col_3_range_2, col_3_price, col_4_range_1, col_4_range_2,
        col_4_price, col_5_range, col_5_price;

    $("input[name='foo']").each(function() {
      if ($(this).prop('checked')) {
        checkedProfiles.push($(this).val());
      } else {
        uncheckedProfiles.push($(this).val());
      }
    });

    $.post('/base/element/setElementProfileSystems/' + elementId, {
      checked: checkedProfiles.join(','),
      unchecked: uncheckedProfiles.join(',')
    }, function(data) {        
    });


    $("input[name='glasses_folders']").each(function() {
      if ($(this).prop('checked')) {
        checkedGlasses.push($(this).val());
      } else {
        uncheckedGlasses.push($(this).val());
      }
    });

    $.post('/base/element/setElementGlassesFolders/' + elementId, {
      checked: checkedGlasses.join(','),
      unchecked: uncheckedGlasses.join(',')
    }, function(data) {        
    });

    /* get and save glass prices */
    if (tableWidth == 1) {
      col_1_range = parseFloat($('#primary-range').val());
      col_1_price = parseFloat($('#primary-value').val());
    } else if (tableWidth == 2) {
      col_1_range = parseFloat($('#primary-range').val());
      col_1_price = parseFloat($('#primary-value').val());
      col_2_range_1 = parseFloat($('#secondary-0-range').val());
      col_2_price = parseFloat($('#secondary-value').val());
    } else if (tableWidth == 3) {
      col_1_range = parseFloat($('#primary-range').val());
      col_1_price = parseFloat($('#primary-value').val());
      col_2_range_1 = parseFloat($('#secondary-1-range').val());
      col_2_range_2 = parseFloat($('#secondary-2-range').val());
      col_2_price = parseFloat($('#secondary-value').val());
      col_3_range_1 = parseFloat($('#tertiary-0-range').val());
      col_3_price = parseFloat($('#tertiary-value').val());
    } else if (tableWidth == 4) {
      col_1_range = parseFloat($('#primary-range').val());
      col_1_price = parseFloat($('#primary-value').val());
      col_2_range_1 = parseFloat($('#secondary-1-range').val());
      col_2_range_2 = parseFloat($('#secondary-2-range').val());
      col_2_price = parseFloat($('#secondary-value').val());
      col_3_range_1 = parseFloat($('#tertiary-1-range').val());
      col_3_range_2 = parseFloat($('#tertiary-2-range').val());
      col_3_price = parseFloat($('#tertiary-value').val());
      col_4_range_1 = parseFloat($('#fourth-0-range').val());
      col_4_price = parseFloat($('#fourth-value').val());
    } else if (tableWidth == 5) {
      col_1_range = parseFloat($('#primary-range').val());
      col_1_price = parseFloat($('#primary-value').val());
      col_2_range_1 = parseFloat($('#secondary-1-range').val());
      col_2_range_2 = parseFloat($('#secondary-2-range').val());
      col_2_price = parseFloat($('#secondary-value').val());
      col_3_range_1 = parseFloat($('#tertiary-1-range').val());
      col_3_range_2 = parseFloat($('#tertiary-2-range').val());
      col_3_price = parseFloat($('#tertiary-value').val());
      col_4_range_1 = parseFloat($('#fourth-1-range').val());
      col_4_range_2 = parseFloat($('#fourth-2-range').val());
      col_4_price = parseFloat($('#fourth-value').val());
      col_5_range = parseFloat($('#fifth-range').val());
      col_5_price = parseFloat($('#fifth-value').val());
    }
    $.post('/base/element/setGlassPrices/' + elementId, {
      col_1_range: col_1_range,
      col_1_price: col_1_price,
      col_2_range_1: col_2_range_1 || 0.00,
      col_2_range_2: col_2_range_2 || 0.00,
      col_2_price: col_2_price || 0.00,
      col_3_range_1: col_3_range_1 || 0.00,
      col_3_range_2: col_3_range_2 || 0.00,
      col_3_price: col_3_price || 0.00,
      col_4_range_1: col_4_range_1 || 0.00,
      col_4_range_2: col_4_range_2 || 0.00,
      col_4_price: col_4_price || 0.00,
      col_5_range: col_5_range || 0.00,
      col_5_price: col_5_price || 0.00,
      table_width: tableWidth
    }, function(data) {
      window.location.href = document.referrer;
    });
  }

  function getListContents(i, len, id) {
    $.get('/base/element/getListContents/' + id, function(data) {
      //if (data.length) {
        var eChilds = data.elements;
        var lChilds = data.lists;
        for (var j = 0, len2 = eChilds.length; j < len2; j++) {
          if (eChilds[j].list_content.rules_type_id === 3 || eChilds[j].list_content.rules_type_id === 2 || eChilds[j].list_content.rules_type_id === 15 || eChilds[j].list_content.rules_type_id === 4 || eChilds[j].list_content.rules_type_id === 6 || eChilds[j].list_content.rules_type_id === 7 || eChilds[j].list_content.rules_type_id === 8 || eChilds[j].list_content.rules_type_id === 10 || eChilds[j].list_content.rules_type_id === 12 || eChilds[j].list_content.rules_type_id === 13 || eChilds[j].list_content.rules_type_id === 14 || eChilds[j].list_content.rules_type_id === 23 || eChilds[j].list_content.rules_type_id === 24) {
            $('<li class="list-element list-content"><a href="/base/element/' + eChilds[j].id + '">' + eChilds[j].name + '</a>' + ' <span class="content-rule">' + parseInt(eChilds[j].list_content.value) + ' ' + eChilds[j].list_content.rules_type.name.replace('%d ', '').toLowerCase() + '</span></li>').insertAfter('.list-element[data="' + id + '"]');
          } else if (eChilds[j].list_content.rules_type_id === 1) {
            $('<li class="list-element list-content"><a href="/base/element/' + eChilds[j].id + '">' + eChilds[j].name + '</a>' + ' <span class="content-rule">' + eChilds[j].list_content.rules_type.name.replace('%d м', ' ').toLowerCase() + ' ' + parseInt(eChilds[j].list_content.value) + ' м</span></li>').insertAfter('.list-element[data="' + id + '"]');
          } else if (eChilds[j].list_content.rules_type_id === 5) {
            $('<li class="list-element list-content"><a href="/base/element/' + eChilds[j].id + '">' + eChilds[j].name + '</a>' + ' <span class="content-rule">' + eChilds[j].list_content.rules_type.name.replace('%d кв. м', ' ').toLowerCase() + ' ' + parseInt(eChilds[j].list_content.value) + ' кв. м</span></li>').insertAfter('.list-element[data="' + id + '"]');
          } else if (eChilds[j].list_content.rules_type_id === 21 || eChilds[j].list_content.rules_type_id === 22) {
            $('<li class="list-element list-content"><a href="/base/element/' + eChilds[j].id + '">' + eChilds[j].name + '</a>' + ' <span class="content-rule">' + eChilds[j].list_content.rules_type.name.replace('%d м', ' ').toLowerCase() + ' ' + parseInt(eChilds[j].list_content.value) + ' м</span></li>').insertAfter('.list-element[data="' + id + '"]');
          }
        }
        for (var k = 0, len3 = lChilds.length; k < len3; k++) {
          if (lChilds[k].list_content.rules_type_id === 3 || lChilds[k].list_content.rules_type_id === 2 || lChilds[k].list_content.rules_type_id === 15 || lChilds[k].list_content.rules_type_id === 4 || lChilds[k].list_content.rules_type_id === 6 || lChilds[k].list_content.rules_type_id === 7 || lChilds[k].list_content.rules_type_id === 8 || lChilds[k].list_content.rules_type_id === 10 || lChilds[k].list_content.rules_type_id === 12 || lChilds[k].list_content.rules_type_id === 13 || lChilds[k].list_content.rules_type_id === 14 || lChilds[k].list_content.rules_type_id === 23 || lChilds[k].list_content.rules_type_id === 24) {
            $('<li class="list-element list-content"><a href="/base/set/' + lChilds[k].id + '">' + lChilds[k].name + '</a>' + ' <span class="content-rule">' + parseInt(lChilds[k].list_content.value) + ' ' + lChilds[k].list_content.rules_type.name.replace('%d ', '').toLowerCase() + '</span></li>').insertAfter('.list-element[data="' + id + '"]');
          } else if (lChilds[k].list_content.rules_type_id === 1) {
            $('<li class="list-element list-content"><a href="/base/set/' + lChilds[k].id + '">' + lChilds[k].name + '</a>' + ' <span class="content-rule">' + lChilds[k].list_content.rules_type.name.replace('%d м', ' ').toLowerCase() + ' ' + parseInt(lChilds[k].list_content.value) + ' м</span></li>').insertAfter('.list-element[data="' + id + '"]');
          } else if (lChilds[k].list_content.rules_type_id === 5) {
            $('<li class="list-element list-content"><a href="/base/set/' + lChilds[k].id + '">' + lChilds[k].name + '</a>' + ' <span class="content-rule">' + lChilds[k].list_content.rules_type.name.replace('%d кв. м', ' ').toLowerCase() + ' ' + parseInt(lChilds[k].list_content.value) + ' кв. м</span></li>').insertAfter('.list-element[data="' + id + '"]');
          } else if (lChilds[k].list_content.rules_type_id === 21 || lChilds[k].list_content.rules_type_id === 22) {
            $('<li class="list-element list-content"><a href="/base/set/' + lChilds[k].id + '">' + lChilds[k].name + '</a>' + ' <span class="content-rule">' + lChilds[k].list_content.rules_type.name.replace('%d м', ' ').toLowerCase() + ' ' + parseInt(lChilds[k].list_content.value) + ' м</span></li>').insertAfter('.list-element[data="' + id + '"]');
          }
        }
      //}
    });
  }

  function validate(callback) {
    var elementId = 1;
    var sku = $('input[name="sku"]').val();
    var name = $('input[name="name"]').val();

    if (sku.length > 0) {
      if (name.length > 0) {
        $.get('/base/element/validate/' + elementId + '?sku=' + sku + '&name=' + name, function(data) {
          if (data.status) {
            if (data.validate) {
              callback({status: true});
            } else {
              callback({status: false, error: data.notvalid});
            }
          } else {
            callback({status: false, error: 'Internal server error.'});
          }
        });
      } else {
        callback({status: false, error: i18n.t('Element name can not be empty')});
      }
    } else {
      callback({status: false, error: i18n.t('Element SKU can not be empty')});
    }
  }
});