# MediSUS — App Mobile

**Grupo Urbis · Global Solution 2026/2 (CitizenTech) · FIAP · Mobile Application Development**

O paciente sai do médico, vai até a UBS e o remédio está em falta. O MediSUS mostra **antes de sair de casa**
em qual UBS o remédio está disponível, lê a foto da receita com IA e avisa quando o remédio chegar.
ODS 3 (Saúde e bem-estar) e ODS 10 (Redução das desigualdades).

- Vídeo (até 5 min): _link do YouTube_
- API Java consumida pelo app: _link da API no ar_
- Contrato da API: [docs/contrato-api.md](docs/contrato-api.md)

## Integrantes

| Nome          | RM       |
| ------------- | -------- |
| Nickolas Davi | RM564105 |
| Rodrigo       | RM       |
| Otávio        | RM       |
| Natália       | RM       |
| Samara        | RM       |

## Telas

| Tela                   | O que faz                                                          |
| ---------------------- | ------------------------------------------------------------------ |
| Login                  | Autenticação real na API (JWT), validação e mensagem de erro       |
| Cadastro               | Cria a conta de cidadão e já entra no app                          |
| Buscar remédio         | Busca por nome ou princípio ativo (paginada na API)                |
| Onde tem               | Estoque do remédio em cada UBS, "Como chegar", Farmácia Popular    |
| Ler receita            | Foto (câmera/galeria) → IA da API lê os remédios → UBS com cada um |
| Meus alertas           | **CRUD**: lista, liga/pausa (update) e exclui alertas de reposição |
| Novo/Editar alerta     | **CRUD**: cria e edita o alerta (remédio, UBS, ligado)             |
| Dúvida sobre o remédio | Pergunta respondida pela IA com base na bula (RAG)                 |
| Perfil                 | Dados do usuário e **logout**                                      |
| Sobre o App            | Hash do commit de referência (não conta nas 6 telas)               |

Sem login só existem as telas de Login e Cadastro: as demais nem são registradas na navegação.
Token vencido (401) faz logout automático. O token fica no SecureStore (Keystore/Keychain).

## Tecnologias e por que cada uma

| Biblioteca                                      | Uso                                                     |
| ----------------------------------------------- | ------------------------------------------------------- |
| Expo SDK 57 / React Native 0.86                 | Base do app                                             |
| React Navigation 7 (native-stack + bottom-tabs) | Navegação e proteção de rotas                           |
| Axios                                           | Chamadas à API, com interceptors para JWT e 401         |
| TanStack Query                                  | Cache, loading/erro e recarregar a lista depois do CRUD |
| expo-secure-store                               | Guardar o token com segurança                           |
| expo-image-picker                               | Foto da receita (câmera ou galeria)                     |
| @expo-google-fonts/nunito                       | Fonte da identidade visual                              |
| ESLint (eslint-config-expo) + Prettier          | Padrão de código                                        |

## Estrutura

```
assets/          imagens (PNG) geradas dos SVGs da identidade visual em assets/svg
src/
  components/    componentes visuais reutilizáveis (Botao, Campo, Cartao, Estados...)
  config/        URL da API, versão (commit) e QueryClient
  contexts/      AuthContext (login, cadastro, logout, sessão)
  hooks/         hooks de dados (TanStack Query) por assunto
  navigation/    navegadores e tipos das rotas
  screens/       telas (auth/ = login e cadastro)
  services/      acesso à API com Axios, um arquivo por recurso
  theme/         cores, fontes, espaçamentos e imagens
  types/         tipos dos JSON da API
  utils/         validação, formatação e mensagens de erro
```

## Como rodar

```bash
npm install
cp .env.example .env      # EXPO_PUBLIC_API_URL = endereço da API Java
npm start                 # Expo (a = Android, w = navegador)
npm run lint              # ESLint + Prettier
npm run typecheck         # TypeScript
```

Usuário de teste: `cidadao@medisus.com` / `medisus123`.

## Publicação

O APK é gerado a partir de um commit do `main` e publicado na **API de distribuição do MediSUS**
(`distribuicao-api/`, Java + Spring Boot), que faz o papel do Firebase App Distribution: o professor é
cadastrado como testador pelo e-mail institucional, recebe um link de convite e baixa o APK; todo download
fica registrado no painel. A tela **Sobre o App** mostra o hash desse commit (lido do Git no build pelo
`app.config.js`), então a versão publicada corresponde exatamente ao código do repositório.

```bash
MEDISUS_ADMIN_TOKEN=... MEDISUS_DISTRIBUICAO_URL=https://<api-de-distribuicao>   ./scripts/distribuir.sh caminho/do/app.apk professor@fiap.com.br
```

Detalhes em [`distribuicao-api/README.md`](distribuicao-api/README.md).

## Uso de IA

- **Claude (Anthropic)**: apoio na escrita do código, revisão e documentação. Todo o código foi revisado
  e é explicado pelo grupo.
- A IA que lê a receita e responde dúvidas da bula roda na **API Java** (Spring AI); o app só envia a foto/
  pergunta e mostra o resultado.
