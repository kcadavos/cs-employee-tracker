'use client'

import { useAppContext } from '@/lib/context/context';
import { login } from '@/lib/services/user-services';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { Label } from './ui/label';
import { AiOutlineLoading } from 'react-icons/ai';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import Link from 'next/link';

const LoginForm = () => {
    const { push } = useRouter();
    const { isLoggedIn, setIsLoggedIn } = useAppContext();

    const [user, setUser] = useState({ email: "", password: "" });
    const [rememberMe, setRememberMe] = useState(false);
    const [loginError, setLoginError] = useState(false);
    const [loggingIn, setLoggingIn] = useState(false);

    const inputsFilled = user.email !== "" && user.password !== "";

    const changeUser = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUser({
            ...user,
            [event.target.id]: event.target.value,
        });

    

        if (loginError) {
            setLoginError(false);
        }
    };

    const handleLogin = async () => {
        setLoggingIn(true);
        try {
            await login(user, rememberMe);
            setIsLoggedIn(true);

            localStorage.removeItem("Not Authorized");

            push("/employees");
        } catch {
            setLoginError(true);
        }
        setLoggingIn(false);
    };

    useEffect(() => {
        if (isLoggedIn && !localStorage.getItem("Not Authorized")) {
            push("/employees");
        }

        const getEmail = async () => {
            let email;

            if (localStorage.getItem("user"))
                email = await JSON.parse(localStorage.getItem("user")!).email;
            if (sessionStorage.getItem("user"))
                email = await JSON.parse(sessionStorage.getItem("user")!).email;

            setUser({
                ...user,
                email,
            });
        };

        if (localStorage.getItem("Not Authorized")) {
            getEmail();
        }
    }, [isLoggedIn]);


    return (
        <>
            <div>
                <div className='mb-2 block'>
                    <Label
                        htmlFor='email'
                        className={loginError ? "text-red-500" : ""}
                    >
                        Your email
                    </Label>
                </div>
                <Input
                    id='email'
                    type='email'
                    placeholder='name@example.com'
                    required
                    onChange={changeUser}
                    color={loginError ? 'failure' : ''}
                    className={loginError ? "border-red-500" : ""}
                />
                {
                    loginError && (
                        <p className="text-red-500 text-sm"><span className='font-medium'>Oops!</span> Email or password may be incorrect.</p>
                    )
                }
            </div>
            <div>
                <div className='mb-2 block'>
                    <Label htmlFor="password" className={loginError ? "text-red-500" : ""}>
                        Your password
                    </Label>
                </div>
                <Input
                    id="password"
                    type="password"
                    required
                    onChange={changeUser}
                    className={loginError ? "border-red-500" : ""}
                />
                {
                    loginError && (
                        <p className="text-red-500 text-sm"><span className='font-medium'>Oops!</span> Email or password may be incorrect.</p>
                    )
                }
            </div>
            <div className="flex items-center gap-2">
                <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(Boolean(checked))}
                />
                <Label htmlFor="remember">Remember me</Label>
            </div>
            <Button onClick={handleLogin} disabled={!inputsFilled || loggingIn}>
                {loggingIn ? (
                    <>
                        <AiOutlineLoading className="h-6 w-6 animate-spin mr-3" />
                        Logging in...
                    </>
                ) : (
                    "Login"
                )}
            </Button>
            <div className="flex w-75">
                <p>Don&apos;t have an account?</p>
                <Link href="/create-account" className="ml-2 text-blue-700 hover:underline">
                    Create one here :&#41;
                </Link>
            </div>
        </>
    )
}

export default LoginForm