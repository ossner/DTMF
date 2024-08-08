// src/Waveform.tsx
import React, { useRef, useEffect } from 'react';

interface WaveformProps {
  analyser: AnalyserNode | null;
}

const Waveform: React.FC<WaveformProps> = ({ analyser }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!analyser) return;

    const canvas = canvasRef.current!;
    const canvasContext = canvas!.getContext('2d')!;
    analyser.fftSize = 4096;
    const sampleRate = analyser.context.sampleRate;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const minFrequency = 500;
    const maxFrequency = 5000;

    const minIndex = Math.floor(minFrequency / (sampleRate / analyser.fftSize));
    const maxIndex = Math.floor(maxFrequency / (sampleRate / analyser.fftSize));

    const draw = () => {
      analyser.getByteFrequencyData(dataArray);

      canvasContext.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / (maxIndex - minIndex)) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = minIndex; i <= maxIndex; i++) {
        barHeight = dataArray[i]/1.5;

        canvasContext.fillStyle = '#963D5A';
        canvasContext.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);

        x += barWidth + 1;
      }
      

      requestAnimationFrame(draw);
    };

    draw();
  }, [analyser]);

  return <canvas ref={canvasRef} width="400" height="100"></canvas>;
};

export default Waveform;
