export const AuthV1 = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  GET_PROFILE: "/auth/profile",
  LOGOUT: "/auth/logout",
  VERIFY_EMAIL: "/auth/verify-email",
  RESEND_VERIFICATION_EMAIL: "/auth/resend-otp",
};

export const CategoryV1 = {
  GET_CATEGORIES: "/categories",
  GET_CATEGORY: "/categories",
  CREATE_CATEGORY: "/categories",
  UPDATE_CATEGORY: "/categories",
  DELETE_CATEGORY: "/categories",
};

export const CountryV1 = {
  GET_COUNTRIES: "/countries",
  GET_COUNTRY: "/countries",
  CREATE_COUNTRY: "/countries",
  UPDATE_COUNTRY: "/countries",
  DELETE_COUNTRY: "/countries",
};

export const FundraiseTypeV1 = {
  GET_FUNDRAISE_TYPES: "/fundraise-types",
  GET_FUNDRAISE_TYPE: "/fundraise-types",
  CREATE_FUNDRAISE_TYPE: "/fundraise-types",
  UPDATE_FUNDRAISE_TYPE: "/fundraise-types",
  DELETE_FUNDRAISE_TYPE: "/fundraise-types",
};

export const UploadV1 = {
  UPLOADS: "/uploads",
};
export const CoverV1 = {
  CREATE_COVER: "/covers",
};

export const CampaignV1 = {
  GET_CAMPAIGNS: "/campaigns",
  GET_CAMPAIGNS_VALID: "/campaigns/valid",
  GET_CAMPAIGN: "/campaigns",
  CREATE_CAMPAIGN: "/campaigns",
  UPDATE_CAMPAIGN: "/campaigns",
  DELETE_CAMPAIGN: "/campaigns",
  GET_MY_CAMPAIGNS: "/campaigns/my-campaigns",
  GET_CALCULATE_ETH_GOAL: "/campaigns/calculate-eth-goal",
  GET_CALCULATE_GOAL: "/campaigns/calculate-goal",
  CREATE_CAMPAIGN_PROGRESS: "/campaigns/",
  GET_CAMPAIGN_PROGRESS: "/campaigns/",
};

export const DonationV1 = {
  GET_DONATIONS: "/donations",
  GET_DONATION: "/donations",
  CREATE_DONATION: "/donations",
  UPDATE_DONATION: "/donations",
  DELETE_DONATION: "/donations",
};

export const CommentV1 = {
  GET_COMMENTS: "/comments",
  GET_COMMENT: "/comments",
  CREATE_COMMENT: "/comments",
  UPDATE_COMMENT: "/comments",
  DELETE_COMMENT: "/comments",
  GET_COMMENT_BY_CAMPAIGN: "/comments/campaign",
  LIKE_COMMENT: "/comments/",
};

export const UserV1 = {
  GET_USERS: "/users",
  GET_USER: "/users",
  CREATE_USER: "/users",
  UPDATE_USER: "/users",
  DELETE_USER: "/users",
};

export const AiV1 = {
  AI_ANALYZE_CAMPAIGN: "/ai/analyze-campaign-gemini",
  AI_OPTIMIZE_CAMPAIGN: "/ai/optimize-campaign",
  AI_RECOMMENDATIONS: "/ai/recommendations",
};

export const NotificationV1 = {
  GET_NOTIFICATIONS: "/notifications",
  GET_NOTIFICATION: "/notifications",
  CREATE_NOTIFICATION: "/notifications",
  UPDATE_NOTIFICATION: "/notifications",
  DELETE_NOTIFICATION: "/notifications",
  READ_NOTIFICATION: "/notifications",
  MARK_ALL_AS_READ: "/notifications/mark-all-read",
  UNREAD_COUNT: "/notifications/unread-count",
};

export const TopicV1 = {
  GET_TOPICS: "/topics",
  GET_TOPIC: "/topics",
  CREATE_TOPIC: "/topics",
  UPDATE_TOPIC: "/topics",
  DELETE_TOPIC: "/topics",
};

export const PostV1 = {
  GET_POSTS: "/posts",
  GET_POST: "/posts",
  CREATE_POST: "/posts",
  UPDATE_POST: "/posts",
  DELETE_POST: "/posts",
  GET_POST_BY_SLUG: "/posts/slug",
};

export const ReportV1 = {
  GET_REPORTS: "/reports",
  GET_REPORT: "/reports",
  CREATE_REPORT: "/reports",
};
