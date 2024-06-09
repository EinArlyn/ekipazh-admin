var models = require('../../lib/models');
var async = require('async');
var Excel = require('exceljs');

var factoryId, startTime, stopTime;
var titles = ['пол   мужской', 'женский', 'возраст   20-30', '31-40', '41-50', '51-60', 'старше 61', 'занятость   служащий', 'домохозяйка', 'работодатель', 'студент', 'пенсионер', 'неизвестно', ' источник информации \n телевидение', 'интернет', 'пресса', 'рекомендация друзей', 'реклама'];
var sTitle = ['', 'грн', 'разница со средней t˚ по палате', 'грн', 'разница со средней t˚ по палате',
  'грн', 'разница со средней t˚ по палате', 'грн', 'разница со средней t˚ по палате', 'грн',
  'разница со средней t˚ по палате', 'кол-во расчётов', 'кол-во заказов', 'коэф-т конверс.',
  'разница со средней t˚ по палате', 'кол-во дней', 'разница со средней t˚ по палате', 'понед.',
  'вторник', 'среда', 'четверг', 'пятница', 'суббота'/*, 'воскресенье'*/, 'всего', '8:00-11:00',
  '11:00-15:00', '15:00-19:00'/*, 'другое время'*/, 'всего'];

module.exports = function (req, res) {
  var from = req.params.from.split('.');
  var to = req.params.to.split('.');
  startTime = (!isNaN(from[1]))? new Date(from[2], from[1] - 1, from[0]): new Date(0);
  stopTime = (!isNaN(to[1]))? new Date(to[2], to[1] - 1, to[0], new Date().getHours() - 1): new Date();

  var fileName = 'Эффективность работы по продавцам(' + req.params.from + ' - ' + req.params.to +').xlsx';
  factoryId = req.session.user.factory_id;

  var workbook = new Excel.Workbook();
  getSellers(workbook, function (err, result) {
    if (!err) {
      result.xlsx.writeFile(fileName.replace('.xlsx', '_users.xlsx'))
      .then(function () {
        workbook.xlsx.writeFile(fileName)
        .then(function() {
          res.send({file: fileName, fields: [ // список данных, которые еще необходимо получить
            'getCosts',
            'getCostsBySize',
            'getCountWindows',
            'getSendedOrdersCount',
            'getTimeOfProcessing',
            'getOrdersByDays']});
        });
      });
    }
  });

};
function getSellers (workbook, callback) {
  var sheet = workbook.addWorksheet('эффективность работы');
  // sheet.getCell('A1').value = 'Эффективность работы';
  // sheet.mergeCells('A2', 'A3');
  // sheet.getCell('A2').value = 'Продавцы';
  // // шапка таблицы
  // sheet.mergeCells('B2', 'C2');
  // sheet.getCell('B2').value = 'Средняя стоимость расчета';
  // sheet.mergeCells('D2', 'E2');
  // sheet.getCell('D2').value = 'Средняя стоимость заказа';
  // sheet.mergeCells('F2', 'G2');
  // sheet.getCell('F2').value = 'Отклон. в цене при расч. заказов';
  // sheet.mergeCells('H2', 'I2');
  // sheet.getCell('H2').value = 'Средняя ст-ть 1 м2 заказа';
  // sheet.mergeCells('J2', 'K2');
  // sheet.getCell('J2').value = 'Среднее кол-во окон в заказе';
  // sheet.mergeCells('L2', 'O2');
  // sheet.getCell('L2').value = 'Коэфициент конверсии';
  // sheet.mergeCells('P2', 'Q2');
  // sheet.getCell('P2').value = 'Временная трансформация заказа';
  // sheet.mergeCells('R2', 'X2');
  // sheet.getCell('R2').value = 'Кол-во расчётов по дням недели';
  // sheet.mergeCells('Y2', 'AB2');
  // sheet.getCell('Y2').value = 'Кол-во расчётов по часам';
  // sheet.getRow(3).values = sTitle;

  models.users.findAll({
    include: [{model: models.orders,
      where: {factory_id: factoryId, created: {$gt: startTime, $lt: stopTime}},
      attributes: []
    }]
  }).then(function (users) {
    var cell1, cell2, currentSheet;
    var list = new Excel.Workbook();
    // var workbooks = [];
    if (users.length) {
      var list1 = list.addWorksheet('list');
      for (var i = 0; i < users.length; i++) {
        cell1 = sheet.getRow(i * 2 + 4).getCell(1).address;
        cell2 = sheet.getRow(i * 2 + 5).getCell(1).address;
        sheet.mergeCells(cell1, cell2);
        sheet.getCell(cell1).value = users[i].id + '-' + users[i].name;
        list1.addRow([users[i].id + '-' + users[i].name]);
        // for (var k = 3; k < 18; k += 2) {
        //   if (k !== 13) {
        //     sheet.mergeCells(sheet.getRow(i * 2 + 4).getCell(k).address, sheet.getRow(i * 2 + 5).getCell(k).address);
        //     sheet.getRow(i * 2 + 4).getCell(k).value = {formula: 'IF(' + sheet.getRow(users.length * 2 + 4).getCell(k - 1).address + '>0,' + sheet.getRow(i * 2 + 4).getCell(k - 1).address + ' - ' + sheet.getRow(users.length * 2 + 4).getCell(k - 1).address + ', 0)'};
        //   }
        // }
        // детальная таблица
        // workbooks[i] = new Excel.Workbook();
        currentSheet = workbook.addWorksheet(users[i].id + '-' + users[i].name);
        // currentSheet.getCell('A1').value = 'Эффективность работы';

        // currentSheet.mergeCells('B2', 'C2');
        // currentSheet.getCell('B2').value = 'Средняя стоимость расчета';
        // currentSheet.mergeCells('D2', 'E2');
        // currentSheet.getCell('D2').value = 'Средняя стоимость заказа';
        // currentSheet.mergeCells('F2', 'G2');
        // currentSheet.getCell('F2').value = 'Отклон. в цене при расч. заказов';
        // currentSheet.mergeCells('H2', 'I2');
        // currentSheet.getCell('H2').value = 'Средняя ст-ть 1 м2 заказа';
        // currentSheet.mergeCells('J2', 'K2');
        // currentSheet.getCell('J2').value = 'Среднее кол-во окон в заказе';
        // currentSheet.mergeCells('L2', 'O2');
        // currentSheet.getCell('L2').value = 'Коэфициент конверсии';
        // currentSheet.mergeCells('P2', 'Q2');
        // currentSheet.getCell('P2').value = 'Временная трансформация заказа';
        // currentSheet.mergeCells('R2', 'X2');
        // currentSheet.getCell('R2').value = 'Кол-во расчётов по дням недели';
        // currentSheet.mergeCells('Y2', 'AB2');
        // currentSheet.getCell('Y2').value = 'Кол-во расчётов по часам';
        // currentSheet.getRow(3).values = sTitle;
        for (var j = 0; j < titles.length; j++) {
          currentSheet.mergeCells(currentSheet.getRow(j * 2 + 4).getCell(1).address, currentSheet.getRow(j * 2 + 5).getCell(1).address);
          currentSheet.getRow(j * 2 + 4).getCell(1).value = titles[j];
          // for (var ink = 3; ink < 18; ink += 2) {
          //   currentSheet.mergeCells(sheet.getRow(j * 2 + 4).getCell(ink).address, currentSheet.getRow(j * 2 + 5).getCell(ink).address);
          //   currentSheet.getRow(j * 2 + 4).getCell(ink).value = {formula: currentSheet.getRow(j * 2 + 4).getCell(ink - 1).address + ' - ' + sheet.getRow(i * 2 + 4).getCell(ink - 1).value};
          // }
        }
        // workbooks[i].xlsx.writeFile('helpers_' + users[i].id + '-' + users[i].name + '.xlsx');
      }
      sheet.mergeCells(sheet.getRow(users.length * 2 + 4).getCell(1).address, sheet.getRow(users.length * 2 + 5).getCell(1).address);
      sheet.getRow(users.length * 2 + 4).getCell(1).value = 'ВСЕГО';
      // for (var l = 2; l < 18; l++) {
      //   sheet.mergeCells(sheet.getRow(users.length * 2 + 4).getCell(l).address, sheet.getRow(users.length * 2 + 5).getCell(l).address);
      //   sheet.getRow(users.length * 2 + 4).getCell(l).value = {formula: '=AVERAGE(' + sheet.getRow(4).getCell(l).address + ':' + sheet.getRow(users.length * 2 + 3).getCell(l).address + ')'};
      // }
    }
    callback(null, list);
  }).catch(function (err) {
    console.log('error:', err);
    callback(true, err);
  });
}
