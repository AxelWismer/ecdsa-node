import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1";
import { toHex } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";

function getAddress(publicKey) {
  return keccak256(publicKey.slice(1)).slice(-20);
}
function checkPrivateKey(privateKey) {
  return privateKey.length == 64;
}
function checkPrivateKeyError(privateKey) {
  return privateKey.length !== 0 && !checkPrivateKey(privateKey); 
}

function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey }) {
  async function onChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);
    if (checkPrivateKey(privateKey)) {
      const publicKey = secp.getPublicKey(privateKey);
      const address = toHex(getAddress(publicKey));
      setAddress(address);
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
      setAddress("");
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        PrivateKey
        <input placeholder="Type your private key" value={privateKey} onChange={onChange}></input>
      </label>
      {checkPrivateKey(privateKey) ? <div className="balance">Address: {address?address:" - "}</div>: null}
      {checkPrivateKey(privateKey) ? <div className="balance">Balance: {balance}</div>: null}
      {checkPrivateKeyError(privateKey) ? <div className="error" >⚠️ The private key must be 64 characters long</div> : null}

    </div>
  );
}

export default Wallet;
