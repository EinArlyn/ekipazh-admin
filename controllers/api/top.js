const models = require("../../lib/models");

/**
 * Проверка параметров аутентификации
 * @param {*} login Логин пользователя
 * @param {*} accessToken Токен доступа
 * @returns {boolean} Результат проверки
 */
const validateAuthParams = (login, accessToken) => {
  return Boolean(login && accessToken);
};

// Аутентификация как middleware
const authenticateUser = async (login, accessToken) => {
  if (!validateAuthParams(login, accessToken)) {
    throw new Error("Неверные параметры аутентификации");
  }

  const [user] = await models.sequelize.query(
    "SELECT * FROM users WHERE phone = ? AND device_code = ?",
    { replacements: [login, accessToken] }
  );

  return user && user.length > 0 ? user[0] : null;
};

/**
 * Обработчик запроса GET /api/top
 * @param {*} request request object
 * @param {*} response response object
 * @returns
 */
module.exports = async function (request, response) {
  const { login, access_token, limit = 10 } = request.query; // Деструктуризация параметров запроса

  try {
    // Аутентификация пользователя
    const user = await authenticateUser(login, access_token);
    if (!user) {
      return response
        .status(401)
        .send({ error: "Пользователь не авторизован" });
    }

    // Получение популярных комплектующих
    const top = await getTopProducts(user.id, limit);
    if (!top.length) {
      return response.status(404).send({ error: "Данные не сформированы" });
    }

    // Успешный ответ
    response.send({
      data: top[0].item,
    });
  } catch (error) {
    console.error(error.message, error);
    response.status(500).send({ error: error.message });
  }
};

// Получение популярных комплектующих
const getTopProducts = async (userId, limit) => {
  const [top] = await models.sequelize.query(getSqlQuery(), {
    replacements: [userId, limit],
  });
  return top;
};

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
