import { FC } from "react";
import styles from "./HomePage.module.scss";

const HomePage: FC<any> = () => {
  return (
    <>
      <div className={styles.text}>
        <h1>Это домашняя страница.</h1>
        <h1>Воспользуйтесь меню чтобы начать работу.</h1>
      </div>
    </>
  );
};

export default HomePage;
