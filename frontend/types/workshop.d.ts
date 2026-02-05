interface Workshop {
  id: string;
  title: string;
  description: string;
  maxParticipants: number;
  ticketPrice: number;
  currency: string;
  location: string;
  host: User;
  participants: User[];
}
