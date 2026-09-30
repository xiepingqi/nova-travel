// ==============================
// NOVA TRAVEL
// 澎湖 AI 旅遊規劃網站 - 第一版
// ==============================


// 取得網頁元素
const dateInput = document.getElementById("date");
const generateBtn = document.getElementById("generateBtn");
const result = document.getElementById("result");


// ==============================
// 預設日期：今天
// ==============================

const today = new Date();

const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, "0");
const day = String(today.getDate()).padStart(2, "0");

dateInput.value = `${year}-${month}-${day}`;


// ==============================
// 喜好按鈕
// ==============================

const choiceButtons = document.querySelectorAll(".choice");

choiceButtons.forEach(button => {

    button.addEventListener("click", () => {

        button.classList.toggle("active");

    });

});


// ==============================
// 不想要的活動
// ==============================

const avoidButtons = document.querySelectorAll(".avoid");

avoidButtons.forEach(button => {

    button.addEventListener("click", () => {

        button.classList.toggle("active");

    });

});


// ==============================
// 取得使用者選擇
// ==============================

function getSelectedValues(selector) {

    const selected =
        document.querySelectorAll(`${selector}.active`);

    return Array.from(selected).map(button => {
        return button.dataset.value;
    });

}


// ==============================
// 澎湖景點資料
// ==============================

const places = [

    {
        name: "林投公園",
        type: "拍照",
        description: "適合散步、拍照與欣賞海岸景色。",
        price: 0
    },

    {
        name: "中央老街",
        type: "美食",
        description: "可以逛街、吃小吃與購買伴手禮。",
        price: 150
    },

    {
        name: "馬公市區咖啡廳",
        type: "咖啡廳",
        description: "適合休息、聊天與拍照。",
        price: 180
    },

    {
        name: "觀音亭",
        type: "拍照",
        description: "適合欣賞海景與拍照。",
        price: 0
    },

    {
        name: "篤行十村",
        type: "拍照",
        description: "特色老屋與文創空間，很適合拍照。",
        price: 0
    },

    {
        name: "澎湖生活博物館",
        type: "自然",
        description: "可以認識澎湖的歷史與地方文化。",
        price: 80
    },

    {
        name: "隘門沙灘",
        type: "自然",
        description: "適合欣賞海景與放鬆。",
        price: 0
    },

    {
        name: "馬公市區餐廳",
        type: "美食",
        description: "安排一餐澎湖特色料理。",
        price: 300
    }

];


// ==============================
// 時間轉成分鐘
// ==============================

function timeToMinutes(time) {

    const parts = time.split(":");

    const hour = Number(parts[0]);
    const minute = Number(parts[1]);

    return hour * 60 + minute;

}


// ==============================
// 分鐘轉回時間
// ==============================

function minutesToTime(minutes) {

    const hour = Math.floor(minutes / 60);

    const minute = minutes % 60;

    return (
        String(hour).padStart(2, "0")
        + ":"
        + String(minute).padStart(2, "0")
    );

}


// ==============================
// 產生旅行計畫
// ==============================

function createTrip() {

    // 取得使用者資料

    const people =
        Number(document.getElementById("people").value);

    const budget =
        Number(document.getElementById("budget").value);

    const startTime =
        document.getElementById("startTime").value;

    const endTime =
        document.getElementById("endTime").value;

    const interests =
        getSelectedValues(".choice");

    const avoids =
        getSelectedValues(".avoid");


    // ==========================
    // 基本檢查
    // ==========================

    if (people < 1) {

        alert("請輸入正確的人數。");

        return;

    }


    if (budget < 0) {

        alert("預算不能小於 0。");

        return;

    }


    const startMinutes =
        timeToMinutes(startTime);

    const endMinutes =
        timeToMinutes(endTime);


    if (startMinutes >= endMinutes) {

        alert("結束時間必須晚於開始時間。");

        return;

    }


    // ==========================
    // 篩選景點
    // ==========================

    let availablePlaces = places.filter(place => {

        return !avoids.includes(place.type);

    });


    // ==========================
    // 按照喜好排序
    // ==========================

    availablePlaces.sort((a, b) => {

        const scoreA =
            interests.includes(a.type) ? 10 : 0;

        const scoreB =
            interests.includes(b.type) ? 10 : 0;

        return scoreB - scoreA;

    });


    // ==========================
    // 選擇景點
    // ==========================

    const availableTime =
        endMinutes - startMinutes;


    let numberOfPlaces;


    if (availableTime <= 150) {

        numberOfPlaces = 2;

    } else if (availableTime <= 240) {

        numberOfPlaces = 3;

    } else if (availableTime <= 360) {

        numberOfPlaces = 4;

    } else {

        numberOfPlaces = 5;

    }


    const selectedPlaces =
        availablePlaces.slice(0, numberOfPlaces);


    // ==========================
    // 計算費用
    // ==========================

    let totalPerPerson = 0;


    selectedPlaces.forEach(place => {

        totalPerPerson += place.price;

    });


    // 不讓預估費用超過使用者設定的預算

    if (totalPerPerson > budget) {

        totalPerPerson = budget;

    }


    const totalCost =
        totalPerPerson * people;


    // ==========================
    // 建立行程 HTML
    // ==========================

    let currentTime = startMinutes;

    let tripHTML = "";


    selectedPlaces.forEach((place, index) => {

        const time =
            minutesToTime(currentTime);


        tripHTML += `

            <div class="trip-item">

                <div class="trip-time">
                    ${time}
                </div>

                <div class="trip-content">

                    <h4>
                        ${place.name}
                    </h4>

                    <p>
                        ${place.description}
                    </p>

                    <div class="trip-price">
                        預估 NT$${place.price} / 人
                    </div>

                </div>

            </div>

        `;


        // 每個景點預留時間

        if (index === 0) {

            currentTime += 60;

        } else {

            currentTime += 50;

        }

    });


    // ==========================
    // 產生推薦文字
    // ==========================

    let interestText;

    if (interests.length > 0) {

        interestText =
            interests.join("、");

    } else {

        interestText =
            "一般旅遊";

    }


    let avoidText = "";

    if (avoids.length > 0) {

        avoidText =
            `已盡量避開：${avoids.join("、")}。`;

    }


    // ==========================
    // 顯示結果
    // ==========================

    result.innerHTML = `

        <div class="result-header">

            <div>

                <div class="small-title">
                    NOVA TRAVEL
                </div>

                <h3>
                    你的澎湖行程
                </h3>

            </div>

            <div class="total-cost">
                約 NT$${totalCost.toLocaleString()}
            </div>

        </div>


        ${tripHTML}


        <div class="result-note">

            💡
            根據你的「${interestText}」偏好安排。

            ${avoidText}

            <br><br>

            👥
            ${people} 人旅行

            <br>

            💰
            每人預算 NT$${budget.toLocaleString()}

            <br><br>

            ⚠️
            目前是 NOVA Travel 第一版示範系統。
            景點營業時間、交通與實際價格，
            出發前請再次確認。

        </div>

    `;


    // ==========================
    // 滑到結果
    // ==========================

    result.scrollIntoView({

        behavior: "smooth",

        block: "start"

    });

}


// ==============================
// 按下「幫我規劃」
// ==============================

generateBtn.addEventListener(
    "click",
    createTrip
);
