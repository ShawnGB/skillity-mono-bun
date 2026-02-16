import Link from 'next/link';
import { getWorkshops } from '@/data/workshops';

export default async function WorkshopsListing() {
  const workshops = await getWorkshops();

  if (!workshops || workshops.length === 0) {
    return <p className="text-muted-foreground">No workshops available yet.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {workshops.map((workshop) => (
        <Link
          key={workshop.id}
          href={`/workshops/${workshop.id}`}
          className="group relative aspect-[3/2] overflow-hidden rounded-xl"
        >
          <img
            src={`https://picsum.photos/seed/${workshop.id}/400/300`}
            alt={workshop.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-5 text-white">
            <h3 className="font-serif text-4xl font-bold leading-[0.85] uppercase transition-transform duration-300 group-hover:-translate-y-12">
              {workshop.title}
            </h3>
            <p className="text-sm text-white/80 line-clamp-2 mt-2 translate-y-8 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              {workshop.description}
            </p>
            <span className="mt-2 text-sm text-white/70 translate-y-8 opacity-0 transition-all duration-300 delay-75 group-hover:translate-y-0 group-hover:opacity-100">
              See more &rarr;
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
