package br.com.fiap.medisus.distribuicao.app.dto;

import br.com.fiap.medisus.distribuicao.app.VersaoApp;

import java.time.Instant;

public record VersaoResponse(
        Long id,
        String versao,
        String commit,
        String notas,
        long tamanho,
        Instant publicadaEm,
        String arquivo
) {
    public static VersaoResponse de(VersaoApp v) {
        return new VersaoResponse(v.getId(), v.getVersao(), v.getCommit(), v.getNotas(), v.getTamanho(),
                v.getPublicadaEm(), v.nomeArquivo());
    }
}
