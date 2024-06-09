var util = require('util');
var i18n = require('i18n');
var models = require('../models');

exports.writeHistory = writeHistory; 
exports.validateNewRecords = validateNewRecords;

function writeHistory(userId, model, field, values, parent) {
  console.log('done')
  switch (model) {
    case 'add_params':
      var message, fieldName;
      if (field === 'is_payer') {
        fieldName = 'плательщика: ';
      } else if (field === 'is_employee') {
        fieldName = 'сотрудника: ';
      } else if (field === 'is_buch') {
        fieldName = 'бухгалтерии: ';
      } else if (field === 'is_to') {
        fieldName = 'тех. отдела: ';
      } else if (field === 'is_all_calcs') {
        fieldName = 'всех расчетов: ';
      }
      message = 'Изменен признак ' + fieldName + values.new_value;
      models.users_histories.create({
        user_id: parseInt(userId, 10),
        type: message,
        parent: parent,
        modified: new Date()
      }).then(function() {});
      break;
    case 'rights':
      var message, fieldName;
      if (field === 1) {
        fieldName = 'расчету окна: ';
      } else if (field === 2) {
        fieldName = 'рассрочке: ';
      } else if (field === 3) {
        fieldName = 'моей сети: ';
      } else if (field === 4) {
        fieldName = 'почте: ';
      } else if (field === 5) {
        fieldName = 'истории заказов: ';
      } else if (field === 6) {
        fieldName = 'документам: ';
      } else if (field === 7) {
        fieldName = 'заявкам на замер: ';
      } else if (field === 8) {
        fieldName = 'заказам профилей: ';
      } else if (field === 9) {
        fieldName = 'производству: ';
      } else if (field === 10) {
        fieldName = 'базе элементов: ';
      } else if (field === 11) {
        fieldName = 'аналитике: ';
      }
      message = 'Изменен доступ к ' + fieldName + values.new_value;
      models.users_histories.create({
        user_id: parseInt(userId, 10),
        type: message,
        parent: parent,
        modified: new Date()
      }).then(function() {});
      break;
    case 'delivery':
      var message;
      if (field !== 'active_1' && field !== 'active_2' && field !== 'active_3' && field !== 'active_4' && field !== 'active_5' && field !== 'active_6' && field !== 'type_1' && field !== 'type_2' && field !== 'type_3' && field !== 'type_4' && field !== 'type_5') {
        message = 'Установлено новое значение для доставки: ' + values.old_value + ' --> ' + values.new_value;
        models.users_histories.create({
          user_id: parseInt(userId, 10),
          type: message,
          parent: parent,
          modified: new Date()
        }).then(function() {});
      } 
      break;
    case 'mounting':
      var message;
      if (field !== 'active_1' && field !== 'active_2' && field !== 'active_3' && field !== 'active_4' && field !== 'active_5' && field !== 'active_6' && field !== 'type_1' && field !== 'type_2' && field !== 'type_3' && field !== 'type_4' && field !== 'type_5') {
        message = 'Установлено новое значение для монтажа: ' + values.old_value + ' --> ' + values.new_value;
        models.users_histories.create({
          user_id: parseInt(userId, 10),
          type: message,
          parent: parent,
          modified: new Date()
        }).then(function() {});
      } 
      break;
    case 'users':
      var message;
      if (field === 'fax') {
        message = 'Изменен факс пользователя: ' + values.old_value + ' --> ' + values.new_value;
      } else if (field === 'legal_name') {
        message = 'Изменено физ. лицо пользователя: ' + values.old_value + ' --> ' + values.new_value;
      } else if (field === 'city_id') {
        message = 'Изменено айди города пользователя: ' + values.old_value + ' --> ' + values.new_value;
      } else if (field === 'city_phone') {
        message = 'Изменен городской номер пользователя: ' + values.old_value + ' --> ' + values.new_value;
      } else if (field === 'contact_name') {
        message = 'Изменено контактное имя пользователя: ' + values.old_value + ' --> ' + values.new_value;
      } else if (field === 'director') {
        message = 'Изменено имя директора пользователя: ' + values.old_value + ' --> ' + values.new_value;
      } else if (field === 'bank_acc_no') {
        message = 'Изменен банковский номер счета пользователя: ' + values.old_value + ' --> ' + values.new_value;
      } else if (field === 'bank_name') {
        message = 'Изменено название банка пользователя: ' + values.old_value + ' --> ' + values.new_value;
      } else if (field === 'mfo') {
        message = 'Изменен МФО пользователя: ' + values.old_value + ' --> ' + values.new_value;
      } else if (field === 'okpo') {
        message = 'Изменен ОКПО пользователя: ' + values.old_value + ' --> ' + values.new_value;
      } else if (field === 'inn') {
        message = 'Изменен ИНН пользователя: ' + values.old_value + ' --> ' + values.new_value;
      } else if (field === 'phone') {
        message = 'Изменен мобильный номер (логин) пользователя: ' + values.old_value + ' --> ' + values.new_value;
      } else if (field === 'name') {
        message = 'Изменено имя пользователя: ' + values.old_value + ' --> ' + values.new_value;
      } else if (field === 'short_id') {
        message = 'Изменен айди пользователя: ' + values.old_value + ' --> ' + values.new_value;
      } else if (field === 'password') {
        message = 'Изменен пароль пользователя: ' + values.old_value + ' --> ' + values.new_value;
      } else if (field === 'email') {
        message = 'Изменена эл. почта пользователя: ' + values.old_value + ' --> ' + values.new_value;
      } else if (field === 'address') {
        message = 'Изменен адрес пользователя: ' + values.old_value + ' --> ' + values.new_value;
      } else if (field === 'identificator') {
        message = 'Изменен идентификатор пользователя: ' + values.old_value + ' --> ' + values.new_value;
      } else if (field === 'avatar') {
        message = 'Изменен аватар пользователя.';
      } else if (field === 'mount_mon') {
        message = 'Изменена наценка монтажа на понедельник: ' + values.old_value + ' --> ' + values.new_value;
      } else if (field === 'mount_tue') {
        message = 'Изменена наценка монтажа на вторник: ' + values.old_value + ' --> ' + values.new_value;
      } else if (field === 'mount_wed') {
        message = 'Изменена наценка монтажа на среду: ' + values.old_value + ' --> ' + values.new_value;
      } else if (field === 'mount_thu') {
        message = 'Изменена наценка монтажа на четверг: ' + values.old_value + ' --> ' + values.new_value;
      } else if (field === 'mount_fri') {
        message = 'Изменена наценка монтажа на пятницу: ' + values.old_value + ' --> ' + values.new_value;
      } else if (field === 'mount_sat') {
        message = 'Изменена наценка монтажа на субботу: ' + values.old_value + ' --> ' + values.new_value;
      } else if (field === 'mount_sun') {
        message = 'Изменена наценка монтажа на воскресенье: ' + values.old_value + ' --> ' + values.new_value;
      }
      models.users_histories.create({
        user_id: parseInt(userId, 10),
        type: message,
        parent: parent,
        modified: new Date()
      }).then(function() {});
      break;
    case 'discounts':
      var message;
      if (field === 'max_construct') {
        message = 'Изменена макс. скидка на конструкции: ' + values.old_value + ' --> ' + values.new_value;
      } else if (field === 'max_add_elem') {
        message = 'Изменена макс. скидка на доп. элементы: ' + values.old_value + ' --> ' + values.new_value;
      } else if (field === 'default_construct') {
        message = 'Изменена скидка по умолчанию на конструкции: ' + values.old_value + ' --> ' + values.new_value;
      } else if (field === 'default_add_elem') {
        message = 'Изменена скидка по умолчанию на доп. элементы: ' + values.old_value + ' --> ' + values.new_value;
      } else if (field === 'week_1_construct') {
        message = 'Изменена скида на отложеный заказ (1 неделя): ' + values.old_value + ' --> ' + values.new_value;
      } else if (field === 'week_1_add_elem') {
        message = 'Изменена скида на отложеный заказ (1 неделя): ' + values.old_value + ' --> ' + values.new_value;
      } else if (field === 'week_2_construct') {
        message = 'Изменена скида на отложеный заказ (2 недели): ' + values.old_value + ' --> ' + values.new_value;
      } else if (field === 'week_2_add_elem') {
        message = 'Изменена скида на отложеный заказ (2 недели): ' + values.old_value + ' --> ' + values.new_value;
      } else if (field === 'week_3_construct') {
        message = 'Изменена скида на отложеный заказ (3 недели): ' + values.old_value + ' --> ' + values.new_value;
      } else if (field === 'week_3_add_elem') {
        message = 'Изменена скида на отложеный заказ (3 недели): ' + values.old_value + ' --> ' + values.new_value;
      } else if (field === 'week_4_construct') {
        message = 'Изменена скида на отложеный заказ (4 недели): ' + values.old_value + ' --> ' + values.new_value;
      } else if (field === 'week_4_add_elem') {
        message = 'Изменена скида на отложеный заказ (4 недели): ' + values.old_value + ' --> ' + values.new_value;
      } else if (field === 'week_5_construct') {
        message = 'Изменена скида на отложеный заказ (5 недель): ' + values.old_value + ' --> ' + values.new_value;
      } else if (field === 'week_5_add_elem') {
        message = 'Изменена скида на отложеный заказ (5 недель): ' + values.old_value + ' --> ' + values.new_value;
      } else if (field === 'week_6_construct') {
        message = 'Изменена скида на отложеный заказ (6 недель): ' + values.old_value + ' --> ' + values.new_value;
      } else if (field === 'week_6_add_elem') {
        message = 'Изменена скида на отложеный заказ (6 недель): ' + values.old_value + ' --> ' + values.new_value;
      } else if (field === 'week_7_construct') {
        message = 'Изменена скида на отложеный заказ (7 недель): ' + values.old_value + ' --> ' + values.new_value;
      } else if (field === 'week_7_add_elem') {
        message = 'Изменена скида на отложеный заказ (7 недель): ' + values.old_value + ' --> ' + values.new_value;
      } else if (field === 'week_8_construct') {
        message = 'Изменена скида на отложеный заказ (8 недель): ' + values.old_value + ' --> ' + values.new_value;
      } else if (field === 'week_8_add_elem') {
        message = 'Изменена скида на отложеный заказ (8 недель): ' + values.old_value + ' --> ' + values.new_value;
      }
      models.users_histories.create({
        user_id: parseInt(userId, 10),
        type: message,
        parent: parent,
        modified: new Date()
      }).then(function() {});
      break;
  }  
}

function validateNewRecords(userId, model, oldRow, newRow, parent) {
  oldRow = JSON.parse(oldRow);
  newRow = JSON.parse(newRow);

  for (var property in oldRow) {
    if (oldRow[property] !== newRow[property] && property !== 'modified') {      
      writeHistory(userId, model, property, {old_value: oldRow[property], new_value: newRow[property]}, parent);
    }
  }
}