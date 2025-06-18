export interface Timestamp {
  timestamp: number; // Time in seconds
  nextThreeWords: string;
  choices: string[];
}

export const songTimestamps: Timestamp[] = [
  { 
    timestamp: 22, 
    nextThreeWords: "Let it be",
    choices: [
      "Let it be",
      "Let it go",
      "Let it shine"
    ]
  },
  { 
    timestamp: 46, 
    nextThreeWords: "Whisper words of",
    choices: [
      "Whisper words of",
      "Whisper words to",
      "Whisper words in"
    ]
  },
  { 
    timestamp: 60, 
    nextThreeWords: "be an answer",
    choices: [
      "be an answer",
      "be the answer",
      "be my answer"
    ]
  },
  { 
    timestamp: 162, 
    nextThreeWords: "night is cloudy",
    choices: [
      "night is cloudy",
      "night is stormy",
      "night is foggy"
    ]
  },
  { 
    timestamp: 177, 
    nextThreeWords: "sound of music",
    choices: [
      "sound of music",
      "sound of silence",
      "sound of nature"
    ]
  }
]; 


