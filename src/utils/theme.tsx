"use client"
export default function useDarkMode() {

    if (document.querySelector('html')?.classList.contains('dark')) {
        document.querySelector('html')?.classList.remove('dark')
        document.getElementById("darkmode-icon")?.classList.remove('invert')

    } else {
        document.querySelector('html')?.classList.add('dark')
        document.getElementById("darkmode-icon")?.classList.add('invert')
    }
}
