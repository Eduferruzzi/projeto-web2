package br.com.projetoweb2.service;

import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;

@Service
public class PasswordService {
    private static final int SALT_SIZE = 16;
    private final SecureRandom secureRandom = new SecureRandom();

    public String hash(String senha) {
        byte[] salt = new byte[SALT_SIZE];
        secureRandom.nextBytes(salt);
        return toHex(salt) + "$" + toHex(digest(senha, salt));
    }

    public boolean matches(String senha, String armazenada) {
        if (senha == null || armazenada == null) {
            return false;
        }

        String[] partes = armazenada.split("\\$", -1);
        if (partes.length != 2) {
            return false;
        }

        byte[] salt;
        try {
            salt = fromHex(partes[0]);
        } catch (IllegalArgumentException exception) {
            return false;
        }

        String hashCalculado = toHex(digest(senha, salt));
        return MessageDigest.isEqual(
                hashCalculado.getBytes(StandardCharsets.US_ASCII),
                partes[1].getBytes(StandardCharsets.US_ASCII));
    }

    private byte[] digest(String senha, byte[] salt) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            digest.update(salt);
            return digest.digest(senha.getBytes(StandardCharsets.UTF_8));
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 não disponível.", exception);
        }
    }

    private String toHex(byte[] bytes) {
        StringBuilder resultado = new StringBuilder(bytes.length * 2);
        for (byte valor : bytes) {
            resultado.append(String.format("%02x", valor & 0xff));
        }
        return resultado.toString();
    }

    private byte[] fromHex(String valor) {
        if (valor.length() != SALT_SIZE * 2) {
            throw new IllegalArgumentException("Salt inválido.");
        }

        byte[] resultado = new byte[SALT_SIZE];
        for (int indice = 0; indice < resultado.length; indice++) {
            int posicao = indice * 2;
            int alto = Character.digit(valor.charAt(posicao), 16);
            int baixo = Character.digit(valor.charAt(posicao + 1), 16);
            if (alto < 0 || baixo < 0) {
                throw new IllegalArgumentException("Salt inválido.");
            }
            resultado[indice] = (byte) ((alto << 4) + baixo);
        }
        return resultado;
    }
}
