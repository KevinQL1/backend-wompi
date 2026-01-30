describe('config/index', () => {
  it('should load environment variables into config', async () => {
    // Simulate env vars
    process.env.STAGE = 'ci'
    process.env.WOMPI_PUBLIC_KEY = 'pub'
    process.env.WOMPI_INTEGRITY_KEY = 'int'
    process.env.PRODUCT_TABLE = 'pt'
    process.env.CUSTOMER_TABLE = 'ct'
    process.env.TRANSACTION_TABLE = 'tt'
    process.env.DELIVERY_TABLE = 'dt'

    // Dynamic import after setting env vars so module reads them
    const { config: cfg } = await import('#/config/index.js')

    expect(cfg.stage).toBe('ci')
    expect(cfg.wompiPrivateKey).toBe('pub')
    expect(cfg.wompiIntegrityKey).toBe('int')
    expect(cfg.productTable).toBe('pt')
    expect(cfg.customerTable).toBe('ct')
    expect(cfg.transactionTable).toBe('tt')
    expect(cfg.deliveryTable).toBe('dt')
  })
})