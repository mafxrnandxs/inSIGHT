"use client";

import React, { useState } from "react";
import Sidebar from "@/components/sidebar/sidebar";
import styles from "@/styles/reports.module.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// Definição da interface para tipagem dos produtos
interface Produto {
  id_produto: number;
  nome: string;
  descricao: string;
  preco: number;
  quantidade_estoque: number;
  marca: string;
  categoria: string;
}

const Relatorios = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [filialSelecionada, setFilialSelecionada] = useState<string>("Matriz");
  const [loading, setLoading] = useState<boolean>(false);
  const [dadosCarregados, setDadosCarregados] = useState<boolean>(false);

  // Função para buscar os produtos da API
  const fetchProdutos = async () => {
    try {
      setLoading(true);
      setDadosCarregados(false);

      let url = "/api/produto/route"; // Padrão: Matriz

      if (filialSelecionada === "Filial 1") {
        url = "/api/filial1/route";
      } else if (filialSelecionada === "Filial 2") {
        url = "/api/filial2/route";
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error("Erro ao buscar produtos");

      const data = await response.json();
      setProdutos(data.produtos || []);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
      setProdutos([]);
    } finally {
      setLoading(false);
      setDadosCarregados(true);
    }
  };

  // Função para limpar os filtros (deixar a tela vazia)
  const limparFiltros = () => {
    setProdutos([]);
    setDadosCarregados(false);
  };

  // Função para exportar os produtos da filial selecionada
  const exportToExcel = async () => {
    if (produtos.length === 0) {
      alert("Nenhum dado para exportar!");
      return;
    }

    let url = "/api/produto/route"; // Padrão: Matriz

    if (filialSelecionada === "Filial 1") {
      url = "/api/filial1/route";
    } else if (filialSelecionada === "Filial 2") {
      url = "/api/filial2/route";
    }

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Erro ao buscar produtos");

      const data = await response.json();
      const produtosExportacao = data.produtos || [];

      if (produtosExportacao.length === 0) {
        alert("Nenhum dado para exportar!");
        return;
      }

      const excelData = produtosExportacao.map((produto) => ({
        Produto: produto.nome,
        Marca: produto.marca,
        Categoria: produto.categoria,
        "Preço Unitário (R$)": produto.preco.toFixed(2),
        "Quantidade em Estoque": produto.quantidade_estoque,
        "Total em Estoque (R$)": (produto.preco * produto.quantidade_estoque).toFixed(2),
      }));

      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Relatório");

      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const dataBlob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

      saveAs(dataBlob, `relatorio_${filialSelecionada}.xlsx`);
    } catch (error) {
      console.error("Erro ao exportar:", error);
      alert("Erro ao exportar os dados!");
    }
  };

  return (
    <div className={styles.container}>
      <Sidebar />
      <main className={styles.content}>
        {/* Filtros */}
        <div className={styles.filtros}>
          <select
            className={styles.select}
            value={filialSelecionada}
            onChange={(e) => setFilialSelecionada(e.target.value)}
          >
            <option>Matriz</option>
            <option>Filial 1</option>
            <option>Filial 2</option>
          </select>

          <select className={styles.select}>
            <option>Mês atual</option>
            <option>Últimos 3 meses</option>
            <option>Último ano</option>
          </select>

          <button className={styles.botaoBuscar} onClick={fetchProdutos}>
            Buscar
          </button>
          <button className={styles.botaoLimpar} onClick={limparFiltros}>
            Limpar filtros
          </button>
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
            {loading ? (
              <tr>
                <td colSpan={6} className={styles.carregando}>
                  Buscando produtos...
                </td>
              </tr>
            ) : produtos.length > 0 ? (
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
            ) : dadosCarregados ? (
              <tr>
                <td colSpan={6} className={styles.semDados}>
                  Nenhum produto encontrado.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>

        <button className={styles.botaoExportar} onClick={exportToExcel}>
          Exportar
        </button>
      </main>
    </div>
  );
};

export default Relatorios;
