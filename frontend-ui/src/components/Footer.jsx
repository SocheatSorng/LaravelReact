import React from "react";
import { Link } from "react-router-dom";
import { scrollToTop } from "../utilis/scrollToTop";

const title = "About ReactStore";
const desc =
  "Eduaid theme number one world class university in the world There are student are studing always in this university for all time.";
const ItemTitle = "Categories";
const quickTitle = "Quick Links";
const tweetTitle = "Recent Tweets";

const addressList = [
  {
    iconName: "icofont-google-map",
    text: " #Tonle Bassac Chamkarmon, PP",
  },
  {
    iconName: "icofont-phone",
    text: " +012 345 678",
  },
  {
    iconName: "icofont-envelope",
    text: " sorngsocheat@gmail.com",
  },
];

const socialList = [
  {
    iconName: "icofont-facebook",
    siteLink: "#",
    className: "facebook",
  },
];

const ItemList = [
  {
    text: "Home",
    link: "/",
  },
  {
    text: "Shop",
    link: "/shop",
  },
  {
    text: "Blog",
    link: "/blog",
  },
  {
    text: "About",
    link: "/about",
  },
  {
    text: "Contact",
    link: "/contact",
  },
];

const quickList = [
  {
    text: "Summer Sessions",
    link: "#",
  },
  {
    text: "Events",
    link: "#",
  },
  {
    text: "Gallery",
    link: "#",
  },
  {
    text: "Forums",
    link: "#",
  },
  {
    text: "Privacy Policy",
    link: "#",
  },
  {
    text: "Terms of Use",
    link: "#",
  },
];

const tweetList = [
  {
    iconName: "icofont-twitter",
    desc: (
      <p>
        Aminur islam <a href="#">@ShopCart Greetings! #HTML_Template</a> Grab
        your item, 50% Big Sale Offer !!
      </p>
    ),
  },
  {
    iconName: "icofont-twitter",
    desc: (
      <p>
        Somrat islam <a href="#">@ShopCart Hey! #HTML_Template</a> Grab your
        item, 50% Big Sale Offer !!
      </p>
    ),
  },
];

const footerbottomList = [
  {
    text: "Faculty",
    link: "#",
  },
  {
    text: "Staff",
    link: "#",
  },
  {
    text: "Students",
    link: "#",
  },
  {
    text: "Alumni",
    link: "#",
  },
];

const Footer = () => {
  return (
    <footer className="style-2">
      <div className="footer-top dark-view py-4">
        <div className="container">
          <div className="row g-4 row-cols-xl-4 row-cols-sm-2 row-cols-1 justify-content-center">
            <div className="col">
              <div className="footer-item text-center">
                <div className="title">
                  <h4 className="mb-3">{title}</h4>
                </div>
                <div className="content">
                  <p className="mb-3">{desc}</p>
                  <ul className="lab-ul office-address">
                    {addressList.map((val, i) => (
                      <li key={i}>
                        <i className={val.iconName}>{val.text}</i>
                      </li>
                    ))}
                  </ul>
                  <ul className="lab-ul social-icons d-flex justify-content-center gap-2">
                    {socialList.map((val, i) => (
                      <li key={i}>
                        <a
                          href="https://www.facebook.com/sorngsocheats"
                          className={val.className}
                        >
                          <i className={val.iconName}></i>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Categories Column */}
            <div className="col">
              <div className="footer-item text-center">
                <div className="title">
                  <h4 className="mb-3">{ItemTitle}</h4>
                </div>
                <div className="content">
                  <ul className="lab-ul">
                    {ItemList.map((val, i) => (
                      <li key={i}>
                        <Link
                          to={val.link}
                          className="text-decoration-none"
                          onClick={scrollToTop}
                        >
                          {val.text}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Quick Links Column */}
            <div className="col">
              <div className="footer-item text-center">
                <div className="title">
                  <h4 className="mb-3">{quickTitle}</h4>
                </div>
                <div className="content">
                  <ul className="lab-ul">
                    {quickList.map((val, i) => (
                      <li key={i}>
                        <Link to={val.link} className="text-decoration-none">
                          {val.text}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Copyright Column */}
            <div className="col">
              <div className="footer-item text-center">
                <div className="title">
                  <h4 className="mb-3">Copyright</h4>
                </div>
                <div className="content">
                  <p className="text-muted">
                    &copy; 2024{" "}
                    <Link to="/" className="text-decoration-none">
                      ReactStore
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
