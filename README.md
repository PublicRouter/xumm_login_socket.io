# xumm_login_socket.io
integrate xumm api as private key signing mechanism for application login authentication with socket.io

Current Functionality:

- Generate XUMM QR code to scan via XUMM app and sign 'sign-in' payload; allowing application to confirm you own private keys to a xrpl blockchain account/wallet.

- If signed-in with XRPL Account from QR payload signature, access to 'Profile Page' tab in navigation.

- If signing wallet does not currently own a 'Account Identity NFT' you will have access to a NFT creation form on the 'Profie Page' directly after signing the 'sign-in' payload QR. You can then fill in the form data with info and a desired account image to seamlessly mint a new NFT directly on-chain and store that new NFT to your xrpl account. 

- If signing xrpl blockchain account already owns a 'Account Identity NFT' issued by our application wallet, that nft data is directly retrieved from the decentralized blockchain and the ipfs data hash is fetched so your existing NFT metadata can be loaded into your account to be displayed in 'Profile Page' UI.

- Ability to delete an existing NFT by clicking the 'delete nft' button and burning your existing NFT. After UI is updated and shown no current NFT exists for your account, you will be given access to the 'Create NFT Form' again to enter in new NFT information and mint fresh 'Account Identity' data.

- Once logged in, can open the 'Online Users' tab at bottom of all pages to see all currently logged in and connected users.

Current State of Website Snapshot:

![Xumm Sockets Home Page](./client/src/images/originatorsHome.png)
---
![Xumm Sockets Profile Page](./client/src/images/originatorsProfile.png)

