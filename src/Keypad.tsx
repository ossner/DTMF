// src/Keypad.tsx
import React, { useState } from 'react';
import Waveform from './Waveform';
import Fourier from './Fourier';
import './Keypad.css';

const dtmfFrequencies: { [key: string]: [number, number] } = {
    '1': [697, 1209],
    '2': [697, 1336],
    '3': [697, 1477],
    '4': [770, 1209],
    '5': [770, 1336],
    '6': [770, 1477],
    '7': [852, 1209],
    '8': [852, 1336],
    '9': [852, 1477],
    '*': [941, 1209],
    '0': [941, 1336],
    '#': [941, 1477]
};

const Keypad: React.FC = () => {
    const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);

    const playTone = (key: string) => {
        if (!dtmfFrequencies[key]) return;

        const [lowFreq, highFreq] = dtmfFrequencies[key];
        const context = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator1 = context.createOscillator();
        const oscillator2 = context.createOscillator();
        const gainNode = context.createGain();
        const analyserNode = context.createAnalyser();

        setAnalyser(analyserNode);

        oscillator1.frequency.setValueAtTime(lowFreq, context.currentTime);
        oscillator2.frequency.setValueAtTime(highFreq, context.currentTime);

        gainNode.gain.setValueAtTime(0.25, context.currentTime);

        oscillator1.connect(gainNode);
        oscillator2.connect(gainNode);
        gainNode.connect(analyserNode);
        analyserNode.connect(context.destination);

        oscillator1.start();
        oscillator2.start();

        setTimeout(() => {
            oscillator1.stop();
            oscillator2.stop();
            context.close();
        }, 400);
    };

    const renderButton = (key: string) => (
        <button key={key} onClick={() => playTone(key)}>
            {key}
        </button>
    );

    return (
        <div className="keypad-container">
            <div className="keypad">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map(renderButton)}
            </div>
            <div className='waveform'>
                <Waveform analyser={analyser} />
            </div>
            <div className='fourier'>
                <Fourier analyser={analyser} />
            </div>
        </div>
    );
};

export default Keypad;
