import { LeaveItem } from "@/src/interface/leaveHistory";
import { instanceAxios } from '@/src/connections/http';



export async function fetchLeaveHistory({ signal }: { signal: AbortSignal }): Promise<LeaveItem[]> {
    const res = await instanceAxios.get<LeaveItem[]>('/leave-requests', {
        signal,
        headers: { 'Content-Type': 'application/json', accept: '*/*' },
    });
    return res.data;
}