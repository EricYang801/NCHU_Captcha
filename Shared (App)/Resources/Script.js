// Safari 擴充功能狀態控制
function show(platform, enabled, useSettingsInsteadOfPreferences) {
    document.body.classList.add(`platform-${platform}`);

    if (useSettingsInsteadOfPreferences) {
        document.getElementsByClassName('platform-mac state-on')[0].innerText = "NCHU_captcha's extension is currently on. You can turn it off in the Extensions section of Safari Settings.";
        document.getElementsByClassName('platform-mac state-off')[0].innerText = "NCHU_captcha's extension is currently off. You can turn it on in the Extensions section of Safari Settings.";
        document.getElementsByClassName('platform-mac state-unknown')[0].innerText = "You can turn on NCHU_captcha's extension in the Extensions section of Safari Settings.";
        document.getElementsByClassName('platform-mac open-preferences')[0].innerText = "Quit and Open Safari Settings…";
    }

    if (typeof enabled === "boolean") {
        document.body.classList.toggle(`state-on`, enabled);
        document.body.classList.toggle(`state-off`, !enabled);
    } else {
        document.body.classList.remove(`state-on`);
        document.body.classList.remove(`state-off`);
    }
}

function openPreferences() {
    webkit.messageHandlers.controller.postMessage("open-preferences");
}

function toggleNotes() {
    const notes = document.getElementById('notes');
    notes.classList.toggle('show');
}

// 教學輪播功能
class TutorialCarousel {
    constructor() {
        this.container = document.querySelector('.carousel-container');
        this.slides = document.querySelectorAll('.step-slide');
        this.dots = document.querySelectorAll('.dot');
        
        // 基本參數
        this.currentIndex = 0;
        this.startPos = 0;
        this.currentTranslate = 0;
        this.isDragging = false;
        this.slideWidth = window.innerWidth;
        
        this.init();
    }

    init() {
        // 設置容器寬度
        this.container.style.width = `${this.slideWidth * this.slides.length}px`;
        this.slides.forEach(slide => {
            slide.style.width = `${this.slideWidth}px`;
        });

        // 綁定事件
        this.bindEvents();
        
        // 初始化位置
        this.updatePosition(0);
    }

    bindEvents() {
        // 觸控事件
        this.container.addEventListener('touchstart', (e) => {
            this.isDragging = true;
            this.startPos = e.touches[0].clientX;
            this.container.style.transition = 'none';
        }, { passive: true });

        this.container.addEventListener('touchmove', (e) => {
            if (!this.isDragging) return;
            
            const currentPos = e.touches[0].clientX;
            const diff = currentPos - this.startPos;
            const newTranslate = this.currentTranslate + diff;
            
            // 限制滑動範圍
            if (newTranslate > 0 || newTranslate < -this.slideWidth * (this.slides.length - 1)) {
                return;
            }
            
            this.container.style.transform = `translateX(${newTranslate}px)`;
        }, { passive: true });

        this.container.addEventListener('touchend', (e) => {
            if (!this.isDragging) return;
            
            this.isDragging = false;
            this.container.style.transition = 'transform 0.3s ease-out';
            
            const endPos = e.changedTouches[0].clientX;
            const diff = endPos - this.startPos;
            
            if (Math.abs(diff) > this.slideWidth / 3) {
                if (diff > 0 && this.currentIndex > 0) {
                    this.currentIndex--;
                } else if (diff < 0 && this.currentIndex < this.slides.length - 1) {
                    this.currentIndex++;
                }
            }
            
            this.updatePosition(this.currentIndex);
        });

        // 點擊導航點
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.currentIndex = index;
                this.updatePosition(index);
            });
        });

        // 視窗大小改變
        window.addEventListener('resize', () => {
            this.slideWidth = window.innerWidth;
            this.container.style.width = `${this.slideWidth * this.slides.length}px`;
            this.slides.forEach(slide => {
                slide.style.width = `${this.slideWidth}px`;
            });
            this.updatePosition(this.currentIndex);
        });
    }

    updatePosition(index) {
        this.currentTranslate = -index * this.slideWidth;
        this.container.style.transform = `translateX(${this.currentTranslate}px)`;
        this.updateDots(index);
    }

    updateDots(index) {
        this.dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    new TutorialCarousel();
});

