const models = require("../../lib/models");

/**
 * Обработчик запроса GET /api/top
 * @param {*} request request object
 * @param {*} response response object
 * @returns
 */
module.exports = function (request, response) {
  var login = request.query.login;
  var access_token = request.query.access_token;
  var limit = request.query.limit || 10;

  // Аутентификация пользователя
  authenticateUser(login, access_token)
    .then(function (user) {
      if (!user) {
        return response
          .status(401)
          .send({ error: "Пользователь не авторизован" });
      }

      // Получение популярных комплектующих
      return getTopProducts(user.id, limit).then(function (top) {
        if (!top.length) {
          return response.status(404).send({ error: "Данные не сформированы" });
        }

        // Успешный ответ
        response.send({
          data: top[0].item,
        });
      });
    })
    .catch(function (error) {
      console.error("Ошибка обработки запроса: " + error.message, error);
      response.status(500).send({ error: error.message });
    });
};

/**
 * Проверка параметров аутентификации
 * @param {*} login Логин пользователя
 * @param {*} accessToken Токен доступа
 * @returns {boolean} Результат проверки
 */
function validateAuthParams(login, accessToken) {
  return Boolean(login && accessToken);
}

/**
 * Аутентификация пользователя
 * @param {string} login
 * @param {string} accessToken
 * @returns {Promise<Object|null>}
 */
function authenticateUser(login, accessToken) {
  return new Promise(function (resolve, reject) {
    if (!validateAuthParams(login, accessToken)) {
      return reject(new Error("Неверные параметры аутентификации"));
    }

    models.sequelize
      .query("SELECT * FROM users WHERE phone = ? AND device_code = ?", {
        replacements: [login, accessToken],
      })
      .then(function (result) {
        var user = result[0];
        if (user && user.length > 0) {
          resolve(user[0]);
        } else {
          resolve(null);
        }
      })
      .catch(function (error) {
        reject(error);
      });
  });
}

/**
 * Получение популярных комплектующих
 * @param {number} userId
 * @param {number} limit
 * @returns {Promise<Array>}
 */
function getTopProducts(userId, limit) {
  return new Promise(function (resolve, reject) {
    models.sequelize
      .query(getSqlQuery(), {
        replacements: [userId, limit],
      })
      .then(function (result) {
        resolve(result[0]);
      })
      .catch(function (error) {
        reject(error);
      });
  });
}

function getSqlQuery() {
  return `
        WITH order_products_filtered AS (
            -- Получение всех комплектующих из заказов пользователя
            SELECT
                op.hardware_id
            FROM order_products AS op
            JOIN orders AS o ON o.id = op.order_id
            WHERE o.user_id = ?
        ),
        hardware AS (
            -- Подсчёт количества заказов комплектующего и сортировка по убыванию
            SELECT
                hardware_id,
                COUNT(*) AS hardware_count
            FROM order_products_filtered
            GROUP BY hardware_id
            ORDER BY hardware_count DESC
            LIMIT ?
        )
        SELECT row_to_json(top) AS item
        FROM (
            SELECT
                (SELECT ARRAY_AGG(hardware_id) FROM hardware) AS "hardware_ids"
        ) AS top;
    `;
}
