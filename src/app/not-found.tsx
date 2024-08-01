import Link from 'next/link';

/**
 * NotFound component
 *
 * This component renders a simple "Not Found" page with a message and a link to return to the home page.
 *
 * @returns {JSX.Element} The rendered "Not Found" component
 */
export default function NotFound() {
    return (
        <div>
            <h2>Not Found</h2>
            <p>Could not find requested resource</p>
            <Link href='/'>Return Home</Link>
        </div>
    );
}
