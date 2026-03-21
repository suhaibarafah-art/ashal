/**
 * /checkout → redirect to homepage (checkout is per-product at /checkout/[id])
 */
import { redirect } from 'next/navigation';

export default function CheckoutIndex() {
  redirect('/');
}
