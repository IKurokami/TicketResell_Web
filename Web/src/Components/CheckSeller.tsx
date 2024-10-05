import Cookies from "js-cookie";

export const CheckSeller = async (): Promise<boolean> => {
  const id = Cookies.get('id'); // Get the user ID from the cookie // Log the user ID
  console.log(id);
  
  if (!id) return false; 

  try {
    const response = await fetch(`http://localhost:5296/api/user/check/${id}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();

    if (result.statusCode === 200 && result.data === null) {
      return true; 
    } else {
      return false; 
    }
  } catch (error) {
    console.error("Error fetching seller status:", error);
    return false; 
  }
};
