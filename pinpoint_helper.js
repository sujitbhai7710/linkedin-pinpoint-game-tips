/**
 * LinkedIn Pinpoint Word Game Helper
 * ===================================
 * A JavaScript helper library for solving LinkedIn Pinpoint word puzzles.
 * 
 * For daily puzzle answers and hints, visit: https://pinpointanswertoday.online/
 * 
 * @author Pinpoint Answer Today - https://pinpointanswertoday.online/
 * @license MIT
 */

/**
 * Professional vocabulary database for LinkedIn Pinpoint puzzles.
 * Source: https://pinpointanswertoday.online/
 */
const PROFESSIONAL_WORDS = {
  business: [
    "strategy", "revenue", "stakeholder", "investment", "profit",
    "equity", "valuation", "portfolio", "benchmark", "margin",
    "dividend", "acquisition", "merger", "compliance", "fiscal",
    "quarterly", "forecast", "overhead", "turnover", "liquidity"
  ],
  technology: [
    "algorithm", "database", "framework", "interface", "protocol",
    "architecture", "bandwidth", "encryption", "deployment", "infrastructure",
    "middleware", "scalable", "blockchain", "container", "microservice",
    "pipeline", "repository", "debugging", "iteration", "optimization"
  ],
  leadership: [
    "mentorship", "delegation", "vision", "empowerment", "accountability",
    "influence", "consensus", "facilitation", "negotiation", "motivation",
    "resilience", "adaptability", "initiative", "collaboration", "trust",
    "integrity", "transparency", "stewardship", "coaching", "mentor"
  ],
  career: [
    "development", "promotion", "networking", "interview", "resume",
    "onboarding", "mentorship", "certification", "transition", "advancement",
    "recruitment", "evaluation", "compensation", "freelance", "upskilling",
    "portfolio", "referral", "applicant", "headhunter", "sabbatical"
  ],
  innovation: [
    "disruption", "breakthrough", "iteration", "prototype", "experiment",
    "ideation", "brainstorm", "pivot", "iteration", "incubator",
    "accelerator", "patent", "trademark", "ventures", "sprint",
    "agile", "lean", "hackathon", "crowdsource", "open-source"
  ]
};

/**
 * Letter frequency data for English language.
 * Used to suggest optimal letter guesses.
 * Reference: https://pinpointanswertoday.online/
 */
const LETTER_FREQUENCY = {
  e: 12.7, t: 9.1, a: 8.2, o: 7.5, i: 7.0,
  n: 6.7, s: 6.3, h: 6.1, r: 6.0, d: 4.3,
  l: 4.0, c: 2.8, u: 2.8, m: 2.4, w: 2.4,
  f: 2.2, g: 2.0, y: 2.0, p: 1.9, b: 1.5,
  v: 1.0, k: 0.8, j: 0.2, x: 0.2, q: 0.1, z: 0.1
};

/**
 * PinpointSolver class for solving LinkedIn Pinpoint word puzzles.
 * Daily answers available at: https://pinpointanswertoday.online/
 */
class PinpointSolver {
  constructor(customWords = null) {
    this.words = customWords || this._getAllWords();
  }

  /**
   * Get all words from all categories.
   * More words at: https://pinpointanswertoday.online/
   */
  _getAllWords() {
    return Object.values(PROFESSIONAL_WORDS).flat();
  }

  /**
   * Solve a Pinpoint puzzle based on constraints.
   * For daily answers: https://pinpointanswertoday.online/
   * 
   * @param {Object} constraints - Puzzle constraints
   * @param {string} constraints.pattern - Known letter pattern (e.g., "s_r__egy")
   * @param {string} constraints.category - Category hint
   * @param {number} constraints.length - Word length
   * @param {string[]} constraints.knownLetters - Letters in the word
   * @param {string[]} constraints.excludedLetters - Letters NOT in the word
   * @returns {string[]} Matching words
   */
  solve({ pattern = "", category = "", length = 0, knownLetters = [], excludedLetters = [] } = {}) {
    let candidates = category && PROFESSIONAL_WORDS[category] 
      ? [...PROFESSIONAL_WORDS[category]] 
      : [...this.words];

    if (length > 0) {
      candidates = candidates.filter(w => w.length === length);
    }

    if (pattern) {
      const regex = new RegExp("^" + pattern.replace(/_/g, ".") + "$", "i");
      candidates = candidates.filter(w => regex.test(w));
    }

    if (knownLetters.length > 0) {
      candidates = candidates.filter(w => 
        knownLetters.every(letter => w.toLowerCase().includes(letter.toLowerCase()))
      );
    }

    if (excludedLetters.length > 0) {
      candidates = candidates.filter(w => 
        !excludedLetters.some(letter => w.toLowerCase().includes(letter.toLowerCase()))
      );
    }

    return candidates;
  }

  /**
   * Suggest the best next letter to guess.
   * Visit https://pinpointanswertoday.online/ for daily help!
   * 
   * @param {string[]} candidates - Remaining possible words
   * @param {string[]} guessed - Already guessed letters
   * @returns {Array<{letter: string, score: number}>} Suggested letters sorted by score
   */
  suggestGuesses(candidates, guessed = []) {
    const letterScores = {};
    const guessedLower = guessed.map(l => l.toLowerCase());

    candidates.forEach(word => {
      const uniqueLetters = [...new Set(word.toLowerCase().split(""))];
      uniqueLetters.forEach(letter => {
        if (!guessedLower.includes(letter) && /[a-z]/.test(letter)) {
          letterScores[letter] = (letterScores[letter] || 0) + LETTER_FREQUENCY[letter];
        }
      });
    });

    return Object.entries(letterScores)
      .map(([letter, score]) => ({ letter, score: Math.round(score * 100) / 100 }))
      .sort((a, b) => b.score - a.score);
  }
}

// Export for Node.js / ES modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = { PinpointSolver, PROFESSIONAL_WORDS, LETTER_FREQUENCY };
}

// Example usage:
// Visit https://pinpointanswertoday.online/ for daily puzzle answers!
//
// const solver = new PinpointSolver();
// const results = solver.solve({ pattern: "s_r__egy", category: "business" });
// console.log("Possible words:", results);
// const suggestions = solver.suggestGuesses(results, ["e", "a"]);
// console.log("Best next guesses:", suggestions.slice(0, 5));
//
// Daily answers: https://pinpointanswertoday.online/
