const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));


function parseUrl(url) {
    const splitUrlArray = url.split('//');
    let finalString = '';

    console.log(splitUrlArray);

    if (splitUrlArray[0] === 'ipfs:') {
        finalString = `ipfs.io/ipfs/${splitUrlArray[1]}`
    };
    if (splitUrlArray[0] === 'https:') {
        finalString = splitUrlArray[1]
    };

    return finalString;
};


const checkNftsListForNftsWithNftTypeOriginators = async (nfts) => {
    let identityNftList = [];

    try {
        await Promise.all(nfts.map(async (nft) => {
            const rawUrl = parseUrl(nft.ipfsUrl);
            console.log(rawUrl)
            const nftUrl = `https://${rawUrl}`;
            const nftMetaData = await fetch(nftUrl);
            const jsonMetaData = await nftMetaData.json();

            console.log("metadata in json: ", jsonMetaData);

            if (jsonMetaData.collection.name === "Identity NFT" && jsonMetaData.collection.family === "Originators") {
                console.log("matching nftType found.... pushing");
                identityNftList.push({ ...jsonMetaData, thisNftIpfsUrl: nft.ipfsUrl, tokenID: nft.nft.NFTokenID });
            };
        }));
    } catch (error) {
        console.error('An error occurred:', error);
    };

    console.log("Final nft list: ", identityNftList);

    return identityNftList
};

module.exports = checkNftsListForNftsWithNftTypeOriginators;