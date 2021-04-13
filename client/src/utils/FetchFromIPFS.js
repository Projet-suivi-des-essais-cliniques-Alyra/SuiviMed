import decryptData from './decryptData';
const ipfsConnection = require('./ipfsConnection');

/**
 * 
 * @param {string} cid
 * @returns data cid
 */
 async function FetchFromIPFS(cid, ENCRYPTION_KEY) {
    let ipfs;
    await ipfsConnection.default.then(res => {
        ipfs = res;
    });

    let decodedData;
    for await (const data of ipfs.cat(cid)) {
        let encodedData = new TextDecoder().decode(data);
        decodedData = decryptData(encodedData, ENCRYPTION_KEY);
    }

    return await JSON.parse(decodedData);
}

export default FetchFromIPFS;