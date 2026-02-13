function resizeCanvas() {
    var canvas = document.getElementById("wobbleCanvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "#f8fcff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const canvas = document.getElementById("wobbleCanvas");
        const ctx = canvas.getContext("2d");

        canvas.addEventListener("click", (event) => {
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            const radius = 10;

            ctx.beginPath()
            ctx.arc(x, y, radius, 0, 2 * Math.PI);
            ctx.fillStyle = "pink";
            ctx.fill();
            ctx.closePath();
        });