// 정답 시 칠해줄 색 리스트
const colorList = ["red", "orange", "yellow", "green", "blue", "navy", "purple"];
// 맞춰야할 단어 리스트
const wordList = [
  "DOG",
  "CAT",
  "ANIMAL",
  "LION",
  "TIGER",
  "PET",
  "BEAR",
  "COW",
  "BANANA",
  "INFINITY",
  "RANDOM",
];
// 재배치 해야할 단어 리스트
let wordFailList = [];
let mousedownData = {
  mousedownRow: null,
  mousedownColumn: null,
  mousedownWord: null,
};

// DOM이 완전히 로드되어서 조작할 수 있는 상태가 되었을 때 실행
document.addEventListener("DOMContentLoaded", function () {
  // 퍼즐 시작
  startPuzzleGame();

  // 알파벳마다 이벤트 적용
  const tdElements = document.querySelectorAll("td");
  tdElements.forEach((td) => {
    td.addEventListener("mousedown", handleMousedown);
    td.addEventListener("mouseup", handleMouseup);
  });
});

/**
 * 정답 시 스타일 지정
 */
function answerStyling(selectedWord) {
  const answerTdList = document.querySelectorAll(`td[data-word=${selectedWord}]`);
  // 정답을 칠해줄 랜덤한 색상 선택
  const selectedColor = colorList[Math.floor(Math.random() * colorList.length)];
  // 정답 색칠
  answerTdList.forEach((td) => (td.style.backgroundColor = selectedColor));
  // 정답인 단어 가운데 줄 긋기
  const wordsToFind = document.querySelector(`p[data-word=${selectedWord}]`);
  wordsToFind.style.textDecoration = "line-through";
}

/**
 * 마우스 클릭 시 이벤트 함수
 */
function handleMousedown(e) {
  mousedownData.mousedownWord = e.target.getAttribute("data-word");
  mousedownData.mousedownRow = e.target.getAttribute("data-row");
  mousedownData.mousedownColumn = e.target.getAttribute("data-column");
}

/**
 * 마우스 클릭을 떼었을 때 이벤트 함수
 */
function handleMouseup(e) {
  // 시작 데이터
  const mousedownWord = mousedownData.mousedownWord;
  const mousedownRow = mousedownData.mousedownRow;
  const mousedownColumn = mousedownData.mousedownColumn;
  // 종료 데이터
  const mouseupWord = e.target.getAttribute("data-word");
  const mouseupRow = e.target.getAttribute("data-row");
  const mouseupColumn = e.target.getAttribute("data-column");

  if (mousedownWord !== null && mouseupWord !== null) {
    // 시작과 종료 데이터 모두 존재할 경우
    let selectedWord = "";
    if (mousedownWord.includes(",")) {
      // 시작 단어가 여러개로 되어있을 경우
      selectedWord = mousedownWord
        .split(",")
        .filter((word) => mouseupWord.includes(word))
        .join("");
    } else {
      // 시작 단어가 한개일 경우
      selectedWord = mouseupWord.includes(mousedownWord) ? mousedownWord : "";
    }

    if (selectedWord === "") return;

    if (mousedownRow === mouseupRow) {
      // 단어가 가로로 배치된 상태
      if (selectedWord.length === mouseupColumn - mousedownColumn + 1) {
        // 정답
        answerStyling(selectedWord);
      }
    } else if (mousedownColumn === mouseupColumn) {
      // 단어가 세로로 배치된 상태
      if (selectedWord.length === mouseupRow - mousedownRow + 1) {
        // 정답
        answerStyling(selectedWord);
      }
    } else {
      // 단어가 대각선으로 배치된 상태
      if (selectedWord.length === mouseupColumn - mousedownColumn + 1) {
        // 정답
        answerStyling(selectedWord);
      }
    }
  } else {
    // 시작 또는 종료 데이터 중 하나라도 없을 경우
  }
}

/**
 * 초기화 (진입점)
 */
function startPuzzleGame() {
  const wordsTofind = document.querySelector("#words-to-find");
  const words = document.querySelector("#words");

  // 맞춰야할 단어 리스트 화면에 표시
  wordList.forEach((word) => {
    const pTag = document.createElement("p");
    pTag.innerText = word;
    pTag.setAttribute("data-word", word);
    wordsTofind.appendChild(pTag);
  });

  // 12 x 12 테이블 생성 후 화면에 표시
  const table = document.createElement("table");
  for (let i = 1; i <= 14; i++) {
    // td(행) 생성
    const tableRow = document.createElement("tr");
    for (let j = 1; j <= 12; j++) {
      // td(열) 생성
      const tableCol = document.createElement("td");
      tableCol.setAttribute("data-row", i);
      tableCol.setAttribute("data-column", j);
      tableRow.appendChild(tableCol);
    }
    table.appendChild(tableRow);
  }
  words.appendChild(table);

  // 생성한 테이블 정보
  const tdElements = document.querySelectorAll("td");

  // 단어 최초 배치
  wordPlaceCheck(wordList, tdElements);

  // 위치가 적합하지 않아 쓰여지지 않은 단어일 경우 재배치
  if (wordFailList.length > 0) {
    wordPlaceCheck(wordFailList, tdElements);
  }

  // 단어 배치 후 빈 td에 랜덤한 알파벳 배치
  tdElements.forEach(
    (td) => td.getAttribute("data-word") == null && (td.innerText = randomCharacter())
  );
}

/**
 * 랜덤한 알파벳 반환
 * @returns A ~ Z 사이의 알파벳 1개
 */
function randomCharacter() {
  const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return alphabets[Math.floor(Math.random() * alphabets.length)];
}

/**
 * 단어 입력 시 다른 단어와 겹치는지 여부 확인
 * @returns true : 단어 입력 가능 / false : 단어 입력 불가능
 */
function wordValidation(word, wordStartIndex, tdElements, nextCharacter) {
  let status = false;

  for (i = 0; i < word.length; i++) {
    const td = tdElements[wordStartIndex];
    if (td.getAttribute("data-word") == null || td.innerText === word[i]) {
      status = true;
    } else {
      status = false;
      break;
    }
    wordStartIndex += nextCharacter;
  }
  return status;
}

/**
 * 단어를 랜덤한 위치에 배치
 */
function wordPlaceCheck(wordList, tdElements) {
  const positions = ["row", "column", "diagonal"];
  // 단어 시작 인덱스
  let wordStartIndex = 0;

  for (let i = 0; i < wordList.length; i++) {
    // 가로, 세로, 대각선 중 랜덤한 position 저장 (row || column || diagonal)
    const randomPosition = positions[Math.floor(Math.random() * positions.length)];
    // 테이블에서 랜덤한 인덱스 저장 (0 ~ 143)
    const randomIndex = Math.floor(Math.random() * tdElements.length);
    // 테이블에서 랜덤한 행 저장 (1 ~ 12)
    const randomRow = +tdElements[randomIndex].getAttribute("data-row");
    // 테이블에서 랜덤한 열 저장 (1 ~ 12)
    const randomColumn = +tdElements[randomIndex].getAttribute("data-column");
    // 다음 단어가 표시되기까지 증가해야할 숫자
    let nextCharacter = 0;

    if (randomPosition === "row") {
      // 단어를 가로로 배치할 경우
      nextCharacter = 1;
      if (wordList[i].length + randomColumn - 1 <= 12) {
        // 단어 입력 가능
        wordStartIndex = randomIndex;
      } else {
        // 단어 입력 불가능
        const escapeWordLength = randomColumn + wordList[i].length - 13;
        // 시작 인덱스 - 벗어난 단어 수
        wordStartIndex = randomIndex - escapeWordLength;
      }
    } else if (randomPosition === "column") {
      // 단어를 세로로 배치할 경우
      nextCharacter = 12;
      if (wordList[i].length + randomRow - 1 <= 12) {
        // 단어 입력 가능
        wordStartIndex = randomIndex;
      } else {
        // 단어 입력 불가능
        const escapeWordLength = randomRow + wordList[i].length - 13;
        // 시작 인덱스 - 벗어난 단어 수 * 12
        wordStartIndex = randomIndex - escapeWordLength * 12;
      }
    } else if (randomPosition === "diagonal") {
      // 단어를 대각선으로 배치할 경우
      nextCharacter = 13;
      // 단어가 가로로 넘어가는지 확인
      const isRowValid = wordList[i].length + randomColumn - 1 <= 12;
      // 단어가 세로로 넘어가는지 확인
      const isColumnValid = wordList[i].length + randomRow - 1 <= 12;
      if (isRowValid && isColumnValid) {
        // 단어 입력 가능
        wordStartIndex = randomIndex;
      } else {
        // 단어 입력 불가능
        if (!isRowValid && !isColumnValid) {
          // 가로, 세로 배치 문제
          const escapeWordLengthRow = randomColumn + wordList[i].length - 13;
          const escapeWordLengthColumn = (randomRow + wordList[i].length - 13) * 12;
          wordStartIndex = randomIndex - escapeWordLengthRow - escapeWordLengthColumn;
        } else if (!isRowValid) {
          // 가로 배치 문제
          const escapeWordLength = randomColumn + wordList[i].length - 13;
          wordStartIndex = randomIndex - escapeWordLength;
        } else if (!isColumnValid) {
          // 세로 배치 문제
          const escapeWordLength = randomRow + wordList[i].length - 13;
          wordStartIndex = randomIndex - escapeWordLength * 12;
        }
      }
    }

    // 단어가 해당 위치에 입력이 가능한지 유효성 검사
    const isWordValid = wordValidation(wordList[i], wordStartIndex, tdElements, nextCharacter);

    // 화면에 단어 출력
    let nextIndexPosition = 0;
    if (isWordValid) {
      wordList[i].split("").forEach((character) => {
        const wordExistsTd = tdElements[wordStartIndex + nextIndexPosition];
        wordExistsTd.innerText = character;
        const dataWord = wordExistsTd.getAttribute("data-word");

        if (dataWord !== null) {
          // data-word 속성이 있을 경우 : 기존 속성에 추가(,로 구분)
          wordExistsTd.setAttribute(
            "data-word",
            `${wordExistsTd.getAttribute("data-word")},${wordList[i]}`
          );
        } else {
          // data-word 속성이 없을 경우 : 새로 추가
          wordExistsTd.setAttribute("data-word", wordList[i]);
        }
        nextIndexPosition += nextCharacter;
      });
    } else {
      wordFailList.push(wordList[i]);
    }
  }
}
