// src/Fourier.tsx
import React, { useRef, useEffect, useState } from 'react';

interface WaveformProps {
    analyser: AnalyserNode | null;
}

const Waveform: React.FC<WaveformProps> = ({ analyser }) => {

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

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!analyser) return;

        const canvas = canvasRef.current!;
        const canvasContext = canvas!.getContext('2d')!;
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
    }, [analyser]);

    return (
        <canvas ref={canvasRef} width={canvasWidth} height="100" style={{ width: `${canvasWidth}px` }} />
    );
};

export default Waveform;
