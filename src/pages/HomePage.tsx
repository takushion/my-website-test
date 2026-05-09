import React from "react";
import TitleAndList from "../components/TitleAndList/TitleAndList";
import type { TitleAndListProps } from "../components/TitleAndList/TitleAndList";

const HomePage = () => {
  const profile: TitleAndListProps = {
    title: "所属",
    itemsList: [
      {
        title: "大学",
        items: ["筑波大学 情報学群 知識情報・図書館学類"],
      },
    ],
  };

  const hobbies: TitleAndListProps = {
    title: "趣味",
    itemsList: [
      {
        title: "ゲーム実況",
        items: ["TOP4", "非公開ズ", "わくバン", "最俺"],
      },
      {
        title: "身体を動かすこと",
        items: ["自転車", "筋トレ", "卓球"],
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
        ],
      },
      {
        title: "収集",
        items: ["柔軟剤"],
      },
    ],
  };

  const contact: TitleAndListProps = {
    title: "連絡先",
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
    title: "友達のサイト",
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
      <h2>Profile</h2>
      <TitleAndList {...profile} />
      <TitleAndList {...hobbies} />
      <h2>Links</h2>
      <TitleAndList {...contact} />
      <TitleAndList {...friends} />
    </div>
  );
};

export default HomePage;
