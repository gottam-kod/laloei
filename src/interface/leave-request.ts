//     {
//   "leave_type_id": "6f7a2a1d-3c5c-42c5-a3a7-8d1a7f1b1234",
//   "start_date": "2025-10-07",
//   "end_date": "2025-10-09",
//   "reason": "ไปธุระต่างจังหวัด"
// }

import { LeaveStatus } from "./leaveHistory";

// [
//   {
//     "id": "e9c853fc-5f97-43bb-99d1-eee820eb2399",
//     "name_en": "Break",
//     "name_th": "ลาพักร้อน",
//     "employeeName": "โชติกา ผลาโชติ",
//     "isMine": true,
//     "range": "30 – 31 ต.ค. 2568",
//     "days": 2,
//     "status": "PENDING",
//     "createdAt": "15 ต.ค. 2568",
//     "createdAtISO": "2025-10-15T10:52:12.042Z",
//     "note": "พาเมียน้อยไปดาวอังคาร",
//     "typeCode": "BR"
//   },
//   {
//     "id": "fde5e88b-d9b8-4ed1-a0a2-89aca2c72de0",
//     "name_en": "Personal Leave",
//     "name_th": "ลากิจ",
//     "employeeName": "โชติกา ผลาโชติ",
//     "isMine": true,
//     "range": "15 ต.ค. 2568",
//     "days": 1,
//     "status": "PENDING",
//     "createdAt": "15 ต.ค. 2568",
//     "createdAtISO": "2025-10-15T03:03:40.137Z",
//     "note": null,
//     "typeCode": "CL"
//   }
// ]

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

