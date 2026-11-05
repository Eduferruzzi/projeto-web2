package br.com.projetoweb2.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class MailService {
    private final JavaMailSender mailSender;
    private final String remetente;

    public MailService(
            JavaMailSender mailSender,
            @Value("${app.mail.from}") String remetente) {
        this.mailSender = mailSender;
        this.remetente = remetente;
    }

    public void enviarSenhaInicial(String destinatario, String nome, String senha) {
        SimpleMailMessage mensagem = new SimpleMailMessage();
        mensagem.setFrom(remetente);
        mensagem.setTo(destinatario);
        mensagem.setSubject("Sua senha de acesso");
        mensagem.setText("""
                Olá, %s!

                Seu cadastro foi realizado. Sua senha de acesso é: %s

                Use essa senha para entrar no sistema.
                """.formatted(nome, senha));
        mailSender.send(mensagem);
    }
}
