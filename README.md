# xumm_login_socket.io
integrate xumm api as private key signing mechanism for application login authentication with socket.io

Current Functionality:

- Generate XUMM QR code to scan via XUMM app and sign 'sign-in' payload; allowing application to confirm you own private keys to a xrpl account/wallet.

- If signed-in with owned wallet from QR payload signature, access to 'Profile Page' tab in navigation.

- If current xrpl account owns a 'profile data nft' issued by our application wallet, that nft data is fetched directly from wallet NFTokenPage and IPFS URI is fetched in front-end to be displayed to user.

- Currently access the 'Online Users' tab at bottom of all pages to see all currently conneted online sockets.

Current State of Website Snapshot:

![Xumm Sockets](./client/src/images/currentSite.png)
