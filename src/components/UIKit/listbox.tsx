'use client'

import * as Headless from '@headlessui/react'
import clsx from 'clsx'
import { Fragment } from 'react'

export function Listbox<T>({
  className,
  placeholder,
  autoFocus,
  'aria-label': ariaLabel,
  children: options,
  ...props
}: {
  className?: string
  placeholder?: React.ReactNode
  autoFocus?: boolean
  'aria-label'?: string
  children?: React.ReactNode
} & Omit<Headless.ListboxProps<typeof Fragment, T>, 'as' | 'multiple'>) {
  return (
    <Headless.Listbox {...props} multiple={false}>
      <Headless.ListboxButton
        autoFocus={autoFocus}
        data-slot="control"
        aria-label={ariaLabel}
        className={clsx([
          className,
          // Basic layout
          'group relative block w-full',
          // Background color + shadow applied to inset pseudo element, so shadow blends with border in light mode
          'before:absolute before:inset-px before:rounded-[calc(var(--radius-lg)-1px)] before:bg-white before:shadow-sm',
          // Background color is moved to control and shadow is removed in dark mode so hide `before` pseudo
          'dark:before:hidden',
          // Hide default focus styles
          'focus:outline-hidden',
          // Focus ring with better visibility
          'after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:ring-transparent after:ring-inset after:ring-2 after:transition-all data-focus:after:ring-blue-500 data-focus:after:ring-offset-0',
          // Disabled state
          'data-disabled:opacity-50 data-disabled:cursor-not-allowed data-disabled:before:bg-zinc-950/5 data-disabled:before:shadow-none',
          // Transition for smooth interactions
          'transition-all duration-150',
        ])}
      >
        <Headless.ListboxSelectedOption
          as="span"
          options={options}
          placeholder={placeholder && <span className="block truncate text-zinc-500 font-normal">{placeholder}</span>}
          className={clsx([
            // Basic layout
            'relative block w-full appearance-none rounded-lg py-[calc(--spacing(2.5)-1px)] sm:py-[calc(--spacing(2)-1px)]',
            // Set minimum height for when no value is selected
            'min-h-11 sm:min-h-9',
            // Horizontal padding
            'pr-[calc(--spacing(7)-1px)] pl-[calc(--spacing(3.5)-1px)] sm:pl-[calc(--spacing(3)-1px)]',
            // Typography with better font weight for selected values
            'text-left text-base/6 text-zinc-950 placeholder:text-zinc-500 sm:text-sm/6 dark:text-white forced-colors:text-[CanvasText] font-medium',
            // Border with better hover states
            'border border-zinc-950/10 group-data-active:border-zinc-950/30 group-data-hover:border-zinc-950/25 dark:border-white/10 dark:group-data-active:border-white/30 dark:group-data-hover:border-white/25',
            // Background color with subtle hover effect
            'bg-transparent dark:bg-white/5 group-data-hover:bg-zinc-50/50 dark:group-data-hover:bg-white/10',
            // Invalid state with better visibility
            'group-data-invalid:border-red-500 group-data-invalid:bg-red-50/50 group-data-hover:group-data-invalid:border-red-600 group-data-hover:group-data-invalid:bg-red-50/70 dark:group-data-invalid:border-red-600 dark:group-data-invalid:bg-red-950/20 dark:data-hover:group-data-invalid:border-red-500',
            // Disabled state
            'group-data-disabled:border-zinc-950/20 group-data-disabled:opacity-100 group-data-disabled:bg-zinc-50/30 dark:group-data-disabled:border-white/15 dark:group-data-disabled:bg-white/2.5 dark:group-data-disabled:data-hover:border-white/15',
            // Smooth transitions
            'transition-all duration-150',
          ])}
        />
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 sm:pr-2">
          <svg
            className="size-5 stroke-zinc-500 group-data-disabled:stroke-zinc-400 group-data-[open]:rotate-180 sm:size-4 dark:stroke-zinc-400 forced-colors:stroke-[CanvasText] transition-transform duration-200 ease-in-out"
            viewBox="0 0 16 16"
            aria-hidden="true"
            fill="none"
          >
            <path d="M4 6L8 10L12 6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </Headless.ListboxButton>
      <Headless.ListboxOptions
        transition
        anchor="selection start"
        className={clsx(
          // Anchor positioning
          '[--anchor-offset:-1.625rem] [--anchor-padding:--spacing(4)] sm:[--anchor-offset:-1.375rem]',
          // Base styles
          'isolate w-max min-w-[calc(var(--button-width)+1.75rem)] max-w-[calc(var(--button-width)+1.75rem)] scroll-py-1 rounded-xl p-1.5 select-none',
          // Z-index to ensure dropdown appears above dialogs and modals
          'z-50',
          // Invisible border that is only visible in `forced-colors` mode for accessibility purposes
          'outline outline-transparent focus:outline-hidden',
          // Handle scrolling when menu won't fit in viewport
          'overflow-y-auto overscroll-contain max-h-60',
          // Popover background with better opacity
          'bg-white/95 backdrop-blur-md dark:bg-zinc-800/95',
          // Shadows with better depth
          'shadow-xl ring-1 ring-zinc-950/10 dark:ring-white/10 dark:ring-inset',
          // Transitions with scale effect
          'transition-all duration-200 ease-out data-closed:data-leave:opacity-0 data-closed:data-leave:scale-95 data-transition:pointer-events-none'
        )}
      >
        {options}
      </Headless.ListboxOptions>
    </Headless.Listbox>
  )
}

export function ListboxOption<T>({
  children,
  className,
  ...props
}: { className?: string; children?: React.ReactNode } & Omit<
  Headless.ListboxOptionProps<'div', T>,
  'as' | 'className'
>) {
  const sharedClasses = clsx(
    // Base
    'flex min-w-0 items-center',
    // Icons
    '*:data-[slot=icon]:size-5 *:data-[slot=icon]:shrink-0 sm:*:data-[slot=icon]:size-4',
    '*:data-[slot=icon]:text-zinc-500 group-data-focus/option:*:data-[slot=icon]:text-white dark:*:data-[slot=icon]:text-zinc-400',
    'forced-colors:*:data-[slot=icon]:text-[CanvasText] forced-colors:group-data-focus/option:*:data-[slot=icon]:text-[Canvas]',
    // Avatars
    '*:data-[slot=avatar]:-mx-0.5 *:data-[slot=avatar]:size-6 sm:*:data-[slot=avatar]:size-5'
  )

  return (
    <Headless.ListboxOption as={Fragment} {...props}>
      {({ selectedOption }) => {
        if (selectedOption) {
          return <div className={clsx(className, sharedClasses)}>{children}</div>
        }

        return (
          <div
            className={clsx(
              // Basic layout
              'group/option grid cursor-pointer grid-cols-[--spacing(5)_1fr] items-center gap-x-2 rounded-lg py-2.5 pr-3.5 pl-2 sm:grid-cols-[--spacing(4)_1fr] sm:py-2 sm:pr-3 sm:pl-1.5',
              // Typography
              'text-base/6 text-zinc-950 sm:text-sm/6 dark:text-white forced-colors:text-[CanvasText] font-medium',
              // Hover state with smooth transition
              'hover:bg-zinc-100 dark:hover:bg-zinc-700/50',
              // Focus with better visual feedback
              'outline-hidden data-focus:bg-blue-500 data-focus:text-white data-focus:shadow-sm',
              // Forced colors mode
              'forced-color-adjust-none forced-colors:data-focus:bg-[Highlight] forced-colors:data-focus:text-[HighlightText]',
              // Disabled
              'data-disabled:opacity-50 data-disabled:cursor-not-allowed data-disabled:hover:bg-transparent',
              // Smooth transitions
              'transition-all duration-150 ease-in-out'
            )}
          >
            <svg
              className="relative hidden size-5 self-center stroke-current group-data-selected/option:inline sm:size-4 text-blue-600 group-data-focus:text-white transition-opacity duration-150"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path d="M4 8.5l3 3L12 4" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className={clsx(className, sharedClasses, 'col-start-2')}>{children}</span>
          </div>
        )
      }}
    </Headless.ListboxOption>
  )
}

export function ListboxLabel({ className, ...props }: React.ComponentPropsWithoutRef<'span'>) {
  return <span {...props} className={clsx(className, 'ml-2.5 truncate first:ml-0 sm:ml-2 sm:first:ml-0 leading-normal')} />
}

export function ListboxDescription({ className, children, ...props }: React.ComponentPropsWithoutRef<'span'>) {
  return (
    <span
      {...props}
      className={clsx(
        className,
        'flex flex-1 overflow-hidden text-zinc-500 group-data-focus/option:text-white before:w-2 before:min-w-0 before:shrink dark:text-zinc-400'
      )}
    >
      <span className="flex-1 truncate">{children}</span>
    </span>
  )
}
