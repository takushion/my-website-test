import React from "react";

const Header = () => {
  const sitePath = window.location.pathname;
  return (
    <header>
      <h1>おれおまんじゅ日記({sitePath})</h1>
      <nav>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>
          <li><a href="/myfriends">My Friends</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;