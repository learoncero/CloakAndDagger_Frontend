import {it, expect, vi} from 'vitest';
import {screen, render} from '@testing-library/react';
import MapButton from "./MapButton";
import userEvent from '@testing-library/user-event';

it('should render the MapButton label',  async () => {
    const onClick = vi.fn()

    render(
        <MapButton handleToggleMiniMap={onClick} label="Show MiniMap"/>
    )
    screen.getByRole('button', {name: "Show MiniMap"});

    //Click has called onClick
    await userEvent.click(screen.getByRole('button', {name: "Show MiniMap"}));
    expect(onClick).toHaveBeenCalled();
});