import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/app/actions';
import LoginPageContent from './LoginPageContent';

/**
 * Login Page - SERVER COMPONENT
 * Redirects already-authenticated users away from login page.
 * Delegates interactive form to LoginPageContent (client).
 */
export default async function LoginPage() {
    const user = await getCurrentUser();

    // Already authenticated - redirect to home
    if (user) {
        redirect('/');
    }

    return <LoginPageContent />;
}
