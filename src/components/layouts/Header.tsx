import React from "react";
import styles from "./layouts.module.scss"; 

const Header = () => {
  const sitePath = window.location.pathname;
  return (
    <header>
      <h1>おれおまんじゅ日記({sitePath})</h1>
      <br />
      <nav className={styles.navHorizontal}>
        <button type="button" className="nes-btn" onClick={() => window.location.href = '/'}>
          Normal
        </button>
        <button type="button" className="nes-btn" onClick={() => window.location.href = '/about'}>
          About
        </button>
        <button type="button" className="nes-btn" onClick={() => window.location.href = '/contact'}>
          Contact
        </button>
        <button type="button" className="nes-btn" onClick={() => window.location.href = '/myfriends'}>
          My Friends
        </button> 
      </nav>
      <br />
    </header>
  );
};

export default Header;
