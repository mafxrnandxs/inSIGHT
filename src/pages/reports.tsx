"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/sidebar/sidebar";
import styles from "@/styles/reports.module.css";

// Definição da interface para tipagem dos produtos
interface Produto {
  id_produto: number;
  id_fornecedor: number;
  nome: string;
  descricao: string;
  preco: number;
  quantidade_estoque: number;
  marca: string;
  categoria: string;
}

const Relatorios = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);

  // Função para buscar os produtos da API
  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await fetch("/api/produto/route");
        if (!response.ok) throw new Error("Erro ao buscar produtos");

        const data = await response.json();
        setProdutos(data.produtos || []);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      }
    };

    fetchProdutos();
  }, []);

  return (
    <div className={styles.container}>
      <Sidebar />
      <main className={styles.content}>
        {/* Filtros */}
        <div className={styles.filtros}>
          <select className={styles.select}>
            <option>Matriz</option>
            <option>Filial 1</option>
            <option>Filial 2</option>
          </select>
          <select className={styles.select}>
            <option>Mês atual</option>
            <option>Últimos 3 meses</option>
            <option>Último ano</option>
          </select>
          <button className={styles.botaoBuscar}>Buscar</button>
          <button className={styles.botaoLimpar}>Limpar filtros</button>
        </div>

        {/* Tabela de Produtos */}
        <table className={styles.tabela}>
          <thead>
            <tr>
              <th>Produto</th>
              <th>Marca</th>
              <th>Categoria</th>
              <th>Preço Unitário (R$)</th>
              <th>Quantidade em Estoque</th>
              <th>Total em Estoque (R$)</th>
            </tr>
          </thead>
          <tbody>
            {produtos.length > 0 ? (
              produtos.map((item, index) => (
                <tr key={index}>
                  <td>{item.nome}</td>
                  <td>{item.marca}</td>
                  <td>{item.categoria}</td>
                  <td>{item.preco.toFixed(2)}</td>
                  <td>{item.quantidade_estoque}</td>
                  <td>{(item.preco * item.quantidade_estoque).toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className={styles.semDados}>
                  Nenhum produto encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <button className={styles.botaoExportar}>Exportar</button>
      </main>
    </div>
  );
};

export default Relatorios;
