import React from 'react';
import {screen, render, fireEvent, cleanup} from '@testing-library/react';
import KillButton from './KillButton';
import {it, expect, vi, afterEach} from 'vitest';

const handleKill = vi.fn();
afterEach(cleanup);

it('renders with disabled state when player is not nearby', () => {
    const { getByText } = render(
        <KillButton
            handleKill={handleKill}
            isPlayerNearby={false}
            isTimer={false}>
            Kill
        </KillButton>
    );
    const button = screen.getByRole("button", {name: "Kill"});
    expect(button.getAttribute('disabled')).toBe(''); // or use toBeDisabled(
});

it('renders with disabled state when timer is active', () => {
    const { getByText } = render(
        <KillButton
            handleKill={handleKill}
            isPlayerNearby={true}
            isTimer={true}>
            Kill
        </KillButton>
    );
    const button = screen.getByRole("button", {name: "Kill"});
    expect(button.getAttribute('disabled')).toBe('');
});

it('renders with enabled state when player is nearby and timer is not active', () => {
    const { getByText } = render(
        <KillButton
            handleKill={handleKill}
            isPlayerNearby={true}
            isTimer={false}>
            Kill
        </KillButton>
    );
    const button = screen.getByRole("button", {name: "Kill"});
    expect(button.getAttribute('disabled')).toBe(null);});

it('calls handleKill when clicked and enabled', () => {
    const { getByText } = render(
        <KillButton
            handleKill={handleKill}
            isPlayerNearby={true}
            isTimer={false}>
            Kill
        </KillButton>
    );
    const button = screen.getByRole("button", {name: "Kill"});
    fireEvent.click(button);
    expect(handleKill).toHaveBeenCalledTimes(1);
});

