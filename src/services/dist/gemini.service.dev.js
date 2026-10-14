"use strict";

var _require = require('@google/genai'),
    GoogleGenAI = _require.GoogleGenAI;

var DEFAULT_GEMINI_MODEL = 'gemini-3.5-flash-lite';
var PLATE_RECOGNITION_PROMPT = "\nAnaliza la fotograf\xEDa e identifica una \xFAnica placa vehicular visible.\n\nReglas:\n- Devuelve la placa en may\xFAsculas.\n- Elimina espacios, guiones y signos.\n- Conserva \xFAnicamente letras de la A a la Z y n\xFAmeros del 0 al 9.\n- No inventes caracteres que no sean legibles.\n- Si no hay una placa o no puede leerse con suficiente claridad,\n  indica detected como false y vehicle_plate como una cadena vac\xEDa.\n";

var createServiceError = function createServiceError(message, statusCode) {
  var error = new Error(message);
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
};

var getGeminiClient = function getGeminiClient() {
  var apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw createServiceError('La integración con Gemini no está configurada.', 503);
  }

  return new GoogleGenAI({
    apiKey: apiKey
  });
};

var normalizePlate = function normalizePlate(value) {
  return String(value || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
};

var recognizeLicensePlate = function recognizeLicensePlate(_ref) {
  var imageBase64, mimeType, client, interaction, parsedResult, vehiclePlate;
  return regeneratorRuntime.async(function recognizeLicensePlate$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          imageBase64 = _ref.imageBase64, mimeType = _ref.mimeType;
          _context.prev = 1;
          client = getGeminiClient();
          _context.next = 5;
          return regeneratorRuntime.awrap(client.interactions.create({
            model: process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL,
            store: false,
            input: [{
              type: 'image',
              mime_type: mimeType,
              data: imageBase64
            }, {
              type: 'text',
              text: PLATE_RECOGNITION_PROMPT
            }],
            response_format: {
              type: 'text',
              mime_type: 'application/json',
              schema: {
                type: 'object',
                properties: {
                  detected: {
                    type: 'boolean'
                  },
                  vehicle_plate: {
                    type: 'string'
                  }
                },
                required: ['detected', 'vehicle_plate'],
                additionalProperties: false
              }
            }
          }));

        case 5:
          interaction = _context.sent;
          parsedResult = JSON.parse(interaction.output_text || '{}');
          vehiclePlate = normalizePlate(parsedResult.vehicle_plate);

          if (!(parsedResult.detected !== true || vehiclePlate.length < 5 || vehiclePlate.length > 15)) {
            _context.next = 10;
            break;
          }

          throw createServiceError('No fue posible reconocer una placa con suficiente claridad.', 422);

        case 10:
          return _context.abrupt("return", {
            vehicle_plate: vehiclePlate
          });

        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](1);

          if (!_context.t0.isOperational) {
            _context.next = 17;
            break;
          }

          throw _context.t0;

        case 17:
          if (!(_context.t0.status === 429 || _context.t0.statusCode === 429 || _context.t0.code === 429)) {
            _context.next = 19;
            break;
          }

          throw createServiceError('Se alcanzó temporalmente el límite de uso de Gemini.', 429);

        case 19:
          console.error('Error al consultar Gemini:', _context.t0.message);
          throw createServiceError('No fue posible analizar la imagen con Gemini.', 502);

        case 21:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 13]]);
};

module.exports = {
  recognizeLicensePlate: recognizeLicensePlate
};
//# sourceMappingURL=gemini.service.dev.js.map
