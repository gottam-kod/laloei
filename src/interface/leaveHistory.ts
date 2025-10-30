
export type LeaveItem = {
    id: string;
    type: string;
    name_th?: string;
    name_en?: string;
    range: string;
    days: number;
    status: LeaveStatus;
    createdAt: string;
    createdAtISO: string;
    note?: string;
    typeCode?: string; 
};

export type LeaveStatus = 'APPROVED' | 'PENDING' | 'REJECTED' | 'CANCELLED' | 'ALL';