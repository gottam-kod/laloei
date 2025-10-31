// useGetInsights.ts
import { instanceAxios } from '@/src/connections/http';
import { ApiError } from '@/src/interface/auth/login.interface';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

type Insight = {
  title: string;
};

async function fetchInsights(lang: string, signal: AbortSignal, timeoutMs: number): Promise<string[]> {
  try {
    const res = await instanceAxios.get<Insight[]>(`/insight?lang=${lang}`, {
      signal,
      timeout: timeoutMs,
      headers: { 'Content-Type': 'application/json', accept: '*/*' },
    });

    const results = res.data.map(item => item.title);
    return results;
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status ?? 0;
      const data = err.response?.data;
      const message =
        (data as any)?.message ||
        (data as any)?.error ||
        (status === 401 ? 'Unauthorized' : err.message || 'Request failed');
      throw new ApiError(message, status, data);
    }
    if (err?.name === 'AbortError') throw err; // ถูกยกเลิก
    throw new ApiError('Network error', 0);
  }

}

export function useGetInsights(options?: { enabled?: boolean }) {
  const { i18n } = useTranslation();
  const lang = i18n.language.startsWith('th') ? 'th-TH' : 'en-US';

  return useQuery<string[]>({
    queryKey: ['insights', lang],
    queryFn: () => fetchInsights(lang, new AbortController().signal, 10000),
    enabled: options?.enabled ?? true,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}