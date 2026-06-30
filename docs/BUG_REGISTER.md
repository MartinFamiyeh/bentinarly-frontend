# Bug Register

Assessment date: 2026-06-28

Classification:
- Confirmed bug: directly proven by compiler/linter output or explicit broken code path.
- Suspected problem: likely issue from code inspection, but may depend on unfinished product decisions.
- Verification blocker: prevented verification from completing; not proof that the feature itself fails.

## Confirmed Bugs

### BUG-001: Frontend TypeScript Compilation Fails

- Classification: Confirmed bug.
- Relevant file paths: `src/components/dashboard/CreateSurvey.tsx`, `src/components/dashboard/DeleteProject.tsx`, `src/components/dashboard/MoveSurvey.tsx`, `src/components/dashboard/ProjectListItem.tsx`, `src/components/dashboard/SidebarNavigation.tsx`, `src/components/survey/ShareModal.tsx`, `src/pages/Profile.tsx`, `src/pages/Rewards.tsx`, `src/pages/Demographics.tsx`, `src/pages/Participants.tsx`, `src/pages/Analytics.tsx`, `src/pages/SurveyAnalytics.tsx`, `src/pages/Templates.tsx`, `src/types/api.ts`.
- Current behaviour: `npx tsc -b --pretty false` exits with code 2 and reports many errors.
- Expected behaviour: TypeScript should compile successfully before `vite build`.
- Severity: Critical.
- Dependencies: frontend type cleanup, API DTO alignment.
- Recommended next action: fix errors that block emit/build first: missing symbols, nonexistent DTO fields, and incompatible ID/model types.
- Confidence level: High.

### BUG-002: `ShareModal` References Missing State

- Classification: Confirmed bug.
- Relevant file paths: `src/components/survey/ShareModal.tsx`.
- Current behaviour: JSX references `setIsReceivingResponses` and `isReceivingResponses`, but these names are not defined.
- Expected behaviour: response collection toggle should be backed by component state or backend survey status/settings.
- Severity: Critical.
- Dependencies: survey response collection requirements and backend endpoint choice.
- Recommended next action: decide whether the toggle updates local UI, survey settings, or publish/pause/close state; implement the missing state/API call accordingly.
- Confidence level: High.

### BUG-003: Deployment Build Will Fail On Current Frontend Source

- Classification: Confirmed bug.
- Relevant file paths: `netlify.toml`, `package.json`, `tsconfig.app.json`.
- Current behaviour: `netlify.toml` runs `npm run build`, and `npm run build` runs `tsc -b && vite build`; the TypeScript step currently fails.
- Expected behaviour: Netlify build should succeed from a clean checkout.
- Severity: Critical.
- Dependencies: BUG-001.
- Recommended next action: treat frontend type-check failure as release-blocking.
- Confidence level: High.

### BUG-004: Refresh Token Flow Always Fails After Initial Validation

- Classification: Confirmed bug.
- Relevant file paths: `src/services/apiService.ts`, `src/services/apiClient.ts`, `src/contexts/AuthContext.tsx`, `Controllers/AuthController.cs`, `Features/Auth/Commands/RefreshTokenCommandHandler.cs`.
- Current behaviour: frontend calls `/api/auth/refresh`, but the handler returns an error saying refresh token validation is not implemented.
- Expected behaviour: valid refresh tokens should produce a new access token and optionally rotate refresh tokens.
- Severity: Critical.
- Dependencies: refresh-token persistence schema/model and revocation policy.
- Recommended next action: implement persisted refresh tokens and update frontend handling for failed refresh vs expired session.
- Confidence level: High.

### BUG-005: Protected Frontend Routes Are Not Protected

- Classification: Confirmed bug.
- Relevant file paths: `src/routes/ProtectedRoutes.tsx`, `src/App.tsx`.
- Current behaviour: `ProtectedRoute` exists, but dashboard, survey, and participant route groups are not wrapped with it in `src/App.tsx`.
- Expected behaviour: protected UI routes should redirect unauthenticated users before protected screens render.
- Severity: High.
- Dependencies: route access matrix and role distinctions.
- Recommended next action: wrap protected route groups or implement auth checks inside protected layouts.
- Confidence level: High.

### BUG-006: Participant Registration Sends Fields Outside Its Type Contract

- Classification: Confirmed bug.
- Relevant file paths: `src/pages/Participants.tsx`, `src/types/api.ts`, `Features/Auth/Commands/RegisterParticipantCommand.cs`.
- Current behaviour: `Participants.tsx` constructs `RegisterParticipantCommand` with `gender` and `dateOfBirth`, which are not in the generated frontend type. It also sets `mobileNumber` to the user's email as a temporary workaround.
- Expected behaviour: frontend should submit only fields accepted by the backend, or backend/frontend DTOs should both include required demographic fields.
- Severity: High.
- Dependencies: participant profile/demographic requirements.
- Recommended next action: confirm participant registration fields, then update backend DTOs and generated frontend types or remove unsupported fields from the form.
- Confidence level: High.

### BUG-007: Profile Page Uses User Fields Not Present In API Types

- Classification: Confirmed bug.
- Relevant file paths: `src/pages/Profile.tsx`, `src/components/dashboard/UserProfileSection.tsx`, `src/types/api.ts`, `Features/Users/Commands/UpdateUserProfileCommand.cs`, `DTOs/UserDto.cs`.
- Current behaviour: profile UI references `phoneNumber`, `bio`, `dateOfBirth`, `gender`, `location`, and `profilePicture`, while generated `UserDto` exposes `mobileNumber` and `profileImageUrl` instead.
- Expected behaviour: profile UI should align with backend user DTOs or backend contracts should be intentionally expanded.
- Severity: High.
- Dependencies: profile product requirements and database schema.
- Recommended next action: reconcile profile DTO fields, then regenerate frontend types.
- Confidence level: High.

### BUG-008: Rewards Page Uses Type-Only Enums As Runtime Values

- Classification: Confirmed bug.
- Relevant file paths: `src/pages/Rewards.tsx`, `src/types/api.ts`.
- Current behaviour: `Rewards.tsx` references `ApiTypes.TransactionType.Credit` and `ApiTypes.TransactionStatus[...]`, but `src/types/api.ts` exports numeric union types, not runtime enum objects.
- Expected behaviour: runtime status/type labels should come from constants, maps, or real TypeScript enums.
- Severity: High.
- Dependencies: wallet transaction display design and enum mapping strategy.
- Recommended next action: add typed display maps for transaction type/status numeric values.
- Confidence level: High.

### BUG-009: Analytics Pages Reference DTO Fields That Do Not Exist In Generated Types

- Classification: Confirmed bug.
- Relevant file paths: `src/pages/Analytics.tsx`, `src/pages/SurveyAnalytics.tsx`, `src/pages/Demographics.tsx`, `src/types/api.ts`.
- Current behaviour: TypeScript reports missing fields including `averageResponseRate`, `responseRate`, `period`, `count`, `ageDistribution`, `locationDistribution`, and `label`.
- Expected behaviour: frontend analytics pages should render fields that are present in backend DTOs or backend should expose the fields the UI requires.
- Severity: High.
- Dependencies: analytics DTO contract.
- Recommended next action: define analytics response contracts and update either backend DTOs or frontend UI accordingly.
- Confidence level: High.

### BUG-010: React Hooks Are Called Inside Callbacks In Sidebar Navigation

- Classification: Confirmed bug.
- Relevant file paths: `src/components/dashboard/SidebarNavigation.tsx`, `src/components/participants/SidebarNavigation.tsx`.
- Current behaviour: ESLint reports `useMatch` is called inside a callback, violating React hook rules.
- Expected behaviour: hooks should be called unconditionally at the top level of React components or custom hooks.
- Severity: High.
- Dependencies: sidebar active-state implementation.
- Recommended next action: replace callback hook usage with `useLocation` plus pure path matching, or precompute matches at component top level.
- Confidence level: High.

### BUG-011: Backend Build/Test Commands Fail When API Process Is Running

- Classification: Verification blocker.
- Relevant file paths: `bentinarlyv1.csproj`, `bentinarlyv1.sln`, `bin\Debug\net9.0\bentinarlyv1.exe`.
- Current behaviour: `dotnet build` and `dotnet test` fail because output files are locked by a running `bentinarlyv1` process.
- Expected behaviour: build/test verification should complete in a clean or isolated process state.
- Severity: Medium.
- Dependencies: local running API process and output path configuration.
- Recommended next action: stop process `bentinarlyv1 (12552)` or configure isolated output before rerunning tests.
- Confidence level: High.

### BUG-012: Client-Controlled Role Can Escalate Registration Privileges

- Classification: Confirmed bug.
- Relevant file paths: `Features/Auth/Commands/RegisterCommand.cs`, `Features/Auth/Commands/RegisterCommandHandler.cs`, `Models/User.cs`, `Models/Enums/UserRole.cs`.
- Current behaviour: registration accepts a `Role` value from the client and assigns it to the user enum role field. This allows a caller to request privileged enum roles unless separately constrained.
- Expected behaviour: public registration should assign only allowed default roles server-side; privileged roles should require an authenticated/admin workflow.
- Severity: Critical.
- Dependencies: final role model, admin user provisioning, Identity role synchronization.
- Recommended next action: ignore client-supplied privileged roles during public registration and add tests for role assignment boundaries.
- Confidence level: High.

### BUG-013: Backend Role Systems Are Out Of Sync

- Classification: Confirmed bug.
- Relevant file paths: `Models/User.cs`, `Models/Enums/UserRole.cs`, `Services/JwtService.cs`, `Extensions/DatabaseSeedingExtensions.cs`, controllers using `[Authorize(Roles = "...")]`.
- Current behaviour: the app has both a `User.Role` enum and ASP.NET Identity roles. Public registration appears to set the enum, while role-based authorization uses Identity roles; seeded admin users are the only clearly bridged case.
- Expected behaviour: one authoritative role system should drive JWT claims and `[Authorize(Roles = ...)]`.
- Severity: High.
- Dependencies: authorization design and migration/backfill for existing users.
- Recommended next action: unify role assignment and token claim generation, then backfill or reconcile existing users.
- Confidence level: High.

### BUG-014: Email Confirmation Is Required But Verification Handlers Are No-Ops

- Classification: Confirmed bug.
- Relevant file paths: `Program.cs`, `Features/Auth/Commands/VerifyEmailCommandHandler.cs`, `Features/Auth/Commands/ForgotPasswordCommandHandler.cs`, `Features/Auth/Commands/ResetPasswordCommandHandler.cs`, `Features/Auth/Commands/RegisterParticipantCommandHandler.cs`.
- Current behaviour: Identity requires confirmed email for sign-in, but email verification/password reset handlers are currently no-op success paths and participants are created unconfirmed.
- Expected behaviour: email confirmation tokens should be generated, delivered, validated, and persisted before requiring confirmed email for login.
- Severity: High.
- Dependencies: email provider, token delivery UX, auth flow split in frontend.
- Recommended next action: implement email/reset token flows or temporarily disable `RequireConfirmedEmail` until the flow is real.
- Confidence level: High.

### BUG-015: Authenticated Users Can Read Survey/Response/Analytics Data By GUID

- Classification: Confirmed bug.
- Relevant file paths: `Features/Surveys/Queries/GetSurveyByIdQueryHandler.cs`, `Features/Questions/Queries/GetQuestionsBySurveyQueryHandler.cs`, `Features/Responses/Queries/GetSurveyResponsesQueryHandler.cs`, `Features/Responses/Queries/GetSurveyResponseByIdQueryHandler.cs`, `Features/Analytics/Queries`.
- Current behaviour: multiple read/query handlers fetch by survey/response IDs without consistently checking creator, collaborator, project member, or participant ownership.
- Expected behaviour: every read endpoint for private survey data should enforce resource-level authorization, not just authentication.
- Severity: Critical.
- Dependencies: ownership/collaborator permission rules.
- Recommended next action: add shared resource authorization checks to survey, question, response, analytics, and export query handlers; cover with integration tests.
- Confidence level: High.

### BUG-016: Payment Confirmation Can Complete Without Stripe Verification

- Classification: Confirmed bug.
- Relevant file paths: `Features/Payments/Commands/ConfirmPaymentCommandHandler.cs`, `Controllers/PaymentsController.cs`, `Features/Webhooks/Commands/ProcessStripeWebhookCommandHandler.cs`.
- Current behaviour: payment flows use simulated Stripe IDs and confirmation can mark payments completed without server-side verification against Stripe.
- Expected behaviour: payment completion should be based on trusted Stripe API/webhook verification.
- Severity: Critical.
- Dependencies: Stripe SDK integration, webhook signature verification, payment reconciliation model.
- Recommended next action: disable production payment completion until Stripe verification is implemented.
- Confidence level: High.

### BUG-017: Uploaded File URLs Are Not Served By The API

- Classification: Confirmed bug.
- Relevant file paths: `Features/Files/Commands/UploadFileCommandHandler.cs`, `Program.cs`, `Dockerfile`, `docker-compose.yml`.
- Current behaviour: uploaded files are stored under `wwwroot/uploads`, but `Program.cs` does not call `UseStaticFiles()`, so returned upload URLs are expected to 404.
- Expected behaviour: stored files should be served by static file middleware, a controller endpoint, or an external storage/CDN URL.
- Severity: High.
- Dependencies: file access policy and storage strategy.
- Recommended next action: add an explicit file-serving strategy and authorization rules for private files.
- Confidence level: High.

### BUG-018: Survey Analytics And Demographics Routes Do Not Provide Required `surveyId`

- Classification: Confirmed bug.
- Relevant file paths: `src/App.tsx`, `src/pages/SurveyAnalytics.tsx`, `src/pages/Demographics.tsx`, `src/layouts/SurveyLayout.tsx`, `src/components/dashboard/SurveySidebar.tsx`.
- Current behaviour: analytics/demographics pages read `surveyId` from route params, but registered routes are `/survey/analytics` and `/survey/demographics` without `:surveyId`.
- Expected behaviour: per-survey analytics routes should include `:surveyId` or read a validated active survey from context.
- Severity: High.
- Dependencies: survey navigation and selected survey state model.
- Recommended next action: add survey ID to routes/links or refactor pages to use a reliable selected survey source.
- Confidence level: High.

### BUG-019: Participant Survey Submission Payload Does Not Match Backend Contract

- Classification: Confirmed bug.
- Relevant file paths: `src/components/participants/TakeSurvey.tsx`, `src/services/apiClient.ts`, `DTOs/SubmitSurveyResponseDto.cs`.
- Current behaviour: participant survey submission sends a raw `answers` object via `fetch`, while the typed API/backend contract expects `questionResponses`.
- Expected behaviour: participant submission should use `useResponsesApi().submitResponse()` or equivalent typed DTO mapping.
- Severity: High.
- Dependencies: final answer value mapping for each question type.
- Recommended next action: map answers into `QuestionResponseSubmissionDto[]` and route errors through the central API service.
- Confidence level: High.

### BUG-020: Dark Mode Effect Can Toggle On Every Render

- Classification: Confirmed bug.
- Relevant file paths: `src/pages/Projects.tsx`, `src/pages/Surveys.tsx`.
- Current behaviour: pages contain an effect without a dependency array that calls `toggleDarkMode()` when `isDarkMode` is true, risking repeated toggles on render.
- Expected behaviour: dark mode should be initialized once or driven by context state without render-loop side effects.
- Severity: Medium.
- Dependencies: dark mode context behavior.
- Recommended next action: remove page-level toggling or add a deliberate one-time initialization path.
- Confidence level: High.

## Suspected Problems

### SUS-001: API Base URL Drift May Break Local Auth And API Calls

- Classification: Suspected problem.
- Relevant file paths: `src/services/apiService.ts`, `src/pages/Login.tsx`, `vite.config.ts`, `docker-compose.yml`, `Program.cs`.
- Current behaviour: frontend API service defaults to `http://localhost:5136`, Google login defaults to `http://localhost:7141`, Vite proxy targets `https://localhost:7141`, and Docker maps API port `5136` to container `8080`.
- Expected behaviour: all frontend calls should target the same intended backend origin for the selected environment.
- Severity: Medium.
- Dependencies: local HTTPS profile and Docker/non-Docker development workflows.
- Recommended next action: document one local backend URL and use `VITE_API_BASE_URL` consistently.
- Confidence level: High.

### SUS-002: Survey Response Submission May Not Enforce Survey Settings

- Classification: Suspected problem.
- Relevant file paths: `Controllers/ResponsesController.cs`, `Features/Responses/Commands/SubmitSurveyResponseCommandHandler.cs`, `Models/Survey.cs`, `DTOs/SurveySettings`.
- Current behaviour: response submission allows unauthenticated users by setting `UserId` to null when identity is absent. This may be valid for anonymous surveys, but enforcement of `requireLogin`, max responses, password, and one-response-per-person was not confirmed from the controller.
- Expected behaviour: response submission should enforce survey settings consistently.
- Severity: Medium.
- Dependencies: survey settings semantics and response handler validation.
- Recommended next action: audit `SubmitSurveyResponseCommandHandler` against every setting in `SurveySettings`.
- Confidence level: Medium.

### SUS-003: Payment And Subscription Endpoints May Report Success Without Real Stripe State

- Classification: Suspected problem.
- Relevant file paths: `Controllers/PaymentsController.cs`, `Features/Payments/Commands/UpdatePaymentMethodCommandHandler.cs`, `Features/Subscriptions/Commands/SubscribeToPlanCommandHandler.cs`, `Features/Subscriptions/Commands/UpgradeSubscriptionCommandHandler.cs`.
- Current behaviour: payment method update completes without Stripe/database changes, and subscription handlers generate fake Stripe IDs.
- Expected behaviour: payment/subscription mutations should reflect actual Stripe operations.
- Severity: High.
- Dependencies: Stripe API integration and product/price configuration.
- Recommended next action: gate or hide payment/subscription UI until real Stripe paths exist.
- Confidence level: High.

### SUS-004: Stripe Webhooks Are Not Trustworthy Without Signature Verification

- Classification: Suspected problem.
- Relevant file paths: `Controllers/WebhooksController.cs`, `Features/Webhooks/Commands/ProcessStripeWebhookCommandHandler.cs`.
- Current behaviour: webhook signature is collected but not verified before payload processing.
- Expected behaviour: only verified Stripe events should mutate payments/subscriptions.
- Severity: High.
- Dependencies: Stripe webhook secret.
- Recommended next action: implement signature verification before using webhook data.
- Confidence level: High.

### SUS-005: Admin Seeded Credentials Are Unsafe For Shared Environments

- Classification: Suspected problem.
- Relevant file paths: `appsettings.json`, `appsettings.Development.json`, `Extensions/DatabaseSeedingExtensions.cs`.
- Current behaviour: committed admin credentials can seed an admin user, and newly created credentials are printed to console.
- Expected behaviour: admin setup should be environment-specific and credentials should never be logged.
- Severity: High.
- Dependencies: deployment secret management and operational provisioning.
- Recommended next action: remove committed credentials, rotate any values used outside local development, and stop logging passwords.
- Confidence level: High.

### SUS-006: Automatic Database Migrations Could Be Risky In Production

- Classification: Suspected problem.
- Relevant file paths: `Program.cs`, `Migrations`.
- Current behaviour: the API runs `db.Database.Migrate()` at startup outside `Testing`.
- Expected behaviour: production migration execution should be controlled explicitly.
- Severity: Medium.
- Dependencies: deployment topology and database rollback policy.
- Recommended next action: gate startup migrations behind an environment setting or deployment-only command.
- Confidence level: Medium.

### SUS-007: Placeholder Analytics Could Mislead Users

- Classification: Suspected problem.
- Relevant file paths: `Features/Analytics/Queries/GetSurveyAnalyticsQueryHandler.cs`.
- Current behaviour: demographics summary returns placeholder values like `25-34`, `Unknown`, and `Desktop`.
- Expected behaviour: analytics should either show real computed values or clearly indicate unavailable data.
- Severity: Medium.
- Dependencies: demographics data capture model.
- Recommended next action: replace placeholders with computed values or omit these fields until supported.
- Confidence level: High.

### SUS-008: Profile Image Upload Returns Placeholder URL

- Classification: Suspected problem.
- Relevant file paths: `Features/Users/Commands/UploadProfileImageCommandHandler.cs`.
- Current behaviour: upload handler returns an `example.com` URL without storing the file.
- Expected behaviour: uploaded images should be validated, stored, and returned from a real accessible URL.
- Severity: Medium.
- Dependencies: storage provider and file validation requirements.
- Recommended next action: implement storage or disable profile image upload.
- Confidence level: High.

### SUS-009: Generic Webhook Payload Logging May Leak Sensitive Data

- Classification: Suspected problem.
- Relevant file paths: `Controllers/WebhooksController.cs`.
- Current behaviour: generic webhook logs the full request body at debug level.
- Expected behaviour: logs should avoid raw payloads from external systems unless redacted.
- Severity: Medium.
- Dependencies: logging level and sink access controls.
- Recommended next action: log metadata only.
- Confidence level: Medium.

### SUS-010: Survey Share Links Use A Hard-Coded Production Origin

- Classification: Suspected problem.
- Relevant file paths: `Features/Surveys/Commands/RegenerateShareableLinkCommandHandler.cs`, `appsettings.json`.
- Current behaviour: share link generation uses a hard-coded `https://app.bentinarly.com/survey/{token}` style URL instead of the configured frontend base URL.
- Expected behaviour: share links should use environment-specific frontend configuration.
- Severity: Medium.
- Dependencies: deployed frontend domains and share route design.
- Recommended next action: generate links from `Frontend:BaseUrl` or return token/path and let frontend compose the URL.
- Confidence level: High.

## Verification Gaps

### VG-001: Backend Tests Did Not Run To Completion

- Relevant file paths: `bentinarlyUnitTests`, `bentinarlyIntegrationTests`, `bentinarlyv1.sln`.
- Current behaviour: `dotnet test` failed at build-copy stage because the API executable was locked.
- Expected behaviour: unit and integration tests should execute and report pass/fail results.
- Severity: Medium.
- Dependencies: stopping the running API process or using isolated test output.
- Recommended next action: rerun `dotnet test` after resolving the lock.
- Confidence level: High.

### VG-002: Runtime UI Smoke Testing Was Not Performed

- Relevant file paths: `src/App.tsx`, `src/pages`, `src/components`.
- Current behaviour: frontend does not type-check, so starting from build verification was enough to identify blockers.
- Expected behaviour: after build fixes, run the app and smoke-test critical flows: login, dashboard route protection, project create/select, survey builder, share link, participant response, analytics, profile, rewards.
- Severity: Medium.
- Dependencies: TypeScript build passing and backend availability.
- Recommended next action: perform manual or automated smoke tests after compile blockers are resolved.
- Confidence level: High.
