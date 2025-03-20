import { useEffect, useState } from "react";
import Sidebar from "@/components/sidebar/sidebar";
import styles from "../styles/simulacao.module.css";

const Simulacao = () => {
  const [produtos, setProdutos] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [precoAtual, setPrecoAtual] = useState(0);
  const [percentual, setPercentual] = useState(""); // Input do usuário
  const [resultado, setResultado] = useState(null);
  const [modalAberta, setModalAberta] = useState(false); // Controle da modal

  // Buscar produtos do banco de dados
  useEffect(() => {
    fetch("/api/simulacao/route")
      .then((res) => res.json())
      .then((data) => setProdutos(data.produtos))
      .catch((err) => console.error("Erro ao buscar produtos:", err));
  }, []);

  // Atualizar preço quando um produto for selecionado
  const handleProdutoChange = (e) => {
    const produto = produtos.find((p) => p.nome === e.target.value);
    if (produto) {
      setProdutoSelecionado(produto);
      setPrecoAtual(produto.preco);
    }
  };

  // Função para validar e simular o aumento de preço
  const simular = () => {
    const precoAtualNumber = Number(precoAtual);
    const percentualNumber = Number(percentual);

    if (isNaN(precoAtualNumber) || precoAtualNumber <= 0) {
      alert("Selecione um produto válido antes de simular.");
      return;
    }

    if (isNaN(percentualNumber) || percentualNumber <= 0) {
      alert("Digite um percentual válido maior que 0.");
      return;
    }

    const aumento = precoAtualNumber * (percentualNumber / 100);
    const novoPreco = precoAtualNumber + aumento;
    const aumentoFaturamento = aumento * 100; // Baseado em 100 unidades

    setResultado({
      novoPreco: novoPreco.toFixed(2),
      aumentoFaturamento: aumentoFaturamento.toFixed(2),
    });

    setModalAberta(true); // Abre a modal
  };

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.content}>
        <select className={styles.select} onChange={handleProdutoChange}>
          <option value="">Selecione um produto</option>
          {produtos.map((produto) => (
            <option key={produto.id_produto} value={produto.nome}>
              {produto.nome}
            </option>
          ))}
        </select>

        <input
          className={styles.input}
          type="text"
          value={percentual}
          onChange={(e) => setPercentual(e.target.value)}
          placeholder="Digite o percentual de aumento"
        />

        <button className={styles.button} onClick={simular}>
          Simular
        </button>

        {/* Modal */}
        {modalAberta && resultado && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <button className={styles.closeButton} onClick={() => setModalAberta(false)}>
                ✖
              </button>
              <p>O novo valor do produto será: <strong>R${resultado.novoPreco}</strong></p>
              <p>
                Haverá um aumento de faturamento de <strong>R${resultado.aumentoFaturamento}</strong> a cada 100 unidades vendidas.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Simulacao;
