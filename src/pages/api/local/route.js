import { createConnection } from "../../lib/mysql";

export async function GET() {
  try {
    const connection = await createConnection();
    const [rows] = await connection.execute("SELECT * FROM Local");

    return new Response(
      JSON.stringify({ locais: rows }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Erro ao buscar locais:", error);
    return new Response(
      JSON.stringify({ error: "Erro ao buscar locais", details: error.message }),
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const { nome, endereco } = await req.json();

    if (!nome || !endereco) {
      return new Response(
        JSON.stringify({ error: "Todos os campos são obrigatórios." }),
        { status: 400 }
      );
    }

    const connection = await createConnection();
    const [result] = await connection.execute(
      "INSERT INTO Local (nome, endereco) VALUES (?, ?)",
      [nome, endereco]
    );

    const newLocal = {
      id_local: result.insertId,
      nome,
      endereco,
    };

    return new Response(
      JSON.stringify({ message: "Local criado", local: newLocal }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao criar local:", error);
    return new Response(
      JSON.stringify({ error: "Erro ao criar local", details: error.message }),
      { status: 500 }
    );
  }
}
