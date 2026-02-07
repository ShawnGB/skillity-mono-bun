import { getWorkshops } from '@/data/workshops';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default async function WorkshopsListing() {
  const workshops = await getWorkshops();

  if (!workshops || workshops.length === 0) {
    return <p className="text-muted-foreground">No workshops available yet.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {workshops.map((workshop) => (
        <Card key={workshop.id}>
          <CardHeader>
            <CardTitle>{workshop.title}</CardTitle>
            <CardDescription>{workshop.location}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {workshop.description}
            </p>
            <div className="flex justify-between text-sm">
              <span>Max: {workshop.maxParticipants} participants</span>
              <span className="font-semibold">
                {workshop.ticketPrice > 0
                  ? `${workshop.ticketPrice} ${workshop.currency}`
                  : 'Free'}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
