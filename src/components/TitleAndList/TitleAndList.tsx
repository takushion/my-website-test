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
    <section className={styles.container}>
      <h3 className={styles.mainTitle}>{title}</h3>
      {itemsList.map((sublist, idx) => (
        <div key={idx} className={styles.sublistContainer}>
          <h4 className={styles.sublistTitle}>{sublist.title}</h4>
          <ul>
            {sublist.items.map((item, subIdx) => (
              <li key={subIdx} className={styles.listItem}>
                {item.startsWith("http") ? (
                  <a href={item} target="_blank" rel="noopener noreferrer" className={styles.link}>{item}</a>
                ) : (
                  item
                )}
              </li>
            ))}
          </ul>
          <hr />
        </div>
      ))}
    </section>
  );
};

export default TitleAndList;
export type { TitleAndListProps };
