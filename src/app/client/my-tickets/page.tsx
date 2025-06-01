"use client"
import { useEffect, useState } from 'react';
import { getAllMyTickets } from '@/features/tickets/ticket.api';
import TicketsList from '@/features/tickets/components/TicketList';
import { ProtectedRoute } from '@/features/auth/login/components/ProtectedRoute';
import ErrorHandler from '@/shared/components/ErrorHandler';
import LoadingSpinner from '@/shared/components/LoadingSpinner';
import { Ticket } from '@/shared/types/ticket';

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await getAllMyTickets();
        setTickets(data);
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
          err?.message ||
          "Error al cargar tus tickets"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorHandler message={error} />;
  }

  return (
      <div>
        <TicketsList tickets={tickets} historic={false} />
      </div>
  );
}