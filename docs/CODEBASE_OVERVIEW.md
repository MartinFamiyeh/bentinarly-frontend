# Codebase Overview

Assessment date: 2026-06-28

Scope:
- Frontend repository: `C:\Users\marti\repos\bentinarly-poll-frontend`
- Backend repository: `C:\Users\marti\repos\bentinarly-core`

No application code was modified during this assessment. The only created files are documentation files under `docs/`.

## Repository Structure

Frontend:
- `src/main.tsx`: React/Vite entry point, mounts `App` inside `BrowserRouter`.
- `src/App.tsx`: route table and top-level providers.
- `src/pages`: page-level screens for public marketing pages, auth, dashboard, survey management, participant flows, analytics, profile, rewards, and notifications.
- `src/components`: UI components grouped by dashboard, survey, participants, marketing/contact/about, and global concerns.
- `src/contexts`: auth, loading, snackbar, projects, dark mode, and survey editing state.
- `src/services/apiService.ts`: Axios service with token attachment, refresh interceptors, and snackbar-aware helpers.
- `src/services/apiClient.ts`: typed endpoint wrapper described as generated from OpenAPI.
- `src/types/api.ts`: TypeScript API model definitions described as generated from Swagger.
- `src/data`: local project/question data still present beside API-driven features.
- `netlify.toml`: SPA deployment config using `npm run build` and `dist`.

Backend:
- `Program.cs`: ASP.NET Core startup, EF Core/PostgreSQL, Identity, JWT, Google auth, Swagger, CORS, migrations, and database seeding.
- `Controllers`: REST controllers for auth, projects, surveys, questions, responses, analytics, templates, payments, subscriptions, wallet, files, users, admin, and webhooks.
- `Features`: MediatR commands and queries organized by feature.
- `DTOs`: request/response contracts.
- `Models`: EF entities and enum models.
- `Data/BentinarlyDbContext.cs`: EF Core context and soft-delete filters.
- `Data/EntityConfigurations`: entity-level EF configuration.
- `Migrations`: EF Core migrations and model snapshot.
- `bentinarlyUnitTests` and `bentinarlyIntegrationTests`: test projects included in `bentinarlyv1.sln`.
- `Dockerfile` and `docker-compose.yml`: backend API and PostgreSQL local/container deployment.

## Application Entry Points

Frontend entry point:
- `src/main.tsx` renders `App` with `BrowserRouter`.
- `src/App.tsx` registers public, auth, dashboard, survey, and participant route groups.
- Top-level providers: `SnackbarProvider`, `DarkModeProvider`, `AuthProvider`, `LoadingProvider`, and `ProjectsProvider`.

Backend entry point:
- `Program.cs` builds the ASP.NET Core app, configures middleware, calls `db.Database.Migrate()` outside the `Testing` environment, and seeds roles/admin data.

## Verification Summary

Commands run:
- `npx tsc -b --pretty false` in `bentinarly-poll-frontend`: failed with TypeScript errors.
- `npm run lint` in `bentinarly-poll-frontend`: failed with 109 errors and 17 warnings.
- `dotnet build` in `bentinarly-core`: failed because a compiler/build output file was locked by another process; warnings were still emitted.
- `dotnet test` in `bentinarly-core`: failed before test execution because `bin\Debug\net9.0\bentinarlyv1.exe` was locked by running process `bentinarlyv1 (12552)`.

## Confirmed Findings

### Frontend Does Not Type-Check

- Relevant file paths: `src/components/survey/ShareModal.tsx`, `src/pages/Profile.tsx`, `src/pages/Rewards.tsx`, `src/pages/Demographics.tsx`, `src/pages/Participants.tsx`, `src/pages/Analytics.tsx`, `src/pages/SurveyAnalytics.tsx`, plus additional files reported by `npx tsc`.
- Current behaviour: `npx tsc -b --pretty false` exits with code 2. Errors include missing symbols (`setIsReceivingResponses`, `isReceivingResponses`), frontend DTO fields not present in generated types, unused declarations under strict compiler settings, and incompatible project/survey ID types.
- Expected behaviour: the frontend should pass TypeScript checks before deployment because `netlify.toml` runs `npm run build`, and `npm run build` runs `tsc -b`.
- Severity: Critical.
- Dependencies: frontend route/page/component cleanup, regenerated or corrected `src/types/api.ts`, alignment with backend DTOs.
- Recommended next action: fix blocking TypeScript errors first, starting with missing symbols and API contract mismatches, then remove or intentionally wire unused code.
- Confidence level: High.

### Frontend Lint Gate Fails

- Relevant file paths: `eslint.config.js`, many files under `src/components`, `src/contexts`, `src/pages`, `src/services`, `src/types`, and `src/utils`.
- Current behaviour: `npm run lint` exits with code 1 and reports 126 problems: 109 errors and 17 warnings. Errors include explicit `any`, unused values, `@ts-ignore`, empty extension interfaces, and React hook rule violations in sidebar navigation components.
- Expected behaviour: lint should pass or failing rules should be intentionally configured before CI/deployment relies on it.
- Severity: High.
- Dependencies: TypeScript cleanup and agreed lint strictness.
- Recommended next action: after type-check fixes, address hook rule violations and unused code first, then replace broad `any` usage with domain types.
- Confidence level: High.

### Backend Build/Test Verification Is Blocked By A Running API Process

- Relevant file paths: `bentinarlyv1.csproj`, `bentinarlyv1.sln`, `bin\Debug\net9.0\bentinarlyv1.exe`.
- Current behaviour: `dotnet build` and `dotnet test` fail because build outputs are locked by a running `bentinarlyv1` process. `dotnet test` does not reach actual test execution.
- Expected behaviour: build and tests should run in a clean process state or use isolated output paths.
- Severity: Medium.
- Dependencies: local runtime process management, build/test scripts, CI environment.
- Recommended next action: stop the running backend process and rerun `dotnet build` and `dotnet test`; record whether tests actually pass after the lock is removed.
- Confidence level: High.

### Refresh Token Endpoint Is Not Implemented

- Relevant file paths: `src/services/apiService.ts`, `src/contexts/AuthContext.tsx`, `src/services/apiClient.ts`, `Features/Auth/Commands/RefreshTokenCommandHandler.cs`, `Controllers/AuthController.cs`.
- Current behaviour: the frontend stores and sends `refreshToken`, and Axios interceptors call `/api/auth/refresh`, but the backend handler returns `Refresh token validation not implemented` after basic token validation.
- Expected behaviour: refresh tokens should be persisted, validated, rotated or revoked, and return a fresh access token when valid.
- Severity: Critical.
- Dependencies: token storage model, refresh-token persistence/revocation strategy, frontend auth flow.
- Recommended next action: implement backend refresh-token persistence and align frontend interceptor behavior with the final response contract.
- Confidence level: High.

### Public Registration And Role-Based Authorization Are Inconsistent

- Relevant file paths: `Features/Auth/Commands/RegisterCommand.cs`, `Features/Auth/Commands/RegisterCommandHandler.cs`, `Models/User.cs`, `Services/JwtService.cs`, `Extensions/DatabaseSeedingExtensions.cs`, controllers using `[Authorize(Roles = "...")]`.
- Current behaviour: public registration accepts a client-provided role enum, while ASP.NET Identity role assignment is separate and appears to be applied clearly only during admin seeding.
- Expected behaviour: public registration should assign safe default roles server-side, and JWT/authorization checks should use one authoritative role system.
- Severity: Critical.
- Dependencies: final user roles, admin provisioning, Identity role migration/backfill.
- Recommended next action: prevent client-side role escalation and unify enum roles with Identity roles before production use.
- Confidence level: High.

### Resource-Level Authorization Is Missing On Several Read Paths

- Relevant file paths: `Features/Surveys/Queries`, `Features/Questions/Queries`, `Features/Responses/Queries`, `Features/Analytics/Queries`.
- Current behaviour: several query handlers load survey, question, response, analytics, or export data by GUID without consistently checking ownership/collaborator access.
- Expected behaviour: all private survey data reads should validate the authenticated user's relationship to the resource.
- Severity: Critical.
- Dependencies: collaborator permissions, project membership rules, participant access rules.
- Recommended next action: add shared resource authorization checks and integration tests for cross-user access denial.
- Confidence level: High.

### Protected Route Component Is Not Wired Into Routes

- Relevant file paths: `src/routes/ProtectedRoutes.tsx`, `src/App.tsx`, `src/layouts/DashboardLayout.tsx`, `src/layouts/SurveyLayout.tsx`, `src/layouts/ParticipantsLayout.tsx`.
- Current behaviour: `ProtectedRoute` exists but `src/App.tsx` renders dashboard, survey, and participant route groups directly without wrapping them in `ProtectedRoute`.
- Expected behaviour: authenticated-only areas should redirect unauthenticated users before rendering protected layouts/pages.
- Severity: High.
- Dependencies: role/permission requirements for dashboard vs participant areas.
- Recommended next action: define route access rules and wire `ProtectedRoute` or layout-level auth guards consistently.
- Confidence level: High.

### Deployment Build Is Currently Expected To Fail

- Relevant file paths: `netlify.toml`, `package.json`, `tsconfig.app.json`.
- Current behaviour: Netlify runs `npm run build`, which runs `tsc -b && vite build`. The TypeScript step currently fails.
- Expected behaviour: production deployment should complete a clean type-check and Vite build.
- Severity: Critical.
- Dependencies: frontend TypeScript fixes.
- Recommended next action: treat TypeScript build failures as the first release blocker for the frontend.
- Confidence level: High.

## Suspected Problems And Risks

### Frontend And Backend API Contracts Are Drifting

- Relevant file paths: `src/types/api.ts`, `src/services/apiClient.ts`, `src/pages/Profile.tsx`, `src/pages/Participants.tsx`, `src/pages/Rewards.tsx`, `src/pages/Demographics.tsx`, backend `DTOs`.
- Current behaviour: frontend pages reference fields and enum objects that do not exist in `src/types/api.ts`, such as profile demographic fields, `availableBalance`, `TransactionType.Credit`, and several analytics fields.
- Expected behaviour: generated frontend types should match live backend DTOs, or pages should be implemented against the actual contract.
- Severity: High.
- Dependencies: current Swagger schema, backend DTO design, generated frontend type workflow.
- Recommended next action: regenerate `src/types/api.ts` from the current backend Swagger after backend builds, then update UI pages to the real DTO shape.
- Confidence level: High.

### API Base URL Configuration Is Inconsistent

- Relevant file paths: `src/services/apiService.ts`, `src/pages/Login.tsx`, `vite.config.ts`, `.env.local`, `Program.cs`.
- Current behaviour: `apiService` defaults to `http://localhost:5136`, Google login defaults to `http://localhost:7141`, Vite proxy targets `https://localhost:7141`, and backend Docker exposes `5136:8080`.
- Expected behaviour: local and deployed frontend should use a single documented API origin strategy.
- Severity: Medium.
- Dependencies: local HTTPS profile, Docker profile, hosted backend URL, Google OAuth callback configuration.
- Recommended next action: centralize API origin configuration and remove hard-coded alternate localhost ports.
- Confidence level: High.

### Backend Configuration Contains Development Secrets And Default Credentials

- Relevant file paths: `appsettings.json`, `appsettings.Development.json`, `docker-compose.yml`, `Extensions/DatabaseSeedingExtensions.cs`.
- Current behaviour: connection strings, JWT key, Google placeholder secret, and admin credentials are present in committed appsettings files; admin seeding can print admin credentials to console when created.
- Expected behaviour: secrets and default credentials should come from environment/user-secrets/secret manager and should not be logged.
- Severity: High.
- Dependencies: deployment secret management and local developer setup.
- Recommended next action: move secrets out of committed configuration, rotate any shared values, and stop logging seeded admin passwords.
- Confidence level: High.

### Automatic Migrations Run At API Startup

- Relevant file paths: `Program.cs`, `Migrations`, `docker-compose.yml`.
- Current behaviour: `db.Database.Migrate()` runs automatically outside `Testing`.
- Expected behaviour: this can be acceptable for small/dev deployments, but production deployments usually run migrations explicitly with rollback visibility.
- Severity: Medium.
- Dependencies: deployment strategy and database migration policy.
- Recommended next action: decide whether auto-migration is acceptable for the target environment; if not, move it to a controlled deployment step.
- Confidence level: Medium.

### Stripe Integration Is Partially Implemented

- Relevant file paths: `Controllers/PaymentsController.cs`, `Controllers/WebhooksController.cs`, `Features/Payments/Commands`, `Features/Subscriptions/Commands`, `Features/Webhooks/Commands/ProcessStripeWebhookCommandHandler.cs`.
- Current behaviour: subscription handlers synthesize Stripe IDs, payment method update is a no-op placeholder, payment confirmation can complete without trusted Stripe verification, and webhook signature verification is explicitly not implemented.
- Expected behaviour: production payments should create/confirm real Stripe resources, verify webhook signatures, and persist trusted external IDs.
- Severity: High.
- Dependencies: Stripe account, webhook secret, product/price mapping, payment state model.
- Recommended next action: mark payment/subscription flows as non-production until Stripe API calls and signature verification are implemented.
- Confidence level: High.

### File Upload URLs Are Not Currently Served

- Relevant file paths: `Features/Files/Commands/UploadFileCommandHandler.cs`, `Program.cs`, `Dockerfile`, `docker-compose.yml`.
- Current behaviour: file upload paths are stored under `wwwroot/uploads`, but the backend startup does not enable static file serving.
- Expected behaviour: returned file URLs should be resolvable through static files, a controlled file endpoint, or external storage.
- Severity: High.
- Dependencies: public/private file access rules and storage provider decision.
- Recommended next action: define file-serving access rules and implement the serving path before relying on upload URLs.
- Confidence level: High.

### Webhook Logging May Capture Sensitive Payloads

- Relevant file paths: `Controllers/WebhooksController.cs`.
- Current behaviour: generic webhook handler logs full request payload at debug level.
- Expected behaviour: webhook payload logging should be redacted or disabled unless explicitly safe.
- Severity: Medium.
- Dependencies: logging provider, log retention, webhook sources.
- Recommended next action: redact payloads or log only event metadata.
- Confidence level: Medium.

### Frontend Stores Tokens In Local Storage

- Relevant file paths: `src/services/apiService.ts`, `src/contexts/AuthContext.tsx`.
- Current behaviour: access and refresh tokens are stored in `localStorage`.
- Expected behaviour: token storage should match the threat model. HTTP-only secure cookies or short-lived access tokens with protected refresh storage are safer for browser apps.
- Severity: Medium.
- Dependencies: backend auth strategy, CSRF strategy, refresh-token implementation.
- Recommended next action: review token storage once refresh-token persistence is implemented.
- Confidence level: Medium.
