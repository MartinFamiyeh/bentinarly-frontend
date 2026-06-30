// Auto-generated TypeScript types from OpenAPI schema
// Generated from: http://localhost:7141/swagger/v1/swagger.json

// Enums
export type SurveyStatus = 1 | 2 | 3 | 4 | 5; // Added 5 = Paused
export type CollaboratorPermission = 1 | 2 | 3; // 1 = ViewOnly, 2 = EditOnly, 3 = CoOwner
export type UserRole = 1 | 2 | 3 | 4 | 5;
export type UserStatus = 1 | 2 | 3 | 4;
export type QuestionType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17;
export type PaymentType = 1 | 2 | 3;
export type PaymentStatus = 1 | 2 | 3 | 4 | 5 | 6;
export type ResponseStatus = 1 | 2 | 3;
export type SubscriptionPlan = 1 | 2 | 3 | 4;
export type SubscriptionStatus = 1 | 2 | 3 | 4 | 5 | 6;
export type TransactionType = 1 | 2 | 3 | 4 | 5;
export type TransactionStatus = 1 | 2 | 3 | 4 | 5;
export type BranchingAction = 1 | 2 | 3;
export type MatrixType = 1 | 2 | 3;

// Common Interfaces
export interface ProblemDetails {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
}

export interface PagedResult<T> {
  items?: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// User Types
export interface UserDto {
  id: string;
  userName?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  mobileNumber?: string;
  profileImageUrl?: string;
  role: UserRole;
  status: UserStatus;
  emailConfirmed: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface UserDtoPagedResult extends PagedResult<UserDto> {}

export interface RegisterCommand {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  mobileNumber?: string;
}

export interface RegisterParticipantCommand {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  mobileNumber?: string;
}

export interface LoginCommand {
  email?: string;
  password?: string;
}

export interface AuthResultDto {
  success: boolean;
  token?: string;
  refreshToken?: string;
  expiresAt?: string;
  user: UserDto;
  errors?: string[];
}

export interface RefreshTokenCommand {
  refreshToken?: string;
}

export interface ForgotPasswordCommand {
  email?: string;
}

export interface ResetPasswordCommand {
  email?: string;
  token?: string;
  newPassword?: string;
}

export interface VerifyEmailCommand {
  email?: string;
  token?: string;
}

export interface ResendVerificationCommand {
  email?: string;
}

export interface ChangePasswordCommand {
  userId: string;
  currentPassword?: string;
  newPassword?: string;
}

export interface UpdateUserProfileCommand {
  userId: string;
  firstName?: string;
  lastName?: string;
  mobileNumber?: string;
}

export interface UpdateUserStatusCommand {
  userId: string;
  status: UserStatus;
}

export interface DeleteAccountCommand {
  userId: string;
  password?: string;
}

// Survey Types
export interface SurveyDto {
  id: string;
  title?: string;
  description?: string;
  creatorId: string;
  creatorName?: string;
  status: SurveyStatus;
  projectId?: string; // The project this survey belongs to
  settings: SurveySettings;
  publishedAt?: string;
  closedAt?: string;
  expectedResponses: number;
  rewardPerResponse?: number;
  shareableLink?: string;
  isTemplate: boolean;
  templateId?: string;
  createdAt: string;
  updatedAt: string;
  questionCount: number;
  responseCount: number;
  questions?: QuestionDto[];
}

export interface PublicSurveyDto {
  id: string;
  title?: string;
  description?: string;
  settings: SurveySettings;
  passwordProtected: boolean;
  publishedAt?: string;
  questionCount: number;
}

export interface SurveyDtoPagedResult extends PagedResult<SurveyDto> {}

// Survey Collaborator Types
export interface SurveyCollaboratorDto {
  id: string;
  userId: string;
  userName?: string;
  email?: string;
  permission: CollaboratorPermission;
  addedAt: string;
}

export interface AddSurveyCollaboratorDto {
  email: string;
  permission: CollaboratorPermission;
}

export interface UpdateSurveyCollaboratorDto {
  permission: CollaboratorPermission;
}

export interface CreateSurveyDto {
  title: string;
  description?: string;
  projectId?: string; // Link survey to a project
  settings?: SurveySettings;
  expectedResponses?: number;
  rewardPerResponse?: number;
  isTemplate?: boolean;
  templateId?: string;
}

export interface UpdateSurveyDto {
  title: string;
  description?: string;
  projectId?: string; // Allow updating the project a survey belongs to
  settings?: SurveySettings;
  expectedResponses?: number;
  rewardPerResponse?: number;
}

export interface SurveySettings {
  allowAnonymous?: boolean;
  collectEmails?: boolean;
  shuffleQuestions?: boolean;
  oneResponsePerPerson?: boolean;
  requireLogin?: boolean;
  expiresAt?: string;
  maxResponses?: number;
  password?: string;
  showProgress?: boolean;
  allowSaveAndContinue?: boolean;
}

// Question Types
export interface QuestionDto {
  id: string;
  surveyId: string;
  type: QuestionType;
  title?: string;
  description?: string;
  isRequired: boolean;
  order: number;
  imageUrl?: string;
  validation?: QuestionValidation;
  branching?: QuestionBranching;
  ratingScale?: QuestionRatingScale;
  matrix?: QuestionMatrix;
  options?: QuestionOptionDto[];
  createdAt: string;
  updatedAt: string;
}

export interface QuestionOptionDto {
  id: string;
  questionId: string;
  text?: string;
  order: number;
  isCorrect: boolean;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateQuestionDto {
  type: QuestionType;
  title: string;
  description?: string;
  isRequired?: boolean;
  order?: number;
  imageUrl?: string;
  validation?: QuestionValidation;
  branching?: QuestionBranching;
  ratingScale?: QuestionRatingScale;
  matrix?: QuestionMatrix;
  options?: CreateQuestionOptionDto[];
}

export interface CreateQuestionOptionDto {
  text: string;
  order?: number;
  isCorrect?: boolean;
  imageUrl?: string;
}

export interface UpdateQuestionDto {
  type: QuestionType;
  title: string;
  description?: string;
  isRequired?: boolean;
  order?: number;
  imageUrl?: string;
  validation?: QuestionValidation;
  branching?: QuestionBranching;
  ratingScale?: QuestionRatingScale;
  matrix?: QuestionMatrix;
  options?: UpdateQuestionOptionDto[];
}

export interface UpdateQuestionOptionDto {
  id?: string;
  text: string;
  order?: number;
  isCorrect?: boolean;
  imageUrl?: string;
}

export interface QuestionValidation {
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  minValue?: number;
  maxValue?: number;
  isRequired?: boolean;
}

export interface QuestionBranching {
  conditions?: BranchingCondition[];
}

export interface BranchingCondition {
  id: string;
  optionId?: string;
  action: BranchingAction;
  targetQuestionId?: string;
}

export interface QuestionRatingScale {
  min: number;
  max: number;
  minLabel?: string;
  maxLabel?: string;
  step?: number;
}

export interface QuestionMatrix {
  rows?: string[];
  columns?: string[];
  type: MatrixType;
}

export interface QuestionOrderDto {
  questionId: string;
  order?: number;
}

export interface ReorderQuestionsDto {
  questionOrders: QuestionOrderDto[];
}

// Response Types
export interface SurveyResponseDto {
  id: string;
  surveyId: string;
  participantId?: string;
  userId?: string;
  userName?: string;
  anonymousId?: string;
  status: ResponseStatus;
  startedAt?: string;
  completedAt?: string;
  duration?: string;
  ipAddress?: string;
  userAgent?: string;
  rewardAmount?: number;
  paymentStatus: PaymentStatus;
  createdAt: string;
  updatedAt: string;
  questionResponses?: QuestionResponseDto[];
}

export interface SurveyResponseDtoPagedResult extends PagedResult<SurveyResponseDto> {}

export interface QuestionResponseDto {
  id: string;
  surveyResponseId: string;
  questionId: string;
  optionId?: string;
  textValue?: string;
  textResponse?: string;
  numericValue?: number;
  dateValue?: string;
  dateResponse?: string;
  timeResponse?: string;
  fileUrl?: string;
  fileName?: string;
  fileSizeBytes?: number;
  matrixResponse?: string;
  selectedOptionIds?: string[];
  ratingValue?: number;
  createdAt: string;
}

export interface QuestionResponseSubmissionDto {
  questionId: string;
  textValue?: string;
  textResponse?: string;
  numericValue?: number;
  dateValue?: string;
  dateResponse?: string;
  timeResponse?: string;
  fileUrl?: string;
  fileName?: string;
  fileSizeBytes?: number;
  matrixResponse?: string;
  selectedOptionIds?: string[];
  ratingValue?: number;
}

export interface SubmitSurveyResponseDto {
  questionResponses?: QuestionResponseSubmissionDto[];
  ipAddress?: string;
  userAgent?: string;
}

// Analytics Types
export interface SurveyAnalyticsDto {
  surveyId: string;
  surveyTitle?: string;
  totalResponses: number;
  completedResponses: number;
  incompleteResponses: number;
  completionRate: number;
  averageCompletionTime: number;
  firstResponseAt?: string;
  lastResponseAt?: string;
  responseTrends?: ResponseTrendDto[];
  questionSummaries?: QuestionAnalyticsSummaryDto[];
  demographics?: DemographicsSummaryDto;
}

export interface QuestionAnalyticsDto {
  questionId: string;
  questionTitle?: string;
  questionType: QuestionType;
  totalResponses: number;
  skippedResponses: number;
  skipRate: number;
  optionAnalytics?: OptionAnalyticsDto[];
  textResponses?: TextResponseDto[];
  numericAnalytics?: NumericAnalyticsDto;
  ratingAnalytics?: RatingAnalyticsDto;
}

export interface QuestionAnalyticsSummaryDto {
  questionId: string;
  questionTitle?: string;
  questionType: QuestionType;
  responseCount: number;
  skipCount: number;
  skipRate: number;
}

export interface OptionAnalyticsDto {
  optionId: string;
  optionText?: string;
  selectionCount: number;
  selectionPercentage: number;
  isCorrect: boolean;
}

export interface TextResponseDto {
  response?: string;
  count: number;
  percentage: number;
}

export interface NumericAnalyticsDto {
  average: number;
  median: number;
  min: number;
  max: number;
  standardDeviation: number;
  ranges?: NumericRangeDto[];
}

export interface NumericRangeDto {
  range?: string;
  count: number;
  percentage: number;
}

export interface RatingAnalyticsDto {
  averageRating: number;
  totalRatings: number;
  distribution?: RatingDistributionDto[];
}

export interface RatingDistributionDto {
  rating: number;
  count: number;
  percentage: number;
}

export interface ResponseTrendDto {
  date: string;
  responseCount: number;
  completedCount: number;
  completionRate: number;
}

export interface DashboardAnalyticsDto {
  totalSurveys: number;
  activeSurveys: number;
  totalResponses: number;
  responsesThisMonth: number;
  averageCompletionRate: number;
  recentSurveys?: SurveySummaryDto[];
  responseTrends?: ResponseTrendDto[];
  topQuestions?: TopQuestionDto[];
}

export interface SurveySummaryDto {
  id: string;
  title?: string;
  status: SurveyStatus;
  responseCount: number;
  completionRate: number;
  createdAt: string;
  lastResponseAt?: string;
}

export interface TopQuestionDto {
  questionId: string;
  questionTitle?: string;
  responseCount: number;
  skipRate: number;
}

export interface DemographicsAnalyticsDto {
  surveyId: string;
  totalParticipants: number;
  ageGroups?: AgeGroupDto[];
  genderDistribution?: GenderDistributionDto[];
  locations?: LocationDto[];
  deviceTypes?: DeviceTypeDto[];
  browserTypes?: BrowserTypeDto[];
}

export interface DemographicsSummaryDto {
  totalParticipants: number;
  topAgeGroup?: string;
  topGender?: string;
  topLocation?: string;
  topDevice?: string;
}

export interface AgeGroupDto {
  ageGroup?: string;
  count: number;
  percentage: number;
}

export interface GenderDistributionDto {
  gender?: string;
  count: number;
  percentage: number;
}

export interface LocationDto {
  country?: string;
  region?: string;
  count: number;
  percentage: number;
}

export interface DeviceTypeDto {
  deviceType?: string;
  count: number;
  percentage: number;
}

export interface BrowserTypeDto {
  browser?: string;
  count: number;
  percentage: number;
}

// Admin Types
export interface AdminStatisticsDto {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  totalSurveys: number;
  publishedSurveys: number;
  totalResponses: number;
  responsesThisMonth: number;
  totalRevenue: number;
  revenueThisMonth: number;
  pendingWithdrawals: number;
  pendingWithdrawalAmount: number;
  monthlyStats?: MonthlyStatsDto[];
  topSurveys?: TopSurveyDto[];
  userGrowth?: UserGrowthDto[];
}

export interface AdminSurveyDto {
  id: string;
  title?: string;
  description?: string;
  status: SurveyStatus;
  creatorId: string;
  creatorName?: string;
  creatorEmail?: string;
  responseCount: number;
  completionRate: number;
  createdAt: string;
  publishedAt?: string;
  lastResponseAt?: string;
}

export interface AdminSurveyDtoPagedResult extends PagedResult<AdminSurveyDto> {}

export interface AdminUserDto {
  id: string;
  userName?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  status: UserStatus;
  surveyCount: number;
  responseCount: number;
  totalSpent: number;
  totalEarned: number;
  createdAt: string;
  lastLoginAt?: string;
  isEmailVerified: boolean;
}

export interface AdminUserDtoPagedResult extends PagedResult<AdminUserDto> {}

export interface MonthlyStatsDto {
  year: number;
  month: number;
  newUsers: number;
  newSurveys: number;
  newResponses: number;
  revenue: number;
}

export interface TopSurveyDto {
  id: string;
  title?: string;
  creatorName?: string;
  responseCount: number;
  completionRate: number;
  createdAt: string;
}

export interface UserGrowthDto {
  date: string;
  newUsers: number;
  totalUsers: number;
}

export interface AdminPaymentAnalyticsDto {
  totalRevenue: number;
  revenueThisMonth: number;
  revenueThisYear: number;
  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  successRate: number;
  averageTransactionValue: number;
  paymentTrends?: PaymentTrendDto[];
  paymentMethods?: PaymentMethodDto[];
  subscriptionRevenue?: SubscriptionRevenueDto[];
}

export interface PaymentTrendDto {
  date: string;
  amount: number;
  transactionCount: number;
}

export interface PaymentMethodDto {
  method?: string;
  count: number;
  amount: number;
  percentage: number;
}

export interface SubscriptionRevenueDto {
  plan: SubscriptionPlan;
  subscriberCount: number;
  monthlyRevenue: number;
  totalRevenue: number;
}

export interface RejectWithdrawalDto {
  reason?: string;
}

// Payment Types
export interface PaymentDto {
  id: string;
  userId: string;
  type: PaymentType;
  status: PaymentStatus;
  amount: number;
  currency?: string;
  description?: string;
  stripePaymentIntentId?: string;
  stripeChargeId?: string;
  paymentMethodId?: string;
  failureReason?: string;
  createdAt: string;
  processedAt?: string;
  failedAt?: string;
}

export interface PaymentDtoPagedResult extends PagedResult<PaymentDto> {}

export interface PaymentIntentDto {
  clientSecret?: string;
  paymentIntentId?: string;
  amount: number;
  currency?: string;
}

export interface CreatePaymentIntentDto {
  type: PaymentType;
  amount: number;
  description?: string;
  subscriptionId?: string;
}

export interface ConfirmPaymentDto {
  paymentIntentId?: string;
  paymentMethodId?: string;
}

export interface UpdatePaymentMethodDto {
  paymentMethodId?: string;
}

// Subscription Types
export interface SubscriptionDto {
  id: string;
  userId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  startDate: string;
  endDate?: string;
  nextBillingDate?: string;
  monthlyPrice: number;
  currency?: string;
  autoRenew: boolean;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionPlanDto {
  plan: SubscriptionPlan;
  name?: string;
  description?: string;
  monthlyPrice: number;
  yearlyPrice: number;
  currency?: string;
  maxSurveys: number;
  maxQuestionsPerSurvey: number;
  maxResponsesPerSurvey: number;
  advancedAnalytics: boolean;
  customBranding: boolean;
  apiAccess: boolean;
  prioritySupport: boolean;
  isPopular: boolean;
}

export interface SubscriptionUsageDto {
  subscriptionId: string;
  plan: SubscriptionPlan;
  surveysUsed: number;
  maxSurveys: number;
  questionsUsed: number;
  maxQuestions: number;
  responsesUsed: number;
  maxResponses: number;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  isNearLimit: boolean;
  limitWarnings?: string[];
}

export interface SubscribeToPlanDto {
  plan: SubscriptionPlan;
  isYearly: boolean;
  paymentMethodId?: string;
}

export interface UpgradeSubscriptionDto {
  newPlan: SubscriptionPlan;
  isYearly: boolean;
  paymentMethodId?: string;
}

// Wallet Types
export interface UserWalletDto {
  id: string;
  userId: string;
  balance: number;
  pendingBalance: number;
  totalEarned: number;
  totalWithdrawn: number;
  isStripeConnected: boolean;
  stripeAccountId?: string;
  isKycVerified: boolean;
  kycVerifiedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WalletTransactionDto {
  id: string;
  userId: string;
  walletId?: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  description?: string;
  reference?: string;
  externalTransactionId?: string;
  createdAt: string;
  processedAt?: string;
}

export interface WalletTransactionDtoPagedResult extends PagedResult<WalletTransactionDto> {}

export interface RequestWithdrawalDto {
  amount: number;
  description?: string;
}

export interface StripeConnectDto {
  accountId?: string;
  onboardingUrl?: string;
  isComplete: boolean;
}

export interface CompleteKycDto {
  firstName?: string;
  lastName?: string;
  dateOfBirth: string;
  ssn?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

// Template Types
export interface SurveyTemplateDto {
  id: string;
  title?: string;
  description?: string;
  category?: string;
  tags?: string[];
  previewImageUrl?: string;
  isPublic: boolean;
  isOfficial: boolean;
  createdBy: string;
  createdByName?: string;
  usageCount: number;
  rating: number;
  ratingCount: number;
  createdAt: string;
  updatedAt: string;
  questions?: TemplateQuestionDto[];
}

export interface SurveyTemplateDtoPagedResult extends PagedResult<SurveyTemplateDto> {}

export interface TemplateQuestionDto {
  id: string;
  title?: string;
  description?: string;
  type: QuestionType;
  isRequired: boolean;
  order: number;
  validationRules?: string;
  branchingLogic?: string;
  options?: TemplateQuestionOptionDto[];
}

export interface TemplateQuestionOptionDto {
  id: string;
  text?: string;
  order: number;
  isOther: boolean;
  isCorrect: boolean;
}

export interface CreateSurveyFromTemplateDto {
  title?: string;
  description?: string;
  copyQuestions?: boolean;
  copySettings?: boolean;
}

export interface SaveSurveyAsTemplateDto {
  title?: string;
  description?: string;
  category?: string;
  tags?: string[];
  isPublic?: boolean;
  copyQuestions?: boolean;
  copySettings?: boolean;
}

// File Types
export interface FileUploadDto {
  id: string;
  userId: string;
  fileName?: string;
  originalFileName?: string;
  fileType?: string;
  mimeType?: string;
  fileSizeBytes: number;
  filePath?: string;
  url?: string;
  description?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FileUploadDtoPagedResult extends PagedResult<FileUploadDto> {}

// Project Types (to be added to backend)
export interface ProjectDto {
  id: string;
  name: string;
  description?: string;
  creatorId: string;
  creatorName?: string;
  memberCount?: number;
  surveyCount?: number;
  createdAt: string;
  updatedAt: string;
  members?: ProjectMemberDto[];
}

export interface ProjectDtoPagedResult extends PagedResult<ProjectDto> {}

export interface ProjectMemberDto {
  id: string;
  userId: string;
  userName?: string;
  email?: string;
  role: ProjectMemberRole;
  joinedAt: string;
}

export type ProjectMemberRole = 1 | 2; // 1 = Member, 2 = Admin

export interface CreateProjectDto {
  name: string;
  description?: string;
}

export interface UpdateProjectDto {
  name?: string;
  description?: string;
}

export interface AddProjectMemberDto {
  userId: string;
  role?: ProjectMemberRole;
}

export interface UpdateProjectMemberDto {
  role: ProjectMemberRole;
}

