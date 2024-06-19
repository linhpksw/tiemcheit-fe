'use client'
import React from 'react';
import { AuthFormLayout } from "@/components";
import { OTPInput } from 'input-otp';
import useVerification from './useVerification';

const Verification = () => {
    const { verify } = useVerification();

    return (
        <AuthFormLayout
            authTitle="Xác minh chính là bạn"
            helpText="Bạn đã nhận được mã xác minh qua email. Vui lòng nhập mã gồm 6 chữ số vào ô bên dưới để xác minh tài khoản."
        >
            <OTPInput
                maxLength={6}
                onComplete={verify}
                containerClassName="group flex items-center has-[:disabled]:opacity-70"
                autoFocus
                inputMode="numeric"
                render={({ slots }) => (
                    <>
                        <div className="flex">
                            {slots.slice(0, 3).map((slot, idx) => (
                                <Slot key={idx} {...slot} />
                            ))}
                        </div>

                        <FakeDash />

                        <div className="flex">
                            {slots.slice(3).map((slot, idx) => (
                                <Slot key={idx} {...slot} />
                            ))}
                        </div>
                    </>
                )}
            />
        </AuthFormLayout>
    );
};

function Slot({ isActive, char, hasFakeCaret }) {
    return (
        <div
            className={`relative w-10 h-14 text-[2rem] flex items-center justify-center transition-all duration-300 border-primary-300 border-y border-r first:border-l first:rounded-l-md last:rounded-r-md group-hover:border-primary-500 group-focus-within:border-primary-500 ${isActive ? 'outline-4 outline-primary-500' : 'outline outline-0 outline-primary-500/20'}`}
        >
            {char !== null && <div>{char}</div>}
            {hasFakeCaret && <FakeCaret />}
        </div>
    );
}

function FakeCaret() {
    return (
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center animate-caret-blink">
            <div className="w-px h-8 bg-primary-600" />
        </div>
    );
}

function FakeDash() {
    return (
        <div className="flex w-10 justify-center items-center">
            <div className="w-3 h-1 rounded-full bg-primary-300" />
        </div>
    );
}

export default Verification;
