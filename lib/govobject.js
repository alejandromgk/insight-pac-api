'use strict';

var Common = require('./common');

function GovObjectController(node) {
  this.node = node;
  this.common = new Common({log: this.node.log});
}

GovObjectController.prototype.list = function(req, res) {
  var options = {};
  if (req.params.filter) {
      if (req.params.filter == 'proposal') options.type = 1;
      if (req.params.filter == 'trigger') options.type = 2;
  }

  this.govObjectList(options, function(err, result) {
    if (err) {
      return self.common.handleErrors(err, res);
    }

    res.jsonp(result);
  });

};

GovObjectController.prototype.govObjectList = function(options, callback) {
    this.node.services.bitcoind.govObjectList(options, function(err, result) {
        if (err) {
            return callback(err);
        }
        callback(null, result);
    });

};


GovObjectController.prototype.show = function(req, res) {
    var self = this;
    var options = {};

    this.getHash(req.hash, function(err, data) {
        if(err) {
            return self.common.handleErrors(err, res);
        }

        res.jsonp(data);
    });

};

GovObjectController.prototype.getHash = function(hash, callback) {

    this.node.services.bitcoind.govObjectHash(hash, function(err, result) {
        if (err) {
            return callback(err);
        }

        callback(null, result);
    });

};

/**
 * Verifies that the GovObject Hash provided is valid.
 *
 * @param req
 * @param res
 * @param next
 */
GovObjectController.prototype.validateHash = function(req, res, next) {
    req.hash = req.params.hash;
    this.isValidHash(req, res, next, [req.hash]);
};

GovObjectController.prototype.isValidHash = function(req, res, next, hash) {
    // TODO: Implement some type of validation
    if(hash) next();
};


GovObjectController.prototype.govObjectCheck = function(req, res) {
  var self = this;
  var hexdata = req.params.hexdata;

  this.node.services.bitcoind.govObjectCheck(hexdata, function(err, result) {
    if (err) {
      return self.common.handleErrors(err, res);
    }
    res.jsonp(result);
  });
};

GovObjectController.prototype.submitProposal = function(req, res) {
  var self = this;
  var parentHash = req.body.parentHash || req.params.parentHash || req.query.parentHash;
  var revision = req.body.revision || req.params.revision || req.query.revision;
  var time = req.body.time || req.params.time || req.params.time;
  var dataHex = req.body.dataHex || req.params.dataHex || req.query.dataHex;
  var collateral = req.body.collateral || req.params.collateral || req.query.collateral;

  if (!parentHash || !revision || !time || !dataHex || !collateral){
    var err = {code: 400, message: 'Invalid parameters. Must be called with the following parameters either in the body, query or params object: [parentHash, revision, time, dataHex, collateral].'};
    return self.common.handleErrors(err, res);
  }

  this.govObjectSubmit(parentHash, revision, time, dataHex, collateral, function(err, data) {
      if(err) {
          return self.common.handleErrors(err, res);
      }
      res.jsonp(data);
  });
};

GovObjectController.prototype.govObjectSubmit = function(parentHash, revision, time, dataHex, collateral, callback) {
  this.node.services.bitcoind.govObjectSubmit(parentHash, revision, time, dataHex, collateral, function(err, result) {
      if (err) {
          return callback(err);
      }
      callback(null, result);
  });
};

module.exports = GovObjectController;
