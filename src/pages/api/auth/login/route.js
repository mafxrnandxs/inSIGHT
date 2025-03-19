import { createConnection } from "../../../lib/mysql";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "Email e senha são obrigatórios." }),
        { status: 400 }
      );
    }

    const connection = await createConnection();

    // Verificar se o cliente existe no banco de dados
    const [clients] = await connection.execute(
      "SELECT * FROM Cliente WHERE email = ?",
      [email]
    );

    console.log('Clientes encontrados:', clients); // Adicione este log

    if (clients.length === 0) {
      return new Response(
        JSON.stringify({ error: "Email ou senha incorretos." }),
        { status: 400 }
      );
    }

    const client = clients[0];

    // Verificar se a senha informada corresponde à senha armazenada no banco
    const isPasswordValid = await bcrypt.compare(password, client.senha);

    console.log('Senha armazenada:', client.senha); // Adicione este log
    console.log('Senha fornecida:', password); // Adicione este log

    if (!isPasswordValid) {
      return new Response(
        JSON.stringify({ error: "Email ou senha incorretos." }),
        { status: 400 }
      );
    }

    // Retornar sucesso se o login for válido
    const loggedInClient = { id: client.id_cliente, name: client.nome, email: client.email };
    
    return new Response(
      JSON.stringify({ message: "Login bem-sucedido", client: loggedInClient }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao conectar com o banco de dados:", error);
    return new Response(
      JSON.stringify({ error: "Erro ao conectar com o banco de dados", details: error.message }),
      { status: 500 }
    );
  }
}
