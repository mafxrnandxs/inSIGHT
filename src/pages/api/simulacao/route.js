import { createConnection } from "../../../lib/mysql";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const connection = await createConnection();
      const [rows] = await connection.execute("SELECT nome, preco FROM Produto"); // Pegando só nome e preço

      res.status(200).json({ produtos: rows });
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      res.status(500).json({ error: "Erro ao buscar produtos", details: error.message });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
