export type LeaveType = {
  id: string;
  org_id: string;
  code: string;
  name_th: string;
  name_en: string;
  unit: string;
  allow_half_day: boolean;
  is_paid: boolean;
  is_active: boolean;
};

export type HalfDay = 'FULL' | 'AM' | 'PM';