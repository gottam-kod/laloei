import { createLeaveRequest } from "@/src/connections/leave/leaveApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export function useCreateLeave(key?: string) {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: (payload: any) => createLeaveRequest(payload),
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: [key] });
      },
    });
}