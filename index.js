// Test utils

const testBlock = (name) => {
    console.groupEnd();
    console.group(`# ${name}\n`);
  };
  
  // Compare primitives and arrays of primitives
  const areEqual = (a, b) => {
    if (Array.isArray(a) && Array.isArray(b)) {
      return a.join() === b.join();
    }
  
    return a === b;
  };
  
  const test = (whatWeTest, actualResult, expectedResult) => {
    if (areEqual(actualResult, expectedResult)) {
      console.log(`[OK] ${whatWeTest}\n`);
    } else {
      console.error(`[FAIL] ${whatWeTest}`);
      console.debug('Expected:');
      console.debug(expectedResult);
      console.debug('Actual:');
      console.debug(actualResult);
      console.log('');
    }
  };
  
  // Functions
  
  // Return string with a native JS type of value
  const getType = (value) => {
    return typeof value;
  };
  
  // Return array with types of items of given array
  const getTypesOfItems = (arr) => {
    return arr.map((value) => typeof value);
  };
  
  // Return true if all items of array have the same type
  const allItemsHaveTheSameType = (arr) => {
    const types = new Set();
    arr.forEach((value) => types.add(typeof value));
    return types.size === 1;
  };
  
  // Return string with a “real” type of value.
  // For example:
  //     typeof new Date()       // 'object'
  //     getRealType(new Date()) // 'date'
  //     typeof NaN              // 'number'
  //     getRealType(NaN)        // 'NaN'
  // Use typeof, instanceof and some magic. It's enough to have
  // 12-13 unique types but you can find out in JS even more :)
  const getRealType = (value) => {
    if (typeof value === 'boolean') return 'boolean';
    if (typeof value === 'string') return 'string';
    if (typeof value === 'undefined') return 'undefined';
    if (value === null) return 'null';
  
    if (value === Infinity || value === -Infinity) return 'Infinity';
    if (Number.isNaN(value)) return 'NaN';
    if (typeof value === 'number') return 'number';
    if (typeof value === 'bigint') return 'bigint';
  
    if (Array.isArray(value)) return 'array';
    if (value instanceof Function) return 'function';
    if (value instanceof Date) return 'date';
    if (value instanceof RegExp) return 'regexp';
    if (value instanceof Set) return 'set';
    if (value instanceof Map) return 'map';
    if (value instanceof WeakSet) return 'weakset';
    if (value instanceof WeakMap) return 'weakmap';
    if (typeof value === 'symbol') return 'symbol';
    if (value instanceof Promise) return 'promise';
  
    if (typeof value === 'object') return 'object';
  
    return 'unknown';
  };
  
  const getRealTypesOfItems = (arr) => {
    return arr.map(getRealType);
  };
  
  // Return true if there are no items in array
  // with the same real type
  const everyItemHasAUniqueRealType = (arr) => {
    const types = new Set();
    arr.forEach((value) => types.add(getRealType(value)));
    return arr.length === types.size;
  };
  
  // Return an array of arrays with a type and count of items
  // with this type in the input array, sorted by type.
  // Like an Object.entries() result: [['boolean', 3], ['string', 5]]
  const countRealTypes = (arr) => {
    const map = {};
  
    arr.forEach((value) => {
      const type = getRealType(value);
      if (!map[type]) map[type] = 0;
      map[type]++;
    });
  
    const stat = Object.entries(map).sort((a, b) => a[0].localeCompare(b[0]));
  
    return stat;
  };
  
  // Tests
  
  testBlock('getType');
  
  test('Boolean', getType(true), 'boolean');
  test('Number', getType(123), 'number');
  test('String', getType('whoo'), 'string');
  test('Array', getType([]), 'object');
  test('Object', getType({}), 'object');
  test(
    'Function',
    getType(() => {}),
    'function',
  );
  test('Undefined', getType(undefined), 'undefined');
  test('Null', getType(null), 'object');
  
  testBlock('allItemsHaveTheSameType');
  
  test('All values are numbers', allItemsHaveTheSameType([11, 12, 13]), true);
  
  test(
    'All values are strings',
    allItemsHaveTheSameType(['11', '12', '13']),
    true,
  );
  
  test(
    'All values are strings but wait',
    allItemsHaveTheSameType(['11', new String('12'), '13']),
    false,
  );
  
  test(
    'Values like a number',
    allItemsHaveTheSameType([123, 123 / 'a', 1 / 0]),
    true,
  );
  
  test(
    'Values like an object',
    allItemsHaveTheSameType([{}, {}, {}, {}, {}]),
    true,
  );
  
  testBlock('getTypesOfItems VS getRealTypesOfItems');
  
  const knownTypes = [
    true,
    123,
    '123',
    [1, 2, 3],
    {},
    () => null,
    undefined,
    null,
    NaN,
    Infinity,
    new Date(),
    /[123]/g,
    new Set(),
    new Map(),
    new WeakSet(),
    new WeakMap(),
    123n,
    Symbol('hi'),
    Promise.resolve('ok'),
  ];
  
  test('Check basic types', getTypesOfItems(knownTypes), [
    'boolean',
    'number',
    'string',
    'object',
    'object',
    'function',
    'undefined',
    'object',
    'number',
    'number',
    'object',
    'object',
    'object',
    'object',
    'object',
    'object',
    'bigint',
    'symbol',
    'object',
  ]);
  
  test('Check real types', getRealTypesOfItems(knownTypes), [
    'boolean',
    'number',
    'string',
    'array',
    'object',
    'function',
    'undefined',
    'null',
    'NaN',
    'Infinity',
    'date',
    'regexp',
    'set',
    'map',
    'weakset',
    'weakmap',
    'bigint',
    'symbol',
    'promise',
  ]);
  
  testBlock('everyItemHasAUniqueRealType');
  
  test(
    'All value types in the array are unique',
    everyItemHasAUniqueRealType([true, 123, '123']),
    true,
  );
  
  test(
    'Two values have the same type',
    everyItemHasAUniqueRealType([true, 123, '123' === 123]),
    false,
  );
  
  test(
    'There are no repeated types in knownTypes',
    everyItemHasAUniqueRealType(knownTypes),
    true,
  );
  
  testBlock('countRealTypes');
  
  test(
    'Count unique types of array items',
    countRealTypes([true, null, !null, !!null, {}]),
    [
      ['boolean', 3],
      ['null', 1],
      ['object', 1],
    ],
  );
  
  test(
    'Counted unique types are sorted',
    countRealTypes([{}, null, true, !null, !!null]),
    [
      ['boolean', 3],
      ['null', 1],
      ['object', 1],
    ],
  );
  
  // Add several positive and negative tests
testBlock('getType with extra standard values');
test('Infinity', getType(Infinity), 'number');
test('-Infinity', getType(-Infinity), 'number');
test('BigInt', getType(123n), 'bigint');
test('Symbol', getType(Symbol('hi')), 'symbol');

testBlock('getType with extra unobvious types');
test('NaN', getType(NaN), 'number');
test('Wrong math expression', getType(13 / 'a'), 'number');