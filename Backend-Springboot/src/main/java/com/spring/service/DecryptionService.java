package com.spring.service;

import java.util.Base64;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.stereotype.Service;

@Service
public class DecryptionService {
  private static final String SECRET_KEY = "rX9Ky7m2Pn4Vt3Lq1Zs8Fb6Hj0Cw5Dg9";
  private static final String ALGORITHM = "AES";

  public String decrypt(String encryptedPassword) throws Exception {
    SecretKeySpec secretKey = new SecretKeySpec(SECRET_KEY.getBytes(), ALGORITHM);
    Cipher cipher = Cipher.getInstance(ALGORITHM);
    cipher.init(Cipher.DECRYPT_MODE, secretKey);
    return new String(cipher.doFinal(Base64.getDecoder().decode(encryptedPassword)));
  }
}
