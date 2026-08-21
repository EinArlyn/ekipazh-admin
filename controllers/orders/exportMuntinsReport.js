var xl = require('excel4node');
var models = require('../../lib/models');

var REPORT_HEADERS = ['Название', 'Артикул', 'Кол-во', 'Размер', 'Вес', 'Валюта', 'Цена за ед.', 'Общая цена'];
var NUMERIC_COLUMNS = {
  2: true,
  4: true,
  6: true,
  7: true
};

function getNumericValue(value) {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  var normalized = String(value).replace(/\s+/g, '').replace(',', '.');
  var parsed = Number(normalized);

  return Number.isFinite(parsed) ? parsed : null;
}

function buildSection(product) {
  var template;
  var reportRows;
  var colorName;

  try {
    template = JSON.parse(product.template_source || '{}');
  } catch (err) {
    return null;
  }

  reportRows = Array.isArray(template.report) ? template.report : [];
  colorName = template.color && template.color.name ? template.color.name : 'белый';

  if (!reportRows.length) {
    return null;
  }

  return {
    title: 'Шаблон: ' + ((template.template && template.template.name) || '-') + ' | ' +
      'Ширина: ' + (template.width || '-') + ' мм | ' +
      'Высота: ' + (template.height || '-') + ' мм | ' +
      'Цвет: ' + colorName + ' | ' +
      'Кол-во: ' + (product.product_qty || '-') + ' шт | ' +
      'Сетка: ' + ((template.grid && template.grid.name) || '-') + ' | ' +
      'Система: ' + ((template.system && template.system.name) || '-'),
    headers: REPORT_HEADERS.slice(),
    rows: reportRows.map(function (item) {
      return [
        item.name || '',
        item.sku || '',
        item.qty == null ? '' : item.qty,
        item.size || '',
        item.weight == null ? '' : item.weight,
        item.currency || '',
        item.basePrice == null ? '' : item.basePrice,
        item.totalPrice == null ? '' : item.totalPrice
      ];
    })
  };
}

module.exports = function (req, res) {
  var orderId = req.params.id;

  models.order_prices.find({
    where: {
      order_id: orderId,
      user_id: req.session.user.id
    },
    include: [{
      model: models.orders,
      attributes: ['id', 'order_number'],
      include: [{
        model: models.order_products,
        attributes: ['id', 'product_qty', 'template_source', 'is_addelem_only']
      }]
    }]
  }).then(function (orderPrice) {
    var wb;
    var ws;
    var titleStyle;
    var headerStyle;
    var cellStyle;
    var numericCellStyle;
    var summaryCellStyle;
    var summaryNumericCellStyle;
    var rowIndex;
    var fileName;
    var sections;
    var orderNumber;

    if (!orderPrice || !orderPrice.order) {
      return res.status(404).send('Order not found');
    }

    sections = orderPrice.order.order_products
      .filter(function (product) {
        return product.is_addelem_only === 5;
      })
      .map(buildSection)
      .filter(Boolean);

    if (!sections.length) {
      return res.status(404).send('No grid report data');
    }

    wb = new xl.Workbook();
    ws = wb.addWorksheet('GridExp');

    titleStyle = wb.createStyle({
      font: {
        bold: true,
        size: 12
      },
      alignment: {
        wrapText: true,
        vertical: 'center'
      },
      fill: {
        type: 'pattern',
        patternType: 'solid',
        fgColor: '#D9EAF7'
      },
      border: {
        left: { style: 'thin' },
        right: { style: 'thin' },
        top: { style: 'thin' },
        bottom: { style: 'thin' }
      }
    });

    headerStyle = wb.createStyle({
      font: {
        bold: true
      },
      alignment: {
        horizontal: 'center',
        vertical: 'center',
        wrapText: true
      },
      fill: {
        type: 'pattern',
        patternType: 'solid',
        fgColor: '#EFEFEF'
      },
      border: {
        left: { style: 'thin' },
        right: { style: 'thin' },
        top: { style: 'thin' },
        bottom: { style: 'thin' }
      }
    });

    cellStyle = wb.createStyle({
      alignment: {
        vertical: 'center',
        wrapText: true
      },
      border: {
        left: { style: 'thin' },
        right: { style: 'thin' },
        top: { style: 'thin' },
        bottom: { style: 'thin' }
      }
    });

    numericCellStyle = wb.createStyle({
      alignment: {
        vertical: 'center',
        wrapText: true
      },
      border: {
        left: { style: 'thin' },
        right: { style: 'thin' },
        top: { style: 'thin' },
        bottom: { style: 'thin' }
      }
    });

    summaryCellStyle = wb.createStyle({
      font: {
        bold: true
      },
      alignment: {
        vertical: 'center',
        wrapText: true
      },
      fill: {
        type: 'pattern',
        patternType: 'solid',
        fgColor: '#D9EAF7'
      },
      border: {
        left: { style: 'thin' },
        right: { style: 'thin' },
        top: { style: 'thin' },
        bottom: { style: 'thin' }
      }
    });

    summaryNumericCellStyle = wb.createStyle({
      font: {
        bold: true
      },
      alignment: {
        vertical: 'center',
        wrapText: true
      },
      fill: {
        type: 'pattern',
        patternType: 'solid',
        fgColor: '#D9EAF7'
      },
      border: {
        left: { style: 'thin' },
        right: { style: 'thin' },
        top: { style: 'thin' },
        bottom: { style: 'thin' }
      }
    });

    ws.column(1).setWidth(42);
    ws.column(2).setWidth(20);
    ws.column(3).setWidth(14);
    ws.column(4).setWidth(20);
    ws.column(5).setWidth(14);
    ws.column(6).setWidth(14);
    ws.column(7).setWidth(18);
    ws.column(8).setWidth(18);

    orderNumber = orderPrice.order.order_number || orderId;
    rowIndex = 1;

    ws.cell(rowIndex, 1, rowIndex, REPORT_HEADERS.length, true)
      .string('Заказ: ' + orderNumber)
      .style(titleStyle);
    ws.row(rowIndex).setHeight(24);

    rowIndex += 2;

    sections.forEach(function (section) {
      ws.cell(rowIndex, 1, rowIndex, REPORT_HEADERS.length, true)
        .string(section.title)
        .style(titleStyle);
      ws.row(rowIndex).setHeight(36);

      rowIndex += 1;

      section.headers.forEach(function (header, columnIndex) {
        ws.cell(rowIndex, columnIndex + 1)
          .string(header)
          .style(headerStyle);
      });

      rowIndex += 1;

      section.rows.forEach(function (row) {
        var isLastRow = row === section.rows[section.rows.length - 1];

        row.forEach(function (value, columnIndex) {
          var numericValue = NUMERIC_COLUMNS[columnIndex] ? getNumericValue(value) : null;

          if (numericValue !== null) {
            ws.cell(rowIndex, columnIndex + 1)
              .number(numericValue)
              .style(isLastRow ? summaryNumericCellStyle : numericCellStyle);
          } else {
            ws.cell(rowIndex, columnIndex + 1)
              .string(value == null ? '' : String(value))
              .style(isLastRow ? summaryCellStyle : cellStyle);
          }
        });

        rowIndex += 1;
      });

      rowIndex += 1;
    });

    fileName = 'grid-report-order-' + orderId + '.xlsx';
    wb.write(fileName, res);
  }).catch(function (err) {
    console.log(err);
    res.status(500).send('Failed to export grid report');
  });
};
