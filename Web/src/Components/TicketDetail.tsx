import React from "react";
import "../Css/TicketDetail.css";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
// Thêm file CSS cho styling nếu cần

const TicketDetail = () => {
  return (
    <div>
      <main className="container">
        <div className="row ticket--detail">
          <div className=" col-12 col-lg-4 ticket--intro">
            <img
              className="rounded ticket--img"
              style={{ width: "100%" }}
              src="https://th.bing.com/th/id/OIP.dAeG-S5NsD8SSUdIXukSlgHaHd?w=197&h=197&c=7&r=0&o=5&dpr=1.1&pid=1.7"
              alt="Ticket Image"
            />
            <div className="row ticket--img--list">
              <div className="col-12 col-lg-3 ticket--img--item">
                <img
                  src="https://th.bing.com/th/id/OIP.dAeG-S5NsD8SSUdIXukSlgHaHd?w=197&h=197&c=7&r=0&o=5&dpr=1.1&pid=1.7"
                  className=" ticket--img "
                  style={{ width: "100%" }}
                  alt="Ticket Image"
                />
              </div>
              <div className="col-12 col-lg-3 ticket--img--item">
                <img
                  src="https://th.bing.com/th/id/OIP.dAeG-S5NsD8SSUdIXukSlgHaHd?w=197&h=197&c=7&r=0&o=5&dpr=1.1&pid=1.7"
                  className=" ticket--img  "
                  style={{ width: "100%" }}
                  alt="Ticket Image"
                />
              </div>
              <div className="col-12 col-lg-3 ticket--img--item">
                <img
                  src="https://th.bing.com/th/id/OIP.dAeG-S5NsD8SSUdIXukSlgHaHd?w=197&h=197&c=7&r=0&o=5&dpr=1.1&pid=1.7"
                  className=" ticket--img "
                  style={{ width: "100%" }}
                  alt="Ticket Image"
                />
              </div>
              <div className="col-12 col-lg-3 ticket--img--item">
                <img
                  src="https://th.bing.com/th/id/OIP.dAeG-S5NsD8SSUdIXukSlgHaHd?w=197&h=197&c=7&r=0&o=5&dpr=1.1&pid=1.7"
                  className=" ticket--img "
                  style={{ width: "100%" }}
                  alt="Ticket Image"
                />
              </div>
            </div>
          </div>
          <div className="ticket--info col-12 col-lg-7">
            <h2 className="ticket--name">Gratian</h2>
            <p className="ticket--seller">
              Sold by
              <a href="#!" className="link-underline-light">
                {" "}
                Giap Cao Dinh
              </a>
            </p>
            <p>Sold: 999</p>
            <div className="tag--list row">
              <div className="">Giap</div>
              <div className="">Khang</div>
            </div>
            <div className="ticket--price">
              <p className="display-3">
                <strong>100.000 VND</strong>
              </p>
              <button type="button" className="btn btn-primary ticket--btn">
                Thêm giỏ hàng
              </button>
              {/* <button type="button" className="btn btn-primary ticket--btn">
                Mua ngay
              </button> */}
            </div>
          </div>
        </div>
        <div className="row justify-content-center ticket--desc">
          <div className="desc--list ">
            <a className="desc--item" href="#">
              Cras justo odio
            </a>
            <a className="desc--item" href="#">
              Dapibus ac facilisis in
            </a>
            <a className="desc--item" href="#">
              Morbi leo risus
            </a>
          </div>
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
