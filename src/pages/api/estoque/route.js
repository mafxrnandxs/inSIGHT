import { createConnection } from "../../../lib/mysql";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const connection = await createConnection();
      const [rows] = await connection.execute(`
        SELECT 'Matriz' AS filial, SUM(quantidade_estoque) AS total_estoque FROM Produto
        UNION ALL
        SELECT 'Filial 1', SUM(quantidade_estoque) FROM Filial1
        UNION ALL
        SELECT 'Filial 2', SUM(quantidade_estoque) FROM Filial2
      `);

      res.status(200).json({ estoque: rows });
    } catch (error) {
      console.error("Erro ao buscar estoque:", error);
      res.status(500).json({ error: "Erro no servidor", details: error.message });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ error: `Método ${req.method} não permitido` });
  }
}
