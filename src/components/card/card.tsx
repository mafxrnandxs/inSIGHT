import React from "react";
import styles from "./card.module.css";

interface CardProps {
  title: string;
  value: string;
  subtitle?: string;
  positive?: boolean;
  negative?: boolean;
}

const Card: React.FC<CardProps> = ({ title, value, subtitle, positive, negative }) => {
  return (
    <div className={styles.card}>
      <h4 className={styles.title}>{title}</h4>
      <p
        className={`${styles.value} ${
          positive ? styles.positive : negative ? styles.negative : ""
        }`}
      >
        {value}
      </p>
      {subtitle && <small>{subtitle}</small>}
    </div>
  );
};

export default Card;
