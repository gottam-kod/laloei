import { fetchLeaveHistory } from "@/src/connections/leave/leaveHistoryApi";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetLeaveHistory(key?: string, p0?: { enabled: boolean; }) {
 return useQuery({
    queryKey: ['leave-history', key],
    queryFn: ({ signal }) => fetchLeaveHistory( { signal }),
    enabled: !!key,
    placeholderData: keepPreviousData
  });   
}

export function useRefreshLeaveHistory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['leave-history', 'refresh'],
    mutationFn: async () => {
      // ล้างแคชเดิม
      await queryClient.invalidateQueries({ queryKey: ['leave-history'] });
      // ดึงข้อมูลใหม่
      return queryClient.fetchQuery({
        queryKey: ['leave-history'],
        queryFn: ({ signal }) => fetchLeaveHistory( { signal }),
      });
    },
    onSuccess: (data) => {
      // อัปเดตแคชด้วยข้อมูลใหม่
      queryClient.setQueryData(['leave-history'], data);
    },
  });
}