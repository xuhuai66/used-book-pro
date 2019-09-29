"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const query_1 = require("./commands/query");
const logic_1 = require("./commands/logic");
const update_1 = require("./commands/update");
const type_1 = require("./utils/type");
exports.Command = {
    eq(val) {
        return new query_1.QueryCommand(query_1.QUERY_COMMANDS_LITERAL.EQ, [val]);
    },
    neq(val) {
        return new query_1.QueryCommand(query_1.QUERY_COMMANDS_LITERAL.NEQ, [val]);
    },
    lt(val) {
        return new query_1.QueryCommand(query_1.QUERY_COMMANDS_LITERAL.LT, [val]);
    },
    lte(val) {
        return new query_1.QueryCommand(query_1.QUERY_COMMANDS_LITERAL.LTE, [val]);
    },
    gt(val) {
        return new query_1.QueryCommand(query_1.QUERY_COMMANDS_LITERAL.GT, [val]);
    },
    gte(val) {
        return new query_1.QueryCommand(query_1.QUERY_COMMANDS_LITERAL.GTE, [val]);
    },
    in(val) {
        return new query_1.QueryCommand(query_1.QUERY_COMMANDS_LITERAL.IN, val);
    },
    nin(val) {
        return new query_1.QueryCommand(query_1.QUERY_COMMANDS_LITERAL.NIN, val);
    },
    geoNear(val) {
        return new query_1.QueryCommand(query_1.QUERY_COMMANDS_LITERAL.GEO_NEAR, [val]);
    },
    geoWithin(val) {
        return new query_1.QueryCommand(query_1.QUERY_COMMANDS_LITERAL.GEO_WITHIN, [val]);
    },
    geoIntersects(val) {
        return new query_1.QueryCommand(query_1.QUERY_COMMANDS_LITERAL.GEO_INTERSECTS, [val]);
    },
    and(...__expressions__) {
        const expressions = type_1.isArray(arguments[0]) ? arguments[0] : Array.from(arguments);
        return new logic_1.LogicCommand(logic_1.LOGIC_COMMANDS_LITERAL.AND, expressions);
    },
    nor(...__expressions__) {
        const expressions = type_1.isArray(arguments[0]) ? arguments[0] : Array.from(arguments);
        return new logic_1.LogicCommand(logic_1.LOGIC_COMMANDS_LITERAL.NOR, expressions);
    },
    or(...__expressions__) {
        const expressions = type_1.isArray(arguments[0]) ? arguments[0] : Array.from(arguments);
        return new logic_1.LogicCommand(logic_1.LOGIC_COMMANDS_LITERAL.OR, expressions);
    },
    set(val) {
        return new update_1.UpdateCommand(update_1.UPDATE_COMMANDS_LITERAL.SET, [val]);
    },
    remove() {
        return new update_1.UpdateCommand(update_1.UPDATE_COMMANDS_LITERAL.REMOVE, []);
    },
    inc(val) {
        return new update_1.UpdateCommand(update_1.UPDATE_COMMANDS_LITERAL.INC, [val]);
    },
    mul(val) {
        return new update_1.UpdateCommand(update_1.UPDATE_COMMANDS_LITERAL.MUL, [val]);
    },
    push(...__values__) {
        const values = type_1.isArray(arguments[0]) ? arguments[0] : Array.from(arguments);
        return new update_1.UpdateCommand(update_1.UPDATE_COMMANDS_LITERAL.PUSH, values);
    },
    pop() {
        return new update_1.UpdateCommand(update_1.UPDATE_COMMANDS_LITERAL.POP, []);
    },
    shift() {
        return new update_1.UpdateCommand(update_1.UPDATE_COMMANDS_LITERAL.SHIFT, []);
    },
    unshift(...__values__) {
        const values = type_1.isArray(arguments[0]) ? arguments[0] : Array.from(arguments);
        return new update_1.UpdateCommand(update_1.UPDATE_COMMANDS_LITERAL.UNSHIFT, values);
    },
    aggregate: {},
    project: {}
};
const pipelineOperators = [
    'abs',
    'add',
    'ceil',
    'divide',
    'exp',
    'floor',
    'ln',
    'log',
    'log10',
    'mod',
    'multiply',
    'pow',
    'sqrt',
    'subtract',
    'trunc',
    'arrayElemAt',
    'arrayToObject',
    'concatArrays',
    'filter',
    'in',
    'indexOfArray',
    'isArray',
    'map',
    'objectToArray',
    'range',
    'reduce',
    'reverseArray',
    'size',
    'slice',
    'zip',
    'and',
    'not',
    'or',
    'cmp',
    'eq',
    'gt',
    'gte',
    'lt',
    'lte',
    'ne',
    'cond',
    'ifNull',
    'switch',
    'dayOfWeek',
    'dateFromParts',
    'dateFromString',
    'dayOfMonth',
    'dayOfWeek',
    'dayOfYear',
    'isoDayOfWeek',
    'isoWeek',
    'isoWeekYear',
    'millisecond',
    'minute',
    'month',
    'second',
    'hour',
    'week',
    'year',
    'literal',
    'mergeObjects',
    'objectToArray',
    'allElementsTrue',
    'anyElementTrue',
    'setDifference',
    'setEquals',
    'setIntersection',
    'setIsSubset',
    'setUnion',
    'concat',
    'dateToString',
    'indexOfBytes',
    'indexOfCP',
    'split',
    'strLenBytes',
    'strLenCP',
    'strcasecmp',
    'substr',
    'substrBytes',
    'substrCP',
    'toLower',
    'toUpper',
    'meta',
    'addToSet',
    'avg',
    'first',
    'last',
    'max',
    'min',
    'push',
    'stdDevPop',
    'stdDevSamp',
    'sum',
    'let'
];
pipelineOperators.forEach(op => {
    let apiName = op;
    if (op === 'ne') {
        apiName = 'neq';
    }
    exports.Command.aggregate[apiName] = function (param) {
        return {
            [`$${op}`]: param
        };
    };
});
const projectionOperators = [
    'slice',
    'elemMatch'
];
projectionOperators.forEach(op => {
    let apiName = op;
    exports.Command.project[apiName] = function (param) {
        return {
            [`$${op}`]: param
        };
    };
});
exports.default = exports.Command;
