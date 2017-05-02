/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Message = exports.DbHelper = undefined;

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _merge = __webpack_require__(1);

	var _merge2 = _interopRequireDefault(_merge);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Message = function Message(_ref) {
	  var success = _ref.success,
	      msg = _ref.msg,
	      result = _ref.result,
	      total = _ref.total;

	  return {
	    success: success,
	    msg: msg,
	    result: result,
	    total: total
	  };
	};

	var DbHelper = function DbHelper() {
	  this.localDatabase = {};
	  this.localDatabase.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
	  this.localDatabase.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange;
	  this.localDatabase.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction;
	  this.localDatabase.indexedDB.onerror = function (e) {
	    alert("Database error: " + e.target.errorCode);
	  };
	};
	/**
	 * 创建/打开数据库 和表
	 * @return {[type]} [description]
	 */
	DbHelper.prototype.openDatabase = function (dbName, storeName, version, callback) {
	  var me = this,
	      vs = 1;
	  try {

	    if (version) {
	      vs = version;
	    };
	    var openRequest = me.localDatabase.indexedDB.open(dbName, vs);
	    openRequest.onerror = function (e) {
	      if (callback) {
	        callback(new Message({
	          success: false,
	          msg: "Database error: " + e.target.errorCode,
	          result: null
	        }));
	      };
	    };
	    openRequest.onsuccess = function (e) {
	      me.localDatabase.db = e.target.result;
	      //me.createObjectStore(storeName, false, false, function() {
	      if (callback) {
	        callback(new Message({
	          success: true,
	          msg: "createObjectStore success",
	          result: null
	        }));
	      };
	      //});
	      // if (callback) {
	      // 	callback(new Message({
	      // 		success: true,
	      // 		msg: "openDatabase success",
	      // 		result: null
	      // 	}));
	      // };
	    };
	    openRequest.onupgradeneeded = function (e) {
	      //alert('open upgrade');

	      me.localDatabase.db = e.target.result;
	      me.createObjectStore(storeName, false, false, function () {
	        if (callback) {
	          callback(new Message({
	            success: true,
	            msg: "upgradeneeded success",
	            result: null
	          }));
	        };
	      });
	    };
	  } catch (e) {
	    if (callback) {
	      callback(new Message({
	        success: false,
	        msg: e,
	        result: null
	      }));
	    };
	  }
	};

	/**
	 * 删除数据库
	 * @param  {[type]} dbName [description]
	 * @return {[type]}        [description]
	 */
	DbHelper.prototype.distoryDatabase = function (dbName, callback) {
	  try {
	    var _me = this;
	    var deleteDbRequest = _me.localDatabase.indexedDB.deleteDatabase(dbName);
	    deleteDbRequest.onsuccess = function (e) {
	      if (callback) {
	        callback(new Message({
	          success: true,
	          msg: 'Database deleted',
	          result: null
	        }));
	      };

	      deleteDbRequest.onerror = function (e) {
	        if (callback) {
	          callback(new Message({
	            success: false,
	            msg: "Database error: " + e.target.errorCode,
	            result: null
	          }));
	        };
	      };
	    };
	  } catch (e) {
	    if (callback) {
	      callback(new Message({
	        success: false,
	        msg: e,
	        result: null
	      }));
	    };
	  }
	};
	/**
	 * 创建表
	 * @param  {[type]} dbName  [description]
	 * @param  {[type]} version [description]
	 * @return {[type]}         [description]
	 */
	DbHelper.prototype.createObjectStore = function (storeName, keyPath, valIndex, callback) {
	  try {
	    var _me2 = this;
	    var def = {
	      keyPath: "id",
	      autoIncrement: true
	    };
	    var kp = (0, _merge2.default)(def, keyPath || {});
	    var employeeStore = _me2.localDatabase.db.createObjectStore(storeName, kp);
	    if (valIndex) {
	      for (var i = 0; i < valIndex.length; i++) {
	        var index = valIndex[i];
	        employeeStore.createIndex(index.name, index.feild, {
	          unique: index.unique
	        });
	      };
	    };

	    employeeStore.onsuccess = function (e) {
	      if (callback) {
	        callback(new Message({
	          success: true,
	          msg: 'ok',
	          result: null
	        }));
	      };
	    };
	  } catch (e) {
	    if (callback) {
	      callback(new Message({
	        success: false,
	        msg: e,
	        result: null
	      }));
	    };
	  }
	};

	/**
	 * 查找
	 * @return {[type]} [description]
	 */
	DbHelper.prototype.find = function (storeName, whereObj, isFuzzy, topNum, callback) {
	  if (typeof whereObj === 'function') {
	    callback = whereObj;
	    whereObj = null;
	    isFuzzy = null;
	    topNum = null;
	  } else if (typeof isFuzzy === 'function') {
	    callback = isFuzzy;
	    isFuzzy = null;
	    topNum = null;
	  } else if (typeof topNum === 'function') {
	    callback = topNum;
	    topNum = null;
	  }
	  try {

	    var _me3 = this;
	    var transaction = _me3.localDatabase.db.transaction(storeName, "readwrite");
	    var _store = transaction.objectStore(storeName);

	    if (_me3.localDatabase != null && _me3.localDatabase.db != null) {
	      var _store = _me3.localDatabase.db.transaction(storeName).objectStore(storeName);

	      var request = _store.openCursor();
	      var result = [],
	          res = [];
	      request.onsuccess = function (e) {
	        var cursor = e.target.result;

	        if (cursor) {
	          var data = cursor.value;
	          result.push(data);
	          cursor.continue();
	        } else {
	          // var jsonStr = JSON.stringify(employee);
	          //var indexes = [];
	          if (whereObj) {
	            for (var i = 0; i < result.length; i++) {
	              for (var key in whereObj) {

	                var value = result[i][key];
	                //判断whereObj[key]是否默认类型
	                if (_typeof(whereObj[key]) == 'object') {
	                  var obj = whereObj[key];
	                  if (obj.type == 'date') {
	                    var val1 = new Date(obj.value);
	                    var val2 = new Date(value);

	                    if (!(val2 >= val1)) {
	                      delete result[i];
	                      break;
	                    }
	                  } else {
	                    //默认string 
	                    //是否模糊查询
	                    if (isFuzzy) {
	                      if (value.indexOf(whereObj[key]) == -1) {
	                        delete result[i];
	                        break;
	                      };
	                    } else {
	                      if (whereObj[key] != value) {
	                        delete result[i];
	                        break;
	                      };
	                    }
	                  }
	                } else {
	                  //是否模糊查询
	                  if (isFuzzy) {
	                    if (value.indexOf(whereObj[key]) == -1) {
	                      delete result[i];
	                      break;
	                    };
	                  } else {
	                    if (whereObj[key] != value) {
	                      delete result[i];
	                      break;
	                    };
	                  }
	                }
	              }
	            };
	          }
	          for (var _i = 0; _i < result.length; _i++) {
	            if (result[_i]) {
	              res.push(result[_i]);
	            };
	          };
	          if (topNum) {
	            if (res.length > topNum) {
	              res.splice(topNum - 1, res.length - topNum);
	            };
	          };
	          if (callback) {
	            callback(new Message({
	              success: true,
	              total: result.length,
	              msg: 'find success',
	              result: result
	            }));
	          };
	        }
	      };
	    }
	  } catch (e) {
	    if (callback) {
	      callback(new Message({
	        success: false,
	        msg: e,
	        result: null
	      }));
	    };
	  }
	};
	/**
	 * 根据id获取数据
	 * @param  {[type]}   storeName [description]
	 * @param  {[type]}   id        [description]
	 * @param  {Function} callback  [description]
	 * @return {[type]}             [description]
	 */
	DbHelper.prototype.getById = function (storeName, id, callback) {
	  try {

	    var _me4 = this;
	    var transaction = _me4.localDatabase.db.transaction(storeName, "readwrite");
	    var store = transaction.objectStore(storeName);

	    if (_me4.localDatabase != null && _me4.localDatabase.db != null) {
	      store.get(id).onsuccess = function (e) {
	        if (callback) {
	          callback(new Message({
	            success: true,
	            msg: 'ok',
	            result: e.target.result
	          }));
	        }
	      };
	    }
	  } catch (e) {
	    if (callback) {
	      callback(new Message({
	        success: false,
	        msg: e,
	        result: null
	      }));
	    }
	  }
	};
	/**
	 * 新增
	 */
	DbHelper.prototype.add = function (storeName, fieldArr, callback) {
	  try {
	    var _me5 = this;
	    var transaction = _me5.localDatabase.db.transaction(storeName, "readwrite");
	    var store = transaction.objectStore(storeName);
	    if (_me5.localDatabase != null && _me5.localDatabase.db != null) {
	      for (var i = 0; i < fieldArr.length; i++) {
	        var obj = fieldArr[i];
	        var request = store.add(obj);
	        request.onsuccess = function (e) {
	          if (callback) {
	            callback(new Message({
	              success: true,
	              msg: 'ok',
	              result: null
	            }));
	          }
	        };

	        request.onerror = function (e) {
	          if (callback) {
	            callback(new Message({
	              success: false,
	              msg: e,
	              result: null
	            }));
	          }
	        };
	      };
	    }
	  } catch (e) {
	    if (callback) {
	      callback(new Message({
	        success: false,
	        msg: e,
	        result: null
	      }));
	    }
	  }
	};
	/**
	 * 根据Id删除 
	 * @return {[type]} [description]
	 */
	DbHelper.prototype.deleteById = function (storeName, id, callback) {
	  try {
	    var _me6 = this;
	    if (_me6.localDatabase != null && _me6.localDatabase.db != null) {
	      var store = _me6.localDatabase.db.transaction(storeName, "readwrite").objectStore(storeName);
	      store.delete(id).onsuccess = function (e) {
	        if (callback) {
	          callback(new Message({
	            success: true,
	            msg: 'ok',
	            result: null
	          }));
	        }
	      };
	    }
	  } catch (e) {
	    if (callback) {
	      callback(new Message({
	        success: false,
	        msg: e,
	        result: null
	      }));
	    }
	  }
	};
	/**
	 * 清空Store
	 * @param  {[type]}   storeName [description]
	 * @param  {Function} callback  [description]
	 * @return {[type]}             [description]
	 */
	DbHelper.prototype.clear = function (storeName, callback) {
	  try {

	    if (me.localDatabase != null && me.localDatabase.db != null) {
	      var store = me.localDatabase.db.transaction(storeName, "readwrite").objectStore(storeName);

	      store.clear().onsuccess = function (e) {

	        if (callback) {
	          callback(new Message({
	            success: true,
	            msg: storeName + " object store cleared",
	            result: null
	          }));
	        }
	      };
	    }
	  } catch (e) {
	    if (callback) {
	      callback(new Message({
	        success: false,
	        msg: e,
	        result: null
	      }));
	    }
	  }
	};
	/**
	 * 根据id修改
	 * @return {[type]} [description]
	 */
	DbHelper.prototype.updateById = function (storeName, id, setObj, callback) {
	  try {
	    var _me7 = this;
	    var transaction = _me7.localDatabase.db.transaction(storeName, "readwrite");
	    var store = transaction.objectStore(storeName);

	    var record = void 0;
	    if (_me7.localDatabase != null && _me7.localDatabase.db != null) {
	      store.get(id).onsuccess = function (e) {
	        record = e.target.result;
	        for (var key in setObj) {
	          if (record[key] || record[key] == "") {
	            record[key] = setObj[key];
	          };
	        }

	        var request = store.put(record);

	        request.onsuccess = function (es) {
	          if (callback) {
	            var result = [];
	            result.push(record);
	            callback(new Message({
	              success: true,
	              msg: storeName + " store  " + JSON.stringify(record) + "  update",
	              result: result
	            }));
	          }
	        };

	        request.onerror = function (er) {
	          if (callback) {
	            callback(new Message({
	              success: false,
	              msg: er,
	              result: null
	            }));
	          }
	        };
	      }; // fetch   first time
	    }
	  } catch (e) {
	    if (callback) {
	      callback(new Message({
	        success: false,
	        msg: e,
	        result: null
	      }));
	    }
	  }
	};

	exports.DbHelper = DbHelper;
	exports.Message = Message;
	exports.default = DbHelper;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	/*!
	 * @name JavaScript/NodeJS Merge v1.2.0
	 * @author yeikos
	 * @repository https://github.com/yeikos/js.merge

	 * Copyright 2014 yeikos - MIT license
	 * https://raw.github.com/yeikos/js.merge/master/LICENSE
	 */

	;(function (isNode) {

		/**
	  * Merge one or more objects 
	  * @param bool? clone
	  * @param mixed,... arguments
	  * @return object
	  */

		var Public = function Public(clone) {

			return merge(clone === true, false, arguments);
		},
		    publicName = 'merge';

		/**
	  * Merge two or more objects recursively 
	  * @param bool? clone
	  * @param mixed,... arguments
	  * @return object
	  */

		Public.recursive = function (clone) {

			return merge(clone === true, true, arguments);
		};

		/**
	  * Clone the input removing any reference
	  * @param mixed input
	  * @return mixed
	  */

		Public.clone = function (input) {

			var output = input,
			    type = typeOf(input),
			    index,
			    size;

			if (type === 'array') {

				output = [];
				size = input.length;

				for (index = 0; index < size; ++index) {

					output[index] = Public.clone(input[index]);
				}
			} else if (type === 'object') {

				output = {};

				for (index in input) {

					output[index] = Public.clone(input[index]);
				}
			}

			return output;
		};

		/**
	  * Merge two objects recursively
	  * @param mixed input
	  * @param mixed extend
	  * @return mixed
	  */

		function merge_recursive(base, extend) {

			if (typeOf(base) !== 'object') return extend;

			for (var key in extend) {

				if (typeOf(base[key]) === 'object' && typeOf(extend[key]) === 'object') {

					base[key] = merge_recursive(base[key], extend[key]);
				} else {

					base[key] = extend[key];
				}
			}

			return base;
		}

		/**
	  * Merge two or more objects
	  * @param bool clone
	  * @param bool recursive
	  * @param array argv
	  * @return object
	  */

		function merge(clone, recursive, argv) {

			var result = argv[0],
			    size = argv.length;

			if (clone || typeOf(result) !== 'object') result = {};

			for (var index = 0; index < size; ++index) {

				var item = argv[index],
				    type = typeOf(item);

				if (type !== 'object') continue;

				for (var key in item) {

					var sitem = clone ? Public.clone(item[key]) : item[key];

					if (recursive) {

						result[key] = merge_recursive(result[key], sitem);
					} else {

						result[key] = sitem;
					}
				}
			}

			return result;
		}

		/**
	  * Get type of variable
	  * @param mixed input
	  * @return string
	  *
	  * @see http://jsperf.com/typeofvar
	  */

		function typeOf(input) {

			return {}.toString.call(input).slice(8, -1).toLowerCase();
		}

		if (isNode) {

			module.exports = Public;
		} else {

			window[publicName] = Public;
		}
	})(( false ? 'undefined' : _typeof(module)) === 'object' && module && _typeof(module.exports) === 'object' && module.exports);
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)(module)))

/***/ }),
/* 2 */
/***/ (function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ })
/******/ ]);