# Camel Platform 구현 진행 상황

> 마지막 업데이트: 2026-02-13

---

## 완료된 작업

### 1단계: Backend 완성 (control-plane/backend)

| 파일 | 작업 | 상태 |
|------|------|------|
| `store/RouteEntity.java` | JPA Entity 신규 생성 (id, name, description, yamlDsl, status, createdAt, updatedAt) | 완료 |
| `store/RouteRepository.java` | `JpaRepository<RouteEntity, String>` 확장으로 전환 | 완료 |
| `service/RouteService.java` | ConcurrentHashMap → RouteRepository JPA 전환, Entity↔DTO 변환, `update()`, `updateStatus()` 추가 | 완료 |
| `api/RouteController.java` | `PUT /api/routes/{id}`, `POST /api/routes/{id}/deploy` 추가, `@CrossOrigin` 적용, DeployManager 주입 | 완료 |
| `deploy/DeployManager.java` | RestTemplate으로 Data-Plane `/routes/deploy` 호출 구현, `data-plane.url` 프로퍼티 주입 | 완료 |
| `ControlPlaneApplication.java` | 글로벌 CORS 설정 (`localhost:5173` 허용, GET/POST/PUT/DELETE/OPTIONS) | 완료 |

**변경하지 않은 파일:**
- `pom.xml` — 이미 `spring-boot-starter-data-jpa`, `h2` 의존성 포함
- `application.yml` — 이미 H2, JPA, `data-plane.url` 설정 포함

### 2단계: Data-Plane 완성

| 파일 | 작업 | 상태 |
|------|------|------|
| `runtime/CamelContextManager.java` | `addRouteFromYaml()` (RoutesLoader 사용), `removeRoute()` 메서드 추가, 로깅 | 완료 |
| `loader/RouteLoader.java` | CamelContextManager 주입, YAML DSL 동적 등록 반복 처리, 성공/실패 카운트 응답 | 완료 |
| `health/HealthReporter.java` | CamelContextManager 주입, CamelContext 라우트 상태 조회 → RouteStatusResponse 변환 | 완료 |

**변경하지 않은 파일:**
- `pom.xml` — 이미 `camel-quarkus-yaml-dsl` 의존성 포함
- `application.properties` — 변경 불필요

### 3단계: Frontend 완성

| 파일 | 작업 | 상태 |
|------|------|------|
| `package.json` | `@xyflow/react` (v12), `lucide-react` 의존성 추가 | 완료 |
| `tsconfig.node.json` | `composite: true`, `noEmit: false` 수정 (빌드 오류 해결) | 완료 |
| `src/api/client.ts` | `RouteDefinition`, `RouteStatusResponse` 타입 정의, `routeApi` (CRUD+deploy), `healthApi` export | 완료 |
| `src/components/Layout.tsx` | 상단 헤더 (로고+네비게이션) + `<Outlet>` 메인 영역 | 완료 |
| `src/pages/DashboardPage.tsx` | 통계 카드 4개 (Total/Ready/Draft/Errors), 최근 Route 테이블, API 연동 | 완료 |
| `src/pages/RoutesPage.tsx` | Route CRUD 테이블, 편집/배포/삭제 버튼, 상태 뱃지 | 완료 |
| `src/pages/RouteEditorPage.tsx` | 플로우 디자이너 (도구모음+캔버스), 저장/배포/YAML 미리보기, URL 파라미터로 신규/수정 구분 | 완료 |
| `src/components/flow/FlowCanvas.tsx` | React Flow 래퍼, 드래그앤드롭 노드 생성, 연결선 처리 | 완료 |
| `src/components/flow/ToolboxPanel.tsx` | 드래그 가능한 컴포넌트 목록 (Start, Endpoint, If/Else, Log, Transform, End) | 완료 |
| `src/components/flow/nodeTypes.tsx` | 커스텀 노드 6종 (StartNode, EndNode, EndpointNode, ConditionNode, LogNode, TransformNode) | 완료 |
| `src/components/flow/flowToYaml.ts` | React Flow 그래프 → Camel YAML DSL 변환 유틸리티 | 완료 |
| `src/App.tsx` | 라우팅: `/` Dashboard, `/routes` 목록, `/routes/new` 신규, `/routes/:id/edit` 수정 | 완료 |
| `src/App.css` | 전체 스타일링 (레이아웃, 카드, 테이블, 뱃지, 버튼, 에디터, 툴박스, 캔버스, YAML 모달) | 완료 |

---

## 빌드 검증 결과

| 항목 | 결과 |
|------|------|
| `npx tsc --noEmit` | 통과 (에러 없음) |
| `npx vite build` | 통과 — `index.js` 405KB, `index.css` 21KB |
| `npm install` | 의존성 설치 완료 |

---

## 아직 하지 않은 작업 / 다음 단계

### 검증 결과 (2026-02-13 수행)

#### Maven 빌드
- [x] `shared`: `mvn clean install` — BUILD SUCCESS
- [x] `control-plane/backend`: `mvn clean install` — BUILD SUCCESS
- [x] `data-plane`: `mvn clean package` — BUILD SUCCESS
  - 수정: `CamelContextManager.java`에서 `getRoutesLoader()` → `getCamelContextExtension().getContextPlugin(RoutesLoader.class)` (Camel 4.x API 변경)
  - 수정: `backend/pom.xml`에 `maven-compiler-plugin` `-parameters` 플래그 추가 (`@PathVariable` 이름 인식용)

#### Backend API 테스트 (curl)
- [x] `GET /api/routes` (empty) → `[]` 정상
- [x] `POST /api/routes` (create) → UUID 생성된 route 반환 정상
- [x] `GET /api/routes/{id}` → 단건 조회 정상
- [x] `PUT /api/routes/{id}` → name/description/yamlDsl 업데이트 정상
- [x] `POST /api/routes/{id}/deploy` → Data-Plane 미실행 시 `Connection refused` (예상된 에러)
- [x] `DELETE /api/routes/{id}` → HTTP 200, 삭제 확인
- [x] `GET /api/routes` (after delete) → `[]` 정상

#### Frontend 빌드
- [x] `npx tsc --noEmit` — 에러 없음
- [x] `npx vite build` — 성공 (JS 405KB, CSS 21KB)

#### 아직 수행하지 않은 검증
- [ ] Data-Plane: `mvn quarkus:dev` 후 `/routes/deploy`, `/health/routes` 엔드포인트 실제 호출 테스트
- [ ] Frontend: `npm run dev` 후 브라우저에서 대시보드, Route 목록, 플로우 디자이너 UI 동작 확인
- [ ] E2E: Route 생성 → 플로우 디자인 → 저장 → 배포 → 상태 확인 전체 흐름

### 기능 개선 (선택)
- [ ] Route 편집 시 기존 YAML을 파싱하여 노드로 복원하는 기능 (YAML → Flow 역변환)
- [ ] 노드 속성 편집 패널 (노드 클릭 시 URI, 조건식 등 입력)
- [ ] Data-Plane 연결 상태를 Dashboard에 실시간 표시 (polling 또는 WebSocket)
- [ ] 배포 이력 관리 (Deployments 페이지)
- [ ] 에러 핸들링 개선 (toast 알림 등)
- [ ] Route 상태 관리 개선 (RUNNING/STOPPED/ERROR를 RouteEntity의 status 필드와 연동)

### 인프라 / 배포
- [ ] Backend Maven 빌드 확인: `cd control-plane/backend && mvn clean install`
- [ ] Data-Plane Maven 빌드 확인: `cd data-plane && mvn clean package`
- [ ] Docker Compose 구성 (optional)

---

## 파일 구조 (변경된 파일 표시)

```
camel-platform/
├── PROGRESS.md                         ← 이 파일 (신규)
├── CLAUDE.md
├── shared/                             ← 변경 없음
│   └── src/main/java/com/example/shared/
│       ├── dsl/RouteDefinition.java
│       └── api/
│           ├── RouteDeployRequest.java
│           └── RouteStatusResponse.java
├── control-plane/
│   ├── backend/
│   │   └── src/main/java/com/example/cp/
│   │       ├── ControlPlaneApplication.java    ★ 수정 (CORS 추가)
│   │       ├── api/RouteController.java        ★ 수정 (PUT, deploy, CORS)
│   │       ├── service/RouteService.java       ★ 수정 (JPA 전환)
│   │       ├── store/
│   │       │   ├── RouteEntity.java            ★ 신규
│   │       │   └── RouteRepository.java        ★ 수정 (JpaRepository)
│   │       └── deploy/DeployManager.java       ★ 수정 (RestTemplate)
│   └── frontend/
│       ├── package.json                        ★ 수정 (의존성 추가)
│       ├── tsconfig.node.json                  ★ 수정 (composite)
│       └── src/
│           ├── App.tsx                         ★ 수정 (라우팅)
│           ├── App.css                         ★ 수정 (전체 스타일)
│           ├── api/client.ts                   ★ 수정 (API 확장)
│           ├── components/
│           │   ├── Layout.tsx                  ★ 신규
│           │   └── flow/
│           │       ├── FlowCanvas.tsx          ★ 신규
│           │       ├── ToolboxPanel.tsx         ★ 신규
│           │       ├── nodeTypes.tsx            ★ 신규
│           │       └── flowToYaml.ts           ★ 신규
│           └── pages/
│               ├── DashboardPage.tsx           ★ 수정 (통계+테이블)
│               ├── RoutesPage.tsx              ★ 신규
│               └── RouteEditorPage.tsx         ★ 신규
└── data-plane/
    └── src/main/java/com/example/dp/
        ├── runtime/CamelContextManager.java    ★ 수정 (add/remove 메서드)
        ├── loader/RouteLoader.java             ★ 수정 (동적 로딩)
        └── health/HealthReporter.java          ★ 수정 (상태 조회)
```

---

## API 엔드포인트 요약

### Control-Plane Backend (:8080)
| Method | Path | 설명 |
|--------|------|------|
| GET | `/api/routes` | 전체 Route 목록 |
| GET | `/api/routes/{id}` | 단건 조회 |
| POST | `/api/routes` | Route 생성 |
| PUT | `/api/routes/{id}` | Route 수정 |
| DELETE | `/api/routes/{id}` | Route 삭제 |
| POST | `/api/routes/{id}/deploy` | Data-Plane에 배포 |

### Data-Plane (:8081)
| Method | Path | 설명 |
|--------|------|------|
| POST | `/routes/deploy` | YAML DSL 동적 로딩 |
| GET | `/health/routes` | 실행 중인 Route 상태 목록 |

### Frontend (:5173)
| Path | 페이지 |
|------|--------|
| `/` | Dashboard (통계 카드 + 최근 Route) |
| `/routes` | Route 목록 (CRUD 테이블) |
| `/routes/new` | 플로우 디자이너 (신규 생성) |
| `/routes/:id/edit` | 플로우 디자이너 (수정) |
