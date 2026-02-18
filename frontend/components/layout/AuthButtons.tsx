import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';

export default function AuthButtons() {
  return (
    <>
      <Link href="/login" className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
        Log in
      </Link>
      <Link href="/register" className={buttonVariants({ size: 'sm' })}>
        Sign up
      </Link>
    </>
  );
}
