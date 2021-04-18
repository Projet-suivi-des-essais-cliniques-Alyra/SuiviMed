const base64 = require('base64topdf');

async function base64ToPdf(encodedPdf) {
    return await new Buffer(encodedPdf, 'base64');
}

export default base64ToPdf;