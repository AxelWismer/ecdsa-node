import { keccak256 } from "ethereum-cryptography/keccak";
import { utf8ToBytes, toHex } from "ethereum-cryptography/utils";
import { sign, recoverPublicKey } from "ethereum-cryptography/secp256k1";

export function hashMessage(message: string) : Uint8Array {
    return keccak256(utf8ToBytes(message));
}

export async function signMessage(message: string, privateKey: Uint8Array) : Promise<[Uint8Array, number]> {
    return sign(hashMessage(message), privateKey, {recovered: true});
}

export function getAddress(publicKey: Uint8Array): string {
    return toHex(keccak256(publicKey.slice(1)).slice(-20));
}

export async function recoverKey(message: string, signature: Uint8Array, recoveryBit: number): Promise<Uint8Array> {
    return recoverPublicKey(hashMessage(message), signature, recoveryBit);
}

export async function authenticate(message: string, signature: Uint8Array, recoveryBit: number, address: string): Promise<boolean> {
    const publicKey = await recoverPublicKey(hashMessage(message), signature, recoveryBit); 
    return address === getAddress(publicKey);
}
