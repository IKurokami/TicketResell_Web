// import React from "react";
// import "../Css/TicketDetail.css";
// import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
// // Thêm file CSS cho styling nếu cần

// const TicketDetail = () => {
//   return (
//     <div>
//       <main className="container">
//         <div className="row ticket--detail">
//           <div className=" col-12 col-lg-4 ticket--intro">
//             <img
//               className="rounded ticket--img"
//               style={{ width: "100%" }}
//               src="https://th.bing.com/th/id/OIP.dAeG-S5NsD8SSUdIXukSlgHaHd?w=197&h=197&c=7&r=0&o=5&dpr=1.1&pid=1.7"
//               alt="Ticket Image"
//             />
//             <div className="row ticket--img--list">
//               <div className="col-12 col-lg-3 ticket--img--item">
//                 <img
//                   src="https://th.bing.com/th/id/OIP.dAeG-S5NsD8SSUdIXukSlgHaHd?w=197&h=197&c=7&r=0&o=5&dpr=1.1&pid=1.7"
//                   className=" ticket--img "
//                   style={{ width: "100%" }}
//                   alt="Ticket Image"
//                 />
//               </div>
//               <div className="col-12 col-lg-3 ticket--img--item">
//                 <img
//                   src="https://th.bing.com/th/id/OIP.dAeG-S5NsD8SSUdIXukSlgHaHd?w=197&h=197&c=7&r=0&o=5&dpr=1.1&pid=1.7"
//                   className=" ticket--img  "
//                   style={{ width: "100%" }}
//                   alt="Ticket Image"
//                 />
//               </div>
//               <div className="col-12 col-lg-3 ticket--img--item">
//                 <img
//                   src="https://th.bing.com/th/id/OIP.dAeG-S5NsD8SSUdIXukSlgHaHd?w=197&h=197&c=7&r=0&o=5&dpr=1.1&pid=1.7"
//                   className=" ticket--img "
//                   style={{ width: "100%" }}
//                   alt="Ticket Image"
//                 />
//               </div>
//               <div className="col-12 col-lg-3 ticket--img--item">
//                 <img
//                   src="https://th.bing.com/th/id/OIP.dAeG-S5NsD8SSUdIXukSlgHaHd?w=197&h=197&c=7&r=0&o=5&dpr=1.1&pid=1.7"
//                   className=" ticket--img "
//                   style={{ width: "100%" }}
//                   alt="Ticket Image"
//                 />
//               </div>
//             </div>
//           </div>
//           <div className="ticket--info col-12 col-lg-7">
//             <h2 className="ticket--name">Gratian</h2>
//             <p className="ticket--seller">
//               Sold by
//               <a href="#!" className="link-underline-light">
//                 {" "}
//                 Giap Cao Dinh
//               </a>
//             </p>
//             <p>Sold: 999</p>
//             <div className="tag--list row">
//               <div className="">Giap</div>
//               <div className="">Khang</div>
//             </div>
//             <div className="ticket--price">
//               <p className="display-3">
//                 <strong>100.000 VND</strong>
//               </p>
//               <button type="button" className="btn btn-primary ticket--btn">
//                 Thêm giỏ hàng
//               </button>
//               {/* <button type="button" className="btn btn-primary ticket--btn">
//                 Mua ngay
//               </button> */}
//             </div>
//           </div>
//         </div>
//         <div className="row justify-content-center ticket--desc">
//           <div className="desc--list ">
//             <a className="desc--item" href="#">
//               Cras justo odio
//             </a>
//             <a className="desc--item" href="#">
//               Dapibus ac facilisis in
//             </a>
//             <a className="desc--item" href="#">
//               Morbi leo risus
//             </a>
//           </div>
//           <div className="col-8">
//             Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quo
//             corporis, ad veritatis fugit quos debitis neque nemo quasi eveniet
//             tenetur in doloribus culpa deserunt quibusdam repellat ipsam nulla
//             atque eos exercitationem at eaque dignissimos ipsa? Debitis
//             molestias, labore nobis perspiciatis modi explicabo officiis
//             doloribus quis laudantium vero dignissimos corporis esse?
//           </div>
//         </div>
//         <div className="ticket--related">
//           <h2 className="ticket--title row justify-content-center">
//             Related Tickets
//           </h2>
//           <div className="ticket--list row">
//             <div className="card col-12 col-lg-3">
//               <img
//                 src="https://th.bing.com/th/id/OIP.dAeG-S5NsD8SSUdIXukSlgHaHd?w=197&h=197&c=7&r=0&o=5&dpr=1.1&pid=1.7"
//                 className="card-img-top ticket--img"
//                 alt="..."
//               />
//               <div className="card-body">
//                 <h5 className="card-title">Card title</h5>
//                 <p className="card-text">
//                   <strong>100.000 VND</strong>
//                 </p>
//                 <a href="#" className="ticket-btn btn btn-primary">
//                   Add to cart
//                 </a>
//               </div>
//             </div>
//             <div className="card col-12 col-lg-3">
//               <img
//                 src="https://th.bing.com/th/id/OIP.dAeG-S5NsD8SSUdIXukSlgHaHd?w=197&h=197&c=7&r=0&o=5&dpr=1.1&pid=1.7"
//                 className="card-img-top ticket--img"
//                 alt="..."
//               />
//               <div className="card-body">
//                 <h5 className="card-title">Card title</h5>
//                 <p className="card-text">
//                   <strong>100.000 VND</strong>
//                 </p>
//                 <a href="#" className=" btn btn-primary">
//                   Add to cart
//                 </a>
//               </div>
//             </div>
//             <div className="card col-12 col-lg-3">
//               <img
//                 src="https://th.bing.com/th/id/OIP.dAeG-S5NsD8SSUdIXukSlgHaHd?w=197&h=197&c=7&r=0&o=5&dpr=1.1&pid=1.7"
//                 className="card-img-top ticket--img"
//                 alt="..."
//               />
//               <div className="card-body">
//                 <h5 className="card-title">Card title</h5>
//                 <p className="card-text">
//                   <strong>100.000 VND</strong>
//                 </p>
//                 <a href="#" className="ticket-btn btn btn-primary">
//                   Add to cart
//                 </a>
//               </div>
//             </div>
//             <div className="card col-lg-3">
//               <img
//                 src="https://th.bing.com/th/id/OIP.dAeG-S5NsD8SSUdIXukSlgHaHd?w=197&h=197&c=7&r=0&o=5&dpr=1.1&pid=1.7"
//                 className="card-img-top ticket--img"
//                 alt="..."
//               />
//               <div className="card-body">
//                 <h5 className="card-title">Card title</h5>
//                 <p className="card-text">
//                   <strong>100.000 VND</strong>
//                 </p>
//                 <a href="#" className="ticket-btn btn btn-primary">
//                   Add to cart
//                 </a>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default TicketDetail;
"use client";
import "../Css/TicketDetail.css";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";

// Define the Ticket interface
type Ticket = {
  name: string;
  cost: number;
  location: string;
  startDate: string;
  author: string;
  imageUrl: string;
};

const TicketDetail = () => {
  const [ticketresult, setTicketresult] = useState<Ticket | null>(null);
  const { id } = useParams(); // Get the ID from the URL parameters

  // Function to fetch ticket by ID
  const fetchTicketById = async (id: string | string[]) => {
    try {
      const response = await fetch(
        `http://localhost:5296/api/Ticket/readbyid/${id}`,
        {
          method: "GET",
        }
      );
      return await response.json(); // Parse and return JSON result
    } catch (error) {
      console.error("Error fetching ticket result:", error);
      return null; // Return null in case of error
    }
  };

  useEffect(() => {
    const loadresult = async () => {
      console.log("Fetched ID:", id); // Log the ID to check if it's defined
      if (id) {
        // Ensure id is defined
        const result = await fetchTicketById(id); // Use id directly
        console.log(result);

        if (result) {
          const ticketDetail: Ticket = {
            imageUrl: result.data.image,
            name: result.data.name,
            startDate: new Date(result.data.startDate).toLocaleDateString(),
            author:
              result.data.seller && result.data.seller.username
                ? result.data.seller.username
                : "Unknown Seller",
            location: `Event at ${result.data.location}`,
            cost: result.data.cost,
          };
          setTicketresult(ticketDetail); // Set the fetched ticket result
          console.log(ticketresult?.author);
        }
      } else {
        console.error("ID is undefined or invalid.");
      }
    };

    loadresult(); // Call the loadresult function
  }, [id]);

  // Render loading or ticket details
  if (!ticketresult) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <main className="container">
        <div className="row ticket--detail">
          <div className="col-12 col-lg-4 ticket--intro">
            <img
              className="rounded ticket--img"
              style={{ width: "100%" }}
              src={ticketresult.imageUrl}
              alt={ticketresult.name}
            />
          </div>
          <div className="ticket--info col-12 col-lg-7">
            <h2 className="ticket--name">{ticketresult.name}</h2>
            <p className="ticket--seller">
              Sold by
              <a href="#!" className="link-underline-light">
                {" "}
                {ticketresult.author}
              </a>
            </p>
            <p>Sold: 999</p>{" "}
            {/* Replace with actual sold result if available */}
            <div className="tag--list row">
              <div className="">{ticketresult.author}</div>
            </div>
            <div className="ticket--price">
              <p className="display-3">
                <strong>{ticketresult.cost} VND</strong> {/* Format cost */}
              </p>
              <button type="button" className="btn btn-primary ticket--btn">
                Add to cart
              </button>
            </div>
          </div>
        </div>
        <div className="row justify-content-center ticket--desc">
          <div className="col-8">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quo
            corporis, ad veritatis fugit quos debitis neque nemo quasi eveniet
            tenetur in doloribus culpa deserunt quibusdam repellat ipsam nulla
            atque eos exercitationem at eaque dignissimos ipsa? Debitis
            molestias, labore nobis perspiciatis modi explicabo officiis
            doloribus quis laudantium vero dignissimos corporis esse?
          </div>
        </div>
        <div className="ticket--related">
          <h2 className="ticket--title row justify-content-center">
            Related Tickets
          </h2>
          <div className="ticket--list row">
            <div className="card col-12 col-lg-3">
              <img
                src="https://th.bing.com/th/id/OIP.dAeG-S5NsD8SSUdIXukSlgHaHd?w=197&h=197&c=7&r=0&o=5&dpr=1.1&pid=1.7"
                className="card-img-top ticket--img"
                alt="..."
              />
              <div className="card-body">
                <h5 className="card-title">Card title</h5>
                <p className="card-text">
                  <strong>100.000 VND</strong>
                </p>
                <a href="#" className="ticket-btn btn btn-primary">
                  Add to cart
                </a>
              </div>
            </div>
            <div className="card col-12 col-lg-3">
              <img
                src="https://th.bing.com/th/id/OIP.dAeG-S5NsD8SSUdIXukSlgHaHd?w=197&h=197&c=7&r=0&o=5&dpr=1.1&pid=1.7"
                className="card-img-top ticket--img"
                alt="..."
              />
              <div className="card-body">
                <h5 className="card-title">Card title</h5>
                <p className="card-text">
                  <strong>100.000 VND</strong>
                </p>
                <a href="#" className=" btn btn-primary">
                  Add to cart
                </a>
              </div>
            </div>
            <div className="card col-12 col-lg-3">
              <img
                src="https://th.bing.com/th/id/OIP.dAeG-S5NsD8SSUdIXukSlgHaHd?w=197&h=197&c=7&r=0&o=5&dpr=1.1&pid=1.7"
                className="card-img-top ticket--img"
                alt="..."
              />
              <div className="card-body">
                <h5 className="card-title">Card title</h5>
                <p className="card-text">
                  <strong>100.000 VND</strong>
                </p>
                <a href="#" className="ticket-btn btn btn-primary">
                  Add to cart
                </a>
              </div>
            </div>
            <div className="card col-lg-3">
              <img
                src="https://th.bing.com/th/id/OIP.dAeG-S5NsD8SSUdIXukSlgHaHd?w=197&h=197&c=7&r=0&o=5&dpr=1.1&pid=1.7"
                className="card-img-top ticket--img"
                alt="..."
              />
              <div className="card-body">
                <h5 className="card-title">Card title</h5>
                <p className="card-text">
                  <strong>100.000 VND</strong>
                </p>
                <a href="#" className="ticket-btn btn btn-primary">
                  Add to cart
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TicketDetail;
