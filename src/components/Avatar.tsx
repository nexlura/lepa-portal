import React from 'react';

// Helper function to generate a color based on a string (the full name)
function stringToColor(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        // Simple hash algorithm
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Convert hash to an HSL color (Hue varies with name)
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 50%)`;
}

export default function Avatar(props: { fullName: string }) {
    const firstLetter = props.fullName?.trim()?.charAt(0)?.toUpperCase() || '?';
    const bgColor = stringToColor(props.fullName || 'User');

    return (
        <div
            className="h-8 w-8 rounded-full flex items-center justify-center text-white text-sm font-medium select-none"
            style={{ backgroundColor: bgColor }}
        >
            {firstLetter}
        </div>
    );
}
