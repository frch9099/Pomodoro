import { useRef, useCallback, useState, useEffect } from 'react';

const AUDIO_FREQUENCIES = {
  rain: 200,
  forest: 300,
  coffeeShop: 400,
  whiteNoise: 500,
  ocean: 150,
  fireplace: 100,
};

export function useSounds() {
  const audioContextRef = useRef(null);
  const oscillatorRef = useRef(null);
  const gainNodeRef = useRef(null);
  const [currentSound, setCurrentSound] = useState(null);
  const [volume, setVolumeState] = useState(50);
  const [isPlayingState, setIsPlaying] = useState(false);

  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  useEffect(() => {
    const handleFirstInteraction = () => {
      initAudioContext();
      document.removeEventListener('click', handleFirstInteraction);
    };
    document.addEventListener('click', handleFirstInteraction);
    return () => document.removeEventListener('click', handleFirstInteraction);
  }, [initAudioContext]);

  const getAudioContext = useCallback(() => {
    return initAudioContext();
  }, [initAudioContext]);

  const createNoiseBuffer = useCallback((audioContext, type) => {
    const bufferSize = audioContext.sampleRate * 2;
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const output = buffer.getChannelData(0);

    if (type === 'whiteNoise') {
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
    } else if (type === 'rain') {
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.3 + Math.sin(i * 0.01) * 0.1;
      }
    } else if (type === 'ocean') {
      for (let i = 0; i < bufferSize; i++) {
        const wave = Math.sin(i * 0.0001) * 0.5 + 0.5;
        output[i] = (Math.random() * 2 - 1) * wave * 0.4;
      }
    } else {
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
    }
    return buffer;
  }, []);

  const playSound = useCallback((soundId) => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current = null;
    }

    const audioContext = getAudioContext();

    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    gainNodeRef.current = audioContext.createGain();
    gainNodeRef.current.gain.value = volume / 100;
    gainNodeRef.current.connect(audioContext.destination);

    if (soundId === 'whiteNoise' || soundId === 'rain' || soundId === 'ocean') {
      const buffer = createNoiseBuffer(audioContext, soundId);
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      source.connect(gainNodeRef.current);
      source.start();
      oscillatorRef.current = source;
    } else {
      const oscillator = audioContext.createOscillator();
      const lfo = audioContext.createOscillator();
      const lfoGain = audioContext.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.value = AUDIO_FREQUENCIES[soundId] || 200;

      lfo.type = 'sine';
      lfo.frequency.value = soundId === 'fireplace' ? 2 : 0.5;
      lfoGain.gain.value = soundId === 'fireplace' ? 20 : 10;

      lfo.connect(lfoGain);
      lfoGain.connect(oscillator.frequency);

      oscillator.connect(gainNodeRef.current);
      lfo.start();
      oscillator.start();

      oscillatorRef.current = oscillator;
      oscillator._lfO = lfo;
    }

    setCurrentSound(soundId);
    setIsPlaying(true);
  }, [getAudioContext, createNoiseBuffer, volume]);

  const stopSound = useCallback(() => {
    if (oscillatorRef.current) {
      if (oscillatorRef.current.stop) {
        oscillatorRef.current.stop();
      }
      if (oscillatorRef.current._lfO) {
        oscillatorRef.current._lfO.stop();
      }
      oscillatorRef.current = null;
    }
    setCurrentSound(null);
    setIsPlaying(false);
  }, []);

  const setVolume = useCallback((level) => {
    setVolumeState(level);
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = level / 100;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (oscillatorRef.current) {
        try {
          if (oscillatorRef.current.stop) {
            try {
              oscillatorRef.current.stop();
            } catch (e) {
            }
          }
          if (oscillatorRef.current._lfO) {
            oscillatorRef.current._lfO.stop();
          }
        } catch (e) {
        }
        oscillatorRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
      }
    };
  }, []);

  return {
    playSound,
    stopSound,
    setVolume,
    currentSound,
    volume,
    isPlayingState,
  };
}
