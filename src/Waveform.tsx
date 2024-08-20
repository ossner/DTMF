// src/Waveform.tsx
import React, { useRef, useEffect, useState } from 'react';

interface WaveformProps {
  analyser: AnalyserNode | null;
}

const Waveform: React.FC<WaveformProps> = ({ analyser }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);


  const [canvasWidth, setCanvasWidth] = useState(600);

  useEffect(() => {
      const updateCanvasSize = () => {
          const screenWidth = window.innerWidth;
          if (screenWidth < 600) {
              setCanvasWidth(screenWidth * 0.9); // 90% of screen width for mobile
          } else {
              setCanvasWidth(600); // Fixed 400px for desktop
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
  }, [analyser]);

  return (
      <canvas ref={canvasRef} width={canvasWidth} height="100" style={{ width: `${canvasWidth}px` }} />
  );
};

export default Waveform;
