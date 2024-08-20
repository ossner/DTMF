// src/Visualization.tsx
import React, { useRef, useEffect, useState } from 'react';

interface VisualizationProps {
  analyser: AnalyserNode | null;
  type: 'waveform' | 'fourier';
}

const Visualization: React.FC<VisualizationProps> = ({ analyser, type }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasWidth, setCanvasWidth] = useState(600);

  useEffect(() => {
    const updateCanvasSize = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth < 600) {
        setCanvasWidth(screenWidth * 0.9); // 90% of screen width for mobile
      } else {
        setCanvasWidth(600); // Fixed 600px for desktop
      }
    };
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, []);

  useEffect(() => {
    if (!analyser) return;
    const canvas = canvasRef.current!;
    const canvasContext = canvas!.getContext('2d')!;

    if (type === 'waveform') {
      const bufferLength = analyser.fftSize;
      const dataArray = new Uint8Array(bufferLength);
      const draw = () => {
        analyser.getByteTimeDomainData(dataArray);
        canvasContext.clearRect(0, 0, canvas.width, canvas.height);
        canvasContext.lineWidth = 2;
        canvasContext.strokeStyle = '#963D5A';
        canvasContext.beginPath();
        const sliceWidth = (canvas.width * 3) / bufferLength;
        let x = 0;
        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * canvas.height) / 2;
          if (i === 0) {
            canvasContext.moveTo(x, y);
          } else {
            canvasContext.lineTo(x, y);
          }
          x += sliceWidth;
        }
        canvasContext.lineTo(canvas.width, canvas.height / 2);
        canvasContext.stroke();
        requestAnimationFrame(draw);
      };
      draw();
    } else if (type === 'fourier') {
      analyser.fftSize = 4096;
      const sampleRate = analyser.context.sampleRate;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      const minFrequency = 400;
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
          barHeight = dataArray[i] / 1.5;
          canvasContext.fillStyle = '#963D5A';
          canvasContext.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);
          x += barWidth + 1;
        }
        requestAnimationFrame(draw);
      };
      draw();
    }
  }, [analyser, type]);

  return (
    <canvas ref={canvasRef} width={canvasWidth} height="100" style={{ width: `${canvasWidth}px` }} />
  );
};

export default Visualization;