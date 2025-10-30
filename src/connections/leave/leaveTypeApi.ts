import { instanceAxios } from '../axios';


export async function createLeaveType(orgId: string, payload: any) {
  const res = await instanceAxios.post('/leave-types', payload, { params: { org_id: orgId }});
  console.log('createLeaveType res', res.data);
  return res.data;
}
