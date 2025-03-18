'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from '../styles/login.module.css';
import { useRouter } from 'next/router';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter(); // Instância do roteador

  const handleLogin = () => {
    console.log('Usuário:', username, 'Senha:', password);
    
    // Simulação de login bem-sucedido
    if (username === "admin" && password === "1234") {
      router.push('/dashboard'); // Redireciona para a página de dashboard
    } else {
      alert('Usuário ou senha incorretos');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>inSiGHT</h1>
      <div className={styles.input_container}>
        <Image src="/User.svg" alt="user icon" width={20} height={20} className={styles.icon} priority />
        <input
          type="text"
          placeholder="Usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className={styles.input_container}>
        <Image src="/Icon.svg" alt="Senha" className={styles.icon} width={20} height={20} priority />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button className={styles.login_button} onClick={handleLogin}>Login</button>
    </div>
  );
}
