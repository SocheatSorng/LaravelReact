import React from "react";
import { Link } from "react-router-dom";

const getBackgroundImage = (curPage) => {
  const images = {
    Shop: "https://images.pexels.com/photos/3965557/pexels-photo-3965557.jpeg?auto=compress&cs=tinysrgb&w=1200", // New shop interior image
    Blog: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200",
    About:
      "https://cdn.pixabay.com/photo/2015/01/09/11/08/startup-594090_1280.jpg",
    Contact:
      "https://images.pexels.com/photos/1416530/pexels-photo-1416530.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "Single Product":
      "https://cdn.pixabay.com/photo/2016/11/22/21/57/apparel-1850804_1280.jpg",
  };
  return images[curPage] || images.Shop;
};

const PageHeader = ({ title, curPage }) => {
  return (
    <div
      className="pageheader-section"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('${getBackgroundImage(
          curPage
        )}')`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        padding: "80px 0",
        position: "relative",
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12">
            <div className="pageheader-content text-center">
              <h2 className="text-white mb-3">{title}</h2>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb justify-content-center mb-0">
                  <li className="breadcrumb-item">
                    <Link to="/" className="text-white text-decoration-none">
                      Home
                    </Link>
                  </li>
                  <li className="breadcrumb-item">
                    <span className="text-white">{curPage}</span>
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
