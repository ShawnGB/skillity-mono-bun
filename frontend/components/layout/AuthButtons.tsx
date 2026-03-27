import { Link } from 'react-router';
import { buttonVariants } from '@/components/ui/button';

export default function AuthButtons() {
  return (
    <>
      <Link
        to="/login"
        className={buttonVariants({ variant: 'ghost', size: 'sm' })}
      >
        Log in
      </Link>
      <Link to="/register" className={buttonVariants({ size: 'sm' })}>
        Sign up
      </Link>
    </>
  );
}
