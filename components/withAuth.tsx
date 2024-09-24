'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebaseConfig';

const withAuth = (WrappedComponent: React.ComponentType<any>) => {
    const AuthComponent = (props: any) => {
        const [isMounted, setIsMounted] = useState(false);
        const [loading, setLoading] = useState(true);
        const router = useRouter();

        useEffect(() => {
            setIsMounted(true);
        }, []);

        useEffect(() => {
            if (isMounted) {
                const token = localStorage.getItem('token');
                if (!token) {
                    router.push('/signin');
                } else {
                    auth.onAuthStateChanged((user) => {
                        if (!user) {
                            localStorage.removeItem('token');
                            router.push('/signin');
                        } else {
                            setLoading(false);
                        }
                    });
                }
            }
        }, [isMounted, router]);

        if (!isMounted || loading) return null;

        return <WrappedComponent {...props} />;
    };

    return AuthComponent;
};

export default withAuth;