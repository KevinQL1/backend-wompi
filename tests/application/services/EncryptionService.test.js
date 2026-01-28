import { EncryptionService } from '#/application/services/EncryptionService.js'

describe('EncryptionService', () => {
  const validKey = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef' // 32 bytes hex
  const validIV = 'abcdef9876543210abcdef9876543210' // 16 bytes hex

  it('should throw an error if ENCRYPTION_KEY or ENCRYPTION_IV is missing', () => {
    expect(() => new EncryptionService('', '')).toThrow(
      'Encryption key and IV must be defined in environment variables'
    )
  })

  it('should encrypt and decrypt text correctly', () => {
    const service = new EncryptionService(validKey, validIV)
    const plainText = '4111111111111111' // tarjeta de ejemplo
    const encrypted = service.encrypt(plainText)
    expect(encrypted).not.toBe(plainText)

    const decrypted = service.decrypt(encrypted)
    expect(decrypted).toBe(plainText)
  })

  it('should return valid hex ciphertext for same text', () => {
    const service = new EncryptionService(validKey, validIV)
    const text = 'test123'
    const encrypted1 = service.encrypt(text)
    const encrypted2 = service.encrypt(text)
    expect(encrypted1).toMatch(/^[0-9a-f]+$/)
    expect(encrypted2).toMatch(/^[0-9a-f]+$/)
  })
})
