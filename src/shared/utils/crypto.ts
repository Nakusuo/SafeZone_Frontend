/**
 * Simulated E2EE Cryptography Service
 * Uses Web Crypto API (AES-GCM) to simulate encryption/decryption
 */

const getKeyMaterial = async (password: string) => {
  const enc = new TextEncoder()
  return await window.crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  )
}

export const getSessionKey = async (): Promise<CryptoKey> => {
  // In a real scenario, this key is exchanged securely between parties using asymmetric cryptography (e.g., ECDH).
  // Here we use a static mock session secret for demonstration.
  const keyMaterial = await getKeyMaterial('safezone-e2ee-session-secret-2026')
  return await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: new TextEncoder().encode('safezone-salt'),
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )
}

export const encryptData = async (data: string): Promise<string> => {
  const key = await getSessionKey()
  const iv = window.crypto.getRandomValues(new Uint8Array(12))
  const encoded = new TextEncoder().encode(data)
  
  const ciphertext = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoded
  )
  
  // Combine IV and Ciphertext and convert to base64
  const combined = new Uint8Array(iv.length + ciphertext.byteLength)
  combined.set(iv, 0)
  combined.set(new Uint8Array(ciphertext), iv.length)
  
  return btoa(String.fromCharCode(...combined))
}

export const decryptData = async (encryptedBase64: string): Promise<string> => {
  try {
    const key = await getSessionKey()
    const binaryStr = atob(encryptedBase64)
    const combined = new Uint8Array(binaryStr.length)
    for (let i = 0; i < binaryStr.length; i++) {
      combined[i] = binaryStr.charCodeAt(i)
    }
    
    const iv = combined.slice(0, 12)
    const ciphertext = combined.slice(12)
    
    const decrypted = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      ciphertext
    )
    
    return new TextDecoder().decode(decrypted)
  } catch (err) {
    console.error('Decryption failed:', err)
    return '🔒 [Error: Mensaje Corrupto o Clave Inválida]'
  }
}
