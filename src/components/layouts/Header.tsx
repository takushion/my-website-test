import React from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./layouts.module.scss";

const Header = () => {
  const location = useLocation();
  const sitePath = location.pathname;
  return (
    <header>
      <h1>おれおまんじゅ日記({sitePath})</h1>
      <nav className={styles.navHorizontal}>
        <Link className="nes-btn" to="/">
          Home
        </Link>
        <Link className="nes-btn" to="/about">
          About
        </Link>
        <Link className="nes-btn" to="/contact">
          Contact
        </Link>
        <Link className="nes-btn" to="/myfriends">
          My Friends
        </Link>
      </nav>
    </header>
  );
};

export default Header;
