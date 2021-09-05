const canvas = document.getElementById("canvas1")
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particleArray = [];
let numberOfParticles = 5000

const mouse = {
    x: null,
    y: null,
    radius: 150
}

function makePixelArray(data, width){
    let reshapedArray = []
    for (i = 0; i < data.length; i+=4){
        pixel = [data[i], data[i+1], data[i+2], data[i+3]]
        let y = Math.floor(i/(width*4));
        if (reshapedArray.length - 1 < y){
            reshapedArray.push([])
        }
        reshapedArray[y].push(pixel);        
    }
    return reshapedArray;
}

class Particle {
    constructor(x,y){
        this.x = x
        this.y = y
        this.size = 3;
        this.og_x = this.x;
        this.og_y = this.y;
        this.density = 30 * Math.random() + 1
    }

    draw(){
        ctx.fillStyle = 'white'
        ctx.beginPath();
        ctx.arc(this.x,this.y, this.size, 0, Math.PI *2)
        ctx.closePath();
        ctx.fill();
    }

    update(){
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx*dx + dy*dy);
        let ax = dx/distance;
        let ay = dy/distance;
        let force = (mouse.radius - distance)/mouse.radius
        if (distance <= mouse.radius){
            this.x -=  force * ax * this.density;
            this.y -= force * ay * this.density;
        }
        else {
            this.x -= (this.x - this.og_x)/10;
            this.y -= (this.y - this.og_y)/10;
        }
    }
}

window.addEventListener('mousemove', function(event){
    mouse.x = event.x
    mouse.y = event.y
});

ctx.fillStyle = 'white';
ctx.font = '90px Leichenhaus';
ctx.fillText('VENOM', 60, 100);
const textCoordinates = ctx.getImageData(0,0,canvas.width,canvas.height);
console.log(textCoordinates);
let pixelArray = makePixelArray(textCoordinates.data, canvas.width);
console.log(canvas.height, canvas.width)
console.log(pixelArray.length, pixelArray[0].length)
console.log(pixelArray)
function init(){
    particleArray = []
    for (let i = 0,height = pixelArray.length; i < height; i++){
        for (let j = 0, width=pixelArray[i].length; j < width; j++){
            if (pixelArray[i][j][3] > 253){
                if (Math.random() > 0.75) {
                particleArray.push(new Particle(j*4,i*4));
                }
            }
        }
    }
}

init();

function animate(){
    ctx.clearRect(0,0,canvas.width, canvas.height);
    for(let i = 0; i < particleArray.length; i++){
        particleArray[i].draw();
        particleArray[i].update();
    }
    connect();
    requestAnimationFrame(animate);
}

function connect(){
    for (i=0; i<particleArray.length; i++){
        for (j=i+1; j<particleArray.length; j++){
            const particle1 = particleArray[i];
            const particle2 = particleArray[j];
            const distance = Math.sqrt((particle1.x - particle2.x)**2 + (particle1.y-particle2.y)**2)
            if (distance < 15) {
                ctx.strokeStyle = "white"
                ctx.lineWidth = 2
                ctx.beginPath()
                ctx.moveTo(particle1.x, particle1.y)
                ctx.lineTo(particle2.x, particle2.y);
                ctx.stroke()
            }
        }
    }
}

animate();