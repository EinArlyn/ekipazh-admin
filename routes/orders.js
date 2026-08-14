var router = require('express').Router();
var orderController = require('../controllers/orders');
var isAuthenticated = require('../lib/services/authentication').isAdminAuth;
var isAllowedUser = require('../lib/services/homefash').isAllowedUser;

/**
 * Отправка в Homefash доступна не всем: кнопку видит только разрешённый
 * дилер, но прятать её в интерфейсе мало — маршрут проверяет сам.
 */
function canSendToHomefash(req, res, next) {
  if (isAllowedUser(req.session && req.session.user)) {
    return next();
  }

  res.status(403).send({
    status: false,
    code: 'forbidden',
    error: res.__('Sending to Homefash is not available for this account'),
  });
}

router.get('/', isAuthenticated, orderController.index);
router.get('/:page', isAuthenticated, orderController.index);
router.get('/getOrder/:id', isAuthenticated, orderController.getOrder);
router.get('/get-order-pdf/:id', orderController.getOrderPDF);
router.get('/get-order-pdf-ua/:id', orderController.getOrderPDFua);
router.get('/get-order-pdf-okoshko/:id', orderController.getOrderPDFokoshko);
router.get('/get-invoice-pdf-okoshko/:id', orderController.getInvoicePDFokoshko);
router.get('/get-order-report/:id', orderController.getOrderReport);
router.post('/deleteOrder/', isAuthenticated, orderController.deleteOrder);
router.post('/changeOrderState/', isAuthenticated, orderController.changeOrderState);
router.get('/getScheme/:id', orderController.getScheme);
router.get('/get-amount-of-orders/:id', isAuthenticated, orderController.getAmountOfOrders);
router.post('/change-factory-number/:id', isAuthenticated, orderController.changeFactoryNumber);
router.post('/send-to-homefash/:id', isAuthenticated, canSendToHomefash, orderController.sendToHomefash);

module.exports = router;
