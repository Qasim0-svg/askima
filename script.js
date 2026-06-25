// script.js - Harici JavaScript dosyası

// -------------------- KALP YAĞMURU (Canvas) --------------------
const canvas = document.getElementById('heartRain');
const ctx = canvas.getContext('2d');

let hearts = [];
const HEART_COUNT = 45;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Heart {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height - canvas.height;
    this.size = Math.random() * 18 + 10;
    this.speed = Math.random() * 1.2 + 0.6;
    this.opacity = Math.random() * 0.5 + 0.3;
    this.rotation = Math.random() * 2 * Math.PI;
    this.rotSpeed = (Math.random() - 0.5) * 0.02;
    this.wobble = Math.random() * 0.8 + 0.3;
    this.wobbleSpeed = Math.random() * 0.02 + 0.01;
    this.phase = Math.random() * 100;
  }
  update() {
    this.y += this.speed;
    this.phase += this.wobbleSpeed;
    this.x += Math.sin(this.phase) * this.wobble * 0.25;
    this.rotation += this.rotSpeed;
    if (this.y > canvas.height + 30) {
      this.reset();
      this.y = -30 - Math.random() * 40;
    }
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    const s = this.size;
    ctx.font = `${s}px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('❤️', 0, 0);
    ctx.restore();
  }
}

for (let i = 0; i < HEART_COUNT; i++) {
  const h = new Heart();
  h.y = Math.random() * canvas.height;
  hearts.push(h);
}

function drawHearts() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  hearts.forEach(h => {
    h.update();
    h.draw();
  });
  requestAnimationFrame(drawHearts);
}
drawHearts();

// -------------------- ZAMAN SAYACI (localStorage ile kalıcı) --------------------
function getStartTime() {
  const saved = localStorage.getItem('timerStartTime');
  if (saved) {
    return new Date(parseInt(saved));
  } else {
    const now = new Date();
    localStorage.setItem('timerStartTime', now.getTime().toString());
    return now;
  }
}

const startTime = getStartTime();

function updateTimer() {
  const now = new Date();
  let diffMs = now - startTime;
  let totalSeconds = Math.floor(diffMs / 1000);
  
  if (totalSeconds < 0) totalSeconds = 0;

  let totalDays = Math.floor(totalSeconds / (24 * 3600));
  let remainingSeconds = totalSeconds % (24 * 3600);
  
  const hours = Math.floor(remainingSeconds / 3600);
  remainingSeconds = remainingSeconds % 3600;
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  const BASE_MONTHS = 6;
  const BASE_DAYS = 28;
  
  let totalDaysFromBase = BASE_DAYS + totalDays;
  
  let months = BASE_MONTHS;
  let days = totalDaysFromBase;
  
  while (days >= 30) {
    months++;
    days -= 30;
  }
  
  let years = 0;
  while (months >= 12) {
    years++;
    months -= 12;
  }

  document.getElementById('years').textContent = String(years).padStart(2, '0');
  document.getElementById('months').textContent = String(months).padStart(2, '0');
  document.getElementById('days').textContent = String(days).padStart(2, '0');
  document.getElementById('hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
  document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

updateTimer();
setInterval(updateTimer, 1000);

// -------------------- ALBÜM GALERİSİ --------------------
const albumData = [
  { 
    img: '1.webp',
  },
  { 
    img: '2.webp',
  },
  { 
    img: '3.jpg',
  },
  { 
    img: '4.webp',
  },
  { 
    img: '5.webp',
  },
  { 
    img: '6.jpg',
  },
  { 
    img: '7.webp',
  },
  { 
    img: '8.webp',
  },
  { 
    img: '9.jpg',
  },
  { 
    img: '10.jpg',
  },
  { 
    img: '11.jpg',
  },
  { 
    img: '12.jpg',
  },
  { 
    img: '13.jpg',
  },
  { 
    img: '14.jpg',
  },
  { 
    img: '15.webp',
  }
];

let currentAlbumIndex = 0;

function createAlbum() {
  const albumContainer = document.getElementById('albumContainer');
  
  // Albüm HTML'i
  albumContainer.innerHTML = `
    <div class="album-wrapper">
      <div class="album-header">
        <h3 class="album-title">📸 Anı Albümümüz</h3>
        <p class="album-counter"><span id="currentPhotoNum">1</span> / ${albumData.length}</p>
      </div>
      
      <div class="album-slider">
        <button class="album-btn prev-btn" id="prevAlbumBtn">❮</button>
        
        <div class="album-display">
          <div class="album-image-container">
            <img id="albumImage" src="${albumData[0].img}" alt="${albumData[0].label}">
            <div class="album-overlay">
              <span class="album-label" id="albumLabel">${albumData[0].label}</span>
              <span class="album-date" id="albumDate">${albumData[0].date}</span>
              <p class="album-description" id="albumDescription">${albumData[0].description}</p>
            </div>
          </div>
        </div>
        
        <button class="album-btn next-btn" id="nextAlbumBtn">❯</button>
      </div>
      
      <div class="album-thumbnails" id="albumThumbnails">
        <!-- Thumbnail'lar burada oluşacak -->
      </div>
    </div>
  `;
  
  // Thumbnail'ları oluştur
  const thumbnailsContainer = document.getElementById('albumThumbnails');
  albumData.forEach((item, index) => {
    const thumb = document.createElement('div');
    thumb.className = `thumbnail-item ${index === 0 ? 'active' : ''}`;
    thumb.innerHTML = `
      <img src="${item.img}" alt="${item.label}">
     
    `;
    thumb.addEventListener('click', () => goToAlbum(index));
    thumbnailsContainer.appendChild(thumb);
  });
  
  // Event listeners
  document.getElementById('prevAlbumBtn').addEventListener('click', prevAlbum);
  document.getElementById('nextAlbumBtn').addEventListener('click', nextAlbum);
  
  // Klavye kontrolleri
  document.addEventListener('keydown', function(e) {
    if (document.querySelector('.album-wrapper')) {
      if (e.key === 'ArrowLeft') prevAlbum();
      if (e.key === 'ArrowRight') nextAlbum();
    }
  });
  
  // İlk fotoğrafı göster
  updateAlbumDisplay(0);
}

function updateAlbumDisplay(index) {
  const data = albumData[index];
  
  // Ana görsel
  const img = document.getElementById('albumImage');
  img.src = data.img;
  img.alt = data.label;
  
  // Bilgiler
  document.getElementById('albumLabel').textContent = data.label;
  document.getElementById('albumDate').textContent = data.date;
  document.getElementById('albumDescription').textContent = data.description;
  document.getElementById('currentPhotoNum').textContent = index + 1;
  
  // Thumbnail'ları güncelle
  document.querySelectorAll('.thumbnail-item').forEach((thumb, i) => {
    thumb.classList.toggle('active', i === index);
  });
  
  // Animasyon
  const container = document.querySelector('.album-image-container');
  container.style.animation = 'none';
  setTimeout(() => {
    container.style.animation = 'fadeIn 0.4s ease';
  }, 10);
}

function goToAlbum(index) {
  if (index < 0) index = albumData.length - 1;
  if (index >= albumData.length) index = 0;
  currentAlbumIndex = index;
  updateAlbumDisplay(currentAlbumIndex);
}

function prevAlbum() {
  goToAlbum(currentAlbumIndex - 1);
}

function nextAlbum() {
  goToAlbum(currentAlbumIndex + 1);
}

// Galeri stilleri
const albumStyles = document.createElement('style');
albumStyles.textContent = `
  .album-wrapper {
    background: rgba(255,255,255,0.5);
    border-radius: 20px;
    padding: 20px;
  }
  
  .album-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }
  
  .album-title {
    font-size: 1.3rem;
    color: #4a2c3a;
    margin: 0;
  }
  
  .album-counter {
    font-size: 0.95rem;
    color: #8a5a6a;
    font-weight: 600;
  }
  
  .album-slider {
    display: flex;
    align-items: center;
    gap: 12px;
    position: relative;
  }
  
  .album-btn {
    background: #d81b60;
    color: white;
    border: none;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    font-size: 1.4rem;
    cursor: pointer;
    transition: all 0.3s;
    box-shadow: 0 4px 12px rgba(216, 27, 96, 0.3);
    flex-shrink: 0;
    z-index: 2;
  }
  
  .album-btn:hover {
    transform: scale(1.1);
    background: #ad1457;
  }
  
  .album-display {
    flex: 1;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  }
  
  .album-image-container {
    position: relative;
    width: 100%;
    aspect-ratio: 3/2;
    background: #f5f5f5;
  }
  
  .album-image-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  
  .album-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 30px 20px 16px;
    background: linear-gradient(transparent, rgba(0,0,0,0.7));
    color: white;
  }
  
  .album-label {
    display: block;
    font-size: 1.3rem;
    font-weight: 700;
    margin-bottom: 2px;
  }
  
  .album-date {
    display: block;
    font-size: 0.85rem;
    opacity: 0.9;
    margin-bottom: 4px;
  }
  
  .album-description {
    font-size: 0.9rem;
    opacity: 0.9;
    margin: 0;
  }
  
  .album-thumbnails {
    display: flex;
    gap: 8px;
    margin-top: 16px;
    overflow-x: auto;
    padding: 4px 2px;
    scroll-behavior: smooth;
  }
  
  .album-thumbnails::-webkit-scrollbar {
    height: 6px;
  }
  
  .album-thumbnails::-webkit-scrollbar-track {
    background: rgba(0,0,0,0.05);
    border-radius: 10px;
  }
  
  .album-thumbnails::-webkit-scrollbar-thumb {
    background: #d81b60;
    border-radius: 10px;
  }
  
  .thumbnail-item {
    flex-shrink: 0;
    width: 70px;
    cursor: pointer;
    border-radius: 10px;
    overflow: hidden;
    border: 3px solid transparent;
    transition: all 0.3s;
    position: relative;
  }
  
  .thumbnail-item:hover {
    transform: scale(1.05);
  }
  
  .thumbnail-item.active {
    border-color: #d81b60;
    box-shadow: 0 0 16px rgba(216, 27, 96, 0.4);
  }
  
  .thumbnail-item img {
    width: 100%;
    aspect-ratio: 1;
    object-fit: cover;
    display: block;
  }
  
  .thumb-label {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,0.6);
    color: white;
    font-size: 0.55rem;
    padding: 2px 4px;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.98); }
    to { opacity: 1; transform: scale(1); }
  }
  
  @media (max-width: 650px) {
    .album-btn {
      width: 36px;
      height: 36px;
      font-size: 1rem;
    }
    .album-label {
      font-size: 1rem;
    }
    .album-description {
      font-size: 0.75rem;
    }
    .thumbnail-item {
      width: 55px;
    }
    .album-overlay {
      padding: 16px 12px 10px;
    }
  }
`;
document.head.appendChild(albumStyles);

// Albümü oluştur
createAlbum();

// -------------------- SPIN TO WIN (ÇARKI ÇEVİR) --------------------
const spinBtn = document.getElementById('spinBtn');
const spinResult = document.getElementById('spinResult');

const spinMessages = [
  '💕 Bir öpücük kazandın benden',
  '💕 ooo fena sarılcam',
  '💕 Şanslısın he, trip kartı',
  '💕 karaoke gidicez',
  '💕 cook fena gıdıklicam',
  '💕 AŞKIMSINN',
  '💕 Işıl ışılsınn',
  '💕 Vanilya foto borcun var artık'
];

spinBtn.addEventListener('click', () => {
  const msg = spinMessages[Math.floor(Math.random() * spinMessages.length)];
  spinResult.textContent = msg;
  spinResult.style.animation = 'none';
  setTimeout(() => spinResult.style.animation = 'pop 0.4s ease', 10);
});

// -------------------- COMPATIBILITY (UYUM) --------------------
const compBtn = document.getElementById('compBtn');
const compName = document.getElementById('compName');
const compResult = document.getElementById('compResult');

compBtn.addEventListener('click', () => {
  const name = compName.value.trim() || 'John';
  const percent = Math.floor(Math.random() * 31) + 70;
  const emojis = ['💖', '❤️', '💕', '💗', '💓', '💘'];
  const emoji = emojis[Math.floor(Math.random() * emojis.length)];
  compResult.textContent = `${emoji} %${percent} uyum ${name} ile!`;
});

// -------------------- ÇİÇEK PATLAMASI (LALE EMOJİLERİ) --------------------
document.querySelector('.click-me')?.addEventListener('click', function() {
  createTulipExplosion(this);
  
  this.textContent = '🌷🌷🌷';
  setTimeout(() => {
    this.textContent = 'Tıkla beni';
  }, 2000);
});

function createTulipExplosion(element) {
  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  const tulips = ['🌷', '🌷', '🌷', '🌷', '🌷', '🌷', '🌷', '🌷', '🌷', '🌷', '🌷', '🌷', '🌷', '🌷', '🌷'];
  const emojis = document.querySelectorAll('.tulip-particle');
  emojis.forEach(e => e.remove());
  
  tulips.forEach((tulip, index) => {
    const particle = document.createElement('div');
    particle.className = 'tulip-particle';
    particle.textContent = tulip;
    
    const angle = (index / tulips.length) * 2 * Math.PI + Math.random() * 0.3;
    const distance = 80 + Math.random() * 120;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance - 40;
    
    particle.style.cssText = `
      position: fixed;
      left: ${centerX}px;
      top: ${centerY}px;
      font-size: ${20 + Math.random() * 25}px;
      pointer-events: none;
      z-index: 9999;
      transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
      transform: translate(-50%, -50%) scale(0.2) rotate(${Math.random() * 720}deg);
      opacity: 1;
      text-shadow: 0 0 20px rgba(255, 100, 150, 0.5);
    `;
    
    document.body.appendChild(particle);
    
    requestAnimationFrame(() => {
      particle.style.transform = `translate(${dx - 20}px, ${dy - 30}px) scale(1) rotate(${Math.random() * 360}deg)`;
      particle.style.opacity = '0';
    });
    
    setTimeout(() => {
      particle.remove();
    }, 900);
  });
  
  setTimeout(() => {
    for (let i = 0; i < 8; i++) {
      const extra = document.createElement('div');
      extra.className = 'tulip-particle';
      extra.textContent = '🌷';
      const angle2 = Math.random() * 2 * Math.PI;
      const dist2 = 40 + Math.random() * 60;
      
      extra.style.cssText = `
        position: fixed;
        left: ${centerX + Math.random() * 40 - 20}px;
        top: ${centerY + Math.random() * 40 - 20}px;
        font-size: ${15 + Math.random() * 20}px;
        pointer-events: none;
        z-index: 9999;
        transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        transform: translate(-50%, -50%) scale(0.1) rotate(${Math.random() * 360}deg);
        opacity: 1;
      `;
      
      document.body.appendChild(extra);
      
      requestAnimationFrame(() => {
        extra.style.transform = `translate(${Math.cos(angle2) * dist2}px, ${Math.sin(angle2) * dist2 - 60}px) scale(1) rotate(${Math.random() * 360}deg)`;
        extra.style.opacity = '0';
      });
      
      setTimeout(() => {
        extra.remove();
      }, 700);
    }
  }, 200);
}

// -------------------- ANİMASYON (pop) --------------------
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes pop {
    0% { transform: scale(0.6); opacity: 0.4; }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); opacity: 1; }
  }
  #spinResult, #compResult {
    transition: all 0.2s;
  }
`;
document.head.appendChild(styleSheet);

// -------------------- BAŞLANGIÇ --------------------
compResult.textContent = '❤️ %100 olana kadar zorla ';

console.log('💖 Sevgili Sayfam başarıyla yüklendi!');
console.log('📸 Albümde 15 fotoğraf var!');
console.log('🌷 Çiçek butonuna tıkla ve lale patlamasını izle!');
console.log('⏰ Sayaç başlangıç zamanı:', startTime.toLocaleString());
console.log('💾 Sayaç localStorage ile kalıcı!');