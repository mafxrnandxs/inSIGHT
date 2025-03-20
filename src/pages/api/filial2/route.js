import { createConnection } from "../../../lib/mysql";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const connection = await createConnection();
      const [rows] = await connection.execute(
        "SELECT id_produto, nome, descricao, preco, quantidade_estoque, marca, categoria FROM Filial2"
      );

      const produtos = rows.map(produto => ({
        ...produto,
        preco: parseFloat(produto.preco)
      }));

      res.status(200).json({ produtos });
    } catch (error) {
      console.error("Erro ao buscar produtos da Filial 2:", error);
      res.status(500).json({ error: "Erro ao buscar produtos da Filial 2", details: error.message });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
