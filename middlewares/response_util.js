// response util method middleware

function sendData (json) {
  this.send({
    data: json
  });
}

function sendSuccessMsg () {
  this.send({msg:'success'});
}

function sendErrMsg (err) {
  this.send({err_msg:err});
}

module.exports = function (req, res, next) {

  res.sendData = sendData;
  res.sendSuccessMsg = sendSuccessMsg;
  res.sendErrMsg = sendErrMsg;

  next();
};
