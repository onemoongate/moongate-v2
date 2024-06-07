// pages/callback.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Callback = () => {
    const router = useRouter();

    useEffect(() => {
        const handleCallback = () => {
            const hash = window.location.hash.substring(1);
            const params = new URLSearchParams(hash);
            const accessToken = params.get('id_token');
            const error = params.get('error');
            const encodedState = params.get('state');
            const origin = decodeURIComponent(encodedState ?? '');
            if (accessToken) {
                // Send the postMessage to the parent window with the access token
                if (window.opener) {

                    window.opener.postMessage({ type: 'googleExternal', data: accessToken }, origin);
                    console.log("we sent")
                } else {
                    console.error('No opener window found');
                }
            } else if (error) {
                console.error('OAuth Error:', error);
                if (window.opener) {
                    window.opener.postMessage({ type: 'googleExternal', data: error }, origin);
                }
            }

            // Close the current window
            window.close();
        };

        handleCallback();
    }, [router.query]);

    return null;
};

export default Callback;
