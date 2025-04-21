const canvas = document.getElementById('animationCanvas');
const ctx = canvas.getContext('2d');

let particles = [];
let stars = [];
let balls = [];
let triangles = [];
let score = 0;
let missed = 0;
let round = 1;
let lives = 8;
let gameOver = false;
let borderColor = 'rgba(0, 150, 255, 1)'; // 初始邊框顏色

// 初始化星空背景
function initStars() {
    stars = Array.from({ length: 100 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
    }));
}

// 繪製星空背景
function drawStars() {
    stars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
    });
}

// 初始化遊戲
function resetGame() {
    score = 0;
    missed = 0;
    round++;
    balls = [];
    triangles = [];
    lives = 8;
    gameOver = false;
    document.getElementById('restartButton').style.display = 'none';
    initStars(); // 重新初始化星空
    spawnBall(); // 開啟新的遊戲循環
    spawnTriangle(); // 開始生成三角形
    drawParticles(); // 繪製遊戲畫面
}

// 顯示遊戲結束訊息
function endGame(message) {
    gameOver = true;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(message, canvas.width / 2, canvas.height / 2);
    document.getElementById('restartButton').style.display = 'block';
}

// 繪製遊戲資訊
function drawGameInfo() {
    ctx.fillStyle = 'black'; // 修改字體顏色為黑色
    ctx.font = '16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`輪數: ${round}`, 10, 20);
    ctx.textAlign = 'right';
    ctx.fillText(`接到: ${score}`, canvas.width - 10, 20);
    ctx.fillText(`漏接: ${missed}`, canvas.width - 10, 40);
}

// 繪製生命條
function drawLives() {
    ctx.fillStyle = 'black';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center'; // 置中對齊
    ctx.fillText(`生命: ${lives}`, canvas.width / 2, 20); // 置於畫布頂端中央
}

// 生成小球
function spawnBall() {
    if (!gameOver) {
        balls.push({
            x: Math.random() * canvas.width,
            y: 0,
            size: 10,
            speed: Math.random() * 2 + 1, // 移除速度上限限制
        });
        setTimeout(spawnBall, 1000);
    }
}

// 生成隨機三角形
function spawnTriangle() {
    if (!gameOver) {
        triangles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height / 2,
            size: 20,
            speed: Math.random() * 2 + 1, // 移除速度上限限制
            direction: Math.random() < 0.5 ? 1 : -1,
            color: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 1)`
        });
        setTimeout(spawnTriangle, 5000);
    }
}

// 繪製小球
function drawBalls() {
    balls.forEach((ball, index) => {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
        ctx.fillStyle = 'red';
        ctx.fill();
        ball.y += ball.speed;

        // 檢查是否漏接
        if (ball.y > canvas.height) {
            balls.splice(index, 1);
            missed++;
            if (missed === 15) {
                startNeonBlink(); // 開始閃爍霓虹效果
            }
            if (missed >= 20) {
                endGame('菜，就多練；玩不起就別玩，以前是以前現在是現在');
            }
        }
    });
}

// 繪製三角形
function drawTriangles() {
    triangles.forEach((triangle, index) => {
        ctx.beginPath();
        ctx.moveTo(triangle.x, triangle.y);
        ctx.lineTo(triangle.x - triangle.size, triangle.y + triangle.size);
        ctx.lineTo(triangle.x + triangle.size, triangle.y + triangle.size);
        ctx.closePath();
        ctx.fillStyle = triangle.color;
        ctx.fill();

        triangle.x += triangle.speed * triangle.direction;

        // 反彈邊界
        if (triangle.x <= 0 || triangle.x >= canvas.width) {
            triangle.direction *= -1;
        }
    });
}

// 檢查滑鼠是否接到小球
canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    balls.forEach((ball, index) => {
        const dx = ball.x - mouseX;
        const dy = ball.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < ball.size) {
            balls.splice(index, 1);
            score++;
            if (score >= 50) {
                endGame('矮油，不錯喔');
            }
        }
    });

    checkTriangleCollision(mouseX, mouseY);

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // 檢查滑鼠是否碰到邊框
    const isNearBorder = x <= 10 || x >= canvas.width - 10 || y <= 10 || y >= canvas.height - 10;

    if (isNearBorder) {
        // 生成隨機顏色
        borderColor = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 1)`;
        canvas.style.border = `5px solid ${borderColor}`; // 邊框加粗並變色
    }

    particles.push({
        x,
        y,
        size: Math.random() * 5 + 2,
        opacity: 1,
        color: borderColor // 使用當前邊框顏色
    });
});

// 檢查滑鼠是否碰到三角形
function checkTriangleCollision(mouseX, mouseY) {
    if (gameOver) return; // 遊戲結束時不檢查碰撞

    triangles.forEach((triangle, index) => {
        const dx = Math.abs(triangle.x - mouseX);
        const dy = Math.abs(triangle.y + triangle.size / 2 - mouseY);
        if (dx < triangle.size && dy < triangle.size) {
            triangles.splice(index, 1);
            lives--;
            applyNeonEffect(1000); // 外框霓虹效果一秒
            if (lives <= 0) {
                endGame('你爸爸得了MVP');
            } else {
                // 畫面全黑兩秒，但不暫停遊戲畫面更新
                ctx.fillStyle = 'black';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                setTimeout(() => {
                    // 恢復正常畫面
                    drawParticles();
                }, 2000);
            }
        }
    });
}

// 霓虹效果
function applyNeonEffect(duration) {
    canvas.style.boxShadow = '0 0 20px #8B0000, 0 0 40px #8B0000, 0 0 60px #8B0000'; // 深紅色霓虹
    setTimeout(() => {
        canvas.style.boxShadow = 'none';
    }, duration);
}

// 閃爍霓虹效果
function startNeonBlink() {
    let blink = true;
    const interval = setInterval(() => {
        if (gameOver) {
            clearInterval(interval);
            canvas.style.boxShadow = 'none';
            return;
        }
        canvas.style.boxShadow = blink
            ? '0 0 20px #8B0000, 0 0 40px #8B0000, 0 0 60px #8B0000' // 深紅色霓虹
            : 'none';
        blink = !blink;
    }, 500);
}

// 遊戲主迴圈
function drawParticles() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawStars();
    drawGameInfo();
    drawLives(); // 繪製生命條
    drawBalls();
    drawTriangles(); // 繪製三角形

    particles.forEach((particle, index) => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color; // 使用動態顏色
        ctx.fill();

        particle.size *= 0.95;
        particle.opacity -= 0.02;

        if (particle.opacity <= 0) {
            particles.splice(index, 1);
        }
    });

    requestAnimationFrame(drawParticles);
}

// 初始化
initStars();
spawnBall();
spawnTriangle(); // 開始生成三角形
drawParticles();
