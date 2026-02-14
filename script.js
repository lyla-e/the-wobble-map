const canvas = document.getElementById("wobbleCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    var canvas = document.getElementById("wobbleCanvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "#f8fcff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

window.addEventListener("resize", resizeCanvas);

const shapes = []
canvas.addEventListener("click", (event) => {
    const space = canvas.getBoundingClientRect();
    const x = event.clientX - space.left;
    const y = event.clientY - space.top;
    shapes.push({
        x: x, 
        y: y,
        width: 125,
        height: 60,
        angle: Math.random() * Math.PI *2,
        speed: 2
    })
})

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    shapes.forEach(shape => {
        shape.angle += (Math.random() - 0.5) * 0.2;
        shape.x += Math.cos(shape.angle) * shape.speed;
        shape.y += Math.sin(shape.angle) * shape.speed;

        ctx.beginPath();
        ctx.rect(
            shape.x - shape.width / 2,
            shape.y - shape.height / 2,
            shape.width,
            shape.height
        )
        ctx.stroke()
    });

    requestAnimationFrame(animate);
}

animate();