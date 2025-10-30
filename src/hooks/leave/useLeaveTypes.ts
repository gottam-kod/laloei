// hooks/useLeaveTypes.ts
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchLeaveTypes } from '../../connections/master/masterApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createLeaveType } from '@/src/connections/leave/leaveTypeApi';


export function useLeaveTypes(key?: string) {
  return useQuery({
    queryKey: ['leave-types', key],
    queryFn: ({ signal }) => fetchLeaveTypes( { signal }),
    enabled: !!key,                 // ยังไม่ยิงถ้าไม่มี orgId
    placeholderData: keepPreviousData // เวลา orgId เปลี่ยน ค้างค่าก่อนหน้าไว้ชั่วคราว
  });
}

export function useCreateLeaveType(orgId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => createLeaveType(orgId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['leave-types', orgId] });
    },
  });
}
