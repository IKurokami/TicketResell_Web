import { fetchImage } from "./FetchImage";

const baseUrl = "http://localhost:5296";

export interface Category {
  categoryId: string;
  name: string;
  description: string;
}

export interface Ticket {
  ticketId: string;
  sellerId: string;
  name: string;
  cost: number;
  location: string;
  startDate: string;
  createDate: string;
  modifyDate: string;
  status: number;
  seller: null | any;
  image: string;
  categories: Category[];
  imageUrl?: string;
}

const DEFAULT_IMAGE =
  "https://media.stubhubstatic.com/stubhub-v2-catalog/d_defaultLogo.jpg/q_auto:low,f_auto/categories/11655/5486517";

// Helper function to convert API response to Ticket format
const convertToTickets = async (response: any[]): Promise<Ticket[]> => {
  const tickets = await Promise.all(
    response.map(async (item) => {
      let image = DEFAULT_IMAGE;

      if (item.ticketId) {
        const { imageUrl: fetchedImageUrl, error } = await fetchImage(
          item.ticketId
        );

        if (fetchedImageUrl) {
          image = fetchedImageUrl;
        } else {
          console.error(
            `Error fetching image for ticket ${item.ticketId}: ${error}`
          );
        }
      }

      console.log(image);

      return {
        ...item,
        imageUrl: image,
      };
    })
  );
  return tickets;
};

export const fetchTickets = async (): Promise<Ticket[]> => {
  try {
    const response = await fetch(`${baseUrl}/api/Ticket/read`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Ticket fetch: ", data.data);
    const tickets = await convertToTickets(data.data);
    return tickets;
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return [];
  }
};

export const getCategoryNames = (ticket: Ticket): string => {
  return ticket.categories.map((category) => category.name).join(", ");
};
