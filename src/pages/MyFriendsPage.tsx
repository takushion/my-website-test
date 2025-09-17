import React from "react";
import TitleAndList from "../components/TitleAndList/TitleAndList";
import type { TitleAndListProps } from "../components/TitleAndList/TitleAndList";

const MyFriendsPage = () => {
  const friends: TitleAndListProps = {
    title: "友達のサイトリンク",
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
      <TitleAndList {...friends} />
    </div>
  );
};

export default MyFriendsPage;
