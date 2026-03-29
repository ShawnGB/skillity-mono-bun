export const API_URL = process.env.API_URL ?? 'http://localhost:3000';

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type RequestSource = Request | string;

function getAuthHeaders(source?: RequestSource): HeadersInit {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (source) {
    const cookie =
      typeof source === 'string' ? source : source.headers.get('cookie');
    if (cookie) headers['cookie'] = cookie;
  }
  return headers;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    try {
      const json = JSON.parse(text);
      const msg = Array.isArray(json.message)
        ? json.message.join(', ')
        : json.message || json.error || `Request failed: ${res.status}`;
      throw new ApiError(msg, res.status);
    } catch (e) {
      if (e instanceof SyntaxError)
        throw new ApiError(
          text || `Request failed: ${res.status}`,
          res.status,
        );
      throw e;
    }
  }
  const text = await res.text();
  return text ? (JSON.parse(text) as T) : (undefined as T);
}

export async function serverGet<T>(
  endpoint: string,
  source?: RequestSource,
): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: getAuthHeaders(source),
  });
  return handleResponse<T>(res);
}

export async function serverPost<T>(
  endpoint: string,
  body: unknown,
  source?: RequestSource,
): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers: getAuthHeaders(source),
    body: JSON.stringify(body),
  });
  return handleResponse<T>(res);
}

export async function serverPatch<T>(
  endpoint: string,
  body: unknown,
  source?: RequestSource,
): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: 'PATCH',
    headers: getAuthHeaders(source),
    body: JSON.stringify(body),
  });
  return handleResponse<T>(res);
}

export async function serverUpload<T>(
  endpoint: string,
  body: FormData,
  source?: RequestSource,
): Promise<T> {
  const headers: HeadersInit = {};
  if (source) {
    const cookie =
      typeof source === 'string' ? source : source.headers.get('cookie');
    if (cookie) headers['cookie'] = cookie;
  }
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers,
    body,
  });
  return handleResponse<T>(res);
}

export async function serverDelete<T>(
  endpoint: string,
  source?: RequestSource,
): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: 'DELETE',
    headers: getAuthHeaders(source),
  });
  return handleResponse<T>(res);
}
