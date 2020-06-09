class Sort {
  static less(v, w) {
    return v < w;
  }
  static equal(v, w) {
    return v === w;
  }
  static exch(array, i, j) {
    [array[i], array[j]] = [array[j], array[i]];
  }
  static isSorted(array) {
    for (let i = 1, len = array.length; i < len; i++) {
      if (this.less(array[i], array[i - 1])) {
        return false;
      }
    }
    return true;
  }
  static sort(array) {
    return array.sort((a, b) => a - b);
  }
}

class Bubble extends Sort {
  static sort(array) {
    const N = array.length;
    for (let i = 0; i < N - 1; i++) {
      for (let j = 0; j < N - 1 - i; j++) {
        if (this.less(array[j + 1], array[j])) {
          this.exch(array, j, j + 1);
        }
      }
    }
    return array;
  }
}

class Selection extends Sort {
  static sort(array) {
    const N = array.length;
    for (let i = 0; i < N; i++) {
      let min = i;
      for (let j = i + 1; j < N; j++) {
        if (this.less(array[j], array[min])) {
          min = j;
        }
      }
      this.exch(array, i, min);
    }
    return array;
  }
}

class Insertion extends Sort {
  static sort(array) {
    const N = array.length;
    for (let i = 1; i < N; i++) {
      const elem = array[i];
      let j = i;
      for (; j > 0 && this.less(elem, array[j - 1]); j--) {
        array[j] = array[j - 1];
      }
      array[j] = elem;
    }
    return array;
  }
}

class Shell extends Sort {
  static sort(array) {
    const N = array.length;
    let h = 1;
    while (h < Math.floor(N / 3)) {
      h = 3 * h + 1; // 动态计算gap
    }
    while (h >= 1) {
      for (let i = h; i < N; i++) {
        let elem = array[i];
        let j = i;
        for (; j > 0 && this.less(elem, array[j - h]); j -= h) {
          array[j] = array[j - h];
        }
        array[j] = elem;
      }
      h = Math.floor(h / 3);
    }
    return array;
  }
}

class RecursionMerge extends Sort {
  static sort(array) {
    const length = array.length;
    if (length < 2) {
      return array;
    }

    const middle = Math.floor(length / 2);
    const left = array.slice(0, middle);
    const right = array.slice(middle);
    return this.merge(this.sort(left), this.sort(right));
  }
  static merge(left, right) {
    const result = [];
    let lIndex = 0;
    let rIndex = 0;
    const leftLength = left.length;
    const rightLength = right.length;
    while (lIndex < leftLength && rIndex < rightLength) {
      if (this.less(left[lIndex], right[rIndex])) {
        result.push(left[lIndex++]);
      } else {
        result.push(right[rIndex++]);
      }
    }

    for (; lIndex < leftLength; lIndex++) {
      result.push(left[lIndex]);
    }

    for (; rIndex < rightLength; rIndex++) {
      result.push(right[rIndex]);
    }

    return result;
  }
}

class IterationMerge extends Sort {
  static sort(array) {
    const N = array.length;
    for (let size = 1; size < N; size += size) {
      // size 子数组大小
      // 从左到右进行分组归并排序，每组包括左右子数组，即两个size长的数组
      for (let start = 0; start < N - size; start += size + size) {
        // start 分组的起始索引, end 分组的结束索引
        const middle = start + size - 1;
        const end = Math.min(N - 1, start + size + size - 1);
        this.merge(array, start, middle, end);
      }
    }
    return array;
  }

  static merge(array, start, middle, end) {
    const compareArray = array.slice(start, end + 1);
    let index = start;
    let lIndex = start;
    let rIndex = middle + 1;

    while (index <= end) {
      if (lIndex === middle + 1) {
        array[index++] = compareArray[rIndex++];
      } else if (rIndex === end + 1) {
        array[index++] = compareArray[lIndex++];
      } else {
        if (compareArray[lIndex] < compareArray[rIndex]) {
          array[index++] = compareArray[lIndex++];
        } else {
          array[index++] = compareArray[rIndex++];
        }
      }
    }
  }
}

class Quick extends Sort {
  static sort(array, left = 0, right = array.length - 1) {
    if (left >= right) return array;
    this.dealPivot(array, left, right);
    const pivot = this.partition(array, left, right);
    this.sort(array, left, pivot - 1);
    this.sort(array, pivot + 1, right);
    return array;
  }
  static partition(array, left, right) {
    const value = array[left];
    let lIndex = left;
    let rIndex = right + 1;

    while (true) {
      while (this.less(array[++lIndex], value)) if (lIndex === right) break;
      while (this.less(value, array[--rIndex])) if (rIndex === left) break;
      if (rIndex <= lIndex) break;
      this.exch(array, lIndex, rIndex);
    }

    this.exch(array, left, rIndex);
    return rIndex;
  }
  static dealPivot(array, left, right) {
      const mid = Math.floor((left + right) / 2);
      const middle = [array[left], array[right], array[mid]].sort((a, b) => a - b)[1];
      const midIndex = middle === array[left] ? left : middle === array[mid] ? mid : right;
      [array[midIndex], array[left]] = [array[left], array[midIndex]];
  }
}

class Quick3Way extends Sort {
  static sort(array, left = 0, right = array.length - 1) {
    if (left >= right) return array;
    this.dealPivot(array, left, right);
    let lt = left;
    let gt = right;
    let i = left + 1;
    const value = array[left];

    while (i <= gt) {
      if (array[i] < value) this.exch(array, i++, lt++);
      else if (array[i] > value) this.exch(array, i, gt--);
      else i++;
    }

    this.sort(array, left, lt - 1);
    this.sort(array, gt + 1, right);
    return array;
  }
  static dealPivot(array, left, right) {
    const mid = Math.floor((left + right) / 2);
    let min = left;
    if (array[mid] < array[min]) min = mid;
    if (array[right] < array[min]) min = right;
    this.exch(array, left, mid);
  }
}

class Quick3Way2 extends Sort {
  static sort(array, left = 0, right = array.length - 1) {
    if (left >= right) return array;
    this.dealPivot(array, left, right);

    let p = left;
    let q = right + 1;
    let i = left;
    let j = right + 1;
    const value = array[left];

    while (true) {
      while (this.less(array[++i], value)) if (i === right) break;
      while (this.less(value, array[--j])) if (j === left) break;

      if (i === j && this.equal(array[i], value)) {
        this.exch(array, i, p);
      }
      if (i >= j) break;

      this.exch(array, i, j);
      if (this.equal(array[i], value)) this.exch(array, ++p, i);
      if (this.equal(array[j], value)) this.exch(array, --q, j);
    }

    // 把两端的=v移动到中间
    i = j + 1; // 取保i指到v>0的第一个元素
    for (let k = left; k <= p; k++) this.exch(array, k, j--);
    for (let k = right; k >= q; k--) this.exch(array, k, i++);

    // 左右两边的数组继续排序
    this.sort(array, left, j);
    this.sort(array, i, right);

    return array;
  }
  static dealPivot(array, left, right) {
    const mid = Math.floor((left + right) / 2);
    let min = left;
    if (array[mid] < array[min]) min = mid;
    if (array[right] < array[min]) min = right;
    this.exch(array, left, mid);
  }
}

class HeapSort extends Sort {
  static sort(array) {
    // 数组从0开始
    // 从下到上构建堆有序：找到最后一个堆
    // 下沉排序
    let N = array.length;
    for (let k = Math.floor(N / 2) - 1; k >= 0; k--) this.sink(array, k, N);
    while (N > 0) {
      this.exch(array, 0, --N);
      this.sink(array, 0, N);
    }
    return array;
  }

  static sink(array, i, N) {
    while (2 * i + 1 < N) {
      // 有子节点
      // 找到更大的子节点
      // 比较节点大小
      // 替换
      let j = 2 * i + 1;
      if (j < N - 1 && this.less(array[j], array[j + 1])) j++;
      if (!this.less(array[i], array[j])) break;
      this.exch(array, i, j);
      i = j;
    }
  }
}

class CountingSort extends Sort {
  static sort(array) {
    const maxValue = this.findMaxValue(array);
    const buckets = new Array(maxValue + 1).fill(0);

    array.forEach((value) => buckets[value]++);

    let sortedIndex = 0;
    buckets.forEach((value, i) => {
      while (value--) {
        array[sortedIndex++] = i;
      }
    });

    return array;
  }

  static findMaxValue(array) {
    let max = array[0];
    array.forEach((a) => (max = a > max ? a : max));
    return max;
  }
}

class BucketSort extends Sort {
  static sort(array, bucketSize = 5) {
    let min = array[0];
    let max = array[0];

    array.forEach((elem) => {
      min = elem < min ? elem : min;
      max = elem > max ? elem : max;
    });

    const bucketCount = Math.floor((max - min) / bucketSize) + 1;
    const buckets = new Array(bucketCount).fill().map(u => ([]));

    array.forEach((elem) => {
      buckets[Math.floor((elem - min) / bucketSize)].push(elem);
    });
    array.length = 0;
    buckets.forEach((bucket) => array.push(...bucket.sort((a, b) => a - b)));
    return array;
  }
}

class RadixSort extends Sort {
  static sort (arr, maxDigit = 6) {
    let mod = 10;
    let dev = 1;
    const counter = [];
    for (var i = 0; i < maxDigit; i++, dev *= 10, mod *= 10) {
        for(var j = 0; j < arr.length; j++) {
            var bucket = parseInt((arr[j] % mod) / dev);
            if(counter[bucket]==null) {
                counter[bucket] = [];
            }
            counter[bucket].push(arr[j]);
        }
        var pos = 0;
        for(var j = 0; j < counter.length; j++) {
            var value = null;
            if(counter[j]!=null) {
                while ((value = counter[j].shift()) != null) {
                      arr[pos++] = value;
                }
          }
        }
    }
    return arr;
  }
}

(function runTest() {
  const makeRandomArray = ({ length, min, max }) =>
    new Array(length)
      .fill(0)
      .map(() => Math.round(Math.random() * (max - min + 1) + min - 0.5));
  const makeSortedArray = ({ length }) =>
    new Array(length).fill(0).map((_value, i) => i);
  const makeReversedArray = ({ length }) =>
    new Array(length).fill(0).map((_value, i) => length - i);

  const testConfiguration = {
    length: 100000,
    min: 1,
    max: 100000,
  };
  const testCase = [
    {
      name: "Random Array Test",
      data: makeRandomArray(testConfiguration),
    },
    {
      name: "Sorted Array Test",
      data: makeSortedArray(testConfiguration),
    },
    {
      name: "Reversed Array Test",
      data: makeReversedArray(testConfiguration),
    },
  ];

  testCase.forEach(({ name, data: array }) => {
    console.log(`\n${name}\n-----------------------`);
    [
      Sort,
      Bubble,
      Selection,
      Insertion,
      Shell,
      RecursionMerge,
      IterationMerge,
      Quick,
      Quick3Way,
      Quick3Way2,
      HeapSort,
      CountingSort,
      BucketSort,
      RadixSort
    ].forEach((Sort) => {
      const className = Sort.prototype.constructor.name;
      console.time(className);
      const sorted = Sort["sort"]([...array]);
      console.timeEnd(className);
      if (!Sort["isSorted"](sorted)) {
        console.log("Wrong Sort:", sorted);
      }
    });
  });
})();
