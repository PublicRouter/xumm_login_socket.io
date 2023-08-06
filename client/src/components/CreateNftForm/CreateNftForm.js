import React, { useState } from 'react'
import "./createNftForm.css"

export default function CreateNftForm({setFormOpened, socket}) {
    const [mintNftPayload, setMintNftPayload] = useState({ payload: false });
    const [payloadSigned, setPayloadSigned] = useState(false);

    function closeForm() {
        setFormOpened(false);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("my event: ", event)

        const elements = event.currentTarget.elements;

        const transmissionObject = {
            userName: elements[0].value,
            profession: elements[1].value,
            years: elements[2].value,
            imageFile: elements[3].files[0],
            imageName: elements[3].files[0].name
        };
        console.log("transmissionObject: ", transmissionObject)

        socket.emit('createIpfs', transmissionObject, async (callback) => {
            console.log("Fired inside handleSubmit socket emit")
            const nfTokenMintPayload = await callback;
            console.log("nftTokenMintPayload: ", nfTokenMintPayload);

            // if (nfTokenMintPayload.message !== "failure") {
            //     setDisplay(false);
            // };

            setMintNftPayload(nfTokenMintPayload);

            socket.emit('subToNftMint', nfTokenMintPayload.uuid, async (callback) => {
                const payloadSignedObject = await callback;
                if (payloadSignedObject.signed) {
                    // const rawUrl = parseUrl(nfTokenMintPayload.arrayOfIssuedNft[0].ipfsUrl);
                    // const nftUrl = `https://ipfs.io/ipfs/${rawUrl}`;
                    // const fetchedMetaData = await fetch(nftUrl);
                    // const newMetaData = await fetchedMetaData.json();
                    console.log("NFTokenMint TX Signed!")
                    setPayloadSigned(true);
                    // setLoggedInContext({ ...loggedInContext, nftMetaData: newMetaData })
                }
            })
        });
    };

    return (
        <div className="login-box">
            <div id="closeButtonContainer">
                <button onClick={closeForm} id="closeButton">X</button>

            </div>
            <h2>Identity NFT Data</h2>
            <form>
                <div className="user-box">
                    <input type="text" name="username" required />
                    <label htmlFor="username">Username</label>
                </div>
                <div className="user-box">
                    <input type="text" name="profession" required />
                    <label htmlFor="profession">Profession</label>
                </div>
                <div className="user-box">
                    <input type="text" name="experience" required />
                    <label htmlFor="experience">Experience(years)</label>
                </div>
                <div className="user-box-file">
                    <input type="file" name="nftImage" accept=".jpg,.jpeg" title="" required />
                    <label htmlFor="nftImage">NFT Image file (jpeg, jpg, png)</label>
                </div>
                <button type="submit">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    Submit
                </button>
            </form>
        </div>
    );
}