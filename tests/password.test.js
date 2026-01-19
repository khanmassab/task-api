const { hashPassword, comparePassword } = require('../src/utils/password');

describe('password utils', () => {
  it('hashes and verifies passwords', async () => {
    const plain = 'SuperSecret123!';
    const hashed = await hashPassword(plain);

    expect(hashed).not.toEqual(plain);
    expect(await comparePassword(plain, hashed)).toBe(true);
    expect(await comparePassword('wrong', hashed)).toBe(false);
  });
});
