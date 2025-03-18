"use client";
import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts";
import Card from "@/components/card/card";
import Sidebar from "@/components/sidebar/sidebar";
import styles from "@/styles/dashboard.module.css";

const data = [
  { name: "Matriz", valor: 25000, color: "#00FFAA", endereco: "Rua Valoran, 237 - Bairro da Demacia" },
  { name: "Filial 1", valor: 10000, color: "#FFA500", endereco: "Avenida Piltover, 170 - Distrito Hextec" },
  { name: "Filial 2", valor: 15000, color: "#8000FF", endereco: "Avenida Ionia, 7 - Bairro Harmonia" },
];

const Dashboard = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className={styles.dashboardContainer}>
      <Sidebar />
      <main className={styles.content}>
        <div className={styles.cards}>
          <Card title="Faturamento" value="R$50.000,00" subtitle="15% desde jan." positive />
          <Card title="Vendas" value="+10%" subtitle="Comparado ao último mês" positive />
          <Card title="Custos" value="R$27.000,00" subtitle="4.3% desde jan." negative />
          <Card title="Estoque" value="Sem produtos em falta" />
        </div>

        {/* Gráfico */}
        <div className={styles.chartContainer}>
          <h3>Gráfico - Faturamento</h3>
          {isClient ? (
            <ResponsiveContainer width="70%" height={300}>
              <BarChart data={data} margin={{ top: 20, right: 50, left: 20, bottom: 10 }}>
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `R$${value.toLocaleString()}`} />
                <Tooltip formatter={(value) => `R$${value.toLocaleString()}`} />
                <Bar dataKey="valor" radius={[5, 5, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p>Carregando gráfico...</p>
          )}

          {/* Legenda personalizada */}
          <div className={styles.legend}>
            {data.map((item, index) => (
              <div key={index} className={styles.legendItem}>
                <div className={styles.legendColor} style={{ backgroundColor: item.color }}></div>
                <span>{item.name} - {item.endereco}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
