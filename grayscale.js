
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d')
canvas.width = 800;
canvas.height = 450;

const image1 = new Image();
image1.src = 'image1.png';

image1.addEventListener('load', function(){
    ctx.drawImage(image1,0,0, canvas.width,canvas.height);
    const scannedImage = ctx.getImageData(0,0,canvas.width, canvas.height);
    console.log(scannedImage);

    const scannedData = scannedImage.data;
    for (let i = 0; i < scannedData.length; i += 4){
        const red = scannedData[i]
        const green = scannedData[i+1]
        const blue = scannedData[i+2]
        const grayscale = (red + green + blue)/3
        scannedData[i] = grayscale;
        scannedData[i+1] = grayscale;
        scannedData[i+2] = grayscale;
    }
    scannedImage.data = scannedData;
    ctx.putImageData(scannedImage,0,0)
});
