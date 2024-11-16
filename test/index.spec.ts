import PocketRestLib from '../src/index';

describe('index', () => {
  describe('PocketRestLib', () => {
    it('should return a class containing the baseurl', () => {
      const message = 'Hello';

      const result = new PocketRestLib(message);

      expect(result).toMatch(message);
    });
  });
});
