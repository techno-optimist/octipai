import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TrueFocus from './TrueFocus';

const mckennaQuotes = [
  "The octopus doesn't think about what it's feeling - it becomes its feeling, becomes the very thing it's trying to communicate.",
  "We are like coral animals embedded in a technological reef of extruded psychic objects.",
  "The real secret of magic is that the world is made of words, and that if you know the words that the world is made of, you can make of it whatever you wish.",
  "Nature loves courage. You make the commitment and nature will respond to that commitment by removing impossible obstacles.",
  "The syntactical nature of reality, the real secret of magic, is that the world is made of words. And if you know the words that the world is made of, you can make of it whatever you wish.",
  "We are caged by our cultural programming. Culture is a mass hallucination, and when you step outside the mass hallucination you see it for what it's worth.",
  "The felt presence of immediate experience is a dissolution of the subject-object dualism that has been the curse of philosophy since Aristotle."
];

export default function McKennaQuotes() {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  useEffect(() => {
    const currentQuote = mckennaQuotes[currentQuoteIndex];
    const wordCount = currentQuote.split(' ').length;
    
    // Balanced word-based timing: 0.4s per word (sweet spot)
    const focusCompletionTime = wordCount * 400; // 0.4 seconds per word
    const additionalPauseTime = 2000; // 2 seconds pause after reaching last word
    const totalQuoteTime = focusCompletionTime + additionalPauseTime;

    const timeout = setTimeout(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % mckennaQuotes.length);
    }, totalQuoteTime);

    return () => clearTimeout(timeout);
  }, [currentQuoteIndex]);

  return (
    <motion.div
      className="text-center mb-16 max-w-6xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 2, ease: "easeOut" }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuoteIndex}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-8"
        >
          <TrueFocus
            sentence={mckennaQuotes[currentQuoteIndex]}
            manualMode={false}
            blurAmount={3}
            borderColor="rgba(147, 51, 234, 0.8)" // Purple border
            glowColor="rgba(147, 51, 234, 0.6)" // Purple glow
            animationDuration={0.2}
            pauseBetweenAnimations={0.2}
          />
        </motion.div>
      </AnimatePresence>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 1 }}
        className="text-lg text-purple-300 font-medium"
      >
        — Terence McKenna
      </motion.div>
    </motion.div>
  );
} 