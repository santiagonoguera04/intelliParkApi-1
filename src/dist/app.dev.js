"use strict";

var express = require('express');

var cors = require('cors');

var swaggerUi = require('swagger-ui-express');

var swaggerSpec = require('./config/swagger');

var _require = require('./middlewares/error.middleware'),
    notFoundHandler = _require.notFoundHandler,
    errorHandler = _require.errorHandler;

var _require2 = require('./config/database'),
    pool = _require2.pool;

var authRoutes = require('./routes/auth.routes');

var usersRoutes = require('./routes/users.routes');

var vehiclesRoutes = require('./routes/vehicles.routes');

var parkingRoutes = require('./routes/parking.routes');

var paymentsRoutes = require('./routes/payments.routes');

var reportsRoutes = require('./routes/reports.routes');

var app = express();
app.disable("x-powered-by");
app.use(cors()); //la ortografia viaja temporalmente como Base64.
//El limite evita aceptar cuerpos demasiados grandes.

app.use(express.json({
  limit: '8mb'
}));
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api/docs.json', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});
app.get('/api/health', function _callee(req, res) {
  var databaseResult;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(pool.query('SELECT NOW()'));

        case 3:
          databaseResult = _context.sent;
          res.status(200).json({
            status: 'ok',
            message: 'IntelliPark API está en funcionamiento.',
            database: {
              connected: true,
              time: databaseResult.rows[0].now
            }
          });
          _context.next = 10;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          res.status(500).json({
            status: 'error',
            message: 'IntelliPark API está en funcionamiento, pero la conexión a la base de datos falló.',
            database: {
              connected: false,
              error: _context.t0.message
            }
          });

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
});
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/vehicles', vehiclesRoutes);
app.use('/api/parking', parkingRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/reports', reportsRoutes);
app.use(notFoundHandler);
app.use(errorHandler);
module.exports = app;
//# sourceMappingURL=app.dev.js.map
