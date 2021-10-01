var express = require('express');
var router = express.Router();
const mouvementController=require('../controllers/mouvement.controller');
const {guard}=require('../middlewares/guard');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get("/depot",guard,mouvementController.depot);

router.post("/depot",guard,mouvementController.postDepot);

router.get("/retrait",guard,mouvementController.retrait);

router.post("/retrait",guard,mouvementController.postRetrait);





module.exports = router;
