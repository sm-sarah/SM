// Sunmin's Works 앱 설치용 서비스 워커 (2026.10.20)
// 휴대폰 브라우저(삼성 인터넷 등)는 "앱 설치"를 하려면 서비스 워커가 있어야 해서 둠.
// 저장(캐시)은 하지 않고 항상 인터넷에서 그대로 받아옴 - 예전 버전이 남아 보이는 일이 없게.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));
self.addEventListener('fetch', () => {});
