import React from "react";

const Header = () => {
  return (
    <header style={{
      textAlign: "center",
      padding: "1rem",
      borderBottom: "1px solid rgba(0,0,0,0.1)",
    }}>
      <h1 style={{ fontSize: "3.5rem", margin: 0 }}>My Website</h1>
    </header>
  );
};

export default Header;
