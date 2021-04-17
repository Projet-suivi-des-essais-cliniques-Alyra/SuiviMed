const ipfsConnection = require('./ipfsConnection');

/**
 * 
 * @param {Object} encryptedData 
 * @returns data cid
 */
async function sendToIPFS(encryptedData) {
    let ipfs;
    await ipfsConnection.default.then(res => {
        console.log(res);
        ipfs = res;
    });

    return ipfs.add(encryptedData);
}

export default sendToIPFS;