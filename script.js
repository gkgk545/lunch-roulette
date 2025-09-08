// URL에서 룰렛 옵션을 가져오는 함수
function getOptionsFromURL() {
    const params = new URLSearchParams(window.location.search);
    const optionsParam = params.get('options'); // ?options=값
    if (optionsParam) {
        return optionsParam.split(','); // 쉼표로 구분된 문자열을 배열로 변환
    }
    return ['선택지 없음']; // 기본값
}

// ▼▼▼ 추가된 기능 ▼▼▼
// 텍스트 길이에 따라 적절한 폰트 크기를 계산하는 함수
function calculateFontSize(text) {
    const len = text.length;
    if (len <= 4) {
        return 40; // 4글자 이하: 기본 크기
    } else if (len <= 6) {
        return 30; // 5~6글자
    } else if (len <= 8) {
        return 24; // 7~8글자
    } else {
        return 18; // 9글자 이상
    }
}
// ▲▲▲ 추가된 기능 ▲▲▲

// ▼▼▼ 변경된 부분 ▼▼▼
// 룰렛 옵션 배열 생성 시, 각 옵션에 동적 폰트 크기 적용
const segments = getOptionsFromURL().map(option => ({
    'fillStyle': getRandomColor(),
    'text': option,
    'textFontSize': calculateFontSize(option) // 동적으로 폰트 크기 할당
}));
// ▲▲▲ 변경된 부분 ▲▲▲

// 룰렛 생성
let theWheel = new Winwheel({
    'numSegments'  : segments.length,
    'outerRadius'  : 180,
    // 'textFontSize' : 40, // 전역 폰트 크기 설정 제거 (각 segment에서 개별 설정)
    'textFontFamily': 'Noto Sans KR',
    'segments'     : segments,
    'animation' : {
        'type'     : 'spinToStop',
        'duration' : 5,
        'spins'    : 8,
        'callbackFinished' : alertPrize, // 애니메이션 종료 후 alertPrize 함수 호출
    }
});

// 돌리기 버튼 상태를 관리하는 변수
let wheelSpinning = false;

// 룰렛 돌리기 함수
function startSpin() {
    if (wheelSpinning == false) {
        theWheel.startAnimation();
        wheelSpinning = true;
        // 돌리는 동안 버튼을 비활성화합니다.
        document.getElementById('spin_button').disabled = true;
    }
}

// 룰렛 결과 처리 함수
function alertPrize(indicatedSegment) {
    const resultText = indicatedSegment.text;
    const spinButton = document.getElementById('spin_button');

    // 1. 결과 텍스트 표시
    document.getElementById('result').innerText = `🎉 오늘의 점심 메뉴는 "${resultText}" 입니다! 🎉`;

    // 2. 버튼의 텍스트와 기능을 변경
    spinButton.innerText = '버튼을 클릭해 결과 복사 후 챗봇에게 알려주세요!';
    spinButton.disabled = false; // 버튼을 다시 활성화

    // 3. 버튼의 클릭 이벤트를 '복사 후 닫기' 기능으로 교체
    spinButton.onclick = function() {
        // 클립보드에 복사할 텍스트
        const textToCopy = `${resultText}`;

        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                // 복사 성공 시
                alert('결과가 클립보드에 복사되었습니다.');
                window.close(); // 현재 창 닫기
            })
            .catch(err => {
                // 복사 실패 시 (예: 사용자가 권한 거부)
                console.error('클립보드 복사 실패: ', err);
                alert('결과 복사에 실패했습니다. 다시 시도해주세요.');
                // 실패하더라도 창은 닫도록 설정 (선택 사항)
                // window.close();
            });
    };
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
