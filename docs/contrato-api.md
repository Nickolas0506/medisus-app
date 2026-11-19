# API Java usada pelo app MediSUS

API do grupo (Java Advanced, Spring Boot): **https://medisus.onrender.com** — Swagger em
`/swagger-ui/index.html`. O app usa `https://medisus.onrender.com/api` como endereço-base
(`extra.apiUrlProducao` no `app.json`).

A API responde em inglês; os services do app (`src/services`) convertem para os modelos em português das
telas (`src/types/api.ts`) em `src/services/conversores.ts`. Os DTOs da API estão em `src/types/apiJava.ts`.

| Tela do app        | Rota da API                                                                            |
| ------------------ | -------------------------------------------------------------------------------------- |
| Login              | `POST /api/auth/login` `{ email, password }` → `{ token, role, name }`                 |
| Cadastro           | `POST /api/auth/register` `{ name, email, password }` e depois o login                 |
| Buscar remédio     | `GET /api/medications` (o app filtra por nome/princípio ativo)                         |
| Onde tem           | `GET /api/medications/{id}`, `GET /api/stocks?medicationId=`, `GET /api/ubs`           |
| Ler receita        | `POST /api/prescriptions/identify` (multipart, campo `image`)                          |
| Meus alertas       | `GET /api/alerts`, `DELETE /api/alerts/{id}`, `GET /api/notifications`                 |
| Novo/Editar alerta | `POST /api/alerts` `{ medicationId, ubsId }` (editar = cria o novo e encerra o antigo) |

- Autenticação: `Authorization: Bearer <token>` em tudo, menos `/api/auth/*`. `401` = logout automático.
- O "Chegou!" do alerta vem de `/api/notifications`, gravadas pela API quando o RabbitMQ avisa que o
  estoque do remédio subiu.
- Senha com no mínimo 8 caracteres. Só o gestor/farmacêutico cadastra UBS, remédios e estoque.
- O Render gratuito "dorme": a primeira chamada pode levar até 1 minuto (o app espera 70 s).

Usuário de teste (cidadão): `cidadao@medisus.com` / `medisus123`.
