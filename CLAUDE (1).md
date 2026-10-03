# works(SM) 작업 규칙 (어느 Claude 계정·대화에서 작업하든 먼저 읽고 따를 것)

이 저장소(sm-sarah/SM)는 Sarah의 개인 업무용 웹 "Sunmin's Works"예요. `SM.html` 한 파일이 앱 전체예요.
회사 앱 Tax.J(https://github.com/sm-sarah/Tax.J)의 데이터를 가져와 개인 방식대로 정리·수정해서 써요.

## 1. 화면(UI)을 틀어지게 하지 않기 — 최우선
- 요청받은 부분만 고친다. 요청하지 않은 화면 구성, 디자인, 스타일, 간격, 가로·세로 폭은 바꾸지 않는다.
- 다른 곳도 바꿔야 할 것 같으면 먼저 물어본다.
- works는 Tax.J와 일부러 다른 색(핑크·골드)을 쓴다. Tax.J 디자인에 맞추지 않는다.
- 기존 코드의 "요청 배경" 주석은 지우지 않는다.

## 2. 작업 방식 (사용량 절약)
- 파일을 채팅에 올려달라고 하지 않는다. 저장소를 직접 내려받는다:
  `git clone --depth 1 https://github.com/sm-sarah/SM.git`
  (Tax.J 데이터 관련이면 `https://github.com/sm-sarah/Tax.J.git`도 같은 방식. Tax.J 규칙은 그 저장소의 CLAUDE.md를 따른다.)
- 파일 전체를 읽지 않는다. 함수명·버튼 문구·클래스명으로 grep해서 해당 부분만 열어 본다.
- 요청이 모호하면 넓게 뒤지기 전에 어느 화면·기능인지 한 줄로 묻는다.
- 수정은 필요한 부분만 문자열 치환으로 한다. 파일을 통째로 다시 쓰지 않는다.
- 채팅에 코드를 길게 옮겨 적지 않는다. 무엇을 왜 바꿨는지 한두 문장으로 알려준다.
- 고친 파일은 파일명 `SM.html` 그대로 전달한다. 사용자가 직접 GitHub에 올린다. 허락 없이 저장소에 push하지 않는다.
- 답변은 항상 한국어로만 한다.

## 3. Tax.J 데이터 사용 원칙
- Tax.J → works 방향으로 읽기만 한다. works 때문에 Tax.J 원본 데이터를 쓰거나 바꾸지 않는다.
- 가져온 데이터의 수정은 works 저장 공간(localStorage / 개인 Google 시트)에서 한다.
- 현재 가져오기: Tax.J 엑셀 업로드(`importTaxjExcel`), 마스터 시트 가져오기(`importFromMasterSheet` 등). 깨뜨리지 않고 대체 수단으로 유지한다.
- 목표: Tax.J와 같은 Firebase Firestore(프로젝트 `taxj-a3e01`, 컬렉션 `taxj`)를 실시간으로 읽기.
  - 필드명·문서 경로는 Tax.J 코드에서 grep으로 확인해 그대로 맞춘다. 짐작하지 않는다.
  - Tax.J는 @ciacc.co.kr Google 계정으로 로그인한다. Firestore 접근 규칙 때문에 works에서도 같은 계정 로그인이 필요할 수 있다.
  - Firebase 보안 규칙·승인 도메인 등 회사 쪽 설정을 바꿔야 하면 먼저 설명하고 확인받는다.

## 4. 구성
| 역할 | 내용 |
|---|---|
| 파일 | `SM.html` 한 파일 |
| 데이터 저장 | 브라우저 localStorage + Google Sheets/Drive(Google 로그인) |
| 연동 대상 | Tax.J (https://github.com/sm-sarah/Tax.J, Firestore `taxj-a3e01`) |
