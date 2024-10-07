// models/TicketCardModel.ts

export interface TicketCard {
  name: string;
  price: string;
  id: string;
  date: string;
  imageUrl: string;
}

export const convertToTicketCards = (response: any[]): TicketCard[] => {
  return response.map((item) => ({
    name: item.name,
    price: item.cost.toString(), // Ensure price is a string
    id: item.ticketId,
    date: item.StartDate,
    imageUrl: "https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/categories/11655/5486517"
  }));
};
