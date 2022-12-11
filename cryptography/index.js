"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = exports.recoverKey = exports.getAddress = exports.signMessage = exports.hashMessage = void 0;
const keccak_1 = require("ethereum-cryptography/keccak");
const utils_1 = require("ethereum-cryptography/utils");
const secp256k1_1 = require("ethereum-cryptography/secp256k1");
function hashMessage(message) {
    return (0, keccak_1.keccak256)((0, utils_1.utf8ToBytes)(message));
}
exports.hashMessage = hashMessage;
function signMessage(message, privateKey) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, secp256k1_1.sign)(hashMessage(message), privateKey, { recovered: true });
    });
}
exports.signMessage = signMessage;
function getAddress(publicKey) {
    return (0, utils_1.toHex)((0, keccak_1.keccak256)(publicKey.slice(1)).slice(-20));
}
exports.getAddress = getAddress;
function recoverKey(message, signature, recoveryBit) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, secp256k1_1.recoverPublicKey)(hashMessage(message), signature, recoveryBit);
    });
}
exports.recoverKey = recoverKey;
function authenticate(message, signature, recoveryBit, address) {
    return __awaiter(this, void 0, void 0, function* () {
        const publicKey = yield (0, secp256k1_1.recoverPublicKey)(hashMessage(message), signature, recoveryBit);
        return address === getAddress(publicKey);
    });
}
exports.authenticate = authenticate;
