import PocketRestWrapper from "../src/index";

describe('index', () => {
  describe('PocketRestWrapper', () => {
    it('should return a class containing the baseurl', () => {
      const message = 'Hello';

      const result = new PocketRestWrapper(message);

      expect(result).toMatch(message);
    });
  });
});
