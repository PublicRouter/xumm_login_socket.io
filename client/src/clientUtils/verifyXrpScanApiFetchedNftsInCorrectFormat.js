import extractIPFSHash from "./extractIPFSHash";

export default async function verifyXrpScanApiFetchedNftsInCorrectFormat(fetchedNftsArray) {
    const nftsMetaDataObjects = [];

    for (let i = 0; i < fetchedNftsArray.length; i++) {
        if (fetchedNftsArray[i].URI) {
            try {
                //extract raw ipfs hash from URI format
                const ipfsHash = extractIPFSHash(fetchedNftsArray[i].URI);
                //fetch ipfs using ipfs.io/ipfs gateway for hash data
                const nftMetaData = await fetch(`https://ipfs.io/ipfs/${ipfsHash}`);

                // store content type of the response to variable
                const contentType = nftMetaData.headers.get("content-type");
                // check if content type is proper "application/json" format (potentially incorrect format ipfs lookup)
                if (contentType && contentType.includes("application/json")) {
                    const nftMetaJson = await nftMetaData.json();
                    console.log("CHECKING--------------------------", nftMetaJson);
                    nftsMetaDataObjects.push(nftMetaJson);
                } else {
                    console.warn(`Expected application/json but received ${contentType || "unknown"}. Skipping parsing for IPFS hash: ${ipfsHash}`);
                }

            } catch (error) {
                console.log(error);
            }
        }
    };

    return nftsMetaDataObjects
};

