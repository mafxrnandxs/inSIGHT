import { createConnection } from "../../../lib/mysql";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const connection = await createConnection();
      const [rows] = await connection.execute(
        "SELECT id_produto, id_fornecedor, nome, descricao, preco, quantidade_estoque, marca, categoria FROM Produto"
      );

      const produtos = rows.map(produto => ({
        ...produto,
        preco: parseFloat(produto.preco)
      }));

      res.status(200).json({ produtos });
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      res.status(500).json({ error: "Erro ao buscar produtos", details: error.message });
    }
  } else if (req.method === "POST") {
    try {
      const { id_fornecedor, nome, descricao, preco, quantidade_estoque, marca, categoria } = req.body;

      if (!id_fornecedor || !nome || !preco || quantidade_estoque == null || !marca || !categoria) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios." });
      }

      const connection = await createConnection();
      const [result] = await connection.execute(
        "INSERT INTO Produto (id_fornecedor, nome, descricao, preco, quantidade_estoque, marca, categoria) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [id_fornecedor, nome, descricao, preco, quantidade_estoque, marca, categoria]
      );

      res.status(201).json({
        message: "Produto criado",
        produto: {
          id_produto: result.insertId,
          id_fornecedor,
          nome,
          descricao,
          preco,
          quantidade_estoque,
          marca,
          categoria
        }
      });
    } catch (error) {
      console.error("Erro ao criar produto:", error);
      res.status(500).json({ error: "Erro ao criar produto", details: error.message });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
