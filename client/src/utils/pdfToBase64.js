function pdfToBase64(file) {
    return new Promise((resolve, reject) => {
        let fileReader = new fileReader();
        fileReader.readAsDataURL(file);

        fileReader.onload = () => {
            resolve(fileReader.result);
        };
        
        fileReader.onerror = (error) => {
            reject(error);
        };
    });
}

export default pdfToBase64;