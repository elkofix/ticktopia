import { notFound } from 'next/navigation';
import { getAllMyTickets, getAllMyTicketsHistoric } from '@/features/tickets/ticket.api';
import TicketsList from '@/features/tickets/components/TicketList';
import { ProtectedRoute } from '@/features/auth/login/components/ProtectedRoute';
import ErrorHandler from '@/shared/components/ErrorHandler';

export default async function Page() {
  try {
    const tickets = await getAllMyTicketsHistoric();
    return (
      <ProtectedRoute requiredRoles={["client"]}>
        <div>
          <TicketsList tickets={tickets} historic={true} />
        </div>
      </ProtectedRoute>
    );
  } catch (error: any) {
    return (
      <ErrorHandler message={error.response.data.message} />
    );
  }
}