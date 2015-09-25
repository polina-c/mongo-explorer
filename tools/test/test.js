var should = require("should"); // https://github.com/shouldjs/should.js
var controller = require("./../../app/controllers/explorer.server.controller.js");
var Q = require("Q");
var structures = require("./../../public/js/structures.js");


var CONN_STRING = "mongodb://auser:apassword@ds037283.mongolab.com:37283/mongo-explorer-test";
var COLL_NAME = "us-zip-codes";
var req, res;

var tests = [];
tests.push(getCollections());
tests.push(getCollectionsWrongConnection());
tests.push(getCollectionsWrongConnectionFormat());
tests.push(runQueryFind());
tests.push(runQueryAggr());
tests.push(runQueryWrongConnection());
tests.push(runQueryWrongConnectionFormat());
tests.push(runQueryWrongCollection());
tests.push(runQueryEmpty());
tests.push(runQueryWrongJSON());
tests.push(runQueryWrongQuery());

Q.all(tests	
 ).then(function (values) {
	console.log(values.length + " tests passed.");
}).catch(function (err) {
	throw err;
}).done();




function getCollections() {
	return Q.Promise(function (resolve, reject, notify) {
		req = { query: { conn: CONN_STRING } };
		res = { json: resolve }
		controller.getCollectionsHTML(req, res, undefined);
	}).then(function (output) {
		should(output).have.property('err', null);
		should(output).have.property('res');
		should(output.res).be.instanceof(Array);
		should(output.res[0].name).be.instanceof(String);
		console.log("---- test passed: getCollections ---------------------------");
		return true;
	});
}

function getCollectionsWrongConnection() {
	return Q.Promise(function (resolve, reject, notify) {
		req = { query: { conn: "mongodb://ha:ha@ds037283.mongolab.com:37283/mongo-explorer-test" } };
		res = { json: resolve }
		controller.getCollectionsHTML(req, res, undefined);
	}).then(function (output) {
		should(output).have.property('err');
		should(output).have.property('res', null);
		should(output).have.property('err');
		should(output.err.errType).startWith("Mongo error.");
		should(output.err.operational).be.equal(true);
		console.log("---- test passed: getCollectionsWrongConnection ---------------------------");
		return true;
	});
}
function getCollectionsWrongConnectionFormat() {
	return Q.Promise(function (resolve, reject, notify) {
		req = { query: { conn: "hahaha" } };
		res = { json: resolve }
		controller.getCollectionsHTML(req, res, undefined);
	}).then(function (output) {
		should(output).have.property('err');
		should(output).have.property('res', null);
		should(output.err.errType).startWith("Connection string format error.");
		should(output.err.operational).be.equal(true);
		console.log("---- test passed: getCollectionsWrongConnectionFormat ---------------------------");
		return true;
	});
}


function runQueryFind() {
	return Q.Promise(function (resolve, reject, notify) {
		req = { query: { conn: CONN_STRING, coll: COLL_NAME, operation: "find", q: structures.FIND_QUERY } };
		res = { json: resolve }
		controller.runQueryHTML(req, res, undefined);
	}).then(function (output) {
		should(output).have.property('err', null);
		should(output).have.property('res');
		should(output.res).be.instanceof(Array);
		should(output.res.length).be.equal(structures.ROW_LIMIT);
		console.log("---- test passed: runQueryFind ---------------------------");
		return true;
	});
}

function runQueryAggr() {
	return Q.Promise(function (resolve, reject, notify) {
		req = { query: { conn: CONN_STRING, coll: COLL_NAME, operation: "aggr", q: structures.AGGREGATE_QUERY } };
		res = { json: resolve }
		controller.runQueryHTML(req, res, undefined);
	}).then(function (output) {
		should(output).have.property('err', null);
		should(output).have.property('res');
		should(output.res).be.instanceof(Array);
		should(output.res.length).be.equal(4);
		console.log("---- test passed: runQueryAggr ---------------------------");
		return true;
	});
}


function runQueryWrongConnection() {
	return Q.Promise(function (resolve, reject, notify) {
		req = { query: { conn: "mongodb://ha:ha@ds037283.mongolab.com:37283/mongo-explorer-test", coll: COLL_NAME, operation: "aggr", q: structures.AGGREGATE_QUERY } };
		res = { json: resolve }
		controller.runQueryHTML(req, res, undefined);
	}).then(function (output) {
		should(output).have.property('err');
		should(output).have.property('res', null);
		should(output).have.property('err');
		should(output.err.errType).startWith("Query execution error.");
		should(output.err.operational).be.equal(true);
		console.log("---- test passed: runQueryWrongConnection ---------------------------");
		return true;
	});
}

function runQueryWrongCollection() {
	return Q.Promise(function (resolve, reject, notify) {
		req = { query: { conn: CONN_STRING, coll: "hahaha", operation: "aggr", q: structures.AGGREGATE_QUERY } };
		res = { json: resolve }
		controller.runQueryHTML(req, res, undefined);
	}).then(function (output) {
		should(output).have.property('err', null);
		should(output).have.property('res', []);
		console.log("---- test passed: runQueryWrongConnection ---------------------------");
		return true;
	});
}

function runQueryWrongConnectionFormat() {
	return Q.Promise(function (resolve, reject, notify) {
		req = { query: { conn: "hahaha", coll: COLL_NAME, operation: "aggr", q: structures.AGGREGATE_QUERY } };
		res = { json: resolve }
		controller.runQueryHTML(req, res, undefined);
	}).then(function (output) {
		should(output).have.property('err');
		should(output).have.property('res', null);
		should(output.err.errType).startWith("Connection string format error.");
		should(output.err.operational).be.equal(true);
		console.log("---- test passed: runQueryWrongConnectionFormat ---------------------------");
		return true;
	});
}



function runQueryEmpty() {
	return Q.Promise(function (resolve, reject, notify) {
		req = { query: { conn: CONN_STRING, coll: COLL_NAME, operation: "find", q: "" } };
		res = { json: resolve }
		controller.runQueryHTML(req, res, undefined);
	}).then(function (output) {
		should(output).have.property('err');
		should(output).have.property('res', null);
		should(output).have.property('err');
		should(output.err.details).startWith("SyntaxError:");
		console.log("---- test passed: runQueryEmptyQuery ---------------------------");
		return true;
	});
}

function runQueryWrongJSON() {
	return Q.Promise(function (resolve, reject, notify) {
		req = { query: { conn: CONN_STRING, coll: COLL_NAME, operation: "find", q: "ha ha" } };
		res = { json: resolve }
		controller.runQueryHTML(req, res, undefined);
	}).then(function (output) {
		should(output).have.property('err');
		should(output).have.property('res', null);
		should(output).have.property('err');
		should(output.err.details).startWith("SyntaxError:");
		console.log("---- test passed: runQueryWrongJSON -------------------------------");
		return true;
	});
}

function runQueryWrongQuery() {
	return Q.Promise(function (resolve, reject, notify) {
		req = { query: { conn: CONN_STRING, coll: COLL_NAME, operation: "find", q: '{ "query": { "$haha": 25 } }' } };
		res = { json: resolve }
		controller.runQueryHTML(req, res, undefined);
	}).then(function (output) {
		should(output).have.property('err');
		should(output).have.property('res', null);
		should(output).have.property('err');
		should(output.err.errType).startWith("Query execution error.");
		console.log("---- test passed: runQueryWrongQuery -------------------------------");
		return true;
	});
}
