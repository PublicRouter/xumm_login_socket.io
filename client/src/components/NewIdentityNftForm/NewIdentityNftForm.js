import { useState } from "react";


export default function NewIdentityNftForm({ socket }) {

    const [mintNftPayload, setMintNftPayload] = useState({ payload: false });
    const [payloadSigned, setPayloadSigned] = useState(false);

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
        <div className='formMain'>
            <h3 id="noNftText">Account currently does not own a Identity NFT.</h3>

            <div className='profileFormDiv'>
                <form onSubmit={handleSubmit} className="profileForm" >
                    <input type="text" name="username" placeholder="Username" />
                    <input type="text" name="profession" placeholder="Profession" />
                    <input type="text" name="years" placeholder="Experience(yrs)" />
                    <input type="file" name="nftImage" placeholder="NFT Image file(jpeg, png)" />
                    <button type="submit">Create NFT</button>
                </form>
                {mintNftPayload.payload ?
                    <div className='mintNftQrDiv'>
                        <img src={mintNftPayload.qrImage} />
                        <a href={mintNftPayload.qrLink} />
                    </div>
                    : null
                }
                {payloadSigned ? 
                    <p>nftMint payload signed and verified!</p>
                : null
                }

            </div>
        </div>
    )

}