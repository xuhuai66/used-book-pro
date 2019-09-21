module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/api/cloud/index.ts":
/*!********************************!*\
  !*** ./src/api/cloud/index.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "tslib");
var provider_1 = __webpack_require__(/*! ./provider */ "./src/api/cloud/provider/index.ts");
var error_1 = __webpack_require__(/*! utils/error */ "./src/utils/error.ts");
var type_1 = __webpack_require__(/*! utils/type */ "./src/utils/type.ts");
var index_1 = __webpack_require__(/*! ../index */ "./src/api/index.ts");
var symbol_config_1 = __webpack_require__(/*! config/symbol.config */ "./src/config/symbol.config.ts");
var Cloud = /** @class */ (function () {
    function Cloud() {
        var _this = this;
        this.inited = false;
        this.services = {};
        this.debug = false;
        this.wrapCommonAPICheck = function (func) {
            return function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                if (!_this.inited) {
                    throw new error_1.CloudSDKError({
                        errMsg: 'Cloud API isn\'t enabled, please call init first\n' +
                            '请先调用 init 完成初始化后再调用其他云 API。init 方法可传入一个对象用于设置默认配置，详见文档。'
                    });
                }
                return func.apply(_this, args);
            };
        };
        this.exportAPI = {
            version: "wx-server-sdk/1.1.0",
            DYNAMIC_CURRENT_ENV: symbol_config_1.SYMBOL_DYNAMIC_CURRENT_ENV,
            // @ts-ignore
            init: this.init.bind(this),
            // @ts-ignore
            updateConfig: this.updateConfig.bind(this),
            registerService: function (serviceProvider) {
                _this.registerService(serviceProvider.createService(_this));
            }
        };
        index_1.registerServices(this);
        this.meta = {
            session_id: (+new Date).toString()
        };
        this.config = {};
        this.provider = provider_1.default();
    }
    Cloud.prototype.getMetaData = function () {
        return this.meta;
    };
    Cloud.prototype.getAPIs = function () {
        return tslib_1.__assign({}, this.exportAPI);
    };
    Cloud.prototype.translateEnv = function (env) {
        var _env = env;
        if (env === symbol_config_1.SYMBOL_DYNAMIC_CURRENT_ENV) {
            _env = process.env.TCB_ENV;
        }
        // in scf local debug, we should not use 'local' as env in api invocation
        if (_env === 'local' && process.env.TENCENTCLOUD_RUNENV === 'WX_LOCAL_SCF') {
            return undefined;
        }
        return _env;
    };
    Cloud.prototype.init = function (config) {
        if (config === void 0) { config = {}; }
        if (this.inited)
            return;
        this.inited = true;
        this.updateConfig(config);
    };
    Cloud.prototype.updateConfig = function (config) {
        if (config === void 0) { config = {}; }
        this.provider.init(tslib_1.__assign({}, config, { version: "wx-server-sdk/1.1.0" }));
        var _config = tslib_1.__assign({}, config, { env: type_1.isObject(config.env) ? config.env : { default: config.env } });
        this.config = _config;
    };
    Cloud.prototype.registerService = function (service) {
        this.services[service.name] = service;
        if (service.getAPIs) {
            var functions = service.getAPIs();
            for (var name in functions) {
                this.registerFunction(name, functions[name], service.initRequired);
            }
        }
        else if (service.getNamespace) {
            var _a = service.getNamespace(), namespace = _a.namespace, apis = _a.apis;
            this.exportAPI[namespace] = apis;
        }
    };
    Cloud.prototype.registerFunction = function (name, func, initRequired) {
        this.exportAPI[name] = initRequired === false ? func : this.wrapCommonAPICheck(func);
    };
    return Cloud;
}());
exports.Cloud = Cloud;
var cloud = new Cloud();
exports.default = cloud;


/***/ }),

/***/ "./src/api/cloud/provider/index.ts":
/*!*****************************************!*\
  !*** ./src/api/cloud/provider/index.ts ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tcb_1 = __webpack_require__(/*! ./tcb */ "./src/api/cloud/provider/tcb/index.ts");
var PROVIDER;
(function (PROVIDER) {
    PROVIDER[PROVIDER["TCB"] = 0] = "TCB";
})(PROVIDER = exports.PROVIDER || (exports.PROVIDER = {}));
function getProvider(provider) {
    if (provider === void 0) { provider = PROVIDER.TCB; }
    switch (provider) {
        default: {
            return tcb_1.default;
        }
    }
}
exports.default = getProvider;


/***/ }),

/***/ "./src/api/cloud/provider/tcb/api/callFunction.ts":
/*!********************************************************!*\
  !*** ./src/api/cloud/provider/tcb/api/callFunction.ts ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var error_config_1 = __webpack_require__(/*! ../config/error.config */ "./src/api/cloud/provider/tcb/config/error.config.ts");
var instance_1 = __webpack_require__(/*! ../utils/instance */ "./src/api/cloud/provider/tcb/utils/instance.ts");
var sleep = function (ms) {
    if (ms === void 0) { ms = 0; }
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
};
function callFunction(options, config) {
    // await sleep()
    /*
    const res = await tcbRequest({
      params: {
        action: 'functions.invokeFunction',
        function_name: options.name,
        request_data: options.dataStr,
      },
      // TODO
      timeout: 5 * 60 * 1000,
      config: mergeConfig(tcb.config, config),
      method: 'post',
      headers: {
        'content-type': 'application/json'
      }
    })
    */
    var tcbInstance = instance_1.getInstance(config);
    /*
    const res: any = await tcbInstance.callFunction({
      name: options.name,
      data: options.data,
    })
    */
    var res;
    try {
        var promise = tcbInstance.callFunction({
            name: options.name,
            data: options.data,
        });
        return promise.then(onProviderResponse).catch(onProviderResponse);
    }
    catch (e) {
        res = {
            code: e && e.code || error_config_1.TCB_ERR_CODE.SYS_ERR,
            message: e.toString(),
            requestID: e && e.requestID,
        };
        return Promise.resolve(onProviderResponse(res));
    }
    function onProviderResponse(res) {
        if (res.code && error_config_1.TCB_ERR_CODE[res.code] !== 0) {
            throw {
                errCode: error_config_1.TCB_ERR_CODE[res.code] || error_config_1.TCB_ERR_CODE.SYS_ERR,
                errMsg: "requestID " + res.requestId + ", " + res.message,
                requestId: res.requestId,
            };
        }
        else {
            return {
                result: res.result,
                requestId: res.requestId,
            };
        }
    }
}
exports.callFunction = callFunction;


/***/ }),

/***/ "./src/api/cloud/provider/tcb/api/callOpenAPI.ts":
/*!*******************************************************!*\
  !*** ./src/api/cloud/provider/tcb/api/callOpenAPI.ts ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// DEPRECATED
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "tslib");
var error_config_1 = __webpack_require__(/*! ../config/error.config */ "./src/api/cloud/provider/tcb/config/error.config.ts");
var instance_1 = __webpack_require__(/*! ../utils/instance */ "./src/api/cloud/provider/tcb/utils/instance.ts");
var sleep = function (ms) {
    if (ms === void 0) { ms = 0; }
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
};
function callOpenAPI(options, config) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var tcbInstance, res;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, sleep()
                    // console.log('wx-server-sdk tcb.callWxOpenApi options: ', options)
                ];
                case 1:
                    _a.sent();
                    tcbInstance = instance_1.getInstance(config);
                    return [4 /*yield*/, tcbInstance.callWxOpenApi({
                            apiName: options.api,
                            requestData: options.data,
                            event: options.event,
                        })
                        // console.log('wx-server-sdk tcb.callWxOpenApi res: ', res)
                    ];
                case 2:
                    res = _a.sent();
                    // console.log('wx-server-sdk tcb.callWxOpenApi res: ', res)
                    if (res.code && error_config_1.TCB_ERR_CODE[res.code] !== 0) {
                        throw {
                            errCode: error_config_1.TCB_ERR_CODE[res.code] || error_config_1.TCB_ERR_CODE.SYS_ERR,
                            errMsg: res.message,
                        };
                    }
                    else {
                        return [2 /*return*/, {
                                result: res.result,
                            }];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.callOpenAPI = callOpenAPI;


/***/ }),

/***/ "./src/api/cloud/provider/tcb/api/callWXOpenAPI.ts":
/*!*********************************************************!*\
  !*** ./src/api/cloud/provider/tcb/api/callWXOpenAPI.ts ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "tslib");
var error_config_1 = __webpack_require__(/*! ../config/error.config */ "./src/api/cloud/provider/tcb/config/error.config.ts");
var error_config_2 = __webpack_require__(/*! ../../../../../config/error.config */ "./src/config/error.config.ts");
var error_1 = __webpack_require__(/*! ../../../../../utils/error */ "./src/utils/error.ts");
var msg_1 = __webpack_require__(/*! ../../../../../utils/msg */ "./src/utils/msg.ts");
var instance_1 = __webpack_require__(/*! ../utils/instance */ "./src/api/cloud/provider/tcb/utils/instance.ts");
var openapi_1 = __webpack_require__(/*! ../../../../../protobuf/openapi */ "./src/protobuf/openapi.js");
var sleep = function (ms) {
    if (ms === void 0) { ms = 0; }
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
};
function callWXOpenAPI(options, config) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var res, tcbInstance, err_1, wxResp, jsonParseResult;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, sleep()];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    tcbInstance = instance_1.getInstance(config);
                    return [4 /*yield*/, tcbInstance.callCompatibleWxOpenApi({
                            apiName: options.api,
                            requestData: options.data,
                        })
                        // console.log('wx-server-sdk tcb.callWxOpenApi res: ', res)
                    ];
                case 3:
                    res = _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _a.sent();
                    throw {
                        errCode: (err_1 && err_1.code && error_config_1.TCB_ERR_CODE[err_1.code]) || error_config_1.TCB_ERR_CODE.SYS_ERR,
                        errMsg: (err_1 && err_1.message) || err_1 || 'empty error message',
                    };
                case 5:
                    if (!Buffer.isBuffer(res)) {
                        // is object
                        // must be error
                        // tcb must not return object
                        if (res.code && res.hasOwnProperty('message')) {
                            // tcb error
                            throw new error_1.CloudSDKError({
                                errCode: error_config_1.TCB_ERR_CODE[res.code] || error_config_1.TCB_ERR_CODE.SYS_ERR,
                                errMsg: msg_1.apiFailMsg(options.api, res.message)
                            });
                        }
                        if (res.errcode) {
                            // wx error
                            throw new error_1.CloudSDKError({
                                errCode: res.errcode,
                                errMsg: msg_1.apiFailMsg(options.api, res.errmsg),
                            });
                        }
                        if (res.byteLength === 0) {
                            throw new error_1.CloudSDKError({
                                errCode: error_config_2.ERR_CODE.WX_SYSTEM_ERROR,
                                errMsg: msg_1.apiFailMsg(options.api, "empty response")
                            });
                        }
                        throw new error_1.CloudSDKError({
                            errCode: error_config_1.TCB_ERR_CODE.SYS_ERR,
                            errMsg: msg_1.apiFailMsg(options.api, "unknown response " + res)
                        });
                    }
                    else {
                        wxResp = void 0;
                        try {
                            wxResp = openapi_1.CommOpenApiResp.decode(res);
                        }
                        catch (decodeError) {
                            jsonParseResult = void 0;
                            try {
                                jsonParseResult = JSON.parse(res.toString());
                            }
                            catch (parseTCBRespError) {
                                // unknown error
                                throw new error_1.CloudSDKError({
                                    errCode: error_config_2.ERR_CODE.WX_SYSTEM_ERROR,
                                    errMsg: msg_1.apiFailMsg(options.api, "unknown wx response received: " + decodeError)
                                });
                            }
                            if (jsonParseResult.code && jsonParseResult.hasOwnProperty('message')) {
                                // tcb error
                                throw new error_1.CloudSDKError({
                                    errCode: error_config_1.TCB_ERR_CODE[jsonParseResult.code] || error_config_1.TCB_ERR_CODE.SYS_ERR,
                                    errMsg: msg_1.apiFailMsg(options.api, jsonParseResult.message)
                                });
                            }
                            else {
                                // unknown tcb error
                                throw new error_1.CloudSDKError({
                                    errCode: error_config_1.TCB_ERR_CODE.SYS_ERR,
                                    errMsg: msg_1.apiFailMsg(options.api, JSON.stringify(jsonParseResult)),
                                });
                            }
                        }
                        if (wxResp) {
                            if (wxResp.errorCode) {
                                // wx system error, for example: no permission
                                throw new error_1.CloudSDKError({
                                    errCode: error_config_2.ERR_CODE[error_config_2.ERR_CODE[wxResp.errorCode]] || wxResp.errorCode,
                                    errMsg: error_config_2.ERR_CODE[error_config_2.ERR_CODE.WX_SYSTEM_ERROR] + ": error code: " + wxResp.errorCode
                                });
                            }
                        }
                        else {
                            throw new error_1.CloudSDKError({
                                errCode: error_config_2.ERR_CODE.WX_SYSTEM_ERROR,
                                errMsg: msg_1.apiFailMsg(options.api, "empty wx response buffer")
                            });
                        }
                        return [2 /*return*/, wxResp];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.callWXOpenAPI = callWXOpenAPI;


/***/ }),

/***/ "./src/api/cloud/provider/tcb/api/database.ts":
/*!****************************************************!*\
  !*** ./src/api/cloud/provider/tcb/api/database.ts ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "tslib");
var tcb = __webpack_require__(/*! tcb-admin-node */ "tcb-admin-node");
var tcbRequest = __webpack_require__(/*! tcb-admin-node/src/utils/httpRequest */ "tcb-admin-node/src/utils/httpRequest");
var error_config_1 = __webpack_require__(/*! ../config/error.config */ "./src/api/cloud/provider/tcb/config/error.config.ts");
var sleep = function (ms) {
    if (ms === void 0) { ms = 0; }
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
};
var mergeConfig = function (tcbConfig, config) {
    var ret = tslib_1.__assign({}, tcbConfig);
    if (config.env) {
        ret.env = config.env;
    }
    return ret;
};
function addDocument(options, config) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var res;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // 不得已而 sleep(0)，因为 tcb-admin-node 的 httpRequest 在返回 promise 之前竟然有逻辑可能抛错 !!!!!
                return [4 /*yield*/, sleep()];
                case 1:
                    // 不得已而 sleep(0)，因为 tcb-admin-node 的 httpRequest 在返回 promise 之前竟然有逻辑可能抛错 !!!!!
                    _a.sent();
                    return [4 /*yield*/, tcbRequest({
                            params: {
                                action: 'database.addDocument',
                                _id: options._id,
                                collectionName: options.collectionName,
                                data: options.data,
                            },
                            config: mergeConfig(tcb.config, config),
                            method: 'post',
                            headers: {
                                'content-type': 'application/json'
                            }
                        })];
                case 2:
                    res = _a.sent();
                    if (res.code && error_config_1.TCB_ERR_CODE[res.code] !== 0) {
                        throw {
                            errCode: error_config_1.TCB_ERR_CODE[res.code] || error_config_1.TCB_ERR_CODE.SYS_ERR,
                            errMsg: res.message,
                        };
                    }
                    else {
                        return [2 /*return*/, {
                                _id: res.data._id,
                                requestId: res.requestId,
                            }];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.addDocument = addDocument;
function queryDocument(options, config) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var res;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, sleep()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, tcbRequest({
                            params: tslib_1.__assign({}, options, { action: 'database.queryDocument', collectionName: options.collectionName }),
                            config: mergeConfig(tcb.config, config),
                            method: 'post',
                            headers: {
                                'content-type': 'application/json'
                            }
                        })];
                case 2:
                    res = _a.sent();
                    if (res.code) {
                        throw {
                            errCode: error_config_1.TCB_ERR_CODE[res.code] || error_config_1.TCB_ERR_CODE.SYS_ERR,
                            errMsg: res.message,
                        };
                    }
                    else {
                        return [2 /*return*/, {
                                list: res.data.list || [],
                                limit: res.Limit,
                                offset: res.Offset,
                                total: res.TotalCount,
                                requestId: res.requestId,
                            }];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.queryDocument = queryDocument;
function updateDocument(options, config) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var res;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, sleep()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, tcbRequest({
                            params: tslib_1.__assign({}, options, { action: 'database.updateDocument', collectionName: options.collectionName }),
                            config: mergeConfig(tcb.config, config),
                            method: 'post',
                            headers: {
                                'content-type': 'application/json'
                            }
                        })];
                case 2:
                    res = _a.sent();
                    if (res.code) {
                        throw {
                            errCode: error_config_1.TCB_ERR_CODE[res.code] || error_config_1.TCB_ERR_CODE.SYS_ERR,
                            errMsg: res.message,
                        };
                    }
                    else {
                        return [2 /*return*/, {
                                updated: res.data.updated,
                                upsertedId: res.data.upserted_id,
                                requestId: res.requestId,
                            }];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.updateDocument = updateDocument;
function removeDocument(options, config) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var res;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, sleep()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, tcbRequest({
                            params: tslib_1.__assign({}, options, { action: 'database.removeDocument', collectionName: options.collectionName }),
                            config: mergeConfig(tcb.config, config),
                            method: 'post',
                            headers: {
                                'content-type': 'application/json'
                            }
                        })];
                case 2:
                    res = _a.sent();
                    if (res.code) {
                        throw {
                            errCode: error_config_1.TCB_ERR_CODE[res.code] || error_config_1.TCB_ERR_CODE.SYS_ERR,
                            errMsg: res.message,
                        };
                    }
                    else {
                        return [2 /*return*/, {
                                removed: res.deleted,
                                requestId: res.requestId,
                            }];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.removeDocument = removeDocument;
function countDocument(options, config) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var res;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, sleep()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, tcbRequest({
                            params: tslib_1.__assign({}, options, { action: 'database.countDocument', collectionName: options.collectionName }),
                            config: mergeConfig(tcb.config, config),
                            method: 'post',
                            headers: {
                                'content-type': 'application/json'
                            }
                        })];
                case 2:
                    res = _a.sent();
                    if (res.code) {
                        throw {
                            errCode: error_config_1.TCB_ERR_CODE[res.code] || error_config_1.TCB_ERR_CODE.SYS_ERR,
                            errMsg: res.message,
                        };
                    }
                    else {
                        return [2 /*return*/, {
                                total: res.data.total,
                                requestId: res.requestId,
                            }];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.countDocument = countDocument;


/***/ }),

/***/ "./src/api/cloud/provider/tcb/api/deleteFile.ts":
/*!******************************************************!*\
  !*** ./src/api/cloud/provider/tcb/api/deleteFile.ts ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "tslib");
var error_config_1 = __webpack_require__(/*! ../config/error.config */ "./src/api/cloud/provider/tcb/config/error.config.ts");
var error_config_2 = __webpack_require__(/*! ../../../../../config/error.config */ "./src/config/error.config.ts");
var instance_1 = __webpack_require__(/*! ../utils/instance */ "./src/api/cloud/provider/tcb/utils/instance.ts");
var sleep = function (ms) {
    if (ms === void 0) { ms = 0; }
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
};
function deleteFile(options, config) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var tcbInstance, res, fileList;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, sleep()];
                case 1:
                    _a.sent();
                    tcbInstance = instance_1.getInstance(config);
                    return [4 /*yield*/, tcbInstance.deleteFile({
                            fileList: options.fileList
                        })];
                case 2:
                    res = _a.sent();
                    if (res.code && error_config_1.TCB_ERR_CODE[res.code] !== 0) {
                        throw {
                            errCode: error_config_1.TCB_ERR_CODE[res.code] || error_config_1.TCB_ERR_CODE.SYS_ERR,
                            errMsg: res.message,
                        };
                    }
                    else {
                        fileList = (res.fileList || []).filter(function (s) { return Boolean(s); }).map(function (f) {
                            if (f.code && error_config_1.TCB_ERR_CODE[f.code] !== 0) {
                                var code = error_config_1.TCB_ERR_CODE[f.code] || error_config_1.TCB_ERR_CODE.SYS_ERR;
                                return {
                                    fileID: f.fileID,
                                    status: error_config_1.TCB_ERR_CODE[f.code] || error_config_1.TCB_ERR_CODE.SYS_ERR,
                                    errMsg: error_config_2.ERR_CODE[code]
                                };
                            }
                            return {
                                fileID: f.fileID,
                                status: 0,
                                errMsg: 'ok',
                            };
                        });
                        //@ts-ignore
                        return [2 /*return*/, {
                                fileList: fileList,
                                requestId: res.requestId,
                            }];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.deleteFile = deleteFile;


/***/ }),

/***/ "./src/api/cloud/provider/tcb/api/downloadFile.ts":
/*!********************************************************!*\
  !*** ./src/api/cloud/provider/tcb/api/downloadFile.ts ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "tslib");
var error_config_1 = __webpack_require__(/*! ../config/error.config */ "./src/api/cloud/provider/tcb/config/error.config.ts");
var instance_1 = __webpack_require__(/*! ../utils/instance */ "./src/api/cloud/provider/tcb/utils/instance.ts");
var sleep = function (ms) {
    if (ms === void 0) { ms = 0; }
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
};
function downloadFile(options, config) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var statusCode, tcbInstance, res;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, sleep()];
                case 1:
                    _a.sent();
                    statusCode = 200;
                    tcbInstance = instance_1.getInstance(config);
                    return [4 /*yield*/, tcbInstance.downloadFile({
                            fileID: options.fileID
                        })];
                case 2:
                    res = _a.sent();
                    if (res.code && error_config_1.TCB_ERR_CODE[res.code] !== 0) {
                        throw {
                            errCode: error_config_1.TCB_ERR_CODE[res.code] || error_config_1.TCB_ERR_CODE.SYS_ERR,
                            errMsg: res.message,
                        };
                    }
                    return [2 /*return*/, {
                            statusCode: statusCode,
                            fileContent: res.fileContent,
                        }];
            }
        });
    });
}
exports.downloadFile = downloadFile;


/***/ }),

/***/ "./src/api/cloud/provider/tcb/api/getTempFileURL.ts":
/*!**********************************************************!*\
  !*** ./src/api/cloud/provider/tcb/api/getTempFileURL.ts ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "tslib");
var error_config_1 = __webpack_require__(/*! ../config/error.config */ "./src/api/cloud/provider/tcb/config/error.config.ts");
var error_config_2 = __webpack_require__(/*! ../../../../../config/error.config */ "./src/config/error.config.ts");
var instance_1 = __webpack_require__(/*! ../utils/instance */ "./src/api/cloud/provider/tcb/utils/instance.ts");
var sleep = function (ms) {
    if (ms === void 0) { ms = 0; }
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
};
function getTempFileURL(options, config) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var tcbInstance, res, fileList;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, sleep()];
                case 1:
                    _a.sent();
                    tcbInstance = instance_1.getInstance(config);
                    return [4 /*yield*/, tcbInstance.getTempFileURL({
                            fileList: options.fileList,
                        })];
                case 2:
                    res = _a.sent();
                    if (res.code && error_config_1.TCB_ERR_CODE[res.code] !== 0) {
                        throw {
                            errCode: error_config_1.TCB_ERR_CODE[res.code] || error_config_1.TCB_ERR_CODE.SYS_ERR,
                            errMsg: res.message,
                        };
                    }
                    else {
                        fileList = (res.fileList || []).filter(function (s) { return Boolean(s); }).map(function (f, i) {
                            if (f.code && error_config_1.TCB_ERR_CODE[f.code] !== 0) {
                                var code = error_config_1.TCB_ERR_CODE[f.code] || error_config_1.TCB_ERR_CODE.SYS_ERR;
                                return {
                                    fileID: f.fileID,
                                    status: error_config_1.TCB_ERR_CODE[f.code] || error_config_1.TCB_ERR_CODE.SYS_ERR,
                                    errMsg: error_config_2.ERR_CODE[code],
                                    maxAge: f.maxAge,
                                    tempFileURL: '',
                                };
                            }
                            return {
                                fileID: f.fileID,
                                status: 0,
                                errMsg: 'ok',
                                maxAge: f.maxAge,
                                tempFileURL: f.tempFileURL,
                            };
                        });
                        return [2 /*return*/, {
                                fileList: fileList,
                                requestId: res.requestId,
                            }];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.getTempFileURL = getTempFileURL;


/***/ }),

/***/ "./src/api/cloud/provider/tcb/api/uploadFile.ts":
/*!******************************************************!*\
  !*** ./src/api/cloud/provider/tcb/api/uploadFile.ts ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "tslib");
var error_config_1 = __webpack_require__(/*! ../config/error.config */ "./src/api/cloud/provider/tcb/config/error.config.ts");
var instance_1 = __webpack_require__(/*! ../utils/instance */ "./src/api/cloud/provider/tcb/utils/instance.ts");
var sleep = function (ms) {
    if (ms === void 0) { ms = 0; }
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
};
function uploadFile(options, config) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var statusCode, tcbInstance, res;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, sleep()];
                case 1:
                    _a.sent();
                    statusCode = -1;
                    tcbInstance = instance_1.getInstance(config);
                    return [4 /*yield*/, tcbInstance.uploadFile({
                            cloudPath: options.cloudPath,
                            fileContent: options.fileContent,
                        }, {
                            onResponseReceived: function (resp) {
                                statusCode = resp ? resp.statusCode : statusCode;
                            }
                        })];
                case 2:
                    res = _a.sent();
                    if (res.code && error_config_1.TCB_ERR_CODE[res.code] !== 0) {
                        throw {
                            errCode: error_config_1.TCB_ERR_CODE[res.code] || error_config_1.TCB_ERR_CODE.SYS_ERR,
                            errMsg: res.message,
                        };
                    }
                    else {
                        //@ts-ignore
                        return [2 /*return*/, {
                                fileID: res.fileID,
                                requestId: res.requestId,
                                statusCode: statusCode,
                            }];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.uploadFile = uploadFile;


/***/ }),

/***/ "./src/api/cloud/provider/tcb/config/error.config.ts":
/*!***********************************************************!*\
  !*** ./src/api/cloud/provider/tcb/config/error.config.ts ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// provider should also register the error codes in src/config/error.config.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.TCB_ERR_CODE = {
    // 通用
    SUCCESS: 0,
    SYS_ERR: -501001,
    SERVER_TIMEOUT: -501002,
    EXCEED_REQUEST_LIMIT: -501003,
    EXCEED_CONCURRENT_REQUEST_LIMIT: -501004,
    INVALIID_ENV: -501005,
    INVALID_COMMON_PARAM: -501006,
    INVALID_PARAM: -501007,
    INVALID_REQUEST_SOURCE: -501008,
    RESOURCE_NOT_INITIAL: -501009,
    // 数据库
    DATABASE_REQUEST_FAILED: -502001,
    DATABASE_INVALID_OPERRATOR: -502002,
    DATABASE_PERMISSION_DENIED: -502003,
    DATABASE_COLLECTION_EXCEED_LIMIT: -502004,
    DATABASE_COLLECTION_NOT_EXIST: -502005,
    // 文件
    STORAGE_REQUEST_FAIL: -503001,
    STORAGE_EXCEED_AUTHORITY: -503002,
    STORAGE_FILE_NONEXIST: -503003,
    STORAGE_SIGN_PARAM_INVALID: -503004,
    // 云函数
    FUNCTIONS_REQUEST_FAIL: -504001,
    FUNCTIONS_EXECUTE_FAIL: -504002,
};


/***/ }),

/***/ "./src/api/cloud/provider/tcb/index.ts":
/*!*********************************************!*\
  !*** ./src/api/cloud/provider/tcb/index.ts ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "tslib");
var tcb = __webpack_require__(/*! tcb-admin-node */ "tcb-admin-node");
var tcbRequest = __webpack_require__(/*! tcb-admin-node/src/utils/httpRequest */ "tcb-admin-node/src/utils/httpRequest");
var database_1 = __webpack_require__(/*! ./api/database */ "./src/api/cloud/provider/tcb/api/database.ts");
var callFunction_1 = __webpack_require__(/*! ./api/callFunction */ "./src/api/cloud/provider/tcb/api/callFunction.ts");
var downloadFile_1 = __webpack_require__(/*! ./api/downloadFile */ "./src/api/cloud/provider/tcb/api/downloadFile.ts");
var uploadFile_1 = __webpack_require__(/*! ./api/uploadFile */ "./src/api/cloud/provider/tcb/api/uploadFile.ts");
var deleteFile_1 = __webpack_require__(/*! ./api/deleteFile */ "./src/api/cloud/provider/tcb/api/deleteFile.ts");
var getTempFileURL_1 = __webpack_require__(/*! ./api/getTempFileURL */ "./src/api/cloud/provider/tcb/api/getTempFileURL.ts");
var callOpenAPI_1 = __webpack_require__(/*! ./api/callOpenAPI */ "./src/api/cloud/provider/tcb/api/callOpenAPI.ts");
var callWXOpenAPI_1 = __webpack_require__(/*! ./api/callWXOpenAPI */ "./src/api/cloud/provider/tcb/api/callWXOpenAPI.ts");
var provider = {
    // init
    init: function (config) {
        tcb.init(tslib_1.__assign({}, config, { isHttp: process.env.TENCENTCLOUD_RUNENV === 'WX_LOCAL_SCF' }));
    },
    get config() {
        return tcb.config;
    },
    // request
    sendRequest: function (options) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, tcbRequest(tslib_1.__assign({ config: tcb.config, params: options.data }, options))];
            });
        });
    },
    // api
    api: {
        addDocument: database_1.addDocument,
        queryDocument: database_1.queryDocument,
        updateDocument: database_1.updateDocument,
        removeDocument: database_1.removeDocument,
        countDocument: database_1.countDocument,
        callFunction: callFunction_1.callFunction,
        downloadFile: downloadFile_1.downloadFile,
        uploadFile: uploadFile_1.uploadFile,
        deleteFile: deleteFile_1.deleteFile,
        getTempFileURL: getTempFileURL_1.getTempFileURL,
        callOpenAPI: callOpenAPI_1.callOpenAPI,
        callWXOpenAPI: callWXOpenAPI_1.callWXOpenAPI,
    }
};
exports.default = provider;


/***/ }),

/***/ "./src/api/cloud/provider/tcb/utils/instance.ts":
/*!******************************************************!*\
  !*** ./src/api/cloud/provider/tcb/utils/instance.ts ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "tslib");
var tcb = __webpack_require__(/*! tcb-admin-node */ "tcb-admin-node");
exports.getInstance = function (config) {
    if (config === void 0) { config = {}; }
    if (process.env.TENCENTCLOUD_RUNENV === 'WX_LOCAL_SCF') {
        // @ts-ignore
        var instance = tcb.init(tslib_1.__assign({}, tcb.config, config, { env: config.env || tcb.config.envName, isHttp: true }));
        instance.config.secretId = undefined;
        instance.config.secretKey = undefined;
        instance.config.sessionToken = undefined;
        return instance;
    }
    else {
        // @ts-ignore
        var instance = tcb.init(tslib_1.__assign({}, tcb.config, config, { env: config.env || tcb.config.envName }));
        instance.config.secretId = undefined;
        instance.config.secretKey = undefined;
        instance.config.sessionToken = undefined;
        return instance;
    }
};
exports.fixInstanceSecrets = function () {
    if (process.env.TENCENTCLOUD_RUNENV === 'WX_LOCAL_SCF') {
        tcb.config.secretId = undefined;
        tcb.config.secretKey = undefined;
        tcb.config.sessionToken = undefined;
    }
};


/***/ }),

/***/ "./src/api/database/api/api.ts":
/*!*************************************!*\
  !*** ./src/api/database/api/api.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var database_1 = __webpack_require__(/*! ./database */ "./src/api/database/api/database.ts");
function getAPIs(cloud) {
    return {
        database: database_1.default.bind(null, cloud),
    };
}
exports.getAPIs = getAPIs;


/***/ }),

/***/ "./src/api/database/api/database.ts":
/*!******************************************!*\
  !*** ./src/api/database/api/database.ts ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "tslib");
var tcb = __webpack_require__(/*! tcb-admin-node */ "tcb-admin-node");
var collection_1 = __webpack_require__(/*! ./database/collection */ "./src/api/database/api/database/collection.ts");
var geo_1 = __webpack_require__(/*! ./database/geo/geo */ "./src/api/database/api/database/geo/geo.ts");
var assert_1 = __webpack_require__(/*! utils/assert */ "./src/utils/assert.ts");
var msg_1 = __webpack_require__(/*! utils/msg */ "./src/utils/msg.ts");
var error_1 = __webpack_require__(/*! utils/error */ "./src/utils/error.ts");
var error_checker_1 = __webpack_require__(/*! ./database/helper/error-checker */ "./src/api/database/api/database/helper/error-checker.ts");
function getDatabase(cloud, config) {
    var Database = getDatabaseClass(cloud);
    return new Database(config);
}
exports.default = getDatabase;
var getDatabaseClass = function (cloud) {
    return /** @class */ (function () {
        function Database(config) {
            if (config === void 0) { config = {}; }
            this.cloud = cloud;
            this.config = config;
            if (config.env) {
                assert_1.assertType(config.env, 'string');
            }
            // @ts-ignore
            var tcbConfig = tslib_1.__assign({}, tcb.config, { 
                // @ts-ignore
                env: cloud.translateEnv(config.env || (cloud.config.env && (cloud.config.env.database || cloud.config.env.default))), 
                // @ts-ignore
                secretId: config.secretId, 
                // @ts-ignore
                secretKey: config.secretKey, 
                // @ts-ignore
                sessionToken: config.sessionToken });
            if (process.env.TENCENTCLOUD_RUNENV === 'WX_LOCAL_SCF') {
                tcbConfig.isHttp = true;
            }
            var tcbInstance = tcb.init(tcbConfig);
            this._db = tcbInstance.database();
            this.command = this._db.command;
            this.Geo = geo_1.initGeo(this._db.Geo);
            this.serverDate = this._db.serverDate;
            this.RegExp = this._db.RegExp;
        }
        Database.prototype.collection = function (collectionName) {
            return new collection_1.CollectionReference(this._db.collection(collectionName), collectionName, this);
        };
        Database.prototype.createCollection = function (collectionName) {
            return tslib_1.__awaiter(this, void 0, void 0, function () {
                var apiName, result, e_1;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            apiName = 'createCollection';
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this._db.createCollection(collectionName)];
                        case 2:
                            result = _a.sent();
                            error_checker_1.checkError(result);
                            return [2 /*return*/, {
                                    errMsg: msg_1.apiSuccessMsg(apiName),
                                    requestId: result.requestId,
                                }];
                        case 3:
                            e_1 = _a.sent();
                            throw error_1.returnAsFinalCloudSDKError(e_1, apiName);
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        return Database;
    }());
};


/***/ }),

/***/ "./src/api/database/api/database/aggregate.ts":
/*!****************************************************!*\
  !*** ./src/api/database/api/database/aggregate.ts ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "tslib");
var msg_1 = __webpack_require__(/*! utils/msg */ "./src/utils/msg.ts");
var error_1 = __webpack_require__(/*! utils/error */ "./src/utils/error.ts");
var error_checker_1 = __webpack_require__(/*! ./helper/error-checker */ "./src/api/database/api/database/helper/error-checker.ts");
var instance_1 = __webpack_require__(/*! ../../../cloud/provider/tcb/utils/instance */ "./src/api/cloud/provider/tcb/utils/instance.ts");
var ORDER_DIRECTION;
(function (ORDER_DIRECTION) {
    ORDER_DIRECTION["ASC"] = "asc";
    ORDER_DIRECTION["DESC"] = "desc";
})(ORDER_DIRECTION = exports.ORDER_DIRECTION || (exports.ORDER_DIRECTION = {}));
var Aggregate = /** @class */ (function () {
    function Aggregate(_aggregate, collectionName, database) {
        this._aggregate = _aggregate;
        this.collectionName = collectionName;
        this.database = database;
    }
    Aggregate.prototype.pushStage = function (stage, val) {
        return new Aggregate(this._aggregate[stage](val), this.collectionName, this.database);
    };
    Aggregate.prototype.addFields = function (val) {
        return this.pushStage('addFields', val);
    };
    Aggregate.prototype.bucket = function (val) {
        return this.pushStage('bucket', val);
    };
    Aggregate.prototype.bucketAuto = function (val) {
        return this.pushStage('bucketAuto', val);
    };
    Aggregate.prototype.collStats = function (val) {
        return this.pushStage('collStats', val);
    };
    Aggregate.prototype.count = function (val) {
        return this.pushStage('count', val);
    };
    Aggregate.prototype.facet = function (val) {
        return this.pushStage('facet', val);
    };
    Aggregate.prototype.geoNear = function (val) {
        return this.pushStage('geoNear', val);
    };
    Aggregate.prototype.graphLookup = function (val) {
        return this.pushStage('graphLookup', val);
    };
    Aggregate.prototype.group = function (val) {
        return this.pushStage('group', val);
    };
    Aggregate.prototype.indexStats = function () {
        return this.pushStage('indexStats', {});
    };
    Aggregate.prototype.limit = function (val) {
        return this.pushStage('limit', val);
    };
    Aggregate.prototype.lookup = function (val) {
        return this.pushStage('lookup', val);
    };
    Aggregate.prototype.match = function (val) {
        return this.pushStage('match', val);
    };
    Aggregate.prototype.out = function (val) {
        return this.pushStage('out', val);
    };
    Aggregate.prototype.project = function (val) {
        return this.pushStage('project', val);
    };
    Aggregate.prototype.redact = function (val) {
        return this.pushStage('redact', val);
    };
    Aggregate.prototype.replaceRoot = function (val) {
        return this.pushStage('replaceRoot', val);
    };
    Aggregate.prototype.sample = function (val) {
        return this.pushStage('sample', val);
    };
    Aggregate.prototype.skip = function (val) {
        return this.pushStage('skip', val);
    };
    Aggregate.prototype.sort = function (val) {
        return this.pushStage('sort', val);
    };
    Aggregate.prototype.sortByCount = function (val) {
        return this.pushStage('sortByCount', val);
    };
    Aggregate.prototype.unwind = function (val) {
        return this.pushStage('unwind', val);
    };
    Aggregate.prototype.end = function () {
        var _this = this;
        var apiName = 'collection.aggregate';
        return new Promise(function (resolve, reject) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var result, err_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        instance_1.fixInstanceSecrets();
                        return [4 /*yield*/, this._aggregate.end()];
                    case 1:
                        result = _a.sent();
                        error_checker_1.checkError(result);
                        resolve({
                            list: result.data,
                            errMsg: msg_1.apiSuccessMsg(apiName),
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _a.sent();
                        reject(error_1.returnAsFinalCloudSDKError(err_1, apiName));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    return Aggregate;
}());
exports.Aggregate = Aggregate;


/***/ }),

/***/ "./src/api/database/api/database/collection.ts":
/*!*****************************************************!*\
  !*** ./src/api/database/api/database/collection.ts ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "tslib");
var query_1 = __webpack_require__(/*! ./query */ "./src/api/database/api/database/query.ts");
var document_1 = __webpack_require__(/*! ./document */ "./src/api/database/api/database/document.ts");
var msg_1 = __webpack_require__(/*! utils/msg */ "./src/utils/msg.ts");
var error_1 = __webpack_require__(/*! utils/error */ "./src/utils/error.ts");
var assert_1 = __webpack_require__(/*! utils/assert */ "./src/utils/assert.ts");
var error_checker_1 = __webpack_require__(/*! ./helper/error-checker */ "./src/api/database/api/database/helper/error-checker.ts");
var instance_1 = __webpack_require__(/*! ../../../cloud/provider/tcb/utils/instance */ "./src/api/cloud/provider/tcb/utils/instance.ts");
var aggregate_1 = __webpack_require__(/*! ./aggregate */ "./src/api/database/api/database/aggregate.ts");
var CollectionReference = /** @class */ (function (_super) {
    tslib_1.__extends(CollectionReference, _super);
    function CollectionReference(_collection, collectionName, database) {
        var _this = _super.call(this, _collection, collectionName, database) || this;
        _this._collection = _collection;
        _this.collectionName = collectionName;
        _this.database = database;
        return _this;
    }
    CollectionReference.prototype.doc = function (docId) {
        return new document_1.DocumentReference(this._collection.doc(docId), this, docId, this.database);
    };
    CollectionReference.prototype.add = function (options) {
        var _this = this;
        var apiName = 'collection.add';
        return new Promise(function (resolve, reject) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var addResult, err_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        assert_1.assertType(options, {
                            data: 'object'
                        });
                        assert_1.assertObjectNotEmpty({
                            name: 'options.data',
                            target: options.data,
                        });
                        instance_1.fixInstanceSecrets();
                        return [4 /*yield*/, this._collection.add(options.data)];
                    case 1:
                        addResult = _a.sent();
                        error_checker_1.checkError(addResult);
                        resolve({
                            _id: addResult.id,
                            errMsg: msg_1.apiSuccessMsg(apiName),
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _a.sent();
                        reject(error_1.returnAsFinalCloudSDKError(err_1, apiName));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    CollectionReference.prototype.aggregate = function () {
        return new aggregate_1.Aggregate(this._collection.aggregate(), this.collectionName, this.database);
    };
    return CollectionReference;
}(query_1.Query));
exports.CollectionReference = CollectionReference;


/***/ }),

/***/ "./src/api/database/api/database/document.ts":
/*!***************************************************!*\
  !*** ./src/api/database/api/database/document.ts ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "tslib");
var msg_1 = __webpack_require__(/*! utils/msg */ "./src/utils/msg.ts");
var error_1 = __webpack_require__(/*! utils/error */ "./src/utils/error.ts");
var assert_1 = __webpack_require__(/*! utils/assert */ "./src/utils/assert.ts");
var error_checker_1 = __webpack_require__(/*! ./helper/error-checker */ "./src/api/database/api/database/helper/error-checker.ts");
var instance_1 = __webpack_require__(/*! ../../../cloud/provider/tcb/utils/instance */ "./src/api/cloud/provider/tcb/utils/instance.ts");
var GET_API_NAME = 'document.get';
var UPDATE_API_NAME = 'document.update';
var SET_API_NAME = 'document.set';
var REMOVE_API_NAME = 'document.remove';
var DocumentReference = /** @class */ (function () {
    function DocumentReference(_document, collection, docId, database) {
        this._document = _document;
        this.collection = collection;
        this.database = database;
        this._id = docId;
    }
    DocumentReference.prototype.field = function (object) {
        assert_1.assertRequiredParam(object, 'object', 'field');
        assert_1.assertType(object, 'object', 'field');
        return new DocumentReference(this._document.field(object), this.collection, this._id, this.database);
    };
    DocumentReference.prototype.get = function (options) {
        var _this = this;
        return new Promise(function (resolve, reject) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _id, queryResult, err_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        _id = this._id;
                        instance_1.fixInstanceSecrets();
                        return [4 /*yield*/, this._document.get()];
                    case 1:
                        queryResult = _a.sent();
                        error_checker_1.checkError(queryResult);
                        if (!queryResult.data || !queryResult.data.length) {
                            throw "document with _id " + _id + " does not exist";
                        }
                        resolve({
                            data: queryResult.data[0],
                            errMsg: msg_1.apiSuccessMsg(GET_API_NAME),
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _a.sent();
                        reject(error_1.returnAsFinalCloudSDKError(err_1, GET_API_NAME));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    DocumentReference.prototype.set = function (options) {
        var _this = this;
        return new Promise(function (resolve, reject) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _id, setResult, err_2;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        assert_1.assertType(options, {
                            data: 'object',
                        });
                        assert_1.assertObjectNotEmpty({
                            name: 'options.data',
                            target: options.data,
                        });
                        _id = this._id;
                        instance_1.fixInstanceSecrets();
                        return [4 /*yield*/, this._document.set(options.data)];
                    case 1:
                        setResult = _a.sent();
                        error_checker_1.checkError(setResult);
                        resolve({
                            _id: _id,
                            errMsg: msg_1.apiSuccessMsg(SET_API_NAME),
                            stats: {
                                updated: setResult.updated,
                                created: setResult.upsertedId ? 1 : 0,
                            }
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        err_2 = _a.sent();
                        reject(error_1.returnAsFinalCloudSDKError(err_2, SET_API_NAME));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    DocumentReference.prototype.update = function (options) {
        var _this = this;
        return new Promise(function (resolve, reject) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var updateResult, err_3;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        assert_1.assertType(options, {
                            data: 'object',
                        });
                        assert_1.assertObjectNotEmpty({
                            name: 'options.data',
                            target: options.data,
                        });
                        instance_1.fixInstanceSecrets();
                        return [4 /*yield*/, this._document.update(options.data)];
                    case 1:
                        updateResult = _a.sent();
                        error_checker_1.checkError(updateResult);
                        resolve({
                            stats: {
                                updated: updateResult.updated,
                            },
                            errMsg: msg_1.apiSuccessMsg(UPDATE_API_NAME),
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        err_3 = _a.sent();
                        reject(error_1.returnAsFinalCloudSDKError(err_3, UPDATE_API_NAME));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    DocumentReference.prototype.remove = function (options) {
        var _this = this;
        return new Promise(function (resolve, reject) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var removeResult, err_4;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        instance_1.fixInstanceSecrets();
                        return [4 /*yield*/, this._document.remove()];
                    case 1:
                        removeResult = _a.sent();
                        error_checker_1.checkError(removeResult);
                        resolve({
                            stats: {
                                removed: removeResult.deleted || 0,
                            },
                            errMsg: msg_1.apiSuccessMsg(REMOVE_API_NAME),
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        err_4 = _a.sent();
                        reject(error_1.returnAsFinalCloudSDKError(err_4, REMOVE_API_NAME));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    return DocumentReference;
}());
exports.DocumentReference = DocumentReference;


/***/ }),

/***/ "./src/api/database/api/database/geo/geo.ts":
/*!**************************************************!*\
  !*** ./src/api/database/api/database/geo/geo.ts ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "tslib");
exports.initGeo = function (_geo) {
    var Geo = {};
    var _loop_1 = function (key) {
        if (_geo.hasOwnProperty(key)) {
            if (typeof _geo[key] === 'function') {
                Geo[key] = function () {
                    var _a;
                    return new ((_a = _geo[key]).bind.apply(_a, tslib_1.__spread([void 0], arguments)))();
                };
            }
            else {
                Geo[key] = _geo[key];
            }
        }
    };
    for (var key in _geo) {
        _loop_1(key);
    }
    return Geo;
};


/***/ }),

/***/ "./src/api/database/api/database/helper/error-checker.ts":
/*!***************************************************************!*\
  !*** ./src/api/database/api/database/helper/error-checker.ts ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var error_1 = __webpack_require__(/*! utils/error */ "./src/utils/error.ts");
var error_config_1 = __webpack_require__(/*! api/cloud/provider/tcb/config/error.config */ "./src/api/cloud/provider/tcb/config/error.config.ts");
function checkError(tcbResult) {
    if (tcbResult && tcbResult.code) {
        throw error_1.returnAsCloudSDKError({
            errCode: error_config_1.TCB_ERR_CODE[tcbResult.code] || error_config_1.TCB_ERR_CODE.SYS_ERR,
            errMsg: tcbResult.message,
        });
    }
}
exports.checkError = checkError;


/***/ }),

/***/ "./src/api/database/api/database/query.ts":
/*!************************************************!*\
  !*** ./src/api/database/api/database/query.ts ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "tslib");
var msg_1 = __webpack_require__(/*! utils/msg */ "./src/utils/msg.ts");
var assert_1 = __webpack_require__(/*! utils/assert */ "./src/utils/assert.ts");
var error_1 = __webpack_require__(/*! utils/error */ "./src/utils/error.ts");
var error_checker_1 = __webpack_require__(/*! ./helper/error-checker */ "./src/api/database/api/database/helper/error-checker.ts");
var instance_1 = __webpack_require__(/*! ../../../cloud/provider/tcb/utils/instance */ "./src/api/cloud/provider/tcb/utils/instance.ts");
var ORDER_DIRECTION;
(function (ORDER_DIRECTION) {
    ORDER_DIRECTION["ASC"] = "asc";
    ORDER_DIRECTION["DESC"] = "desc";
})(ORDER_DIRECTION = exports.ORDER_DIRECTION || (exports.ORDER_DIRECTION = {}));
var Query = /** @class */ (function () {
    function Query(_query, collectionName, database) {
        this._query = _query;
        this.collectionName = collectionName;
        this.database = database;
    }
    Query.prototype.field = function (object) {
        return new Query(this._query.field(object), this.collectionName, this.database);
    };
    Query.prototype.where = function (condition) {
        return new Query(this._query.where(condition), this.collectionName, this.database);
    };
    Query.prototype.orderBy = function (fieldPath, order) {
        return new Query(this._query.orderBy(fieldPath, order), this.collectionName, this.database);
    };
    Query.prototype.limit = function (max) {
        return new Query(this._query.limit(max), this.collectionName, this.database);
    };
    Query.prototype.skip = function (offset) {
        return new Query(this._query.skip(offset), this.collectionName, this.database);
    };
    Query.prototype.get = function (options) {
        var _this = this;
        var apiName = 'collection.get';
        return new Promise(function (resolve, reject) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var queryResult, err_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        instance_1.fixInstanceSecrets();
                        return [4 /*yield*/, this._query.get()];
                    case 1:
                        queryResult = _a.sent();
                        error_checker_1.checkError(queryResult);
                        resolve({
                            data: queryResult.data,
                            errMsg: msg_1.apiSuccessMsg(apiName),
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _a.sent();
                        reject(error_1.returnAsFinalCloudSDKError(err_1, apiName));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    Query.prototype.update = function (options) {
        var _this = this;
        var apiName = 'collection.update';
        return new Promise(function (resolve, reject) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var updateResult, err_2;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        assert_1.assertType(options, {
                            data: 'object',
                        });
                        assert_1.assertObjectNotEmpty({
                            name: 'options.data',
                            target: options.data,
                        });
                        instance_1.fixInstanceSecrets();
                        return [4 /*yield*/, this._query.update(options.data)];
                    case 1:
                        updateResult = _a.sent();
                        error_checker_1.checkError(updateResult);
                        resolve({
                            stats: {
                                updated: updateResult.updated || 0,
                            },
                            errMsg: msg_1.apiSuccessMsg(apiName),
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        err_2 = _a.sent();
                        reject(error_1.returnAsFinalCloudSDKError(err_2, apiName));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    Query.prototype.remove = function (options) {
        var _this = this;
        var apiName = 'collection.remove';
        return new Promise(function (resolve, reject) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var removeResult, err_3;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        instance_1.fixInstanceSecrets();
                        return [4 /*yield*/, this._query.remove()];
                    case 1:
                        removeResult = _a.sent();
                        error_checker_1.checkError(removeResult);
                        resolve({
                            stats: {
                                removed: removeResult.deleted,
                            },
                            errMsg: msg_1.apiSuccessMsg(apiName),
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        err_3 = _a.sent();
                        reject(error_1.returnAsFinalCloudSDKError(err_3, apiName));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    Query.prototype.count = function (options) {
        var _this = this;
        var apiName = 'collection.count';
        return new Promise(function (resolve, reject) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var queryResult, err_4;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        instance_1.fixInstanceSecrets();
                        return [4 /*yield*/, this._query.count()];
                    case 1:
                        queryResult = _a.sent();
                        error_checker_1.checkError(queryResult);
                        resolve({
                            total: queryResult.total,
                            errMsg: msg_1.apiSuccessMsg(apiName),
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        err_4 = _a.sent();
                        reject(error_1.returnAsFinalCloudSDKError(err_4, apiName));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    return Query;
}());
exports.Query = Query;


/***/ }),

/***/ "./src/api/database/index.ts":
/*!***********************************!*\
  !*** ./src/api/database/index.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var api_1 = __webpack_require__(/*! ./api/api */ "./src/api/database/api/api.ts");
exports.DATABASE_SERVICE_NAME = 'database';
function createDatabaseService(cloud) {
    return {
        name: exports.DATABASE_SERVICE_NAME,
        getAPIs: api_1.getAPIs.bind(null, cloud),
    };
}
function registerService(cloud) {
    cloud.registerService(createDatabaseService(cloud));
}
exports.registerService = registerService;


/***/ }),

/***/ "./src/api/functions/api/api.ts":
/*!**************************************!*\
  !*** ./src/api/functions/api/api.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var callFunction_1 = __webpack_require__(/*! ./callFunction */ "./src/api/functions/api/callFunction.ts");
function getAPIs(cloud) {
    return {
        callFunction: callFunction_1.default(cloud),
    };
}
exports.getAPIs = getAPIs;


/***/ }),

/***/ "./src/api/functions/api/callFunction.ts":
/*!***********************************************!*\
  !*** ./src/api/functions/api/callFunction.ts ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "tslib");
var assert_1 = __webpack_require__(/*! utils/assert */ "./src/utils/assert.ts");
var error_1 = __webpack_require__(/*! utils/error */ "./src/utils/error.ts");
var msg_1 = __webpack_require__(/*! utils/msg */ "./src/utils/msg.ts");
function getCallFunction(cloud) {
    return function callFunction(options) {
        var _this = this;
        var apiName = 'callFunction';
        return new Promise(function (resolve, reject) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var result, parsedResult, e_1, error;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!options) {
                            return [2 /*return*/, reject(error_1.returnAsFinalCloudSDKError({
                                    errMsg: 'Params for callFunction must be an object instead of ' + typeof options,
                                }, apiName))];
                        }
                        try {
                            assert_1.assertType(options, {
                                name: 'string'
                            });
                            if (options.hasOwnProperty('data')) {
                                assert_1.assertType(options, {
                                    data: 'object'
                                });
                            }
                        }
                        catch (e) {
                            return [2 /*return*/, reject(error_1.returnAsFinalCloudSDKError(e, apiName))];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, cloud.provider.api.callFunction({
                                name: options.name,
                                data: options.data || {},
                            }, {
                                env: cloud.translateEnv((options.config && options.config.env) || (cloud.config.env && (cloud.config.env.functions || cloud.config.env.default))),
                            })];
                    case 2:
                        result = _a.sent();
                        parsedResult = result.result;
                        try {
                            if (typeof parsedResult === 'string') {
                                parsedResult = JSON.parse(result.result);
                            }
                        }
                        catch (_) {
                            // no nothing
                        }
                        return [2 /*return*/, resolve({
                                result: parsedResult,
                                errMsg: msg_1.apiSuccessMsg(apiName),
                                requestID: result.requestId,
                            })];
                    case 3:
                        e_1 = _a.sent();
                        error = error_1.returnAsFinalCloudSDKError(e_1, apiName);
                        // @ts-ignore
                        error.requestID = e_1.requestID;
                        return [2 /*return*/, reject(error)];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
    };
}
exports.default = getCallFunction;


/***/ }),

/***/ "./src/api/functions/index.ts":
/*!************************************!*\
  !*** ./src/api/functions/index.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var api_1 = __webpack_require__(/*! ./api/api */ "./src/api/functions/api/api.ts");
exports.FUNCTIONS_SERVICE_NAME = 'functions';
function createFunctionsService(cloud) {
    return {
        name: exports.FUNCTIONS_SERVICE_NAME,
        getAPIs: api_1.getAPIs.bind(null, cloud),
    };
}
function registerService(cloud) {
    cloud.registerService(createFunctionsService(cloud));
}
exports.registerService = registerService;


/***/ }),

/***/ "./src/api/index.ts":
/*!**************************!*\
  !*** ./src/api/index.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var database_1 = __webpack_require__(/*! ./database */ "./src/api/database/index.ts");
var storage_1 = __webpack_require__(/*! ./storage */ "./src/api/storage/index.ts");
var functions_1 = __webpack_require__(/*! ./functions */ "./src/api/functions/index.ts");
var open_1 = __webpack_require__(/*! ./open */ "./src/api/open/index.ts");
var utils_1 = __webpack_require__(/*! ./utils */ "./src/api/utils/index.ts");
var openapi_1 = __webpack_require__(/*! ./openapi */ "./src/api/openapi/index.ts");
function registerServices(cloud) {
    database_1.registerService(cloud);
    storage_1.registerService(cloud);
    functions_1.registerService(cloud);
    open_1.registerService(cloud);
    utils_1.registerService(cloud);
    openapi_1.registerService(cloud);
}
exports.registerServices = registerServices;


/***/ }),

/***/ "./src/api/open/api/api.ts":
/*!*********************************!*\
  !*** ./src/api/open/api/api.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var callOpenAPI_1 = __webpack_require__(/*! ./callOpenAPI */ "./src/api/open/api/callOpenAPI.ts");
var getOpenData_1 = __webpack_require__(/*! ./getOpenData */ "./src/api/open/api/getOpenData.ts");
var getVoIPSign_1 = __webpack_require__(/*! ./getVoIPSign */ "./src/api/open/api/getVoIPSign.ts");
function getAPIs(cloud) {
    return {
        callOpenAPI: callOpenAPI_1.default(cloud),
        getOpenData: getOpenData_1.default(cloud),
        getVoIPSign: getVoIPSign_1.default(cloud),
    };
}
exports.getAPIs = getAPIs;


/***/ }),

/***/ "./src/api/open/api/callOpenAPI.ts":
/*!*****************************************!*\
  !*** ./src/api/open/api/callOpenAPI.ts ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// THIS IS THE LEGACY CALLOPENAPI, TO BE DEPRECATED
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "tslib");
var assert_1 = __webpack_require__(/*! utils/assert */ "./src/utils/assert.ts");
var error_1 = __webpack_require__(/*! utils/error */ "./src/utils/error.ts");
var msg_1 = __webpack_require__(/*! utils/msg */ "./src/utils/msg.ts");
function getCallOpenAPI(cloud) {
    return function callOpenAPI(options) {
        var _this = this;
        var apiName = 'callOpenAPI';
        return new Promise(function (resolve, reject) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var result, parsedResult, e_1, error;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!options) {
                            return [2 /*return*/, reject(error_1.returnAsFinalCloudSDKError({
                                    errMsg: 'Params for callOpenAPI must be an object instead of ' + typeof options,
                                }, apiName))];
                        }
                        try {
                            assert_1.assertType(options, {
                                api: 'string'
                            });
                            if (options.data) {
                                assert_1.assertType(options, {
                                    data: 'object'
                                });
                            }
                        }
                        catch (e) {
                            return [2 /*return*/, reject(error_1.returnAsFinalCloudSDKError(e, apiName))];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, cloud.provider.api.callOpenAPI({
                                api: options.api,
                                data: options.data || {},
                            }, options.config || {})];
                    case 2:
                        result = _a.sent();
                        parsedResult = result.result;
                        try {
                            if (typeof parsedResult === 'string') {
                                parsedResult = JSON.parse(result.result);
                            }
                        }
                        catch (_) {
                            // no nothing
                        }
                        return [2 /*return*/, resolve({
                                result: parsedResult,
                                errMsg: msg_1.apiSuccessMsg(apiName),
                            })];
                    case 3:
                        e_1 = _a.sent();
                        error = error_1.returnAsFinalCloudSDKError(e_1, apiName);
                        return [2 /*return*/, reject(error)];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
    };
}
exports.default = getCallOpenAPI;


/***/ }),

/***/ "./src/api/open/api/getOpenData.ts":
/*!*****************************************!*\
  !*** ./src/api/open/api/getOpenData.ts ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "tslib");
var error_1 = __webpack_require__(/*! utils/error */ "./src/utils/error.ts");
var msg_1 = __webpack_require__(/*! utils/msg */ "./src/utils/msg.ts");
var openapi_1 = __webpack_require__(/*! ../../../protobuf/openapi */ "./src/protobuf/openapi.js");
var error_config_1 = __webpack_require__(/*! config/error.config */ "./src/config/error.config.ts");
var API_NAME = 'getOpenData';
function getGetOpenData(cloud) {
    return function getOpenData(options) {
        var _this = this;
        return new Promise(function (resolve, reject) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var getOpenDataReqBuffer, svrkitData, pbMessage, wxResp, pbRespMsg, openDataList, e_1, error;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!options) {
                            return [2 /*return*/, reject(error_1.returnAsFinalCloudSDKError({
                                    errMsg: 'Params for getOpenData must be an object instead of ' + typeof options,
                                }, API_NAME))];
                        }
                        try {
                            if (!options.list) {
                                throw new Error('list must be provided');
                            }
                        }
                        catch (e) {
                            return [2 /*return*/, reject(error_1.returnAsFinalCloudSDKError(e, API_NAME))];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        getOpenDataReqBuffer = openapi_1.ApiGetOpenDataByCloudIdReq.encode({
                            cloudidList: options.list,
                        }).finish();
                        svrkitData = {
                            apiName: 'ApiGetOpenDataByCloudId',
                            reqData: getOpenDataReqBuffer,
                        };
                        pbMessage = openapi_1.CommApiData.encode({
                            apiType: openapi_1.CommApiData.ApiType.SVRKIT_API,
                            svrkitData: svrkitData,
                        }).finish();
                        return [4 /*yield*/, cloud.provider.api.callWXOpenAPI({
                                api: 'ApiGetOpenDataByCloudId',
                                data: Buffer.from(pbMessage),
                            }, options.config || {})];
                    case 2:
                        wxResp = _a.sent();
                        if (wxResp.svrkitErrorCode !== 0) {
                            throw {
                                errCode: error_config_1.ERR_CODE.WX_SYSTEM_ERROR,
                                errMsg: "internal svrkit error, code " + wxResp.svrkitErrorCode,
                            };
                        }
                        if (!wxResp.respData) {
                            throw {
                                errCode: error_config_1.ERR_CODE.WX_SYSTEM_ERROR,
                                errMsg: "internal svrkit error, empty respData",
                            };
                        }
                        pbRespMsg = openapi_1.ApiGetOpenDataByCloudIdResp.decode(wxResp.respData);
                        openDataList = pbRespMsg.dataList.map(function (item) {
                            if (!item.json) {
                                throw {
                                    errCode: error_config_1.ERR_CODE.WX_SYSTEM_ERROR,
                                    errMsg: "internal svrkit error, empty openData json field for " + item.cloudId,
                                };
                            }
                            return JSON.parse(item.json);
                        });
                        resolve({
                            list: openDataList,
                            errMsg: msg_1.apiSuccessMsg(API_NAME),
                            errCode: 0,
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        error = error_1.returnAsFinalCloudSDKError(e_1, API_NAME);
                        return [2 /*return*/, reject(error)];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
    };
}
exports.default = getGetOpenData;


/***/ }),

/***/ "./src/api/open/api/getVoIPSign.ts":
/*!*****************************************!*\
  !*** ./src/api/open/api/getVoIPSign.ts ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "tslib");
var assert_1 = __webpack_require__(/*! utils/assert */ "./src/utils/assert.ts");
var error_1 = __webpack_require__(/*! utils/error */ "./src/utils/error.ts");
var msg_1 = __webpack_require__(/*! utils/msg */ "./src/utils/msg.ts");
var openapi_1 = __webpack_require__(/*! ../../../protobuf/openapi */ "./src/protobuf/openapi.js");
var error_config_1 = __webpack_require__(/*! config/error.config */ "./src/config/error.config.ts");
var API_NAME = 'getVoIPSign';
function getGetVoIPSign(cloud) {
    return function getVoIPSign(options) {
        var _this = this;
        return new Promise(function (resolve, reject) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var getVoIPSignReqBuffer, svrkitData, pbMessage, wxResp, pbRespMsg, e_1, error;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!options) {
                            return [2 /*return*/, reject(error_1.returnAsFinalCloudSDKError({
                                    errMsg: 'Params for getVoIPSign must be an object instead of ' + typeof options,
                                }, API_NAME))];
                        }
                        try {
                            assert_1.assertType(options, {
                                groupId: 'string',
                                timestamp: 'number',
                                nonce: 'string',
                            });
                        }
                        catch (e) {
                            return [2 /*return*/, reject(error_1.returnAsFinalCloudSDKError(e, API_NAME))];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        getVoIPSignReqBuffer = openapi_1.ApiVoipSignReq.encode({
                            groupId: options.groupId,
                            timestamp: options.timestamp,
                            nonce: options.nonce,
                        }).finish();
                        svrkitData = {
                            apiName: 'ApiVoipSign',
                            reqData: getVoIPSignReqBuffer,
                        };
                        pbMessage = openapi_1.CommApiData.encode({
                            apiType: openapi_1.CommApiData.ApiType.SVRKIT_API,
                            svrkitData: svrkitData,
                        }).finish();
                        return [4 /*yield*/, cloud.provider.api.callWXOpenAPI({
                                api: 'ApiVoipSign',
                                data: Buffer.from(pbMessage),
                            }, options.config || {})];
                    case 2:
                        wxResp = _a.sent();
                        if (wxResp.svrkitErrorCode !== 0) {
                            throw {
                                errCode: error_config_1.ERR_CODE.WX_SYSTEM_ERROR,
                                errMsg: "internal svrkit error, code " + wxResp.svrkitErrorCode,
                            };
                        }
                        if (!wxResp.respData) {
                            throw {
                                errCode: error_config_1.ERR_CODE.WX_SYSTEM_ERROR,
                                errMsg: "internal svrkit error, empty respData",
                            };
                        }
                        pbRespMsg = openapi_1.ApiVoipSignResp.decode(wxResp.respData);
                        resolve({
                            signature: pbRespMsg.signature,
                            errMsg: msg_1.apiSuccessMsg(API_NAME),
                            errCode: 0,
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        error = error_1.returnAsFinalCloudSDKError(e_1, API_NAME);
                        return [2 /*return*/, reject(error)];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
    };
}
exports.default = getGetVoIPSign;


/***/ }),

/***/ "./src/api/open/index.ts":
/*!*******************************!*\
  !*** ./src/api/open/index.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var api_1 = __webpack_require__(/*! ./api/api */ "./src/api/open/api/api.ts");
var OPEN_SERVICE_NAME = 'open';
function createOpenService(cloud) {
    return {
        name: OPEN_SERVICE_NAME,
        getAPIs: api_1.getAPIs.bind(null, cloud),
    };
}
function registerService(cloud) {
    cloud.registerService(createOpenService(cloud));
}
exports.registerService = registerService;


/***/ }),

/***/ "./src/api/openapi/index.ts":
/*!**********************************!*\
  !*** ./src/api/openapi/index.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var namespace_1 = __webpack_require__(/*! ./namespace */ "./src/api/openapi/namespace/index.ts");
exports.OPENAPI_SERVICE_NAME = 'openapi';
exports.OPENAPI_SERVICE_NAMESPACE_NAME = 'openapi';
function createStorageService(cloud) {
    return {
        name: exports.OPENAPI_SERVICE_NAME,
        getNamespace: function () {
            return {
                namespace: exports.OPENAPI_SERVICE_NAMESPACE_NAME,
                apis: namespace_1.getAPIs(cloud),
            };
        },
    };
}
function registerService(cloud) {
    cloud.registerService(createStorageService(cloud));
}
exports.registerService = registerService;


/***/ }),

/***/ "./src/api/openapi/namespace/generic.ts":
/*!**********************************************!*\
  !*** ./src/api/openapi/namespace/generic.ts ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "tslib");
var openapi_1 = __webpack_require__(/*! ../../../protobuf/openapi */ "./src/protobuf/openapi.js");
var type_1 = __webpack_require__(/*! ../../../utils/type */ "./src/utils/type.ts");
var error_1 = __webpack_require__(/*! ../../../utils/error */ "./src/utils/error.ts");
var msg_1 = __webpack_require__(/*! ../../../utils/msg */ "./src/utils/msg.ts");
var utils_1 = __webpack_require__(/*! ../../../utils/utils */ "./src/utils/utils.ts");
var mimetype_1 = __webpack_require__(/*! ../../../utils/mimetype */ "./src/utils/mimetype.ts");
var error_config_1 = __webpack_require__(/*! ../../../config/error.config */ "./src/config/error.config.ts");
var functionIntrinsicProperties = new Set(Object.getOwnPropertyNames(Function.prototype));
var getCallableObject = function (options) {
    var f = function () { };
    return new Proxy(f, {
        get: function (target, prop) {
            if (functionIntrinsicProperties.has(prop)) {
                // @ts-ignore
                return options.callable[prop];
            }
            else {
                return getCallableObject(tslib_1.__assign({}, options, { paths: tslib_1.__spread(options.paths, [prop]) }));
            }
        },
        apply: function (target, thisArg, args) {
            var _a;
            return (_a = options.callable).call.apply(_a, tslib_1.__spread([thisArg, options], args));
        },
    });
};
var getProxyObject = function (options) {
    var o = {};
    return new Proxy(o, {
        get: function (target, prop) {
            return getCallableObject(tslib_1.__assign({}, options, { paths: [prop] }));
        }
    });
};
function getGenericOpenAPI(cloud) {
    var callable = function (innerContext, data) {
        if (cloud.debug) {
            console.log("openapi." + innerContext.paths.join('.') + " called with data:", data);
        }
        var api = innerContext.paths.join('.');
        return callWXOpenAPI({
            api: api,
            data: data,
        });
    };
    return getProxyObject({
        callable: cloud.wrapCommonAPICheck(callable),
        paths: [],
    });
    function callWXOpenAPI(options) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var displayAPIName, data, pairs, key, val, contentType, fileExtension, filename, valStr, pbMessage, wxResp, result, e_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        displayAPIName = "openapi." + options.api;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        data = utils_1.convertCase(options.data, {
                            from: 'camelcase',
                            to: 'snakecase',
                            recursive: true,
                        });
                        pairs = [];
                        for (key in data) {
                            val = data[key];
                            // check whether it is a form-data item
                            if (type_1.isObject(val) && (val.contentType || val.content_type) && val.value && type_1.isBuffer(val.value)) {
                                contentType = (val.contentType || val.content_type).toString();
                                fileExtension = mimetype_1.mimeTypeToFileExtension(contentType);
                                if (!fileExtension) {
                                    console.warn("[" + displayAPIName + "] the input param " + key + ".contentType is not a valid mime type");
                                }
                                filename = val.fileName;
                                if (!filename) {
                                    filename = key + "." + (fileExtension || 'png');
                                }
                                pairs.push({
                                    key: key,
                                    value: val.value,
                                    contentType: contentType,
                                    filename: filename,
                                });
                            }
                            else {
                                valStr = JSON.stringify(val);
                                if (valStr !== undefined) {
                                    pairs.push({
                                        key: key,
                                        value: Buffer.from(valStr),
                                    });
                                }
                            }
                        }
                        pbMessage = openapi_1.CommApiData.encode({
                            apiType: openapi_1.CommApiData.ApiType.OPEN_API,
                            openapiData: {
                                pairs: pairs,
                            },
                        }).finish();
                        return [4 /*yield*/, cloud.provider.api.callWXOpenAPI({
                                api: options.api,
                                data: Buffer.from(pbMessage),
                            }, options.config || {})];
                    case 2:
                        wxResp = _a.sent();
                        result = void 0;
                        if (wxResp) {
                            if (/(application\/json)|(text\/plain)/.test(wxResp.contentType)) {
                                // json response
                                // NOTICE: sometimes the wx sever, for no reason, returns a json with content-type text/plain, and we have to deal with it...
                                try {
                                    result = JSON.parse(wxResp.respData.toString());
                                }
                                catch (parseWXRespJSONError) {
                                    // wx server says it's a json but instead it is not a valid json
                                    // if the content-type is text/plain and is not a valid json, we can safely return the string back
                                    if (/text\/plain/.test(wxResp.contentType)) {
                                        result = {
                                            result: wxResp.respData.toString()
                                        };
                                    }
                                    else {
                                        // internal error
                                        throw new error_1.CloudSDKError({
                                            errCode: error_config_1.ERR_CODE.WX_SYSTEM_ERROR,
                                            errMsg: msg_1.apiFailMsg(displayAPIName, "wechat server internal error, response body is invalid json: " + wxResp.respData.toString())
                                        });
                                    }
                                }
                                if (result.errcode) {
                                    // wx error
                                    throw new error_1.CloudSDKError({
                                        errCode: result.errcode,
                                        errMsg: msg_1.apiFailMsg(displayAPIName, result.errmsg),
                                    });
                                }
                                else {
                                    delete result.errcode;
                                    delete result.errmsg;
                                    // convert snake case to camel case
                                    result = utils_1.convertCase(result, {
                                        from: 'snakecase',
                                        to: 'camelcase',
                                        recursive: true,
                                    });
                                }
                            }
                            else {
                                // buffer response
                                result = {
                                    contentType: wxResp.contentType.trim(),
                                    buffer: wxResp.respData,
                                };
                            }
                        }
                        else {
                            throw {
                                errCode: error_config_1.ERR_CODE.WX_SYSTEM_ERROR,
                                errMsg: "internal server error, empty resp buffer",
                            };
                        }
                        return [2 /*return*/, tslib_1.__assign({}, result, { errMsg: msg_1.apiSuccessMsg(displayAPIName), errCode: 0 })];
                    case 3:
                        e_1 = _a.sent();
                        throw error_1.returnAsFinalCloudSDKError(e_1, displayAPIName);
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
}
exports.default = getGenericOpenAPI;


/***/ }),

/***/ "./src/api/openapi/namespace/index.ts":
/*!********************************************!*\
  !*** ./src/api/openapi/namespace/index.ts ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var generic_1 = __webpack_require__(/*! ./generic */ "./src/api/openapi/namespace/generic.ts");
function getAPIs(cloud) {
    return generic_1.default(cloud);
}
exports.getAPIs = getAPIs;


/***/ }),

/***/ "./src/api/storage/api/api.ts":
/*!************************************!*\
  !*** ./src/api/storage/api/api.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var uploadFile_1 = __webpack_require__(/*! ./uploadFile */ "./src/api/storage/api/uploadFile.ts");
var downloadFile_1 = __webpack_require__(/*! ./downloadFile */ "./src/api/storage/api/downloadFile.ts");
var getTempFileURL_1 = __webpack_require__(/*! ./getTempFileURL */ "./src/api/storage/api/getTempFileURL.ts");
var deleteFile_1 = __webpack_require__(/*! ./deleteFile */ "./src/api/storage/api/deleteFile.ts");
function getAPIs(cloud) {
    return {
        uploadFile: uploadFile_1.default(cloud),
        downloadFile: downloadFile_1.default(cloud),
        getTempFileURL: getTempFileURL_1.default(cloud),
        deleteFile: deleteFile_1.default(cloud),
    };
}
exports.getAPIs = getAPIs;


/***/ }),

/***/ "./src/api/storage/api/deleteFile.ts":
/*!*******************************************!*\
  !*** ./src/api/storage/api/deleteFile.ts ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "tslib");
var assert_1 = __webpack_require__(/*! utils/assert */ "./src/utils/assert.ts");
var error_1 = __webpack_require__(/*! utils/error */ "./src/utils/error.ts");
var msg_1 = __webpack_require__(/*! utils/msg */ "./src/utils/msg.ts");
function getDeleteFile(cloud) {
    return function deleteFile(options) {
        var _this = this;
        var apiName = 'deleteFile';
        return new Promise(function (resolve, reject) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var result, e_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!options) {
                            return [2 /*return*/, reject(error_1.returnAsFinalCloudSDKError({
                                    errMsg: 'Params for deleteFile must be an object instead of ' + typeof options,
                                }, apiName))];
                        }
                        try {
                            assert_1.assertType(options, {
                                fileList: 'array'
                            });
                            options.fileList.forEach(function (f, i) {
                                if (typeof f !== 'string') {
                                    throw new Error("Type of fileList[" + i + "] must be string instead of " + typeof f);
                                }
                            });
                        }
                        catch (e) {
                            return [2 /*return*/, reject(error_1.returnAsFinalCloudSDKError(e, apiName))];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, cloud.provider.api.deleteFile({
                                fileList: options.fileList
                            }, {
                                env: cloud.translateEnv((options.config && options.config.env) || (cloud.config.env && (cloud.config.env.storage || cloud.config.env.default)))
                            })];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, resolve({
                                fileList: result.fileList,
                                errMsg: msg_1.apiSuccessMsg(apiName),
                            })];
                    case 3:
                        e_1 = _a.sent();
                        return [2 /*return*/, reject(error_1.returnAsFinalCloudSDKError(e_1, apiName))];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
    };
}
exports.default = getDeleteFile;


/***/ }),

/***/ "./src/api/storage/api/downloadFile.ts":
/*!*********************************************!*\
  !*** ./src/api/storage/api/downloadFile.ts ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "tslib");
var assert_1 = __webpack_require__(/*! utils/assert */ "./src/utils/assert.ts");
var error_1 = __webpack_require__(/*! utils/error */ "./src/utils/error.ts");
var msg_1 = __webpack_require__(/*! utils/msg */ "./src/utils/msg.ts");
function getDownloadFile(cloud) {
    return function downloadFile(options) {
        var _this = this;
        var apiName = 'downloadFile';
        return new Promise(function (resolve, reject) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var result, e_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!options) {
                            return [2 /*return*/, reject(error_1.returnAsFinalCloudSDKError({
                                    errMsg: 'Params for downloadFile must be an object instead of ' + typeof options,
                                }, apiName))];
                        }
                        try {
                            assert_1.assertType(options, {
                                fileID: 'string',
                            });
                        }
                        catch (e) {
                            return [2 /*return*/, reject(error_1.returnAsFinalCloudSDKError(e, apiName))];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, cloud.provider.api.downloadFile({
                                fileID: options.fileID,
                            }, {
                                env: cloud.translateEnv((options.config && options.config.env) || (cloud.config.env && (cloud.config.env.storage || cloud.config.env.default))),
                            })];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, resolve({
                                fileContent: result.fileContent,
                                statusCode: result.statusCode,
                                errMsg: msg_1.apiSuccessMsg(apiName),
                            })];
                    case 3:
                        e_1 = _a.sent();
                        return [2 /*return*/, reject(error_1.returnAsFinalCloudSDKError(e_1, apiName))];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
    };
}
exports.default = getDownloadFile;


/***/ }),

/***/ "./src/api/storage/api/getTempFileURL.ts":
/*!***********************************************!*\
  !*** ./src/api/storage/api/getTempFileURL.ts ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "tslib");
var assert_1 = __webpack_require__(/*! utils/assert */ "./src/utils/assert.ts");
var error_1 = __webpack_require__(/*! utils/error */ "./src/utils/error.ts");
var msg_1 = __webpack_require__(/*! utils/msg */ "./src/utils/msg.ts");
function getGetTempFileURL(cloud) {
    return function getTempFileURL(options) {
        var _this = this;
        var apiName = 'getTempFileURL';
        return new Promise(function (resolve, reject) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var result, e_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!options) {
                            return [2 /*return*/, reject(error_1.returnAsFinalCloudSDKError({
                                    errMsg: 'Params for getTempFileURL must be an object instead of ' + typeof options,
                                }, apiName))];
                        }
                        try {
                            assert_1.assertType(options, {
                                fileList: 'array',
                            });
                        }
                        catch (e) {
                            return [2 /*return*/, reject(error_1.returnAsFinalCloudSDKError(e, apiName))];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, cloud.provider.api.getTempFileURL({
                                fileList: options.fileList,
                            }, {
                                env: cloud.translateEnv((options.config && options.config.env) || (cloud.config.env && (cloud.config.env.storage || cloud.config.env.default))),
                            })];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, resolve({
                                fileList: result.fileList,
                                errMsg: msg_1.apiSuccessMsg(apiName),
                            })];
                    case 3:
                        e_1 = _a.sent();
                        return [2 /*return*/, reject(error_1.returnAsFinalCloudSDKError(e_1, apiName))];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
    };
}
exports.default = getGetTempFileURL;


/***/ }),

/***/ "./src/api/storage/api/uploadFile.ts":
/*!*******************************************!*\
  !*** ./src/api/storage/api/uploadFile.ts ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "tslib");
var assert_1 = __webpack_require__(/*! utils/assert */ "./src/utils/assert.ts");
var error_1 = __webpack_require__(/*! utils/error */ "./src/utils/error.ts");
var msg_1 = __webpack_require__(/*! utils/msg */ "./src/utils/msg.ts");
function getUploadFile(cloud) {
    return function uploadFile(options) {
        var _this = this;
        var apiName = 'uploadFile';
        return new Promise(function (resolve, reject) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var header, result, e_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!options) {
                            return [2 /*return*/, reject(error_1.returnAsFinalCloudSDKError({
                                    errMsg: 'Params for uploadFile must be an object instead of ' + typeof options,
                                }, apiName))];
                        }
                        try {
                            assert_1.assertType(options, {
                                cloudPath: 'string',
                            });
                            if (!options.fileContent) {
                                return [2 /*return*/, reject(error_1.returnAsFinalCloudSDKError(new Error('Type of fileContent must be fs.ReadStream instead of ' + typeof options.fileContent), apiName))];
                            }
                        }
                        catch (e) {
                            return [2 /*return*/, reject(error_1.returnAsFinalCloudSDKError(e, apiName))];
                        }
                        header = options.header || {};
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, cloud.provider.api.uploadFile({
                                fileContent: options.fileContent,
                                cloudPath: options.cloudPath,
                                header: header,
                            }, {
                                env: cloud.translateEnv((options.config && options.config.env) || (cloud.config.env && (cloud.config.env.storage || cloud.config.env.default))),
                            })];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, resolve({
                                fileID: result.fileID,
                                statusCode: result.statusCode,
                                errMsg: msg_1.apiSuccessMsg(apiName),
                            })];
                    case 3:
                        e_1 = _a.sent();
                        return [2 /*return*/, reject(error_1.returnAsFinalCloudSDKError(e_1, apiName))];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
    };
}
exports.default = getUploadFile;


/***/ }),

/***/ "./src/api/storage/index.ts":
/*!**********************************!*\
  !*** ./src/api/storage/index.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var api_1 = __webpack_require__(/*! ./api/api */ "./src/api/storage/api/api.ts");
exports.STORAGE_SERVICE_NAME = 'storage';
function createStorageService(cloud) {
    return {
        name: exports.STORAGE_SERVICE_NAME,
        getAPIs: api_1.getAPIs.bind(null, cloud),
    };
}
function registerService(cloud) {
    cloud.registerService(createStorageService(cloud));
}
exports.registerService = registerService;


/***/ }),

/***/ "./src/api/utils/api/api.ts":
/*!**********************************!*\
  !*** ./src/api/utils/api/api.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var getWXContext_1 = __webpack_require__(/*! ./getWXContext */ "./src/api/utils/api/getWXContext.ts");
function getAPIs() {
    return {
        getWXContext: getWXContext_1.default,
    };
}
exports.getAPIs = getAPIs;


/***/ }),

/***/ "./src/api/utils/api/getWXContext.ts":
/*!*******************************************!*\
  !*** ./src/api/utils/api/getWXContext.ts ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "tslib");
var error_1 = __webpack_require__(/*! utils/error */ "./src/utils/error.ts");
var WX_PREFIX = 'WX_';
var CONTEXT_KEYS_BLACKLIST = [
    'API_TOKEN',
];
function isContextKeyInBlacklist(key) {
    return CONTEXT_KEYS_BLACKLIST.some(function (v) { return v === key || (WX_PREFIX + v) === key; });
}
exports.isContextKeyInBlacklist = isContextKeyInBlacklist;
function isNumber(val) {
    return /^[-]?\d+$/.test(val);
}
exports.isNumber = isNumber;
function getWXContext() {
    var e_1, _a;
    var apiName = 'getWXContext';
    var wxContext = {};
    if (!process.env.WX_CONTEXT_KEYS)
        return wxContext;
    try {
        var contextKeys = process.env.WX_CONTEXT_KEYS.split(',');
        try {
            for (var contextKeys_1 = tslib_1.__values(contextKeys), contextKeys_1_1 = contextKeys_1.next(); !contextKeys_1_1.done; contextKeys_1_1 = contextKeys_1.next()) {
                var key = contextKeys_1_1.value;
                if (!key)
                    continue;
                if (isContextKeyInBlacklist(key))
                    continue;
                var val = process.env[key];
                if (val === undefined)
                    continue;
                if (isNumber(val)) {
                    val = parseInt(val);
                }
                if (key.startsWith(WX_PREFIX) && key.length > 3) {
                    wxContext[key.slice(3)] = val;
                }
                else {
                    wxContext[key] = val;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (contextKeys_1_1 && !contextKeys_1_1.done && (_a = contextKeys_1.return)) _a.call(contextKeys_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        wxContext.ENV = process.env.TCB_ENV;
        if (process.env.TCB_SOURCE) {
            wxContext.SOURCE = process.env.TCB_SOURCE;
        }
        return wxContext;
    }
    catch (e) {
        var error = error_1.returnAsFinalCloudSDKError(e, apiName);
        throw error;
    }
}
exports.default = getWXContext;


/***/ }),

/***/ "./src/api/utils/index.ts":
/*!********************************!*\
  !*** ./src/api/utils/index.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var api_1 = __webpack_require__(/*! ./api/api */ "./src/api/utils/api/api.ts");
var UTILS_SERVICE_NAME = 'utils';
function createUtilsService() {
    return {
        name: UTILS_SERVICE_NAME,
        getAPIs: api_1.getAPIs,
        initRequired: false,
    };
}
function registerService(cloud) {
    cloud.registerService(createUtilsService());
}
exports.registerService = registerService;


/***/ }),

/***/ "./src/config/error.config.ts":
/*!************************************!*\
  !*** ./src/config/error.config.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ERR_CODE = {
    '-1': 'unknown error',
    UNKNOWN_ERROR: -1,
    // 以 6 开始的是由微信服务器侧产生的错误码
    // 以 5 开始的是由腾讯云侧产生的错误码
    // 以 4 开始的是本地 SDK 产生的错误
    // 接下来两位表示具体业务类型：01通用，02数据库，03文件，04云函数
    // 最后三位表示具体的错误
    // 小程序 SDK 云函数
    '-404001': 'empty call result',
    SDK_FUNCTIONS_EMPTY_CALL_RESULT: -404001,
    '-404002': 'empty event id',
    SDK_FUNCTIONS_EMPTY_EVENT_ID: -404002,
    '-404003': 'empty poll url',
    SDK_FUNCTIONS_EMPTY_POLL_URL: -404003,
    '-404004': 'empty poll result json',
    SDK_FUNCTIONS_EMPTY_POLL_RESULT_JSON: -404004,
    '-404005': 'exceed max poll retry',
    SDK_FUNCTIONS_EXCEED_MAX_POLL_RETRY: -404005,
    '-404006': 'empty poll result base resp',
    SDK_FUNCTIONS_EMPTY_POLL_RESULT_BASE_RESP: -404006,
    '-404007': 'error while polling for the result, poll result base resp ret %s',
    SDK_FUNCTIONS_POLL_RESULT_BASE_RESP_RET_ABNORMAL: -404007,
    '-404008': 'error while polling for the result, polling server return a status code of %s',
    SDK_FUNCTIONS_POLL_RESULT_STATUS_CODE_ERROR: -404008,
    '-404009': 'error while polling for the result: %s',
    SDK_FUNCTIONS_POLL_ERROR: -404009,
    // 微信服务器
    '-601001': 'system error',
    WX_SYSTEM_ERROR: -601001,
    '-601002': 'system args error',
    WX_SYSTEM_ARGS_ERROR: -601002,
    '-601003': 'system network error',
    WX_SYSTEM_NETWORK_ERROR: -601003,
    '-604100': 'API not found',
    WX_FUNCTIONS_SERVER_OPENAPI_NOT_FOUND: -604100,
    '-604101': 'function has no permission to call this API',
    WX_FUNCTIONS_SERVER_OPENAPI_NO_PERMISSION: -604101,
    '-604102': 'call open API timeout',
    WX_FUNCTIONS_SERVER_OPENAPI_TIMEOUT: -604102,
    '-604103': 'call open API system error',
    WX_FUNCTIONS_SERVER_OPENAPI_SYSTEM_ERROR: -604102,
    // 腾讯云通用
    '-501001': 'resource system error',
    TCB_RESOURCE_SYSTEM_ERROR: -501001,
    '-501002': 'resource server timeout',
    TCB_RESOURCE_SERVER_TIMEOUT: -501002,
    '-501003': 'exceed request limit',
    TCB_EXCEED_REQUEST_LIMIT: -501003,
    '-501004': 'exceed concurrent request limit',
    TCB_EXCEED_CONCURRENT_REQUEST_LIMIT: -501004,
    '-501005': 'invalid env',
    TCB_INVALID_ENV: -501005,
    '-501006': 'invalid common parameters',
    TCB_INVALID_COMMON_PARAM: -501006,
    '-501007': 'invalid parameters',
    TCB_INVALID_PARAM: -501007,
    '-501008': 'invalid request source',
    TCB_INVALID_REQUEST_SOURCE: -501008,
    '-501009': 'resource not initialized',
    TCB_RESOURCE_NOT_INITIALIZED: -501009,
    // 腾讯云数据库
    '-502001': 'database request fail',
    TCB_DB_REQUEST_FAIL: -502001,
    '-502002': 'database invalid command',
    TCB_DB_INVALID_COMMAND: -502002,
    '-502003': 'database permission denied',
    TCB_DB_PERMISSION_DENIED: -502003,
    '-502004': 'database exceed collection limit',
    TCB_DB_EXCEED_COLLECTION_LIMIT: -502004,
    '-502005': 'database collection not exists',
    TCB_DB_COLLECTION_NOT_EXISTS: -502005,
    // 腾讯云文件管理
    '-503001': 'storage request fail',
    TCB_STORAGE_REQUEST_FAIL: -503001,
    '-503002': 'storage permission denied',
    TCB_STORAGE_PERMISSION_DENIED: -503002,
    '-503003': 'storage file not exists',
    TCB_STORAGE_FILE_NOT_EXISTS: -503003,
    '-503004': 'storage invalid sign parameter',
    TCB_STORAGE_INVALID_SIGN_PARAM: -503004,
    // 腾讯云云函数
    '-504001': 'functions request fail',
    TCB_FUNCTIONS_REQUEST_FAIL: -504001,
    '-504002': 'functions execute fail',
    TCB_FUNCTIONS_EXEC_FAIL: -504002,
};


/***/ }),

/***/ "./src/config/symbol.config.ts":
/*!*************************************!*\
  !*** ./src/config/symbol.config.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.SYMBOL_DYNAMIC_CURRENT_ENV = Symbol.for('DYNAMIC_CURRENT_ENV');


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var cloud_1 = __webpack_require__(/*! ./api/cloud */ "./src/api/cloud/index.ts");
module.exports = cloud_1.default.exportAPI;


/***/ }),

/***/ "./src/protobuf/openapi.js":
/*!*********************************!*\
  !*** ./src/protobuf/openapi.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/


var $protobuf = __webpack_require__(/*! protobufjs/minimal */ "protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.KeyValuePair = (function() {

    /**
     * Properties of a KeyValuePair.
     * @exports IKeyValuePair
     * @interface IKeyValuePair
     * @property {string|null} [key] KeyValuePair key
     * @property {Uint8Array|null} [value] KeyValuePair value
     * @property {string|null} [contenttype] KeyValuePair contenttype
     * @property {string|null} [filename] KeyValuePair filename
     */

    /**
     * Constructs a new KeyValuePair.
     * @exports KeyValuePair
     * @classdesc Represents a KeyValuePair.
     * @implements IKeyValuePair
     * @constructor
     * @param {IKeyValuePair=} [properties] Properties to set
     */
    function KeyValuePair(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * KeyValuePair key.
     * @member {string} key
     * @memberof KeyValuePair
     * @instance
     */
    KeyValuePair.prototype.key = "";

    /**
     * KeyValuePair value.
     * @member {Uint8Array} value
     * @memberof KeyValuePair
     * @instance
     */
    KeyValuePair.prototype.value = $util.newBuffer([]);

    /**
     * KeyValuePair contenttype.
     * @member {string} contenttype
     * @memberof KeyValuePair
     * @instance
     */
    KeyValuePair.prototype.contenttype = "";

    /**
     * KeyValuePair filename.
     * @member {string} filename
     * @memberof KeyValuePair
     * @instance
     */
    KeyValuePair.prototype.filename = "";

    /**
     * Creates a new KeyValuePair instance using the specified properties.
     * @function create
     * @memberof KeyValuePair
     * @static
     * @param {IKeyValuePair=} [properties] Properties to set
     * @returns {KeyValuePair} KeyValuePair instance
     */
    KeyValuePair.create = function create(properties) {
        return new KeyValuePair(properties);
    };

    /**
     * Encodes the specified KeyValuePair message. Does not implicitly {@link KeyValuePair.verify|verify} messages.
     * @function encode
     * @memberof KeyValuePair
     * @static
     * @param {IKeyValuePair} message KeyValuePair message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    KeyValuePair.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.key != null && message.hasOwnProperty("key"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.key);
        if (message.value != null && message.hasOwnProperty("value"))
            writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.value);
        if (message.contenttype != null && message.hasOwnProperty("contenttype"))
            writer.uint32(/* id 3, wireType 2 =*/26).string(message.contenttype);
        if (message.filename != null && message.hasOwnProperty("filename"))
            writer.uint32(/* id 4, wireType 2 =*/34).string(message.filename);
        return writer;
    };

    /**
     * Encodes the specified KeyValuePair message, length delimited. Does not implicitly {@link KeyValuePair.verify|verify} messages.
     * @function encodeDelimited
     * @memberof KeyValuePair
     * @static
     * @param {IKeyValuePair} message KeyValuePair message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    KeyValuePair.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a KeyValuePair message from the specified reader or buffer.
     * @function decode
     * @memberof KeyValuePair
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {KeyValuePair} KeyValuePair
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    KeyValuePair.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.KeyValuePair();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.key = reader.string();
                break;
            case 2:
                message.value = reader.bytes();
                break;
            case 3:
                message.contenttype = reader.string();
                break;
            case 4:
                message.filename = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a KeyValuePair message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof KeyValuePair
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {KeyValuePair} KeyValuePair
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    KeyValuePair.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a KeyValuePair message.
     * @function verify
     * @memberof KeyValuePair
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    KeyValuePair.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.key != null && message.hasOwnProperty("key"))
            if (!$util.isString(message.key))
                return "key: string expected";
        if (message.value != null && message.hasOwnProperty("value"))
            if (!(message.value && typeof message.value.length === "number" || $util.isString(message.value)))
                return "value: buffer expected";
        if (message.contenttype != null && message.hasOwnProperty("contenttype"))
            if (!$util.isString(message.contenttype))
                return "contenttype: string expected";
        if (message.filename != null && message.hasOwnProperty("filename"))
            if (!$util.isString(message.filename))
                return "filename: string expected";
        return null;
    };

    /**
     * Creates a KeyValuePair message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof KeyValuePair
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {KeyValuePair} KeyValuePair
     */
    KeyValuePair.fromObject = function fromObject(object) {
        if (object instanceof $root.KeyValuePair)
            return object;
        var message = new $root.KeyValuePair();
        if (object.key != null)
            message.key = String(object.key);
        if (object.value != null)
            if (typeof object.value === "string")
                $util.base64.decode(object.value, message.value = $util.newBuffer($util.base64.length(object.value)), 0);
            else if (object.value.length)
                message.value = object.value;
        if (object.contenttype != null)
            message.contenttype = String(object.contenttype);
        if (object.filename != null)
            message.filename = String(object.filename);
        return message;
    };

    /**
     * Creates a plain object from a KeyValuePair message. Also converts values to other types if specified.
     * @function toObject
     * @memberof KeyValuePair
     * @static
     * @param {KeyValuePair} message KeyValuePair
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    KeyValuePair.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.key = "";
            if (options.bytes === String)
                object.value = "";
            else {
                object.value = [];
                if (options.bytes !== Array)
                    object.value = $util.newBuffer(object.value);
            }
            object.contenttype = "";
            object.filename = "";
        }
        if (message.key != null && message.hasOwnProperty("key"))
            object.key = message.key;
        if (message.value != null && message.hasOwnProperty("value"))
            object.value = options.bytes === String ? $util.base64.encode(message.value, 0, message.value.length) : options.bytes === Array ? Array.prototype.slice.call(message.value) : message.value;
        if (message.contenttype != null && message.hasOwnProperty("contenttype"))
            object.contenttype = message.contenttype;
        if (message.filename != null && message.hasOwnProperty("filename"))
            object.filename = message.filename;
        return object;
    };

    /**
     * Converts this KeyValuePair to JSON.
     * @function toJSON
     * @memberof KeyValuePair
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    KeyValuePair.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return KeyValuePair;
})();

$root.OpenApiData = (function() {

    /**
     * Properties of an OpenApiData.
     * @exports IOpenApiData
     * @interface IOpenApiData
     * @property {Array.<IKeyValuePair>|null} [pairs] OpenApiData pairs
     */

    /**
     * Constructs a new OpenApiData.
     * @exports OpenApiData
     * @classdesc Represents an OpenApiData.
     * @implements IOpenApiData
     * @constructor
     * @param {IOpenApiData=} [properties] Properties to set
     */
    function OpenApiData(properties) {
        this.pairs = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * OpenApiData pairs.
     * @member {Array.<IKeyValuePair>} pairs
     * @memberof OpenApiData
     * @instance
     */
    OpenApiData.prototype.pairs = $util.emptyArray;

    /**
     * Creates a new OpenApiData instance using the specified properties.
     * @function create
     * @memberof OpenApiData
     * @static
     * @param {IOpenApiData=} [properties] Properties to set
     * @returns {OpenApiData} OpenApiData instance
     */
    OpenApiData.create = function create(properties) {
        return new OpenApiData(properties);
    };

    /**
     * Encodes the specified OpenApiData message. Does not implicitly {@link OpenApiData.verify|verify} messages.
     * @function encode
     * @memberof OpenApiData
     * @static
     * @param {IOpenApiData} message OpenApiData message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    OpenApiData.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.pairs != null && message.pairs.length)
            for (var i = 0; i < message.pairs.length; ++i)
                $root.KeyValuePair.encode(message.pairs[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified OpenApiData message, length delimited. Does not implicitly {@link OpenApiData.verify|verify} messages.
     * @function encodeDelimited
     * @memberof OpenApiData
     * @static
     * @param {IOpenApiData} message OpenApiData message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    OpenApiData.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an OpenApiData message from the specified reader or buffer.
     * @function decode
     * @memberof OpenApiData
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {OpenApiData} OpenApiData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    OpenApiData.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.OpenApiData();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                if (!(message.pairs && message.pairs.length))
                    message.pairs = [];
                message.pairs.push($root.KeyValuePair.decode(reader, reader.uint32()));
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes an OpenApiData message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof OpenApiData
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {OpenApiData} OpenApiData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    OpenApiData.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an OpenApiData message.
     * @function verify
     * @memberof OpenApiData
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    OpenApiData.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.pairs != null && message.hasOwnProperty("pairs")) {
            if (!Array.isArray(message.pairs))
                return "pairs: array expected";
            for (var i = 0; i < message.pairs.length; ++i) {
                var error = $root.KeyValuePair.verify(message.pairs[i]);
                if (error)
                    return "pairs." + error;
            }
        }
        return null;
    };

    /**
     * Creates an OpenApiData message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof OpenApiData
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {OpenApiData} OpenApiData
     */
    OpenApiData.fromObject = function fromObject(object) {
        if (object instanceof $root.OpenApiData)
            return object;
        var message = new $root.OpenApiData();
        if (object.pairs) {
            if (!Array.isArray(object.pairs))
                throw TypeError(".OpenApiData.pairs: array expected");
            message.pairs = [];
            for (var i = 0; i < object.pairs.length; ++i) {
                if (typeof object.pairs[i] !== "object")
                    throw TypeError(".OpenApiData.pairs: object expected");
                message.pairs[i] = $root.KeyValuePair.fromObject(object.pairs[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from an OpenApiData message. Also converts values to other types if specified.
     * @function toObject
     * @memberof OpenApiData
     * @static
     * @param {OpenApiData} message OpenApiData
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    OpenApiData.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.pairs = [];
        if (message.pairs && message.pairs.length) {
            object.pairs = [];
            for (var j = 0; j < message.pairs.length; ++j)
                object.pairs[j] = $root.KeyValuePair.toObject(message.pairs[j], options);
        }
        return object;
    };

    /**
     * Converts this OpenApiData to JSON.
     * @function toJSON
     * @memberof OpenApiData
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    OpenApiData.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return OpenApiData;
})();

$root.CommApiData = (function() {

    /**
     * Properties of a CommApiData.
     * @exports ICommApiData
     * @interface ICommApiData
     * @property {CommApiData.ApiType|null} [apiType] CommApiData apiType
     * @property {IOpenApiData|null} [openapiData] CommApiData openapiData
     * @property {IInnerApiData|null} [innerData] CommApiData innerData
     * @property {ISvrkitApiData|null} [svrkitData] CommApiData svrkitData
     */

    /**
     * Constructs a new CommApiData.
     * @exports CommApiData
     * @classdesc Represents a CommApiData.
     * @implements ICommApiData
     * @constructor
     * @param {ICommApiData=} [properties] Properties to set
     */
    function CommApiData(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * CommApiData apiType.
     * @member {CommApiData.ApiType} apiType
     * @memberof CommApiData
     * @instance
     */
    CommApiData.prototype.apiType = 0;

    /**
     * CommApiData openapiData.
     * @member {IOpenApiData|null|undefined} openapiData
     * @memberof CommApiData
     * @instance
     */
    CommApiData.prototype.openapiData = null;

    /**
     * CommApiData innerData.
     * @member {IInnerApiData|null|undefined} innerData
     * @memberof CommApiData
     * @instance
     */
    CommApiData.prototype.innerData = null;

    /**
     * CommApiData svrkitData.
     * @member {ISvrkitApiData|null|undefined} svrkitData
     * @memberof CommApiData
     * @instance
     */
    CommApiData.prototype.svrkitData = null;

    /**
     * Creates a new CommApiData instance using the specified properties.
     * @function create
     * @memberof CommApiData
     * @static
     * @param {ICommApiData=} [properties] Properties to set
     * @returns {CommApiData} CommApiData instance
     */
    CommApiData.create = function create(properties) {
        return new CommApiData(properties);
    };

    /**
     * Encodes the specified CommApiData message. Does not implicitly {@link CommApiData.verify|verify} messages.
     * @function encode
     * @memberof CommApiData
     * @static
     * @param {ICommApiData} message CommApiData message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CommApiData.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.apiType != null && message.hasOwnProperty("apiType"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.apiType);
        if (message.openapiData != null && message.hasOwnProperty("openapiData"))
            $root.OpenApiData.encode(message.openapiData, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        if (message.innerData != null && message.hasOwnProperty("innerData"))
            $root.InnerApiData.encode(message.innerData, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
        if (message.svrkitData != null && message.hasOwnProperty("svrkitData"))
            $root.SvrkitApiData.encode(message.svrkitData, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified CommApiData message, length delimited. Does not implicitly {@link CommApiData.verify|verify} messages.
     * @function encodeDelimited
     * @memberof CommApiData
     * @static
     * @param {ICommApiData} message CommApiData message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CommApiData.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a CommApiData message from the specified reader or buffer.
     * @function decode
     * @memberof CommApiData
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {CommApiData} CommApiData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CommApiData.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.CommApiData();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.apiType = reader.int32();
                break;
            case 2:
                message.openapiData = $root.OpenApiData.decode(reader, reader.uint32());
                break;
            case 3:
                message.innerData = $root.InnerApiData.decode(reader, reader.uint32());
                break;
            case 4:
                message.svrkitData = $root.SvrkitApiData.decode(reader, reader.uint32());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a CommApiData message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof CommApiData
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {CommApiData} CommApiData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CommApiData.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a CommApiData message.
     * @function verify
     * @memberof CommApiData
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    CommApiData.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.apiType != null && message.hasOwnProperty("apiType"))
            switch (message.apiType) {
            default:
                return "apiType: enum value expected";
            case 0:
            case 1:
            case 2:
                break;
            }
        if (message.openapiData != null && message.hasOwnProperty("openapiData")) {
            var error = $root.OpenApiData.verify(message.openapiData);
            if (error)
                return "openapiData." + error;
        }
        if (message.innerData != null && message.hasOwnProperty("innerData")) {
            var error = $root.InnerApiData.verify(message.innerData);
            if (error)
                return "innerData." + error;
        }
        if (message.svrkitData != null && message.hasOwnProperty("svrkitData")) {
            var error = $root.SvrkitApiData.verify(message.svrkitData);
            if (error)
                return "svrkitData." + error;
        }
        return null;
    };

    /**
     * Creates a CommApiData message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof CommApiData
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {CommApiData} CommApiData
     */
    CommApiData.fromObject = function fromObject(object) {
        if (object instanceof $root.CommApiData)
            return object;
        var message = new $root.CommApiData();
        switch (object.apiType) {
        case "OPEN_API":
        case 0:
            message.apiType = 0;
            break;
        case "INNER_API":
        case 1:
            message.apiType = 1;
            break;
        case "SVRKIT_API":
        case 2:
            message.apiType = 2;
            break;
        }
        if (object.openapiData != null) {
            if (typeof object.openapiData !== "object")
                throw TypeError(".CommApiData.openapiData: object expected");
            message.openapiData = $root.OpenApiData.fromObject(object.openapiData);
        }
        if (object.innerData != null) {
            if (typeof object.innerData !== "object")
                throw TypeError(".CommApiData.innerData: object expected");
            message.innerData = $root.InnerApiData.fromObject(object.innerData);
        }
        if (object.svrkitData != null) {
            if (typeof object.svrkitData !== "object")
                throw TypeError(".CommApiData.svrkitData: object expected");
            message.svrkitData = $root.SvrkitApiData.fromObject(object.svrkitData);
        }
        return message;
    };

    /**
     * Creates a plain object from a CommApiData message. Also converts values to other types if specified.
     * @function toObject
     * @memberof CommApiData
     * @static
     * @param {CommApiData} message CommApiData
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    CommApiData.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.apiType = options.enums === String ? "OPEN_API" : 0;
            object.openapiData = null;
            object.innerData = null;
            object.svrkitData = null;
        }
        if (message.apiType != null && message.hasOwnProperty("apiType"))
            object.apiType = options.enums === String ? $root.CommApiData.ApiType[message.apiType] : message.apiType;
        if (message.openapiData != null && message.hasOwnProperty("openapiData"))
            object.openapiData = $root.OpenApiData.toObject(message.openapiData, options);
        if (message.innerData != null && message.hasOwnProperty("innerData"))
            object.innerData = $root.InnerApiData.toObject(message.innerData, options);
        if (message.svrkitData != null && message.hasOwnProperty("svrkitData"))
            object.svrkitData = $root.SvrkitApiData.toObject(message.svrkitData, options);
        return object;
    };

    /**
     * Converts this CommApiData to JSON.
     * @function toJSON
     * @memberof CommApiData
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    CommApiData.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * ApiType enum.
     * @name CommApiData.ApiType
     * @enum {string}
     * @property {number} OPEN_API=0 OPEN_API value
     * @property {number} INNER_API=1 INNER_API value
     * @property {number} SVRKIT_API=2 SVRKIT_API value
     */
    CommApiData.ApiType = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "OPEN_API"] = 0;
        values[valuesById[1] = "INNER_API"] = 1;
        values[valuesById[2] = "SVRKIT_API"] = 2;
        return values;
    })();

    return CommApiData;
})();

$root.CommOpenApiResp = (function() {

    /**
     * Properties of a CommOpenApiResp.
     * @exports ICommOpenApiResp
     * @interface ICommOpenApiResp
     * @property {Uint8Array|null} [respData] CommOpenApiResp respData
     * @property {string|null} [contentType] CommOpenApiResp contentType
     * @property {number|null} [errorCode] CommOpenApiResp errorCode
     * @property {number|null} [httpCode] CommOpenApiResp httpCode
     * @property {Array.<IHttpHeader>|null} [headers] CommOpenApiResp headers
     * @property {number|null} [svrkitErrorCode] CommOpenApiResp svrkitErrorCode
     */

    /**
     * Constructs a new CommOpenApiResp.
     * @exports CommOpenApiResp
     * @classdesc Represents a CommOpenApiResp.
     * @implements ICommOpenApiResp
     * @constructor
     * @param {ICommOpenApiResp=} [properties] Properties to set
     */
    function CommOpenApiResp(properties) {
        this.headers = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * CommOpenApiResp respData.
     * @member {Uint8Array} respData
     * @memberof CommOpenApiResp
     * @instance
     */
    CommOpenApiResp.prototype.respData = $util.newBuffer([]);

    /**
     * CommOpenApiResp contentType.
     * @member {string} contentType
     * @memberof CommOpenApiResp
     * @instance
     */
    CommOpenApiResp.prototype.contentType = "";

    /**
     * CommOpenApiResp errorCode.
     * @member {number} errorCode
     * @memberof CommOpenApiResp
     * @instance
     */
    CommOpenApiResp.prototype.errorCode = 0;

    /**
     * CommOpenApiResp httpCode.
     * @member {number} httpCode
     * @memberof CommOpenApiResp
     * @instance
     */
    CommOpenApiResp.prototype.httpCode = 0;

    /**
     * CommOpenApiResp headers.
     * @member {Array.<IHttpHeader>} headers
     * @memberof CommOpenApiResp
     * @instance
     */
    CommOpenApiResp.prototype.headers = $util.emptyArray;

    /**
     * CommOpenApiResp svrkitErrorCode.
     * @member {number} svrkitErrorCode
     * @memberof CommOpenApiResp
     * @instance
     */
    CommOpenApiResp.prototype.svrkitErrorCode = 0;

    /**
     * Creates a new CommOpenApiResp instance using the specified properties.
     * @function create
     * @memberof CommOpenApiResp
     * @static
     * @param {ICommOpenApiResp=} [properties] Properties to set
     * @returns {CommOpenApiResp} CommOpenApiResp instance
     */
    CommOpenApiResp.create = function create(properties) {
        return new CommOpenApiResp(properties);
    };

    /**
     * Encodes the specified CommOpenApiResp message. Does not implicitly {@link CommOpenApiResp.verify|verify} messages.
     * @function encode
     * @memberof CommOpenApiResp
     * @static
     * @param {ICommOpenApiResp} message CommOpenApiResp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CommOpenApiResp.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.respData != null && message.hasOwnProperty("respData"))
            writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.respData);
        if (message.contentType != null && message.hasOwnProperty("contentType"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.contentType);
        if (message.errorCode != null && message.hasOwnProperty("errorCode"))
            writer.uint32(/* id 3, wireType 0 =*/24).int32(message.errorCode);
        if (message.httpCode != null && message.hasOwnProperty("httpCode"))
            writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.httpCode);
        if (message.headers != null && message.headers.length)
            for (var i = 0; i < message.headers.length; ++i)
                $root.HttpHeader.encode(message.headers[i], writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
        if (message.svrkitErrorCode != null && message.hasOwnProperty("svrkitErrorCode"))
            writer.uint32(/* id 6, wireType 0 =*/48).int32(message.svrkitErrorCode);
        return writer;
    };

    /**
     * Encodes the specified CommOpenApiResp message, length delimited. Does not implicitly {@link CommOpenApiResp.verify|verify} messages.
     * @function encodeDelimited
     * @memberof CommOpenApiResp
     * @static
     * @param {ICommOpenApiResp} message CommOpenApiResp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CommOpenApiResp.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a CommOpenApiResp message from the specified reader or buffer.
     * @function decode
     * @memberof CommOpenApiResp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {CommOpenApiResp} CommOpenApiResp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CommOpenApiResp.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.CommOpenApiResp();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.respData = reader.bytes();
                break;
            case 2:
                message.contentType = reader.string();
                break;
            case 3:
                message.errorCode = reader.int32();
                break;
            case 4:
                message.httpCode = reader.uint32();
                break;
            case 5:
                if (!(message.headers && message.headers.length))
                    message.headers = [];
                message.headers.push($root.HttpHeader.decode(reader, reader.uint32()));
                break;
            case 6:
                message.svrkitErrorCode = reader.int32();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a CommOpenApiResp message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof CommOpenApiResp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {CommOpenApiResp} CommOpenApiResp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CommOpenApiResp.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a CommOpenApiResp message.
     * @function verify
     * @memberof CommOpenApiResp
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    CommOpenApiResp.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.respData != null && message.hasOwnProperty("respData"))
            if (!(message.respData && typeof message.respData.length === "number" || $util.isString(message.respData)))
                return "respData: buffer expected";
        if (message.contentType != null && message.hasOwnProperty("contentType"))
            if (!$util.isString(message.contentType))
                return "contentType: string expected";
        if (message.errorCode != null && message.hasOwnProperty("errorCode"))
            if (!$util.isInteger(message.errorCode))
                return "errorCode: integer expected";
        if (message.httpCode != null && message.hasOwnProperty("httpCode"))
            if (!$util.isInteger(message.httpCode))
                return "httpCode: integer expected";
        if (message.headers != null && message.hasOwnProperty("headers")) {
            if (!Array.isArray(message.headers))
                return "headers: array expected";
            for (var i = 0; i < message.headers.length; ++i) {
                var error = $root.HttpHeader.verify(message.headers[i]);
                if (error)
                    return "headers." + error;
            }
        }
        if (message.svrkitErrorCode != null && message.hasOwnProperty("svrkitErrorCode"))
            if (!$util.isInteger(message.svrkitErrorCode))
                return "svrkitErrorCode: integer expected";
        return null;
    };

    /**
     * Creates a CommOpenApiResp message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof CommOpenApiResp
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {CommOpenApiResp} CommOpenApiResp
     */
    CommOpenApiResp.fromObject = function fromObject(object) {
        if (object instanceof $root.CommOpenApiResp)
            return object;
        var message = new $root.CommOpenApiResp();
        if (object.respData != null)
            if (typeof object.respData === "string")
                $util.base64.decode(object.respData, message.respData = $util.newBuffer($util.base64.length(object.respData)), 0);
            else if (object.respData.length)
                message.respData = object.respData;
        if (object.contentType != null)
            message.contentType = String(object.contentType);
        if (object.errorCode != null)
            message.errorCode = object.errorCode | 0;
        if (object.httpCode != null)
            message.httpCode = object.httpCode >>> 0;
        if (object.headers) {
            if (!Array.isArray(object.headers))
                throw TypeError(".CommOpenApiResp.headers: array expected");
            message.headers = [];
            for (var i = 0; i < object.headers.length; ++i) {
                if (typeof object.headers[i] !== "object")
                    throw TypeError(".CommOpenApiResp.headers: object expected");
                message.headers[i] = $root.HttpHeader.fromObject(object.headers[i]);
            }
        }
        if (object.svrkitErrorCode != null)
            message.svrkitErrorCode = object.svrkitErrorCode | 0;
        return message;
    };

    /**
     * Creates a plain object from a CommOpenApiResp message. Also converts values to other types if specified.
     * @function toObject
     * @memberof CommOpenApiResp
     * @static
     * @param {CommOpenApiResp} message CommOpenApiResp
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    CommOpenApiResp.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.headers = [];
        if (options.defaults) {
            if (options.bytes === String)
                object.respData = "";
            else {
                object.respData = [];
                if (options.bytes !== Array)
                    object.respData = $util.newBuffer(object.respData);
            }
            object.contentType = "";
            object.errorCode = 0;
            object.httpCode = 0;
            object.svrkitErrorCode = 0;
        }
        if (message.respData != null && message.hasOwnProperty("respData"))
            object.respData = options.bytes === String ? $util.base64.encode(message.respData, 0, message.respData.length) : options.bytes === Array ? Array.prototype.slice.call(message.respData) : message.respData;
        if (message.contentType != null && message.hasOwnProperty("contentType"))
            object.contentType = message.contentType;
        if (message.errorCode != null && message.hasOwnProperty("errorCode"))
            object.errorCode = message.errorCode;
        if (message.httpCode != null && message.hasOwnProperty("httpCode"))
            object.httpCode = message.httpCode;
        if (message.headers && message.headers.length) {
            object.headers = [];
            for (var j = 0; j < message.headers.length; ++j)
                object.headers[j] = $root.HttpHeader.toObject(message.headers[j], options);
        }
        if (message.svrkitErrorCode != null && message.hasOwnProperty("svrkitErrorCode"))
            object.svrkitErrorCode = message.svrkitErrorCode;
        return object;
    };

    /**
     * Converts this CommOpenApiResp to JSON.
     * @function toJSON
     * @memberof CommOpenApiResp
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    CommOpenApiResp.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return CommOpenApiResp;
})();

$root.InnerApiData = (function() {

    /**
     * Properties of an InnerApiData.
     * @exports IInnerApiData
     * @interface IInnerApiData
     * @property {number|null} [modid] InnerApiData modid
     * @property {number|null} [cmdid] InnerApiData cmdid
     * @property {string|null} [url] InnerApiData url
     * @property {boolean|null} [useHttps] InnerApiData useHttps
     * @property {HTTP_METHODS|null} [method] InnerApiData method
     * @property {Array.<string>|null} [headers] InnerApiData headers
     * @property {Uint8Array|null} [body] InnerApiData body
     */

    /**
     * Constructs a new InnerApiData.
     * @exports InnerApiData
     * @classdesc Represents an InnerApiData.
     * @implements IInnerApiData
     * @constructor
     * @param {IInnerApiData=} [properties] Properties to set
     */
    function InnerApiData(properties) {
        this.headers = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * InnerApiData modid.
     * @member {number} modid
     * @memberof InnerApiData
     * @instance
     */
    InnerApiData.prototype.modid = 0;

    /**
     * InnerApiData cmdid.
     * @member {number} cmdid
     * @memberof InnerApiData
     * @instance
     */
    InnerApiData.prototype.cmdid = 0;

    /**
     * InnerApiData url.
     * @member {string} url
     * @memberof InnerApiData
     * @instance
     */
    InnerApiData.prototype.url = "";

    /**
     * InnerApiData useHttps.
     * @member {boolean} useHttps
     * @memberof InnerApiData
     * @instance
     */
    InnerApiData.prototype.useHttps = false;

    /**
     * InnerApiData method.
     * @member {HTTP_METHODS} method
     * @memberof InnerApiData
     * @instance
     */
    InnerApiData.prototype.method = 1;

    /**
     * InnerApiData headers.
     * @member {Array.<string>} headers
     * @memberof InnerApiData
     * @instance
     */
    InnerApiData.prototype.headers = $util.emptyArray;

    /**
     * InnerApiData body.
     * @member {Uint8Array} body
     * @memberof InnerApiData
     * @instance
     */
    InnerApiData.prototype.body = $util.newBuffer([]);

    /**
     * Creates a new InnerApiData instance using the specified properties.
     * @function create
     * @memberof InnerApiData
     * @static
     * @param {IInnerApiData=} [properties] Properties to set
     * @returns {InnerApiData} InnerApiData instance
     */
    InnerApiData.create = function create(properties) {
        return new InnerApiData(properties);
    };

    /**
     * Encodes the specified InnerApiData message. Does not implicitly {@link InnerApiData.verify|verify} messages.
     * @function encode
     * @memberof InnerApiData
     * @static
     * @param {IInnerApiData} message InnerApiData message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    InnerApiData.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.modid != null && message.hasOwnProperty("modid"))
            writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.modid);
        if (message.cmdid != null && message.hasOwnProperty("cmdid"))
            writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.cmdid);
        if (message.url != null && message.hasOwnProperty("url"))
            writer.uint32(/* id 3, wireType 2 =*/26).string(message.url);
        if (message.useHttps != null && message.hasOwnProperty("useHttps"))
            writer.uint32(/* id 4, wireType 0 =*/32).bool(message.useHttps);
        if (message.method != null && message.hasOwnProperty("method"))
            writer.uint32(/* id 5, wireType 0 =*/40).int32(message.method);
        if (message.headers != null && message.headers.length)
            for (var i = 0; i < message.headers.length; ++i)
                writer.uint32(/* id 6, wireType 2 =*/50).string(message.headers[i]);
        if (message.body != null && message.hasOwnProperty("body"))
            writer.uint32(/* id 7, wireType 2 =*/58).bytes(message.body);
        return writer;
    };

    /**
     * Encodes the specified InnerApiData message, length delimited. Does not implicitly {@link InnerApiData.verify|verify} messages.
     * @function encodeDelimited
     * @memberof InnerApiData
     * @static
     * @param {IInnerApiData} message InnerApiData message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    InnerApiData.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an InnerApiData message from the specified reader or buffer.
     * @function decode
     * @memberof InnerApiData
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {InnerApiData} InnerApiData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    InnerApiData.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.InnerApiData();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.modid = reader.uint32();
                break;
            case 2:
                message.cmdid = reader.uint32();
                break;
            case 3:
                message.url = reader.string();
                break;
            case 4:
                message.useHttps = reader.bool();
                break;
            case 5:
                message.method = reader.int32();
                break;
            case 6:
                if (!(message.headers && message.headers.length))
                    message.headers = [];
                message.headers.push(reader.string());
                break;
            case 7:
                message.body = reader.bytes();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes an InnerApiData message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof InnerApiData
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {InnerApiData} InnerApiData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    InnerApiData.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an InnerApiData message.
     * @function verify
     * @memberof InnerApiData
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    InnerApiData.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.modid != null && message.hasOwnProperty("modid"))
            if (!$util.isInteger(message.modid))
                return "modid: integer expected";
        if (message.cmdid != null && message.hasOwnProperty("cmdid"))
            if (!$util.isInteger(message.cmdid))
                return "cmdid: integer expected";
        if (message.url != null && message.hasOwnProperty("url"))
            if (!$util.isString(message.url))
                return "url: string expected";
        if (message.useHttps != null && message.hasOwnProperty("useHttps"))
            if (typeof message.useHttps !== "boolean")
                return "useHttps: boolean expected";
        if (message.method != null && message.hasOwnProperty("method"))
            switch (message.method) {
            default:
                return "method: enum value expected";
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
                break;
            }
        if (message.headers != null && message.hasOwnProperty("headers")) {
            if (!Array.isArray(message.headers))
                return "headers: array expected";
            for (var i = 0; i < message.headers.length; ++i)
                if (!$util.isString(message.headers[i]))
                    return "headers: string[] expected";
        }
        if (message.body != null && message.hasOwnProperty("body"))
            if (!(message.body && typeof message.body.length === "number" || $util.isString(message.body)))
                return "body: buffer expected";
        return null;
    };

    /**
     * Creates an InnerApiData message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof InnerApiData
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {InnerApiData} InnerApiData
     */
    InnerApiData.fromObject = function fromObject(object) {
        if (object instanceof $root.InnerApiData)
            return object;
        var message = new $root.InnerApiData();
        if (object.modid != null)
            message.modid = object.modid >>> 0;
        if (object.cmdid != null)
            message.cmdid = object.cmdid >>> 0;
        if (object.url != null)
            message.url = String(object.url);
        if (object.useHttps != null)
            message.useHttps = Boolean(object.useHttps);
        switch (object.method) {
        case "HTTP_GET":
        case 1:
            message.method = 1;
            break;
        case "HTTP_POST":
        case 2:
            message.method = 2;
            break;
        case "HTTP_PUT":
        case 3:
            message.method = 3;
            break;
        case "HTTP_DELETE":
        case 4:
            message.method = 4;
            break;
        case "HTTP_HEAD":
        case 5:
            message.method = 5;
            break;
        case "HTTP_PATCH":
        case 6:
            message.method = 6;
            break;
        }
        if (object.headers) {
            if (!Array.isArray(object.headers))
                throw TypeError(".InnerApiData.headers: array expected");
            message.headers = [];
            for (var i = 0; i < object.headers.length; ++i)
                message.headers[i] = String(object.headers[i]);
        }
        if (object.body != null)
            if (typeof object.body === "string")
                $util.base64.decode(object.body, message.body = $util.newBuffer($util.base64.length(object.body)), 0);
            else if (object.body.length)
                message.body = object.body;
        return message;
    };

    /**
     * Creates a plain object from an InnerApiData message. Also converts values to other types if specified.
     * @function toObject
     * @memberof InnerApiData
     * @static
     * @param {InnerApiData} message InnerApiData
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    InnerApiData.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.headers = [];
        if (options.defaults) {
            object.modid = 0;
            object.cmdid = 0;
            object.url = "";
            object.useHttps = false;
            object.method = options.enums === String ? "HTTP_GET" : 1;
            if (options.bytes === String)
                object.body = "";
            else {
                object.body = [];
                if (options.bytes !== Array)
                    object.body = $util.newBuffer(object.body);
            }
        }
        if (message.modid != null && message.hasOwnProperty("modid"))
            object.modid = message.modid;
        if (message.cmdid != null && message.hasOwnProperty("cmdid"))
            object.cmdid = message.cmdid;
        if (message.url != null && message.hasOwnProperty("url"))
            object.url = message.url;
        if (message.useHttps != null && message.hasOwnProperty("useHttps"))
            object.useHttps = message.useHttps;
        if (message.method != null && message.hasOwnProperty("method"))
            object.method = options.enums === String ? $root.HTTP_METHODS[message.method] : message.method;
        if (message.headers && message.headers.length) {
            object.headers = [];
            for (var j = 0; j < message.headers.length; ++j)
                object.headers[j] = message.headers[j];
        }
        if (message.body != null && message.hasOwnProperty("body"))
            object.body = options.bytes === String ? $util.base64.encode(message.body, 0, message.body.length) : options.bytes === Array ? Array.prototype.slice.call(message.body) : message.body;
        return object;
    };

    /**
     * Converts this InnerApiData to JSON.
     * @function toJSON
     * @memberof InnerApiData
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    InnerApiData.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return InnerApiData;
})();

$root.SvrkitApiData = (function() {

    /**
     * Properties of a SvrkitApiData.
     * @exports ISvrkitApiData
     * @interface ISvrkitApiData
     * @property {string|null} [apiName] SvrkitApiData apiName
     * @property {Uint8Array|null} [reqData] SvrkitApiData reqData
     */

    /**
     * Constructs a new SvrkitApiData.
     * @exports SvrkitApiData
     * @classdesc Represents a SvrkitApiData.
     * @implements ISvrkitApiData
     * @constructor
     * @param {ISvrkitApiData=} [properties] Properties to set
     */
    function SvrkitApiData(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * SvrkitApiData apiName.
     * @member {string} apiName
     * @memberof SvrkitApiData
     * @instance
     */
    SvrkitApiData.prototype.apiName = "";

    /**
     * SvrkitApiData reqData.
     * @member {Uint8Array} reqData
     * @memberof SvrkitApiData
     * @instance
     */
    SvrkitApiData.prototype.reqData = $util.newBuffer([]);

    /**
     * Creates a new SvrkitApiData instance using the specified properties.
     * @function create
     * @memberof SvrkitApiData
     * @static
     * @param {ISvrkitApiData=} [properties] Properties to set
     * @returns {SvrkitApiData} SvrkitApiData instance
     */
    SvrkitApiData.create = function create(properties) {
        return new SvrkitApiData(properties);
    };

    /**
     * Encodes the specified SvrkitApiData message. Does not implicitly {@link SvrkitApiData.verify|verify} messages.
     * @function encode
     * @memberof SvrkitApiData
     * @static
     * @param {ISvrkitApiData} message SvrkitApiData message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    SvrkitApiData.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.apiName != null && message.hasOwnProperty("apiName"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.apiName);
        if (message.reqData != null && message.hasOwnProperty("reqData"))
            writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.reqData);
        return writer;
    };

    /**
     * Encodes the specified SvrkitApiData message, length delimited. Does not implicitly {@link SvrkitApiData.verify|verify} messages.
     * @function encodeDelimited
     * @memberof SvrkitApiData
     * @static
     * @param {ISvrkitApiData} message SvrkitApiData message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    SvrkitApiData.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a SvrkitApiData message from the specified reader or buffer.
     * @function decode
     * @memberof SvrkitApiData
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {SvrkitApiData} SvrkitApiData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    SvrkitApiData.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.SvrkitApiData();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.apiName = reader.string();
                break;
            case 2:
                message.reqData = reader.bytes();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a SvrkitApiData message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof SvrkitApiData
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {SvrkitApiData} SvrkitApiData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    SvrkitApiData.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a SvrkitApiData message.
     * @function verify
     * @memberof SvrkitApiData
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    SvrkitApiData.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.apiName != null && message.hasOwnProperty("apiName"))
            if (!$util.isString(message.apiName))
                return "apiName: string expected";
        if (message.reqData != null && message.hasOwnProperty("reqData"))
            if (!(message.reqData && typeof message.reqData.length === "number" || $util.isString(message.reqData)))
                return "reqData: buffer expected";
        return null;
    };

    /**
     * Creates a SvrkitApiData message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof SvrkitApiData
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {SvrkitApiData} SvrkitApiData
     */
    SvrkitApiData.fromObject = function fromObject(object) {
        if (object instanceof $root.SvrkitApiData)
            return object;
        var message = new $root.SvrkitApiData();
        if (object.apiName != null)
            message.apiName = String(object.apiName);
        if (object.reqData != null)
            if (typeof object.reqData === "string")
                $util.base64.decode(object.reqData, message.reqData = $util.newBuffer($util.base64.length(object.reqData)), 0);
            else if (object.reqData.length)
                message.reqData = object.reqData;
        return message;
    };

    /**
     * Creates a plain object from a SvrkitApiData message. Also converts values to other types if specified.
     * @function toObject
     * @memberof SvrkitApiData
     * @static
     * @param {SvrkitApiData} message SvrkitApiData
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    SvrkitApiData.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.apiName = "";
            if (options.bytes === String)
                object.reqData = "";
            else {
                object.reqData = [];
                if (options.bytes !== Array)
                    object.reqData = $util.newBuffer(object.reqData);
            }
        }
        if (message.apiName != null && message.hasOwnProperty("apiName"))
            object.apiName = message.apiName;
        if (message.reqData != null && message.hasOwnProperty("reqData"))
            object.reqData = options.bytes === String ? $util.base64.encode(message.reqData, 0, message.reqData.length) : options.bytes === Array ? Array.prototype.slice.call(message.reqData) : message.reqData;
        return object;
    };

    /**
     * Converts this SvrkitApiData to JSON.
     * @function toJSON
     * @memberof SvrkitApiData
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    SvrkitApiData.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return SvrkitApiData;
})();

/**
 * HTTP_METHODS enum.
 * @exports HTTP_METHODS
 * @enum {string}
 * @property {number} HTTP_GET=1 HTTP_GET value
 * @property {number} HTTP_POST=2 HTTP_POST value
 * @property {number} HTTP_PUT=3 HTTP_PUT value
 * @property {number} HTTP_DELETE=4 HTTP_DELETE value
 * @property {number} HTTP_HEAD=5 HTTP_HEAD value
 * @property {number} HTTP_PATCH=6 HTTP_PATCH value
 */
$root.HTTP_METHODS = (function() {
    var valuesById = {}, values = Object.create(valuesById);
    values[valuesById[1] = "HTTP_GET"] = 1;
    values[valuesById[2] = "HTTP_POST"] = 2;
    values[valuesById[3] = "HTTP_PUT"] = 3;
    values[valuesById[4] = "HTTP_DELETE"] = 4;
    values[valuesById[5] = "HTTP_HEAD"] = 5;
    values[valuesById[6] = "HTTP_PATCH"] = 6;
    return values;
})();

$root.HttpHeader = (function() {

    /**
     * Properties of a HttpHeader.
     * @exports IHttpHeader
     * @interface IHttpHeader
     * @property {string|null} [key] HttpHeader key
     * @property {string|null} [value] HttpHeader value
     */

    /**
     * Constructs a new HttpHeader.
     * @exports HttpHeader
     * @classdesc Represents a HttpHeader.
     * @implements IHttpHeader
     * @constructor
     * @param {IHttpHeader=} [properties] Properties to set
     */
    function HttpHeader(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * HttpHeader key.
     * @member {string} key
     * @memberof HttpHeader
     * @instance
     */
    HttpHeader.prototype.key = "";

    /**
     * HttpHeader value.
     * @member {string} value
     * @memberof HttpHeader
     * @instance
     */
    HttpHeader.prototype.value = "";

    /**
     * Creates a new HttpHeader instance using the specified properties.
     * @function create
     * @memberof HttpHeader
     * @static
     * @param {IHttpHeader=} [properties] Properties to set
     * @returns {HttpHeader} HttpHeader instance
     */
    HttpHeader.create = function create(properties) {
        return new HttpHeader(properties);
    };

    /**
     * Encodes the specified HttpHeader message. Does not implicitly {@link HttpHeader.verify|verify} messages.
     * @function encode
     * @memberof HttpHeader
     * @static
     * @param {IHttpHeader} message HttpHeader message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    HttpHeader.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.key != null && message.hasOwnProperty("key"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.key);
        if (message.value != null && message.hasOwnProperty("value"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.value);
        return writer;
    };

    /**
     * Encodes the specified HttpHeader message, length delimited. Does not implicitly {@link HttpHeader.verify|verify} messages.
     * @function encodeDelimited
     * @memberof HttpHeader
     * @static
     * @param {IHttpHeader} message HttpHeader message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    HttpHeader.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a HttpHeader message from the specified reader or buffer.
     * @function decode
     * @memberof HttpHeader
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {HttpHeader} HttpHeader
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    HttpHeader.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.HttpHeader();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.key = reader.string();
                break;
            case 2:
                message.value = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a HttpHeader message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof HttpHeader
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {HttpHeader} HttpHeader
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    HttpHeader.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a HttpHeader message.
     * @function verify
     * @memberof HttpHeader
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    HttpHeader.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.key != null && message.hasOwnProperty("key"))
            if (!$util.isString(message.key))
                return "key: string expected";
        if (message.value != null && message.hasOwnProperty("value"))
            if (!$util.isString(message.value))
                return "value: string expected";
        return null;
    };

    /**
     * Creates a HttpHeader message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof HttpHeader
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {HttpHeader} HttpHeader
     */
    HttpHeader.fromObject = function fromObject(object) {
        if (object instanceof $root.HttpHeader)
            return object;
        var message = new $root.HttpHeader();
        if (object.key != null)
            message.key = String(object.key);
        if (object.value != null)
            message.value = String(object.value);
        return message;
    };

    /**
     * Creates a plain object from a HttpHeader message. Also converts values to other types if specified.
     * @function toObject
     * @memberof HttpHeader
     * @static
     * @param {HttpHeader} message HttpHeader
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    HttpHeader.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.key = "";
            object.value = "";
        }
        if (message.key != null && message.hasOwnProperty("key"))
            object.key = message.key;
        if (message.value != null && message.hasOwnProperty("value"))
            object.value = message.value;
        return object;
    };

    /**
     * Converts this HttpHeader to JSON.
     * @function toJSON
     * @memberof HttpHeader
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    HttpHeader.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return HttpHeader;
})();

$root.ApiGetOpenDataByCloudIdReq = (function() {

    /**
     * Properties of an ApiGetOpenDataByCloudIdReq.
     * @exports IApiGetOpenDataByCloudIdReq
     * @interface IApiGetOpenDataByCloudIdReq
     * @property {Array.<string>|null} [cloudidList] ApiGetOpenDataByCloudIdReq cloudidList
     */

    /**
     * Constructs a new ApiGetOpenDataByCloudIdReq.
     * @exports ApiGetOpenDataByCloudIdReq
     * @classdesc Represents an ApiGetOpenDataByCloudIdReq.
     * @implements IApiGetOpenDataByCloudIdReq
     * @constructor
     * @param {IApiGetOpenDataByCloudIdReq=} [properties] Properties to set
     */
    function ApiGetOpenDataByCloudIdReq(properties) {
        this.cloudidList = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * ApiGetOpenDataByCloudIdReq cloudidList.
     * @member {Array.<string>} cloudidList
     * @memberof ApiGetOpenDataByCloudIdReq
     * @instance
     */
    ApiGetOpenDataByCloudIdReq.prototype.cloudidList = $util.emptyArray;

    /**
     * Creates a new ApiGetOpenDataByCloudIdReq instance using the specified properties.
     * @function create
     * @memberof ApiGetOpenDataByCloudIdReq
     * @static
     * @param {IApiGetOpenDataByCloudIdReq=} [properties] Properties to set
     * @returns {ApiGetOpenDataByCloudIdReq} ApiGetOpenDataByCloudIdReq instance
     */
    ApiGetOpenDataByCloudIdReq.create = function create(properties) {
        return new ApiGetOpenDataByCloudIdReq(properties);
    };

    /**
     * Encodes the specified ApiGetOpenDataByCloudIdReq message. Does not implicitly {@link ApiGetOpenDataByCloudIdReq.verify|verify} messages.
     * @function encode
     * @memberof ApiGetOpenDataByCloudIdReq
     * @static
     * @param {IApiGetOpenDataByCloudIdReq} message ApiGetOpenDataByCloudIdReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ApiGetOpenDataByCloudIdReq.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.cloudidList != null && message.cloudidList.length)
            for (var i = 0; i < message.cloudidList.length; ++i)
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.cloudidList[i]);
        return writer;
    };

    /**
     * Encodes the specified ApiGetOpenDataByCloudIdReq message, length delimited. Does not implicitly {@link ApiGetOpenDataByCloudIdReq.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ApiGetOpenDataByCloudIdReq
     * @static
     * @param {IApiGetOpenDataByCloudIdReq} message ApiGetOpenDataByCloudIdReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ApiGetOpenDataByCloudIdReq.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an ApiGetOpenDataByCloudIdReq message from the specified reader or buffer.
     * @function decode
     * @memberof ApiGetOpenDataByCloudIdReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ApiGetOpenDataByCloudIdReq} ApiGetOpenDataByCloudIdReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ApiGetOpenDataByCloudIdReq.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.ApiGetOpenDataByCloudIdReq();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 2:
                if (!(message.cloudidList && message.cloudidList.length))
                    message.cloudidList = [];
                message.cloudidList.push(reader.string());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes an ApiGetOpenDataByCloudIdReq message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ApiGetOpenDataByCloudIdReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ApiGetOpenDataByCloudIdReq} ApiGetOpenDataByCloudIdReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ApiGetOpenDataByCloudIdReq.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an ApiGetOpenDataByCloudIdReq message.
     * @function verify
     * @memberof ApiGetOpenDataByCloudIdReq
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    ApiGetOpenDataByCloudIdReq.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.cloudidList != null && message.hasOwnProperty("cloudidList")) {
            if (!Array.isArray(message.cloudidList))
                return "cloudidList: array expected";
            for (var i = 0; i < message.cloudidList.length; ++i)
                if (!$util.isString(message.cloudidList[i]))
                    return "cloudidList: string[] expected";
        }
        return null;
    };

    /**
     * Creates an ApiGetOpenDataByCloudIdReq message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ApiGetOpenDataByCloudIdReq
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ApiGetOpenDataByCloudIdReq} ApiGetOpenDataByCloudIdReq
     */
    ApiGetOpenDataByCloudIdReq.fromObject = function fromObject(object) {
        if (object instanceof $root.ApiGetOpenDataByCloudIdReq)
            return object;
        var message = new $root.ApiGetOpenDataByCloudIdReq();
        if (object.cloudidList) {
            if (!Array.isArray(object.cloudidList))
                throw TypeError(".ApiGetOpenDataByCloudIdReq.cloudidList: array expected");
            message.cloudidList = [];
            for (var i = 0; i < object.cloudidList.length; ++i)
                message.cloudidList[i] = String(object.cloudidList[i]);
        }
        return message;
    };

    /**
     * Creates a plain object from an ApiGetOpenDataByCloudIdReq message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ApiGetOpenDataByCloudIdReq
     * @static
     * @param {ApiGetOpenDataByCloudIdReq} message ApiGetOpenDataByCloudIdReq
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    ApiGetOpenDataByCloudIdReq.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.cloudidList = [];
        if (message.cloudidList && message.cloudidList.length) {
            object.cloudidList = [];
            for (var j = 0; j < message.cloudidList.length; ++j)
                object.cloudidList[j] = message.cloudidList[j];
        }
        return object;
    };

    /**
     * Converts this ApiGetOpenDataByCloudIdReq to JSON.
     * @function toJSON
     * @memberof ApiGetOpenDataByCloudIdReq
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    ApiGetOpenDataByCloudIdReq.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return ApiGetOpenDataByCloudIdReq;
})();

$root.ApiGetOpenDataByCloudIdResp = (function() {

    /**
     * Properties of an ApiGetOpenDataByCloudIdResp.
     * @exports IApiGetOpenDataByCloudIdResp
     * @interface IApiGetOpenDataByCloudIdResp
     * @property {Array.<ApiGetOpenDataByCloudIdResp.IOpDataItem>|null} [dataList] ApiGetOpenDataByCloudIdResp dataList
     */

    /**
     * Constructs a new ApiGetOpenDataByCloudIdResp.
     * @exports ApiGetOpenDataByCloudIdResp
     * @classdesc Represents an ApiGetOpenDataByCloudIdResp.
     * @implements IApiGetOpenDataByCloudIdResp
     * @constructor
     * @param {IApiGetOpenDataByCloudIdResp=} [properties] Properties to set
     */
    function ApiGetOpenDataByCloudIdResp(properties) {
        this.dataList = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * ApiGetOpenDataByCloudIdResp dataList.
     * @member {Array.<ApiGetOpenDataByCloudIdResp.IOpDataItem>} dataList
     * @memberof ApiGetOpenDataByCloudIdResp
     * @instance
     */
    ApiGetOpenDataByCloudIdResp.prototype.dataList = $util.emptyArray;

    /**
     * Creates a new ApiGetOpenDataByCloudIdResp instance using the specified properties.
     * @function create
     * @memberof ApiGetOpenDataByCloudIdResp
     * @static
     * @param {IApiGetOpenDataByCloudIdResp=} [properties] Properties to set
     * @returns {ApiGetOpenDataByCloudIdResp} ApiGetOpenDataByCloudIdResp instance
     */
    ApiGetOpenDataByCloudIdResp.create = function create(properties) {
        return new ApiGetOpenDataByCloudIdResp(properties);
    };

    /**
     * Encodes the specified ApiGetOpenDataByCloudIdResp message. Does not implicitly {@link ApiGetOpenDataByCloudIdResp.verify|verify} messages.
     * @function encode
     * @memberof ApiGetOpenDataByCloudIdResp
     * @static
     * @param {IApiGetOpenDataByCloudIdResp} message ApiGetOpenDataByCloudIdResp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ApiGetOpenDataByCloudIdResp.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.dataList != null && message.dataList.length)
            for (var i = 0; i < message.dataList.length; ++i)
                $root.ApiGetOpenDataByCloudIdResp.OpDataItem.encode(message.dataList[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified ApiGetOpenDataByCloudIdResp message, length delimited. Does not implicitly {@link ApiGetOpenDataByCloudIdResp.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ApiGetOpenDataByCloudIdResp
     * @static
     * @param {IApiGetOpenDataByCloudIdResp} message ApiGetOpenDataByCloudIdResp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ApiGetOpenDataByCloudIdResp.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an ApiGetOpenDataByCloudIdResp message from the specified reader or buffer.
     * @function decode
     * @memberof ApiGetOpenDataByCloudIdResp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ApiGetOpenDataByCloudIdResp} ApiGetOpenDataByCloudIdResp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ApiGetOpenDataByCloudIdResp.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.ApiGetOpenDataByCloudIdResp();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                if (!(message.dataList && message.dataList.length))
                    message.dataList = [];
                message.dataList.push($root.ApiGetOpenDataByCloudIdResp.OpDataItem.decode(reader, reader.uint32()));
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes an ApiGetOpenDataByCloudIdResp message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ApiGetOpenDataByCloudIdResp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ApiGetOpenDataByCloudIdResp} ApiGetOpenDataByCloudIdResp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ApiGetOpenDataByCloudIdResp.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an ApiGetOpenDataByCloudIdResp message.
     * @function verify
     * @memberof ApiGetOpenDataByCloudIdResp
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    ApiGetOpenDataByCloudIdResp.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.dataList != null && message.hasOwnProperty("dataList")) {
            if (!Array.isArray(message.dataList))
                return "dataList: array expected";
            for (var i = 0; i < message.dataList.length; ++i) {
                var error = $root.ApiGetOpenDataByCloudIdResp.OpDataItem.verify(message.dataList[i]);
                if (error)
                    return "dataList." + error;
            }
        }
        return null;
    };

    /**
     * Creates an ApiGetOpenDataByCloudIdResp message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ApiGetOpenDataByCloudIdResp
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ApiGetOpenDataByCloudIdResp} ApiGetOpenDataByCloudIdResp
     */
    ApiGetOpenDataByCloudIdResp.fromObject = function fromObject(object) {
        if (object instanceof $root.ApiGetOpenDataByCloudIdResp)
            return object;
        var message = new $root.ApiGetOpenDataByCloudIdResp();
        if (object.dataList) {
            if (!Array.isArray(object.dataList))
                throw TypeError(".ApiGetOpenDataByCloudIdResp.dataList: array expected");
            message.dataList = [];
            for (var i = 0; i < object.dataList.length; ++i) {
                if (typeof object.dataList[i] !== "object")
                    throw TypeError(".ApiGetOpenDataByCloudIdResp.dataList: object expected");
                message.dataList[i] = $root.ApiGetOpenDataByCloudIdResp.OpDataItem.fromObject(object.dataList[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from an ApiGetOpenDataByCloudIdResp message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ApiGetOpenDataByCloudIdResp
     * @static
     * @param {ApiGetOpenDataByCloudIdResp} message ApiGetOpenDataByCloudIdResp
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    ApiGetOpenDataByCloudIdResp.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.dataList = [];
        if (message.dataList && message.dataList.length) {
            object.dataList = [];
            for (var j = 0; j < message.dataList.length; ++j)
                object.dataList[j] = $root.ApiGetOpenDataByCloudIdResp.OpDataItem.toObject(message.dataList[j], options);
        }
        return object;
    };

    /**
     * Converts this ApiGetOpenDataByCloudIdResp to JSON.
     * @function toJSON
     * @memberof ApiGetOpenDataByCloudIdResp
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    ApiGetOpenDataByCloudIdResp.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    ApiGetOpenDataByCloudIdResp.OpDataItem = (function() {

        /**
         * Properties of an OpDataItem.
         * @memberof ApiGetOpenDataByCloudIdResp
         * @interface IOpDataItem
         * @property {string|null} [cloudId] OpDataItem cloudId
         * @property {string|null} [json] OpDataItem json
         */

        /**
         * Constructs a new OpDataItem.
         * @memberof ApiGetOpenDataByCloudIdResp
         * @classdesc Represents an OpDataItem.
         * @implements IOpDataItem
         * @constructor
         * @param {ApiGetOpenDataByCloudIdResp.IOpDataItem=} [properties] Properties to set
         */
        function OpDataItem(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * OpDataItem cloudId.
         * @member {string} cloudId
         * @memberof ApiGetOpenDataByCloudIdResp.OpDataItem
         * @instance
         */
        OpDataItem.prototype.cloudId = "";

        /**
         * OpDataItem json.
         * @member {string} json
         * @memberof ApiGetOpenDataByCloudIdResp.OpDataItem
         * @instance
         */
        OpDataItem.prototype.json = "";

        /**
         * Creates a new OpDataItem instance using the specified properties.
         * @function create
         * @memberof ApiGetOpenDataByCloudIdResp.OpDataItem
         * @static
         * @param {ApiGetOpenDataByCloudIdResp.IOpDataItem=} [properties] Properties to set
         * @returns {ApiGetOpenDataByCloudIdResp.OpDataItem} OpDataItem instance
         */
        OpDataItem.create = function create(properties) {
            return new OpDataItem(properties);
        };

        /**
         * Encodes the specified OpDataItem message. Does not implicitly {@link ApiGetOpenDataByCloudIdResp.OpDataItem.verify|verify} messages.
         * @function encode
         * @memberof ApiGetOpenDataByCloudIdResp.OpDataItem
         * @static
         * @param {ApiGetOpenDataByCloudIdResp.IOpDataItem} message OpDataItem message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        OpDataItem.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.cloudId != null && message.hasOwnProperty("cloudId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.cloudId);
            if (message.json != null && message.hasOwnProperty("json"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.json);
            return writer;
        };

        /**
         * Encodes the specified OpDataItem message, length delimited. Does not implicitly {@link ApiGetOpenDataByCloudIdResp.OpDataItem.verify|verify} messages.
         * @function encodeDelimited
         * @memberof ApiGetOpenDataByCloudIdResp.OpDataItem
         * @static
         * @param {ApiGetOpenDataByCloudIdResp.IOpDataItem} message OpDataItem message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        OpDataItem.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an OpDataItem message from the specified reader or buffer.
         * @function decode
         * @memberof ApiGetOpenDataByCloudIdResp.OpDataItem
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {ApiGetOpenDataByCloudIdResp.OpDataItem} OpDataItem
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        OpDataItem.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.ApiGetOpenDataByCloudIdResp.OpDataItem();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.cloudId = reader.string();
                    break;
                case 2:
                    message.json = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an OpDataItem message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof ApiGetOpenDataByCloudIdResp.OpDataItem
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {ApiGetOpenDataByCloudIdResp.OpDataItem} OpDataItem
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        OpDataItem.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an OpDataItem message.
         * @function verify
         * @memberof ApiGetOpenDataByCloudIdResp.OpDataItem
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        OpDataItem.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.cloudId != null && message.hasOwnProperty("cloudId"))
                if (!$util.isString(message.cloudId))
                    return "cloudId: string expected";
            if (message.json != null && message.hasOwnProperty("json"))
                if (!$util.isString(message.json))
                    return "json: string expected";
            return null;
        };

        /**
         * Creates an OpDataItem message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof ApiGetOpenDataByCloudIdResp.OpDataItem
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {ApiGetOpenDataByCloudIdResp.OpDataItem} OpDataItem
         */
        OpDataItem.fromObject = function fromObject(object) {
            if (object instanceof $root.ApiGetOpenDataByCloudIdResp.OpDataItem)
                return object;
            var message = new $root.ApiGetOpenDataByCloudIdResp.OpDataItem();
            if (object.cloudId != null)
                message.cloudId = String(object.cloudId);
            if (object.json != null)
                message.json = String(object.json);
            return message;
        };

        /**
         * Creates a plain object from an OpDataItem message. Also converts values to other types if specified.
         * @function toObject
         * @memberof ApiGetOpenDataByCloudIdResp.OpDataItem
         * @static
         * @param {ApiGetOpenDataByCloudIdResp.OpDataItem} message OpDataItem
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        OpDataItem.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.cloudId = "";
                object.json = "";
            }
            if (message.cloudId != null && message.hasOwnProperty("cloudId"))
                object.cloudId = message.cloudId;
            if (message.json != null && message.hasOwnProperty("json"))
                object.json = message.json;
            return object;
        };

        /**
         * Converts this OpDataItem to JSON.
         * @function toJSON
         * @memberof ApiGetOpenDataByCloudIdResp.OpDataItem
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        OpDataItem.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return OpDataItem;
    })();

    return ApiGetOpenDataByCloudIdResp;
})();

$root.ApiVoipSignReq = (function() {

    /**
     * Properties of an ApiVoipSignReq.
     * @exports IApiVoipSignReq
     * @interface IApiVoipSignReq
     * @property {string|null} [groupId] ApiVoipSignReq groupId
     * @property {number|null} [timestamp] ApiVoipSignReq timestamp
     * @property {string|null} [nonce] ApiVoipSignReq nonce
     */

    /**
     * Constructs a new ApiVoipSignReq.
     * @exports ApiVoipSignReq
     * @classdesc Represents an ApiVoipSignReq.
     * @implements IApiVoipSignReq
     * @constructor
     * @param {IApiVoipSignReq=} [properties] Properties to set
     */
    function ApiVoipSignReq(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * ApiVoipSignReq groupId.
     * @member {string} groupId
     * @memberof ApiVoipSignReq
     * @instance
     */
    ApiVoipSignReq.prototype.groupId = "";

    /**
     * ApiVoipSignReq timestamp.
     * @member {number} timestamp
     * @memberof ApiVoipSignReq
     * @instance
     */
    ApiVoipSignReq.prototype.timestamp = 0;

    /**
     * ApiVoipSignReq nonce.
     * @member {string} nonce
     * @memberof ApiVoipSignReq
     * @instance
     */
    ApiVoipSignReq.prototype.nonce = "";

    /**
     * Creates a new ApiVoipSignReq instance using the specified properties.
     * @function create
     * @memberof ApiVoipSignReq
     * @static
     * @param {IApiVoipSignReq=} [properties] Properties to set
     * @returns {ApiVoipSignReq} ApiVoipSignReq instance
     */
    ApiVoipSignReq.create = function create(properties) {
        return new ApiVoipSignReq(properties);
    };

    /**
     * Encodes the specified ApiVoipSignReq message. Does not implicitly {@link ApiVoipSignReq.verify|verify} messages.
     * @function encode
     * @memberof ApiVoipSignReq
     * @static
     * @param {IApiVoipSignReq} message ApiVoipSignReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ApiVoipSignReq.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.groupId != null && message.hasOwnProperty("groupId"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.groupId);
        if (message.timestamp != null && message.hasOwnProperty("timestamp"))
            writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.timestamp);
        if (message.nonce != null && message.hasOwnProperty("nonce"))
            writer.uint32(/* id 4, wireType 2 =*/34).string(message.nonce);
        return writer;
    };

    /**
     * Encodes the specified ApiVoipSignReq message, length delimited. Does not implicitly {@link ApiVoipSignReq.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ApiVoipSignReq
     * @static
     * @param {IApiVoipSignReq} message ApiVoipSignReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ApiVoipSignReq.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an ApiVoipSignReq message from the specified reader or buffer.
     * @function decode
     * @memberof ApiVoipSignReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ApiVoipSignReq} ApiVoipSignReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ApiVoipSignReq.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.ApiVoipSignReq();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 2:
                message.groupId = reader.string();
                break;
            case 3:
                message.timestamp = reader.uint32();
                break;
            case 4:
                message.nonce = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes an ApiVoipSignReq message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ApiVoipSignReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ApiVoipSignReq} ApiVoipSignReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ApiVoipSignReq.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an ApiVoipSignReq message.
     * @function verify
     * @memberof ApiVoipSignReq
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    ApiVoipSignReq.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.groupId != null && message.hasOwnProperty("groupId"))
            if (!$util.isString(message.groupId))
                return "groupId: string expected";
        if (message.timestamp != null && message.hasOwnProperty("timestamp"))
            if (!$util.isInteger(message.timestamp))
                return "timestamp: integer expected";
        if (message.nonce != null && message.hasOwnProperty("nonce"))
            if (!$util.isString(message.nonce))
                return "nonce: string expected";
        return null;
    };

    /**
     * Creates an ApiVoipSignReq message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ApiVoipSignReq
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ApiVoipSignReq} ApiVoipSignReq
     */
    ApiVoipSignReq.fromObject = function fromObject(object) {
        if (object instanceof $root.ApiVoipSignReq)
            return object;
        var message = new $root.ApiVoipSignReq();
        if (object.groupId != null)
            message.groupId = String(object.groupId);
        if (object.timestamp != null)
            message.timestamp = object.timestamp >>> 0;
        if (object.nonce != null)
            message.nonce = String(object.nonce);
        return message;
    };

    /**
     * Creates a plain object from an ApiVoipSignReq message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ApiVoipSignReq
     * @static
     * @param {ApiVoipSignReq} message ApiVoipSignReq
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    ApiVoipSignReq.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.groupId = "";
            object.timestamp = 0;
            object.nonce = "";
        }
        if (message.groupId != null && message.hasOwnProperty("groupId"))
            object.groupId = message.groupId;
        if (message.timestamp != null && message.hasOwnProperty("timestamp"))
            object.timestamp = message.timestamp;
        if (message.nonce != null && message.hasOwnProperty("nonce"))
            object.nonce = message.nonce;
        return object;
    };

    /**
     * Converts this ApiVoipSignReq to JSON.
     * @function toJSON
     * @memberof ApiVoipSignReq
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    ApiVoipSignReq.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return ApiVoipSignReq;
})();

$root.ApiVoipSignResp = (function() {

    /**
     * Properties of an ApiVoipSignResp.
     * @exports IApiVoipSignResp
     * @interface IApiVoipSignResp
     * @property {string|null} [signature] ApiVoipSignResp signature
     */

    /**
     * Constructs a new ApiVoipSignResp.
     * @exports ApiVoipSignResp
     * @classdesc Represents an ApiVoipSignResp.
     * @implements IApiVoipSignResp
     * @constructor
     * @param {IApiVoipSignResp=} [properties] Properties to set
     */
    function ApiVoipSignResp(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * ApiVoipSignResp signature.
     * @member {string} signature
     * @memberof ApiVoipSignResp
     * @instance
     */
    ApiVoipSignResp.prototype.signature = "";

    /**
     * Creates a new ApiVoipSignResp instance using the specified properties.
     * @function create
     * @memberof ApiVoipSignResp
     * @static
     * @param {IApiVoipSignResp=} [properties] Properties to set
     * @returns {ApiVoipSignResp} ApiVoipSignResp instance
     */
    ApiVoipSignResp.create = function create(properties) {
        return new ApiVoipSignResp(properties);
    };

    /**
     * Encodes the specified ApiVoipSignResp message. Does not implicitly {@link ApiVoipSignResp.verify|verify} messages.
     * @function encode
     * @memberof ApiVoipSignResp
     * @static
     * @param {IApiVoipSignResp} message ApiVoipSignResp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ApiVoipSignResp.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.signature != null && message.hasOwnProperty("signature"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.signature);
        return writer;
    };

    /**
     * Encodes the specified ApiVoipSignResp message, length delimited. Does not implicitly {@link ApiVoipSignResp.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ApiVoipSignResp
     * @static
     * @param {IApiVoipSignResp} message ApiVoipSignResp message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ApiVoipSignResp.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an ApiVoipSignResp message from the specified reader or buffer.
     * @function decode
     * @memberof ApiVoipSignResp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ApiVoipSignResp} ApiVoipSignResp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ApiVoipSignResp.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.ApiVoipSignResp();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.signature = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes an ApiVoipSignResp message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ApiVoipSignResp
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ApiVoipSignResp} ApiVoipSignResp
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ApiVoipSignResp.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an ApiVoipSignResp message.
     * @function verify
     * @memberof ApiVoipSignResp
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    ApiVoipSignResp.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.signature != null && message.hasOwnProperty("signature"))
            if (!$util.isString(message.signature))
                return "signature: string expected";
        return null;
    };

    /**
     * Creates an ApiVoipSignResp message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ApiVoipSignResp
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ApiVoipSignResp} ApiVoipSignResp
     */
    ApiVoipSignResp.fromObject = function fromObject(object) {
        if (object instanceof $root.ApiVoipSignResp)
            return object;
        var message = new $root.ApiVoipSignResp();
        if (object.signature != null)
            message.signature = String(object.signature);
        return message;
    };

    /**
     * Creates a plain object from an ApiVoipSignResp message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ApiVoipSignResp
     * @static
     * @param {ApiVoipSignResp} message ApiVoipSignResp
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    ApiVoipSignResp.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults)
            object.signature = "";
        if (message.signature != null && message.hasOwnProperty("signature"))
            object.signature = message.signature;
        return object;
    };

    /**
     * Converts this ApiVoipSignResp to JSON.
     * @function toJSON
     * @memberof ApiVoipSignResp
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    ApiVoipSignResp.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return ApiVoipSignResp;
})();

module.exports = $root;


/***/ }),

/***/ "./src/utils/assert.ts":
/*!*****************************!*\
  !*** ./src/utils/assert.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var type_1 = __webpack_require__(/*! ./type */ "./src/utils/type.ts");
var error_1 = __webpack_require__(/*! ./error */ "./src/utils/error.ts");
var error_config_1 = __webpack_require__(/*! config/error.config */ "./src/config/error.config.ts");
function sameType(input, ref, name) {
    function sameTypeImpl(input, ref, name) {
        var inputType = type_1.getType(input);
        var refType = type_1.getType(ref);
        if (inputType !== refType) {
            return name + " should be " + refType + " instead of " + inputType + "; ";
        }
        var errors = '';
        switch (inputType) {
            case 'object': {
                for (var key in ref) {
                    errors += sameTypeImpl(input[key], ref[key], name + "." + key);
                }
                break;
            }
            case 'array': {
                for (var i = 0; i < ref.length; i++) {
                    errors += sameTypeImpl(input[i], ref[i], name + "[" + i + "]");
                }
                break;
            }
            default: {
                break;
            }
        }
        return errors;
    }
    var error = sameTypeImpl(input, ref, name);
    return {
        passed: !error,
        reason: error,
    };
}
exports.sameType = sameType;
function validType(input, ref, name) {
    if (name === void 0) { name = 'parameter'; }
    function validTypeImpl(input, ref, name) {
        var inputType = type_1.getType(input);
        var refType = type_1.getType(ref);
        if (refType === 'string') {
            if (inputType !== ref) {
                return name + " should be " + ref + " instead of " + inputType + ";";
            }
            return '';
        }
        else {
            if (inputType !== refType) {
                return name + " should be " + refType + " instead of " + inputType + "; ";
            }
            var errors = '';
            switch (inputType) {
                case 'object': {
                    for (var key in ref) {
                        errors += validTypeImpl(input[key], ref[key], name + "." + key);
                    }
                    break;
                }
                case 'array': {
                    for (var i = 0; i < ref.length; i++) {
                        errors += validTypeImpl(input[i], ref[i], name + "[" + i + "]");
                    }
                    break;
                }
                default: {
                    break;
                }
            }
            return errors;
        }
    }
    var error = validTypeImpl(input, ref, name);
    return {
        passed: !error,
        reason: error,
    };
}
exports.validType = validType;
function validObjectOptionalType(input, ref, name) {
    if (name === void 0) { name = 'parameter'; }
    function validImpl(input, ref, name) {
        var inputType = type_1.getType(input);
        var refType = type_1.getType(ref);
        if (refType !== 'object')
            return '';
        if (inputType === 'object') {
            for (var key in input) {
                var val = input[key];
                if (val === undefined || key === null) {
                    continue;
                }
                var assertResult = validType(val, ref[key], name + "." + key);
                return assertResult.passed ? '' : assertResult.reason;
            }
        }
        else {
            return name + " should be object instead of " + inputType;
        }
        return '';
    }
    var error = validImpl(input, ref, name);
    return {
        passed: !error,
        reason: error,
    };
}
exports.validObjectOptionalType = validObjectOptionalType;
function assertType(param, ref, name, ErrorClass) {
    if (name === void 0) { name = 'parameter'; }
    if (ErrorClass === void 0) { ErrorClass = error_1.CloudSDKError; }
    // check param validity
    var paramCheckResult = validType(param, ref, name);
    if (!paramCheckResult.passed) {
        throw new ErrorClass({
            errMsg: paramCheckResult.reason,
        });
    }
}
exports.assertType = assertType;
function assertObjectOptionalType(param, ref, name, ErrorClass) {
    if (name === void 0) { name = 'parameter'; }
    if (ErrorClass === void 0) { ErrorClass = error_1.CloudSDKError; }
    // check param validity
    var paramCheckResult = validObjectOptionalType(param, ref, name);
    if (!paramCheckResult.passed) {
        throw new ErrorClass({
            errMsg: paramCheckResult.reason,
        });
    }
}
exports.assertObjectOptionalType = assertObjectOptionalType;
function assertRequiredParam(param, name, funcName, ErrorClass) {
    if (ErrorClass === void 0) { ErrorClass = error_1.CloudSDKError; }
    if (param === undefined || param === null) {
        throw new ErrorClass({
            errMsg: "parameter " + name + " of function " + funcName + " must be provided",
        });
    }
}
exports.assertRequiredParam = assertRequiredParam;
function assertObjectNotEmpty(_a) {
    var target = _a.target, name = _a.name, _b = _a.ErrorClass, ErrorClass = _b === void 0 ? error_1.CloudSDKError : _b;
    if (Object.keys(target).length === 0) {
        throw new ErrorClass({
            errCode: error_config_1.ERR_CODE.SDK_API_PARAMETER_ERROR,
            errMsg: name + " must not be empty"
        });
    }
}
exports.assertObjectNotEmpty = assertObjectNotEmpty;
/*
export function constructTypeRef(typeDef: any): any {

  const type = getType(typeDef)

  switch(type) {
    case 'string': {
      return ''
    }
    case 'number': {

    }
  }

}
*/ 


/***/ }),

/***/ "./src/utils/error.ts":
/*!****************************!*\
  !*** ./src/utils/error.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "tslib");
var type_1 = __webpack_require__(/*! ./type */ "./src/utils/type.ts");
var msg_1 = __webpack_require__(/*! ./msg */ "./src/utils/msg.ts");
var error_config_1 = __webpack_require__(/*! config/error.config */ "./src/config/error.config.ts");
var CloudSDKError = /** @class */ (function (_super) {
    tslib_1.__extends(CloudSDKError, _super);
    function CloudSDKError(options) {
        var _this = _super.call(this, options.errMsg) || this;
        _this.errCode = -1;
        Object.defineProperties(_this, {
            message: {
                get: function () {
                    return "errCode: " + this.errCode + " " + (error_config_1.ERR_CODE[this.errCode] || '') + " | errMsg: " + this.errMsg;
                },
                set: function (msg) {
                    this.errMsg = msg;
                }
            }
        });
        _this.errCode = options.errCode || -1;
        _this.errMsg = options.errMsg;
        return _this;
    }
    Object.defineProperty(CloudSDKError.prototype, "message", {
        get: function () {
            return "errCode: " + this.errCode + " | errMsg: " + this.errMsg;
        },
        set: function (msg) {
            this.errMsg = msg;
        },
        enumerable: true,
        configurable: true
    });
    return CloudSDKError;
}(Error));
exports.CloudSDKError = CloudSDKError;
function createError(_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.errCode, errCode = _c === void 0 ? 1 : _c, _d = _b.errMsg, errMsg = _d === void 0 ? '' : _d, _e = _b.errClass, errClass = _e === void 0 ? CloudSDKError : _e;
    return new errClass({
        errCode: errCode,
        errMsg: errMsg,
    });
}
exports.createError = createError;
function isSDKError(error) {
    return error && (error instanceof Error) && type_1.isString(error.errMsg);
}
exports.isSDKError = isSDKError;
function returnAsCloudSDKError(err, appendMsg) {
    if (appendMsg === void 0) { appendMsg = ''; }
    if (err) {
        if (isSDKError(err)) {
            if (appendMsg) {
                err.errMsg += '; ' + appendMsg;
            }
            return err;
        }
        var errCode = err ? err.errCode : undefined;
        var errMsg = (err && err.errMsg || err.toString() || 'unknown error') + '; ' + appendMsg;
        return new CloudSDKError({
            errCode: errCode,
            errMsg: errMsg,
        });
    }
    return new CloudSDKError({
        errMsg: appendMsg
    });
}
exports.returnAsCloudSDKError = returnAsCloudSDKError;
function returnAsFinalCloudSDKError(err, apiName) {
    if (err && isSDKError(err)) {
        return err;
    }
    var e = returnAsCloudSDKError(err, "at " + apiName + " api; ");
    e.errMsg = msg_1.apiFailMsg(apiName, e.errMsg);
    return e;
}
exports.returnAsFinalCloudSDKError = returnAsFinalCloudSDKError;


/***/ }),

/***/ "./src/utils/mimetype.ts":
/*!*******************************!*\
  !*** ./src/utils/mimetype.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var mimeDB = __webpack_require__(/*! mime-db */ "mime-db");
exports.mimeTypeToFileExtension = function (mimeType, defaultExtension) {
    var mime = mimeDB[mimeType];
    if (mime && mime.extensions && mime.extensions.length) {
        return mime.extensions[0];
    }
    else {
        return defaultExtension;
    }
};


/***/ }),

/***/ "./src/utils/msg.ts":
/*!**************************!*\
  !*** ./src/utils/msg.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function apiSuccessMsg(apiName) {
    return apiName + ":ok";
}
exports.apiSuccessMsg = apiSuccessMsg;
function apiCancelMsg(apiName, msg) {
    return apiName + ":cancel " + msg;
}
exports.apiCancelMsg = apiCancelMsg;
function apiFailMsg(apiName, msg) {
    return apiName + ":fail " + msg;
}
exports.apiFailMsg = apiFailMsg;


/***/ }),

/***/ "./src/utils/symbol.ts":
/*!*****************************!*\
  !*** ./src/utils/symbol.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "tslib");
var _symbols = [];
var __internalMark__ = {};
var HiddenSymbol = /** @class */ (function () {
    function HiddenSymbol(target) {
        Object.defineProperties(this, {
            target: {
                enumerable: false,
                writable: false,
                configurable: false,
                value: target,
            },
        });
    }
    return HiddenSymbol;
}());
var InternalSymbol = /** @class */ (function (_super) {
    tslib_1.__extends(InternalSymbol, _super);
    function InternalSymbol(target, __mark__) {
        var _this = this;
        if (__mark__ !== __internalMark__) {
            throw new TypeError('InternalSymbol cannot be constructed with new operator');
        }
        _this = _super.call(this, target) || this;
        return _this;
    }
    InternalSymbol.for = function (target) {
        for (var i = 0, len = _symbols.length; i < len; i++) {
            if (_symbols[i].target === target) {
                return _symbols[i].instance;
            }
        }
        var symbol = new InternalSymbol(target, __internalMark__);
        _symbols.push({
            target: target,
            instance: symbol,
        });
        return symbol;
    };
    return InternalSymbol;
}(HiddenSymbol));
exports.InternalSymbol = InternalSymbol;
exports.default = InternalSymbol;


/***/ }),

/***/ "./src/utils/type.ts":
/*!***************************!*\
  !*** ./src/utils/type.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var symbol_1 = __webpack_require__(/*! ./symbol */ "./src/utils/symbol.ts");
exports.getType = function (x) { return Object.prototype.toString.call(x).slice(8, -1).toLowerCase(); };
exports.isObject = function (x) { return exports.getType(x) === 'object'; };
exports.isString = function (x) { return exports.getType(x) === 'string'; };
exports.isNumber = function (x) { return exports.getType(x) === 'number'; };
exports.isPromise = function (x) { return exports.getType(x) === 'promise'; };
exports.isFunction = function (x) { return typeof x === 'function'; };
exports.isArray = function (x) { return Array.isArray(x); };
exports.isDate = function (x) { return exports.getType(x) === 'date'; };
exports.isBuffer = function (x) { return Buffer.isBuffer(x); };
exports.isInternalObject = function (x) { return x && (x._internalType instanceof symbol_1.InternalSymbol); };
exports.isPlainObject = function (obj) {
    if (typeof obj !== 'object' || obj === null)
        return false;
    var proto = obj;
    while (Object.getPrototypeOf(proto) !== null) {
        proto = Object.getPrototypeOf(proto);
    }
    return Object.getPrototypeOf(obj) === proto;
};


/***/ }),

/***/ "./src/utils/utils.ts":
/*!****************************!*\
  !*** ./src/utils/utils.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(/*! tslib */ "tslib");
var type_1 = __webpack_require__(/*! ./type */ "./src/utils/type.ts");
exports.convertCase = function (input, options) {
    var e_1, _a;
    var from = options.from, to = options.to, recursive = options.recursive;
    if (type_1.isString(input)) {
        if (from === 'camelcase' && to === 'snakecase') {
            return input.replace(/[A-Z]/g, function (match, ind) { return "" + (ind ? '_' : '') + match.toLowerCase(); });
        }
        else if (from === 'snakecase' && to === 'camelcase') {
            return input.replace(/_[a-z]/g, function (match, ind) { return "" + match[1].toUpperCase(); });
        }
    }
    else if (type_1.isObject(input)) {
        return convertObject(input);
    }
    else if (type_1.isArray(input)) {
        var array = [];
        try {
            for (var input_1 = tslib_1.__values(input), input_1_1 = input_1.next(); !input_1_1.done; input_1_1 = input_1.next()) {
                var item = input_1_1.value;
                if (type_1.isObject(item)) {
                    array.push(convertObject(item));
                }
                else if (type_1.isArray(item)) {
                    if (options.recursive) {
                        array.push(exports.convertCase(item, options));
                    }
                    else {
                        array.push(item);
                    }
                }
                else {
                    array.push(item);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (input_1_1 && !input_1_1.done && (_a = input_1.return)) _a.call(input_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return array;
    }
    else
        return input;
    function convertObject(input) {
        var data = tslib_1.__assign({}, input);
        for (var key in data) {
            var val = recursive && (type_1.isObject(data[key]) || type_1.isArray(data[key])) ? exports.convertCase(data[key], options) : data[key];
            var convertedKey = exports.convertCase(key, options);
            data[convertedKey] = val;
            if (convertedKey !== key) {
                delete data[key];
            }
        }
        return data;
    }
};


/***/ }),

/***/ "mime-db":
/*!**************************!*\
  !*** external "mime-db" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("mime-db");

/***/ }),

/***/ "protobufjs/minimal":
/*!*************************************!*\
  !*** external "protobufjs/minimal" ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("protobufjs/minimal");

/***/ }),

/***/ "tcb-admin-node":
/*!*********************************!*\
  !*** external "tcb-admin-node" ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("tcb-admin-node");

/***/ }),

/***/ "tcb-admin-node/src/utils/httpRequest":
/*!*******************************************************!*\
  !*** external "tcb-admin-node/src/utils/httpRequest" ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("tcb-admin-node/src/utils/httpRequest");

/***/ }),

/***/ "tslib":
/*!************************!*\
  !*** external "tslib" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("tslib");

/***/ })

/******/ });