import { QueryCommand, QUERY_COMMANDS_LITERAL } from './commands/query';
import { LogicCommand, LOGIC_COMMANDS_LITERAL } from './commands/logic';
import { UpdateCommand, UPDATE_COMMANDS_LITERAL } from './commands/update';
import { isArray } from './utils/type';
export const Command = {
    eq(val) {
        return new QueryCommand(QUERY_COMMANDS_LITERAL.EQ, [val]);
    },
    neq(val) {
        return new QueryCommand(QUERY_COMMANDS_LITERAL.NEQ, [val]);
    },
    lt(val) {
        return new QueryCommand(QUERY_COMMANDS_LITERAL.LT, [val]);
    },
    lte(val) {
        return new QueryCommand(QUERY_COMMANDS_LITERAL.LTE, [val]);
    },
    gt(val) {
        return new QueryCommand(QUERY_COMMANDS_LITERAL.GT, [val]);
    },
    gte(val) {
        return new QueryCommand(QUERY_COMMANDS_LITERAL.GTE, [val]);
    },
    in(val) {
        return new QueryCommand(QUERY_COMMANDS_LITERAL.IN, val);
    },
    nin(val) {
        return new QueryCommand(QUERY_COMMANDS_LITERAL.NIN, val);
    },
    geoNear(val) {
        return new QueryCommand(QUERY_COMMANDS_LITERAL.GEO_NEAR, [val]);
    },
    geoWithin(val) {
        return new QueryCommand(QUERY_COMMANDS_LITERAL.GEO_WITHIN, [val]);
    },
    geoIntersects(val) {
        return new QueryCommand(QUERY_COMMANDS_LITERAL.GEO_INTERSECTS, [val]);
    },
    and(...__expressions__) {
        const expressions = isArray(arguments[0]) ? arguments[0] : Array.from(arguments);
        return new LogicCommand(LOGIC_COMMANDS_LITERAL.AND, expressions);
    },
    nor(...__expressions__) {
        const expressions = isArray(arguments[0]) ? arguments[0] : Array.from(arguments);
        return new LogicCommand(LOGIC_COMMANDS_LITERAL.NOR, expressions);
    },
    or(...__expressions__) {
        const expressions = isArray(arguments[0]) ? arguments[0] : Array.from(arguments);
        return new LogicCommand(LOGIC_COMMANDS_LITERAL.OR, expressions);
    },
    set(val) {
        return new UpdateCommand(UPDATE_COMMANDS_LITERAL.SET, [val]);
    },
    remove() {
        return new UpdateCommand(UPDATE_COMMANDS_LITERAL.REMOVE, []);
    },
    inc(val) {
        return new UpdateCommand(UPDATE_COMMANDS_LITERAL.INC, [val]);
    },
    mul(val) {
        return new UpdateCommand(UPDATE_COMMANDS_LITERAL.MUL, [val]);
    },
    push(...__values__) {
        const values = isArray(arguments[0]) ? arguments[0] : Array.from(arguments);
        return new UpdateCommand(UPDATE_COMMANDS_LITERAL.PUSH, values);
    },
    pop() {
        return new UpdateCommand(UPDATE_COMMANDS_LITERAL.POP, []);
    },
    shift() {
        return new UpdateCommand(UPDATE_COMMANDS_LITERAL.SHIFT, []);
    },
    unshift(...__values__) {
        const values = isArray(arguments[0]) ? arguments[0] : Array.from(arguments);
        return new UpdateCommand(UPDATE_COMMANDS_LITERAL.UNSHIFT, values);
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
    Command.aggregate[apiName] = function (param) {
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
    Command.project[apiName] = function (param) {
        return {
            [`$${op}`]: param
        };
    };
});
export default Command;
