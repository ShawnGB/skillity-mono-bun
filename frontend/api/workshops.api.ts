const SERVER_API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_API_URL = process.env.NEXT_PUBLIC_API_URL_CLIENT;

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Request failed: ${response.status}`);
  }
  return response.json();
}

const getAllWorkshops = async (): Promise<Workshop[]> => {
  const response = await fetch(`${SERVER_API_URL}/workshops`);
  return handleResponse<Workshop[]>(response);
};

const getWorkshop = async (id: string): Promise<Workshop> => {
  const response = await fetch(`${SERVER_API_URL}/workshops/${id}`);
  return handleResponse<Workshop>(response);
};

const createWorkshop = async (
  workshop: Omit<Workshop, 'id' | 'host' | 'participants'>,
): Promise<Workshop> => {
  const response = await fetch(`${CLIENT_API_URL}/workshops`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(workshop),
    cache: 'no-store',
  });
  return handleResponse<Workshop>(response);
};

const updateWorkshop = async (
  id: string,
  workshop: Partial<Workshop>,
): Promise<Workshop> => {
  const response = await fetch(`${CLIENT_API_URL}/workshops/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(workshop),
    cache: 'no-store',
  });
  return handleResponse<Workshop>(response);
};

export { getAllWorkshops, getWorkshop, createWorkshop, updateWorkshop };
