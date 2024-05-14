import React, {useEffect, useState} from 'react';
import {Player, Role} from "@/app/types";
import {useAnimation} from '@/app/AnimationContext';

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
    turquoise: {
        dead: '/Sprites/Turquoise/TurquoiseDead.png',
        mov: [
            '/Sprites/Turquoise/Turquoise1.png',
            '/Sprites/Turquoise/Turquoise2.png',
            '/Sprites/Turquoise/Turquoise3.png',
            '/Sprites/Turquoise/Turquoise4.png'
        ],
        idle: '/Sprites/Turquoise/TurquoiseIdle.png'
    }
};

interface PlayerSpritesProps {
    player: Player;
    currentPlayerRole: Role;
}

// Sprite Components
const PlayerSprites: React.FC<PlayerSpritesProps> = ({ player, currentPlayerRole }: PlayerSpritesProps) => {

    const [isGhost, setIsGhost] = useState(player.role === Role.IMPOSTOR_GHOST || player.role === Role.CREWMATE_GHOST);
    const { spriteIndex } = useAnimation();
    const currentSprites = sprites[player.playerColor]; // Use playerColor directly

    useEffect(() => {
        setIsGhost(player.role === Role.IMPOSTOR_GHOST || player.role === Role.CREWMATE_GHOST);
    }, [player.role]);

    const spriteUrl = isGhost ? currentSprites.dead : (player.moving ? currentSprites.mov[spriteIndex] : currentSprites.idle);
    const transformStyle = player.mirrored ? { transform: 'scaleX(-1)' } : {};
    const isCurrentPlayerImpostor = (currentPlayerRole === Role.IMPOSTOR_GHOST || currentPlayerRole === Role.IMPOSTOR);
    const isOtherPlayerImpostor = (player.role === Role.IMPOSTOR_GHOST || player.role === Role.IMPOSTOR);

    const usernameColour = isCurrentPlayerImpostor && isOtherPlayerImpostor ? 'Crimson' : 'Black';

    return (
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontWeight: '700',  fontSize: '70%', maxWidth: '90%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: usernameColour}}>
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