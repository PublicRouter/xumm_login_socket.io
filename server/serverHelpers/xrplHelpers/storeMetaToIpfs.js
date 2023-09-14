
const { NFTStorage, File, Blob } = require('nft.storage');
require('dotenv').config();
const client = new NFTStorage({ token: process.env.API_KEY });

// The 'mime' npm package helps us set the correct file type on our File objects
const mime = require('mime')

// The 'fs' builtin module on Node.js provides access to the file system
const fs = require('fs')

// The 'path' module provides helpers for manipulating filesystem paths
const path = require('path')

async function main(data) {
    const metadata = await client.store(data);
    return metadata.url
};

async function fileFromPath(filePath) {
    const content = await fs.promises.readFile(filePath)
    const type = mime.getType(filePath)
    console.log("INISDE FILEFROMPATH")
    return new File([content], path.basename(filePath), { type })
};

async function storeMetaToIpfs(userName, country, bio, profession, experience, imagePathString) {
    const imageFile = await fileFromPath(imagePathString);

    console.log("INSIDE CREATEFINAL");
    console.log(imageFile);

    const finalNftMeta =
    {
        "schema": "ipfs://QmNpi8rcXEkohca8iXu7zysKKSJYqCvBJn3xJwga8jXqWU",
        "nftType": "art.v0",
        "name": userName,
        "description": "Originators unique identity NFTs. One will be created for each xrpl account that signs into our application. Used to store immutable account information.",
        "image": imageFile,
        "collection": {
            "name": "Identity NFT",
            "family": "Originators"
        },
        "attributes": [
            {
                "trait_type": "country",
                "value": country
            },
            {
                "trait_type": "bio",
                "value": bio
            },
            {
                "trait_type": "profession",
                "value": profession
            },
            {
                "trait_type": "experience",
                "value": experience
            }
        ]
    };

    const finalNft = JSON.stringify(finalNftMeta);
    const jsonPretty = JSON.stringify(JSON.parse(finalNft), null, 2);
    console.log(jsonPretty);

    //uncomment below to enable actual minting to ipfs
    const metaUrl = await main(finalNftMeta);
    console.log("URI hash to stored metadata on IPFS: ", metaUrl);
    
    return metaUrl
};

//createFinal(@ImagePathUrlString, @userNameString, @classValueInt, @classDescriptionString)
module.exports = storeMetaToIpfs;
