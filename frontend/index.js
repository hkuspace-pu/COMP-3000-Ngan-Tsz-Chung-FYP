// React
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// NEAR
import { Wallet } from './near-wallet';
import { createRoot } from "react-dom/client";
const CONTRACT_ADDRESS = process.env.CONTRACT_NAME

// When creating the wallet you can optionally ask to create an access key
// Having the key enables to call non-payable methods without interrupting the user to sign
const wallet = new Wallet({ createAccessKeyFor: CONTRACT_ADDRESS })
const rootElement = document.getElementById("root");
const root = createRoot(rootElement);
// Setup on page load
window.onload = async () => {
  const isSignedIn = await wallet.startUp()

  root.render(
    <React.StrictMode>
        <App isSignedIn={isSignedIn} contractId={CONTRACT_ADDRESS} wallet={wallet} />,
    </React.StrictMode>

  
);

}