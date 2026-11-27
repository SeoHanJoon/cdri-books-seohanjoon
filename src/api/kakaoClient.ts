export class KakaoApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'KakaoApiError';
    this.status = status;
  }
}

// 카카오 에러 응답은 { errorType, message } 형식이다. 형식이 다르면 상태 코드만 남긴다.
async function readErrorMessage(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { message?: unknown };
    if (typeof body.message === 'string') return body.message;
  } catch {
    // 본문이 JSON이 아니면 아래 기본 문구를 쓴다.
  }
  return `카카오 API 요청 실패 (${response.status})`;
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
