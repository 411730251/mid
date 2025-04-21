const rotatingText = document.getElementById('rotatingText');
const texts = ['411730251', '單毓崴', '教科3A'];
let index = 0;

function updateText() {
    rotatingText.style.opacity = 0; // 漸層消失
    setTimeout(() => {
        rotatingText.textContent = texts[index];
        rotatingText.style.opacity = 1; // 漸層出現
        index = (index + 1) % texts.length; // 循環切換文字
    }, 1000); // 與 CSS 的 transition 時間一致
}

setInterval(updateText, 3000); // 每 3 秒切換一次文字
updateText(); // 初始化顯示文字
