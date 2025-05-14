var async = require("async");
var models = require("../../lib/models");

/**
 * Sync mobile application with pSQL
 * @param {string}       login          This is user login
 * @param {string}       access_token   User access token
 * @param {timestamp}    lastSyncDate   Last Sync date
 */
module.exports = function (req, res) {
  //var factory_id = req.body.access_token || 208;
  var login = req.query.login;
  var access_token = req.query.access_token;

  models.users
    .find({
      where: { phone: login, device_code: access_token },
    })
    .then(function (user) {
      var tables = {};
      var lastSync = new Date();
      var userId = user.id;
      var factory_id = user.factory_id;

      user
        .updateAttributes({
          last_sync: lastSync,
        })
        .then(function () {
          async.parallel(
            [
              function (callback) {
                /** addition_colors */
                models.addition_colors
                  .findAll({
                    attributes: ["img", "lists_type_id", "name", "id", "lamination_factory_colors_id"],
                  })
                  .then(function (addition_colors) {
                    var values = [];
                    tables.addition_colors = {};
                    tables.addition_colors.fields = [
                      "img",
                      "lists_type_id",
                      "name",
                      "id",
                      "lamination_factory_colors_id",
                    ];
                    sortValues(addition_colors, function (values) {
                      tables.addition_colors.rows = values;
                      callback(null);
                    });
                  });
              },
              function (callback) {
                /** addition_folders */
                models.sequelize
                  .query(
                    `SELECT AF.max_size, AF.position, AF.img, AF.description, AF.link, AF.modified, AF.factory_id, AF.addition_type_id, AF.name, AF.id
                    FROM addition_folders AS AF
                    JOIN users AS U ON U.id = ${userId}
                    JOIN cities AS C ON C.id = U.city_id
                    JOIN regions AS R ON R.id = C.region_id
                    JOIN compliance_addition_folders AS CAF ON CAF.country_id = R.country_id
                    WHERE AF.factory_id = ${factory_id} AND AF.id = CAF.addition_folders_id`
                  )
                  .then(function (addition_folders) {
                    var values = [];
                    tables.addition_folders = {};
                    tables.addition_folders.fields = [
                      "max_size",
                      "position",
                      "img",
                      "description",
                      "link",
                      "modified",
                      "factory_id",
                      "addition_type_id",
                      "name",
                      "id",
                    ];
                    sortQueries(addition_folders[0], function (values) {
                      tables.addition_folders.rows = values;
                      callback(null);
                    });
                  });
              },
              function (callback) {
                /** addition_coefficients */
                models.sequelize
                  .query(
                    "SELECT a_c.list_type_id, a_c.value " +
                      "FROM users " +
                      "JOIN addition_coefficients a_c ON a_c.direction_id = users.direction_id " +
                      "WHERE users.id = " +
                      parseInt(userId) +
                      ""
                  )
                  .then(function (addition_coefficients) {
                    tables.addition_coefficients = {};
                    tables.addition_coefficients.fields = [
                      "list_type_id",
                      "value",
                    ];
                    sortQueries(addition_coefficients[0], function (values) {
                      tables.addition_coefficients.rows = values;
                      callback(null);
                    });
                  });
              },
              function (callback) {
                /** beed_profile_systems */
                models.sequelize
                  .query(
                    "SELECT B.id, B.profile_system_id, B.list_id, B.glass_width, B.modified " +
                      "FROM beed_profile_systems B " +
                      "JOIN lists L " +
                      "ON B.list_id = L.id " +
                      "JOIN elements E " +
                      "ON L.parent_element_id = E.id " +
                      "WHERE E.factory_id = " +
                      parseInt(factory_id) +
                      ""
                  )
                  .then(function (beed_profile_systems) {
                    tables.beed_profile_systems = {};
                    tables.beed_profile_systems.fields = [
                      "id",
                      "profile_system_id",
                      "list_id",
                      "glass_width",
                      "modified",
                    ];
                    sortQueries(beed_profile_systems[0], function (values) {
                      tables.beed_profile_systems.rows = values;
                      callback(null);
                    });
                  });
              },
              function (callback) {
                /** users_coefficients */
                models.sequelize
                  .query(
                    "SELECT p_s.id AS profile_id, u_c.value " +
                      "FROM users " +
                      "JOIN users_coefficients u_c ON u_c.direction_id = users.direction_id " +
                      "JOIN profile_systems p_s ON p_s.code_sync = u_c.profile_id " +
                      "WHERE users.id = " +
                      parseInt(userId) +
                      ""
                  )
                  .then(function (users_coefficients) {
                    tables.users_coefficients = {};
                    tables.users_coefficients.fields = ["profile_id", "value"];
                    sortQueries(users_coefficients[0], function (values) {
                      tables.users_coefficients.rows = values;
                      callback(null);
                    });
                  });
              },
              function (callback) {
                /** currencies */
                models.currencies
                  .findAll({
                    where: { factory_id: factory_id },
                  })
                  .then(function (currencies) {
                    tables.currencies = {};
                    tables.currencies.fields = [
                      "modified",
                      "is_base",
                      "factory_id",
                      "value",
                      "name",
                      "id",
                    ];
                    sortValues(currencies, function (values) {
                      tables.currencies.rows = values;
                      callback(null);
                    });
                  });
              },
              function (callback) {
                /** directions */
                models.directions.findAll().then(function (directions) {
                  tables.directions = {};
                  tables.directions.fields = ["modified", "name", "id"];
                  sortValues(directions, function (values) {
                    tables.directions.rows = values;
                    callback(null);
                  });
                });
              },
              function (callback) {
                /** locales_names */
                models.locales_names
                  .findAll({
                    where: {
                      factory_id: factory_id,
                      table_name: "profile_systems",
                    },
                  })
                  .then(function (locales_names) {
                    tables.locales_names_profile_systems = {};
                    tables.locales_names_profile_systems.fields = [
                      "id",
                      "table_name",
                      "table_id",
                      "table_attr",
                      "ru",
                      "en",
                      "ua",
                      "de",
                      "ro",
                      "it",
                      "pl",
                      "es",
                      "bg",
                    ];
                    sortValues(locales_names, function (values) {
                      tables.locales_names_profile_systems.rows = values;
                      callback(null);
                    });
                  });
              },
              function (callback) {
                /** locales_names */
                models.locales_names
                  .findAll({
                    where: {
                      factory_id: factory_id,
                      table_name: "glass_folders",
                    },
                  })
                  .then(function (locales_names) {
                    tables.locales_names_glass_folders = {};
                    tables.locales_names_glass_folders.fields = [
                      "id",
                      "table_name",
                      "table_id",
                      "table_attr",
                      "ru",
                      "en",
                      "ua",
                      "de",
                      "ro",
                      "it",
                      "pl",
                      "es",
                      "bg",
                    ];
                    sortValues(locales_names, function (values) {
                      tables.locales_names_glass_folders.rows = values;
                      callback(null);
                    });
                  });
              },
              function (callback) {
                /** locales_names */
                models.locales_names
                  .findAll({
                    where: {
                      factory_id: factory_id,
                      table_name: "addition_folders",
                    },
                  })
                  .then(function (locales_names) {
                    tables.locales_names_addition_folders = {};
                    tables.locales_names_addition_folders.fields = [
                      "id",
                      "table_name",
                      "table_id",
                      "table_attr",
                      "ru",
                      "en",
                      "ua",
                      "de",
                      "ro",
                      "it",
                      "pl",
                      "es",
                      "bg",
                    ];
                    sortValues(locales_names, function (values) {
                      tables.locales_names_addition_folders.rows = values;
                      callback(null);
                    });
                  });
              },
              function (callback) {
                /** locales_names */
                models.locales_names
                  .findAll({
                    where: {
                      factory_id: factory_id,
                      table_name: "doors_hardware_groups",
                    },
                  })
                  .then(function (locales_names) {
                    tables.locales_names_doors_hardware_groups = {};
                    tables.locales_names_doors_hardware_groups.fields = [
                      "id",
                      "table_name",
                      "table_id",
                      "table_attr",
                      "ru",
                      "en",
                      "ua",
                      "de",
                      "ro",
                      "it",
                      "pl",
                      "es",
                      "bg",
                    ];
                    sortValues(locales_names, function (values) {
                      tables.locales_names_doors_hardware_groups.rows = values;
                      callback(null);
                    });
                  });
              },
              function (callback) {
                /** locales_names */
                models.locales_names
                  .findAll({
                    where: {
                      factory_id: factory_id,
                      table_name: "doors_groups",
                    },
                  })
                  .then(function (locales_names) {
                    tables.locales_names_doors_groups = {};
                    tables.locales_names_doors_groups.fields = [
                      "id",
                      "table_name",
                      "table_id",
                      "table_attr",
                      "ru",
                      "en",
                      "ua",
                      "de",
                      "ro",
                      "it",
                      "pl",
                      "es",
                      "bg",
                    ];
                    sortValues(locales_names, function (values) {
                      tables.locales_names_doors_groups.rows = values;
                      callback(null);
                    });
                  });
              },
              function (callback) {
                /** locales_names */
                models.locales_names
                  .findAll({
                    where: { factory_id: factory_id, table_name: "lists" },
                  })
                  .then(function (locales_names) {
                    tables.locales_names_lists = {};
                    tables.locales_names_lists.fields = [
                      "id",
                      "table_name",
                      "table_id",
                      "table_attr",
                      "ru",
                      "en",
                      "ua",
                      "de",
                      "ro",
                      "it",
                      "pl",
                      "es",
                      "bg",
                    ];
                    sortValues(locales_names, function (values) {
                      tables.locales_names_lists.rows = values;
                      callback(null);
                    });
                  });
              },
              function (callback) {
                /** locales_names */
                models.locales_names
                  .findAll({
                    where: {
                      factory_id: factory_id,
                      table_name: "lamination_factory_colors",
                    },
                  })
                  .then(function (locales_names) {
                    tables.locales_names_lamination_factory_colors = {};
                    tables.locales_names_lamination_factory_colors.fields = [
                      "id",
                      "table_name",
                      "table_id",
                      "table_attr",
                      "ru",
                      "en",
                      "ua",
                      "de",
                      "ro",
                      "it",
                      "pl",
                      "es",
                      "bg",
                    ];
                    sortValues(locales_names, function (values) {
                      tables.locales_names_lamination_factory_colors.rows =
                        values;
                      callback(null);
                    });
                  });
              },
              function (callback) {
                /** locales_names */
                models.locales_names
                  .findAll({
                    where: {
                      factory_id: factory_id,
                      table_name: "addition_colors",
                    },
                  })
                  .then(function (locales_names) {
                    tables.locales_names_addition_colors = {};
                    tables.locales_names_addition_colors.fields = [
                      "id",
                      "table_name",
                      "table_id",
                      "table_attr",
                      "ru",
                      "en",
                      "ua",
                      "de",
                      "ro",
                      "it",
                      "pl",
                      "es",
                      "bg",
                    ];
                    sortValues(locales_names, function (values) {
                      tables.locales_names_addition_colors.rows =
                        values;
                      callback(null);
                    });
                  });
              },
              function (callback) {
                /** locales_names */
                models.locales_names
                  .findAll({
                    where: {
                      factory_id: factory_id,
                      table_name: "lamination_folders",
                    },
                  })
                  .then(function (locales_names) {
                    tables.locales_names_lamination_folders = {};
                    tables.locales_names_lamination_folders.fields = [
                      "id",
                      "table_name",
                      "table_id",
                      "table_attr",
                      "ru",
                      "en",
                      "ua",
                      "de",
                      "ro",
                      "it",
                      "pl",
                      "es",
                      "bg",
                    ];
                    sortValues(locales_names, function (values) {
                      tables.locales_names_lamination_folders.rows =
                        values;
                      callback(null);
                    });
                  });
              },
              function (callback) {
                /** locales_names */
                models.locales_names
                  .findAll({
                    where: {
                      factory_id: factory_id,
                      table_name: "window_hardware_folders",
                    },
                  })
                  .then(function (locales_names) {
                    tables.locales_names_window_hardware_folders = {};
                    tables.locales_names_window_hardware_folders.fields = [
                      "id",
                      "table_name",
                      "table_id",
                      "table_attr",
                      "ru",
                      "en",
                      "ua",
                      "de",
                      "ro",
                      "it",
                      "pl",
                      "es",
                      "bg",
                    ];
                    sortValues(locales_names, function (values) {
                      tables.locales_names_window_hardware_folders.rows =
                        values;
                      callback(null);
                    });
                  });
              },
              function (callback) {
                /** locales_names */
                models.locales_names
                  .findAll({
                    where: { factory_id: factory_id, table_name: "mosquitos" },
                  })
                  .then(function (locales_names) {
                    tables.locales_names_mosquitos = {};
                    tables.locales_names_mosquitos.fields = [
                      "id",
                      "table_name",
                      "table_id",
                      "table_attr",
                      "ru",
                      "en",
                      "ua",
                      "de",
                      "ro",
                      "it",
                      "pl",
                      "es",
                      "bg",
                    ];
                    sortValues(locales_names, function (values) {
                      tables.locales_names_mosquitos.rows = values;
                      callback(null);
                    });
                  });
              },
              function (callback) {
                /** locales_names */
                models.locales_names
                  .findAll({
                    where: {
                      factory_id: factory_id,
                      table_name: "mosquitos_singles",
                    },
                  })
                  .then(function (locales_names) {
                    tables.locales_names_mosquitos_singles = {};
                    tables.locales_names_mosquitos_singles.fields = [
                      "id",
                      "table_name",
                      "table_id",
                      "table_attr",
                      "ru",
                      "en",
                      "ua",
                      "de",
                      "ro",
                      "it",
                      "pl",
                      "es",
                      "bg",
                    ];
                    sortValues(locales_names, function (values) {
                      tables.locales_names_mosquitos_singles.rows = values;
                      callback(null);
                    });
                  });
              },
              function (callback) {
                /** locales_names */
                models.locales_names
                  .findAll({
                    where: {
                      factory_id: factory_id,
                      table_name: "window_hardware_groups",
                    },
                  })
                  .then(function (locales_names) {
                    tables.locales_names_window_hardware_groups = {};
                    tables.locales_names_window_hardware_groups.fields = [
                      "id",
                      "table_name",
                      "table_id",
                      "table_attr",
                      "ru",
                      "en",
                      "ua",
                      "de",
                      "ro",
                      "it",
                      "pl",
                      "es",
                      "bg",
                    ];
                    sortValues(locales_names, function (values) {
                      tables.locales_names_window_hardware_groups.rows = values;
                      callback(null);
                    });
                  });
              },
              function (callback) {
                /** locales_names */
                models.locales_names
                  .findAll({
                    where: {
                      factory_id: factory_id,
                      table_name: "profile_system_folders",
                    },
                  })
                  .then(function (locales_names) {
                    tables.locales_names_profile_system_folders = {};
                    tables.locales_names_profile_system_folders.fields = [
                      "id",
                      "table_name",
                      "table_id",
                      "table_attr",
                      "ru",
                      "en",
                      "ua",
                      "de",
                      "ro",
                      "it",
                      "pl",
                      "es",
                      "bg",
                    ];
                    sortValues(locales_names, function (values) {
                      tables.locales_names_profile_system_folders.rows = values;
                      callback(null);
                    });
                  });
              },
              function (callback) {
                /** locales_names */
                models.locales_names
                  .findAll({
                    where: {
                      factory_id: factory_id,
                      table_name: "categories_sets",
                    },
                  })
                  .then(function (locales_names) {
                    tables.locales_names_categories_sets = {};
                    tables.locales_names_categories_sets.fields = [
                      "id",
                      "table_name",
                      "table_id",
                      "table_attr",
                      "ru",
                      "en",
                      "ua",
                      "de",
                      "ro",
                      "it",
                      "pl",
                      "es",
                      "bg",
                    ];
                    sortValues(locales_names, function (values) {
                      tables.locales_names_categories_sets.rows = values;
                      callback(null);
                    });
                  });
              },
              function (callback) {
                /** locales_names */
                models.locales_names
                  .findAll({
                    where: {
                      factory_id: factory_id,
                      table_name: "sets",
                    },
                  })
                  .then(function (locales_names) {
                    tables.locales_names_sets = {};
                    tables.locales_names_sets.fields = [
                      "id",
                      "table_name",
                      "table_id",
                      "table_attr",
                      "ru",
                      "en",
                      "ua",
                      "de",
                      "ro",
                      "it",
                      "pl",
                      "es",
                      "bg",
                    ];
                    sortValues(locales_names, function (values) {
                      tables.locales_names_sets.rows = values;
                      callback(null);
                    });
                  });
              },
              function (callback) {
                /** doors_groups with doors laminations dependencies */
                models.doors_folders
                  .findAll({
                    where: { factory_id: factory_id },
                    attributes: ["id"],
                  })
                  .then(function (doorFolders) {
                    var foldersIds = doorFolders.map(function (folder) {
                      return folder.dataValues.id;
                    });
                    foldersIds.push(-1);

                    models.doors_groups
                      .findAll({
                        where: {
                          folder_id: {
                            $in: foldersIds,
                          },
                        },
                        attributes: [
                          "rama_sill_list_id",
                          "code_sync_white",
                          "shtulp_list_id",
                          "impost_list_id",
                          "impost_in_stvorka_list_id",
                          "stvorka_list_id",
                          "door_sill_list_id",
                          "rama_list_id",
                          "modified",
                          "name",
                          "folder_id",
                          "factory_id",
                          "id",
                        ],
                      })
                      .then(function (doors_groups) {
                        var doorGroupsIds = doors_groups.map(function (group) {
                          return group.dataValues.id;
                        });
                        doorGroupsIds.push(-1);

                        tables.doors_groups = {};
                        tables.doors_groups.fields = [
                          "rama_sill_list_id",
                          "code_sync_white",
                          "shtulp_list_id",
                          "impost_list_id",
                          "impost_in_stvorka_list_id",
                          "stvorka_list_id",
                          "door_sill_list_id",
                          "rama_list_id",
                          "modified",
                          "name",
                          "folder_id",
                          "factory_id",
                          "id",
                        ];
                        sortValues(doors_groups, function (values) {
                          tables.doors_groups.rows = values;

                          models.doors_laminations_dependencies
                            .findAll({
                              where: {
                                group_id: {
                                  $in: doorGroupsIds,
                                },
                              },
                              attributes: [
                                "rama_sill_list_id",
                                "modified",
                                "code_sync",
                                "shtulp_list_id",
                                "impost_list_id",
                                "impost_in_stvorka_list_id",
                                "stvorka_list_id",
                                "door_sill_list_id",
                                "rama_list_id",
                                "lamination_out",
                                "lamination_in",
                                "group_id",
                                "id",
                              ],
                            })
                            .then(function (doors_laminations_dependencies) {
                              tables.doors_laminations_dependencies = {};
                              tables.doors_laminations_dependencies.fields = [
                                "rama_sill_list_id",
                                "modified",
                                "code_sync",
                                "shtulp_list_id",
                                "impost_list_id",
                                "impost_in_stvorka_list_id",
                                "stvorka_list_id",
                                "door_sill_list_id",
                                "rama_list_id",
                                "lamination_out",
                                "lamination_in",
                                "group_id",
                                "id",
                              ];
                              sortValues(
                                doors_laminations_dependencies,
                                function (values) {
                                  tables.doors_laminations_dependencies.rows =
                                    values;

                                  /** doors_groups_dependencies */
                                  models.doors_groups_dependencies
                                    .findAll({
                                      where: {
                                        doors_group_id: doorGroupsIds,
                                      },
                                      attributes: [
                                        "modified",
                                        "doors_group_id",
                                        "hardware_group_id",
                                        "id",
                                      ],
                                    })
                                    .then(function (doors_groups_dependencies) {
                                      tables.doors_groups_dependencies = {};
                                      tables.doors_groups_dependencies.fields =
                                        [
                                          "modified",
                                          "doors_group_id",
                                          "hardware_group_id",
                                          "id",
                                        ];
                                      sortValues(
                                        doors_groups_dependencies,
                                        function (values) {
                                          tables.doors_groups_dependencies.rows =
                                            values;
                                          callback(null);
                                        }
                                      );
                                    });
                                }
                              );
                            });
                        });
                      });
                  });
              },
              function (callback) {
                /** elements */
                models.elements
                  .findAll({
                    where: { factory_id: factory_id },
                    attributes: [
                      "id",
                      "sku",
                      "name",
                      "element_group_id",
                      "currency_id",
                      "supplier_id",
                      "margin_id",
                      "waste",
                      "is_optimized",
                      "is_virtual",
                      "is_additional",
                      "weight_accounting_unit",
                      "glass_folder_id",
                      "min_width",
                      "min_height",
                      "max_width",
                      "max_height",
                      "max_sq",
                      "transcalency",
                      "glass_width",
                      "factory_id",
                      "price",
                      "amendment_pruning",
                      "modified",
                      "noise_coeff",
                      "heat_coeff",
                      "lamination_in_id",
                      "lamination_out_id",
                      "reg_coeff",
                    ],
                  })
                  .then(function (elements) {
                    tables.elements = {};
                    tables.elements.fields = [
                      "id",
                      "sku",
                      "name",
                      "element_group_id",
                      "currency_id",
                      "supplier_id",
                      "margin_id",
                      "waste",
                      "is_optimized",
                      "is_virtual",
                      "is_additional",
                      "weight_accounting_unit",
                      "glass_folder_id",
                      "min_width",
                      "min_height",
                      "max_width",
                      "max_height",
                      "max_sq",
                      "transcalency",
                      "glass_width",
                      "factory_id",
                      "price",
                      "amendment_pruning",
                      "modified",
                      "noise_coeff",
                      "heat_coeff",
                      "lamination_in_id",
                      "lamination_out_id",
                      "reg_coeff",
                    ];
                    sortValues(elements, function (values) {
                      tables.elements.rows = values;
                      callback(null);
                    });
                  });
              },
              function (callback) {
                /** elements_groups */
                models.elements_groups
                  .findAll()
                  .then(function (elements_groups) {
                    tables.elements_groups = {};
                    tables.elements_groups.fields = [
                      "modified",
                      "position",
                      "base_unit",
                      "name",
                      "id",
                    ];
                    sortValues(elements_groups, function (values) {
                      tables.elements_groups.rows = values;
                      callback(null);
                    });
                  });
              },
              function (callback) {
                /** compliance_lists_lamination_colors */
                models.compliance_lists_lamination_colors
                  .findAll()
                  .then(function (compliance_lists_lamination_colors) {
                    tables.compliance_lists_lamination_colors = {};
                    tables.compliance_lists_lamination_colors.fields = [
                      "id",
                      "lamination_factory_colors_id",
                      "lists_id",
                    ];
                    sortValues(compliance_lists_lamination_colors, function (values) {
                      tables.compliance_lists_lamination_colors.rows = values;
                      callback(null);
                    });
                  });
              },
              function (callback) {
                /** elements_profile_systems */
                models.sequelize
                  .query(
                    "SELECT PS.id, PS.profile_system_id, PS.element_id, PS.modified " +
                      "FROM elements_profile_systems PS " +
                      "JOIN elements E " +
                      "ON PS.element_id = E.id " +
                      "WHERE E.factory_id = " +
                      parseInt(factory_id) +
                      ""
                  )
                  .then(function (elements_profile_systems) {
                    tables.elements_profile_systems = {};
                    tables.elements_profile_systems.fields = [
                      "id",
                      "profile_system_id",
                      "element_id",
                      "modified",
                    ];
                    sortQueries(elements_profile_systems[0], function (values) {
                      tables.elements_profile_systems.rows = values;
                      callback(null);
                    });
                  });
              },
              function (callback) {
                /** window_hardware_profile_systems */
                models.sequelize
                  .query(
                    "SELECT PS.id, PS.profile_system_id, PS.window_hardware_group_id, PS.modified " +
                      "FROM window_hardware_profile_systems PS " +
                      "JOIN window_hardware_groups E " +
                      "ON PS.window_hardware_group_id = E.id " +
                      "JOIN window_hardware_folders F " +
                      "ON E.folder_id = F.id " +
                      "WHERE F.factory_id = " +
                      parseInt(factory_id) +
                      ""
                  )
                  .then(function (window_hardware_profile_systems) {
                    tables.window_hardware_profile_systems = {};
                    tables.window_hardware_profile_systems.fields = [
                      "id",
                      "profile_system_id",
                      "window_hardware_group_id",
                      "modified",
                    ];
                    sortQueries(
                      window_hardware_profile_systems[0],
                      function (values) {
                        tables.window_hardware_profile_systems.rows = values;
                        callback(null);
                      }
                    );
                  });
              },
              function (callback) {
                /** factories */
                models.factories
                  .find({
                    where: {
                      id: factory_id,
                    },
                    attributes: [
                      "id",
                      "name",
                      "modified",
                      "app_token",
                      "link",
                      "therm_coeff_id",
                      "max_construct_square",
                      "max_construct_size",
                    ],
                  })
                  .then(function (factory) {
                    tables.factories = {};
                    tables.factories.fields = [
                      "id",
                      "name",
                      "modified",
                      "app_token",
                      "link",
                      "therm_coeff_id",
                      "max_construct_square",
                      "max_construct_size",
                    ];
                    mapSingleton(
                      tables.factories.fields,
                      factory,
                      function (values) {
                        tables.factories.rows = values;
                        callback(null);
                      }
                    );
                  });
              },
              function (callback) {
                /** glass_folders */
                models.sequelize
                  .query(
                    `SELECT GF.id, GF.name, GF.position, GF.modified, GF.factory_id, GF.img, GF.description, GF.link, GF.is_base
                  FROM glass_folders AS GF
                  JOIN users AS U ON U.id = ${userId}
                  JOIN cities AS C ON C.id = U.city_id
                  JOIN regions AS R ON R.id = C.region_id
                  JOIN compliance_glass_folders AS CGF ON CGF.country_id = R.country_id
                  WHERE GF.factory_id = ${factory_id} AND GF.id = CGF.glass_folders_id`
                  )
                  .then(function (glass_folders) {
                    tables.glass_folders = {};
                    tables.glass_folders.fields = [
                      "id",
                      "name",
                      "position",
                      "modified",
                      "factory_id",
                      "img",
                      "description",
                      "link",
                      "is_base",
                    ];
                    sortQueries(glass_folders[0], function (values) {
                      tables.glass_folders.rows = values;
                      callback(null);
                    });
                  });
              },
              function (callback) {
                // lamination_factory_colors
                models.sequelize
                  .query(
                    `SELECT LFC.addition_colors_id, LFC.position, LFC.lamination_folders_id, LFC.factory_id, LFC.lamination_type_id, LFC.name, LFC.id
                  FROM lamination_factory_colors AS LFC
                  JOIN users AS U ON U.id = ${userId}
                  JOIN cities AS C ON C.id = U.city_id
                  JOIN regions AS R ON R.id = C.region_id
                  JOIN compliance_lamination_colors AS CLC ON CLC.country_id = R.country_id
                  WHERE (LFC.factory_id = ${factory_id} AND LFC.id = CLC.lamination_factory_colors_id) OR LFC.factory_id = 0
                  GROUP BY LFC.id`
                  )
                  .then(function (lamination_factory_colors) {
                    tables.lamination_factory_colors = {};
                    tables.lamination_factory_colors.fields = [
                      "addition_colors_id",
                      "position",
                      "lamination_folders_id",
                      "factory_id",
                      "lamination_type_id",
                      "name",
                      "id",
                    ];
                    sortQueries(
                      lamination_factory_colors[0],
                      function (values) {
                        tables.lamination_factory_colors.rows = values;
                        callback(null);
                      }
                    );
                  });
              },
              function (callback) {
                // lamination_folders
                models.sequelize.query(
                  `
                  SELECT lf.id, lf.name, lf.position
                  FROM lamination_folders AS lf
                  WHERE lf.factory_id = ${factory_id}`
                ).then(function (lamination_folders) {
                  tables.lamination_folders = {};
                  tables.lamination_folders.fields = ["id", "name", "position"];
                  sortQueries(lamination_folders[0], function (values) {
                    tables.lamination_folders.rows = values;
                    callback(null);
                  });
                });
              },
              function (callback) {
                // lamination_default_colors
                models.sequelize.query(
                  `
                  SELECT ldc.id, ldc.url
                  FROM lamination_default_colors AS ldc
                  `
                ).then(function (lamination_default_colors) {
                  tables.lamination_default_colors = {};
                  tables.lamination_default_colors.fields = ["id", "url"];
                  sortQueries(lamination_default_colors[0], function (values) {
                    tables.lamination_default_colors.rows = values;
                    callback(null);
                  });
                });
              },
              function (callback) {
                /** lamination_types */
                models.lamination_types
                  .findAll()
                  .then(function (lamination_types) {
                    tables.lamination_types = {};
                    tables.lamination_types.fields = ["modified", "name", "id"];
                    sortValues(lamination_types, function (values) {
                      tables.lamination_types.rows = values;
                      callback(null);
                    });
                  });
              },
              function (callback) {
                /** lists */
                models.sequelize
                  .query(
                    "SELECT L.id, L.name, L.list_group_id, L.list_type_id, L.a, L.b, L.c, L.d, L.e, L.parent_element_id, L.position, L.add_color_id, L.modified, L.addition_folder_id, L.amendment_pruning, L.waste, L.cameras, L.link, L.description, L.img, L.beed_lamination_id, L.in_door, L.doorstep_type, L.glass_type, L.glass_image, L.is_push, L.glass_color, L.size " +
                      "FROM lists L " +
                      "JOIN elements E " +
                      "ON L.parent_element_id = E.id " +
                      "WHERE E.factory_id = " +
                      factory_id +
                      ""
                  )
                  .then(function (lists) {
                    tables.lists = {};
                    tables.lists.fields = [
                      "id",
                      "name",
                      "list_group_id",
                      "list_type_id",
                      "a",
                      "b",
                      "c",
                      "d",
                      "e",
                      "parent_element_id",
                      "position",
                      "add_color_id",
                      "modified",
                      "addition_folder_id",
                      "amendment_pruning",
                      "waste",
                      "cameras",
                      "link",
                      "description",
                      "img",
                      "beed_lamination_id",
                      "in_door",
                      "doorstep_type",
                      "glass_type",
                      "glass_image",
                      "is_push",
                      "glass_color",
                      "size",
                    ];
                    sortQueries(lists[0], function (values) {
                      var listIds = [];
                      for (var i = 0, len = values.length; i < len; i++) {
                        //values[i].length = 15;
                        listIds.push(values[i][0]);
                      }
                      setTimeout(function () {
                        tables.lists.rows = values;
                        models.list_contents
                          .findAll({
                            where: { parent_list_id: { in: listIds } },
                            attributes: [
                              "rounding_value",
                              "rounding_type",
                              "modified",
                              "lamination_type_id",
                              "window_hardware_color_id",
                              "direction_id",
                              "rules_type_id",
                              "value",
                              "child_type",
                              "child_id",
                              "parent_list_id",
                              "id",
                            ],
                          })
                          .then(function (list_contents) {
                            tables.list_contents = {};
                            tables.list_contents.fields = [
                              "rounding_value",
                              "rounding_type",
                              "modified",
                              "lamination_type_id",
                              "window_hardware_color_id",
                              "direction_id",
                              "rules_type_id",
                              "value",
                              "child_type",
                              "child_id",
                              "parent_list_id",
                              "id",
                            ];
                            sortValues(list_contents, function (values) {
                              tables.list_contents.rows = values;
                              /** lock_lists */
                              models.lock_lists
                                .findAll({
                                  where: {
                                    list_id: {
                                      $in: listIds,
                                    },
                                  },
                                  attributes: [
                                    "modified",
                                    "group_id",
                                    "list_id",
                                    "id",
                                  ],
                                })
                                .then(function (lock_lists) {
                                  tables.lock_lists = {};
                                  tables.lock_lists.fields = [
                                    "modified",
                                    "accessory_id",
                                    "list_id",
                                    "id",
                                  ];
                                  sortValues(lock_lists, function (values) {
                                    tables.lock_lists.rows = values;
                                    callback(null);
                                  });
                                });
                            });
                          });
                      }, 300);
                    });
                  });
              },
              function (callback) {
                /** lists_groups */
                models.lists_groups.findAll().then(function (lists_groups) {
                  tables.lists_groups = {};
                  tables.lists_groups.fields = ["modified", "name", "id"];
                  sortValues(lists_groups, function (values) {
                    tables.lists_groups.rows = values;
                    callback(null);
                  });
                });
              },
              function (callback) {
                /** lists_types */
                models.lists_types.findAll().then(function (lists_types) {
                  tables.lists_types = {};
                  tables.lists_types.fields = [
                    "modified",
                    "image_add_param",
                    "name",
                    "id",
                  ];
                  sortValues(lists_types, function (values) {
                    tables.lists_types.rows = values;
                    callback(null);
                  });
                });
              },
              function (callback) {
                /** options_coefficients */
                models.options_coefficients
                  .findAll({
                    where: { factory_id: factory_id },
                  })
                  .then(function (options_coefficients) {
                    tables.options_coefficients = {};
                    tables.options_coefficients.fields = [
                      "piece_currencies",
                      "piece_price",
                      "perimeter_currencies",
                      "perimeter_price",
                      "area_currencies",
                      "area_price",
                      "coeff",
                      "margin",
                      "plan_production",
                      "id",
                      "factory_id",
                      "estimated_cost",
                      "salary_assembly_hrn",
                      "salary_assembly_hrn_m",
                      "salary_assembly_percent",
                      "salary_glass_hrn",
                      "salary_glass_hrn_m",
                      "salary_glass_percent",
                      "rent_production_hrn",
                      "rent_production_hrn_m",
                      "rent_production_percent",
                      "salary_itr_hrn",
                      "salary_itr_hrn_m",
                      "salary_itr_percent",
                      "rent_offices_hrn",
                      "rent_offices_hrn_m",
                      "rent_offices_percent",
                      "salary_manager_hrn",
                      "salary_manager_hrn_m",
                      "salary_manager_percent",
                      "transport_cost_hrn",
                      "transport_cost_hrn_m",
                      "transport_cost_percent",
                      "others_hrn",
                      "others_hrn_m",
                      "others_percent",
                      "rentability_hrn",
                      "rentability_hrn_m",
                      "rentability_percent",
                    ];
                    sortValues(options_coefficients, function (values) {
                      tables.options_coefficients.rows = values;
                      callback(null);
                    });
                  });
              },
              function (callback) {
                /** options_discounts */
                models.options_discounts
                  .findAll({
                    where: { factory_id: factory_id },
                  })
                  .then(function (options_discounts) {
                    tables.options_discounts = {};
                    tables.options_discounts.fields = [
                      "percents",
                      "week_8",
                      "week_7",
                      "week_6",
                      "week_5",
                      "week_4",
                      "week_3",
                      "week_2",
                      "week_1",
                      "base_time",
                      "standart_time",
                      "min_time",
                      "factory_id",
                      "id",
                    ];
                    sortValues(options_discounts, function (values) {
                      tables.options_discounts.rows = values;
                      callback(null);
                    });
                  });
              },
              function (callback) {
                /** profile_system_folders */
                models.profile_system_folders
                  .findAll({
                    where: { factory_id: factory_id },
                  })
                  .then(function (profile_system_folders) {
                    tables.profile_system_folders = {};
                    tables.profile_system_folders.fields = [
                      "img",
                      "description",
                      "link",
                      "modified",
                      "position",
                      "factory_id",
                      "name",
                      "id",
                    ];
                    sortValues(profile_system_folders, function (values) {
                      tables.profile_system_folders.rows = values;
                      callback(null);
                    });
                  });
              },
              function (callback) {
                /** profile_systems */
                models.sequelize
                  .query(
                    `SELECT S.id, S.name, S.short_name, S.folder_id, S.rama_list_id, S.rama_still_list_id, S.stvorka_list_id, S.impost_list_id, S.impost_in_stvorka_list_id, S.shtulp_list_id, S.is_editable, S.is_default, S.position, S.country, S.modified, S.cameras, S.heat_coeff, S.noise_coeff, S.heat_coeff_value, S.link, S.description, S.img, S.is_push
                    FROM profile_systems S
                    JOIN profile_system_folders F ON S.folder_id = F.id
                    JOIN users AS U ON U.id = ${userId}
                    JOIN cities AS C ON C.id = U.city_id
                    JOIN regions AS R ON R.id = C.region_id
                    JOIN compliance_profile_systems AS CPS ON CPS.country_id = R.country_id
                    WHERE F.factory_id = ${factory_id} AND S.is_editable = 1 AND S.id = CPS.profile_system_id`
                  )
                  .then(function (profile_systems) {
                    var profileSystemsIds = profile_systems[0].map(function (
                      profile
                    ) {
                      return profile.id;
                    });
                    profileSystemsIds.push(-1);
                    tables.profile_systems = {};
                    tables.profile_systems.fields = [
                      "id",
                      "name",
                      "short_name",
                      "folder_id",
                      "rama_list_id",
                      "rama_still_list_id",
                      "stvorka_list_id",
                      "impost_list_id",
                      "impost_in_stvorka_list_id",
                      "shtulp_list_id",
                      "is_editable",
                      "is_default",
                      "position",
                      "country",
                      "modified",
                      "cameras",
                      "heat_coeff",
                      "noise_coeff",
                      "heat_coeff_value",
                      "link",
                      "description",
                      "img",
                      "is_push",
                    ];
                    sortQueries(profile_systems[0], function (values) {
                      tables.profile_systems.rows = values;
                      /** profile_laminations */
                      models.profile_laminations
                        .findAll({
                          where: {
                            profile_id: {
                              $in: profileSystemsIds,
                            },
                          },
                          attributes: [
                            "id",
                            "profile_id",
                            "lamination_in_id",
                            "lamination_out_id",
                            "rama_list_id",
                            "rama_still_list_id",
                            "stvorka_list_id",
                            "impost_list_id",
                            "impost_in_stvorka_list_id",
                            "shtulp_list_id",
                            "code_sync",
                            "modified",
                          ],
                        })
                        .then(function (profile_laminations) {
                          tables.profile_laminations = {};
                          tables.profile_laminations.fields = [
                            "id",
                            "profile_id",
                            "lamination_in_id",
                            "lamination_out_id",
                            "rama_list_id",
                            "rama_still_list_id",
                            "stvorka_list_id",
                            "impost_list_id",
                            "impost_in_stvorka_list_id",
                            "shtulp_list_id",
                            "code_sync",
                            "modified",
                          ];
                          sortValues(profile_laminations, function (values2) {
                            tables.profile_laminations.rows = values2;
                            /** mosquitos */
                            models.mosquitos
                              .findAll({
                                where: {
                                  profile_id: {
                                    $in: profileSystemsIds,
                                  },
                                },
                              })
                              .then(function (mosquitos) {
                                tables.mosquitos = {};
                                tables.mosquitos.fields = [
                                  "group_id",
                                  "modified",
                                  "cloth_waste",
                                  "cloth_id",
                                  "right_waste",
                                  "right_id",
                                  "top_waste",
                                  "top_id",
                                  "left_waste",
                                  "left_id",
                                  "bottom_waste",
                                  "bottom_id",
                                  "name",
                                  "profile_id",
                                  "id",
                                ];
                                sortValues(mosquitos, function (values3) {
                                  tables.mosquitos.rows = values3;
                                  callback(null);
                                });
                              });
                          });
                        });
                    });
                  });
              },
              function (callback) {
                /** price_koefficients */
                models.sequelize
                  .query(
                    "SELECT PK.value, PK.koef_id, PK.element_id, PK.id " +
                      "FROM price_koefficients PK " +
                      "JOIN elements E " +
                      "ON PK.element_id = E.id " +
                      "WHERE E.factory_id = " +
                      parseInt(factory_id) +
                      ""
                  )
                  .then(function (price_koefficients) {
                    tables.price_koefficients = {};
                    tables.price_koefficients.fields = [
                      "value",
                      "koef_id",
                      "element_id",
                      "id",
                    ];
                    sortQueries(price_koefficients[0], function (values) {
                      tables.price_koefficients.rows = values;
                      callback(null);
                    });
                  });
              },
              function (callback) {
                /** mosquitos_singles */
                models.mosquitos_singles
                  .findAll({
                    where: {
                      factory_id: factory_id,
                    },
                  })
                  .then(function (mosquitos_singles) {
                    tables.mosquitos_singles = {};
                    tables.mosquitos_singles.fields = [
                      "group_id",
                      "modified",
                      "cloth_waste",
                      "cloth_id",
                      "right_waste",
                      "right_id",
                      "top_waste",
                      "top_id",
                      "left_waste",
                      "left_id",
                      "bottom_waste",
                      "bottom_id",
                      "name",
                      "factory_id",
                      "id",
                    ];
                    sortValues(mosquitos_singles, function (values) {
                      tables.mosquitos_singles.rows = values;
                      callback(null);
                    });
                  });
              },
              function (callback) {
                /** rules_types */
                models.rules_types.findAll().then(function (rules_types) {
                  tables.rules_types = {};
                  tables.rules_types.fields = [
                    "modified",
                    "suffix",
                    "child_unit",
                    "parent_unit",
                    "name",
                    "id",
                  ];
                  sortValues(rules_types, function (values) {
                    tables.rules_types.rows = values;
                    callback(null);
                  });
                });
              },
              function (callback) {
                /** templates */
                models.templates.findAll().then(function (templates) {
                  tables.templates = {};
                  tables.templates.fields = [
                    "template_object",
                    "icon",
                    "name",
                    "group_id",
                    "id",
                  ];
                  sortValues(templates, function (values) {
                    tables.templates.rows = values;
                    callback(null);
                  });
                });
              },
              function (callback) {
                /** template_groups */
                models.template_groups
                  .findAll()
                  .then(function (template_groups) {
                    tables.template_groups = {};
                    tables.template_groups.fields = ["name", "id"];
                    sortValues(template_groups, function (values) {
                      tables.template_groups.rows = values;
                      callback(null);
                    });
                  });
              },
              function (callback) {
                /** users_discounts */
                models.users_discounts
                  .findAll({
                    where: { user_id: userId },
                  })
                  .then(function (users_discounts) {
                    tables.users_discounts = {};
                    tables.users_discounts.fields = [
                      "week_8_add_elem",
                      "week_8_construct",
                      "week_7_add_elem",
                      "week_7_construct",
                      "week_6_add_elem",
                      "week_6_construct",
                      "week_5_add_elem",
                      "week_5_construct",
                      "week_4_add_elem",
                      "week_4_construct",
                      "week_3_add_elem",
                      "week_3_construct",
                      "week_2_add_elem",
                      "week_2_construct",
                      "week_1_add_elem",
                      "week_1_construct",
                      "default_add_elem",
                      "default_construct",
                      "max_add_elem",
                      "max_construct",
                      "user_id",
                      "id",
                    ];
                    sortValues(users_discounts, function (values) {
                      tables.users_discounts.rows = values;
                      callback(null);
                    });
                  });
              },
              function (callback) {
                /** users_markups */
                models.sequelize
                  .query(
                    "SELECT max_construct, max_add_elem " +
                      "FROM users_markups " +
                      "WHERE users_markups.user_id = " +
                      parseInt(userId) +
                      ""
                  )
                  .then(function (users_markups) {
                    tables.users_markups = {};
                    tables.users_markups.fields = [
                      "max_construct",
                      "max_add_elem",
                    ];
                    sortQueries(users_markups[0], function (values) {
                      tables.users_markups.rows = values;
                      callback(null);
                    });
                  });
              },
              function (callback) {
                /** users_mountings */
                models.deactivated_mountings
                  .findAll({
                    where: { user_id: userId },
                    attributes: ["mounting_id"],
                  })
                  .then(function (deactivatedMountings) {
                    var deactivatedMountingsIds = deactivatedMountings.map(
                      function (mounting) {
                        return mounting.mounting_id;
                      }
                    );
                    deactivatedMountingsIds.push(-1);
                    models.users_mountings
                      .findAll({
                        where: {
                          id: {
                            $notIn: deactivatedMountingsIds,
                          },
                          user_id: {
                            $in: [userId, factory_id],
                          },
                          active: 1,
                        },
                      })
                      .then(function (users_mountings) {
                        tables.users_mountings = {};
                        tables.users_mountings.fields = [
                          "price",
                          "type",
                          "name",
                          "active",
                          "user_id",
                          "id",
                        ];
                        sortValues(users_mountings, function (values) {
                          tables.users_mountings.rows = values;
                          callback(null);
                        });
                      });
                  });
              },
              function (callback) {
                /** users_deliveries */
                models.deactivated_deliveries
                  .findAll({
                    where: { user_id: userId },
                    attributes: ["delivery_id"],
                  })
                  .then(function (deactivatedDeliverise) {
                    var deactivatedDeliveriseIds = deactivatedDeliverise.map(
                      function (delivery) {
                        return delivery.delivery_id;
                      }
                    );
                    deactivatedDeliveriseIds.push(-1);
                    models.users_deliveries
                      .findAll({
                        where: {
                          id: { $notIn: deactivatedDeliveriseIds },
                          user_id: { $in: [userId, factory_id] },
                          active: 1,
                        },
                      })
                      .then(function (users_deliveries) {
                        tables.users_deliveries = {};
                        tables.users_deliveries.fields = [
                          "price",
                          "type",
                          "name",
                          "active",
                          "user_id",
                          "id",
                        ];
                        sortValues(users_deliveries, function (values) {
                          tables.users_deliveries.rows = values;
                          callback(null);
                        });
                      });
                  });
              },
              function (callback) {
                /** window_hardware_colors */
                models.window_hardware_colors
                  .findAll()
                  .then(function (window_hardware_colors) {
                    tables.window_hardware_colors = {};
                    tables.window_hardware_colors.fields = [
                      "modified",
                      "name",
                      "id",
                    ];
                    sortValues(window_hardware_colors, function (values) {
                      tables.window_hardware_colors.rows = values;
                      callback(null);
                    });
                  });
              },
              function (callback) {
                /** window_hardware_folders */
                models.window_hardware_folders
                  .findAll({
                    where: { factory_id: factory_id },
                  })
                  .then(function (window_hardware_folders) {
                    tables.window_hardware_folders = {};
                    tables.window_hardware_folders.fields = [
                      "modified",
                      "img",
                      "description",
                      "link",
                      "factory_id",
                      "name",
                      "id",
                    ];
                    sortValues(window_hardware_folders, function (values) {
                      tables.window_hardware_folders.rows = values;
                      callback(null);
                    });
                  });
              },
              function (callback) {
                /** window_hardware_groups */
                models.sequelize
                  .query(
                    `SELECT G.id, G.name, G.short_name, G.is_editable, G.folder_id, G.is_group, G.is_in_calculation, G.position, G.modified, G.link, G.description, G.img, G.producer, G.country, G.heat_coeff, G.noise_coeff, G.is_default, G.min_height, G.max_height, G.min_width, G.max_width, G.is_push
                    FROM window_hardware_groups G
                    JOIN window_hardware_folders F ON G.folder_id = F.id
                    JOIN users AS U ON U.id = ${userId}
                    JOIN cities AS C ON C.id = U.city_id
                    JOIN regions AS R ON R.id = C.region_id
                    JOIN compliance_window_hardware_groups AS CWHG ON CWHG.country_id = R.country_id
                    WHERE F.factory_id = ${factory_id} AND G.is_in_calculation = 1 AND G.id = CWHG.window_hardware_group_id`
                  )
                  .then(function (window_hardware_groups) {
                    tables.window_hardware_groups = {};
                    tables.window_hardware_groups.fields = [
                      "id",
                      "name",
                      "short_name",
                      "is_editable",
                      "folder_id",
                      "is_group",
                      "is_in_calculation",
                      "position",
                      "modified",
                      "link",
                      "description",
                      "img",
                      "producer",
                      "country",
                      "heat_coeff",
                      "noise_coeff",
                      "is_default",
                      "min_height",
                      "max_height",
                      "min_width",
                      "max_width",
                      "is_push",
                    ];
                    sortQueries(window_hardware_groups[0], function (values) {
                      tables.window_hardware_groups.rows = values;
                      callback(null);
                    });
                  });
              },
              function (callback) {
                /** window_hardware_handles */
                models.sequelize
                  .query(
                    "SELECT PK.constant_value, PK.location, PK.list_id, PK.id " +
                      "FROM window_hardware_handles PK " +
                      "JOIN lists L " +
                      "ON PK.list_id = L.id " +
                      "JOIN elements E " +
                      "ON L.parent_element_id = E.id " +
                      "WHERE E.factory_id = " +
                      parseInt(factory_id) +
                      ""
                  )
                  .then(function (window_hardware_handles) {
                    tables.window_hardware_handles = {};
                    tables.window_hardware_handles.fields = [
                      "constant_value",
                      "location",
                      "list_id",
                      "id",
                    ];
                    sortQueries(window_hardware_handles[0], function (values) {
                      tables.window_hardware_handles.rows = values;
                      callback(null);
                    });
                  });
              },
              function (callback) {
                /** window_hardware_types */
                models.window_hardware_types
                  .findAll()
                  .then(function (window_hardware_types) {
                    tables.window_hardware_types = {};
                    tables.window_hardware_types.fields = [
                      "modified",
                      "short_name",
                      "name",
                      "id",
                    ];
                    sortValues(window_hardware_types, function (values) {
                      tables.window_hardware_types.rows = values;
                      callback(null);
                    });
                  });
              },
              function (callback) {
                /** window_hardwares */
                models.window_hardwares
                  .findAll({
                    where: { factory_id: factory_id },
                  })
                  .then(function (window_hardwares) {
                    tables.window_hardwares = {};
                    tables.window_hardwares.fields = [
                      "id",
                      "window_hardware_type_id",
                      "min_width",
                      "max_width",
                      "min_height",
                      "max_height",
                      "direction_id",
                      "window_hardware_color_id",
                      "length",
                      "count",
                      "child_id",
                      "child_type",
                      "position",
                      "factory_id",
                      "window_hardware_group_id",
                      "modified",
                    ];
                    sortValues(window_hardwares, function (values) {
                      tables.window_hardwares.rows = values;
                      callback(null);
                    });
                  });
              },
              function (callback) {
                /** background_templates */
                models.background_templates
                  .findAll({
                    where: { factory_id: factory_id },
                  })
                  .then(function (background_templates) {
                    tables.background_templates = {};
                    tables.background_templates.fields = [
                      "factory_id",
                      "modified",
                      "desc_2",
                      "desc_1",
                      "template_id",
                      "group_id",
                      "position",
                      "img",
                      "id",
                    ];
                    sortValues(background_templates, function (values) {
                      tables.background_templates.rows = values;
                      callback(null);
                    });
                  });
              },
              function (callback) {
                /** window_hardware_type_ranges */
                models.window_hardware_type_ranges
                  .findAll({
                    where: {
                      factory_id: factory_id,
                    },
                  })
                  .then(function (window_hardware_type_ranges) {
                    tables.window_hardware_type_ranges = {};
                    tables.window_hardware_type_ranges.fields = [
                      "group_id",
                      "modified",
                      "min_height",
                      "max_height",
                      "min_width",
                      "max_width",
                      "type_id",
                      "factory_id",
                      "id",
                    ];
                    sortValues(window_hardware_type_ranges, function (values) {
                      tables.window_hardware_type_ranges.rows = values;
                      callback(null);
                    });
                  });
              },
              function (callback) {
                /** doors_hardware_groups */
                models.doors_hardware_groups
                  .findAll({
                    where: {
                      factory_id: factory_id,
                    },
                    attributes: [
                      "is_push",
                      "width_min",
                      "width_max",
                      "height_min",
                      "height_max",
                      "type",
                      "modified",
                      "burglar_coeff",
                      "anticorrosion_coeff",
                      "image",
                      "description",
                      "link",
                      "country",
                      "producer",
                      "name",
                      "hardware_type_id",
                      "factory_id",
                      "id",
                    ],
                  })
                  .then(function (doors_hardware_groups) {
                    var doorsHardwareGroupsIds = doors_hardware_groups.map(
                      function (group) {
                        return group.dataValues.id;
                      }
                    );
                    doorsHardwareGroupsIds.push(-1);
                    tables.doors_hardware_groups = {};
                    tables.doors_hardware_groups.fields = [
                      "is_push",
                      "width_min",
                      "width_max",
                      "height_min",
                      "height_max",
                      "type",
                      "modified",
                      "burglar_coeff",
                      "anticorrosion_coeff",
                      "image",
                      "description",
                      "link",
                      "country",
                      "producer",
                      "name",
                      "hardware_type_id",
                      "factory_id",
                      "id",
                    ];
                    sortValues(doors_hardware_groups, function (values) {
                      tables.doors_hardware_groups.rows = values;
                      /** doors_hardware_items */
                      models.doors_hardware_items
                        .findAll({
                          where: {
                            hardware_group_id: {
                              $in: doorsHardwareGroupsIds,
                            },
                          },
                        })
                        .then(function (doors_hardware_items) {
                          tables.doors_hardware_items = {};
                          tables.doors_hardware_items.fields = [
                            "id",
                            "hardware_group_id",
                            "min_width",
                            "max_width",
                            "min_height",
                            "max_height",
                            "direction_id",
                            "hardware_color_id",
                            "length",
                            "count",
                            "child_id",
                            "position",
                            "modified",
                            "child_type",
                          ];
                          sortValues(doors_hardware_items, function (values) {
                            tables.doors_hardware_items.rows = values;
                            callback(null);
                          });
                        });
                    });
                  });
              },
              function (callback) {
                /** categories_sets */
                models.categories_sets
                  .findAll()
                  .then(function (categories_sets) {
                    tables.categories_sets = {};
                    tables.categories_sets.fields = ["id", "name", "position"];
                    sortValues(categories_sets, function (values) {
                      tables.categories_sets.rows = values;
                      callback(null);
                    });
                  });
              },
              function (callback) {
                /** sets */
                models.sets.findAll().then(function (sets) {
                  tables.sets = {};
                  tables.sets.fields = [
                    "id",
                    "categories_sets_id",
                    "name",
                    "is_visible",
                    "img",
                    "description",
                    "position",
                  ];
                  sortValues(sets, function (values) {
                    tables.sets.rows = values;
                    callback(null);
                  });
                });
              },
              function (callback) {
                /** set_data */
                models.set_data.findAll().then(function (set_data) {
                  tables.set_data = {};
                  tables.set_data.fields = [
                    "id",
                    "sets_id",
                    "profile_systems_id",
                    "window_hardware_groups_id",
                    "list_id",
                  ];
                  sortValues(set_data, function (values) {
                    tables.set_data.rows = values;
                    callback(null);
                  });
                });
              },
            ],
            function (err, results) {
              if (err) {
                console.log(err);
                res.send({
                  status: false,
                  error: "Failed to Import database.",
                });
              } else {
                res.send({ status: true, tables: tables, last_sync: lastSync });
              }
            }
          );
        });
    });
};

function sortValues(result, __callback) {
  var values = [];

  if (result.length) {
    for (var i = 0, len = result.length; i < len; i++) {
      if (result[i].dataValues) {
        const _val = Object.keys(result[i].dataValues).map(function (key) {
          return result[i][key];
        });

        values.push(_val);
      } else {
        continue;
      }
      if (i === len - 1) {
        __callback(values);
      }
    }
  } else {
    __callback(values);
  }
}

/**
 * Почему тут не for ( p in o):
 * Currently all major browsers loop over the properties
   of an object in the order in which they were defined.
   Chrome does this as well, except for a couple cases. [...]
   This behavior is explicitly left undefined by the ECMAScript
   specification. In ECMA-262, section 12.6.4: However,
   specification is quite different from implementation.
   All modern implementations of ECMAScript iterate through
   object properties in the order in which they were defined.
   Because of this the Chrome team has deemed this to be a bug
   and will be fixing it.
 */
function mapSingleton(fields, result, __callback) {
  var singleton = [];

  for (var i = 0, len = fields.length; i < len; i++) {
    singleton.push(result.dataValues[fields[i]]);
  }

  __callback([singleton]);
}

function sortQueries(result, __callback) {
  var values = [];

  if (result.length) {
    for (var i = 0, len = result.length; i < len; i++) {
      var _val = Object.keys(result[i]).map(function (key) {
        return result[i][key];
      });
      values.push(_val);
      if (i === len - 1) {
        __callback(values);
      }
    }
  } else {
    __callback(values);
  }
}
