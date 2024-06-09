var async = require('async');
var xl = require('excel4node');

var sTitle = ['грн', 'разница со средней t˚ по палате', 'грн', 'разница со средней t˚ по палате',
  'грн', 'разница со средней t˚ по палате', 'грн', 'разница со средней t˚ по палате', 'грн',
  'разница со средней t˚ по палате', 'кол-во расчётов', 'кол-во заказов', 'коэф-т конверс.',
  'разница со средней t˚ по палате', 'кол-во дней', 'разница со средней t˚ по палате', 'понед.',
  'вторник', 'среда', 'четверг', 'пятница', 'суббота'/*, 'воскресенье'*/, 'всего', '8:00-11:00',
  '11:00-15:00', '15:00-19:00'/*, 'другое время'*/, 'всего'];

exports.writeToExcel = function (allData, sellers, fileName, callback) {
  var wb = new xl.Workbook();
  // --------------------стили ------------------------------
  var myStyle = wb.createStyle({
    alignment: {
      wrapText: true,
      horizontal: 'center',
      vertical: 'center'
    },
    border: {
      top: {style: 'thin'},
      bottom: {style: 'thin'},
      left: {style: 'thin'},
      right: {style: 'thin'}
    },
    numberFormat: '0.##'
  });
  var fullBorderStyle = wb.createStyle({
    border: {
      top: {style: 'medium'},
      bottom: {style: 'medium'},
      left: {style: 'medium'},
      right: {style: 'medium'}
    }
  });
  var sideStyle = wb.createStyle({border: {left: {style: 'medium'}, right: {style: 'medium'}}});
  var bottomStyle = wb.createStyle({border: {bottom: {style: "medium"}}});
  // ----------------------- создание файла --------------------
  var ws = wb.addWorksheet('Эффективность работы');

  ws.cell(1,1).string('Эффективность работы');
  ws.cell(2, 1, 3, 1, true).string(sellers? 'Продавцы': 'Области').style(myStyle).style(fullBorderStyle);
  ws.cell(2, 2, 2, 3, true).string('Средняя стоимость расчета').style(myStyle).style(fullBorderStyle);
  ws.cell(2, 4, 2, 5, true).string('Средняя стоимость заказа').style(myStyle).style(fullBorderStyle);
  ws.cell(2, 6, 2, 7, true).string('Отклон. в цене при расч. заказов').style(myStyle).style(fullBorderStyle);
  ws.cell(2, 8, 2, 9, true).string('Средняя ст-ть 1 м2 заказа').style(myStyle).style(fullBorderStyle);
  ws.cell(2, 10, 2, 11, true).string('Среднее кол-во окон в заказе').style(myStyle).style(fullBorderStyle);
  ws.cell(2, 12, 2, 15, true).string('Коэфициент конверсии').style(myStyle).style(fullBorderStyle);
  ws.cell(2, 16, 2, 17, true).string('Временная трансформация заказа').style(myStyle).style(fullBorderStyle);
  ws.cell(2, 18, 2, 24, true).string('Кол-во расчётов по дням недели').style(myStyle).style(fullBorderStyle);
  ws.cell(2, 25, 2, 28, true).string('Кол-во расчётов по часам').style(myStyle).style(fullBorderStyle);

  for (var i = 2; i < 29; i++) {
    ws.cell(3, i).string(sTitle[i-2]).style(myStyle).style(fullBorderStyle);
  }
  var key, regionCount = 2;
  for( key in allData) {
    writeDataToInnerTable(allData, allData[key][19], key, wb, myStyle, fullBorderStyle, bottomStyle, sideStyle, function () {
      ws.cell(2 + regionCount, 1, 3 + regionCount, 1, true).string(key).style(myStyle).style(fullBorderStyle);
      ws.cell(2 + regionCount, 2, 3 + regionCount, 2, true).number(allData[key][0] || 0).style(myStyle).style(bottomStyle);
      ws.cell(2 + regionCount, 4, 3 + regionCount, 4, true).number(allData[key][1] || 0).style(myStyle).style(bottomStyle);
      ws.cell(2 + regionCount, 6, 3 + regionCount, 6, true).number((allData[key][1] || 0) - (allData[key][0] || 0)).style(myStyle).style(bottomStyle);
      ws.cell(2 + regionCount, 8, 3 + regionCount, 8, true).number((allData[key][3] || 0) / (allData[key][5] || 1)).style(myStyle).style(bottomStyle);
      ws.cell(2 + regionCount, 10, 3 + regionCount, 10, true).number(allData[key][4] || 0).style(myStyle).style(bottomStyle);
      ws.cell(2 + regionCount, 12, 3 + regionCount, 12, true).number(allData[key][5] || 0).style(myStyle).style(bottomStyle);
      ws.cell(2 + regionCount, 13, 3 + regionCount, 13, true).number(allData[key][6] || 0).style(myStyle).style(bottomStyle);
      ws.cell(2 + regionCount, 16, 3 + regionCount, 16, true).number(allData[key][7] || 0).style(myStyle).style(bottomStyle);
      ws.cell(2 + regionCount, 24).formula('SUM(' + xl.getExcelCellRef(2 + regionCount, 18) + ':' + xl.getExcelCellRef(2 + regionCount, 23) + ')').style(myStyle);
      ws.cell(2 + regionCount, 28).formula('SUM(' + xl.getExcelCellRef(2 + regionCount, 25) + ':' + xl.getExcelCellRef(2 + regionCount, 27) + ')').style(myStyle);
      var i;
      for (i = 18; i < 25; i++) {
        if (i != 24) ws.cell(2 + regionCount, i).number(allData[key][i - 10] || 0).style(myStyle);
        ws.cell(3 + regionCount, i).formula('IF(' + xl.getExcelCellRef(2 + regionCount, 24) + '>0,' + xl.getExcelCellRef(2 + regionCount, i) + '/' + xl.getExcelCellRef(2 + regionCount, 24) + ', 0)')
        .style(myStyle)
        .style({numberFormat: '0 %'})
        .style(bottomStyle);
      }
      for (i = 25; i < 29; i++) {
        if (i != 28) ws.cell(2 + regionCount, i).number(allData[key][i - 10] || 0).style(myStyle);
        ws.cell(3 + regionCount, i).formula('IF(' + xl.getExcelCellRef(2 + regionCount, 28) + '>0, ' + xl.getExcelCellRef(2 + regionCount, i) + '/' + xl.getExcelCellRef(2 + regionCount, 28) + ', 0)')
        .style(myStyle)
        .style({numberFormat: '0 %'})
        .style(bottomStyle);
      }
      regionCount += 2;
    });
  }
    // ------------ Запись строки ВСЕГО -------------------------------
  ws.cell(2 + regionCount, 1, 3 + regionCount, 1, true).string('ВСЕГО').style(myStyle).style(fullBorderStyle);
  for (i = 2; i < 18; i++) {
    ws.cell(2 + regionCount, i, 3 + regionCount, i, true).formula('AVERAGE(' + xl.getExcelCellRef(4, i) + ':' + xl.getExcelCellRef(regionCount, i) + ')').style(myStyle).style(bottomStyle);
  }
  for (i = 18; i < 25; i++) {
    ws.cell(3 + regionCount, i).formula('IF(' + xl.getExcelCellRef(2 + regionCount, 24) + '>0,' + xl.getExcelCellRef(2 + regionCount, i) + '/' + xl.getExcelCellRef(2 + regionCount, 24) + ', 0)')
    .style(myStyle)
    .style({numberFormat: '0 %'})
    .style(bottomStyle);
  }
  for (i = 25; i < 29; i++) {
    ws.cell(3 + regionCount, i).formula('IF(' + xl.getExcelCellRef(2 + regionCount, 28) + '>0,' + xl.getExcelCellRef(2 + regionCount, i) + '/' + xl.getExcelCellRef(2 + regionCount, 28) + ', 0)')
    .style(myStyle)
    .style({numberFormat: '0 %'})
    .style(bottomStyle);
  }
  for(var sum = 'SUM(', d = 18; d < 29; d++) {
    for (var row = 4; row < 2 + regionCount; row += 2) {
      sum += xl.getExcelCellRef(row, d) + ',';
    }
    if (sum !== 'SUM(') ws.cell(2 + regionCount, d).formula(sum.slice(0, -1) + ')').style(myStyle);
    sum = 'SUM(';
  }
  ws.cell(4, 24, 3 + regionCount, 24).style(sideStyle);
  ws.cell(4, 28, 3 + regionCount, 28).style(sideStyle);
  [3, 5, 7, 9, 11, 15, 17, 14].forEach(function (column) {
    var i;
    for (i = 4; i <= regionCount; i += 2) {
      if (column == 14) {
        ws.cell(i, column, i + 1, column, true).formula('IF(' + xl.getExcelCellRef(i, column - 2) + '>0,' + xl.getExcelCellRef(i, column - 1) + ' / ' + xl.getExcelCellRef(i, column - 2) + ', 0)')
        .style(myStyle)
        .style({numberFormat: '0.00 %'})
        .style(bottomStyle);
      } else {
        ws.cell(i, column, i + 1, column, true).formula('IF(' + xl.getExcelCellRef(2 + regionCount, column - 1) + '>0,' + xl.getExcelCellRef(i, column - 1) + ' - ' + xl.getExcelCellRef(2 + regionCount, column - 1) + ', 0)')
        .style(myStyle)
        .style(bottomStyle);
      }
    }
    if (column !== 14) {
      ws.cell(4, column, 3 + regionCount, column).style(sideStyle);
    }
  });
  wb.write(fileName);
  callback(fileName);
};

function writeDataToInnerTable(allData, data, keySheet, wb, myStyle, fullBorderStyle, bottomStyle, sideStyle, callback) {
  var ws = wb.addWorksheet(keySheet);
  var fields = ['mas', 'fem', 'ageF20', 'ageF31', 'ageF41', 'ageF51', 'ageF61', 'employee', 'householder', 'employeer', 'student', 'pensioner', 'unknown', 'tv', 'internet', 'press', 'friends', 'advertising'];
  var titles = ['пол   мужской', 'женский', 'возраст   20-30', '31-40', '41-50', '51-60', 'старше 61', 'занятость   служащий', 'домохозяйка', 'работодатель', 'студент', 'пенсионер', 'неизвестно', ' источник информации \n телевидение', 'интернет', 'пресса', 'рекомендация друзей', 'реклама'];
  // ----------------- создание страницы -------------------------
  ws.cell(1,1).string('Эффективность работы');
  ws.cell(2, 1, 3, 1, true).style(myStyle);
  ws.cell(2, 2, 2, 3, true).string('Средняя стоимость расчета').style(myStyle).style(fullBorderStyle);
  ws.cell(2, 4, 2, 5, true).string('Средняя стоимость заказа').style(myStyle).style(fullBorderStyle);
  ws.cell(2, 6, 2, 7, true).string('Отклон. в цене при расч. заказов').style(myStyle).style(fullBorderStyle);
  ws.cell(2, 8, 2, 9, true).string('Средняя ст-ть 1 м2 заказа').style(myStyle).style(fullBorderStyle);
  ws.cell(2, 10, 2, 11, true).string('Среднее кол-во окон в заказе').style(myStyle).style(fullBorderStyle);
  ws.cell(2, 12, 2, 15, true).string('Коэфициент конверсии').style(myStyle).style(fullBorderStyle);
  ws.cell(2, 16, 2, 17, true).string('Временная трансформация заказа').style(myStyle).style(fullBorderStyle);
  ws.cell(2, 18, 2, 24, true).string('Кол-во расчётов по дням недели').style(myStyle).style(fullBorderStyle);
  ws.cell(2, 25, 2, 28, true).string('Кол-во расчётов по часам').style(myStyle).style(fullBorderStyle);


  for (var i = 2; i < 29; i++) {
    ws.cell(3, i).string(sTitle[i-2]).style(myStyle).style(fullBorderStyle);
  }
  var key, regionCount = 2, k;
  for (k = 0; k < fields.length; k++) {
    key = fields[k];
    ws.cell(2 + regionCount, 1, 3 + regionCount, 1, true).string(titles[k]).style(myStyle).style(fullBorderStyle);
    ws.cell(2 + regionCount, 2, 3 + regionCount, 2, true).number(data[key]? data[key][0] || 0: 0).style(myStyle).style(bottomStyle);
    ws.cell(2 + regionCount, 4, 3 + regionCount, 4, true).number(data[key]? typeof data[key][1] === 'object'? (data[key][1].sum || 0) / (data[key][1].count || 1): (data[key][1] || 0): 0).style(myStyle).style(bottomStyle);
    ws.cell(2 + regionCount, 6, 3 + regionCount, 6, true).number((data[key]? typeof data[key][1] === 'object'? (data[key][1].sum || 0) / (data[key][1].count || 1) - (data[key][0] || 0): (data[key][1] || 0) - (data[key][0] || 0): 0)).style(myStyle).style(bottomStyle);
    ws.cell(2 + regionCount, 8, 3 + regionCount, 8, true).number(data[key]? (data[key][3] || 0) / (data[key][5] || 1): 0).style(myStyle).style(bottomStyle);
    ws.cell(2 + regionCount, 10, 3 + regionCount, 10, true).number(data[key]? typeof data[key][4] === 'object'? (data[key][4].sum || 0) / (data[key][4].count || 1): (data[key][4] || 0): 0).style(myStyle).style(bottomStyle);
    ws.cell(2 + regionCount, 12, 3 + regionCount, 12, true).number(data[key]? data[key][5] || 0: 0).style(myStyle).style(bottomStyle);
    ws.cell(2 + regionCount, 13, 3 + regionCount, 13, true).number(data[key]? data[key][6] || 0: 0).style(myStyle).style(bottomStyle);
    ws.cell(2 + regionCount, 16, 3 + regionCount, 16, true).number(data[key]? (data[key][7].sum || 0) / (data[key][7].count || 1): 0).style(myStyle).style(bottomStyle);
    ws.cell(2 + regionCount, 24).formula('SUM(' + xl.getExcelCellRef(2 + regionCount, 18) + ':' + xl.getExcelCellRef(2 + regionCount, 23) + ')').style(myStyle);
    ws.cell(2 + regionCount, 28).formula('SUM(' + xl.getExcelCellRef(2 + regionCount, 25) + ':' + xl.getExcelCellRef(2 + regionCount, 27) + ')').style(myStyle);
    for (i = 18; i < 25; i++) {
      if (i != 24) ws.cell(2 + regionCount, i).number(data[key]? data[key][i - 10] || 0: 0).style(myStyle);
      ws.cell(3 + regionCount, i).formula('IF(' + xl.getExcelCellRef(2 + regionCount, 24) + '>0,' +  xl.getExcelCellRef(2 + regionCount, i) + '/' + xl.getExcelCellRef(2 + regionCount, 24) + ', 0)')
      .style(myStyle)
      .style({numberFormat: '0 %'})
      .style(bottomStyle);
    }
    for (i = 25; i < 29; i++) {
      if (i !== 28) ws.cell(2 + regionCount, i).number(data[key]? data[key][i - 10] || 0: 0).style(myStyle);
     ws.cell(3 + regionCount, i).formula('IF(' + xl.getExcelCellRef(2 + regionCount, 28) + '>0,' + xl.getExcelCellRef(2 + regionCount, i) + '/' + xl.getExcelCellRef(2 + regionCount, 28) + ', 0)')
     .style(myStyle)
     .style({numberFormat: '0 %'})
     .style(bottomStyle);
    }
    regionCount += 2;
  }
  ws.cell(4, 24, 1 + regionCount, 24).style(sideStyle);
  ws.cell(4, 28, 1 + regionCount, 28).style(sideStyle);

  for (i = 4; i <= regionCount; i += 2) {
    ws.cell(i, 14, i + 1, 14, true).formula('IF(' + xl.getExcelCellRef(i, 12) + '>0,' + xl.getExcelCellRef(i, 13) + ' / ' + xl.getExcelCellRef(i, 12), ', 0)')
    .style(myStyle)
    .style({numberFormat: '0.00 %'})
    .style(bottomStyle);
    ws.cell(i, 3, i + 1, 3, true).formula(xl.getExcelCellRef(i, 2) + ' - ' + (allData[keySheet][0] || 0)).style(myStyle).style(bottomStyle).style(sideStyle);
    ws.cell(i, 5, i + 1, 5, true).formula(xl.getExcelCellRef(i, 4) + ' - ' + (allData[keySheet][1] || 0)).style(myStyle).style(bottomStyle).style(sideStyle);
    ws.cell(i, 7, i + 1, 7, true).formula(xl.getExcelCellRef(i, 6) + ' - ' + ((allData[keySheet][1] || 0) - (allData[keySheet][0] || 0))).style(myStyle).style(bottomStyle).style(sideStyle);
    ws.cell(i, 9, i + 1, 9, true).formula(xl.getExcelCellRef(i, 8) + ' - ' + ((allData[keySheet][3] || 0) / (allData[keySheet][5] || 1))).style(myStyle).style(bottomStyle).style(sideStyle);
    ws.cell(i, 11, i + 1, 11, true).formula(xl.getExcelCellRef(i, 10) + ' - ' + (allData[keySheet][4] || 0)).style(myStyle).style(bottomStyle).style(sideStyle);
    ws.cell(i, 15, i + 1, 15, true).formula(xl.getExcelCellRef(i, 14) + ' - ' + ((allData[keySheet][6] || 0) / (allData[keySheet][5] || 1) * 100)).style(myStyle).style(bottomStyle).style(sideStyle);
    ws.cell(i, 17, i + 1, 17, true).formula(xl.getExcelCellRef(i, 16) + ' - ' + (allData[keySheet][7] || 0)).style(myStyle).style(bottomStyle).style(sideStyle);
  }
  callback();
}
