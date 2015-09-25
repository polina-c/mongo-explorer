"use strict";


/// we want this module to be available both in browser client and nodejs server
if (typeof exports == 'undefined'){
    var exports = this['structures'] = {};
}
//////////////////////

exports.ROW_LIMIT = 1000;
exports.COL_LIMIT = 50;

exports.AGGREGATE_QUERY = 
	'[\n' +
	'    {"$match": { } },\n' +
	'    {"$group": { "_id": "$type", "count": { "$sum": 1 }}},\n' +
	'    {"$sort": { "count": -1 } }\n' +
	']\n';

exports.FIND_QUERY =
	'{\n' +
	'    "query": {"type": "STANDARD"},\n' +
	'    "projection":{"zip":1, "type":1, "state":1, "primary_city":1, "estimated_population":1},\n' +
	'    "sort": {"estimated_population": -1}\n' +
'}\n';
	
	