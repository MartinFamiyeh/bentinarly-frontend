// API Client with typed functions for all endpoints
// Generated from OpenAPI schema

import { useApiService } from "./apiService";
import type * as ApiTypes from "../types/api";

// Auth API
export const useAuthApi = () => {
  const api = useApiService();

  return {
    register: (data: ApiTypes.RegisterCommand) =>
      api.post<ApiTypes.AuthResultDto>("/api/auth/register", data),

    registerParticipant: (data: ApiTypes.RegisterParticipantCommand) =>
      api.post<ApiTypes.AuthResultDto>("/api/auth/register/participant", data),

    login: (data: ApiTypes.LoginCommand) =>
      api.post<ApiTypes.AuthResultDto>("/api/auth/login", data),

    refresh: (data: ApiTypes.RefreshTokenCommand) =>
      api.post<ApiTypes.AuthResultDto>("/api/auth/refresh", data),

    logout: () =>
      api.post<void>("/api/auth/logout"),

    forgotPassword: (data: ApiTypes.ForgotPasswordCommand) =>
      api.post<void>("/api/auth/forgot-password", data),

    resetPassword: (data: ApiTypes.ResetPasswordCommand) =>
      api.post<void>("/api/auth/reset-password", data),

    verifyEmail: (data: ApiTypes.VerifyEmailCommand) =>
      api.post<void>("/api/auth/verify-email", data),

    resendVerification: (data: ApiTypes.ResendVerificationCommand) =>
      api.post<void>("/api/auth/resend-verification", data),

    getMe: () =>
      api.get<ApiTypes.UserDto>("/api/auth/me", undefined, { silent: true }), // Silent - don't show error snackbar

    googleLogin: (returnUrl?: string) =>
      api.get<void>("/api/auth/google-login", { returnUrl }),

    googleResponse: (returnUrl?: string) =>
      api.get<ApiTypes.AuthResultDto>("/api/auth/google-response", { returnUrl }),
  };
};

// Surveys API
export const useSurveysApi = () => {
  const api = useApiService();

  return {
    getSurveys: (params?: {
      projectId?: string;
      status?: ApiTypes.SurveyStatus;
      page?: number;
      pageSize?: number;
      searchTerm?: string;
      sortBy?: string;
      sortDescending?: boolean;
    }) =>
      api.get<ApiTypes.SurveyDtoPagedResult>("/api/surveys", params),

    createSurvey: (data: ApiTypes.CreateSurveyDto) =>
      api.post<ApiTypes.SurveyDto>("/api/surveys", data),

    getSurvey: (id: string | null, params?: { includeQuestions?: boolean; includeAnalytics?: boolean }) =>
      api.get<ApiTypes.SurveyDto>(`/api/surveys/${id}`, params),

    updateSurvey: (id: string, data: ApiTypes.UpdateSurveyDto) =>
      api.put<ApiTypes.SurveyDto>(`/api/surveys/${id}`, data),

    updateSurveySettings: (id: string, settings: ApiTypes.SurveySettings) =>
      api.put<ApiTypes.SurveyDto>(`/api/surveys/${id}/settings`, settings),

    moveSurvey: (id: string, projectId: string | null) =>
      api.put<ApiTypes.SurveyDto>(`/api/surveys/${id}/move`, { projectId }),

    deleteSurvey: (id: string) =>
      api.del<void>(`/api/surveys/${id}`),

    publishSurvey: (id: string) =>
      api.post<ApiTypes.SurveyDto>(`/api/surveys/${id}/publish`),

    // Survey Collaborators
    getSurveyCollaborators: (id: string) =>
      api.get<ApiTypes.SurveyCollaboratorDto[]>(`/api/surveys/${id}/collaborators`),

    addSurveyCollaborator: (id: string, data: ApiTypes.AddSurveyCollaboratorDto) =>
      api.post<ApiTypes.SurveyCollaboratorDto>(`/api/surveys/${id}/collaborators`, data),

    updateSurveyCollaborator: (id: string, userId: string, data: ApiTypes.UpdateSurveyCollaboratorDto) =>
      api.put<ApiTypes.SurveyCollaboratorDto>(`/api/surveys/${id}/collaborators/${userId}`, data),

    removeSurveyCollaborator: (id: string, userId: string) =>
      api.del<void>(`/api/surveys/${id}/collaborators/${userId}`),

    getPublicSurvey: (id: string) =>
      api.get<ApiTypes.PublicSurveyDto>(`/api/public/surveys/${id}`),

    getPublicQuestions: (surveyId: string) =>
      api.get<ApiTypes.QuestionDto[]>(`/api/public/surveys/${surveyId}/questions`),
  };
};

// Questions API
export const useQuestionsApi = () => {
  const api = useApiService();

  return {
    getQuestions: (surveyId: string) =>
      api.get<ApiTypes.QuestionDto[]>(`/api/surveys/${surveyId}/questions`),

    createQuestion: (surveyId: string, data: ApiTypes.CreateQuestionDto) =>
      api.post<ApiTypes.QuestionDto>(`/api/surveys/${surveyId}/questions`, data),

    getQuestion: (surveyId: string, id: string) =>
      api.get<ApiTypes.QuestionDto>(`/api/surveys/${surveyId}/questions/${id}`),

    updateQuestion: (surveyId: string, id: string, data: ApiTypes.UpdateQuestionDto) =>
      api.put<ApiTypes.QuestionDto>(`/api/surveys/${surveyId}/questions/${id}`, data),

    deleteQuestion: (surveyId: string, id: string) =>
      api.del<void>(`/api/surveys/${surveyId}/questions/${id}`),

    reorderQuestions: (surveyId: string, data: ApiTypes.ReorderQuestionsDto) =>
      api.put<void>(`/api/surveys/${surveyId}/questions/reorder`, data),
  };
};

// Responses API
export const useResponsesApi = () => {
  const api = useApiService();

  return {
    submitResponse: (surveyId: string, data: ApiTypes.SubmitSurveyResponseDto) =>
      api.post<ApiTypes.SurveyResponseDto>(`/api/surveys/${surveyId}/responses`, data),

    getResponses: (surveyId: string, params?: {
      page?: number;
      pageSize?: number;
      status?: ApiTypes.ResponseStatus;
    }) =>
      api.get<ApiTypes.SurveyResponseDtoPagedResult>(`/api/surveys/${surveyId}/responses`, params),

    getResponse: (surveyId: string, id: string) =>
      api.get<ApiTypes.SurveyResponseDto>(`/api/surveys/${surveyId}/responses/${id}`),
  };
};

// Analytics API
export const useAnalyticsApi = () => {
  const api = useApiService();

  return {
    getSurveyAnalytics: (surveyId: string, params?: {
      fromDate?: string;
      toDate?: string;
      groupBy?: string;
    }) =>
      api.get<ApiTypes.SurveyAnalyticsDto>(`/api/analytics/surveys/${surveyId}`, params),

    getQuestionAnalytics: (surveyId: string, questionId: string, params?: {
      fromDate?: string;
      toDate?: string;
    }) =>
      api.get<ApiTypes.QuestionAnalyticsDto>(`/api/analytics/surveys/${surveyId}/questions/${questionId}`, params),

    getDashboardAnalytics: (params?: {
      fromDate?: string;
      toDate?: string;
    }) =>
      api.get<ApiTypes.DashboardAnalyticsDto>("/api/analytics/dashboard", params),

    exportSurveyAnalytics: (surveyId: string, params?: {
      format?: string;
      fromDate?: string;
      toDate?: string;
    }) =>
      api.get<Blob>(`/api/analytics/surveys/${surveyId}/export`, params),

    getDemographics: (surveyId: string, params?: {
      fromDate?: string;
      toDate?: string;
    }) =>
      api.get<ApiTypes.DemographicsAnalyticsDto>(`/api/analytics/surveys/${surveyId}/demographics`, params),
  };
};

// Users API
export const useUsersApi = () => {
  const api = useApiService();

  return {
    getMe: () =>
      api.get<ApiTypes.UserDto>("/api/users/me"),

    updateProfile: (data: ApiTypes.UpdateUserProfileCommand) =>
      api.put<ApiTypes.UserDto>("/api/users/me", data),

    deleteAccount: (data: ApiTypes.DeleteAccountCommand) =>
      api.del<void>("/api/users/me", data),

    changePassword: (data: ApiTypes.ChangePasswordCommand) =>
      api.put<void>("/api/users/me/password", data),

    uploadProfileImage: (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      return api.post<string>("/api/users/me/profile-image", formData);
    },

    getUser: (id: string) =>
      api.get<ApiTypes.UserDto>(`/api/users/${id}`),

    getUsers: (params?: {
      page?: number;
      pageSize?: number;
      role?: ApiTypes.UserRole;
      status?: ApiTypes.UserStatus;
      searchTerm?: string;
    }) =>
      api.get<ApiTypes.UserDtoPagedResult>("/api/users", params),

    updateUserStatus: (id: string, data: ApiTypes.UpdateUserStatusCommand) =>
      api.put<ApiTypes.UserDto>(`/api/users/${id}/status`, data),
  };
};

// Templates API
export const useTemplatesApi = () => {
  const api = useApiService();

  return {
    getTemplates: (params?: {
      page?: number;
      pageSize?: number;
      category?: string;
      searchTerm?: string;
    }) =>
      api.get<ApiTypes.SurveyTemplateDtoPagedResult>("/api/templates", params),

    getTemplate: (id: string) =>
      api.get<ApiTypes.SurveyTemplateDto>(`/api/templates/${id}`),

    createSurveyFromTemplate: (id: string, data: ApiTypes.CreateSurveyFromTemplateDto) =>
      api.post<ApiTypes.SurveyDto>(`/api/templates/${id}/create-survey`, data),

    saveSurveyAsTemplate: (surveyId: string, data: ApiTypes.SaveSurveyAsTemplateDto) =>
      api.post<ApiTypes.SurveyTemplateDto>(`/api/templates/from-survey/${surveyId}`, data),
  };
};

// Payments API
export const usePaymentsApi = () => {
  const api = useApiService();

  return {
    createPaymentIntent: (data: ApiTypes.CreatePaymentIntentDto) =>
      api.post<ApiTypes.PaymentIntentDto>("/api/payments/create-intent", data),

    confirmPayment: (data: ApiTypes.ConfirmPaymentDto) =>
      api.post<ApiTypes.PaymentDto>("/api/payments/confirm", data),

    getPayments: (params?: {
      page?: number;
      pageSize?: number;
      type?: ApiTypes.PaymentType;
      status?: ApiTypes.PaymentStatus;
    }) =>
      api.get<ApiTypes.PaymentDtoPagedResult>("/api/payments", params),

    getPayment: (id: string) =>
      api.get<ApiTypes.PaymentDto>(`/api/payments/${id}`),

    cancelSubscription: () =>
      api.post<void>("/api/payments/subscription/cancel"),

    updatePaymentMethod: (data: ApiTypes.UpdatePaymentMethodDto) =>
      api.put<void>("/api/payments/payment-method", data),
  };
};

// Subscriptions API
export const useSubscriptionsApi = () => {
  const api = useApiService();

  return {
    getCurrentSubscription: () =>
      api.get<ApiTypes.SubscriptionDto>("/api/subscriptions/current"),

    getPlans: () =>
      api.get<ApiTypes.SubscriptionPlanDto[]>("/api/subscriptions/plans"),

    subscribe: (data: ApiTypes.SubscribeToPlanDto) =>
      api.post<ApiTypes.SubscriptionDto>("/api/subscriptions/subscribe", data),

    upgrade: (data: ApiTypes.UpgradeSubscriptionDto) =>
      api.put<ApiTypes.SubscriptionDto>("/api/subscriptions/upgrade", data),

    getUsage: () =>
      api.get<ApiTypes.SubscriptionUsageDto>("/api/subscriptions/usage"),
  };
};

// Projects API
export const useProjectsApi = () => {
  const api = useApiService();

  return {
    getProjects: (params?: {
      page?: number;
      pageSize?: number;
      searchTerm?: string;
    }) =>
      api.get<ApiTypes.ProjectDtoPagedResult>("/api/projects", params),

    getProject: (id: string) =>
      api.get<ApiTypes.ProjectDto>(`/api/projects/${id}`),

    createProject: (data: ApiTypes.CreateProjectDto) =>
      api.post<ApiTypes.ProjectDto>("/api/projects", data),

    updateProject: (id: string, data: ApiTypes.UpdateProjectDto) =>
      api.put<ApiTypes.ProjectDto>(`/api/projects/${id}`, data),

    deleteProject: (id: string) =>
      api.del<void>(`/api/projects/${id}`),

    getProjectMembers: (id: string) =>
      api.get<ApiTypes.ProjectMemberDto[]>(`/api/projects/${id}/members`),

    addProjectMember: (id: string, data: ApiTypes.AddProjectMemberDto) =>
      api.post<ApiTypes.ProjectMemberDto>(`/api/projects/${id}/members`, data),

    updateProjectMember: (id: string, memberId: string, data: ApiTypes.UpdateProjectMemberDto) =>
      api.put<ApiTypes.ProjectMemberDto>(`/api/projects/${id}/members/${memberId}`, data),

    removeProjectMember: (id: string, memberId: string) =>
      api.del<void>(`/api/projects/${id}/members/${memberId}`),
  };
};

// Wallet API
export const useWalletApi = () => {
  const api = useApiService();

  return {
    getWallet: () =>
      api.get<ApiTypes.UserWalletDto>("/api/wallet"),

    getTransactions: (params?: {
      page?: number;
      pageSize?: number;
      type?: ApiTypes.TransactionType;
      status?: ApiTypes.TransactionStatus;
      fromDate?: string;
      toDate?: string;
    }) =>
      api.get<ApiTypes.WalletTransactionDtoPagedResult>("/api/wallet/transactions", params),

    requestWithdrawal: (data: ApiTypes.RequestWithdrawalDto) =>
      api.post<ApiTypes.WalletTransactionDto>("/api/wallet/withdraw", data),

    getTransaction: (id: string) =>
      api.get<ApiTypes.WalletTransactionDto>(`/api/wallet/transactions/${id}`),

    connectStripe: () =>
      api.post<ApiTypes.StripeConnectDto>("/api/wallet/stripe-connect"),

    completeKyc: (data: ApiTypes.CompleteKycDto) =>
      api.post<void>("/api/wallet/kyc-verify", data),
  };
};

// Files API
export const useFilesApi = () => {
  const api = useApiService();

  return {
    uploadFile: (file: File, description?: string, isPublic?: boolean) => {
      const formData = new FormData();
      formData.append("file", file);
      if (description) formData.append("description", description);
      if (isPublic !== undefined) formData.append("isPublic", String(isPublic));
      return api.post<ApiTypes.FileUploadDto>("/api/files/upload", formData);
    },

    getFile: (id: string) =>
      api.get<ApiTypes.FileUploadDto>(`/api/files/${id}`),

    deleteFile: (id: string) =>
      api.del<void>(`/api/files/${id}`),

    getFiles: (params?: {
      page?: number;
      pageSize?: number;
      fileType?: string;
    }) =>
      api.get<ApiTypes.FileUploadDtoPagedResult>("/api/files", params),

    downloadFile: (id: string) =>
      api.get<Blob>(`/api/files/${id}/download`),
  };
};

// Admin API
export const useAdminApi = () => {
  const api = useApiService();

  return {
    getStatistics: (params?: {
      fromDate?: string;
      toDate?: string;
    }) =>
      api.get<ApiTypes.AdminStatisticsDto>("/api/admin/statistics", params),

    getSurveys: (params?: {
      page?: number;
      pageSize?: number;
      status?: ApiTypes.SurveyStatus;
      creatorId?: string;
      searchTerm?: string;
    }) =>
      api.get<ApiTypes.AdminSurveyDtoPagedResult>("/api/admin/surveys", params),

    getUsers: (params?: {
      page?: number;
      pageSize?: number;
      role?: ApiTypes.UserRole;
      status?: ApiTypes.UserStatus;
      searchTerm?: string;
    }) =>
      api.get<ApiTypes.AdminUserDtoPagedResult>("/api/admin/users", params),

    getPaymentAnalytics: (params?: {
      fromDate?: string;
      toDate?: string;
    }) =>
      api.get<ApiTypes.AdminPaymentAnalyticsDto>("/api/admin/payments/analytics", params),

    approveWithdrawal: (id: string) =>
      api.post<void>(`/api/admin/withdrawals/${id}/approve`),

    rejectWithdrawal: (id: string, data: ApiTypes.RejectWithdrawalDto) =>
      api.post<void>(`/api/admin/withdrawals/${id}/reject`, data),
  };
};

// Combined API hook for convenience
export const useApi = () => {
  return {
    auth: useAuthApi(),
    surveys: useSurveysApi(),
    questions: useQuestionsApi(),
    responses: useResponsesApi(),
    analytics: useAnalyticsApi(),
    users: useUsersApi(),
    templates: useTemplatesApi(),
    payments: usePaymentsApi(),
    subscriptions: useSubscriptionsApi(),
    wallet: useWalletApi(),
    files: useFilesApi(),
    admin: useAdminApi(),
    projects: useProjectsApi(),
  };
};

