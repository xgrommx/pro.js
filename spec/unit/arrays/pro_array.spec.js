'use strict';

describe('Pro.Array', function () {
  it('is array-like object', function () {
    var array = new Pro.Array(3, 4, 5, 4), ind,
        transformedArray, result;

    expect(array.length).toBe(4);
    expect(array.concat(6, 7).length).toBe(6);
    expect(array.every(function (el) { return typeof(el) === 'number';})).toBe(true);
    expect(array.every(function (el) { return el % 2 === 0;})).toBe(false);
    expect(array.some(function (el) { return typeof(el) === 'number';})).toBe(true);
    expect(array.some(function (el) { return el % 2 === 0;})).toBe(true);
    expect(array.filter(function (el) { return el % 2 === 0;}).length).toBe(2);
    expect(array.indexOf(4)).toBe(1);
    expect(array.indexOf(4, 2)).toBe(3);
    expect(array.indexOf(3, 2)).toBe(-1);
    expect(array.lastIndexOf(4)).toBe(3);
    expect(array.join(',')).toEqual('3,4,5,4');
    expect(array.toString()).toEqual(array._array.toString());

    ind = 0;
    array.forEach(function (el, i, arr) {
      expect(typeof(el)).toEqual('number');
      expect(el).toEqual(array._array[i]);
      expect(i).toEqual(ind);
      expect(arr).toBe(array._array);

      ind++;
    });

    ind = 0;
    transformedArray = array.map(function (el, i, arr) {
      expect(typeof(el)).toEqual('number');
      expect(el).toEqual(array._array[i]);
      expect(i).toEqual(ind);
      expect(arr).toBe(array._array);

      ind++;
      return el*el;
    });
    expect(transformedArray.length).toBe(4);
    expect(transformedArray.indexOf(9)).toBe(0);

    ind = 1;
    result = array.reduce(function (curr, el, i, arr) {
      expect(typeof(el)).toEqual('number');
      expect(el).toEqual(array._array[i]);
      expect(i).toEqual(ind);
      expect(arr).toBe(array._array);

      ind++;
      return curr + el;
    });
    expect(result).toBe(16);

    ind = array.length - 1;
    result = array.reduceRight(function (curr, el, i, arr) {
      expect(typeof(el)).toEqual('number');
      expect(el).toEqual(array._array[i]);
      expect(i).toEqual(ind);
      expect(arr).toBe(array._array);

      ind--;
      return curr + el;
    }, 0);
    expect(result).toBe(16);

    expect(array.pop()).toBe(4);
    expect(array.length).toBe(3);
    expect(array.lastIndexOf(4)).toBe(1);

    array.push(4);
    expect(array.length).toBe(4);
    expect(array.lastIndexOf(4)).toBe(3);
    array.push(7, 8);
    expect(array.length).toBe(6);
    expect(array.indexOf(7)).toBe(4);
    expect(array.indexOf(8)).toBe(5);

    array.reverse();
    expect(array.indexOf(8)).toBe(0);
    expect(array.indexOf(3)).toBe(5);

    expect(array.shift()).toBe(8);
    expect(array.length).toBe(5);
    expect(array.lastIndexOf(8)).toBe(-1);

    transformedArray = array.slice(1, 3);
    expect(array.length).toBe(5);
    expect(transformedArray.length).toBe(2);
    transformedArray.push(9);
    expect(transformedArray.length).toBe(3);

    array.sort();
    expect(array.indexOf(7)).toBe(4);
    expect(array.indexOf(3)).toBe(0);

    result = array.splice(1, 2, 'four');
    expect(array.length).toBe(4);
    expect(array.indexOf('four')).toBe(1);
    expect(result.length).toBe(2);
    expect(result.indexOf(4)).toBe(0);
    expect(result.lastIndexOf(4)).toBe(1);

  });

});
