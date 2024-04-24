import React, { useState, useEffect } from 'react';
import { Player, Role } from "@/app/types";
import { useAnimation } from '@/app/AnimationContext';


interface SpriteConfig {
    dead: string;
    mov: string[];
    idle: string;
}


interface Sprites {
    [key: string]: SpriteConfig;
}


const sprites: Sprites = {
    red: {
        dead: '/Sprites/Red/RedDead.png',
        mov: [
            '/Sprites/Red/Red1.png',
            '/Sprites/Red/Red2.png',
            '/Sprites/Red/Red3.png',
            '/Sprites/Red/Red4.png'
        ],
        idle: '/Sprites/Red/RedIdle.png'
    },
    blue: {
        dead: '/Sprites/Blue/BlueDead.png',
        mov: [
            '/Sprites/Blue/Blue1.png',
            '/Sprites/Blue/Blue2.png',
            '/Sprites/Blue/Blue3.png',
            '/Sprites/Blue/Blue4.png'
        ],
        idle: '/Sprites/Blue/BlueIdle.png'
    },
    brown: {
        dead: '/Sprites/Brown/BrownDead.png',
        mov: [
            '/Sprites/Brown/Brown1.png',
            '/Sprites/Brown/Brown2.png',
            '/Sprites/Brown/Brown3.png',
            '/Sprites/Brown/Brown4.png'
        ],
        idle: '/Sprites/Brown/BrownIdle.png'
    },
    pink: {
        dead: '/Sprites/Pink/PinkDead.png',
        mov: [
            '/Sprites/Pink/Pink1.png',
            '/Sprites/Pink/Pink2.png',
            '/Sprites/Pink/Pink3.png',
            '/Sprites/Pink/Pink4.png'
        ],
        idle: '/Sprites/Pink/PinkIdle.png'
    },
    purple: {
        dead: '/Sprites/Purple/PurpleDead.png',
        mov: [
            '/Sprites/Purple/Purple1.png',
            '/Sprites/Purple/Purple2.png',
            '/Sprites/Purple/Purple3.png',
            '/Sprites/Purple/Purple4.png'
        ],
        idle: '/Sprites/Purple/PurpleIdle.png'
    },
    black: {
        dead: '/Sprites/Black/BlackDead.png',
        mov: [
            '/Sprites/Black/Black1.png',
            '/Sprites/Black/Black2.png',
            '/Sprites/Black/Black3.png',
            '/Sprites/Black/Black4.png'
        ],
        idle: '/Sprites/Black/BlackIdle.png'
    },
    türkis: {
        dead: '/Sprites/Türkis/TürkisDead.png',
        mov: [
            '/Sprites/Türkis/Türkis1.png',
            '/Sprites/Türkis/Türkis2.png',
            '/Sprites/Türkis/Türkis3.png',
            '/Sprites/Türkis/Türkis4.png'
        ],
        idle: '/Sprites/Türkis/TürkisIdle.png'
    }
};




const getPlayerColor = (playerId: number): keyof Sprites => {
    const colors: Array<keyof Sprites> = ['red', 'blue', 'brown' ,'black','pink','türkis','purple'];
    return colors[playerId % colors.length];
};


interface PlayerSpritesProps {
    player: Player;
}

// Sprite Components
const PlayerSprites: React.FC<PlayerSpritesProps> = ({ player }) => {
    const [isGhost, setIsGhost] = useState(player.role === Role.IMPOSTOR_GHOST || player.role === Role.CREWMATE_GHOST);
    const { spriteIndex } = useAnimation();
    const playerColor = getPlayerColor(player.id);
    const currentSprites = sprites[playerColor];

    useEffect(() => {
        setIsGhost(player.role === Role.IMPOSTOR_GHOST || player.role === Role.CREWMATE_GHOST);
    }, [player.role]);

    // Current Sprite
    const spriteUrl = isGhost ? currentSprites.dead : (player.moving ? currentSprites.mov[spriteIndex] : currentSprites.idle);
    const transformStyle = player.mirrored ? { transform: 'scaleX(-1)' } : {};

    return (
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '60%', maxWidth: '90%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'Black' }}>
                {player.username}
            </div>
            <div style={{
                width: '72%',
                height: '72%',
                backgroundImage: `url(${spriteUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                ...transformStyle
            }} />
        </div>
    );
};

export default PlayerSprites;
