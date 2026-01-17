Livro de Visitas – Node.js + Express + PostgreSQL

    Aplicação web simples de Livro de Visitas, desenvolvida em Node.js com Express e PostgreSQL,
    permitindo que visitantes cadastrem mensagens e visualizem mensagens anteriores em uma tabela HTML.

📌 Tecnologias Utilizadas
    
    Node.js
    
    Express
    
    PostgreSQL
    
    Body-parser (parsing de formulário)
    
    HTML + CSS (arquivos estáticos em public/)

⚙️ Funcionalidades

    1- Página inicial (/)

      Exibe links para listar mensagens e cadastrar nova mensagem
    
      Mensagem de boas-vindas em HTML
      
    2- Cadastro de mensagens (POST /livro_visitas)
      
      Campos: nome_visitante, titulo, conteudo
      
      Limite de 300 caracteres para o conteúdo
      
      Validação de palavras proibidas, retornando erro se encontradas
      
      Substituição de palavras inadequadas por *******
    
      Inserção segura no banco com query parametrizada
    
    3- Listagem de mensagens (GET /listar_mensagens)
      
      Consulta PostgreSQL e exibe mensagens em tabela HTML
      
      Campos exibidos: Id, Nome do visitante, Título e Conteúdo
      
      Ordenadas por data de criação (mais recente primeiro)
    
    4- Formulário de cadastro (/form-inserir-mansagem)
    
      HTML simples com campos para envio de novas mensagens
