import { getAllUsers } from '@/api/users.api';
import { notFound } from 'next/navigation';

export default async function UsersPage() {
  const users = await getAllUsers();

  if (!users) notFound();

  return (
    <ul>
      {users.map((user: User, index: number) => (
        <li key={index}>
          <h3>{`${user.firstName} ${user.lastName}`}</h3>
          <p>{user.email}</p>
        </li>
      ))}
    </ul>
  );
}
