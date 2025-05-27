import { ProtectedRoute } from '@/features/auth/login/components/ProtectedRoute';
import QRTicketScanner from '@/features/tickets/components/QRTicketScanner';
import { notFound } from 'next/navigation';

export default async function Page() {
  try {
    return (
      <ProtectedRoute requiredRoles={["ticketChecker"]}>
        <QRTicketScanner />
      </ProtectedRoute>
    );
  } catch (error) {
    console.log(error);
    notFound();
  }
}