"use client"

/**
 * Toggles the dark mode class on the HTML element and the invert class on the dark mode icon.
 *
 * This function checks if the HTML element has the 'dark' class. If it does, it removes the 'dark' class
 * and the 'invert' class from the dark mode icon. If it does not, it adds the 'dark' class to the HTML element
 * and the 'invert' class to the dark mode icon.
 */
export default function useDarkMode() {
    if (document.querySelector('html')?.classList.contains('dark')) {
        document.querySelector('html')?.classList.remove('dark')
        document.getElementById("darkmode-icon")?.classList.remove('invert')
    } else {
        document.querySelector('html')?.classList.add('dark')
        document.getElementById("darkmode-icon")?.classList.add('invert')
    }
}
