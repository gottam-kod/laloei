
import { approveLeaveRequest, fetchLeaveRequests, rejectLeaveRequest } from "@/src/connections/leave/leaveApi";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetLeaveApprovals(key?: string, p0?: { enabled: boolean; }) {
 return useQuery({
    queryKey: ['leave-approvals', key],
    queryFn: ({ signal }) => fetchLeaveRequests( { signal }),
    enabled: !!key,
    placeholderData: keepPreviousData
  });   
}

// ApproveLeaveRequestPayload
// PUT /leave-requests/:id/approve
type ApproveLeaveRequestPayload = {
  id: string;
  approve: boolean;
  reason?: string;
};

export function useLeaveApprove() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => payload.approve ? approveLeaveRequest(payload.id) : rejectLeaveRequest(payload.id),
    onSuccess: (data, variables, context) => {
      // หลังอนุมัติสำเร็จ ให้รีเฟรชข้อมูล
      queryClient.invalidateQueries({ queryKey: ['leave-approvals'] });
    },
    onError: (error, variables, context) => {
      console.error('Error approving leave:', error);
    },
  });
}