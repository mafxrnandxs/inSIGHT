import { createConnection } from "../../lib/mysql";
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const connection = await createConnection();
    const [rows] = await connection.execute("SELECT id_cliente, nome, email, telefone, endereco, data_nascimento FROM Cliente");

    return new Response(
      JSON.stringify({ clientes: rows }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    return new Response(
      JSON.stringify({ error: "Erro ao buscar clientes", details: error.message }),
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const { nome, email, senha, telefone, endereco, data_nascimento } = await req.json();

    if (!nome || !email || !senha || !telefone || !endereco || !data_nascimento) {
      return new Response(
        JSON.stringify({ error: "Todos os campos são obrigatórios." }),
        { status: 400 }
      );
    }

    const connection = await createConnection();

    // Verificar se o cliente já existe
    const [existingClients] = await connection.execute("SELECT * FROM Cliente WHERE email = ?", [email]);
    if (existingClients.length > 0) {
      return new Response(
        JSON.stringify({ error: "Cliente já existe." }),
        { status: 400 }
      );
    }

    // Criptografar a senha
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Inserir o cliente no banco de dados
    const [result] = await connection.execute(
      "INSERT INTO Cliente (nome, email, telefone, endereco, data_nascimento, senha) VALUES (?, ?, ?, ?, ?, ?)",
      [nome, email, telefone, endereco, data_nascimento, hashedPassword]
    );

    const newClient = { id: result.insertId, nome, email, telefone, endereco, data_nascimento };

    return new Response(
      JSON.stringify({ message: "Cliente cadastrado com sucesso", client: newClient }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao cadastrar cliente:", error);
    return new Response(
      JSON.stringify({ error: "Erro ao cadastrar cliente", details: error.message }),
      { status: 500 }
    );
  }
}
