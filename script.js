// URL에서 룰렛 옵션을 가져오는 함수
function getOptionsFromURL() {
    const params = new URLSearchParams(window.location.search);
    const optionsParam = params.get('options'); // ?options=값
    if (optionsParam) {
        return optionsParam.split(','); // 쉼표로 구분된 문자열을 배열로 변환
    }
    return ['선택지 없음']; // 기본값
}

// 룰렛 옵션 배열 생성
const segments = getOptionsFromURL().map(option => ({'fillStyle': getRandomColor(), 'text': option}));

// 룰렛 생성
let theWheel = new Winwheel({
    'numSegments'  : segments.length,
    'outerRadius'  : 180,
    'textFontSize' : 16,
    'segments'     : segments,
    'animation' : {
        'type'     : 'spinToStop',
        'duration' : 5,
        'spins'    : 8,
        'callbackFinished' : alertPrize,
    }
});

// 돌리기 버튼 비활성화를 위한 변수
let wheelSpinning = false;

function startSpin() {
    if (wheelSpinning == false) {
        theWheel.startAnimation();
        wheelSpinning = true;
        document.getElementById('spin_button').disabled = true; // 버튼 비활성화
    }
}

// 결과 처리 함수
function alertPrize(indicatedSegment) {
    document.getElementById('result').innerText = `🎉 오늘의 점심은 "${indicatedSegment.text}" 🎉`;
    document.getElementById('spin_button').innerText = '버튼을 클릭해 결과 복사 후 챗봇에게 알려주세요!';
}

// 랜덤 색상 생성 함수
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
