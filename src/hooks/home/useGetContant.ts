import { instanceAxios } from "@/src/connections/http";
import { ApiError } from "@/src/interface/auth/login.interface";
import { Contant } from "@/src/interface/contant";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useTranslation } from "react-i18next";

async function fetchContents(contantType: string, lang: string, signal: AbortSignal, timeoutMs: number): Promise<Contant[]> {
  try {
    const res = await instanceAxios.get<Contant[]>(`/contents/${contantType}`, {
      signal,
      timeout: timeoutMs,
      headers: { 'Content-Type': 'application/json', accept: '*/*' },
    });

    const results = res.data.map(item => {
      item.title = lang.startsWith('th') ? item.title_th : item.title_en;
      item.description = lang.startsWith('th') ? item.description_th : item.description_en;
      item.content = lang.startsWith('th') ? item.content_th : item.content_en;
      return item;
    });
   console.log('fetchContents success', results);
    return results;
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status ?? 0;
      const data = err.response?.data;
      const message =
        (data as any)?.message ||
        (data as any)?.error ||
        (status === 401 ? 'Unauthorized' : err.message || 'Request failed');
      console.log('fetchContents error', message);
      throw new ApiError(message, status, data);
    }
    if (err?.name === 'AbortError') throw err; // ถูกยกเลิก
    throw new ApiError('Network error', 0);
  }
}


export function useGetPromo(options?: { enabled?: boolean }) {
  const { i18n } = useTranslation();
  const lang = i18n.language.startsWith('th') ? 'th-TH' : 'en-US';

  return useQuery<Contant[]>({
    queryKey: ['promo', lang],
    queryFn: () => fetchContents('promos', lang, new AbortController().signal, 10000),
    enabled: options?.enabled ?? true,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useGetArticles(options?: { enabled?: boolean }) {
  const { i18n } = useTranslation();
  const lang = i18n.language.startsWith('th') ? 'th-TH' : 'en-US';

  return useQuery<Contant[]>({
    queryKey: ['articles', lang],
    queryFn: () => fetchContents('articles', lang, new AbortController().signal, 10000),
    enabled: options?.enabled ?? true,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}