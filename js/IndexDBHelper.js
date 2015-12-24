"use strict";

define(function (require, exports, module) {
	var merge = require('js/lib/merge.js');
	var message = function message(_ref) {
		var success = _ref.success;
		var msg = _ref.msg;
		var result = _ref.result;
		var total = _ref.total;

		return {
			success: success, msg: msg, result: result, total: total
		};
	};
	var dbHelper = function dbHelper() {

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
	dbHelper.prototype.openDatabase = function (dbName, storeName, version, callback) {
		var me = this,
		    vs = 1;
		try {

			if (version) {
				vs = version;
			};
			var openRequest = me.localDatabase.indexedDB.open(dbName, vs);
			openRequest.onerror = function (e) {
				if (callback) {
					callback(new message({
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
					callback(new message({
						success: true,
						msg: "createObjectStore success",
						result: null
					}));
				};
				//});
				// if (callback) {
				// 	callback(new message({
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
						callback(new message({
							success: true,
							msg: "upgradeneeded success",
							result: null
						}));
					};
				});
			};
		} catch (e) {
			if (callback) {
				callback(new message({
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
	dbHelper.prototype.distoryDatabase = function (dbName, callback) {
		var _this = this;

		try {
			(function () {
				var me = _this;
				var deleteDbRequest = me.localDatabase.indexedDB.deleteDatabase(dbName);
				deleteDbRequest.onsuccess = function (e) {
					if (callback) {
						callback(new message({
							success: true,
							msg: 'Database deleted',
							result: null
						}));
					};

					deleteDbRequest.onerror = function (e) {
						if (callback) {
							callback(new message({
								success: false,
								msg: "Database error: " + e.target.errorCode,
								result: null
							}));
						};
					};
				};
			})();
		} catch (e) {
			if (callback) {
				callback(new message({
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
	dbHelper.prototype.createObjectStore = function (storeName, keyPath, valIndex, callback) {
		try {
			var _me = this;
			var def = {
				keyPath: "id",
				autoIncrement: true
			};
			var kp = merge(def, keyPath || {});
			var employeeStore = _me.localDatabase.db.createObjectStore(storeName, kp);
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
					callback(new message({
						success: true,
						msg: 'ok',
						result: null
					}));
				};
			};
		} catch (e) {
			if (callback) {
				callback(new message({
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
	dbHelper.prototype.find = function (storeName, whereObj, isFuzzy, topNum, callback) {
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

			var _me2 = this;
			var transaction = _me2.localDatabase.db.transaction(storeName, "readwrite");
			var _store = transaction.objectStore(storeName);

			if (_me2.localDatabase != null && _me2.localDatabase.db != null) {
				var store = _me2.localDatabase.db.transaction(storeName).objectStore(storeName);

				var request = _store.openCursor();
				var result = [],
				    res = [];
				request.onsuccess = function (e) {
					var cursor = e.target.result;

					if (cursor) {
						var data = cursor.value;
						result.push(data);
						cursor["continue"]();
					} else {
						// var jsonStr = JSON.stringify(employee);
						//var indexes = [];
						if (whereObj) {
							for (var i = 0; i < result.length; i++) {
								for (var key in whereObj) {

									var value = result[i][key];
									//判断whereObj[key]是否默认类型
									if (typeof whereObj[key] == 'object') {
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
							callback(new message({
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
				callback(new message({
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
	dbHelper.prototype.getById = function (storeName, id, callback) {
		try {

			var _me3 = this;
			var transaction = _me3.localDatabase.db.transaction(storeName, "readwrite");
			var store = transaction.objectStore(storeName);

			if (_me3.localDatabase != null && _me3.localDatabase.db != null) {
				store.get(id).onsuccess = function (e) {
					if (callback) {
						callback(new message({
							success: true,
							msg: 'ok',
							result: e.target.result
						}));
					}
				};
			}
		} catch (e) {
			if (callback) {
				callback(new message({
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
	dbHelper.prototype.add = function (storeName, fieldArr, callback) {
		try {
			var _me4 = this;
			var transaction = _me4.localDatabase.db.transaction(storeName, "readwrite");
			var store = transaction.objectStore(storeName);
			if (_me4.localDatabase != null && _me4.localDatabase.db != null) {
				for (var i = 0; i < fieldArr.length; i++) {
					var obj = fieldArr[i];
					var request = store.add(obj);
					request.onsuccess = function (e) {
						if (callback) {
							callback(new message({
								success: true,
								msg: 'ok',
								result: null
							}));
						}
					};

					request.onerror = function (e) {
						if (callback) {
							callback(new message({
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
				callback(new message({
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
	dbHelper.prototype.deleteById = function (storeName, id, callback) {
		try {
			var _me5 = this;
			if (_me5.localDatabase != null && _me5.localDatabase.db != null) {
				var store = _me5.localDatabase.db.transaction(storeName, "readwrite").objectStore(storeName);
				store["delete"](id).onsuccess = function (e) {
					if (callback) {
						callback(new message({
							success: true,
							msg: 'ok',
							result: null
						}));
					}
				};
			}
		} catch (e) {
			if (callback) {
				callback(new message({
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
	dbHelper.prototype.clear = function (storeName, callback) {
		try {

			if (me.localDatabase != null && me.localDatabase.db != null) {
				var store = me.localDatabase.db.transaction(storeName, "readwrite").objectStore(storeName);

				store.clear().onsuccess = function (e) {

					if (callback) {
						callback(new message({
							success: true,
							msg: storeName + " object store cleared",
							result: null
						}));
					}
				};
			}
		} catch (e) {
			if (callback) {
				callback(new message({
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
	dbHelper.prototype.updateById = function (storeName, id, setObj, callback) {
		var _this2 = this;

		try {
			(function () {
				var me = _this2;
				var transaction = me.localDatabase.db.transaction(storeName, "readwrite");
				var store = transaction.objectStore(storeName);

				var record = undefined;
				if (me.localDatabase != null && me.localDatabase.db != null) {
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
								callback(new message({
									success: true,
									msg: storeName + " store  " + JSON.stringify(record) + "  update",
									result: result
								}));
							}
						};

						request.onerror = function (er) {
							if (callback) {
								callback(new message({
									success: false,
									msg: er,
									result: null
								}));
							}
						};
					}; // fetch   first time
				}
			})();
		} catch (e) {
			if (callback) {
				callback(new message({
					success: false,
					msg: e,
					result: null
				}));
			}
		}
	};

	module.exports = dbHelper;
});