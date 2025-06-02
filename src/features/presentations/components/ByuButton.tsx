'use client';
import { useRouter } from 'next/navigation';

interface BuyButtonProps {
  href: string;
}

export function BuyButton({ href }: BuyButtonProps) {
  const router = useRouter();

  return (
    <button
      data-testid="buy-button"
      onClick={() => router.push(href)}
      className="bg-violet hover:bg-brand text-white py-4 px-12 text-lg font-bold rounded-full transition-colors duration-300 shadow-lg"
    >
      COMPRAR BOLETOS
    </button>
  );
}
