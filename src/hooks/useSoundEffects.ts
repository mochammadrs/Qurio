import { useCallback, useRef } from "react";

/**
 * Custom Hook untuk Sound Effects
 * Menggunakan Web Audio API untuk generate sounds
 */
export function useSoundEffects() {
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize AudioContext
  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioContextRef.current = new AudioContextClass();
    }
    return audioContextRef.current;
  }, []);

  // Play correct answer sound (upward chime)
  const playCorrectSound = useCallback(() => {
    try {
      const audioContext = getAudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Pleasant upward notes: C5 -> E5 -> G5
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
      oscillator.frequency.exponentialRampToValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
      oscillator.frequency.exponentialRampToValueAtTime(783.99, audioContext.currentTime + 0.2); // G5

      // Smooth volume envelope
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.4);
    } catch (error) {
      console.warn("Sound playback failed:", error);
    }
  }, [getAudioContext]);

  // Play wrong answer sound (downward buzz)
  const playWrongSound = useCallback(() => {
    try {
      const audioContext = getAudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Descending dissonant notes
      oscillator.type = "square";
      oscillator.frequency.setValueAtTime(220, audioContext.currentTime); // A3
      oscillator.frequency.exponentialRampToValueAtTime(110, audioContext.currentTime + 0.15); // A2

      // Sharp volume envelope
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.warn("Sound playback failed:", error);
    }
  }, [getAudioContext]);

  // Play click sound (subtle tap)
  const playClickSound = useCallback(() => {
    try {
      const audioContext = getAudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Short, subtle click
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);

      // Very short envelope
      gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.05);
    } catch (error) {
      console.warn("Sound playback failed:", error);
    }
  }, [getAudioContext]);

  // Play celebration sound for high scores
  const playCelebrationSound = useCallback(() => {
    try {
      const audioContext = getAudioContext();
      
      // Play a sequence of upward notes
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25]; // C4, E4, G4, C5, E5
      
      notes.forEach((frequency, index) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime + index * 0.1);

        gainNode.gain.setValueAtTime(0.25, audioContext.currentTime + index * 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + index * 0.1 + 0.3);

        oscillator.start(audioContext.currentTime + index * 0.1);
        oscillator.stop(audioContext.currentTime + index * 0.1 + 0.3);
      });
    } catch (error) {
      console.warn("Sound playback failed:", error);
    }
  }, [getAudioContext]);

  return {
    playCorrectSound,
    playWrongSound,
    playClickSound,
    playCelebrationSound,
  };
}
