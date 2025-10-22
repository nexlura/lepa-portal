'use client';

import React, { useState, useRef, useEffect } from 'react';

interface TooltipProps {
    children: React.ReactNode;
    content: string;
    position?: 'left' | 'right' | 'top' | 'bottom';
    disabled?: boolean;
}

export const Tooltip: React.FC<TooltipProps> = ({
    children,
    content,
    position = 'right',
    disabled = false
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
    const triggerRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isVisible && triggerRef.current && tooltipRef.current) {
            const triggerRect = triggerRef.current.getBoundingClientRect();
            const tooltipRect = tooltipRef.current.getBoundingClientRect();

            let top = 0;
            let left = 0;

            switch (position) {
                case 'right':
                    top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
                    left = triggerRect.right + 8;
                    break;
                case 'left':
                    top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
                    left = triggerRect.left - tooltipRect.width - 8;
                    break;
                case 'top':
                    top = triggerRect.top - tooltipRect.height - 8;
                    left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
                    break;
                case 'bottom':
                    top = triggerRect.bottom + 8;
                    left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
                    break;
            }

            setTooltipPosition({ top, left });
        }
    }, [isVisible, position]);

    if (disabled) {
        return <>{children}</>;
    }

    return (
        <>
            <div
                ref={triggerRef}
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}
                className="relative"
            >
                {children}
            </div>

            {isVisible && (
                <div
                    ref={tooltipRef}
                    className="fixed z-50 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded shadow-lg pointer-events-none"
                    style={{
                        top: tooltipPosition.top,
                        left: tooltipPosition.left,
                    }}
                >
                    {content}
                    <div
                        className="absolute w-2 h-2 transform rotate-45"
                        style={{
                            top: position === 'bottom' ? '-4px' : position === 'top' ? 'calc(100% - 4px)' : '50%',
                            left: position === 'right' ? '-4px' : position === 'left' ? 'calc(100% - 4px)' : '50%',
                            transform: position === 'top' || position === 'bottom'
                                ? `translateX(-50%) ${position === 'top' ? 'translateY(2px)' : 'translateY(-2px)'} rotate-45`
                                : `translateY(-50%) ${position === 'left' ? 'translateX(2px)' : 'translateX(-2px)'} rotate-45`
                        }}
                    />
                </div>
            )}
        </>
    );
};
