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
    'textFontSize' : 40,
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

// 룰렛 결과 처리 함수 (클릭 단계 분리 버전)
function alertPrize(indicatedSegment) {
    const resultText = indicatedSegment.text;
    const spinButton = document.getElementById('spin_button');

    // 1. 화면에 결과 표시
    document.getElementById('result').innerText = `🎉 오늘의 점심은 "${resultText}" 🎉`;
    spinButton.disabled = false; // 버튼 다시 활성화

    // 2. [1단계] 버튼을 '결과 복사하기' 상태로 변경
    spinButton.innerText = '결과 복사하기';
    spinButton.onclick = function() {
        const textToCopy = `오늘의 점심 메뉴는 "${resultText}" 입니다!`;

        // 클립보드에 텍스트 복사
        navigator.clipboard.writeText(textToCopy).then(() => {
            alert('결과가 클립보드에 복사되었습니다.');
            
            // 3. [2단계] 복사 성공 후, 버튼을 '다시 돌리기' 상태로 변경
            spinButton.innerText = '다시 돌리기';
            spinButton.onclick = function() {
                
                // 4. [초기화] 룰렛과 버튼을 모두 원래 상태로 되돌림
                theWheel.stopAnimation(false);  // 현재 애니메이션 정지
                theWheel.rotationAngle = 0;     // 룰렛 각도 초기화
                theWheel.draw();                // 룰렛 다시 그리기

                wheelSpinning = false;          // 다시 돌릴 수 있도록 상태 변경
                spinButton.innerText = '룰렛 돌리기!';
                spinButton.onclick = startSpin; // 버튼 이벤트를 원래의 startSpin으로 복구
                document.getElementById('result').innerText = ''; // 결과 텍스트 지우기
            };
        }).catch(err => {
            console.error('클립보드 복사 실패: ', err);
            alert('결과 복사에 실패했습니다.');
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
