function main(): void {

  /**
  * Demos a variety of basic array operations
  */
  function arrayOperations(sequence: number[]): void {
    // Map - transform each element
    const doubled = sequence.map(n => n * 2); // [2, 4, 6]

    // Filter - keep elements that match a condition
    const evenNumbers = sequence.filter(n => n % 2 === 0); // [2]

    // Reduce - combine elements into a single value
    const sum = sequence.reduce((acc, curr) => acc + curr, 0); // 6

    // Find - get first element matching condition
    const firstEven = sequence.find(n => n % 2 === 0); // 2

    // Some - check if any element matches condition
    const hasEven = sequence.some(n => n % 2 === 0); // true

    // Every - check if all elements match condition
    const allPositive = sequence.every(n => n > 0); // true

    // Includes - check if array contains value
    const hasTwo = sequence.includes(2); // true

    // Slice - get portion of array
    const portion = sequence.slice(0, 2); // [1, 2]

    // Sort - arrange elements (modifies original array)
    const sorted = [...sequence].sort((a, b) => b - a); // [3, 2, 1], does not modify original
    const sorted2 = sequence.sort((a, b) => b - a); // [3, 2, 1], modifies original

    // Type-safe array creation
    const typedArray: Array<number> = [];
    // or
    const altTypedArray: number[] = [];

    // Array spread and destructuring
    const moreNumbers = [...sequence, 4, 5];
    const [first, second, ...rest] = moreNumbers;

    // Grouping items by a property - Reduce example
    interface Transaction {
      category: string;
      amount: number;
    }

    const transactions: Transaction[] = [
      { category: "food", amount: 50 },
      { category: "transport", amount: 30 },
      { category: "food", amount: 25 }
    ];

    const groupedTransactions = transactions.reduce((acc, curr) => {
      const category = curr.category;
      acc[category] = (acc[category] || 0) + curr.amount;
      return acc;
    }, {} as Record<string, number>);

  }
  const arrayOperationsSequence = [1, 2, 3]
  arrayOperations(arrayOperationsSequence)

  /**
   * Finds pairs of numbers in the sequence that add up to the target
   * 
   * @param sequence
   * Example: [7, 2, 3, 5, 4, 1, 6]
   * 
   * @param target
   * Example: 7
   * 
   * Outputs [1,6], [2,5], [3,4]
   */
  function findArrayPairs(sequence: number[], target: number): void {
    for (let i = 0; i < sequence.length - 1; i++) {
      const rightSequence = sequence.slice(i + 1, sequence.length)
      const matches: number[] = rightSequence.filter(num => num + sequence[i] === target)
      for (const match of matches) {
        const matchIndex = rightSequence.findIndex(num => num === match) + i + 1
        console.log("Found a match:")
        console.log(sequence[i] + ", " + sequence[matchIndex])
      }

    }
  }
  const findArrayPairsArg1 = [7, 2, 3, 5, 4, 1, 6]
  const findArrayPairsArg2 = 7
  findArrayPairs(findArrayPairsArg1, findArrayPairsArg2)

  /**
   * Finds the first element to the right of each element that is of greater value
   * 
   * @param sequence
   * Example: [4,5,2,10,8]
   * 
   * Outputs [5, 10, 10, -1, -1]
   * 
   */
  function nextGreaterElement(sequence: number[]): void {
    const nextGreaterNumbers: number[] = [];
    for (let i = 0; i < sequence.length; i++) {
      const rightArray = sequence.slice(i + 1, sequence.length)
      const firstGreaterIndex = rightArray.findIndex(number => number > sequence[i])
      if (firstGreaterIndex > -1) {
        nextGreaterNumbers.push(sequence[firstGreaterIndex + i + 1])
      } else {
        nextGreaterNumbers.push(-1)
      }
    }
    console.log(nextGreaterNumbers)
  }
  const nextGreaterElementSequence = [4, 5, 2, 10, 8]
  nextGreaterElement(nextGreaterElementSequence)

  /**
   * Calculates the product of every element in the array except for the current one without using using division.
   * 
   * @param sequence
   * Example: [1,2,3,4]
   * 
   * Outputs [24,12,8,6]
   */
  function arrayProductWithoutDivision(sequence: number[]): void {
    let currentProduct = 1;
    let products: number[] = [];
    for (let i = 0; i < sequence.length; i++) {
      for (let j = 0; j < sequence.length; j++) {
        const multiplier = j === i ? 1 : sequence[j]
        currentProduct = currentProduct * multiplier
      }
      products.push(currentProduct)
      currentProduct = 1;
    }
    console.log(products)
  }
  const arrayProductWithoutDivisionSequence = [1, 2, 3, 4]
  arrayProductWithoutDivision(arrayProductWithoutDivisionSequence)

  /**
   * Finds "peaks" in the array. An element is considered a "peak" if both of its neighbors are of lower value.
   * If an element has no neighbor on one side, that neighbor is considered lower value.
   * @param sequence 
   * Example: [1, 3, 20, 4, 1, 0]
   * 
   * Outputs: 20
   */
  function findPeaks(sequence: number[]): void {
    for (let i = 1; i < sequence.length - 1; i++) {
      if (sequence[i] > sequence[i - 1] && sequence[i] > sequence[i + 1]) {
        console.log(`Peak Found: ${sequence[i]}`)
      }
    }
    if (sequence[0] > sequence[1]) {
      console.log(`Peak Found: ${sequence[0]}`)
    }
    if (sequence[sequence.length - 1] > sequence[sequence.length - 2]) {
      console.log(`Peak Found: ${sequence[sequence.length - 1]}`)
    }
  }
  const findPeaksSequence = [1, 3, 20, 4, 1, 0]
  findPeaks(findPeaksSequence)

  /**
   * Finds the longest possible sequence of consecutive numbers in the array.
   * 
   * @param sequence
   * Example: [100, 4, 200, 1, 3, 2]
   * 
   * Outputs: [1,2,3,4]
   */
  function findLongestConsecutive(sequence: number[]): void {
    const sorted = sequence.sort((a, b) => a - b)
    console.log("Sorted Array:")
    console.log(sorted)

    let currentConsecutive = [sorted[0]]
    let longestConsective = currentConsecutive

    for (let i = 1; i < sorted.length; i++) {
      if ((sorted[i] - sorted[i - 1]) === 1) {
        currentConsecutive.push(sorted[i])
        if (currentConsecutive.length > longestConsective.length) {
          console.log("Found a new longest consecutive: " + longestConsective)
          longestConsective = currentConsecutive
        }
      } else {
        currentConsecutive = [sorted[i]]
      }
    }
    console.log("Longest consecutive:")
    console.log(longestConsective)
  }
  const findLongestConsecutiveSequence = [100, 4, 200, 1, 3, 2]
  findLongestConsecutive(findLongestConsecutiveSequence)

  /**
   * Finds the missing number in the sequence.
   * Only one number is missing.
   * 
   * @param sequence 
   * Example: [1, 2, 4, 6, 3, 7, 8]
   * 
   * Outputs: 5
   */
  function findMissing(sequence: number[]): void {
    const sorted = sequence.sort()
    console.log("Sorted Array: " + sorted)
    for (let i = 0; i < sorted.length; i++) {
      if (i > 0) {
        if ((sorted[i] - sorted[i - 1]) > 1) {
          console.log(sorted[i] - 1)
        }
      }
    }
  }
  const findMissingSequence = [1, 2, 4, 6, 3, 7, 8]
  findMissing(findMissingSequence)

  /**
   * Finds sequences of identical numbers in the array.
   * 
   * @param sequence
   * Example: [1, 2, 3, 3, 3, 4, 1, 7, 7, 8, 5, 5, 6]
   * 
   * Outputs: [3,3,3], [7,7]
   */
  function findConsecutive(sequence: number[]): void {
    let current: number[] = []
    for (const num of sequence) {
      if (current.length > 0) {
        if (num === current[0]) {
          current.push(num)
        } else {
          if (current.length > 1) {
            // Found a sequence of length >=2
            console.log(current)
          }
          current = [num]
        }
      } else {
        current.push(num)
      }
    }
  }
  const findConsecutiveSequence = [1, 2, 3, 3, 3, 4, 1, 7, 7, 8, 5, 5, 6]
  findConsecutive(findConsecutiveSequence)

  /**
   * Finds sequences of increasing numbers.
   * 
   * @param sequence 
   * Example: [1, 2, 4, 6, 3, 7, 8]
   * 
   * Outputs: [2,4,6], [3,7,8]
   */
  function findIncreasing(sequence: number[]): void {
    let current: number[] = []
    for (const num of sequence) {
      if (current.length > 0) {
        if (num > current[current.length - 1]) {
          current.push(num)
        } else {
          if (current.length > 1) {
            console.log(current)
          }
          current = [num]
        }
      } else {
        current.push(num)
      }
    }
    if (current.length > 1) {
      console.log(current)
    }
  }
  const findIncreasingSequence = [1, 2, 4, 6, 3, 7, 8]
  findIncreasing(findIncreasingSequence)
}

main()