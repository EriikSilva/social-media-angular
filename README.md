<h1>Social Media com Angular e mongoDB</h1>

Este mini projeto apresenta o desenvolvimento basico de como fazer login, guardar o login, postar conteudo com imagem, editar conteudo, excluir conteudo e fazer logout

> O projeto apresenta um conteudo elaborado como por exemplo o usuario so podera excluir e editar os posts que ele criou logado com a propria conta 


<b>Features:</b>
- Toolbar
  - Login 
  - Criar Conta
- Toolbar (Logado)
  - Criar Novo Post
  - Logout
- Login
  - Espaço para digitar email e senha
- Criar Conta
  - Espaço para criar conta com email e senha
- Posts (Sem login)
  - Visualizar Posts Feitos pelos usuarios
- Posts (Logado)
   - Visualizar Posts Feitos pelos usuarios
   - Criar Posts com imagens
   - Sessão Guardada
   - Editar seu post
   - Deletar seu post
# 💾 Instalação
- Necessario Node e Angular
- Clonar o projeto ```git clone https://github.com/github.com/social-media-angular.git```
- Rodar o comando pelo cmd na pasta do projeto ```npm install```
- Para rodar o back-end é necessario ter uma conta no mongoDB criar um cluster e copiar sua senha e colar no projeto em ```nodemon.json```
<h4>No seu cluster copiar o codigo para a sua aplicação em app.js linha 20</h4>
 <img src="https://user-images.githubusercontent.com/61124602/214821232-75e1fa34-b21f-4a69-b474-488d5c5bcfc1.png">
<h4>Necessario criar um arquivo na pasta com sua senha na pasta backend chamado nodemon.json com o seguinte conteudo</h4?>
 
 ```
{
    "env": {
      "MONGO_ATLAS_PW": "SUA SENHA DO MONGODB AQUI",
      "JWT_KEY": "SEGREDO DO TOKEN AQUI"
    }
 }
```

- Entrar na pastar ```backend``` e rodar o comando no terminal ```nodemon server.js```
- Rodar o front com o terminal ```ng serve``` e acessar ```http://localhost:4200``` :)


<h2>IMAGENS</h2>
<h3>Logado</h3>
 <img src="https://user-images.githubusercontent.com/61124602/214822125-70efbf8c-5995-40e7-beb8-1fc666528a27.png">
 
<h3>Login</h3>
 <img src="https://user-images.githubusercontent.com/61124602/214822318-43b14d7c-59c2-4f25-92f5-007ab097c8ef.png">




  
