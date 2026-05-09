import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";

const MainLayout = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        pointerEvents: "none",
        padding: "1rem 0",
      }}
    >
      {/* 1枚の unified カード: Header + コンテンツ + Footer */}
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          pointerEvents: "auto",
          backgroundColor: "rgba(255, 255, 255, 0.82)",
          borderRadius: "4px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        <Header />
        <main style={{ flex: 1, padding: "1rem" }}>
          <Outlet />
        </main>
        <footer style={{
          textAlign: "center",
          padding: "0.5rem",
          fontSize: "0.75rem",
          borderTop: "1px solid rgba(0,0,0,0.1)",
        }}>
          © 2026 佐藤匠真
        </footer>
      </div>
    </div>
  );
};

export default MainLayout;
