export type LeaveItem = {
    id: string;
    name: string;
    type: string;
    date: string;
    status: 'Pending' | 'Approved' | 'Rejected';
};