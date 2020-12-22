export const HEADER_TENANT_ID = 'X-Navify-Tenant';

export function getTenantFromHost(): string {
    const { hostname } = window.location;
    const [tenantId] = hostname.split('.');
    return tenantId;
}