import { createConnection } from "../../../lib/mysql";

export async function GET() {
  try {
    const connection = await createConnection();
    const [rows] = await connection.execute(
      "SELECT id_produto, id_fornecedor, nome, descricao, preco, quantidade_estoque, marca, categoria FROM Produto"
    );

    const produtos = rows.map(produto => ({
      ...produto,
      preco: parseFloat(produto.preco) // Garante que o preço seja número
    }));

    return new Response(
      JSON.stringify({ produtos }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    return new Response(
      JSON.stringify({ error: "Erro ao buscar produtos", details: error.message }),
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const { id_fornecedor, nome, descricao, preco, quantidade_estoque, marca, categoria } = await req.json();

    if (!id_fornecedor || !nome || !preco || quantidade_estoque == null || !marca || !categoria) {
      return new Response(
        JSON.stringify({ error: "Todos os campos são obrigatórios." }),
        { status: 400 }
      );
    }

    const connection = await createConnection();
    const [result] = await connection.execute(
      "INSERT INTO Produto (id_fornecedor, nome, descricao, preco, quantidade_estoque, marca, categoria) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [id_fornecedor, nome, descricao, preco, quantidade_estoque, marca, categoria]
    );

    const newProduto = {
      id_produto: result.insertId,
      id_fornecedor,
      nome,
      descricao,
      preco,
      quantidade_estoque,
      marca,
      categoria,
    };

    return new Response(
      JSON.stringify({ message: "Produto criado", produto: newProduto }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao criar produto:", error);
    return new Response(
      JSON.stringify({ error: "Erro ao criar produto", details: error.message }),
      { status: 500 }
    );
  }
}
