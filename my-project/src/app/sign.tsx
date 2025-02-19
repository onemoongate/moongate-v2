'use client';
import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletName } from '@solana/wallet-adapter-base';

const SignInButton = ({ provider, icon, onClick }: any) => {
    const getButtonColor = () => {
        switch (provider) {
            case 'Google':
                return 'bg-white hover:bg-gray-300 text-gray-800 border border-gray-300';
            case 'Ethereum':
                return 'bg-blue-600 hover:bg-blue-700 text-white';
            case 'Apple':
                return 'bg-black hover:bg-gray-900 text-white';
            default:
                return 'bg-gray-500 hover:bg-gray-600 text-white';
        }
    };

    return (
        <button
            onClick={onClick}
            className={`flex items-center justify-center rounded-md hover:scale-105 p-3 ${getButtonColor()}`}
            style={{ display: 'inline-flex', width: '60px', height: '60px' }}
        >
            <div className="w-6 h-6">{icon}</div>
        </button>
    );
};

const SignInButtons = () => {
    const { select } = useWallet();

    // Define wallet names
    const google = "Sign in with Google" as WalletName;
    const apple = "Sign in with Apple" as WalletName;
    const ethereum = "Ethereum Wallet" as WalletName;

    const handleSignIn = (provider: any) => {
        console.log(`Selecting wallet: ${provider}`);
        switch (provider) {
            case 'Google':
                select(google);
                break;
            case 'Ethereum':
                select(ethereum);
                break;
            case 'Apple':
                select(apple);
                break;
            default:
                console.error('Unknown provider');
        }
    };

    return (
        <div className="w-full max-w-md mx-auto" style={{ display: 'flex', flexDirection: 'row', gap: '20px', justifyContent: 'center' }}>
            <SignInButton
                provider="Google"
                onClick={() => handleSignIn('Google')}
                icon={
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                        />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                        />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                        />
                    </svg>
                }
            />

            <SignInButton
                provider="Ethereum"
                onClick={() => handleSignIn('Ethereum')}
                icon={
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z"
                            fill="white"
                        />
                    </svg>
                }
            />

            <SignInButton
                provider="Apple"
                onClick={() => handleSignIn('Apple')}
                icon={
                    <svg viewBox="0 0 24 30" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M17.6 13.8c0-3 2.5-4.5 2.6-4.6-1.4-2.1-3.6-2.4-4.4-2.4-1.9-.2-3.6 1.1-4.6 1.1-.9 0-2.4-1.1-4-1-2 0-3.9 1.2-5 3-2.1 3.7-.5 9.1 1.5 12.1 1 1.5 2.2 3.1 3.8 3 1.5-.1 2.1-1 3.9-1s2.4.9 4 .9 2.7-1.5 3.7-2.9c1.2-1.7 1.6-3.3 1.7-3.4-.1-.1-3.2-1.3-3.2-4.8zm-3-8.9c.8-1 1.4-2.4 1.2-3.8-1.2.1-2.7.8-3.5 1.8-.8.9-1.5 2.3-1.3 3.7 1.4.1 2.8-.7 3.6-1.7z"
                            fill="white"
                        />
                    </svg>
                }
            />
        </div>
    );
};

export default SignInButtons;