class Sort {
  static less(v, w) {
    return v < w;
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
    const pivot = this.partition(array, left, right);
    this.sort(array, left, pivot - 1);
    this.sort(array, pivot + 1, right);
    return array;
  }
  static partition(array, left, right) {
    const value = array[left];
    let lIndex = left + 1;
    let rIndex = right;

    while (lIndex < rIndex) {
      while(this.less(array[lIndex], value)) {
        lIndex++;
      }
      while(this.less(value, array[rIndex])) {
        rIndex--;
      }
      this.exch(array, lIndex, rIndex);
    }
    this.exch(array, left, rIndex);
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
    length: 10000,
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
