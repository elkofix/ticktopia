import { ProtectedRoute } from '@/features/auth/login/components/ProtectedRoute';
import QRTicketScanner from '@/features/tickets/components/QRTicketScanner';
import ErrorHandler from '@/shared/components/ErrorHandler';
import { notFound } from 'next/navigation';

export default async function Page() {
  try {
    return (
      <ProtectedRoute requiredRoles={["ticketChecker"]}>
        <QRTicketScanner />
      </ProtectedRoute>
    );
  } catch (error: any) {
        return (
          <ErrorHandler message={error.response.data.message} />
        );
  }
}