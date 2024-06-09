var models = require('../models');

// elements - suppliers
models.elements.belongsTo(models.suppliers, {
    foreignKey: 'supplier_id'
});
models.suppliers.hasMany(models.elements, {
    foreignKey: 'id'
});

// elements - factories
models.elements.belongsTo(models.factories, {
    foreignKey: 'factory_id'
});
models.factories.hasMany(models.elements, {
    foreignKey: 'id'
});

// factories - currencies
models.currencies.belongsTo(models.factories, {
    foreignKey: 'factory_id'
});
models.factories.hasMany(models.currencies, {
    foreignKey: 'id'
});

// elements - currencies
models.elements.belongsTo(models.currencies, {
    foreignKey: 'currency_id'
});
models.currencies.hasMany(models.elements, {
    foreignKey: 'id'
});

// elements - elements_groups
models.elements.belongsTo(models.elements_groups, {
    foreignKey: 'element_group_id'
});
models.elements_groups.hasOne(models.elements, {
    foreignKey: 'id'
});

// elements - lists
models.lists.belongsTo(models.elements, {
    foreignKey: 'id'
});
models.elements.hasMany(models.lists, {
    foreignKey: 'parent_element_id'
});

// // -------------------------------------
// models.lists.belongsTo(models.elements, {
//     foreignKey: 'parent_element_id'
// });
// models.elements.hasMany(models.lists, {
//     foreignKey: 'id'
// });
// -------------------------------------

// lists - lists_groups
models.lists.belongsTo(models.lists_groups, {
    foreignKey: 'list_group_id'
});
models.lists_groups.hasOne(models.lists, {
    foreignKey: 'id'
});

// lists - lists_types
models.lists.belongsTo(models.lists_types, {
    foreignKey: 'list_type_id'
});
models.lists_types.hasOne(models.lists, {
    foreignKey: 'id'
});

// // lists - lists_contents
// models.list_contents.belongsTo(models.lists, {
//     foreignKey: 'id'
// });
// models.lists.hasMany(models.list_contents, {
//     foreignKey: 'parent_list_id'
// });

// profile_systems - profile_systems_folder
models.profile_systems.belongsTo(models.profile_system_folders, {
    foreignKey: 'folder_id'
});
models.profile_system_folders.hasMany(models.profile_systems, {
    foreignKey: 'folder_id'
});

// elements - glass_folder
models.elements.belongsTo(models.glass_folders, {
    foreignKey: 'glass_folder_id'
});
models.glass_folders.hasOne(models.elements, {
    foreignKey: 'id'
});

// lamination_default_colors - lamination_factory_colors
models.lamination_factory_colors.belongsTo(models.lamination_default_colors, {
    foreignKey: 'lamination_type_id'
});

models.lamination_default_colors.hasOne(models.lamination_factory_colors, {
    foreignKey: 'id'
});

// lamination_factory_colors - factories
models.lamination_factory_colors.belongsTo(models.factories, {
    foreignKey: 'factory_id'
});

models.factories.hasOne(models.lamination_factory_colors, {
    foreignKey: 'id'
});

// elements_profile_systems - elements
models.elements_profile_systems.belongsTo(models.elements, {
    foreignKey: 'element_id'
});

models.elements.hasMany(models.elements_profile_systems, {
    foreignKey: 'id'
});

// elements_profile_systems - profile_systems
models.elements_profile_systems.belongsTo(models.profile_systems, {
    foreignKey: 'id'
});

models.profile_systems.hasMany(models.elements_profile_systems, {
    foreignKey: 'profile_system_id'
});

// orders - orders_contents
models.order_products.belongsTo(models.orders, {
    foreignKey: 'order_id' // -------------------------- 'id'
});

models.orders.hasMany(models.order_products, {
    foreignKey: 'order_id'
});

// orders_contents - profile_systems
models.order_products.belongsTo(models.profile_systems, {
    foreignKey: 'profile_id'
});

models.profile_systems.hasMany(models.order_products, { //------------ hasOne
    foreignKey: 'profile_id' //------------------------- 'id'
});

// orders_contents - doors_groups
models.order_products.belongsTo(models.doors_groups, {
    foreignKey: 'door_group_id'
});

models.doors_groups.hasOne(models.order_products, {
    foreignKey: 'id'
});

// orders_contents - window_hardware_groups
models.order_products.belongsTo(models.window_hardware_groups, {
    foreignKey: 'hardware_id'
});

models.window_hardware_groups.hasMany(models.order_products, {
    foreignKey: 'hardware_id' //-------------------------'id'
});

// order_addelements - orders
models.order_addelements.belongsTo(models.orders, {
    foreignKey: 'order_id'// ----------------------------'id'
});
models.orders.hasMany(models.order_addelements, {
    foreignKey: 'order_id'
});

// orders_contents - laminations
models.orders_contents.belongsTo(models.lamination_factory_colors, {
    foreignKey: 'lamination_id'
});

models.lamination_factory_colors.hasMany(models.orders_contents, {
    foreignKey: 'id'
});

// orders - users
models.orders.belongsTo(models.users, {
    foreignKey: 'user_id' // ----------------------'id'
});
models.users.hasMany(models.orders, {
    foreignKey: 'user_id'
});
// // orders - users
// models.orders.belongsTo(models.users, {
//     foreignKey: 'user_id'
// });
// models.users.hasMany(models.orders, {
//     foreignKey: 'id'
// });

//order_elements - elements
models.order_elements.belongsTo(models.elements, {
    foreignKey: 'element_id'
});
models.elements.hasOne(models.order_elements, {
    foreignKey: 'id'
});

// users - cities
models.users.belongsTo(models.cities, {
    foreignKey: 'city_id'
});
models.cities.hasMany(models.users, {
    foreignKey: 'id'
});

// window_hardwares - directions
models.window_hardwares.belongsTo(models.directions, {
    foreignKey: 'direction_id'
});

models.directions.hasMany(models.window_hardwares, {
    foreignKey: 'id'
});

// window_hardwares - lamination_factory_colors
models.window_hardwares.belongsTo(models.lamination_factory_colors, {
    foreignKey: 'window_hardware_color_id'
});

models.lamination_factory_colors.hasMany(models.window_hardwares, {
    foreignKey: 'id'
});

// doors_hardware_items - lamination_factory_colors
models.doors_hardware_items.belongsTo(models.lamination_factory_colors, {
    foreignKey: 'hardware_color_id'
});

models.lamination_factory_colors.hasMany(models.doors_hardware_items, {
    foreignKey: 'id'
});

// elements - list_contents
models.list_contents.belongsTo(models.elements, {
    foreignKey: 'id'
});
models.elements.hasOne(models.list_contents, {
    foreignKey: 'child_id'
});

// lists - list_contents
models.list_contents.belongsTo(models.lists, {
    foreignKey: 'id'
});
models.lists.hasOne(models.list_contents, {
    foreignKey: 'child_id'
});

// list_contents - rules_types
models.list_contents.belongsTo(models.rules_types, {
    foreignKey: 'rules_type_id'
});
models.rules_types.hasOne(models.list_contents, {
    foreignKey: 'id'
});
// // windows_harware_groups - windows_harware_features
// models.window_hardware_features.belongsTo(models.window_hardware_groups, {
//     foreignKey: 'id'
// });

// models.window_hardware_groups.hasOne(models.window_hardware_features, {
//     foreignKey: 'hardware_group_id'
// });
// // options_coefficient - factories
// models.options_coefficient.belongsTo(models.factories, {
//     foreignKey: 'factory_id'
// });

// models.factories.hasOne(models.options_coefficient, {
//     foreignKey: 'id'
// });

// beed_profile_systems - lists
models.beed_profile_systems.belongsTo(models.lists, {
    foreignKey: 'id'
});
models.lists.hasMany(models.beed_profile_systems, {
    foreignKey: 'list_id'
});

//profile_systems - beed_profile_systems
models.beed_profile_systems.belongsTo(models.profile_systems, {
    foreignKey: 'profile_system_id'
});
models.profile_systems.hasOne(models.beed_profile_systems, {
    foreignKey: 'id'
});

// cities - regions
models.cities.belongsTo(models.regions, {
    foreignKey: 'region_id'
});

models.regions.hasMany(models.cities, {
    foreignKey: 'region_id' // -----------------------'id'
});

// users sessions - users
models.users_sessions.belongsTo(models.users, {
    foreignKey: 'id'
});
models.users.hasMany(models.users_sessions, {
    foreignKey: 'user_id'
});

// users calcs - users
models.users_calcs.belongsTo(models.users, {
    foreignKey: 'id'
});
models.users.hasMany(models.users_calcs, {
    foreignKey: 'user_id'
});

/** hardware folders vs hardware groups */
// models.window_hardware_groups.belongsTo(models.window_hardware_folders, {
//     foreignKey: 'folder_id'
// });

models.window_hardware_folders.hasMany(models.window_hardware_groups, {
    foreignKey: 'folder_id'
});

// factories - factory_emails
models.factory_emails.belongsTo(models.factories, {
    foreignKey: 'id'
});
models.factories.hasMany(models.factory_emails, {
    foreignKey: 'factory_id'
});

// background_templates vs template_groups
models.background_templates.belongsTo(models.template_groups, {
    foreignKey: 'group_id'
});
models.template_groups.hasOne(models.background_templates, {
    foreignKey: 'id'
});

/** order_prices - orders */
models.order_prices.belongsTo(models.orders, {
    foreignKey: 'order_id'
});
// models.orders.hasOne(models.order_prices, {
//     foreignKey: 'order_id'
// });
/** order_prices - users */
models.order_prices.belongsTo(models.users, {
    foreignKey: 'seller_id'
});

/** lock_lists - lists */
models.lock_lists.belongsTo(models.lists, {
    foreignKey: 'list_id'
});


models.orders.belongsTo(models.cities, {
    foreignKey: 'customer_city_id'
});
models.cities.hasMany(models.orders, {
    foreignKey: 'customer_city_id'
});

models.window_hardwares.belongsTo(models.window_hardware_types, {
    foreignKey: 'window_hardware_type_id'
});
models.window_hardware_types.hasMany(models.window_hardwares, {
    foreignKey: 'window_hardware_type_id'
});

models.window_hardwares.belongsTo(models.window_hardware_groups, {
    foreignKey: 'window_hardware_group_id'
});
models.window_hardware_groups.hasMany(models.window_hardwares, {
    foreignKey: 'window_hardware_group_id'
});

models.order_addelements.belongsTo(models.lists, {
    foreignKey: 'element_id'
});
models.lists.hasMany(models.order_addelements, {
    foreignKey: 'element_id'
});

models.lists.belongsTo(models.addition_folders, {
    foreignKey: 'addition_folder_id'
});
