"use strict";

var _require = require('../services/gemini.service'),
    recognizeLicensePlate = _require.recognizeLicensePlate;

var recognizePlate = function recognizePlate(req, res) {
  var result, statusCode;
  return regeneratorRuntime.async(function recognizePlate$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(recognizeLicensePlate({
            imageBase64: req.body.image_base64,
            mimeType: req.body.mime_type
          }));

        case 3:
          result = _context.sent;
          return _context.abrupt("return", res.status(200).json({
            message: 'Placa reconocida correctamente.',
            data: result
          }));

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          statusCode = _context.t0.statusCode || 502;
          return _context.abrupt("return", res.status(statusCode).json({
            message: _context.t0.message || 'No fue posible analizar la imagen.'
          }));

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

module.exports = {
  recognizePlate: recognizePlate
};
//# sourceMappingURL=plate-recognition.dev.js.map
