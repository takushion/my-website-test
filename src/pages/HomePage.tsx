import React from "react";
import TitleAndList from "../components/TitleAndList/TitleAndList";
import type { TitleAndListProps } from "../components/TitleAndList/TitleAndList";

const HomePage = () => {
  const profile: TitleAndListProps = {
    title: "Profile",
    itemsList: [
      {
        title: "名前",
        items: ["佐藤匠真"],
      },
      {
        title: "大学",
        items: ["筑波大学 情報学群 知識情報・図書館学類"],
      },
      {
        title: "研究室",
        items: ["知識獲得システム研究室"],
      },
    ],
  };

  const hobbies: TitleAndListProps = {
    title: "Hobbies",
    itemsList: [
      {
        title: "ゲーム実況",
        items: ["TOP4", "非公開ズ", "わくバン", "最俺"],
      },
      {
        title: "身体を動かすこと",
        items: ["筋トレ", "卓球"],
      },
      {
        title: "YouTube",
        items: ["板橋ハウス", "転々飯店"],
      },
      {
        title: "漫画",
        items: [
          "魔入りました!入間くん",
          "夢なし先生の進路指導",
          "増田英二作品全般",
          "高橋留美子作品全般",
          "ジャンプ全般",
        ],
      },
      {
        title: "収集",
        items: ["柔軟剤"],
      },
    ],
  };

  const certification: TitleAndListProps = {
    title: "Certification",
    itemsList: [
      {
        title: "ゲーム実況",
        items: [
          "基本情報技術者試験合格",
          "応用情報技術者試験合格",
          "AWS Certified Solutions Architect - Associate",
        ],
      },
    ],
  };
  const career: TitleAndListProps = {
    title: "Career",
    itemsList: [
      {
        title: "2023/04 - 現在",
        items: ["筑波大学,情報学群,知識情報・図書館学類"],
      },
      {
        title: "2024/09 - 2025/03",
        items: ["スパイラル株式会社,インターン,インサイドセールス"],
      },
      {
        title: "2025/03 - 2026/05",
        items: ["株式会社Techouse,インターン,労務系事業部,エンジニア"],
      },
      {
        title: "2026/01 - 2026/04",
        items: ["株式会社アイネット,インターン,宇宙開発系事業部,エンジニア"],
      },
      {
        title: "2026/05 - 現在",
        items: ["株式会社SIGQ,インターン,エンジニア"],
      },
    ],
  };

  const contact: TitleAndListProps = {
    title: "Contact",
    itemsList: [
      {
        title: "メールアドレス",
        items: ["taku11151987@gmail.com"],
      },
      {
        title: "GitHub",
        items: ["https://github.com/takushion"],
      },
      {
        title: "X(Twitter)",
        items: ["https://x.com/oreomanju_itf"],
      },
    ],
  };

  const friends: TitleAndListProps = {
    title: "Friends",
    itemsList: [
      {
        title: "miya",
        items: ["https://miya-lis.net/"],
      },
      {
        title: "ロマノフ",
        items: ["https://romablog-lime.vercel.app"],
      },
      {
        title: "ずきも",
        items: ["https://zkm-web.pages.dev/"],
      },
      {
        title: "うつぎ",
        items: ["https://utsugi0101.dev/"],
      },
    ],
  };

  return (
    <div>
      <h2 style={{ fontSize: "2rem" }}>About Me</h2>
      <TitleAndList {...profile} />
      <TitleAndList {...hobbies} />
      <TitleAndList {...certification} />
      <TitleAndList {...career} />
      <h2 style={{ fontSize: "2rem" }}>Links</h2>
      <TitleAndList {...contact} />
      <TitleAndList {...friends} />
    </div>
  );
};

export default HomePage;
