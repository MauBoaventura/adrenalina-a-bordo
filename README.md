# Adrenalina a Bordo

**POSTMAN: https://documenter.getpostman.com/view/10582029/Szt8eVeA**

## Executar as Migrates:
- npx knex migrate:latest
- npx knex migrate:rollback

Olá! Esta é uma API REST que realiza a apuração de corridas de aventura   

Contém endpoints para cadastro de usuarios além de outras funcionalidades da aplicação como lançamentos de tempo, configurações da corrida e geração de relatórios.

É uma API feita com Javascript (Node.js), trabalha com banco de dados relacional (MySQL) e como ferramenta de autorização usa JSON WEB Tokem (JWT) 

## Endpoints:

### Login

#### Cliente (POST)

- Realiza uma pesquisa na base de dados de clientes e retorna um JWT e os dados do cliente 

### Cliente

#### Cadastro (POST)

- Cadastra um cliente passando todos os dados:

name, email, telefone, endereco, diasParaPagar.

#### Listar um (GET)

- Recupera do banco de dados as informações de um cliente

#### Listar todos (GET)

- Recupera do banco de dados as informações de todos cliente

#### Apagar (DELETE) - Necessário estar autenticado e com um Token JWT

- Apaga do banco de dados as informações de um cliente

#### Modificar (PUT) - Necessário estar autenticado e com um Token JWT

- Altera do banco de dados as informações de um cliente

	name, email, telefone, endereco, diasParaPagar


### Tabela de preços de venda

#### Cadastro (POST) - Necessário estar autenticado e com um Token JWT

- Cadastra uma loja passando todos os dados:
	  
    name,  valor, dataInicio dataFim

#### Listar um (GET)

- Recupera do banco de dados as informações de uma tabela de preço

#### Listar todos (GET)

- Recupera do banco de dados as informações de todas tabela de preço

#### Apagar (DELETE) - Necessário estar autenticado e com um Token JWT

- Apaga do banco de dados as informações de uma tabela de preço

#### Modificar (PUT) - Necessário estar autenticado e com um Token JWT

- Altera do banco de dados as informações de uma tabela de preço

	name,  valor, dataInicio dataFim


### Pedido

#### Cadastro (POST) - Necessário estar autenticado e com um Token JWT

- Cadastra um pedido passando todos os dados:
	  clienteId,  dataPedido,  dataVencimentoPedido,  quilo,  tabelaId,  desconto,  frete,  totalDaNota,  situacao,  tabelaCompraId,  valorLucro

#### Listar um (GET)

- Recupera do banco de dados as informações de um pedido

#### Listar todos (GET)

- Recupera do banco de dados as informações de todos pedido

#### Apagar (DELETE) - Necessário estar autenticado e com um Token JWT

- Apaga do banco de dados um pedido setando um novo status

#### Modificar (PUT) - Necessário estar autenticado e com um Token JWT

- Altera do banco de dados as informações de um pedido

	clienteId,  dataPedido,  dataVencimentoPedido,  quilo,  tabelaId,  desconto,  frete,  totalDaNota,  situacao,  tabelaCompraId,  valorLucro

