# Stabilization Plan

Assessment source:
- `docs/CODEBASE_OVERVIEW.md`
- `docs/FEATURE_STATUS.md`
- `docs/TECHNICAL_DEBT.md`
- `docs/BUG_REGISTER.md`

Scope:
- Frontend: `C:\Users\marti\repos\bentinarly-poll-frontend`
- Backend: `C:\Users\marti\repos\bentinarly-core`

This plan deduplicates overlapping findings from the assessment documents. It does not define new product behavior. Items with unclear intended behavior are marked `NEEDS_PRODUCT_DECISION`.

## Prioritization Rules

Execution is ordered by:
1. Data loss and security risks
2. Authentication and authorization failures
3. Build, deployment, and environment blockers
4. Broken core business workflows
5. Database consistency problems
6. High-impact user-facing bugs
7. Incomplete MVP features
8. Refinements
9. Performance improvements
10. General technical debt

## Milestones

### Milestone 1: Project Builds And Runs Reliably

Goal: establish a repeatable local and deployment baseline.

Included items:
- `CFG-001`
- `CFG-002`
- `BUILD-001`
- `BUILD-002`
- `BUILD-003`
- `TEST-001`
- `TEST-002`
- `DEBT-001`

Exit criteria:
- Frontend `npm run build` succeeds.
- Frontend `npm run lint` is either green or has documented non-blocking warnings only.
- Backend `dotnet build` and `dotnet test` can run from a clean local state.
- API base URL configuration is documented and consistent.

### Milestone 2: Core Workflows Are Stable

Goal: secure and stabilize auth, authorization, survey management, and response submission.

Included items:
- `SEC-001`
- `SEC-002`
- `SEC-003`
- `AUTH-001`
- `AUTH-002`
- `AUTH-003`
- `BUG-001`
- `BUG-002`
- `BUG-003`
- `BUG-004`
- `TEST-003`

Exit criteria:
- Public registration cannot assign privileged roles.
- Backend read endpoints enforce resource-level authorization.
- Protected frontend routes are guarded.
- Login/session behavior is reliable enough for core workflows.
- Participant response submission uses the backend contract.

### Milestone 3: MVP Features Are Complete

Goal: finish or explicitly scope MVP-facing feature gaps.

Included items:
- `FEATURE-001`
- `FEATURE-002`
- `FEATURE-003`
- `FEATURE-004`
- `FEATURE-005`
- `FEATURE-006`
- `FEATURE-007`
- `FEATURE-008`
- `FEATURE-009`
- `CFG-003`

Exit criteria:
- Survey sharing, analytics, profile, rewards, participant registration, file upload, and templates match agreed MVP contracts.
- Payment/subscription/email/social/contact/notification scope is either implemented or explicitly deferred.

### Milestone 4: UX Refinements And Performance

Goal: remove misleading UI behavior, reduce avoidable load, and improve maintainability of user-facing flows.

Included items:
- `REFINE-001`
- `REFINE-002`
- `REFINE-003`
- `PERF-001`
- `PERF-002`
- `PERF-003`

Exit criteria:
- Known UX inconsistencies are resolved or intentionally deferred.
- Hot-path list/search/save flows avoid obvious repeated requests.
- Survey builder and survey-taking rendering have a clearer structure.

### Milestone 5: Technical Debt And Cleanup

Goal: consolidate architecture and remove scaffolding after core behavior is stable.

Included items:
- `DEBT-002`
- `DEBT-003`
- `DEBT-004`
- `DEBT-005`
- `SEC-004`
- `SEC-005`

Exit criteria:
- Generated API workflow is documented.
- Role/auth patterns, error handling, context exports, placeholder display names, and dependency warnings are cleaned up.
- Remaining risks have owners and explicit acceptance/defer decisions.

## Stabilization Backlog

### Security Issues

| ID | Item | Severity | Business Impact | Technical Risk | Complexity | Dependencies | Affected Files Or Modules | Verification Method | Order |
|---|---|---|---|---|---|---|---|---|---|
| `SEC-001` | Remove committed secrets/default credentials and stop logging seeded admin passwords. | Critical | Prevents leaked credentials and unauthorized environment access. | Requires secret rotation and environment setup changes. | Medium | Deployment secret management. | `appsettings.json`, `appsettings.Development.json`, `docker-compose.yml`, `Extensions/DatabaseSeedingExtensions.cs` | Confirm no real/default secrets in committed config; run backend with env/user-secrets; verify admin seed does not print passwords. | 1 |
| `SEC-002` | Prevent client-controlled role escalation and unify role source of truth. | Critical | Prevents public registration from creating privileged users. | Role migration/backfill may affect existing users and JWT claims. | Large | Final role taxonomy; admin provisioning rules. | `RegisterCommand.cs`, `RegisterCommandHandler.cs`, `Models/User.cs`, `Services/JwtService.cs`, Identity role setup | Add registration tests for blocked privileged roles; verify `[Authorize(Roles=...)]` works for intended users only. | 2 |
| `SEC-003` | Add resource-level authorization to survey, question, response, analytics, and export reads. | Critical | Prevents cross-user access to private survey/response data. | Must preserve legitimate collaborator/admin access. | Large | Ownership, collaborator, project member, participant rules. | `Features/Surveys/Queries`, `Features/Questions/Queries`, `Features/Responses/Queries`, `Features/Analytics/Queries` | Integration tests where user A cannot read user B resources; collaborator permission tests. | 3 |
| `SEC-004` | Verify Stripe webhooks and payment confirmation with trusted Stripe state. | Critical | Prevents forged payment/subscription state changes. | Requires real Stripe SDK/config and careful test strategy. | Large | Stripe account, webhook secret, product/price mapping. | `ConfirmPaymentCommandHandler.cs`, `ProcessStripeWebhookCommandHandler.cs`, `PaymentsController.cs`, subscription handlers | Stripe webhook signature tests; payment confirm cannot complete without verified provider state. | 8 |
| `SEC-005` | Redact or remove raw webhook payload logging. | Medium | Reduces risk of sensitive third-party payloads in logs. | Low implementation risk. | Small | Logging policy. | `Controllers/WebhooksController.cs` | Log review confirms metadata only; tests or manual request verify no raw body in logs. | 27 |
| `SEC-006` | Review browser token storage strategy. `NEEDS_PRODUCT_DECISION` | Medium | Reduces impact of XSS token theft if storage changes. | May require auth architecture changes and CSRF handling. | Large | Threat model; cookie vs localStorage decision; refresh-token implementation. | `src/services/apiService.ts`, `src/contexts/AuthContext.tsx`, backend auth config | Security review of chosen storage model; auth smoke tests. | 28 |

### Confirmed Bugs

| ID | Item | Severity | Business Impact | Technical Risk | Complexity | Dependencies | Affected Files Or Modules | Verification Method | Order |
|---|---|---|---|---|---|---|---|---|---|
| `BUG-001` | Fix frontend TypeScript compilation and deployment build failure. | Critical | Blocks frontend deployment and hides real runtime issues. | Touches many screens and generated DTO assumptions. | Large | API contract decisions; `BUILD-001`; possibly backend Swagger availability. | `src/components`, `src/pages`, `src/contexts`, `src/types/api.ts`, `package.json`, `netlify.toml` | `npx tsc -b --pretty false`; `npm run build`. | 9 |
| `BUG-002` | Fix `ShareModal` missing response-toggle state. | Critical | Survey sharing UI cannot compile and response collection control is broken. | Behavior is unclear. `NEEDS_PRODUCT_DECISION` for whether toggle maps to local UI, survey settings, pause/resume, or publish state. | Small | Product decision on response collection state. | `src/components/survey/ShareModal.tsx`, survey status/settings endpoints | Type-check passes; manual share modal smoke test. | 10 |
| `BUG-003` | Fix participant survey submission payload contract. | High | Participants cannot reliably submit survey responses. | Requires answer mapping for each question type. | Medium | Stable question/response DTOs. | `src/components/participants/TakeSurvey.tsx`, `src/services/apiClient.ts`, `DTOs/SubmitSurveyResponseDto.cs` | Submit sample survey response; verify backend receives `questionResponses`; integration/API test. | 11 |
| `BUG-004` | Fix per-survey analytics and demographics routes lacking `surveyId`. | High | Survey owners cannot access per-survey analytics pages. | Route/link changes can affect navigation. | Small | Survey navigation convention. | `src/App.tsx`, `src/pages/SurveyAnalytics.tsx`, `src/pages/Demographics.tsx`, `SurveySidebar.tsx` | Navigate from a survey to analytics/demographics and verify API receives survey ID. | 12 |
| `BUG-005` | Fix protected frontend route wiring. | High | Unauthenticated users can open protected UI shells. Backend still protects many APIs, but UI is misleading. | Must avoid breaking public survey/anonymous response flows. | Medium | AuthContext loading behavior; route access matrix. | `src/routes/ProtectedRoutes.tsx`, `src/App.tsx`, dashboard/survey/participant layouts | Manual route tests logged out/logged in; role-specific navigation tests. | 7 |
| `BUG-006` | Fix email confirmation required while verification/reset handlers are no-ops. | High | Newly registered users may be unable to complete auth flows. | Requires email provider or temporary policy decision. `NEEDS_PRODUCT_DECISION` if email is not MVP. | Large | Email delivery provider; frontend auth flow split. | `Program.cs`, auth command handlers, `Verification.tsx`, `ForgotPassword.tsx`, `ResetPassword.tsx` | Register, verify email, login, forgot/reset password end-to-end tests. | 6 |
| `BUG-007` | Fix uploaded file URLs not being served. | High | Uploaded files/profile assets can return broken URLs. | Requires access-control decision for public/private files. | Medium | Storage strategy and privacy rules. | `UploadFileCommandHandler.cs`, `UploadProfileImageCommandHandler.cs`, `Program.cs`, `Dockerfile`, `docker-compose.yml` | Upload file; fetch returned URL; verify authorization behavior for private files. | 20 |
| `BUG-008` | Fix rewards page runtime enum/type mismatch. | High | Rewards page cannot compile/render transaction status/type correctly. | Low if fixed with display maps. | Small | Wallet DTO contract. | `src/pages/Rewards.tsx`, `src/types/api.ts` | Type-check; wallet page smoke test with sample transactions. | 15 |
| `BUG-009` | Fix profile page DTO mismatch. `NEEDS_PRODUCT_DECISION` | High | Profile editing/display is blocked or misleading. | Schema/DTO expansion can affect backend and persisted user data. | Medium | Final profile fields: `mobileNumber` vs `phoneNumber`, bio, DOB, gender, location, image. | `src/pages/Profile.tsx`, `UserProfileSection.tsx`, `UserDto`, `UpdateUserProfileCommand` | Type-check; profile load/update smoke test; API contract tests. | 16 |
| `BUG-010` | Fix participant registration payload mismatch. `NEEDS_PRODUCT_DECISION` | High | Participant signup may send unsupported data and temporary mobile number values. | DTO/schema changes may affect auth/user model. | Medium | Final participant demographic fields and required mobile number policy. | `src/pages/Participants.tsx`, `RegisterParticipantCommand`, `src/types/api.ts` | Register participant with agreed fields; verify stored user data. | 17 |
| `BUG-011` | Fix analytics DTO field mismatches. | High | Analytics UI cannot compile and may render no data. | Contract changes must match backend analytics shape. | Medium | Analytics DTO design; backend Swagger regeneration. | `src/pages/Analytics.tsx`, `src/pages/SurveyAnalytics.tsx`, `src/pages/Demographics.tsx`, `src/types/api.ts`, analytics DTOs | Type-check; analytics page smoke tests with known survey data. | 18 |
| `BUG-012` | Fix React hook rule violations in sidebar navigation. | High | Hook misuse can cause unstable rendering and blocks lint. | Low if replaced with `useLocation` or top-level hooks. | Small | Route structure. | `src/components/dashboard/SidebarNavigation.tsx`, `src/components/participants/SidebarNavigation.tsx` | `npm run lint`; sidebar navigation smoke test. | 13 |
| `BUG-013` | Fix dark mode render-loop risk. | Medium | Can create unstable UI behavior for users with dark mode enabled. | Low if page-level toggles are removed. | Small | Dark mode behavior decision. | `src/pages/Projects.tsx`, `src/pages/Surveys.tsx`, `DarkModeContext.tsx` | Manual render test in dark mode; lint/effect review. | 19 |

### Suspected Bugs

| ID | Item | Severity | Business Impact | Technical Risk | Complexity | Dependencies | Affected Files Or Modules | Verification Method | Order |
|---|---|---|---|---|---|---|---|---|---|
| `SUS-001` | Audit survey response settings enforcement. | Medium | Surveys may accept responses that violate settings. | Could require changes to public response flow. | Medium | Confirm behavior for anonymous, password, max responses, one response per person, expiry. `NEEDS_PRODUCT_DECISION` if settings semantics are not final. | `ResponsesController.cs`, `SubmitSurveyResponseCommandHandler.cs`, `SurveySettings` | Unit/integration tests for each survey setting. | 21 |
| `SUS-002` | Replace misleading placeholder analytics/demographics. | Medium | Users may make decisions from fake demographic values. | Requires source data or explicit unavailable state. `NEEDS_PRODUCT_DECISION` for demographics MVP scope. | Medium | Demographic data capture model. | `GetSurveyAnalyticsQueryHandler.cs`, `GetDemographicsAnalyticsQueryHandler.cs`, analytics UI | Compare analytics output to known fixture data; verify placeholders are absent or labeled. | 22 |
| `SUS-003` | Fix hard-coded production share-link origin. | Medium | Share links may point to wrong environment. | Low if config already has frontend base URL. | Small | Final share route/domain policy. | `RegenerateShareableLinkCommandHandler.cs`, `appsettings.json`, frontend share UI | Generate link in dev/test/prod config and verify expected origin. | 23 |
| `SUS-004` | Verify Google OAuth configuration flow. | Medium | Social login may fail in all non-local configured environments. | Depends on external provider setup. | Medium | Google credentials and callback URLs. | `Login.tsx`, `AuthController.cs`, `GoogleResponseCommandHandler.cs`, `Program.cs`, appsettings | Manual OAuth test with configured credentials. | 24 |

### Incomplete Features

| ID | Item | Severity | Business Impact | Technical Risk | Complexity | Dependencies | Affected Files Or Modules | Verification Method | Order |
|---|---|---|---|---|---|---|---|---|---|
| `FEATURE-001` | Complete refresh-token persistence and logout invalidation. | Critical | Sessions expire unexpectedly and logout does not revoke server-side refresh state. | Requires token storage model and migration if persisted. | Large | Auth storage design; token rotation/revocation policy. | `RefreshTokenCommandHandler.cs`, `LogoutCommandHandler.cs`, `JwtService.cs`, auth DTOs, frontend interceptor | Refresh after access expiry; revoked token cannot refresh; logout invalidates refresh token. | 5 |
| `FEATURE-002` | Complete survey share link and response collection controls. `NEEDS_PRODUCT_DECISION` | High | Survey owners cannot reliably distribute surveys or control response collection. | Depends on publish/pause/close/settings semantics. | Medium | Share URL route; response state model. | `ShareModal.tsx`, survey share-link commands, survey status handlers | Generate/copy link; open public survey; toggle collection state according to agreed behavior. | 14 |
| `FEATURE-003` | Complete question builder persistence for advanced question configuration. | High | Saved surveys may lose rating, matrix, validation, branching, or other advanced config. | Requires typed mapping for every question type. | Large | Stable question DTOs; product-supported question types. | `Questionnaires.tsx`, `QuestionBox.tsx`, question DTOs/handlers | Create/edit each MVP question type; reload survey and verify persisted config. | 25 |
| `FEATURE-004` | Complete file/profile image storage flow. `NEEDS_PRODUCT_DECISION` for storage provider and privacy. | Medium | Users may see broken profile/file assets. | Storage and access-control changes can affect infra. | Medium | Storage provider and file visibility policy. | `FilesController.cs`, `Features/Files`, `UploadProfileImageCommandHandler.cs`, frontend upload calls | Upload, persist, retrieve, and delete file/profile image. | 26 |
| `FEATURE-005` | Complete payment, subscription, wallet, Stripe Connect, and KYC flows or defer them. `NEEDS_PRODUCT_DECISION` | High | Money-related workflows are not production-ready. | High due to payment compliance, provider state, and PII. | Large | Stripe account, product/price IDs, KYC rules, compliance requirements. | `Features/Payments`, `Features/Subscriptions`, `Features/Wallet`, `WebhooksController.cs`, frontend payments/rewards UI | Provider integration tests; payment cannot complete without verified Stripe state; KYC behavior approved. | 29 |
| `FEATURE-006` | Complete contact form behavior. `NEEDS_PRODUCT_DECISION` | Low | Marketing contact leads may be lost if users expect submission. | Low, depends on target destination. | Small | Support/email/CRM endpoint decision. | `ContactSection.tsx`, potential backend/support endpoint | Submit contact form and verify delivery/storage. | 32 |
| `FEATURE-007` | Complete notifications feature or hide it. `NEEDS_PRODUCT_DECISION` | Low | Participant notification screen appears empty/non-functional. | Low until notification backend exists. | Medium | Notification requirements and API. | `src/pages/Notifications.tsx`, participant layout/navigation | Notifications load from agreed source or route is hidden. | 33 |
| `FEATURE-008` | Decide Facebook login scope. `NEEDS_PRODUCT_DECISION` | Low | Visible login option is non-functional. | Low if hidden; medium if implemented. | Small/Medium | Provider decision. | `src/pages/Login.tsx` | Button hidden or OAuth flow verified. | 34 |
| `FEATURE-009` | Complete templates contract/display. | Medium | Template browsing/creation may fail or display wrong fields. | Low to medium depending on DTO changes. | Small | Template DTO field names. | `src/pages/Templates.tsx`, templates DTOs/handlers | Template list/search/create-from-template smoke test. | 30 |

### Refinements

| ID | Item | Severity | Business Impact | Technical Risk | Complexity | Dependencies | Affected Files Or Modules | Verification Method | Order |
|---|---|---|---|---|---|---|---|---|---|
| `REFINE-001` | Replace placeholder creator/user display names. | Medium | Users see generic "User" labels instead of real names. | Query changes can introduce N+1 if not projected carefully. | Medium | Display-name convention. | Survey and response command/query handlers | Survey/response list shows correct display names; query review for efficient projection. | 35 |
| `REFINE-002` | Remove broken/mock UI links and placeholder UI. | Low | Reduces user confusion and dead navigation. | Low. | Small | Product decision for hidden vs implemented features. | Footer links, mock preview route, account switcher, social buttons, marketing contact data | Manual navigation audit; no known 404 placeholder links. | 36 |
| `REFINE-003` | Normalize page-level API error handling. | Medium | Users get more consistent errors and fewer raw failures. | Low if done after API service stabilizes. | Medium | API error response contract. | `apiService.ts`, page catch blocks, contexts | Error-path smoke tests; typed error helper usage. | 37 |

### Performance Issues

| ID | Item | Severity | Business Impact | Technical Risk | Complexity | Dependencies | Affected Files Or Modules | Verification Method | Order |
|---|---|---|---|---|---|---|---|---|---|
| `PERF-001` | Add debounce/stability to frontend search/fetch effects. | Medium | Prevents repeated requests and sluggish UI. | Low to medium, effect dependencies must remain correct. | Small | Stable service hooks. | `Templates.tsx`, analytics/rewards/surveys pages, `ProjectsContext.tsx` | Network trace shows expected request count; lint hooks pass. | 38 |
| `PERF-002` | Review dashboard/analytics backend aggregation queries. | Medium | Prevents slow analytics as response volume grows. | Query optimization can affect DTOs. | Medium | Representative data sizes. | `GetSurveyAnalyticsQueryHandler.cs`, `GetDashboardAnalyticsQueryHandler.cs`, response queries | Benchmark/query plan review with seeded data; response time target agreed. | 39 |
| `PERF-003` | Define safe autosave strategy for questionnaire builder. `NEEDS_PRODUCT_DECISION` | Medium | Prevents data loss while avoiding excessive API calls. | Requires careful draft/state semantics. | Large | Draft lifecycle, conflict behavior, UX copy. | `Questionnaires.tsx`, survey/question update APIs | Autosave tests for edit, navigation, reload, offline/error paths. | 40 |

### Missing Tests

| ID | Item | Severity | Business Impact | Technical Risk | Complexity | Dependencies | Affected Files Or Modules | Verification Method | Order |
|---|---|---|---|---|---|---|---|---|---|
| `TEST-001` | Rerun backend tests after resolving locked process and fix test infra drift. | Medium | Restores confidence in backend changes. | Integration tests may reveal seeded auth/schema drift. | Medium | Stop running API; test database strategy. | `bentinarlyUnitTests`, `bentinarlyIntegrationTests`, `CustomWebApplicationFactory`, auth helpers | `dotnet test` completes; failing tests triaged with root causes. | 4 |
| `TEST-002` | Add frontend build/lint check to regular verification. | Medium | Prevents repeated build regressions. | Low. | Small | `BUILD-001`, `BUILD-002`. | `package.json`, local/CI scripts if added | `npm run build` and `npm run lint` documented/run. | 31 |
| `TEST-003` | Add security and auth regression tests. | Critical | Prevents recurrence of role escalation and IDOR bugs. | Requires test users/resources and clear permission model. | Large | `SEC-002`, `SEC-003`, auth role design. | Backend integration tests for auth/authorization | Negative access tests pass for role escalation and cross-user reads. | 41 |
| `TEST-004` | Add core workflow smoke tests. | High | Verifies MVP flows after stabilization. | Medium, may need test runner setup for frontend. | Medium/Large | Build passing; core APIs stable. | Login, project, survey builder, share, response submission, analytics, profile, rewards | Manual checklist or automated e2e suite passes. | 42 |

### Configuration And Deployment Issues

| ID | Item | Severity | Business Impact | Technical Risk | Complexity | Dependencies | Affected Files Or Modules | Verification Method | Order |
|---|---|---|---|---|---|---|---|---|---|
| `CFG-001` | Resolve API base URL and environment drift. | Medium | Prevents auth/API calls from targeting the wrong backend. | Low if centralized; must not expose secrets. | Small | Local Docker/non-Docker workflow decision. | `apiService.ts`, `Login.tsx`, `vite.config.ts`, `.env.local`, `.env.example`, `docker-compose.yml` | Run app against documented API URL; Google login URL matches API config. | 43 |
| `CFG-002` | Document and fix backend build/test process lock issue. | Medium | Developers cannot reliably verify backend. | Low if process management only; medium if output path changes. | Small | Local dev process convention. | `bentinarlyv1.sln`, `bentinarlyv1.csproj`, docs/scripts | Stop API and rerun `dotnet build`/`dotnet test`; document required state. | 44 |
| `CFG-003` | Establish repeatable OpenAPI/type generation workflow. | High | Prevents recurring frontend/backend contract drift. | Medium if generator output changes widely. | Medium | Backend Swagger build availability. | `src/types/api.ts`, `src/services/apiClient.ts`, backend Swagger | Regenerate types from current backend; frontend compile verifies contract. | 45 |
| `CFG-004` | Gate production database migrations. `NEEDS_PRODUCT_DECISION` | Medium | Reduces risk of uncontrolled schema changes during deploy. | Deployment process changes required. | Medium | Production deployment model. | `Program.cs`, migrations, Docker/deployment config | Production-like startup does not auto-migrate unless explicitly enabled; migration job tested. | 46 |

### Technical Debt

| ID | Item | Severity | Business Impact | Technical Risk | Complexity | Dependencies | Affected Files Or Modules | Verification Method | Order |
|---|---|---|---|---|---|---|---|---|---|
| `DEBT-001` | Resolve frontend lint debt beyond blockers. | High | Improves maintainability and CI confidence. | Touches many files, but most changes are mechanical. | Medium | TypeScript compile fixes. | `eslint.config.js`, `src` | `npm run lint` passes or accepted warnings documented. | 47 |
| `DEBT-002` | Address backend package and nullable warnings. | Medium | Reduces runtime null risks and dependency surprises. | Medium if package alignment affects MediatR registration. | Medium | Backend build green. | `bentinarlyv1.csproj`, handlers, controllers, `Program.cs` | `dotnet build` warning count reduced; targeted tests pass. | 48 |
| `DEBT-003` | Consolidate local UI models vs API DTOs. | High | Reduces recurring compile and runtime contract bugs. | Medium; affects project/sidebar/survey UI. | Medium | `CFG-003`; project DTO decision. | `src/types/project.ts`, `src/data/projects.ts`, `ProjectsContext.tsx`, dashboard components | Type-check; project create/select/list smoke test. | 49 |
| `DEBT-004` | Split duplicated survey-taking/preview rendering. | Medium | Makes question rendering easier to test and extend. | Refactor risk across preview/live flows. | Medium | Stable response/question contracts. | `components/survey/TakeSurvey.tsx`, `components/participants/TakeSurvey.tsx`, `PreviewSurvey.tsx` | Preview and live-taking smoke tests; question type rendering snapshots if available. | 50 |
| `DEBT-005` | Introduce global/backend error handling pattern. | Medium | More consistent API failures and easier frontend handling. | Medium; changes error surfaces. | Medium | Error response contract. | Backend controllers/handlers, `DomainValidationException`, frontend `apiService.ts` | Expected domain errors return consistent 4xx ProblemDetails; frontend displays normalized message. | 51 |
| `DEBT-006` | Split context providers/hooks if Fast Refresh warnings remain. | Low | Improves dev experience. | Low. | Small | Lint policy. | `src/contexts/*` | Fast Refresh warnings resolved; lint passes. | 52 |

## Quick Wins

- `BUG-012`: replace invalid hook usage in sidebar navigation.
- `BUG-013`: remove dark mode render-loop risk.
- `CFG-001`: centralize the API base URL and add/update environment documentation.
- `SEC-005`: stop logging raw webhook payloads.
- `FEATURE-008`: hide Facebook login if it is not in MVP.
- `REFINE-002`: remove or fix clearly broken placeholder links.
- `BUG-008`: replace type-only transaction enums with runtime display maps.

## High-Risk Changes

- `SEC-002`: role model unification and role escalation fix.
- `SEC-003`: resource-level authorization across read handlers.
- `SEC-004`: trusted Stripe/payment integration.
- `FEATURE-001`: persisted refresh tokens and logout invalidation.
- `BUG-006`: real email confirmation/reset flows.
- `FEATURE-003`: full questionnaire persistence across advanced question types.
- `PERF-003`: autosave semantics for questionnaire drafts.
- `CFG-004`: production database migration strategy.

## Items Requiring Business Clarification

- `SEC-006`: token storage threat model.
- `BUG-002`: what "collecting responses" should update.
- `BUG-006`: whether email verification/reset is required for MVP or should be disabled temporarily.
- `BUG-009`: final profile fields.
- `BUG-010`: final participant registration/demographic fields.
- `FEATURE-002`: public share link and response collection behavior.
- `FEATURE-004`: file storage provider and file privacy rules.
- `FEATURE-005`: payment/subscription/KYC scope for MVP.
- `FEATURE-006`: contact form destination.
- `FEATURE-007`: notification MVP scope.
- `FEATURE-008`: Facebook login scope.
- `PERF-003`: autosave behavior, conflict handling, and UX.
- `CFG-004`: production migration policy.

## Parallel Work

Can be worked in parallel once shared dependencies are clear:
- `SEC-001` and `CFG-001`: environment/secrets cleanup.
- `TEST-001` and `BUILD-001`: backend verification can proceed while frontend compile fixes start.
- `BUG-012`, `BUG-013`, `SEC-005`, and `BUG-008`: small frontend/backend quick wins.
- `BUG-004` and `BUG-011`: analytics routing and DTO alignment, if analytics contract is known.
- `FEATURE-006`, `FEATURE-007`, and `FEATURE-008`: can be hidden/deferred independently after product decisions.
- `PERF-001` and `REFINE-003`: after API hook stability is addressed.

## Sequential Work

Must be completed in order:
- `SEC-001` before production deployment or shared environment use.
- `SEC-002` before `SEC-003` tests that depend on reliable role identity.
- `SEC-003` before broad workflow smoke tests involving private survey data.
- `BUILD-001` before `TEST-002`, frontend smoke tests, or deployment verification.
- `CFG-003` before resolving broad frontend API type drift.
- `BUG-006` before validating stable login/session onboarding flows if email confirmation remains required.
- `FEATURE-001` before reviewing token storage or session expiry UX.
- `FEATURE-003` before autosave behavior can be verified meaningfully.
- `SEC-004` before exposing payment/subscription flows in production.

## Recommended First Five Tasks

1. `SEC-001`: remove committed secrets/default credentials, stop logging seeded admin passwords, and document safe local secret setup.
2. `SEC-002`: fix public role escalation and unify role assignment enough that auth claims and role checks are reliable.
3. `SEC-003`: add resource-level authorization to private survey/response/question/analytics read paths.
4. `TEST-001`: stop the running backend process, rerun `dotnet build` and `dotnet test`, and capture actual backend test failures.
5. `FEATURE-001`: implement or explicitly scope refresh-token persistence/logout invalidation so frontend session handling has a reliable backend contract.
