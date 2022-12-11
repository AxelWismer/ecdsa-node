import { keccak256 } from "ethereum-cryptography/keccak";
import { utf8ToBytes, toHex } from "ethereum-cryptography/utils";
import { sign, recoverPublicKey } from "ethereum-cryptography/secp256k1";

export function hashMessage(message: string) : Uint8Array {
    return keccak256(utf8ToBytes(message));
}

export async function signMessage(message: string, privateKey: Uint8Array) : Promise<[string, number]> {
    const [signature, recoveryBit] = await sign(hashMessage(message), privateKey, {recovered: true}); 
    return [toHex(signature), recoveryBit];
}

export function getAddress(publicKey: Uint8Array): string {
    return toHex(keccak256(publicKey.slice(1)).slice(-20));
}

export function recoverKey(message: string, signature: string, recoveryBit: number): Uint8Array {
    return recoverPublicKey(hashMessage(message), signature, recoveryBit);
}

export function authenticate(message: string, signature: string, recoveryBit: number): [boolean, string] {
    let address = "";
    let authenticated = true;
    try {
        address = getAddress(recoverKey(message, signature, recoveryBit))
    } catch (error) {
        authenticated = false
    }
    return [authenticated, address];
}
