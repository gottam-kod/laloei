import { instanceAxios } from '@/src/connections/http';
import { LeaveSummary } from "@/src/interface/home/leave-summary";
import { useAuthStore } from "@/src/store/useAuthStore";
import { useQuery } from "@tanstack/react-query";

async function fetchLeaveSummary(userId?: string, signal?: AbortSignal, timeoutMs?: number): Promise<LeaveSummary> {
    const res = await instanceAxios.get<LeaveSummary>(`/leave-policies/user/${userId}`, {
      signal,
      timeout: timeoutMs,
      headers: { 'Content-Type': 'application/json', accept: '*/*' },
    });
    return res.data;
}


export function useGetLeaveSummary(options?: { enabled?: boolean }) {
  const userId = useAuthStore((state) => state.profile?.id);
  return useQuery<LeaveSummary>({
    queryKey: ['leaveSummary', userId],
    queryFn: () => fetchLeaveSummary(userId, new AbortController().signal, 10000),
    enabled: options?.enabled ?? true,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
