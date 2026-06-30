# Technical Debt

Assessment date: 2026-06-28

This file tracks debt and risk that may not be a confirmed product bug yet. Confirmed runtime/build failures are also listed in `BUG_REGISTER.md`.

## Build, Type, And Lint Debt

### Strict TypeScript Settings Expose Incomplete Frontend Work

- Relevant file paths: `tsconfig.app.json`, `src/components`, `src/pages`, `src/contexts`, `src/services`, `src/types/api.ts`.
- Current behaviour: `strict`, `noUnusedLocals`, and `noUnusedParameters` are enabled, and the current source does not satisfy them.
- Expected behaviour: either the project remains strict and code is cleaned up, or strictness is intentionally staged with documented exceptions.
- Severity: Critical.
- Dependencies: frontend feature stabilization and API contract alignment.
- Recommended next action: keep strict settings, fix compile errors in priority order, and avoid lowering compiler standards to hide incomplete code.
- Confidence level: High.

### ESLint Rules Are Not Yet Being Kept Green

- Relevant file paths: `eslint.config.js`, `src`.
- Current behaviour: `npm run lint` reports 109 errors and 17 warnings.
- Expected behaviour: lint should be a reliable quality gate.
- Severity: High.
- Dependencies: TypeScript cleanup.
- Recommended next action: resolve hook-rule violations first, then unused declarations, then broad `any` usage.
- Confidence level: High.

### Generated Type File Is Treated As Editable Application Surface

- Relevant file paths: `src/types/api.ts`, `src/services/apiClient.ts`.
- Current behaviour: `src/types/api.ts` is described as generated from `http://localhost:7141/swagger/v1/swagger.json`, but frontend pages are drifting away from it and it contains lint errors such as empty extension interfaces.
- Expected behaviour: generated files should have a repeatable regeneration command and either be excluded from style lint rules or generated in lint-compliant form.
- Severity: Medium.
- Dependencies: backend Swagger availability and OpenAPI generator choice.
- Recommended next action: document/regenerate the API client and decide whether generated code should be linted.
- Confidence level: High.

## Architecture And Duplication Debt

### Local UI Models Conflict With API DTOs

- Relevant file paths: `src/types/project.ts`, `src/data/projects.ts`, `src/contexts/ProjectsContext.tsx`, `src/components/dashboard/ProjectListItem.tsx`, `src/components/dashboard/SidebarNavigation.tsx`, `src/types/api.ts`.
- Current behaviour: local project models and backend `ProjectDto` are both used; TypeScript reports mismatches in ID types and required fields.
- Expected behaviour: UI should use backend DTOs directly or a clearly mapped view model.
- Severity: High.
- Dependencies: final project/member/survey display requirements.
- Recommended next action: define one project view model and central mapping from backend DTOs.
- Confidence level: High.

### Survey Taking Components Are Duplicated

- Relevant file paths: `src/components/survey/TakeSurvey.tsx`, `src/components/participants/TakeSurvey.tsx`, `src/components/survey/PreviewSurvey.tsx`.
- Current behaviour: there are multiple survey-taking/preview implementations with broad `any` usage.
- Expected behaviour: shared survey rendering logic should be reused for preview and participant-taking flows where behavior overlaps.
- Severity: Medium.
- Dependencies: final survey question type model and preview vs live-submit differences.
- Recommended next action: extract typed question rendering primitives after the question DTO is stabilized.
- Confidence level: Medium.

### API Error Handling Is Split Between Global Service And Page-Level Catch Blocks

- Relevant file paths: `src/services/apiService.ts`, `src/pages/Login.tsx`, `src/pages/Profile.tsx`, `src/pages/Rewards.tsx`, `src/pages/Demographics.tsx`, `src/contexts/ProjectsContext.tsx`.
- Current behaviour: `apiService` has friendly message handling, while many pages catch `any` and inspect `error.response?.data?.detail` directly.
- Expected behaviour: expected API errors should be normalized in one service layer and exposed to UI with typed errors.
- Severity: Medium.
- Dependencies: API error response contract.
- Recommended next action: add a typed API error helper and migrate page-level catch blocks.
- Confidence level: High.

### Context Modules Export Hooks And Components Together

- Relevant file paths: `src/contexts/AuthContext.tsx`, `src/contexts/DarkModeContext.tsx`, `src/contexts/LoadingContext.tsx`, `src/contexts/ProjectsContext.tsx`, `src/contexts/SnackbarContext.tsx`, `src/contexts/SurveyEditingContext.tsx`.
- Current behaviour: ESLint Fast Refresh warnings appear because context files export both provider components and non-component hooks/functions.
- Expected behaviour: provider components and hooks can be split into separate files if Fast Refresh correctness matters.
- Severity: Low.
- Dependencies: local development workflow.
- Recommended next action: defer until build blockers are fixed, then split contexts if warnings are enforced.
- Confidence level: Medium.

## Backend Technical Debt

### Role And Authorization Model Is Split Across Enum And Identity Roles

- Relevant file paths: `Models/User.cs`, `Models/Enums/UserRole.cs`, `Services/JwtService.cs`, `Extensions/DatabaseSeedingExtensions.cs`, `Features/Auth/Commands/RegisterCommandHandler.cs`.
- Current behaviour: the backend uses both a `User.Role` enum and ASP.NET Identity roles. Public registration can set the enum role, while `[Authorize(Roles = ...)]` depends on Identity roles.
- Expected behaviour: one authoritative role model should drive persistence, JWT claims, and authorization attributes/policies.
- Severity: Critical.
- Dependencies: final role taxonomy, existing user migration/backfill, admin provisioning.
- Recommended next action: centralize role assignment and token claim generation before adding more role-based UI/API features.
- Confidence level: High.

### Query Handlers Need Shared Resource Authorization

- Relevant file paths: `Features/Surveys/Queries`, `Features/Questions/Queries`, `Features/Responses/Queries`, `Features/Analytics/Queries`.
- Current behaviour: command handlers often check creator/collaborator permissions, while several query handlers rely mainly on controller-level `[Authorize]`.
- Expected behaviour: read and write paths should both enforce resource ownership and collaboration permissions.
- Severity: Critical.
- Dependencies: collaborator permissions and project member roles.
- Recommended next action: introduce shared authorization helpers/services and add negative-access integration tests.
- Confidence level: High.

### MediatR Package Version Mismatch

- Relevant file paths: `bentinarlyv1.csproj`, `bentinarlyUnitTests/bentinarlyUnitTests.csproj`, `bentinarlyIntegrationTests/bentinarlyIntegrationTests.csproj`.
- Current behaviour: restore/build emits `NU1608`; `MediatR.Extensions.Microsoft.DependencyInjection 11.1.0` requires MediatR `< 12.0.0`, but `MediatR 12.4.1` is resolved.
- Expected behaviour: package versions should satisfy dependency constraints.
- Severity: Medium.
- Dependencies: MediatR registration API version and package compatibility.
- Recommended next action: remove the obsolete extensions package if using MediatR 12 registration, or align all MediatR packages to compatible versions.
- Confidence level: High.

### Nullable Warnings Indicate Potential Runtime Null Handling Gaps

- Relevant file paths: `Program.cs`, `Controllers/SurveysController.cs`, `Features/Admin/Queries`, `Features/Auth/Commands`, `Features/Users`, `Features/Templates`, `Features/Webhooks/Commands/ProcessStripeWebhookCommandHandler.cs`.
- Current behaviour: backend build output reports many nullable warnings (`CS8601`, `CS8602`, `CS8604`) and an unused exception variable warning.
- Expected behaviour: nullable warnings should be triaged and either fixed or intentionally suppressed with justification.
- Severity: Medium.
- Dependencies: DTO nullability decisions and external provider configuration.
- Recommended next action: fix configuration nullability in `Program.cs`, then query projection null dereferences in admin/users, then webhook status handling.
- Confidence level: High.

### Automatic Startup Migrations Reduce Deployment Control

- Relevant file paths: `Program.cs`, `Migrations`, `docker-compose.yml`.
- Current behaviour: API startup applies pending migrations automatically outside `Testing`.
- Expected behaviour: production database changes should usually be explicit deployment steps with rollback/backup control.
- Severity: Medium.
- Dependencies: target deployment process.
- Recommended next action: keep for local Docker if useful, but gate production migration execution behind an explicit setting or deployment job.
- Confidence level: Medium.

### Seeding Logs Sensitive Admin Credentials

- Relevant file paths: `Extensions/DatabaseSeedingExtensions.cs`, `appsettings.json`, `appsettings.Development.json`.
- Current behaviour: when an admin user is created, the seeding extension writes the admin email and password to console.
- Expected behaviour: seeded credentials should not be logged.
- Severity: High.
- Dependencies: admin provisioning process.
- Recommended next action: remove password logging and move seeded password to secrets/user-secrets.
- Confidence level: High.

### Placeholder Display Names Are Repeated In Backend DTO Mapping

- Relevant file paths: `Features/Surveys/Commands/CreateSurveyCommandHandler.cs`, `Features/Surveys/Commands/PublishSurveyCommandHandler.cs`, `Features/Surveys/Queries/GetSurveysByUserQueryHandler.cs`, `Features/Surveys/Queries/GetSurveyByIdQueryHandler.cs`, `Features/Responses/Commands/SubmitSurveyResponseCommandHandler.cs`, `Features/Responses/Queries`.
- Current behaviour: several DTO projections use `CreatorName = "User"` or `UserName = "User"`.
- Expected behaviour: display names should come from related user data or a shared mapping helper.
- Severity: Medium.
- Dependencies: user display-name convention and query includes/projections.
- Recommended next action: centralize display-name mapping and update projections to fetch required user fields efficiently.
- Confidence level: High.

## Security Debt

### Committed Configuration Contains Secrets Or Secret-Like Values

- Relevant file paths: `appsettings.json`, `appsettings.Development.json`, `docker-compose.yml`.
- Current behaviour: JWT signing key, database credentials, admin credentials, and placeholder Google secret values are present in source-controlled configuration.
- Expected behaviour: sensitive values should be environment-specific and not committed.
- Severity: High.
- Dependencies: secret management tooling and deployment environment.
- Recommended next action: rotate shared values and replace committed secrets with safe placeholders plus documented setup.
- Confidence level: High.

### Stripe Webhook Signature Verification Is Missing

- Relevant file paths: `Controllers/WebhooksController.cs`, `Features/Webhooks/Commands/ProcessStripeWebhookCommandHandler.cs`.
- Current behaviour: `Stripe-Signature` is read but not verified; handler comments say signature verification is not implemented.
- Expected behaviour: Stripe webhook events must be verified before mutating payment/subscription state.
- Severity: High.
- Dependencies: Stripe webhook signing secret.
- Recommended next action: use Stripe SDK webhook construction/verification before processing event payloads.
- Confidence level: High.

### Upload Storage And Serving Are Not Aligned

- Relevant file paths: `Features/Files/Commands/UploadFileCommandHandler.cs`, `Features/Users/Commands/UploadProfileImageCommandHandler.cs`, `Program.cs`, `Dockerfile`, `docker-compose.yml`.
- Current behaviour: the Docker setup creates upload folders and volumes, but profile images return placeholder external URLs and uploaded local files are not served by static file middleware.
- Expected behaviour: file upload, storage, serving, and access control should be designed together.
- Severity: High.
- Dependencies: public/private file policy, local disk vs cloud storage decision.
- Recommended next action: decide storage strategy and add serving middleware/controller or external storage integration.
- Confidence level: High.

### Generic Webhook Logs Full Payload

- Relevant file paths: `Controllers/WebhooksController.cs`.
- Current behaviour: generic webhook logs the full payload at debug level.
- Expected behaviour: logs should avoid storing sensitive external payloads.
- Severity: Medium.
- Dependencies: logging sink and webhook source requirements.
- Recommended next action: log source, event ID, and payload hash/size instead of full body.
- Confidence level: Medium.

### Browser Token Storage Uses Local Storage

- Relevant file paths: `src/services/apiService.ts`, `src/contexts/AuthContext.tsx`.
- Current behaviour: access and refresh tokens are stored in `localStorage`.
- Expected behaviour: token storage should be chosen with a clear XSS/CSRF threat model.
- Severity: Medium.
- Dependencies: backend refresh token implementation and cookie support decision.
- Recommended next action: review token storage before production auth launch.
- Confidence level: Medium.

## Performance And Reliability Debt

### Frontend Hook Dependencies Are Incomplete

- Relevant file paths: `src/pages/Analytics.tsx`, `src/pages/Demographics.tsx`, `src/pages/Rewards.tsx`, `src/pages/SurveyAnalytics.tsx`, `src/pages/Surveys.tsx`, `src/pages/Templates.tsx`, `src/contexts/ProjectsContext.tsx`, `src/components/survey/ShareModal.tsx`.
- Current behaviour: ESLint reports missing dependencies in several `useEffect` calls.
- Expected behaviour: effects should either include stable dependencies or use documented callbacks/ref patterns.
- Severity: Medium.
- Dependencies: service hook stability and loading/snackbar context APIs.
- Recommended next action: stabilize API hooks or move fetching into dedicated hooks with correct dependencies.
- Confidence level: High.

### Questionnaire Autosave Is Disabled/Ad Hoc

- Relevant file paths: `src/pages/Questionnaires.tsx`.
- Current behaviour: comments say autosave is disabled to avoid too many API calls, while other route-change/localStorage snapshot logic remains.
- Expected behaviour: draft persistence should be intentional, debounced, and observable to users.
- Severity: Medium.
- Dependencies: survey draft lifecycle and backend update semantics.
- Recommended next action: define draft save policy before enabling autosave.
- Confidence level: High.

### Build/Test Commands Are Sensitive To Running Processes

- Relevant file paths: `bentinarlyv1.sln`, `bentinarlyv1.csproj`.
- Current behaviour: local `dotnet build` and `dotnet test` failed because a running API executable locked output files.
- Expected behaviour: tests should be runnable while dev services are active, or scripts should explain required process state.
- Severity: Medium.
- Dependencies: local development scripts and CI setup.
- Recommended next action: document stopping the API before local test runs or configure separate output paths for test builds.
- Confidence level: High.
