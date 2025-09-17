import React from "react";
import TitleAndList from "../components/TitleAndList";
import type { TitleAndListProps } from "../components/TitleAndList";

const ContactPage = () => {
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
        items: ["https://x.com/oreomanju_itf?t=7na1i4D1biTVvb05hMoPrQ&s=09"],
      },
    ],
  };
  return (
    <div>
      <TitleAndList {...contact} />
    </div>
  );
};

export default ContactPage;

