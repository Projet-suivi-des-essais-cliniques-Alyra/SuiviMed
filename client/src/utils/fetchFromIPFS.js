import decryptData from './decryptData';
const ipfsConnection = require('./ipfsConnection');

/**
 * 
 * @param {string} cid
 * @returns data cid
 */
 async function fetchFromIPFS(cid, ENCRYPTION_KEY) {
    let ipfs;
    await ipfsConnection.default.then(res => {
        ipfs = res;
    });

    let decodedData;
    for await (const data of ipfs.cat(cid)) {
        let encodedData = new TextDecoder().decode(data);
        decodedData = decryptData(encodedData, ENCRYPTION_KEY);
    }
    
    // ipfs.files.get(cid, function(err, files) {
    //     files.forEach((file) => {
    //         console.log(file.path)
    //         console.log("File content >> ", file.content.toString('utf8'))
    //     })
    // })
    

    return await decodedData;
}

export default fetchFromIPFS;