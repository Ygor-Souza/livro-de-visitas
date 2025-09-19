const express = require("express");
const app = express();
const porta = 3001;
const ipDoServidor = "127.0.0.1";
const Pool = require("pg").Pool;
const bodyParser = require("body-parser");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  port: "5433",
  database: "livro_visitas",
  password: "postgres",
});

app.use(
  bodyParser.urlencoded({
    extented: false,
  })
);

//importando css
app.use(express.static("public"));

//criar uma rota inicial na aplicação raiz / que exiba a aplicaçaõ em em construção
//formalário para envio da mensagem
// listagem de visitas nome, mensagem do visitante e data de cadastro da visita
//post

//Criando raiz
app.get("/", function (req, res) {
  res.send(`
        <html>
            <head> 
            <title>Cadastro de Mensagens</title>
            <link rel="stylesheet" href="/style.css">
            </head>

            <body>
                <h1 class="titulo">Livro de Visitas</h1>
                <div class="links"
                  <ul>
                      <li><a href="/listar_mensagens">Listar mensagens</a></li>
                      <li><a href="/form-inserir-mansagem">Cadastrar Mensagem</a></li>
                  </ul>
                </div>
            </nody>

            <script>

            </script>
        </html>    
    `);
});

//Cadastrar a notícia
app.post("/livro_visitas", async function (req, res) {
  let { nome_visitante, titulo, conteudo } = req.body;
  if (conteudo.length > 300) {
    conteudo = conteudo.substring(0, 297) + "...";
  }

  const conteudoMinusculo = conteudo.toLowerCase();

  const proibidas = [
    "acesse agora vídeos exclusivos",
    "conteúdo adulto gratuito",
    "mulheres solteiras na sua região",
    "pornô",
    "clique para ver sem censura",
    "a melhor plataforma de conteúdo explícito",
    "conteúdo adulto",
    "nuas",
    "lute até a morte",
    "vídeos sangrentos",
    "download grátis de material proibido",
    "participe da comunidade sem regras",
    "ganhe muito dinheiro por dia sem esforço",
    "investimento garantido, sem riscos",
    "enriqueça",
    "deposite agora e veja seu dinheiro multiplicar",
    "trabalhe de casa e fique rico",
    "renda extra",
    "esquema secreto para ficar milionário",
    "mude de vida com esse método infalível",
    "convide 5 amigos e comece a lucrar",
    "faça uma transferência para ativar sua conta premium",
  ];

  for (const palavra of proibidas) {
    if (conteudoMinusculo.includes(palavra)) {
      return res
        .status(400)
        .send("Mensagem contém conteúdo proibido e não pode ser enviada!");
    }
  }
  const inadequadas = [
    "ganhe dinheiro rápido",
    "trabalho fácil online",
    "aposte",
    "clique aqui para um presente",
    "oferta",
    "compre agora e ganhe um bônus",
    "desconto",
    "milhões de seguidores instantaneamente",
    "aumente seu engajamento agora",
    "sorteio",
    "envie um pix para receber seu prêmio",
  ];

  inadequadas.forEach((palavra) => {
    const regex = new RegExp(palavra, "gi");
    conteudo = conteudo.replace(regex, "*******");
  });
  try {
    const client = await pool.connect();
    await client.query(
      "INSERT INTO livro_visitas(nome_visitante,titulo, conteudo, data_criacao) VALUES ($1, $2, $3, Now())",
      [nome_visitante, titulo, conteudo]
    );
    client.release();
    res.send("Mensagem cadastrada com sucesso!");
  } catch (error) {
    console.error("Erro ao cadastrar Mensagem:", error);
    res.status(500).send("Erro ao cadastrar notícia.");
  }
});

app.get("/listar_mensagens", async function (req, res) {
  try {
    const client = await pool.connect();

    const result = await client.query(
      "SELECT id, nome_visitante, titulo , conteudo FROM livro_visitas ORDER by data_criacao DESC"
    );

    const mensagem = result.rows;

    let table = "<table border = 1>";

    table +=
      "<tr><th>Id</th><th>Nome do Visitante</th><th>Titulo</th><th>Conteudo</th></tr>";

    mensagem.forEach((umaMensagem) => {
      table += `<tr><td>${umaMensagem.id}</td><td>${umaMensagem.nome_visitante}</td><td>${umaMensagem.titulo}</td><td>${umaMensagem.conteudo}</td></tr>`;
    });

    table += "</table>";

    client.release();

    res.send(`
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" href="/style.css" />
            <title>Mensagens</title>
          </head>
          <body>
            <h1 class= "titulo">Mensagens do Livro de Visitas</h1>
            ${table}
          </body>
          </html>`);
  } catch (err) {
    console.error("Erro ao executar consulta: ", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

app.get("/form-inserir-mansagem", function (req, res) {
  res.sendFile(__dirname + "/mensagem.html");
});

app.listen(porta, ipDoServidor, function () {
  console.log(
    "\n Aplicacao web executando em http://" + ipDoServidor + ":" + porta
  );
});
