import Image from 'next/image';

export function HeroSection({ bannerPhotoUrl, eventName }: { bannerPhotoUrl: string; eventName: string }) {
  return (
    <div className="relative h-96 w-full overflow-hidden bg-gray-800">
      <Image
        src={bannerPhotoUrl}
        alt={eventName}
        fill
        className="object-cover opacity-70"
        priority
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white text-center px-4">
          {eventName}
        </h1>
      </div>
    </div>
  );
}
