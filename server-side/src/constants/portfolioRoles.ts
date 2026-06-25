export const PORTFOLIO_ROLES = {
    AGENT: 'agent',
    ENGINEER: 'engineer',
    CONTRACTOR: 'contractor',
    ARCHITECT: 'architect',
    INTERIOR_DESIGNER: 'interior_designer'    
} as const;

export type PortfolioRole = typeof PORTFOLIO_ROLES[keyof typeof PORTFOLIO_ROLES];

export const ALL_Portfolio_ROLES = Object.values(PORTFOLIO_ROLES);

export const PORTFOLIO_ROLES_LABELS: Record<PortfolioRole, string> = {
    agent: 'Real Estate Agent',
    engineer: 'Engineer',
    contractor: 'Contractor',
    architect: 'Architect',
    interior_designer: 'Interior Designer',
};
