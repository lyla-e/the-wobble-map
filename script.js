const canvas = document.getElementById("wobbleCanvas");
const ctx = canvas.getContext("2d");

// === VIEWPORT SIZING — excludes taskbar/browser UI ===
function resizeCanvas() {
    const vp = window.visualViewport;
    canvas.width  = vp ? vp.width  : window.innerWidth;
    canvas.height = vp ? vp.height : window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);
if (window.visualViewport) window.visualViewport.addEventListener("resize", resizeCanvas);
resizeCanvas();

const shapes = [];

// How large each box's personal wobble zone is (in pixels from center)
const WOBBLE_RADIUS_X = 80;
const WOBBLE_RADIUS_Y = 60;

canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    shapes.push({
        x: x,
        y: y,
        // Store spawn point as the center of this box's personal wobble zone
        originX: x,
        originY: y,
        width:  125,
        height: 60,
        angle:  Math.random() * Math.PI * 2,
        speed:  2,
        number: shapes.length + 1
    });
});

// === BOX-TO-BOX OVERLAP CHECK ===
function boxesOverlap(a, b) {
    return (
        a.x - a.width  / 2 < b.x + b.width  / 2 &&
        a.x + a.width  / 2 > b.x - b.width  / 2 &&
        a.y - a.height / 2 < b.y + b.height / 2 &&
        a.y + a.height / 2 > b.y - b.height / 2
    );
}

// === RESOLVE OVERLAP — separates on shortest axis and bounces ===
function resolveCollision(a, b) {
    const overlapX = (a.width  + b.width)  / 2 - Math.abs(a.x - b.x);
    const overlapY = (a.height + b.height) / 2 - Math.abs(a.y - b.y);

    if (overlapX < overlapY) {
        const dir = a.x < b.x ? -1 : 1;
        a.x += dir * overlapX / 2;
        b.x -= dir * overlapX / 2;
        a.angle = Math.PI - a.angle;
        b.angle = Math.PI - b.angle;
    } else {
        const dir = a.y < b.y ? -1 : 1;
        a.y += dir * overlapY / 2;
        b.y -= dir * overlapY / 2;
        a.angle = -a.angle;
        b.angle = -b.angle;
    }
}

// === MAIN LOOP ===
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const damping  = 0.8;
    const minSpeed = 0.5;

    shapes.forEach((shape, i) => {

        // Wobble movement
        shape.angle += (Math.random() - 0.5) * 0.2;
        shape.x += Math.cos(shape.angle) * shape.speed;
        shape.y += Math.sin(shape.angle) * shape.speed;

        // Each box's personal wobble zone boundaries
        const left   = shape.originX - WOBBLE_RADIUS_X;
        const right  = shape.originX + WOBBLE_RADIUS_X;
        const top    = shape.originY - WOBBLE_RADIUS_Y;
        const bottom = shape.originY + WOBBLE_RADIUS_Y;

        // Bounce off personal zone walls
        if (shape.x - shape.width / 2 < left) {
            shape.x     = left + shape.width / 2;
            shape.angle = Math.PI - shape.angle;
            shape.speed *= damping;
        } else if (shape.x + shape.width / 2 > right) {
            shape.x     = right - shape.width / 2;
            shape.angle = Math.PI - shape.angle;
            shape.speed *= damping;
        }

        if (shape.y - shape.height / 2 < top) {
            shape.y     = top + shape.height / 2;
            shape.angle = -shape.angle;
            shape.speed *= damping;
        } else if (shape.y + shape.height / 2 > bottom) {
            shape.y     = bottom - shape.height / 2;
            shape.angle = -shape.angle;
            shape.speed *= damping;
        }

        shape.speed = Math.max(shape.speed, minSpeed);

        // Box-to-box collisions
        for (let j = i + 1; j < shapes.length; j++) {
            if (boxesOverlap(shape, shapes[j])) {
                resolveCollision(shape, shapes[j]);
            }
        }

        // Draw personal wobble zone (subtle dashed box)
        ctx.save();
        ctx.strokeStyle = "rgba(0, 0, 0, 0.12)";
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(
            shape.originX - WOBBLE_RADIUS_X,
            shape.originY - WOBBLE_RADIUS_Y,
            WOBBLE_RADIUS_X * 2,
            WOBBLE_RADIUS_Y * 2
        );
        ctx.restore();

        // Draw rectangle
        ctx.beginPath();
        ctx.rect(
            shape.x - shape.width  / 2,
            shape.y - shape.height / 2,
            shape.width,
            shape.height
        );
        ctx.strokeStyle = "#000";
        ctx.stroke();

        // Draw number
        ctx.fillStyle    = "#000";
        ctx.font         = "20px Arial";
        ctx.textAlign    = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(shape.number, shape.x, shape.y);
    });

    requestAnimationFrame(animate);
}

animate();