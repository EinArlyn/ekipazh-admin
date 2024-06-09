var async = require('async');
var xl = require('excel4node');

function saveInfoAboutCustomers(regionsData, regionName, generalData, wb, myStyle, thinStyle, callback) {
  var ws1 = wb.addWorksheet(regionName);
  var styleBottom = wb.createStyle({
    alignment: {
      wrapText: true,
      horizontal: 'center',
      vertical: 'center'
    },
    border: {
      bottom: {
        style: 'medium'
      }
    }
  });
  var fields = ['mas', 'fem', 'ageF20', 'ageF31', 'ageF41', 'ageF51', 'ageF61', 'employee', 'householder', 'employeer', 'student', 'pensioner', 'unknown', 'tv', 'internet', 'press', 'friends', 'advertising'];
  var titles = ['пол   мужской', 'женский', 'возраст   20-30', '31-40', '41-50', '51-60', 'старше 61', 'занятость   служащий', 'домохозяйка', 'работодатель', 'студент', 'пенсионер', 'неизвестно', ' источник информации \n телевидение', 'интернет', 'пресса', 'рекомендация друзей', 'реклама'];
  var hardwareStart = generalData.profileCount.length + 2,
    hardwareTypeStart = hardwareStart + generalData.hardwareInfo.length + 1,
    glazzingStart = hardwareTypeStart + generalData.hardwareTypeInfo.length + 1,
    glazzingStop = glazzingStart + generalData.glazzing.length + 1,
    sillsStart = glazzingStop + 3 + generalData.windowsills.length,
    sillsEnd = sillsStart + generalData.frontSills.length + 1,
    regionNumber = 0, innField;
  ws1.cell(1,1).string('Продукт');
  ws1.cell(2, 1, 3, 1, true).style(myStyle);
  ws1.cell(2, 2, 2, hardwareStart, true).string('Профиль').style(myStyle);
  ws1.cell(2, hardwareStart + 1, 2, hardwareTypeStart, true).string('Фурнитура').style(myStyle);
  ws1.cell(2, hardwareTypeStart + 1, 2, glazzingStart, true).string('Типы открываний(учитывая все проемы)').style(myStyle);
  ws1.cell(2, glazzingStart + 1, 2, glazzingStop, true).string('с/п присутствовавшие в расчётах (Топ-5)').style(myStyle);
  ws1.cell(2, glazzingStop + 1, 2, glazzingStop + 2, true).string('москитные сетки').style(myStyle);
  ws1.cell(2, glazzingStop + 3, 2, sillsStart, true).string('Подоконники').style(myStyle);
  ws1.cell(2, sillsStart + 1, 2, sillsEnd, true).string('Водоотливы').style(myStyle);

  ws1.cell(3, generalData.profileCount.length + 2).string('Всего').style(myStyle);
  ws1.cell(3, hardwareTypeStart).string('Всего').style(myStyle);
  ws1.cell(3, glazzingStart).string('Всего').style(myStyle);
  ws1.cell(3, glazzingStop).string('Всего').style(myStyle);
  ws1.cell(3, glazzingStop + 1).string('Проёмы').style(myStyle);
  ws1.cell(3, glazzingStop + 2).string('Сетки').style(myStyle);
  ws1.cell(3, sillsStart).string('Всего').style(myStyle);
  ws1.cell(3, sillsEnd).string('Всего').style(myStyle);
  for (var j = 0; j < fields.length; j++) {
    innField = regionsData[fields[j]];
    ws1.cell(4 + regionNumber, 1, 5 + regionNumber, 1, true).string(titles[j]).style(myStyle);
    ws1.cell(7, 1, 7, sillsEnd).style(styleBottom);
    regionNumber += 2;
    ws1.cell(2 + regionNumber, 2 + generalData.profileCount.length).number(innField.profileCount).style(myStyle);
    ws1.cell(3 + regionNumber, 2 + generalData.profileCount.length).string('100 %').style(myStyle);
    ws1.cell(2 + regionNumber, hardwareTypeStart).number(innField.hardwareCount).style(myStyle);
    ws1.cell(3 + regionNumber, hardwareTypeStart).string('100 %').style(myStyle);
    ws1.cell(2 + regionNumber, glazzingStart).number(innField.hardwareTypesCount).style(myStyle);
    ws1.cell(3 + regionNumber, glazzingStart).string('100 %').style(myStyle);
    ws1.cell(3 + regionNumber, glazzingStop).string('100 %').style(myStyle);
    ws1.cell(2 + regionNumber, glazzingStop + 1, 3 + regionNumber, glazzingStop + 1, true).number(innField.apertures).style(thinStyle);
    ws1.cell(2 + regionNumber, glazzingStop + 2).number(innField.mosquitos).style(myStyle);
    ws1.cell(3 + regionNumber, glazzingStop + 2).string((innField.mosquitos / (innField.apertures || 1) * 100).toFixed(2) + ' %').style(myStyle);
    ws1.cell(2 + regionNumber, sillsStart).number(innField.windowsillCount).style(myStyle);
    ws1.cell(3 + regionNumber, sillsStart).string('100 %').style(myStyle);
    ws1.cell(2 + regionNumber, sillsEnd).number(innField.frontSillsCount).style(myStyle);
    ws1.cell(3 + regionNumber, sillsEnd).string('100 %').style(myStyle);
    for (i = 0; i < generalData.profileCount.length; i++) {
      percent = (innField.profiles[generalData.profileCount[i]] || 0) / (innField.profileCount || 1) * 100;
      ws1.cell(3, 2 + i).string(generalData.profileCount[i]).style(myStyle);
      ws1.cell(2 + regionNumber, 2 + i).number(innField.profiles[generalData.profileCount[i]] || 0).style(thinStyle);
      ws1.cell(3 + regionNumber, 2 + i).string(percent.toFixed(2) + ' %').style(thinStyle);
    }
    for (i = 0; i < generalData.hardwareInfo.length; i++) {
      percent = (innField.hardwares[generalData.hardwareInfo[i]] || 0) / (innField.hardwareCount || 1) * 100;
      ws1.cell(3, hardwareStart + i + 1).string(generalData.hardwareInfo[i]).style(myStyle);
      ws1.cell(2 + regionNumber, hardwareStart + i + 1).number(innField.hardwares[generalData.hardwareInfo[i]] || 0).style(thinStyle);
      ws1.cell(3 + regionNumber, hardwareStart + i + 1).string(percent.toFixed(2) + ' %').style(thinStyle);
    }
    for (i = 0; i < generalData.hardwareTypeInfo.length; i++) {
      percent = (innField.hardwareTypes[generalData.hardwareTypeInfo[i]] || 0) / (innField.hardwareTypesCount || 1) * 100;
      ws1.cell(3, hardwareTypeStart + i + 1).string(generalData.hardwareTypeInfo[i]).style(myStyle);
      ws1.cell(2 + regionNumber, hardwareTypeStart + i + 1).number(innField.hardwareTypes[generalData.hardwareTypeInfo[i]] || 0).style(thinStyle);
      ws1.cell(3 + regionNumber, hardwareTypeStart + i + 1).string(percent.toFixed(2) + ' %').style(thinStyle);
    }
    async.map(generalData.glazzing, function (resultGlazzing, _callback) {
      _callback(null, innField.glazingTypes[resultGlazzing] || 0);
    }, function (err, sums) {
      var sum = sums.reduce(function (sum, current) {return sum + current;}, 0);
      generalData.glazzing.forEach(function(item, i, arr) {
        percent = (innField.glazingTypes[item] || 0) / (sum || 1) * 100;
        ws1.cell(3, glazzingStart + i + 1).string(item).style(myStyle);
        ws1.cell(2 + regionNumber, glazzingStart + i + 1).number(innField.glazingTypes[item] || 0).style(thinStyle);
        ws1.cell(3 + regionNumber, glazzingStart + i + 1).string(percent.toFixed(2) + ' %').style(thinStyle);
        ws1.cell(2 + regionNumber, glazzingStop).number(sum).style(myStyle);
      });
    });
    for (i = 0; i < generalData.windowsills.length; i++) {
      percent = (innField.windowsills[generalData.windowsills[i]] || 0) / (innField.windowsillCount || 1) * 100;
      ws1.cell(3, glazzingStart + i + 9).string(generalData.windowsills[i]).style(myStyle);
      ws1.cell(2 + regionNumber, glazzingStart + i + 9).number(innField.windowsills[generalData.windowsills[i]] || 0).style(thinStyle);
      ws1.cell(3 + regionNumber, glazzingStart + i + 9).string(percent.toFixed(2) + ' %').style(thinStyle);
    }
    for (i = 0; i < generalData.frontSills.length; i++) {
      percent = (innField.frontSills[generalData.frontSills[i]] || 0) / (innField.frontSillsCount || 1) * 100;
      ws1.cell(3, sillsStart + i + 1).string(generalData.frontSills[i]).style(myStyle);
      ws1.cell(2 + regionNumber, sillsStart + i + 1).number(innField.frontSills[generalData.frontSills[i]] || 0).style(thinStyle);
      ws1.cell(3 + regionNumber, sillsStart + i + 1).string(percent.toFixed(2) + ' %').style(thinStyle);
    }
  }
  ws1.cell(17, 1, 17, sillsEnd).style(styleBottom);
  ws1.cell(29, 1, 29, sillsEnd).style(styleBottom);
  ws1.cell(39, 1, 39, sillsEnd).style(styleBottom);
  callback(null);
}

exports.writeToExcel = function (regions, result, fileName, sellers, callback) {
  var wb = new xl.Workbook();
  var myStyle = wb.createStyle({
    alignment: {
      wrapText: true,
      horizontal: 'center',
      vertical: 'center'
    },
    border: {
      left: {style: 'medium'},
      right: {style: 'medium'},
      top: {style: 'medium'},
      bottom: {style: 'medium'}
    },
    numberFormat: '0.##'
  });
  var thinStyle = wb.createStyle({
    alignment: {
      wrapText: true,
      horizontal: 'center',
      vertical: 'center'
    },
    border: {
      left: {style: 'thin'},
      right: {style: 'thin'},
      top: {style: 'thin'},
      bottom: {style: 'thin'}
    }
  });
  var ws = wb.addWorksheet(sellers? 'Продукт по продавцам': 'Продукт по регионам');
  var hardwareStart = result.profileCount.length + 2,
    hardwareTypeStart = hardwareStart + result.hardwareInfo.length + 1,
    glazzingStart = hardwareTypeStart + result.hardwareTypeInfo.length + 1,
    glazzingStop = glazzingStart + result.glazzing.length + 1,
    sillsStart = glazzingStop + 3 + result.windowsills.length,
    sillsEnd = sillsStart + result.frontSills.length + 1,
    regionNumber = 0;
  var i, percent, key;
  ws.cell(1,1).string('Продукт');
  ws.cell(2, 1, 3, 1, true).string(sellers? 'Продавцы': 'Области').style(myStyle);
  ws.cell(2, 2, 2, hardwareStart, true).string('Профиль').style(myStyle);
  ws.cell(2, hardwareStart + 1, 2, hardwareTypeStart, true).string('Фурнитура').style(myStyle);
  ws.cell(2, hardwareTypeStart + 1, 2, glazzingStart, true).string('Типы открываний(учитывая все проемы)').style(myStyle);
  ws.cell(2, glazzingStart + 1, 2, glazzingStop, true).string('с/п присутствовавшие в расчётах (Топ-5)').style(myStyle);
  ws.cell(2, glazzingStop + 1, 2, glazzingStop + 2, true).string('москитные сетки').style(myStyle);
  ws.cell(2, glazzingStop + 3, 2, sillsStart, true).string('Подоконники').style(myStyle);
  ws.cell(2, sillsStart + 1, 2, sillsEnd, true).string('Водоотливы').style(myStyle);

  ws.cell(3, result.profileCount.length + 2).string('Всего').style(myStyle);
  ws.cell(3, hardwareTypeStart).string('Всего').style(myStyle);
  ws.cell(3, glazzingStart).string('Всего').style(myStyle);
  ws.cell(3, glazzingStop).string('Всего').style(myStyle);
  ws.cell(3, glazzingStop + 1).string('Проёмы').style(myStyle);
  ws.cell(3, glazzingStop + 2).string('Сетки').style(myStyle);
  ws.cell(3, sillsStart).string('Всего').style(myStyle);
  ws.cell(3, sillsEnd).string('Всего').style(myStyle);
  var keyLength = Object.keys(regions).length;
  for (key in regions) {
    saveInfoAboutCustomers(regions[key], key, result, wb, myStyle, thinStyle, function() {

      ws.cell(4 + regionNumber, 1, 5 + regionNumber, 1, true).string(key).style(myStyle);
      regionNumber += 2;
      ws.cell(2 + regionNumber, 2 + result.profileCount.length).number(regions[key].profileCount).style(myStyle);
      ws.cell(3 + regionNumber, 2 + result.profileCount.length)
        .formula(xl.getExcelCellRef(2 + regionNumber, 2 + result.profileCount.length) + '/' + xl.getExcelCellRef(2 * (2 + keyLength), 2 + result.profileCount.length)).style(myStyle).style({numberFormat: '0.00 %'});
      ws.cell(2 + regionNumber, hardwareTypeStart).number(regions[key].hardwareCount).style(myStyle);
      ws.cell(3 + regionNumber, hardwareTypeStart)
        .formula(xl.getExcelCellRef(2 + regionNumber, hardwareTypeStart) + '/' + xl.getExcelCellRef(2 * (2 + keyLength), hardwareTypeStart)).style(myStyle).style({numberFormat: '0.00 %'});
      ws.cell(2 + regionNumber, glazzingStart).number(regions[key].hardwareTypesCount).style(myStyle);
      ws.cell(3 + regionNumber, glazzingStart)
        .formula(xl.getExcelCellRef(2 + regionNumber, glazzingStart) + '/' + xl.getExcelCellRef(2 * (2 + keyLength), glazzingStart)).style(myStyle).style({numberFormat: '0.00 %'});
      ws.cell(3 + regionNumber, glazzingStop)
        .formula(xl.getExcelCellRef(2 + regionNumber, glazzingStop) + '/' + xl.getExcelCellRef(2 * (2 + keyLength), glazzingStop)).style(myStyle).style({numberFormat: '0.00 %'});
      ws.cell(2 + regionNumber, glazzingStop + 1, 3 + regionNumber, glazzingStop + 1, true).number(regions[key].apertures).style(thinStyle);
      ws.cell(2 + regionNumber, glazzingStop + 2).number(regions[key].mosquitos).style(myStyle);
      ws.cell(3 + regionNumber, glazzingStop + 2).string((regions[key].mosquitos / (regions[key].apertures || 1) * 100).toFixed(2) + ' %').style(myStyle);
      ws.cell(2 + regionNumber, sillsStart).number(regions[key].windowsillCount).style(myStyle);
      ws.cell(3 + regionNumber, sillsStart)
        .formula(xl.getExcelCellRef(2 + regionNumber, sillsStart) + '/' + xl.getExcelCellRef(2 * (2 + keyLength), sillsStart)).style(myStyle).style({numberFormat: '0.00 %'});
      ws.cell(2 + regionNumber, sillsEnd).number(regions[key].frontSillsCount).style(myStyle);
      ws.cell(3 + regionNumber, sillsEnd)
        .formula(xl.getExcelCellRef(2 + regionNumber, sillsEnd) + '/' + xl.getExcelCellRef(2 * (2 + keyLength), sillsEnd)).style(myStyle).style({numberFormat: '0.00 %'});
      for (i = 0; i < result.profileCount.length; i++) {
        percent = (regions[key].profiles[result.profileCount[i]] || 0) / (regions[key].profileCount || 1) * 100;
        ws.cell(3, 2 + i).string(result.profileCount[i]).style(myStyle);
        ws.cell(2 + regionNumber, 2 + i).number(regions[key].profiles[result.profileCount[i]] || 0).style(thinStyle);
        ws.cell(3 + regionNumber, 2 + i).string(percent.toFixed(2) + ' %').style(thinStyle);
      }
      for (i = 0; i < result.hardwareInfo.length; i++) {
        percent = (regions[key].hardwares[result.hardwareInfo[i]] || 0) / (regions[key].hardwareCount || 1) * 100;
        ws.cell(3, hardwareStart + i + 1).string(result.hardwareInfo[i]).style(myStyle);
        ws.cell(2 + regionNumber, hardwareStart + i + 1).number(regions[key].hardwares[result.hardwareInfo[i]] || 0).style(thinStyle);
        ws.cell(3 + regionNumber, hardwareStart + i + 1).string(percent.toFixed(2) + ' %').style(thinStyle);
      }
      for (i = 0; i < result.hardwareTypeInfo.length; i++) {
        percent = (regions[key].hardwareTypes[result.hardwareTypeInfo[i]] || 0) / (regions[key].hardwareTypesCount || 1) * 100;
        ws.cell(3, hardwareTypeStart + i + 1).string(result.hardwareTypeInfo[i]).style(myStyle);
        ws.cell(2 + regionNumber, hardwareTypeStart + i + 1).number(regions[key].hardwareTypes[result.hardwareTypeInfo[i]] || 0).style(thinStyle);
        ws.cell(3 + regionNumber, hardwareTypeStart + i + 1).string(percent.toFixed(2) + ' %').style(thinStyle);
      }
      async.map(result.glazzing, function (resultGlazzing, _callback) {
        _callback(null, regions[key].glazingTypes[resultGlazzing] || 0);
      }, function (err, sums) {
        var sum = sums.reduce(function (sum, current) {return sum + current;}, 0);
        result.glazzing.forEach(function(item, i, arr) {
          percent = (regions[key].glazingTypes[item] || 0) / (sum || 1) * 100;
          ws.cell(3, glazzingStart + i + 1).string(item).style(myStyle);
          ws.cell(2 + regionNumber, glazzingStart + i + 1).number(regions[key].glazingTypes[item] || 0).style(thinStyle);
          ws.cell(3 + regionNumber, glazzingStart + i + 1).string(percent.toFixed(2) + ' %').style(thinStyle);
          ws.cell(2 + regionNumber, glazzingStop).number(sum).style(myStyle);
        });
      });
      for (i = 0; i < result.windowsills.length; i++) {
        percent = (regions[key].windowsills[result.windowsills[i]] || 0) / (regions[key].windowsillCount || 1) * 100;
        ws.cell(3, glazzingStart + i + 9).string(result.windowsills[i]).style(myStyle);
        ws.cell(2 + regionNumber, glazzingStart + i + 9).number(regions[key].windowsills[result.windowsills[i]] || 0).style(thinStyle);
        ws.cell(3 + regionNumber, glazzingStart + i + 9).string(percent.toFixed(2) + ' %').style(thinStyle);
      }
      for (i = 0; i < result.frontSills.length; i++) {
        percent = (regions[key].frontSills[result.frontSills[i]] || 0) / (regions[key].frontSillsCount || 1) * 100;
        ws.cell(3, sillsStart + i + 1).string(result.frontSills[i]).style(myStyle);
        ws.cell(2 + regionNumber, sillsStart + i + 1).number(regions[key].frontSills[result.frontSills[i]] || 0).style(thinStyle);
        ws.cell(3 + regionNumber, sillsStart + i + 1).string(percent.toFixed(2) + ' %').style(thinStyle);
      }
    });
  }
  ws.cell(4 + regionNumber, 1, 5 + regionNumber, 1, true).string('ВСЕГО').style(myStyle);
  var controlCell;
  var sum = 'SUM(';
  for (i = 2; i < sillsEnd + 1; i++) {
    controlCell = (i < result.profileCount.length + 3)? result.profileCount.length + 2:
      (i < hardwareTypeStart + 1)? hardwareTypeStart:
      (i < glazzingStart + 1)? glazzingStart:
      (i < glazzingStop + 1)? glazzingStop:
      (i == glazzingStop + 2)? glazzingStop + 1:
      (i < sillsStart + 1)? sillsStart:
      (i < sillsEnd + 1)? sillsEnd: sillsEnd;
    for (var row = 4; row < 4 + regionNumber; row += 2) {
      sum += xl.getExcelCellRef(row, controlCell) + ',';
    }
    if (i !== controlCell) {
      ws.cell(4 + regionNumber, i).formula('SUM(' + xl.getExcelCellRef(4, i) + ':' + xl.getExcelCellRef(2 + regionNumber, i) + ')').style(myStyle);
    } else {
      if (sum !== 'SUM(') ws.cell(4 + regionNumber, controlCell).formula(sum.slice(0, -1) + ')').style(myStyle);
    }
    sum = 'SUM(';
    if (i == glazzingStop + 1) {
      ws.cell(4 + regionNumber, i, 5 + regionNumber, i, true).formula('SUM(' + xl.getExcelCellRef(4, i) + ':' + xl.getExcelCellRef(2 + regionNumber, i) + ')').style(myStyle);
    } else {
      ws.cell(5 + regionNumber, i).formula(xl.getExcelCellRef(4 + regionNumber, i) + ' / ' + xl.getExcelCellRef(4 + regionNumber, controlCell)).style(myStyle).style({numberFormat: '0.00 %'});
    }
  }
  wb.write(fileName);
  callback();
};
