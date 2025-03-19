
import Sidebar from "@/components/sidebar/sidebar";
import styles from "../styles/simulacao.module.css";

const Simulacao = () => {
  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.content}>
        <select className={styles.select}>
          <option>Aumento de preço</option>
        </select>
        <select className={styles.select}>
          <option>ShadowBoots</option>
        </select>
        <input className={styles.input} type="text" value="10%" readOnly />
        <button className={styles.button}>Simular</button>
      </div>
    </div>
  );
};

export default Simulacao;
