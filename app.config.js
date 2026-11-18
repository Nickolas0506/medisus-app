// Completa o app.json com o commit de referencia, exibido na tela "Sobre o App".
// O hash e lido do Git no momento do build, entao o app publicado aponta para o codigo exato.
const { execSync } = require('child_process');

function git(comando) {
  try {
    return execSync(`git ${comando}`, { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
  } catch {
    return '';
  }
}

const commit = process.env.MEDISUS_COMMIT || git('rev-parse HEAD') || 'desconhecido';

module.exports = ({ config }) => ({
  ...config,
  extra: {
    ...config.extra,
    commit,
    commitCurto: commit.slice(0, 7),
    commitData: git('log -1 --format=%cI'),
    alteracoesPendentes: git('status --porcelain --untracked-files=no') !== '',
  },
});
