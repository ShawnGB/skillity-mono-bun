const API_URL = process.env.API_URL ?? "http://localhost:3000";

function getAuthHeaders(request?: Request): HeadersInit {
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (request) {
    const cookie = request.headers.get("cookie");
    if (cookie) headers["cookie"] = cookie;
  }
  return headers;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    try {
      const json = JSON.parse(text);
      const msg = Array.isArray(json.message)
        ? json.message.join(", ")
        : json.message || json.error || `Request failed: ${res.status}`;
      throw new Error(msg);
    } catch (e) {
      if (e instanceof SyntaxError) throw new Error(text || `Request failed: ${res.status}`);
      throw e;
    }
  }
  const text = await res.text();
  return text ? (JSON.parse(text) as T) : (undefined as T);
}

export async function serverGet<T>(endpoint: string, request?: Request): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: getAuthHeaders(request),
  });
  return handleResponse<T>(res);
}

export async function serverPost<T>(
  endpoint: string,
  body: unknown,
  request?: Request
): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: "POST",
    headers: getAuthHeaders(request),
    body: JSON.stringify(body),
  });
  return handleResponse<T>(res);
}

export async function serverPatch<T>(
  endpoint: string,
  body: unknown,
  request?: Request
): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: "PATCH",
    headers: getAuthHeaders(request),
    body: JSON.stringify(body),
  });
  return handleResponse<T>(res);
}

export async function serverDelete<T>(endpoint: string, request?: Request): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: "DELETE",
    headers: getAuthHeaders(request),
  });
  return handleResponse<T>(res);
}
