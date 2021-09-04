
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 450;

const image1 = new Image();
image1.src = 'image4.png';

let brightnessMap = [];

class Particle {
    constructor(){
        this.x = Math.random() * canvas.width;
        this.y = 0
        this.speed = 0;
        this.velocity = Math.random() * 3.5;
        this.size = Math.random() * 1.5 + 1;
    }

    update() {
        this.y += this.velocity + (2.5 - brightnessMap[Math.floor(this.y)][Math.floor(this.x)][0]);
        if (this.y >= canvas.height){
            this.y = 0;
            this.x = Math.random() * canvas.width;
        }
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = brightnessMap[Math.floor(this.y)][Math.floor(this.x)][1];
        ctx.arc(this.x, this.y,this.size, 0, Math.PI*2);
        ctx.fill();
    }
}

function init(numberOfParticles, particlesArray){
    for (let i = 0; i < numberOfParticles; i++){
        const particle = new Particle()
        particlesArray.push(particle);
    }
}

function makeImageArray(array, width){
    const reshapedArray = []
    for (i = 0; i < array.length; i += 4){
        pixel = [array[i], array[i+1], array[i+2], array[i+3]]
        y = Math.floor(i / (width*4));
        if (reshapedArray.length-1 < y){
            reshapedArray.push([]);
        }
        reshapedArray[y].push(pixel)
    }
    return reshapedArray;
}

image1.addEventListener('load', function(){
    ctx.drawImage(image1, 0,0);
    const scannedImage = ctx.getImageData(0,0,canvas.width, canvas.height);
    const pixels = makeImageArray(scannedImage.data, canvas.width);
    for (i = 0; i < pixels.length; i++){
        for (j = 0; j < pixels[i].length; j++){
            const pixel = pixels[i][j];
            const R = pixel[0]
            const G = pixel[1]
            const B = pixel[2]
            const brightness = Math.sqrt(R*R*0.299 + G*G*0.587 + B*B*0.114)/100;
            if (brightnessMap.length - 1 < i){
                brightnessMap.push([])
            }
            brightnessMap[i].push([brightness, 'rgb('+R+','+G+','+B+')'])
        }
    }
    console.log(brightnessMap);

    let particlesArray = [];
    const numberOfParticles = 5000;
    init(numberOfParticles, particlesArray);

    function animate(){
        //ctx.drawImage(image1, 0,0);
        ctx.globalAlpha = 0.05;
        ctx.fillStyle = 'rgb(0,0,0)';
        ctx.fillRect(0,0,canvas.width, canvas.height);
        ctx.globalAlpha = 0.2;
    
        for (let i = 0; i < particlesArray.length; i++){
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        requestAnimationFrame(animate);
    }
    animate();
});


