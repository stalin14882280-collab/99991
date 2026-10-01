const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const spinBtn = document.getElementById('spin-btn');
const resultText = document.getElementById('result-text');
const arrow = document.getElementById('arrow');

// Космически-огненные компоненты названий (вы можете добавлять свои элементы сюда)
const sectors = ["Ифрит", "Сверхновая", "Магма", "Солярис", "Протуберанец", "Вулкан", "Гелиос", "Феникс", "Плазма", "Импульс"];
const secondaryNames = ["Ра", "Торнадо", "Блейз", "Флэр", "Инферно", "Магна", "Сириус", "Абсолют", "Спектр", "Титан"];

const totalSectors = sectors.length;
const sectorAngle = 360 / totalSectors;
let currentRotation = 0;
let isSpinning = false;

// Отрисовка колеса на элементе Canvas
function drawWheel() {
    const radius = canvas.width / 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < totalSectors; i++) {
        const angle = (i * sectorAngle * Math.PI) / 180;
        const nextAngle = ((i + 1) * sectorAngle * Math.PI) / 180;
        
        ctx.beginPath();
        ctx.moveTo(radius, radius);
        ctx.arc(radius, radius, radius, angle, nextAngle);
        
        // Красно-желтое чередование секторов
        ctx.fillStyle = i % 2 === 0 ? '#800000' : '#d45d00';
        ctx.fill();
        
        // Золотые контуры секторов
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#ffdd00';
        ctx.stroke();

        // Добавление названий внутрь каждого сектора
        ctx.save();
        ctx.translate(radius, radius);
        ctx.rotate(angle + (sectorAngle * Math.PI) / 360);
        ctx.fillStyle = '#ffdd00';
        ctx.font = 'black 13px Segoe UI, Arial';
        ctx.shadowColor = '#000';
        ctx.shadowBlur = 4;
        ctx.textAlign = 'right';
        ctx.fillText(sectors[i], radius - 20, 5);
        ctx.restore();
    }
}

// Главная функция запуска вращения
function spinWheel() {
    if (isSpinning) return;
    
    isSpinning = true;
    spinBtn.disabled = true;
    resultText.classList.remove('burn');
    resultText.innerText = "Синтез энергии...";
    resultText.style.color = "#ff7700";

    const extraDegrees = Math.floor(Math.random() * 360);
    const totalSpins = 6 * 360; // 6 полных оборотов перед остановкой
    
    currentRotation += totalSpins + extraDegrees;
    canvas.style.transform = `rotate(${currentRotation}deg)`;

    // Имитация эффекта щелчка (тиканья) стрелки во время вращения
    let tickInterval = setInterval(() => {
        if (!isSpinning) {
            clearInterval(tickInterval);
            return;
        }
        arrow.classList.remove('tick');
        void arrow.offsetWidth; // Хак перезапуска анимации триггера
        arrow.classList.add('tick');
    }, 250);

    // Обработка остановки и вывод результатов
    setTimeout(() => {
        isSpinning = false;
        spinBtn.disabled = false;
        clearInterval(tickInterval);

        // Рассчитываем точный сектор под верхней стрелкой
        const actualDegrees = (360 - (currentRotation % 360) + 270) % 360;
        const winningSectorIndex = Math.floor(actualDegrees / sectorAngle) % totalSectors;
        
        const firstPart = sectors[winningSectorIndex];
        const secondPart = secondaryNames[Math.floor(Math.random() * secondaryNames.length)];
        const codeNumber = Math.floor(Math.random() * 9000) + 1000;

        // Эффект взрывного появления итогового названия
        resultText.classList.add('burn');
        resultText.innerHTML = `<span style="color:#ff0000">${firstPart}</span> <span style="color:#ffdd00">${secondPart}-${codeNumber}</span>`;
    }, 5000);
}

// Запуск прорисовки рулетки сразу при загрузке страницы
drawWheel();
