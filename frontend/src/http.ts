import axios, { type AxiosInstance, type AxiosResponse } from 'axios';

const {
  VITE_API_BASE,
  VITE_URL_SEND_ADDRESS,
  VITE_QR_SEND_ADDRESS,
  VITE_QR_ADD_REVIEWS,
} = import.meta.env;

export const API_BASE: string = VITE_API_BASE ?? 'http://localhost:3001';

export function getUserId(): string {
  return localStorage.getItem('auth_user_id') ?? '';
}

export function authHeaders(extra?: Record<string, string>): Record<string, string> {
  const uid = getUserId();
  return {
    Accept: 'application/json',
    ...(uid ? { 'X-User-Id': uid } : {}),
    ...(extra ?? {}),
  };
}

export function toForm(data: Record<string, unknown>): URLSearchParams {
  const f = new URLSearchParams();
  for (const [k, v] of Object.entries(data)) {
    if (v === undefined || v === null) continue;
    f.append(k, String(v));
  }
  return f;
}

export async function toBase64(input: string | Blob): Promise<string> {
  if (typeof input === 'string') return input;
  const asDataUrl = (blob: Blob) =>
    new Promise<string>((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = () => resolve(String(fr.result));
      fr.onerror = reject;
      fr.readAsDataURL(blob);
    });
  return asDataUrl(input);
}

export const http: AxiosInstance = axios.create({
  baseURL: API_BASE,
  headers: { Accept: 'application/json' },
});

// ===== твои утилиты с form-urlencoded =====
export async function postUrl<T = any>(
  url: string,
  onOk: (response: AxiosResponse<T>, url: string) => void,
  onError: (error: unknown, url: string) => void
): Promise<void> {
  if (!VITE_URL_SEND_ADDRESS) throw new Error('VITE_URL_SEND_ADDRESS is not set');
  try {
    const res = await axios.post<T>(
      VITE_URL_SEND_ADDRESS,
      toForm({ url }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    onOk(res, url);
  } catch (e) { onError(e, url); }
}

export async function postQR<T = any>(
  file: File | Blob | string,
  onOk: (response: AxiosResponse<T>, file: File | Blob | string) => void,
  onError: (error: unknown, file: File | Blob | string) => void
): Promise<void> {
  if (!VITE_QR_SEND_ADDRESS) throw new Error('VITE_QR_SEND_ADDRESS is not set');
  try {
    const image = await toBase64(file);
    const res = await axios.post<T>(
      VITE_QR_SEND_ADDRESS,
      toForm({ image }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    onOk(res, file);
  } catch (e) { onError(e, file); }
}

export async function postReview<T = any>(
  url: string,
  email: string,
  msg: string,
  onOk: (response: AxiosResponse<T>, url: string) => void,
  onError: (error: unknown, url: string) => void
): Promise<void> {
  if (!VITE_QR_ADD_REVIEWS) throw new Error('VITE_QR_ADD_REVIEWS is not set');
  try {
    const res = await axios.post<T>(
      VITE_QR_ADD_REVIEWS,
      toForm({ url, email, review: msg }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    onOk(res, url);
  } catch (e) { onError(e, url); }
}