# MediSUS — API de distribuição do APK

API em **Java 21 + Spring Boot 3** que distribui o APK do app MediSUS para testadores, no lugar do
Firebase App Distribution.

- quem publica envia o APK (com a versão e o hash do commit) e cadastra os testadores pelo e-mail;
- cada testador recebe um link de convite (`/distribuicao/?c=CODIGO`) e só ele consegue baixar;
- todo download fica registrado e aparece no painel (`/distribuicao/painel`);
- o APK fica guardado no banco (PostgreSQL em produção, H2 local), então sobrevive a novos deploys.

## Rodar local

```bash
cd distribuicao-api
mvn package -DskipTests
MEDISUS_ADMIN_TOKEN=um-token-forte java -jar target/medisus-distribuicao.jar   # porta 8080
```

Ou com Docker: `docker build -t medisus-distribuicao . && docker run -p 8080:8080 -e MEDISUS_ADMIN_TOKEN=... medisus-distribuicao`.

## Variáveis de ambiente

| Variável | Para quê |
| --- | --- |
| `MEDISUS_ADMIN_TOKEN` | obrigatório para publicar APK e convidar testadores (header `X-Admin-Token`) |
| `MEDISUS_URL_PUBLICA` | opcional; endereço público usado nos links de convite |
| `SPRING_DATASOURCE_URL` / `USERNAME` / `PASSWORD` | PostgreSQL em produção (sem isso usa H2 em arquivo) |
| `PORT` | porta HTTP (padrão 8080) |

## Rotas

| Método | Rota | Quem usa |
| --- | --- | --- |
| GET | `/saude` | verificação de saúde |
| GET | `/distribuicao/ultima` | última versão publicada |
| GET | `/distribuicao/convites/{codigo}` | testador: dados do convite e versões |
| GET | `/distribuicao/convites/{codigo}/versoes/{id}/apk` | testador: baixa o APK (registra o download) |
| GET/POST | `/distribuicao/admin/versoes` | admin: lista / publica APK (multipart `apk`, `versao`, `commit`, `notas`) |
| DELETE | `/distribuicao/admin/versoes/{id}` | admin: remove versão |
| GET/POST | `/distribuicao/admin/testadores` | admin: lista / convida testador (`{"email","nome"}`) |
| DELETE | `/distribuicao/admin/testadores/{id}` | admin: remove testador |
| GET | `/distribuicao/admin/downloads` | admin: histórico de downloads |

Páginas: `/distribuicao/?c=CODIGO` (testador) e `/distribuicao/painel` (admin, pede o token).

## Publicar uma versão

Na raiz do repositório:

```bash
MEDISUS_ADMIN_TOKEN=... MEDISUS_DISTRIBUICAO_URL=https://<api-de-distribuicao> \
  ./scripts/distribuir.sh caminho/do/app.apk professor@fiap.com.br
```

O script envia o APK com o hash do commit atual (`git rev-parse HEAD`) e convida os e-mails informados.
