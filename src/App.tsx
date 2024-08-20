// src/App.tsx
import Keypad from './Keypad';
import './App.css'
import keypad from './assets/keypad.png'
import React, { useEffect, useState } from 'react';
import interferenceLight from './assets/interference_light.png';
import interferenceDark from './assets/interference_dark.png';
import fourierLight from './assets/fourier_light.png'
import fourierDark from './assets/fourier_dark.png'

const App: React.FC = () => {
    const [interferenceSrc, setInterferenceSrc] = useState(interferenceLight);
    const [fourierSrc, setFourierSrc] = useState(interferenceLight);

    useEffect(() => {
        const matchMedia = window.matchMedia('(prefers-color-scheme: dark)');

        const updateImageSrc = (e) => {
            setInterferenceSrc(e.matches ? interferenceDark : interferenceLight);
            setFourierSrc(e.matches ? fourierDark : fourierLight);
        };

        // Set the initial image based on the current color scheme
        updateImageSrc(matchMedia);

        // Listen for changes in the color scheme
        matchMedia.addEventListener('change', updateImageSrc);

        // Cleanup event listener on component unmount
        return () => {
            matchMedia.removeEventListener('change', updateImageSrc);
        };
    }, []);

    return (
        <div className="App">
            <h1 className='h1'>Why do Buttons Beep?</h1>
            <Keypad />
            <br></br>
            <h2>DTMF Signaling</h2>
            <p>
                This principle is called <a href='https://en.wikipedia.org/wiki/Dtmf' target="_blank">Dual-Tone Multifrequency (DTMF) Signaling</a>. The driving principle behind it is the <a href='https://en.wikipedia.org/wiki/Fourier_transform' target='_blank'>Fourier Transform</a> (FT).
                <br></br>
                Here's a very quick rundown on how it works: The numbers and character on a keypad are arranged in the shape of a grid:
            </p>
            <img src={keypad} alt="A keypad showing DTMF signalling frequencies"></img>
            <p>
                This means that when someone presses a number, two sound frequences will be emitted. The number 4, for example, emits the frequencies 770Hz and 1209Hz. When two frequencies are generated at the same time, they interfere with each other.
            </p>
            <img src={interferenceSrc} width={950} height={100}></img>
            <p></p>
            <p>
                The resulting sound wave is what gets transmitted over the phone line when you press a button when on hold with your airline. In reality, however, the signal is not that clean due to other background and transmission noises. The airline needs to somehow regain the information that you pressed the number 4 from a pretty complex sound wave.
            </p>
            <h2>The Fourier Transform</h2>
            <p>
                The waves above are all in the <b>time domain</b>, easy to recognize since the x-axis represents time. The fourier transform is an algorithm that transforms a sound wave from the time domain into the frequency domain:
            </p>
            <img src={fourierSrc} width={450} height={150}></img>
            <p>
                In the frequency domain, the x-axis are frequencies. We can clearly see that the transformed waveform has two distinct peaks at 770Hz and 1209 Hz. The answering system at the airline recogniyes this, and since every pair of frequencies is unique, they can conclude that the number 4 must have been pressed and will forward you to the complaints department.
            </p>
        </div>
    );
};

export default App;
