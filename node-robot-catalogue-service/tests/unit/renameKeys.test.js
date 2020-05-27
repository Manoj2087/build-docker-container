const renameKeys = require('../../utils/renameKeys')

describe('Unit Test:', () => {
    describe('utils:renameKeys ', () => {
        it('should rename the objects keys', () => {
            oldObject = [{
                'a': 1,
                'b': 2
            }];
            newKeys = ['c', 'd'];
            newObject = renameKeys(oldObject, newKeys);
            expectedObject = [{
                'c': 1,
                'd': 2
            }];
            expect(newObject).toMatchObject(expectedObject);
        })
    })
})