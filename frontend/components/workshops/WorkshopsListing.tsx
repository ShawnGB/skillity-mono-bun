import { getAllWorkshops } from '@/api/workshops.api';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default async function WorkshopsListing() {
  const workshops = await getAllWorkshops();

  if (!workshops || workshops.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Workshops</h1>
        <p className="text-muted-foreground">No workshops available yet.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Workshops</h1>
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
    </div>
  );
}
