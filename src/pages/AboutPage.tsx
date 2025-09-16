import React from "react";
import TitleAndList from "../components/TitleAndList";
import type { TitleAndListProps } from "../components/TitleAndList";

const AboutPage = () => {
  const affiliation: TitleAndListProps = {
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
        items: [
          "TOP4",
          "非公開ズ",
          "わくバン",
          "最俺",
        ],
      },
      {
        title: "身体を動かすこと",
        items: [
          "自転車(最近始めた)",
          "筋トレ",
          "卓球(もうやめた)",
        ],
      },
      {
        title: "YouTube",
        items: [
          "板橋ハウス",
          "転々飯店",
        ],
      },
      {
        title: "漫画",
        items: [
          "魔入りました!入間くん(最近のイチオシ)",
          "夢なし先生の進路指導",
          "増田英二作品全般",
          "高橋留美子作品全般",
        ],
      },
      {
        title: "収集",
        items: [
          "柔軟剤",
        ],
      }
    ],
  };
  return (
    <div>
      <h2>自己紹介</h2>
      <TitleAndList {...affiliation} />
      <TitleAndList {...hobbies} />
    </div>
  );
};

export default AboutPage;

