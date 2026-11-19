package br.com.fiap.medisus.distribuicao.app.dto;

import java.time.Instant;

public record TestadorResponse(
        Long id,
        String email,
        String nome,
        String linkConvite,
        Instant convidadoEm,
        long downloads,
        Instant ultimoDownload
) {
}
