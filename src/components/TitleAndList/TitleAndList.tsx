import React from "react";
import styles from "./TitleAndList.module.scss";

type TitleAndListProps = {
  title: string;
  itemsList: { title: string; items: string[] }[];
};

/**
 * タイトルと詳細な箇条書きリストを表示するコンポーネント
 */
const TitleAndList: React.FC<TitleAndListProps> = ({ title, itemsList }) => {
  return (
    <>
      <br />
      <section
        className={`nes-container is-rounded with-title ${styles.sectionMargin}`}
      >
        <h2 className="title">{title}</h2>
        {itemsList.map((sublist, idx) => (
          <div key={idx}>
            <h3>{sublist.title}</h3>
            <ul className="nes-list is-disc">
              {sublist.items.map((item, subIdx) => (
                <li key={subIdx}>
                  {item.startsWith("http") ? (
                    <button
                      type="button"
                      className={"nes-btn is-primary " + styles.longButton}
                      onClick={() => window.open(item, "_blank", "noopener,noreferrer")}
                    >
                      LINK
                    </button>
                  ) : (
                    item
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
      <br />
    </>
  );
};

export default TitleAndList;
export type { TitleAndListProps };
