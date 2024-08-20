// src/Fourier.tsx
import React from 'react';
import Visualization from './Visualization';

interface FourierProps {
  analyser: AnalyserNode | null;
}

const Fourier: React.FC<FourierProps> = ({ analyser }) => {
  return <Visualization analyser={analyser} type="fourier" />;
};

export default Fourier;