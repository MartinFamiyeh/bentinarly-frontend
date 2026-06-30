# Feature Status

Assessment date: 2026-06-28

Status definitions:
- Implemented: code path exists and appears structurally complete from inspection.
- Partially implemented: meaningful code exists, but verification, contracts, or key behavior are incomplete.
- Placeholder/mock: code explicitly uses placeholder values, generated fake IDs, or "coming soon" behavior.
- Blocked: cannot be considered usable until a confirmed build/runtime issue is resolved.

## Frontend Features

### Public Marketing Pages

- Status: Implemented.
- Relevant file paths: `src/App.tsx`, `src/pages/Home.tsx`, `src/pages/About.tsx`, `src/pages/Contact.tsx`, `src/pages/Pricing.tsx`, `src/pages/Solutions.tsx`, `src/components/Footer.tsx`.
- Current behaviour: public routes are registered under the default layout with header, testimonials, session CTA, and footer.
- Expected behaviour: public pages should render without authentication and support SPA routing.
- Severity: Low.
- Dependencies: frontend build passing, final content/design review.
- Recommended next action: review content and responsive behavior after TypeScript blockers are fixed.
- Confidence level: Medium.

### Authentication: Login, Register, Verification, Password Reset

- Status: Partially implemented.
- Relevant file paths: `src/pages/Login.tsx`, `src/pages/Signup.tsx`, `src/pages/Participants.tsx`, `src/pages/Verification.tsx`, `src/pages/ForgotPassword.tsx`, `src/pages/ResetPassword.tsx`, `src/contexts/AuthContext.tsx`, `src/services/apiClient.ts`, `Controllers/AuthController.cs`, `Features/Auth/Commands`.
- Current behaviour: forms call backend auth endpoints and store tokens on login/register. Email confirmation is required by Identity, but verification/reset handlers are no-op success paths. Refresh-token renewal is called by the frontend but not implemented in backend. Public registration accepts a client-supplied role enum, and participant registration sends frontend-only fields and uses email as `mobileNumber`.
- Expected behaviour: auth flows should use validated contracts, support token renewal, and avoid temporary data mappings.
- Severity: Critical.
- Dependencies: refresh token persistence, frontend/backend DTO alignment, email service behavior, role assignment design, OAuth configuration.
- Recommended next action: implement refresh tokens, fix role assignment, align participant registration DTOs, and validate the email verification/reset flow end to end.
- Confidence level: High.

### Google Login

- Status: Partially implemented.
- Relevant file paths: `src/pages/Login.tsx`, `Controllers/AuthController.cs`, `Features/Auth/Commands/GoogleResponseCommandHandler.cs`, `Program.cs`, `appsettings.json`, `appsettings.Development.json`.
- Current behaviour: frontend redirects to `/api/auth/google-login`; backend configures Google authentication with placeholder client ID/secret values in appsettings. Frontend uses a hard-coded fallback API origin that differs from the API service fallback.
- Expected behaviour: Google login should use configured provider credentials and one documented frontend/backend callback origin.
- Severity: High.
- Dependencies: Google OAuth credentials, deployed callback URLs, unified API base URL.
- Recommended next action: configure secrets outside source control and verify the redirect/callback flow with real credentials.
- Confidence level: High.

### Facebook Login

- Status: Placeholder/mock.
- Relevant file paths: `src/pages/Login.tsx`.
- Current behaviour: clicking Facebook social login only logs "Facebook login not implemented yet".
- Expected behaviour: either remove the option until implemented or wire a real provider flow.
- Severity: Low.
- Dependencies: product decision on Facebook auth.
- Recommended next action: hide the button or add a tracked implementation task.
- Confidence level: High.

### Route Protection And Authorization UI

- Status: Partially implemented.
- Relevant file paths: `src/routes/ProtectedRoutes.tsx`, `src/App.tsx`, `src/layouts/DashboardLayout.tsx`, `src/layouts/SurveyLayout.tsx`, `src/layouts/ParticipantsLayout.tsx`, backend controllers with `[Authorize]`.
- Current behaviour: backend protects many APIs with `[Authorize]`, but frontend protected routes are not wired in `src/App.tsx`.
- Expected behaviour: dashboard, survey management, participant profile/rewards/notifications, and other authenticated screens should be guarded consistently.
- Severity: High.
- Dependencies: role/participant/admin access rules.
- Recommended next action: define access matrix and apply route/layout guards.
- Confidence level: High.

### Projects

- Status: Partially implemented.
- Relevant file paths: `src/contexts/ProjectsContext.tsx`, `src/pages/Projects.tsx`, `src/components/dashboard/CreateProject.tsx`, `src/components/dashboard/DeleteProject.tsx`, `src/components/dashboard/ProjectListItem.tsx`, `Controllers/ProjectsController.cs`, `Features/Projects`.
- Current behaviour: frontend has project context, selection persistence, create/delete UI, and project sidebar components. TypeScript errors show conflicts between local `ProjectType` and backend `ProjectDto`, including ID type mismatches and missing survey fields.
- Expected behaviour: project UI should use a single typed model matching backend DTOs.
- Severity: High.
- Dependencies: DTO alignment, project member role rules.
- Recommended next action: remove conflicting local project shape or map it explicitly from backend DTOs.
- Confidence level: High.

### Surveys And Questionnaire Builder

- Status: Partially implemented.
- Relevant file paths: `src/pages/Questionnaires.tsx`, `src/components/survey`, `src/layouts/SurveyLayout.tsx`, `Controllers/SurveysController.cs`, `Controllers/QuestionsController.cs`, `Features/Surveys`, `Features/Questions`.
- Current behaviour: survey/questionnaire UI supports question editing, autosave concepts, preview, share modal, settings, and backend survey/question APIs. TypeScript currently fails across several builder components; autosave is marked disabled to avoid too many API calls.
- Expected behaviour: builder should type-check, save reliably, and clearly distinguish local draft state from persisted backend state.
- Severity: Critical.
- Dependencies: frontend type cleanup, backend survey/question contracts, autosave strategy.
- Recommended next action: stabilize builder data model, then re-enable autosave only with debouncing and conflict-safe persistence.
- Confidence level: High.

### Survey Sharing And Collaborators

- Status: Partially implemented.
- Relevant file paths: `src/components/survey/ShareModal.tsx`, `src/services/apiClient.ts`, `Controllers/SurveysController.cs`, `Features/Surveys/Commands/AddSurveyCollaboratorCommandHandler.cs`, `Features/Surveys/Queries/GetSurveyCollaboratorsQueryHandler.cs`.
- Current behaviour: collaborator APIs exist and frontend uses them, but `ShareModal` references missing response-toggle state and copy responder link is explicitly "coming soon" despite backend shareable-link commands being present.
- Expected behaviour: collaborator management, response collection state, and responder link generation/copying should use real backend endpoints.
- Severity: High.
- Dependencies: shareable link route/API decision, response collection state model.
- Recommended next action: wire frontend share modal to backend shareable link and publish/close/pause state endpoints after fixing missing state.
- Confidence level: High.

### Participant Survey Taking

- Status: Partially implemented.
- Relevant file paths: `src/components/participants/TakeSurvey.tsx`, `src/components/survey/TakeSurvey.tsx`, `src/pages/Surveys.tsx`, `Controllers/ResponsesController.cs`, `Features/Responses`.
- Current behaviour: participant and survey take components exist. Backend allows anonymous response submission if `User.Identity` is not authenticated and requires authorization for reading responses. Response DTOs use placeholder `UserName = "User"` in multiple query/command handlers.
- Expected behaviour: taking a survey should follow survey settings for anonymous/login-required behavior and record/display accurate participant identity when available.
- Severity: Medium.
- Dependencies: survey settings enforcement, participant identity model, public shareable link flow.
- Recommended next action: verify response submission against survey settings and replace placeholder response user names with actual user data.
- Confidence level: Medium.

### Analytics And Demographics

- Status: Partially implemented.
- Relevant file paths: `src/pages/Analytics.tsx`, `src/pages/SurveyAnalytics.tsx`, `src/pages/Demographics.tsx`, `Controllers/AnalyticsController.cs`, `Features/Analytics/Queries/GetSurveyAnalyticsQueryHandler.cs`.
- Current behaviour: frontend analytics pages call typed APIs but reference fields not present in generated frontend types. Per-survey analytics and demographics pages read `surveyId` from route params, but the registered routes do not include `:surveyId`. Backend survey demographics summary uses hard-coded placeholder values such as `25-34`, `Unknown`, and `Desktop`.
- Expected behaviour: analytics UI and backend DTOs should expose the same fields, and demographics should be computed from real response/user/profile data.
- Severity: High.
- Dependencies: analytics DTO contract, survey route design, demographics source data.
- Recommended next action: fix per-survey routes/links, define analytics DTOs, and either compute demographics accurately or label placeholder analytics as unavailable.
- Confidence level: High.

### Templates

- Status: Partially implemented.
- Relevant file paths: `src/pages/Templates.tsx`, `src/services/apiClient.ts`, `Controllers/TemplatesController.cs`, `Features/Templates`.
- Current behaviour: frontend templates page calls backend templates APIs but TypeScript reports it references `SurveyTemplateDto.name`, which does not exist in the generated type.
- Expected behaviour: templates UI should use backend fields such as title/name according to the final DTO contract.
- Severity: Medium.
- Dependencies: template DTO alignment.
- Recommended next action: confirm template display fields and update frontend types/UI.
- Confidence level: High.

### Profile

- Status: Partially implemented.
- Relevant file paths: `src/pages/Profile.tsx`, `src/components/dashboard/UserProfileSection.tsx`, `src/types/api.ts`, `Controllers/UsersController.cs`, `Features/Users`.
- Current behaviour: frontend profile UI references fields not present on `UserDto` or `UpdateUserProfileCommand` (`phoneNumber`, `bio`, `dateOfBirth`, `gender`, `location`, `profilePicture`).
- Expected behaviour: profile UI should either use existing backend user fields (`mobileNumber`, `profileImageUrl`) or backend DTOs should be expanded intentionally.
- Severity: High.
- Dependencies: user profile product requirements and backend DTO/schema.
- Recommended next action: decide final profile fields before changing DTOs or UI.
- Confidence level: High.

### Wallet And Rewards

- Status: Partially implemented.
- Relevant file paths: `src/pages/Rewards.tsx`, `src/services/apiClient.ts`, `Controllers/WalletController.cs`, `Features/Wallet`, `Models/UserWallet.cs`, `Models/WalletTransaction.cs`.
- Current behaviour: rewards page calls wallet APIs but references `availableBalance`, enum objects `TransactionType` and `TransactionStatus`, and possibly other fields that do not exist as runtime values in `src/types/api.ts`.
- Expected behaviour: rewards UI should render against actual wallet DTO fields and use constants or mappings for numeric enum values.
- Severity: High.
- Dependencies: wallet DTO contract, enum mapping strategy.
- Recommended next action: align wallet DTOs/types and add typed display helpers for transaction type/status.
- Confidence level: High.

### Payments And Subscriptions

- Status: Placeholder/mock.
- Relevant file paths: `Controllers/PaymentsController.cs`, `Features/Payments/Commands/UpdatePaymentMethodCommandHandler.cs`, `Features/Subscriptions/Commands/SubscribeToPlanCommandHandler.cs`, `Features/Subscriptions/Commands/UpgradeSubscriptionCommandHandler.cs`, `Features/Webhooks/Commands/ProcessStripeWebhookCommandHandler.cs`.
- Current behaviour: several payment/subscription paths exist, but Stripe calls are stubbed or synthesized, payment method update is a no-op, and webhook signature verification is not implemented.
- Expected behaviour: money-moving flows should use verified Stripe API interactions and trusted webhook events.
- Severity: High.
- Dependencies: Stripe credentials, webhook secret, product/price IDs, reconciliation rules.
- Recommended next action: mark as not production-ready and implement Stripe integration behind integration tests.
- Confidence level: High.

### Files/Profile Image Upload

- Status: Placeholder/mock.
- Relevant file paths: `Controllers\FilesController.cs`, `Features\Files`, `Features\Users\Commands\UploadProfileImageCommandHandler.cs`, `Dockerfile`, `docker-compose.yml`.
- Current behaviour: backend has upload storage volume paths, but profile image upload handler returns `https://example.com/profile-images/{userId}.jpg` without storing the file. Uploaded file URLs under `wwwroot/uploads` are not served by static file middleware in `Program.cs`.
- Expected behaviour: uploaded files should be validated, stored, and returned from a real accessible storage URL or file-serving endpoint.
- Severity: Medium.
- Dependencies: storage provider choice, file validation, authorization for private files, static file serving/CDN decision.
- Recommended next action: implement file storage/serving or hide upload UI until storage is ready.
- Confidence level: High.

### Backend Read Authorization

- Status: Partially implemented.
- Relevant file paths: `Controllers/SurveysController.cs`, `Controllers/QuestionsController.cs`, `Controllers/ResponsesController.cs`, `Controllers/AnalyticsController.cs`, `Features/Surveys/Queries`, `Features/Questions/Queries`, `Features/Responses/Queries`, `Features/Analytics/Queries`.
- Current behaviour: many controllers require authentication, and some command handlers check ownership/collaborator rights, but several read/query handlers can load private survey data by GUID without resource-level checks.
- Expected behaviour: all private read endpoints should enforce creator, collaborator, project member, participant, or admin access as appropriate.
- Severity: Critical.
- Dependencies: collaborator permission model and project membership rules.
- Recommended next action: add shared authorization checks to read handlers and cover cross-user access with integration tests.
- Confidence level: High.

### Admin

- Status: Partially implemented.
- Relevant file paths: `Controllers/AdminController.cs`, `Features/Admin`, `Extensions/DatabaseSeedingExtensions.cs`, `appsettings.json`, `appsettings.Development.json`, `bentinarlyIntegrationTests/AdminIntegrationTests.cs`.
- Current behaviour: admin endpoints and tests exist; integration tests contain TODOs for payment/wallet functionality. Admin seeding can create default users from committed config and print credentials.
- Expected behaviour: admin capabilities should be authorization-locked, tested, and seeded through secure operational process.
- Severity: Medium.
- Dependencies: admin role model, secret management, payment/wallet completion.
- Recommended next action: audit admin authorization and remove/log-safe default credential behavior.
- Confidence level: Medium.
