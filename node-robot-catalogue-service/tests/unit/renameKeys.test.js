const renameKeys = require('../../utils/renameKeys');

describe('Unit Test:', () => {
  describe('utils:renameKeys ', () => {
    it('should rename the objects keys', () => {
      const oldObject = [{
        a: 1,
        b: 2,
      }];
      const newKeys = ['c', 'd'];
      const newObject = renameKeys(oldObject, newKeys);
      const expectedObject = [{
        c: 1,
        d: 2,
      }];
      expect(newObject).toMatchObject(expectedObject);
    });
  });
});
