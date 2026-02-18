# Data-Plane - Camel Quarkus Runtime Engine

Apache Camel Quarkus 기반 Integration Route 실행 엔진

## 구조

```
data-plane/src/main/java/com/example/dp/
├── DataPlaneApplication.java    ← Main Application
├── runtime/
│   ├── CamelContextManager.java ← CamelContext 관리
│   └── RouteManager.java        ← Route 동적 관리
├── loader/
│   └── YamlRouteLoader.java     ← YAML DSL 로더
├── health/
│   ├── RouteHealthCheck.java    ← Health Check
│   └── HealthReporter.java      ← 주기적 상태 보고
├── api/
│   ├── LoaderController.java    ← Route 로드/제어 API
│   └── StatusController.java    ← 상태 조회 API
└── config/
    └── CorsConfig.java          ← CORS 설정
```

## 실행 방법

### 개발 모드
```bash
./mvnw quarkus:dev
```

### 프로덕션 빌드
```bash
./mvnw package
java -jar target/quarkus-app/quarkus-run.jar
```

## API 엔드포인트

### 상태 조회
- `GET /api/status` - Data-Plane 상태
- `GET /api/status/ping` - Ping
- `GET /health` - Health Check

### Route 관리
- `POST /api/loader/load` - YAML로 Route 로드
- `POST /api/loader/reload/{routeId}` - Route 재로드
- `DELETE /api/loader/unload/{routeId}` - Route 제거
- `POST /api/loader/start/{routeId}` - Route 시작
- `POST /api/loader/stop/{routeId}` - Route 정지
- `GET /api/loader/status/{routeId}` - Route 상태 조회
- `GET /api/loader/routes` - 모든 Route 조회
- `POST /api/loader/test` - 테스트 Route 로드

## 사용 예시

### 1. 테스트 Route 로드
```bash
curl -X POST http://localhost:8081/api/loader/test
```

### 2. YAML로 Route 로드
```bash
curl -X POST http://localhost:8081/api/loader/load \
  -H "Content-Type: application/json" \
  -d '{
    "routeId": "my-route",
    "yamlDsl": "- route:\n    id: my-route\n    from:\n      uri: timer:test?period=5000\n      steps:\n        - log:\n            message: \"Hello!\""
  }'
```

### 3. Route 상태 조회
```bash
curl http://localhost:8081/api/loader/status/my-route
```

### 4. 모든 Route 조회
```bash
curl http://localhost:8081/api/loader/routes
```

### 5. Route 정지
```bash
curl -X POST http://localhost:8081/api/loader/stop/my-route
```

## 샘플 YAML Route

샘플 Route는 `src/main/resources/routes/` 디렉토리에 있습니다:
- `sample-timer-route.yaml` - Timer 기반 Route
- `sample-http-route.yaml` - HTTP 엔드포인트
- `sample-direct-route.yaml` - Direct 채널 통신

## 모니터링

### Health Check
```bash
curl http://localhost:8081/health
```

### Context 상태
```bash
curl http://localhost:8081/api/status
```

## 설정

`src/main/resources/application.properties` 파일에서 설정 가능:
- `quarkus.http.port=8081` - HTTP 포트
- `control-plane.url` - Control-Plane URL
- Logging 레벨

## 지원 Camel 컴포넌트

현재 포함된 컴포넌트:
- platform-http (HTTP endpoints)
- direct (Direct channels)
- log (Logging)
- timer (Timer triggers)
- kafka (Kafka integration)
- http (HTTP client)
- ftp (FTP client)

추가 컴포넌트는 `pom.xml`에서 추가 가능.
