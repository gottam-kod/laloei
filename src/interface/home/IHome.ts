/* ============ Types ============ */
type QA = { key:string; icon:string; label:string; badge:number };
type News = { title:string; date:string };
type Balance = { label:string; used:number; total:number; grad?:[string,string] };
type Upcoming = { title:string; date:string; days:string; type:'VAC'|'SICK'|'OTHER' };

export interface IHome {
  userName?: string;
  userRole?: string;
  avatar?: any;  // Image source
  dateLabel?: string;
  pendingCount?: number;  // For badge on Quick Actions
  qa?: QA[];              // Quick Actions
  news?: News[];          // HR News
  balances?: Balance[];   // Leave Balances
  upcoming?: Upcoming[];  // Upcoming leaves
  variant?: 'modern' | 'premium'; // Layout variant

  onRequestLeave?: ()=>void; 
  onTapQA?: (key:string)=>void;
  onSeeAllNews?: ()=>void; 
  onSeeAllUpcoming?: ()=>void;
}