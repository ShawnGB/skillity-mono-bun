const SERVER_API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_API_URL = process.env.NEXT_PUBLIC_API_URL_CLIENT;

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Request failed: ${response.status}`);
  }
  return response.json();
}

const createUser = async (user: CreateUserDto): Promise<User> => {
  const response = await fetch(`${CLIENT_API_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
    cache: 'no-store',
  });

  return handleResponse<User>(response);
};

const getAllUsers = async (): Promise<User[]> => {
  const response = await fetch(`${SERVER_API_URL}/users`);

  return handleResponse<User[]>(response);
};

export { createUser, getAllUsers };
