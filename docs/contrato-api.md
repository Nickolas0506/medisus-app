# Contrato da API Java usado pelo app MediSUS

O app consome a API Spring Boot do grupo (Java Advanced). Este arquivo lista **exatamente** as rotas e
os JSON que o app espera. Se a API mudar algum nome, avise o Nickolas para ajustar o app.

- Autenticação: header `Authorization: Bearer <token>` em todas as rotas, menos `/auth/*`.
- Paginação: as listas devolvem a `Page` do Spring Data (`content` + `totalElements`/`totalPages`/`number`,
  ou o formato novo `content` + `page {...}` — o app aceita os dois). Parâmetros: `page`, `size`, `sort`.
- Erros (`@RestControllerAdvice`): o app mostra o campo `mensagem` e, se houver, o primeiro item de `campos`.

```json
{
  "status": 400,
  "erro": "Bad Request",
  "mensagem": "Dados inválidos",
  "campos": [{ "campo": "email", "mensagem": "deve ser um e-mail válido" }]
}
```

- `401` em rota protegida = token vencido: o app faz logout sozinho e volta para o login.

## Autenticação

| Método | Rota             | Corpo                    | Resposta                                            |
| ------ | ---------------- | ------------------------ | --------------------------------------------------- |
| POST   | `/auth/cadastro` | `{ nome, email, senha }` | `201` `{ token, usuario }` — papel sempre `CIDADAO` |
| POST   | `/auth/login`    | `{ email, senha }`       | `200` `{ token, usuario }` / `401` senha errada     |

`usuario` = `{ id, nome, email, papel }` com papel `CIDADAO`, `FARMACEUTICO` ou `GESTOR`.
E-mail repetido no cadastro: `409`.

## Consulta (cidadão)

| Método | Rota                                                | Uso no app                                                                        |
| ------ | --------------------------------------------------- | --------------------------------------------------------------------------------- |
| GET    | `/medicamentos?nome=losar&page=0&size=20&sort=nome` | Buscar remédio (busca por nome **ou** princípio ativo, sem diferenciar maiúscula) |
| GET    | `/medicamentos/{id}`                                | Cabeçalho da tela "Onde tem"                                                      |
| GET    | `/estoques?medicamentoId=1&page=0&size=100`         | Tela "Onde tem": estoque do remédio em **cada** UBS (inclusive as zeradas)        |
| GET    | `/ubs?page=0&size=100&sort=nome`                    | Escolher a UBS no alerta                                                          |

```json
// Medicamento
{ "id": 1, "nome": "Losartana", "principioAtivo": "Losartana potássica", "dosagem": "50 mg", "farmaciaPopular": true }
// Ubs
{ "id": 1, "nome": "UBS Vila Mariana", "bairro": "Vila Mariana", "endereco": "R. Domingos de Morais, 100",
  "latitude": -23.589, "longitude": -46.634 }
// Estoque (ubs e medicamento vêm aninhados)
{ "id": 7, "ubs": { ...Ubs }, "medicamento": { ...Medicamento }, "quantidade": 30, "quantidadeMinima": 5,
  "atualizadoEm": "2026-11-17T14:30:00Z" }
```

## Alertas de reposição (CRUD do app)

Sempre do **usuário logado** (pegar pelo token, nunca pelo corpo).

| Método | Rota                                         | Corpo                             | Resposta                         |
| ------ | -------------------------------------------- | --------------------------------- | -------------------------------- |
| GET    | `/alertas?page=0&size=50&sort=criadoEm,desc` | –                                 | `Page<Alerta>`                   |
| GET    | `/alertas/{id}`                              | –                                 | `Alerta` (`404` se não for dele) |
| POST   | `/alertas`                                   | `{ medicamentoId, ubsId, ativo }` | `201` `Alerta`                   |
| PUT    | `/alertas/{id}`                              | `{ medicamentoId, ubsId, ativo }` | `200` `Alerta`                   |
| DELETE | `/alertas/{id}`                              | –                                 | `204`                            |

`ubsId` pode ser `null` (= avisar em qualquer UBS).

```json
// Alerta
{ "id": 3, "medicamento": { ...Medicamento }, "ubs": null, "ativo": true,
  "criadoEm": "2026-11-17T14:30:00Z", "avisadoEm": null }
```

`avisadoEm` é preenchido pelo **consumidor do RabbitMQ** quando chega o evento `estoque.reposto` daquele
remédio (e da UBS, se o alerta tiver UBS). O app mostra "Chegou!" quando o campo não é nulo.

## IA (Spring AI)

| Método | Rota               | Corpo                                              | Resposta                   |
| ------ | ------------------ | -------------------------------------------------- | -------------------------- |
| POST   | `/receitas/ler`    | `multipart/form-data`, campo **`foto`** (jpeg/png) | `LeituraReceita`           |
| POST   | `/bulas/perguntar` | `{ medicamentoId, pergunta }`                      | `{ resposta, fontes: [] }` |

```json
// LeituraReceita: um item por remédio lido. medicamento = null quando não existe no cadastro do SUS.
{ "itens": [
  { "textoLido": "Losartana 50mg", "dose": "1 cp de 12/12h", "medicamento": { ...Medicamento },
    "estoques": [ { ...Estoque } ] },
  { "textoLido": "Rivaroxabana 20mg", "dose": "1x ao dia", "medicamento": null, "estoques": [] }
] }
```

A leitura pode demorar: o app espera até 90 s em `/receitas/ler` e 60 s em `/bulas/perguntar`.

## Usuário de teste que o app usa no vídeo e na correção

`cidadao@medisus.com` / `medisus123` (papel `CIDADAO`), com remédios em falta e em estoque no banco.
