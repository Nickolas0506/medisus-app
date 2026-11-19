package br.com.fiap.medisus.distribuicao.app;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DownloadRepository extends JpaRepository<Download, Long> {
    List<Download> findAllByOrderByDataDesc();
    void deleteByTestadorId(Long testadorId);
    void deleteByVersaoId(Long versaoId);
}
