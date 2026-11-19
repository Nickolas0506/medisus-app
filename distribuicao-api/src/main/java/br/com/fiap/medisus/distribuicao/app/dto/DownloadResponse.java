package br.com.fiap.medisus.distribuicao.app.dto;

import java.time.Instant;

public record DownloadResponse(String email, String versao, String commit, Instant data) {
}
