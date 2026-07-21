export const USER_ROLES = {
    USER: 'user',
    ADMIN: 'admin'
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

export const ALL_USER_ROLES = Object.values(USER_ROLES);

export const USER_ROLES_LABELS: Record<UserRole, string> = {
    user: 'User',
    admin: 'Admin',
};
