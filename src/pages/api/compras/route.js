import { createConnection } from "../../lib/mysql";

export async function GET() {
  try {
    const connection = await createConnection();
    const [rows] = await connection.execute(
      "SELECT id_compra, id_fornecedor, DATE_FORMAT(data_compra, '%Y-%m-%d %H:%i:%s') AS data_compra, valor_total FROM Compra"
    );

    return new Response(
      JSON.stringify({ compras: rows }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Erro ao buscar compras", details: error.message }),
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const { id_fornecedor, valor_total } = await req.json();

    if (!id_fornecedor || valor_total == null) {
      return new Response(
        JSON.stringify({ error: "Todos os campos são obrigatórios." }),
        { status: 400 }
      );
    }

    // Verificando se valor_total é um número válido
    if (isNaN(valor_total)) {
      return new Response(
        JSON.stringify({ error: "Valor total inválido." }),
        { status: 400 }
      );
    }

    const connection = await createConnection();
    const [result] = await connection.execute(
      "INSERT INTO Compra (id_fornecedor, data_compra, valor_total) VALUES (?, NOW(), ?)",
      [id_fornecedor, parseFloat(valor_total)] // Garantindo que valor_total é numérico
    );

    return new Response(
      JSON.stringify({ message: "Compra registrada com sucesso", id_compra: result.insertId }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao registrar compra:", error);
    return new Response(
      JSON.stringify({ error: "Erro ao registrar compra", details: error.message }),
      { status: 500 }
    );
  }
}

