const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const { authenticate } = require("cryptography");


const balances = {
  "50bf7c38ef838a3e79f0d6630d9498d125074d57": 100, // privateKey:  dad792a5970655dee6b825f82b9c002fde0b1fd68ef380a6679977f7edc67460
  "553a9b297cffdb7347b53e91f3a43dbd428a9ebf": 50, //  privateKey:  ddf6acfcf048d6761d1db5ed9cd842a3daa10f8ca8a540c1a5fe4412f511f5c7
  "82e02197d8e7b890b1c878c49aacc7f4834c388c": 75, //  privateKey:  b4b1e8488ed6888202ca6c1eedc5fef9699eb426b2895187001924268cb5778c
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { message, signature, recoveryBit } = req.body;
  console.log("app.post ~ req.body", req.body);
  const { amount, recipient } = message;  
  const [authenticated, sender] = authenticate(JSON.stringify(message), signature, recoveryBit);
  console.log("app.post ~ sender", sender);
  
  setInitialBalance(sender);
  setInitialBalance(recipient);
  
  if (!authenticated) {
    res.status(400).send({ message: "The autentication failed!" });
  }
  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } 
  else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
