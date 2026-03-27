export const PROFILE_DOWNLOAD_AREAS = ["victor", "admin", "colab", "manager"] as const;

export const PROFILE_VIEW_AREAS = ["institution", "manager", "victor", "colab", "admin"] as const;

export const canDownloadProfessionalProfile = (area?: string | null) => {
  return PROFILE_DOWNLOAD_AREAS.includes(area as (typeof PROFILE_DOWNLOAD_AREAS)[number]);
};

export const canViewProfessionalProfileById = (
  area?: string | null,
  requestedUserId?: string | null,
  sessionUserId?: string | null,
) => {
  if (area === "profesional") {
    return Boolean(requestedUserId) && requestedUserId === sessionUserId;
  }

  return PROFILE_VIEW_AREAS.includes(area as (typeof PROFILE_VIEW_AREAS)[number]);
};