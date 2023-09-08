export default function extractIPFSHash(uri) {
    // Known IPFS gateways
    const gateways = [
        'ipfs.io/ipfs/',
        'cloudflare-ipfs.com/ipfs/',
        'gateway.pinata.cloud/ipfs/',
        // ... add more known gateways
    ];

    // Regular expression to match CIDv0, CIDv1, and subsequent JSON content
    const cidPattern = /(?:[Qm][a-zA-Z0-9]{44,50}|b[a-zA-Z0-9]{50,60})(\/\w+\.json)?/;

    // Search for a direct CID in the URI
    let match = uri.match(cidPattern);
    if (match) return match[0];

    // Check for known gateways
    for (let gateway of gateways) {
        if (uri.includes(gateway)) {
            match = uri.split(gateway)[1].match(cidPattern);
            if (match) return match[1] ? match[0] + match[1] : match[0];
        }
    };

    // If no match found, return null or a similar default value
    return null;
};

