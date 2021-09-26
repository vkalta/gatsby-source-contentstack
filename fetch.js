"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var queryString = require('query-string');

var fetch = require('node-fetch');

var _require = require('./package.json'),
    version = _require.version;

var _require2 = require('./utils'),
    CODES = _require2.CODES;

exports.fetchData = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(configOptions, reporter) {
    var syncData, syncEntryParams, syncAssetParams, _yield$Promise$all, _yield$Promise$all2, syncEntryData, syncAssetData, data, syncParams, contentstackData;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.time('Fetch Contentstack data');
            console.log('Starting to fetch data from Contentstack');
            syncData = {}; // console.log('configOptions', configOptions);

            if (!configOptions.expediteBuild) {
              _context.next = 29;
              break;
            }

            console.log('configOptions.syncToken--->', configOptions.syncToken);
            syncEntryParams = configOptions.syncToken ? {
              sync_token: configOptions.syncToken
            } : {
              init: true
            };
            syncAssetParams = configOptions.syncToken ? {
              sync_token: configOptions.syncToken
            } : {
              init: true
            };
            syncEntryParams.type = 'entry_published, entry_unpublished, entry_deleted';
            syncAssetParams.type = 'asset_published, asset_unpublished, asset_deleted';
            _context.prev = 9;
            _context.next = 12;
            return Promise.all([fetchSyncData(syncEntryParams, configOptions), fetchSyncData(syncAssetParams, configOptions)]);

          case 12:
            _yield$Promise$all = _context.sent;
            _yield$Promise$all2 = (0, _slicedToArray2["default"])(_yield$Promise$all, 2);
            syncEntryData = _yield$Promise$all2[0];
            syncAssetData = _yield$Promise$all2[1];
            console.log('stringified entries', JSON.stringify(syncEntryData));
            data = syncEntryData.data.concat(syncAssetData.data);
            console.log('syncEntryData.sync_token[api]', syncEntryData.sync_token);
            syncData.data = data;
            syncData.token = null;
            syncData.sync_token = syncEntryData.sync_token;
            _context.next = 27;
            break;

          case 24:
            _context.prev = 24;
            _context.t0 = _context["catch"](9);
            reporter.panic({
              id: CODES.SyncError,
              context: {
                sourceMessage: "Fetching contentstack data failed [expediteBuild]. Please check https://www.contentstack.com/docs/developers/apis/content-delivery-api/ for more help."
              },
              error: _context.t0
            });

          case 27:
            _context.next = 40;
            break;

          case 29:
            syncParams = configOptions.syncToken ? {
              sync_token: configOptions.syncToken
            } : {
              init: true
            };
            console.log('syncParams', syncParams);
            _context.prev = 31;
            _context.next = 34;
            return fetchSyncData(syncParams, configOptions);

          case 34:
            syncData = _context.sent;
            _context.next = 40;
            break;

          case 37:
            _context.prev = 37;
            _context.t1 = _context["catch"](31);
            reporter.panic({
              id: CODES.SyncError,
              context: {
                sourceMessage: "Fetching contentstack data failed. Please check https://www.contentstack.com/docs/developers/apis/content-delivery-api/ for more help."
              },
              error: _context.t1
            });

          case 40:
            console.log('json', JSON.stringify(syncData));
            contentstackData = {
              syncData: syncData.data,
              sync_token: syncData.sync_token
            };
            console.timeEnd('Fetch Contentstack data');
            return _context.abrupt("return", {
              contentstackData: contentstackData
            });

          case 44:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[9, 24], [31, 37]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.fetchContentTypes = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(config) {
    var url, responseKey, query, allContentTypes;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            config.cdn = config.cdn ? config.cdn : 'https://cdn.contentstack.io/v3';
            url = 'content_types';
            responseKey = 'content_types';
            query = {
              include_global_field_schema: true
            };
            _context2.next = 6;
            return getPagedData(url, config, responseKey, query);

          case 6:
            allContentTypes = _context2.sent;
            return _context2.abrupt("return", allContentTypes);

          case 8:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x3) {
    return _ref2.apply(this, arguments);
  };
}();

var fetchSyncData = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(query, config) {
    var url, response;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            url = 'stacks/sync';
            _context3.next = 3;
            return getSyncData(url, config, query, 'items');

          case 3:
            response = _context3.sent;
            return _context3.abrupt("return", response);

          case 5:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function fetchSyncData(_x4, _x5) {
    return _ref3.apply(this, arguments);
  };
}();

var fetchCsData = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(url, config, query) {
    var queryParams, apiUrl, option;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            query = query || {};
            query.include_count = true; // query.api_key = config.api_key;
            // query.access_token = config.delivery_token;

            query.environment = config.environment;
            queryParams = queryString.stringify(query);
            apiUrl = "".concat(config.cdn, "/").concat(url, "?").concat(queryParams);
            option = {
              headers: {
                'X-User-Agent': "contentstack-gatsby-source-plugin-".concat(version),
                api_key: config.api_key,
                access_token: config.delivery_token
              }
            };
            return _context4.abrupt("return", new Promise(function (resolve, reject) {
              fetch(apiUrl, option).then(function (response) {
                return response.json();
              }).then(function (data) {
                if (data.error_code) {
                  console.error(data);
                  reject(data);
                } else {
                  resolve(data);
                }
              })["catch"](function (err) {
                console.error(err);
                reject(err);
              });
            }));

          case 7:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function fetchCsData(_x6, _x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

var getPagedData = /*#__PURE__*/function () {
  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(url, config, responseKey) {
    var query,
        skip,
        limit,
        aggregatedResponse,
        response,
        _args5 = arguments;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            query = _args5.length > 3 && _args5[3] !== undefined ? _args5[3] : {};
            skip = _args5.length > 4 && _args5[4] !== undefined ? _args5[4] : 0;
            limit = _args5.length > 5 && _args5[5] !== undefined ? _args5[5] : 100;
            aggregatedResponse = _args5.length > 6 && _args5[6] !== undefined ? _args5[6] : null;
            query.skip = skip;
            query.limit = limit;
            query.include_global_field_schema = true;
            _context5.next = 9;
            return fetchCsData(url, config, query);

          case 9:
            response = _context5.sent;

            if (!aggregatedResponse) {
              aggregatedResponse = response[responseKey];
            } else {
              aggregatedResponse = aggregatedResponse.concat(response[responseKey]);
            }

            if (!(skip + limit <= response.count)) {
              _context5.next = 13;
              break;
            }

            return _context5.abrupt("return", getPagedData(url, config, responseKey, query = {}, skip + limit, limit, aggregatedResponse));

          case 13:
            return _context5.abrupt("return", aggregatedResponse);

          case 14:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function getPagedData(_x9, _x10, _x11) {
    return _ref5.apply(this, arguments);
  };
}();

var getSyncData = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(url, config, query, responseKey) {
    var aggregatedResponse,
        response,
        _args6 = arguments;
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            aggregatedResponse = _args6.length > 4 && _args6[4] !== undefined ? _args6[4] : null;
            _context6.next = 3;
            return fetchCsData(url, config, query);

          case 3:
            response = _context6.sent;

            if (!aggregatedResponse) {
              aggregatedResponse = {};
              aggregatedResponse.data = [];
              aggregatedResponse.data = response[responseKey];
              aggregatedResponse.sync_token = response.sync_token;
            } else {
              aggregatedResponse.data = aggregatedResponse.data || [];
              aggregatedResponse.data = aggregatedResponse.data.concat(response[responseKey]);
              aggregatedResponse.sync_token = response.sync_token ? response.sync_token : aggregatedResponse.sync_token;
            }

            if (!response.pagination_token) {
              _context6.next = 7;
              break;
            }

            return _context6.abrupt("return", getSyncData(url, config, query = {
              pagination_token: response.pagination_token
            }, responseKey, aggregatedResponse));

          case 7:
            return _context6.abrupt("return", aggregatedResponse);

          case 8:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function getSyncData(_x12, _x13, _x14, _x15) {
    return _ref6.apply(this, arguments);
  };
}();