/*
By Okazz
*/
let colors = ['#7bdff2', '#b2f7ef', '#f7d6e0', '#f2b5d4'];
let ctx;
let motions = [];
let motionClasses = [];
let sceneTimer = 0;
let resetTime = 60 * 8.5;
let fadeOutTime = 30;

// 新增：隱藏選單變數
let menuWidth = 320;
let menuX = -menuWidth;
let menuTargetX = -menuWidth;
let menuEasing = 0.12;
// 新增兩項：測驗卷筆記、作品筆記（插入在測驗系統之後）
let menuItems = ['第一單元作品', '第一單元講義', '測驗系統', '測驗卷筆記', '作品筆記', '淡江大學', '回到首頁'];
let menuTextSize = 32;
// 對應每項的預設目標網址（若為 null，點擊時會提示使用者輸入網址）
let menuTargets = [
	'https://acgn1221-ai.github.io/20251020/', // 第一單元作品
	'https://hackmd.io/@oQlKWzw8Sb6Vp8HMwRikbg/Byu6UQCjxe', // 第一單元講義
	'https://acgn1221-ai.github.io/20251104/', // 測驗系統
	'https://hackmd.io/@oQlKWzw8Sb6Vp8HMwRikbg/BJs7Ktr1-x', // 測驗卷筆記
	'https://hackmd.io/@oQlKWzw8Sb6Vp8HMwRikbg/SygJ8pFybe', // 作品筆記
	'https://www.tku.edu.tw/', // 淡江大學
	null  // 回到首頁（特別處理）
];
let iframeElem = null; // 新增：iframe 參考
let closeBtnElem = null; // 新增：關閉按鈕參考

function setup() {
	createCanvas(windowWidth, windowHeight);
	rectMode(CENTER);
	ctx = drawingContext;
	INIT();
}

function draw() {
    background('#eff7f6');
    for (let m of motions) {
        m.run();
    }

    let alph = 0;
    if ((resetTime - fadeOutTime) < sceneTimer && sceneTimer <= resetTime) {
        alph = map(sceneTimer, (resetTime - fadeOutTime), resetTime, 0, 255);
        background(255, alph);

    }

    if (frameCount % resetTime == 0) {
        INIT();
    }

    sceneTimer++;

    // 新增：選單滑出邏輯（當滑鼠在最左側 100px 時滑出）
    if (mouseX <= 100) {
        menuTargetX = 0;
    } else {
        menuTargetX = -menuWidth;
    }
    menuX = lerp(menuX, menuTargetX, menuEasing);

    // 在最上層繪製選單
    drawMenu();

    // 在最上層繪製學生資訊
    drawStudentInfo();
}

function INIT() {
	sceneTimer = 0;
	motions = [];
	motionClasses = [Motion01, Motion02, Motion03, Motion04, Motion05];
	let drawingRegion = width * 0.75;
	let cellCount = 25;
	let cellSize = drawingRegion / cellCount;
	let clr = '#415a77';
	for (let i = 0; i < cellCount; i++) {
		for (let j = 0; j < cellCount; j++) {
			let x = cellSize * j + (cellSize / 2) + (width - drawingRegion) / 2;
			let y = cellSize * i + (cellSize / 2) + (height - drawingRegion) / 2;
			let MotionClass = random(motionClasses);
			let t = -int(dist(x, y, width / 2, height / 2) * 0.7);
			motions.push(new MotionClass(x, y, cellSize, t, clr));
		}
	}
}

function easeInOutQuint(x) {
	return x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2;
}

class Agent {
	constructor(x, y, w, t, clr) {
		this.x = x;
		this.y = y;
		this.w = w;

		this.t1 = int(random(30, 100));
		this.t2 = this.t1 + int(random(30, 100));
		this.t = t;
		this.clr2 = color(clr);
		this.clr1 = color(random(colors));
		this.currentColor = this.clr1;
	}

	show() {
	}

	move() {
		if (0 < this.t && this.t < this.t1) {
			let n = norm(this.t, 0, this.t1 - 1);
			this.updateMotion1(easeInOutQuint(n));
		} else if (this.t1 < this.t && this.t < this.t2) {
			let n = norm(this.t, this.t1, this.t2 - 1);
			this.updateMotion2(easeInOutQuint(n));
		}
		this.t++;
	}

	run() {
		this.show();
		this.move();
	}

	updateMotion1(n) {

	}
	updateMotion2(n) {

	}
}

class Motion01 extends Agent {
	constructor(x, y, w, t, clr) {
		super(x, y, w, t, clr);
		this.shift = this.w * 3;
		this.ang = int(random(4)) * (TAU / 4);
		this.size = 0;
	}

	show() {
		noStroke();
		fill(this.currentColor);
		square(this.x + this.shift * cos(this.ang), this.y + this.shift * sin(this.ang), this.size);
	}

	updateMotion1(n) {
		this.shift = lerp(this.w * 3, 0, n);
		this.size = lerp(0, this.w, n);
		this.currentColor = lerpColor(this.clr1, this.clr2, n);
	}
}

class Motion02 extends Agent {
	constructor(x, y, w, t, clr) {
		super(x, y, w, t, clr);
		this.shift = this.w * 2;
		this.ang = int(random(4)) * (TAU / 4);
		this.size = 0;
		this.corner = this.w / 2;
	}

	show() {
		noStroke();
		fill(this.currentColor);
		square(this.x + this.shift * cos(this.ang), this.y + this.shift * sin(this.ang), this.size, this.corner);
	}

	updateMotion1(n) {
		this.shift = lerp(0, this.w * 2, n);
		this.size = lerp(0, this.w / 2, n);
	}

	updateMotion2(n) {
		this.size = lerp(this.w / 2, this.w, n);
		this.shift = lerp(this.w * 2, 0, n);
		this.corner = lerp(this.w / 2, 0, n);
		this.currentColor = lerpColor(this.clr1, this.clr2, n);
	}
}

class Motion03 extends Agent {
	constructor(x, y, w, t, clr) {
		super(x, y, w, t, clr);
		this.shift = this.w * 2;
		this.ang = 0;
		this.size = 0
	}

	show() {
		push();
		translate(this.x, this.y);
		rotate(this.ang);
		noStroke();
		fill(this.currentColor);
		square(0, 0, this.size);
		pop();
	}

	updateMotion1(n) {
		this.ang = lerp(0, TAU, n);
		this.size = lerp(0, this.w, n);
		this.currentColor = lerpColor(this.clr1, this.clr2, n);

	}
}

class Motion04 extends Agent {
	constructor(x, y, w, t, clr) {
		super(x, y, w, t, clr);
		this.shift = this.w * 2;
		this.ang = int(random(4)) * (TAU / 4);
		this.rot = PI;
		this.side = 0;
	}

	show() {
		push();
		translate(this.x, this.y);
		rotate(this.ang);
		translate(-this.w / 2, -this.w / 2);
		rotate(this.rot);
		fill(this.currentColor);
		rect(this.w / 2, (this.w / 2) - (this.w - this.side) / 2, this.w, this.side);
		pop();
	}

	updateMotion1(n) {
		this.side = lerp(0, this.w, n);
	}

	updateMotion2(n) {
		this.currentColor = lerpColor(this.clr1, this.clr2, n);
		this.rot = lerp(PI, 0, n);
	}
}

class Motion05 extends Agent {
	constructor(x, y, w, t, clr) {
		super(x, y, w, t, clr);
		this.shift = this.w / 2;
		this.size = 0;
	}

	show() {
		push();
		translate(this.x, this.y);
		for (let i = 0; i < 4; i++) {
			fill(this.currentColor);
			square((this.w / 4) + this.shift, (this.w / 4) + this.shift, this.size);
			rotate(TAU / 4);
		}
		pop();
	}

	updateMotion1(n) {
		this.size = lerp(0, this.w / 4, n);
	}

	updateMotion2(n) {
		this.currentColor = lerpColor(this.clr1, this.clr2, n);
		this.shift = lerp(this.w / 2, 0, n);
		this.size = lerp(this.w / 4, this.w / 2, n);

	}
}

// 新增：繪製選單（文字大小 32px）
function drawMenu() {
    push();
    translate(menuX, 0);

    // 背景
    noStroke();
    fill('#2b2b2b');
    rect(menuWidth / 2, height / 2, menuWidth, height);

    // 選單文字
    textSize(menuTextSize);
    textAlign(LEFT, TOP);

    let startY = 80;
    let gap = 88;
    for (let i = 0; i < menuItems.length; i++) {
        let y = startY + i * gap;
        // 判斷滑鼠是否在選單與該項目上（考慮 menuX 偏移）
        let relMouseX = mouseX - menuX;
        let hovered = relMouseX >= 0 && relMouseX <= menuWidth && mouseY >= y && mouseY <= y + 48;

        if (hovered) {
            fill('#ffd166'); // hover 顏色
        } else {
            fill(255); // 文字顏色
        }
        // 左內距 40
        text(menuItems[i], 40, y);
    }
    pop();
}

// 新增：在畫布最上層繪製學生資訊
function drawStudentInfo() {
    push();
    // 設定文字樣式
    const studentInfoText = '班級: 教育科技一年B班   姓名: 張O婕   學號: 414730506';
    const padding = 10;
    textSize(20);
    textFont('LXGW WenKai TC');
    textAlign(CENTER, TOP);

    // 計算背景框尺寸
    const textW = textWidth(studentInfoText);
    const boxW = textW + padding * 2;
    const boxH = 20 + padding * 2; // 20 是字體大小

    // 繪製半透明背景框
    fill(0, 0, 0, 150); // 黑色，約 60% 透明度
    noStroke();
    rect(width / 2, 20 + boxH / 2 - padding, boxW, boxH, 6); // 圓角為 6

    // 繪製文字
    fill('#ffd60a');
    text(studentInfoText, width / 2, 20);
    pop();
}

// 新增：顯示 / 隱藏 / 調整 iframe 的函式
function showIframe(url) {
    if (!iframeElem) {
        iframeElem = createElement('iframe');
        iframeElem.attribute('frameborder', '0');
        iframeElem.style('position', 'fixed');
        iframeElem.style('z-index', '999'); // iframe 的層級
        iframeElem.style('background', '#ffffff');
        iframeElem.style('box-shadow', '0 8px 24px rgba(0,0,0,0.4)');
        iframeElem.style('border-radius', '8px'); // 加上圓角讓外觀更好看

        // 只在第一次創建 iframe 時創建關閉按鈕
        closeBtnElem = createDiv('&times;'); // 使用 HTML 的 '×' 符號
        closeBtnElem.style('position', 'fixed');
        closeBtnElem.style('z-index', '1000'); // 確保按鈕在 iframe 上方
        closeBtnElem.style('color', '#000');
        closeBtnElem.style('font-size', '32px');
        closeBtnElem.style('font-weight', 'bold');
        closeBtnElem.style('cursor', 'pointer');
        closeBtnElem.style('padding', '0 10px');
        closeBtnElem.mousePressed(hideIframe); // 點擊按鈕時呼叫 hideIframe
    }
    iframeElem.attribute('src', url);
    iframeElem.style('display', 'block');
    closeBtnElem.style('display', 'block'); // 同時顯示關閉按鈕
    resizeIframe();
}

function hideIframe() {
    if (iframeElem) {
        iframeElem.style('display', 'none');
        iframeElem.attribute('src', ''); // 清空 src 停止內容播放並釋放資源
    }
    if (closeBtnElem) {
        closeBtnElem.style('display', 'none');
    }
}

function resizeIframe() {
    // 如果 iframe 或按鈕不存在，就直接返回
    if (!iframeElem || !closeBtnElem) return;

    let w = floor(windowWidth * 0.8); // 寬為視窗 80%
    let h = floor(windowHeight * 0.8); // 高設定為視窗 80%
    let left = floor((windowWidth - w) / 2);
    let top = floor((windowHeight - h) / 2);
    iframeElem.style('width', w + 'px');
    iframeElem.style('height', h + 'px');
    iframeElem.style('left', left + 'px');
    iframeElem.style('top', top + 'px');

    // 同步調整關閉按鈕的位置到 iframe 的右上角
    closeBtnElem.style('left', (left + w - 35) + 'px'); // 調整 X 位置
    closeBtnElem.style('top', (top + 5) + 'px');      // 調整 Y 位置
}

// 在視窗大小改變時同步調整 iframe
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    resizeIframe();
}

// 修改：滑鼠點擊選單回報並處理第一單元作品（以 iframe 顯示）
function mousePressed() {
    // 如果 iframe 是可見的，且點擊位置不在 iframe 內部，則關閉 iframe
    if (iframeElem && iframeElem.style('display') === 'block') {
        let rect = iframeElem.elt.getBoundingClientRect();
        if (mouseX < rect.left || mouseX > rect.right || mouseY < rect.top || mouseY > rect.bottom) {
            hideIframe();
            return; // 關閉後就不用再檢查選單點擊了
        }
    }

    let relMouseX = mouseX - menuX;
    if (relMouseX >= 0 && relMouseX <= menuWidth) {
        let startY = 80;
        let gap = 88;
        for (let i = 0; i < menuItems.length; i++) {
            let y = startY + i * gap;
            if (mouseY >= y && mouseY <= y + 48) {
                console.log('選取項目：' + menuItems[i]);
				// 以 menuTargets 陣列為主要控制：若有網址則 showIframe，若為 null 則提示使用者輸入網址；
				// 最後一個（回到首頁）特殊處理為導回 index.html
				if (menuTargets[i]) {
					showIframe(menuTargets[i]);
				} else {
					// 如果是最後一項（回到首頁）
					if (i === menuItems.length - 1) {
						// 導回同目錄下的 index.html
						location.href = 'index.html';
					} else {
						// 提示使用者輸入要顯示的網址（支援 https:// 或 http://）
						let url = prompt('請輸入要顯示的網址（例如 https://...）：');
						if (url) {
							showIframe(url);
						} else {
							// 若使用者取消或未輸入，隱藏 iframe
							hideIframe();
						}
					}
				}
            }
        }
    }
}