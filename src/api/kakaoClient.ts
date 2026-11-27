export class KakaoApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'KakaoApiError';
    this.status = status;
  }
}

// 카카오 에러 응답은 { errorType, message } 형식이다.
async function readErrorMessage(response: Response): Promise<string> {
  const body = (await response.json().catch(() => null)) as { message?: unknown } | null;
  return typeof body?.message === 'string'
    ? body.message
    : `카카오 API 요청 실패 (${response.status})`;
}

export async function kakaoGet<T>(
  url: string,
  params: URLSearchParams,
  signal?: AbortSignal,
): Promise<T> {
  const response = await fetch(`${url}?${params}`, {
    headers: { Authorization: `KakaoAK ${import.meta.env.VITE_KAKAO_REST_API_KEY}` },
    signal,
  });
  if (!response.ok) throw new KakaoApiError(response.status, await readErrorMessage(response));
  return (await response.json()) as T;
}
