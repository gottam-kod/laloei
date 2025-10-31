import { LeaveStatus } from "./leaveHistory";

export type LeaveRequest = {
    id: string;
    name_en: string;
    name_th: string;
    employeeName: string;
    team?: string;
    type?: string;
    days: number;
    isMine: boolean;
    range: string; 
    status: LeaveStatus;
    createdAt: string; // formatted date
    createdAtISO: string; // ISO date
    note?: string;
    typeCode: string;
};

export type LeaveApproval = {
  id: string;
  employeeName: string;
  team?: string;
  type: 'ลาพักร้อน' | 'ลาป่วย' | 'ลากิจ' | string;
  dateFrom: string; // ISO
  dateTo: string;   // ISO
  days: number;
  range: string; // formatted date range
  reason?: string;
  requestedAt: string; // ISO
  status: LeaveStatus;
};


export type CreateLeaveRequestPayload = {
    leave_type_id: string;
    start_date: string;
    end_date: string;
    reason?: string;
    halfDay?: 'FULL' | 'AM' | 'PM';
};

export type CreateLeaveRequestResponse = {
    id: string;
    status: string;
};

