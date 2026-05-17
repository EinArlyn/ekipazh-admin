'use strict';

module.exports = {
  // БД — для Sequelize
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  dialect: 'postgres',
  omitNull: true,

  // Почта
  transporterMail: process.env.MAILER_USER,
  transporterPassword: process.env.MAILER_PASSWORD,
  transporterHost: process.env.MAILER_HOST,
  transporterSSL: process.env.MAILER_SSL === 'true',
  mailFrom: process.env.MAIL_FROM,

  // Ссылки
  activationURL: process.env.ACTIVATION_URL,
  specLink: process.env.SPEC_LINK,
  calculatorLink: process.env.CALCULATOR_LINK,
  orderExportLink: process.env.ORDER_EXPORT_LINK,
  exportOrderHZLink: process.env.EXPORT_ORDER_HZ_LINK,
  analitycsUrl: process.env.ANALYTICS_URL,
  proUrl: process.env.PRO_URL,
  documentsUrl: process.env.DOCUMENTS_URL,
  statisticLink: process.env.STATISTIC_LINK || '',
};
