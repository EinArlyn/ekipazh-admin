var router = require("express").Router();
var api = require("../controllers/api");

router.get("/info", api.info);
router.post("/login", api.login);
router.get("/signed", api.signed);
router.get("/sync", api.sync);
router.get("/syncT", api.syncT);
router.post("/update", api.update);
router.post("/insert", api.insert);
router.get("/orders", api.getOrders);
router.get("/get/locations", api.getLocations);
router.get("/get/factories-by-country", api.getFactoriesByCountry);
router.post("/register", api.register);
router.post("/load-avatar", api.loadAvatar);
router.get("/sendmail", api.sendmail);
router.post("/remove-order", api.removeOrder);
router.post("/remove", api.remove);
router.post("/remove-order-properties", api.removeOrderProperties);
router.get("/export", api.getExport);
router.get("/top", api.top);
router.post("/auth/external-callback", api.externalCallback);
router.post("/auth/create-auth-token", api.createAuthToken);
router.post("/auth/one-time-login", api.oneTimeLogin);

module.exports = router;
