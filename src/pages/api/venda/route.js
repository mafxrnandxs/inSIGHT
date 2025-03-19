import { createConnection } from "../../lib/mysql";

export async function GET() {
  try {
    const connection = await createConnection();
    const [rows] = await connection.execute("SELECT * FROM Venda");

    return new Response(
      JSON.stringify({ vendas: rows }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Erro ao buscar vendas:", error);
    return new Response(
      JSON.stringify({ error: "Erro ao buscar vendas", details: error.message }),
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const { id_cliente, valor_total } = await req.json();

    if (!id_cliente || valor_total == null) {
      return new Response(
        JSON.stringify({ error: "Todos os campos são obrigatórios." }),
        { status: 400 }
      );
    }

    const connection = await createConnection();
    const [result] = await connection.execute(
      "INSERT INTO Venda (id_cliente, data_venda, valor_total) VALUES (?, NOW(), ?)",
      [id_cliente, valor_total]
    );

    const newVenda = {
      id_venda: result.insertId,
      id_cliente,
      data_venda: new Date().toISOString(),
      valor_total,
    };

    return new Response(
      JSON.stringify({ message: "Venda criada", venda: newVenda }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao criar venda:", error);
    return new Response(
      JSON.stringify({ error: "Erro ao criar venda", details: error.message }),
      { status: 500 }
    );
  }
}
