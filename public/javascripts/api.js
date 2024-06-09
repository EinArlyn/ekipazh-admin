$(function () {
  /** Emit update */
  $('#emit-update').click(function (e) {
    e.preventDefault();

    var field = JSON.stringify({name:"Test", city_phone:"new"});
    $.post('/api/update?login=555555&access_token=fc869082f02bd799528ca06ab191aa0a', {
      model: 'users',
      rowId: 1254,
      field: field
    }, function(data) {
      alert(data.status);
    });
  });

  /** Emit get orders */
  $('#emit-get-orders').click(function (e) {
    e.preventDefault();

    $.get('/api/get/orders?login=555555&access_token=fc869082f02bd799528ca06ab191aa0a', function(data) {
      alert(data.status);
    });
  });

  /** Emit login */
  $('#emit-login').click(function (e) {
    $.post('/api/login', {
      login: '555555'
    }, function(data) {
      alert(data.status);
      console.log(data);
    });
  });

  /** Emit get locations */
  $('#emit-get-locations').click(function (e) {
    e.preventDefault();

    $.get('/api/get/locations?login=555555&access_token=fc869082f02bd799528ca06ab191aa0a', function(data) {
      alert(data.status);
      console.log(data);
    });
  });

  /** Emit get factories by country */
  $('#emit-get-factories-by-country').click(function (e) {
    e.preventDefault();

    $.get('/api/get/factories-by-country?' +
            'login=555555&' +
            'access_token=fc869082f02bd799528ca06ab191aa0a&' +
            'cities_ids=163,156,155',
    function (data) {
      alert(data.status);
      console.log(data);
    });
  });

  /** Emit registration */
  $('#emit-register').click(function (e) {
    e.preventDefault();

    $.post('/api/register', {
      name: 'users',
      phone: '102',
      email: 'example',
      cityId: 156,
      password: '9a1baa718c5bade6c77236b6a7d6ab99'
    }, function(data) {
      alert(data.status);
    });
  });

  /** Emit user signed */
  $('#emit-signed').click(function (e) {
    e.preventDefault();

    $.get('/api/signed?login=555555&access_token=fc869082f02bd799528ca06ab191aa0a', function(data) {
      alert(data.status);
      console.log(data);
    });
  });

  /** Emit synchronization */
  $('#emit-sync').click(function (e) {
    e.preventDefault();

    $.get('/api/sync?login=555555&access_token=fc869082f02bd799528ca06ab191aa0a', function(data) {
      alert(data.status);
      console.log(data);
    });
  });

  /** Emit insert new raw in DB model */
  $('#emit-insert').click(function (e) {
    e.preventDefault();
    var field = {
      state_buch: new Date(0), 
      state_to: new Date(0),
      sended: new Date(0),
      modified: new Date(),
      created: new Date(),
      customer_infoSource: 1,
      customer_occupation: 1,
      customer_education: 1,
      customer_age: 21,
      customer_sex: 1,
      customer_target: 'Test',
      customer_endtime: '1',
      customer_starttime: '2',
      customer_itn: 11,
      discount_addelem: 3.44,
      discount_construct: 4.33,
      order_price_total_primary: 4.33,
      order_price_total: 4.33,
      payment_monthly_primary: 4.33,
      payment_first_primary: 4.33,
      payment_monthly: 4.33,
      payment_first: 4.33,
      is_old_price: 1,
      instalment_id: 1,
      is_instalment: 1,
      mounting_id: 1,
      floor_id: 1,
      is_date_price_more: 1,
      is_date_price_less: 1,
      new_delivery_date: new Date(),
      delivery_date: new Date(),
      products_price_total: 10.38,
      products_qty: 1,
      order_style: 'sdsds',
      full_location: 'sdsds',
      climatic_zone: 2,
      customer_country: 'Ukraine',
      customer_region: 'Dnipropetrovsk',
      order_date: new Date(),
      user_id: 1254,
      mounting_price: 22.3,
      delivery_price: 22.3,
      sale_price: 22.3,
      purchase_price: 22.3,
      order_number: 'ZA0003TEST',
      factory_id: 208,
      factory_margin: 233.33,
      customer_city: 'Dnipropetrovsk',
      customer_address: 'Zavod',
      customer_email: 'test',
      customer_name: 'Alina',
      customer_phone_city: '123312',
      perimeter: 22.3,
      base_price: 22.23,
      square: 125.25,
      customer_phone: '04439349359',
      batch: 'ZN-32',
      additional_payment: '123'
    };

    var row = JSON.stringify(field);
    $.post('/api/insert?login=555555&access_token=fc869082f02bd799528ca06ab191aa0a', {
      model: 'orders',
      row: row
    }, function(data) {
      alert(data.status);
      console.log(data);
    });
  });

  $('#emit-remove-order').click(function(e) {
    e.preventDefault();

    $.post('/api/remove-order?login=555555&access_token=fc869082f02bd799528ca06ab191aa0a', {
      orderId: 12541443095884212
    }, function(data) {
      alert(data.status);
      console.log(data);
    });
  });
});