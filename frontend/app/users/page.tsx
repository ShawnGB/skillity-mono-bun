import { getUsers } from '@/data/users';
import { redirect } from 'next/navigation';
import type { User } from '@skillity/shared';

export default async function UsersPage() {
  let users: User[];

  try {
    users = await getUsers();
  } catch {
    redirect('/');
  }

  return (
    <ul>
      {users.map((user, index) => (
        <li key={user.id || index}>
          <h3>{`${user.firstName} ${user.lastName}`}</h3>
          <p>{user.email}</p>
        </li>
      ))}
    </ul>
  );
}
