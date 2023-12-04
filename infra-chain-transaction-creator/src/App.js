// Base application skeleton built with create-react-app
import './App.css';
import React, { useState } from 'react';

// Use of elliptic library for ECC taken from Simply Explained's YouTube 
// blockchain tutorial Part 4: Signing Transactions, at
// https://www.youtube.com/watch?v=kWQ84S13-hw&list=PLzvRQMJ9HDiTqZmbtFisdXFxul5k0F-Q4&index=4.
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');


function App() {
  const [keyPair, setKeyPair] = useState(null);

  const generateKeyPair = () => {
    if (keyPair !== null) return;
  
    setKeyPair(ec.genKeyPair());
  }

  let publicKey; let privateKey; let beautifiedPublicKey;
  if (keyPair) {
    publicKey = keyPair.getPublic('hex');
    privateKey = keyPair.getPrivate('hex');

    const publicKeyLength = publicKey.length;
    const mid = Math.floor(publicKeyLength / 2);
    beautifiedPublicKey = publicKey.slice(0, mid) + "\n" + publicKey.slice(mid);
  }

  return (
    <div className="App">
      <header>
        <h1>
          InfraChain Transaction Builder
        </h1>
      </header>

      <body>
        <button onClick={generateKeyPair}>
          Generate KeyPair
        </button>
        {
          keyPair && (
            <p>
              Public key: {beautifiedPublicKey}
              <br/>
              Private key: {privateKey}
            </p>
          )
        }

        <br/><br/>
        <form>
          <label for="structureId">Structure Id:</label><br/>
          <input id="structureId" name="structureId" placeholder="e.g. 12345" />
          <br/><br/>

          <span>Structure Condition:</span>
          <input id="veryPoor" name="structureCondition" type="radio" />
          <label for="veryPoor">Very Poor</label>
          <input id="poor" name="structureCondition" type="radio" />
          <label for="poor">Poor</label>
          <input id="fair" name="structureCondition" type="radio" />
          <label for="fair">Fair</label>
          <input id="good" name="structureCondition" type="radio" />
          <label for="good">Good</label>
          <input id="veryGood" name="structureCondition" type="radio" />
          <label for="veryGood">Very Good</label>
          <br/><br/>

          <label for="reportSummary">Report Summary:</label><br/>
          <input id="reportSummary" name="reportSummary" placeholder="Keep it brief..." />
          <br/><br/>

          <label for="reportLink">Report Link:</label><br/>
          <input id="reportLink" name="reportLink" placeholder="https://drive.google.com/share/..." />
          <br/><br/>

          <label for="followUpDate">Recommended Follow-Up Date:</label><br/>
          <input id="followUpDate" name="followUpDate" placeholder="mm/dd/yyyy" />
          <br/><br/>

          <label for="publicKey">Public Key:</label><br/>
          <input id="publicKey" name="publicKey" placeholder="The longer one..." />
          <br/><br/>
          
          <label for="privateKey">Private Key:</label><br/>
          <input id="privateKey" name="privateKey" placeholder="The shorter one..." />
          <br/><br/>

          <input type="submit" value="Submit!" />
          <br/><br/>
        </form>
      </body>
    </div>
  );
}

export default App;
