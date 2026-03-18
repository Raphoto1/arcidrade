import { describe, it, expect } from 'vitest';
import bcrypt from 'bcrypt';
import { encrypt, compare } from '@/utils/encrypter';

describe('encrypt', () => {
  it('genera un hash para la contraseña dada', async () => {
    const password = 'contraseña123';
    const hash = await encrypt(password);
    expect(hash).toBeDefined();
    expect(typeof hash).toBe('string');
    expect(hash.length).toBeGreaterThan(0);
  });

  it('el hash generado es distinto al texto original', async () => {
    const password = 'miContraseña';
    const hash = await encrypt(password);
    expect(hash).not.toBe(password);
  });

  it('los hashes de la misma contraseña son siempre distintos (salt aleatorio)', async () => {
    const password = 'mismaContraseña';
    const hash1 = await encrypt(password);
    const hash2 = await encrypt(password);
    expect(hash1).not.toBe(hash2);
  });

  it('el hash puede ser verificado con bcrypt', async () => {
    const password = 'verificable123';
    const hash = await encrypt(password);
    const isValid = bcrypt.compareSync(password, hash);
    expect(isValid).toBe(true);
  });

  it('el hash rechaza contraseñas incorrectas', async () => {
    const password = 'correcta';
    const wrong = 'incorrecta';
    const hash = await encrypt(password);
    const isValid = bcrypt.compareSync(wrong, hash);
    expect(isValid).toBe(false);
  });
});

describe('compare', () => {
  it('textFromDb es true cuando data coincide con el hash', async () => {
    const password = 'contraseña_correcta';
    const hash = bcrypt.hashSync(password, 10);
    const { textFromDb } = await compare(password, 'otra_cosa', hash);
    expect(textFromDb).toBe(true);
  });

  it('textFromForm es true cuando dbData coincide con el hash', async () => {
    const password = 'contraseña_correcta';
    const hash = bcrypt.hashSync(password, 10);
    const { textFromForm } = await compare('otra_cosa', password, hash);
    expect(textFromForm).toBe(true);
  });

  it('ambos son false cuando ninguno coincide con el hash', async () => {
    const original = 'original';
    const hash = bcrypt.hashSync(original, 10);
    const { textFromDb, textFromForm } = await compare('incorrecta1', 'incorrecta2', hash);
    expect(textFromDb).toBe(false);
    expect(textFromForm).toBe(false);
  });

  it('ambos son true cuando data y dbData son iguales al hash', async () => {
    const password = 'mismoValor';
    const hash = bcrypt.hashSync(password, 10);
    const { textFromDb, textFromForm } = await compare(password, password, hash);
    expect(textFromDb).toBe(true);
    expect(textFromForm).toBe(true);
  });
});
