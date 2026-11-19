package br.com.fiap.medisus.distribuicao.app.dto;

import java.util.List;

/** O que o testador ve ao abrir o link de convite. */
public record ConviteResponse(String email, String nome, List<VersaoResponse> versoes) {
}
