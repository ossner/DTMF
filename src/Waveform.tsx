// src/Waveform.tsx
import React from 'react';
import Visualization from './Visualization';

interface WaveformProps {
  analyser: AnalyserNode | null;
}

const Waveform: React.FC<WaveformProps> = ({ analyser }) => {
  return <Visualization analyser={analyser} type="waveform" />;
};

export default Waveform;