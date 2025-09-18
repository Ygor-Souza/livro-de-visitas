const express = require('express')
const app = express()
const porta = 3001
const ipDoServidor = '127.0.0.1'
const Pool = require("pg").Pool
const bodyParser = require('body-parser')

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    port: "5432",
    database: "livro_visitas",
    password: "postgres"
});

app.use(bodyParser.urlencoded({
    extented: false}))
//criar uma rota inicial na aplicação raiz / que exiba a aplicaçaõ em em construção
//formalário para envio da mensagem
// listagem de visitas nome, mensagem do visitante e data de cadastro da visita
//post

//Criando raiz
app.get("/", function(req, res){
    res.send(`
        <html>
            <head> 
            <title>Cadastro de Mensagens</title>
            </head>

            <body>
                <h1 class="titulo">Livro de Visitas</h1>
                <ul>
                    <li><a href="/listar_mensagens">Listar mensagens</a></li>
                    <li><a href="/form-inserir-mansagem">Cadastrar Mensagem</a></li>
                </ul>
            </nody>

            <script>

            </script>
        </html>    
    `);
})

//Cadastrar a notícia
app.post("/livro_visitas", async function (req, res) {
  const {nome, conteudo} = req.body;

  try {
    const client = await pool.connect();
    await client.query(
      "INSERT INTO livro_visitas(nome, conteudo, data_criacao) VALUES ($1, $2, Now())",
      [nome,conteudo]
    );
    client.release();
    res.send("Mensagem cadastrada com sucesso!");
  } catch (error) {
    console.error("Erro ao cadastrar Mensagem:", error);
    res.status(500).send("Erro ao cadastrar notícia.");
  }
});


    
app.get('/listar_mensagens', async function(req, res){
    try{
        const client = await pool.connect();

        const result = await client.query(
          "SELECT id, nome, conteudo FROM livro_visitas ORDER by data_criacao DESC"  
        );

        const mensagem = result.rows;

        let table = "<table border = 1>";

        table += "<tr><th>Id</th><th>Nome</th><th>Conteudo</th></tr>";

        mensagem.forEach((umaMensagem) => {
            table += `<tr><td>${umaMensagem.id}</td><td>${umaMensagem.nome}</td><td>${umaMensagem.conteudo}</td></tr>`
        });

        table += "</table>"

        client.release();

        res.send(table);
    }
    catch(err){
        console.error("Erro ao executar consulta: ", err);
        res.status(500).json({error: "Erro interno do servidor"});
    }
});


app.get("/form-inserir-mansagem", function(req,res){
    res.sendFile(__dirname + "/mensagem.html");
});

app.listen(porta, ipDoServidor, function(){
    console.log('\n Aplicacao web executando em http://'+ipDoServidor+':'+porta);
})