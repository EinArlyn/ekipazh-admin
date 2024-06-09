$(function () {
  /* on document load */
  $('img.loader').show();
  getSimilarities();

  /**
   * Add new similarity
   */
  $('.profile-systems-table-add-new-button').click(function (e) {
    e.preventDefault();
    $.post('/base/glazedWindow/newSimilarity/', {}, function(similarity) {
      createRow(similarity.id);
    });
  });

  /**
   * Get all similarities if current factory
   */
  function getSimilarities() {
    $.get('/base/glazedWindow/getSimilarities/', function(similarities) {
      if (similarities.length) {
        for (var i = 0, len = similarities.length; i < len; i++) {
          createRow(similarities[i].id, true);
        }        
      } else {        
        $('img.loader').hide();
      }
    });
  }

  /**
   * Create new table row
   * @param {integer} id         This is id of new created similarity (this id is equal to similarity.'id' in DB)
   */
  function createRow(id, check) {
    var profileSystemsArray = [];
    var tableLength = $('.profile-systems-table').attr('data');

    /* Get all profile systems id */
    $('th').each(function() {
      if ($(this).attr('id')) {
        profileSystemsArray.push($(this).attr('id'));
      }
    });

    /* insert new line */
    $('<tr class="profile-systems-table-content ' + id + '">' +
      '</tr>').insertBefore('tr.profile-systems-table-add-new');

    /* insert active columns */
    if (tableLength <= 8) {
      for (var i = 0; i < tableLength; i++) {
        $('tr.profile-systems-table-content.' + id).append('<td similarity="' + id + 
          '" data="' + profileSystemsArray[i] + '">' +
            '<select class="select-default" style="width:120px;">' +
          '</td>');
      }
      for (var start = 8 - tableLength; start < 10; start++) {
        $('tr.profile-systems-table-content.' + id).append('<td>' +
          '</td>');
      }
      /* add new event listener on created columns */
      $('tr.profile-systems-table-content').on('change', 'select', function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        createChangeEvent($(this));
      });
    }

    for (var k = 0; k < tableLength; k++) {
      getGlass(id, profileSystemsArray[k], check); // get glass of current profile      
    }
  }

  /**
   * Get glasses of current profile system
   */
  function getGlass(lineNum, psId, check) {
    $.get('/base/glazedWindow/getGlass/' + psId, function(glasses) {      
      $('td[similarity="' + lineNum + '"][data="' + psId + '"]').find('select').append('<option value="0">--------</option>');
      for (var i = 0, len = glasses.length; i < len; i++) {
        $('td[similarity="' + lineNum + '"][data="' + psId + '"]').find('select').append('<option value="' + glasses[i].element.id + '">' + glasses[i].element.sku + '</option>');
        if (check) {
          var currentSelect = $('td[similarity="' + lineNum + '"][data="' + psId + '"]').find('select');
          isExist(lineNum, psId, glasses[i].element.id, currentSelect);   
          if (i == len -1) {
            setTimeout(function() {
              $('img.loader').hide();
            }, 1400);
          }
        }     
      }
    });
  }

  /**
   * Add new create event on <select>
   */ 
  function createChangeEvent(element) {
    /* Add or delete glass to similarity */
    var glassId = element.val();
    var profileId = element.parent().attr('data');
    var similarityId = element.parent().attr('similarity');

    if (parseInt(glassId, 10) > 0) {
      /* add glass element to similarity */
      $.post('/base/glazedWindow/addGlassToSimilarity/', {
        similarityId: similarityId,
        profileId: profileId,
        glassId: glassId
      }, function (data) {

      });
    } else {
      /* remove glass element form similarity */
      $.post('/base/glazedWindow/removeGlassFromSimilarity/', {
        similarityId: similarityId,
        profileId: profileId
      }, function (data) {

      });
    }
  }

  /**
   * Checks if current element of profile system is exist in similarity
   * @param {integer} similarityId
   * @param {integer} profileSystemId
   * @param {integer} elementId
   * @param {integer} currentSelect
   */
  function isExist(similarityId, profileSystemId, elementId, currentSelect) {
    $.get('/base/glazedWindow/checkSimilarity?similarityId=' + similarityId + 
      '&profileSystemId=' + profileSystemId + '&elementId=' + elementId,
    function(data) {
      if (data.exist) {
        currentSelect.val(elementId);
      }
    });
  }

});