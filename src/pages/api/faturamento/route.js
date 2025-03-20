import { createConnection } from "../../../lib/mysql";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const connection = await createConnection();
      const [rows] = await connection.execute(`
        SELECT filial, SUM(total_venda) AS faturamento
        FROM Vendas
        GROUP BY filial
      `);

      res.status(200).json({ faturamento: rows });
    } catch (error) {
      console.error("Erro ao buscar faturamento:", error);
      res.status(500).json({ error: "Erro no servidor", details: error.message });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ error: `Método ${req.method} não permitido` });
  }
}
