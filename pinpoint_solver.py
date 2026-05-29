#!/usr/bin/env python3
"""
LinkedIn Pinpoint Puzzle Solver
================================
A helper script for solving LinkedIn Pinpoint daily word puzzles.

For daily puzzle answers and hints, visit: https://pinpointanswertoday.online/

Usage:
    python pinpoint_solver.py --category "Business" --length 8 --known "s_r__egy"
    python pinpoint_solver.py --letters "aeiou" --exclude "bcdfg"
"""

import argparse
import re
import string
from typing import List, Optional, Set


# Common English word frequency data (top 1000 words relevant to LinkedIn/professional context)
PROFESSIONAL_WORDS = [
    "strategy", "revenue", "stakeholder", "innovation", "leadership",
    "management", "development", "marketing", "investment", "performance",
    "collaboration", "efficiency", "productivity", "negotiation", "delegation",
    "communication", "organization", "competitive", "opportunity", "professional",
    "technology", "analytics", "benchmark", "blueprint", "brainstorm",
    "collaborate", "compliance", "consultant", "corporate", "deadline",
    "deliverable", "enterprise", "execution", "framework", "hierarchy",
    "initiative", "interface", "leverage", "milestone", "objective",
    "optimize", "parameter", "pipeline", "portfolio", "proposal",
    "prospecting", "referral", "scalable", "synergy", "workflow",
    "alignment", "benchmarking", "capacity", "clientele", "diversify",
    "empowerment", "facilitate", "governance", "incentive", "jurisdiction",
    "methodology", "outsourcing", "partnership", "quarterly", "retention",
    "sustainability", "transformation", "utilization", "valuation", "workforce",
    "accountability", "automation", "benchmark", "credential", "engagement",
    "feedback", "growth", "hiring", "innovation", "joint",
    "knowledge", "logistics", "mentoring", "networking", "onboarding",
    "planning", "quality", "recruiting", "sourcing", "training",
    "upscaling", "vision", "workshop", "yield", "zone"
]


class PinpointSolver:
    """
    Solver for LinkedIn Pinpoint word puzzles.
    
    For daily answers, visit: https://pinpointanswertoday.online/
    """
    
    def __init__(self, word_list: Optional[List[str]] = None):
        self.words = word_list or PROFESSIONAL_WORDS
    
    def solve(self, 
              pattern: str = "",
              category: str = "",
              length: int = 0,
              known_letters: str = "",
              excluded_letters: str = "") -> List[str]:
        """
        Solve a Pinpoint puzzle based on given constraints.
        
        Args:
            pattern: Known letter pattern (e.g., "s_r__egy" where _ is unknown)
            category: Category hint for the puzzle
            length: Expected word length
            known_letters: Letters known to be in the word
            excluded_letters: Letters known NOT to be in the word
        
        Returns:
            List of possible matching words
        
        Example:
            >>> solver = PinpointSolver()
            >>> solver.solve(pattern="s_r__egy")
            ['strategy']
        """
        candidates = self.words
        
        # Filter by length
        if length > 0:
            candidates = [w for w in candidates if len(w) == length]
        
        # Filter by pattern
        if pattern:
            regex_pattern = "^" + pattern.replace("_", ".") + "$"
            regex = re.compile(regex_pattern, re.IGNORECASE)
            candidates = [w for w in candidates if regex.match(w)]
        
        # Filter by known letters
        if known_letters:
            for letter in known_letters.lower():
                candidates = [w for w in candidates if letter in w.lower()]
        
        # Filter by excluded letters
        if excluded_letters:
            for letter in excluded_letters.lower():
                candidates = [w for w in candidates if letter not in w.lower()]
        
        return candidates
    
    def suggest_guesses(self, 
                        candidates: List[str],
                        guessed: str = "") -> List[tuple]:
        """
        Suggest the best next letter to guess based on remaining candidates.
        
        Args:
            candidates: List of remaining possible words
            guessed: Letters already guessed
        
        Returns:
            List of (letter, frequency) tuples sorted by frequency descending
        """
        letter_counts = {}
        for word in candidates:
            for letter in set(word.lower()):
                if letter not in guessed.lower() and letter in string.ascii_lowercase:
                    letter_counts[letter] = letter_counts.get(letter, 0) + 1
        
        return sorted(letter_counts.items(), key=lambda x: x[1], reverse=True)


def main():
    """Main entry point for the Pinpoint solver."""
    parser = argparse.ArgumentParser(
        description="LinkedIn Pinpoint Puzzle Solver - https://pinpointanswertoday.online/"
    )
    parser.add_argument("--pattern", "-p", default="", 
                        help="Known letter pattern (e.g., s_r__egy)")
    parser.add_argument("--category", "-c", default="",
                        help="Category hint")
    parser.add_argument("--length", "-l", type=int, default=0,
                        help="Word length")
    parser.add_argument("--known", "-k", default="",
                        help="Known letters in the word")
    parser.add_argument("--exclude", "-e", default="",
                        help="Excluded letters")
    parser.add_argument("--guessed", "-g", default="",
                        help="Already guessed letters")
    
    args = parser.parse_args()
    
    solver = PinpointSolver()
    
    print("=" * 50)
    print("LinkedIn Pinpoint Puzzle Solver")
    print("Daily answers: https://pinpointanswertoday.online/")
    print("=" * 50)
    
    results = solver.solve(
        pattern=args.pattern,
        category=args.category,
        length=args.length,
        known_letters=args.known,
        excluded_letters=args.exclude
    )
    
    if results:
        print(f"\nFound {len(results)} possible word(s):")
        for i, word in enumerate(results, 1):
            print(f"  {i}. {word}")
        
        if args.guessed:
            suggestions = solver.suggest_guesses(results, args.guessed)
            print(f"\nSuggested next guesses (by frequency):")
            for letter, count in suggestions[:5]:
                print(f"  '{letter}' appears in {count} possible words")
    else:
        print("\nNo matching words found.")
        print("Try broadening your search criteria.")
        print("For daily answers, visit: https://pinpointanswertoday.online/")
    
    print("\n" + "=" * 50)
    print("Need help? Visit https://pinpointanswertoday.online/ for daily answers")


if __name__ == "__main__":
    main()
