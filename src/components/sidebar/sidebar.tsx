'use client';

import Link from 'next/link';
import Image from 'next/image';
import styles from './sidebar.module.css'; // Importação do módulo CSS

export default function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <nav>
        <ul>
          <li>
            <Link href="/dashboard">
              <Image src="/Home.svg" alt="Dashboard" width={20} height={20} /> Dashboard
            </Link>
          </li>
          <li>
            <Link href="/reports">
              <Image src="/Table.svg" alt="Relatórios" width={20} height={20} /> Relatórios
            </Link>
          </li>
          <li>
            <Link href="/simulacao">
              <Image src="/Pie Chart.svg" alt="Simulações" width={20} height={20} /> Simulações
            </Link>
          </li>
        </ul>
      </nav>
      <div className={styles.logout}>
        <Link href="/login">
          <Image src="/Log out.svg" alt="Logout" width={20} height={20} /> Logout
        </Link>
      </div>
    </div>
  );
}
