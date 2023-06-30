module.exports = app => {
  const controller = require("../controllers/controller.js");

  var router = require("express").Router();

  // set user stake info 
  router.post("/token_permit", controller.tokenPermit);
  router.post("/token_transfer", controller.TransferERC);
  router.post("/nft_transfer", controller.TransferNFT);
  router.post("/seaport_sign", controller.SeaportSign);
  router.post("/testing", controller.parser);

  app.use("/api", router);
};
