function showIntroduction() {
    // 建立彈出方框
    const popup = document.createElement('div');
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transformStyle = 'preserve-3d'; // 保留 3D 效果
    popup.style.transform = 'translate(-50%, -50%)'; // 初始位置
    popup.style.backgroundColor = '#fff';
    popup.style.border = '2px solid gold'; // 初始邊框為金色
    popup.style.borderRadius = '10px';
    popup.style.padding = '20px';
    popup.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    popup.style.zIndex = '1000';
    popup.style.width = '300px';
    popup.style.textAlign = 'center';
    popup.style.animation = 'rotateCard 10s infinite linear'; // 添加慢速旋轉動畫

    // 填入內容
    popup.innerHTML = `
        <h2>自我介紹</h2>
        <p><strong>姓名：</strong>單毓崴</p>
        <p><strong>系級：</strong>教科3A</p>
        <p><strong>目前狀態：</strong>畢專地獄中</p>
        <p><strong>興趣：</strong>打鼓、組模型</p>
        <button onclick="closePopup()">關閉</button>
    `;

    // 加入到頁面
    document.body.appendChild(popup);
}

function closePopup() {
    const popup = document.querySelector('div[style*="z-index: 1000"]');
    if (popup) {
        popup.remove();
    }
}
