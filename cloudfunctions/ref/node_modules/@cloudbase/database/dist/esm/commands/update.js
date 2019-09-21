import { SYMBOL_UNSET_FIELD_NAME, SYMBOL_UPDATE_COMMAND } from '../helper/symbol';
export const SET = 'set';
export const REMOVE = 'remove';
export const INC = 'inc';
export const MUL = 'mul';
export const PUSH = 'push';
export const POP = 'pop';
export const SHIFT = 'shift';
export const UNSHIFT = 'unshift';
export var UPDATE_COMMANDS_LITERAL;
(function (UPDATE_COMMANDS_LITERAL) {
    UPDATE_COMMANDS_LITERAL["SET"] = "set";
    UPDATE_COMMANDS_LITERAL["REMOVE"] = "remove";
    UPDATE_COMMANDS_LITERAL["INC"] = "inc";
    UPDATE_COMMANDS_LITERAL["MUL"] = "mul";
    UPDATE_COMMANDS_LITERAL["PUSH"] = "push";
    UPDATE_COMMANDS_LITERAL["POP"] = "pop";
    UPDATE_COMMANDS_LITERAL["SHIFT"] = "shift";
    UPDATE_COMMANDS_LITERAL["UNSHIFT"] = "unshift";
})(UPDATE_COMMANDS_LITERAL || (UPDATE_COMMANDS_LITERAL = {}));
export class UpdateCommand {
    constructor(operator, operands, fieldName) {
        this._internalType = SYMBOL_UPDATE_COMMAND;
        Object.defineProperties(this, {
            _internalType: {
                enumerable: false,
                configurable: false,
            },
        });
        this.operator = operator;
        this.operands = operands;
        this.fieldName = fieldName || SYMBOL_UNSET_FIELD_NAME;
    }
    _setFieldName(fieldName) {
        const command = new UpdateCommand(this.operator, this.operands, fieldName);
        return command;
    }
}
export function isUpdateCommand(object) {
    return object && (object instanceof UpdateCommand) && (object._internalType === SYMBOL_UPDATE_COMMAND);
}
export function isKnownUpdateCommand(object) {
    return isUpdateCommand(object) && (object.operator.toUpperCase() in UPDATE_COMMANDS_LITERAL);
}
export default UpdateCommand;
