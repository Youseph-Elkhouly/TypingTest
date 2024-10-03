import React, { ChangeEvent, Component } from 'react';
import './App.css';

const sentenceSets = {
  regular: {
    easy: [
      'This is a simple sentence',
      'Typing is fun and useful',
      'The sky is blue today',
    ],
    medium: [
      'Once upon a time, there was a brave knight',
      'The quick brown fox jumps over the lazy dog',
      'Typing tests are a great way to improve skills',
    ],
    hard: [
      'She sells seashells by the seashore on sunny days',
      'Amazingly few discotheques provide jukeboxes',
      'Grumpy wizards make toxic brew for the evil queen and jack',
    ],
  },
  numbers: {
    easy: [
      '123 456 789',
      '987 654 321',
      '101 202 303 404',
    ],
    medium: [
      '56789 12345 67890',
      '321 654 987',
      '246 135 975',
    ],
    hard: [
      '1.2345 6.789 123.4567',
      '98765.432 10987.654',
      '1010 0101 1111 1000',
    ],
  },
  c: {
    easy: [
      '#include <stdio.h> int main() { printf("Hello, World!"); return 0; }',
      'int add(int a, int b) { return a + b; }',
      'void greet() { printf("Greetings!"); }',
    ],
    medium: [
      'int factorial(int n) { if (n == 0) return 1; else return n * factorial(n - 1); }',
      'int arr[5] = {1, 2, 3, 4, 5}; for (int i = 0; i < 5; i++) { printf("%d", arr[i]); }',
    ],
    hard: [
      'struct Node { int data; struct Node* next; };',
      'int binarySearch(int arr[], int low, int high, int key) { if (high >= low) { int mid = (low + high) / 2; if (arr[mid] == key) return mid; else if (arr[mid] > key) return binarySearch(arr, low, mid - 1, key); else return binarySearch(arr, mid + 1, high, key); } else return -1; }',
    ],
  },
  python: {
    easy: [
      'print("Hello, World!")',
      'def add(a, b): return a + b',
      'def greet(): print("Greetings!")',
    ],
    medium: [
      'def factorial(n): return 1 if n == 0 else n * factorial(n - 1)',
      'arr = [1, 2, 3, 4, 5] for i in arr: print(i)',
    ],
    hard: [
      'class Node: def __init__(self, data): self.data = data; self.next = None',
      'def quicksort(arr): if len(arr) <= 1: return arr; pivot = arr[len(arr) // 2]; left = [x for x in arr if x < pivot]; middle = [x for x in arr if x == pivot]; right = [x for x in arr if x > pivot]; return quicksort(left) + middle + quicksort(right)',
    ],
  },
  java: {
    easy: [
      'public class Main { public static void main(String[] args) { System.out.println("Hello, World!"); } }',
      'int add(int a, int b) { return a + b; }',
      'void greet() { System.out.println("Greetings!"); }',
    ],
    medium: [
      'int factorial(int n) { if (n == 0) return 1; else return n * factorial(n - 1); }',
      'int[] arr = {1, 2, 3, 4, 5}; for (int i : arr) { System.out.print(i); }',
    ],
    hard: [
      'class Node { int data; Node next; Node(int d) { data = d; next = null; } }',
      'int binarySearch(int[] arr, int low, int high, int key) { if (high >= low) { int mid = (low + high) / 2; if (arr[mid] == key) return mid; else if (arr[mid] > key) return binarySearch(arr, low, mid - 1, key); else return binarySearch(arr, mid + 1, high, key); } return -1; }',
    ],
  },
  javascript: {
    easy: [
      'console.log("Hello, World!");',
      'function add(a, b) { return a + b; }',
      'function greet() { console.log("Greetings!"); }',
    ],
    medium: [
      'function factorial(n) { return n === 0 ? 1 : n * factorial(n - 1); }',
      'let arr = [1, 2, 3, 4, 5]; arr.forEach(num => console.log(num));',
    ],
    hard: [
      'class Node { constructor(data) { this.data = data; this.next = null; } }',
      'function quicksort(arr) { if (arr.length <= 1) return arr; let pivot = arr[Math.floor(arr.length / 2)]; let left = arr.filter(x => x < pivot); let right = arr.filter(x => x > pivot); return [...quicksort(left), pivot, ...quicksort(right)]; }',
    ],
  },
};

interface Word {
  text: string;
  isCorrect: boolean;
}

interface State {
  typeTest: string;
  words: Array<Word>;
  enteredText: string;
  correctCount: number;
  started: boolean;
  startTime: Date | null;
  wordsPerMinute: number | null;
  selectedCategory: keyof typeof sentenceSets;
  selectedDifficulty: 'easy' | 'medium' | 'hard';
}

class App extends Component<{}, State> {
  state: State = {
    typeTest: sentenceSets.regular.easy[0],
    words: [],
    enteredText: '',
    correctCount: 0,
    started: false,
    startTime: null,
    wordsPerMinute: null,
    selectedCategory: 'regular',
    selectedDifficulty: 'easy',
  };

  componentDidMount() {
    this.updateWords(this.state.typeTest);
  }

  updateWords = (text: string) => {
    const wordsArray = text.split(' ').map((word) => ({
      text: word,
      isCorrect: false,
    }));
    this.setState({
      typeTest: text,
      words: wordsArray,
      enteredText: '',
      correctCount: 0,
      started: false,
      startTime: null,
      wordsPerMinute: null,
    });
  };

  chooseRandomSentence = () => {
    const { selectedCategory, selectedDifficulty } = this.state;
    const selectedSet = sentenceSets[selectedCategory][selectedDifficulty];
    const randomSentence =
      selectedSet[Math.floor(Math.random() * selectedSet.length)];
    this.updateWords(randomSentence);
  };

  wordsPerMinute = (charsTyped: number, millis: number): number =>
    Math.floor((charsTyped / 5) / (millis / 60000));

  checkFinished = (): void => {
    if (this.state.words.every((word) => word.isCorrect) && this.state.startTime) {
      const timeMillis: number =
        new Date().getTime() - this.state.startTime.getTime();
      const wpm = this.wordsPerMinute(this.state.typeTest.length, timeMillis);
      this.setState({ wordsPerMinute: wpm });
    }
  };

  onWordChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (!this.state.started) {
      this.setState({ started: true, startTime: new Date() });
    }

    const enteredText = e.currentTarget.value.trim();
    this.setState({ enteredText });

    const currentWord = this.state.words.find((word) => !word.isCorrect);

    if (currentWord && enteredText === currentWord.text) {
      this.setState(
        (prevState) => ({
          correctCount: prevState.correctCount + 1,
          enteredText: '',
          words: prevState.words.map((word) =>
            word === currentWord ? { ...word, isCorrect: true } : word
          ),
        }),
        (): void => this.checkFinished()
      );
    }
  };

  resetGame = (): void => {
    this.chooseRandomSentence();
  };

  handleCategoryChange = (category: keyof typeof sentenceSets) => {
    this.setState({ selectedCategory: category }, this.chooseRandomSentence);
  };

  handleDifficultyChange = (difficulty: 'easy' | 'medium' | 'hard') => {
    this.setState({ selectedDifficulty: difficulty }, this.chooseRandomSentence);
  };

  render() {
    return (
      <div className="App">
        <h1 className="title">
          {this.state.wordsPerMinute
            ? `${this.state.wordsPerMinute} WPM`
            : 'Typing Speed Test'}
        </h1>

        <h2>Choose a typing test:</h2>
        <div className="options-container">
          <button className="option-btn" onClick={() => this.handleCategoryChange('regular')}>Regular</button>
          <button className="option-btn" onClick={() => this.handleCategoryChange('numbers')}>Numbers</button>
          <button className="option-btn" onClick={() => this.handleCategoryChange('c')}>C Programming</button>
          <button className="option-btn" onClick={() => this.handleCategoryChange('python')}>Python</button>
          <button className="option-btn" onClick={() => this.handleCategoryChange('java')}>Java</button>
          <button className="option-btn" onClick={() => this.handleCategoryChange('javascript')}>JavaScript</button>
        </div>

        <h2>Choose difficulty:</h2>
        <div className="difficulty-container">
          <button className="difficulty-btn" onClick={() => this.handleDifficultyChange('easy')}>Easy</button>
          <button className="difficulty-btn" onClick={() => this.handleDifficultyChange('medium')}>Medium</button>
          <button className="difficulty-btn" onClick={() => this.handleDifficultyChange('hard')}>Hard</button>
        </div>

        <h3 className="instructions">Type the following:</h3>
        <div className="words-container">
          {this.state.words.map((word, index) => (
            <span key={index} className={word.isCorrect ? 'correct-word' : 'current-word'}>
              {word.text + ' '}
            </span>
          ))}
        </div>
        <input
          className="typing-input"
          value={this.state.enteredText}
          onChange={this.onWordChange}
          placeholder="Start typing here"
        />

        <button className="play-again-btn" onClick={this.resetGame}>
          Play Again
        </button>
      </div>
    );
  }
}

export default App;