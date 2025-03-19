import { createConnection } from "../../../lib/mysql";
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    const { nome, email, senha, telefone, endereco, data_nascimento } = await req.json(); // Capturar todos os dados

    // Validação de campos obrigatórios
    if (!nome || !email || !senha || !telefone || !endereco || !data_nascimento) {
      return new Response(
        JSON.stringify({ error: 'Todos os campos são obrigatórios.' }),
        { status: 400 }
      );
    }

    const connection = await createConnection();

    // Verificar se o cliente já existe na tabela Cliente
    const [existingClients] = await connection.execute("SELECT * FROM Cliente WHERE email = ?", [email]);
    if (existingClients.length > 0) {
      return new Response(
        JSON.stringify({ error: "Cliente já existe." }),
        { status: 400 }
      );
    }

    // Criptografando a senha antes de salvar no banco
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Inserindo o novo cliente na tabela Cliente
    const [result] = await connection.execute(
      "INSERT INTO Cliente (nome, email, telefone, endereco, data_nascimento, senha) VALUES (?, ?, ?, ?, ?, ?)",
      [nome, email, telefone, endereco, data_nascimento, hashedPassword]
    );

    const newClient = { id: result.insertId, nome, email, telefone, endereco, data_nascimento };

    return new Response(
      JSON.stringify({ message: "Cliente criado", client: newClient }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao conectar com o banco de dados:", error);
    return new Response(
      JSON.stringify({ error: "Erro ao conectar com o banco de dados", details: error.message }),
      { status: 500 }
    );
  }
}
