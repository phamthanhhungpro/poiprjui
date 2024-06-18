export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    status?: string;
    fullName: string;
    address: string;
    phone: string;
    isActive: boolean;
    tenant: any;
    group: any;
    role: any;
    apps: any[];
}
