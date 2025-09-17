import React from "react";

type TitleAndListProps = {
  title: string;
  itemsList: { title: string; items: string[] }[];
};

/**
 * タイトルと詳細な箇条書きリストを表示するコンポーネント
 */
const TitleAndList: React.FC<TitleAndListProps> = ({ title, itemsList }) => {
  return (
    <section>
      <h3>{title}</h3>
      {itemsList.map((sublist, idx) => (
        <div key={idx}>
          <h4>{sublist.title}</h4>
          <ul>
            {sublist.items.map((item, subIdx) => (
              <li key={subIdx}>
                {item.startsWith("http") ? (
                  <a href={item} target="_blank" rel="noopener noreferrer">{item}</a>
                ) : (
                  item
                )}
              </li>
            ))}
          </ul>
          <hr />
        </div>
      ))}
      <hr />
    </section>
  );
};

export default TitleAndList;
export type { TitleAndListProps };
