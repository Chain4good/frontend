export const CampaignStatus = {
  DRAFT: "DRAFT",
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  ACTIVE: "ACTIVE",
  FINISHED: "FINISHED",
  CANCELLED: "CANCELLED",
};

export const CampaignStatusLabel = {
  DRAFT: "Bản nháp", // Draft
  PENDING: "Chờ duyệt", // Pending approval
  APPROVED: "Đã duyệt", // Approved
  REJECTED: "Từ chối", // Rejected
  ACTIVE: "Đang hoạt động", // Active
  FINISHED: "Đã kết thúc", // Finished
  CANCELLED: "Đã hủy", // Cancelled
};

export const CampaignStatusColors = {
  DRAFT: "#9CA3AF", // Gray
  PENDING: "#F59E0B", // Amber
  APPROVED: "#10B981", // Green
  REJECTED: "#EF4444", // Red
  ACTIVE: "#3B82F6", // Blue
  FINISHED: "#6366F1", // Indigo
  CANCELLED: "#DC2626", // Red
};
