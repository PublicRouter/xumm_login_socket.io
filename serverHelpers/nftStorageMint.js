
const { NFTStorage, File, Blob } = require('nft.storage') ;
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

async function createFinal(imagePathString, userName, classValue, classDescription) {
    const imageFile = await fileFromPath(imagePathString)
    console.log("INSIDE CREATEFINAL")
    console.log(imageFile)
    const finalNftMeta =
    {
        "schema": "ipfs://QmNpi8rcXEkohca8iXu7zysKKSJYqCvBJn3xJwga8jXqWU",
        "nftType": "Originators.v0",
        "name": userName,
        "description": "Originators unique identity NFTs. One will be created for each xrpl account that signs into our application. Used to store immutable account information.",
        "image": imageFile,
        "collection": {
            "name": "Identity NFT",
            "family": "Originators"
        },
        "attributes": [
            {
                "trait_type": "class",
                "value": classValue,
                "description": classDescription
            },
           
        ]
    };

    const finalNft = JSON.stringify(finalNftMeta);
    const jsonPretty = JSON.stringify(JSON.parse(finalNft), null, 2);
    console.log(jsonPretty)
    // console.log(jsonPretty);

    //uncomment below to enable actual minting to ipfs
    main(finalNftMeta);
};

//createFinal(@ImagePathUrlString, @userNameString, @classValueInt, @classDescriptionString)

module.exports = createFinal;