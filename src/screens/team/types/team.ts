export type PresenceState = 'online' | 'away' | 'offline';
export type WorkingLocation = 'onsite' | 'wfh';

export type TeamMemberLite = {
  id: string;
  name: string;
  role: string;
  dept: string;
  avatarUrl?: string;

  presence: { state: PresenceState; lastSeenAt?: string };
  working?: {
    location?: WorkingLocation;
    checkedInAt?: string | null;
    onLeaveToday?: { type: 'AL' | 'SL' | 'CL'; note?: string } | null;
  };

  phone?: string;
  email?: string;
  isManager?: boolean;
};

// ถ้าคุณยังใช้ชื่อ Member ที่อื่นอยู่ ให้ export alias ไว้ด้วย
export type Member = TeamMemberLite;

export const FILTERS = [
  { key: 'all', label: 'ทั้งหมด' },
  { key: 'myteam', label: 'ทีมของฉัน' },
  { key: 'online', label: 'ออนไลน์' },
  { key: 'onleave', label: 'ลาวันนี้' },
  { key: 'wfh', label: 'WFH' },
] as const;
export type FilterKey = typeof FILTERS[number]['key'];
