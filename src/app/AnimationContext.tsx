import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Definiere den Typ für den Kontextwert
interface AnimationContextType {
    spriteIndex: number;
}

// Erstelle den Kontext mit einem initialen Objekt, das die gleiche Struktur hat
const AnimationContext = createContext<AnimationContextType>({ spriteIndex: 0 });

export const useAnimation = () => useContext(AnimationContext);

interface Props {
    children: ReactNode;
}

export const AnimationProvider: React.FC<Props> = ({ children }) => {
    const [spriteIndex, setSpriteIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setSpriteIndex(prevIndex => (prevIndex + 1) % 4); // Angenommen, du hast 4 Sprites
        }, 250);

        return () => clearInterval(interval);
    }, []);

    return (
        <AnimationContext.Provider value={{ spriteIndex }}>
            {children}
        </AnimationContext.Provider>
    );
};
