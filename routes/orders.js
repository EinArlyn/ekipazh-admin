var router = require('express').Router();
var orderController = require('../controllers/orders');
var isAuthenticated = require('../lib/services/authentication').isAdminAuth;

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

module.exports = router;
