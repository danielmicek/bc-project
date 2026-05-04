import {SignedOut, SignInButton} from "@clerk/clerk-react";
import {Button} from "@heroui/react";
import React from "react";


export default function RegistrationComponent() {
    const perks = [
        {
            text: "Ukladanie progresu",
            iconPath: "/progress.png",
        },
        {
            text: "Osobné štatistiky",
            iconPath: "/stats.png",
        },
        {
            text: "Certifikát po kurze",
            iconPath: "/certificate.png",
        },
    ];

    return (
        <aside id="CREATE_PROFILE_COMPONENT" className=" relative w-full overflow-hidden rounded-lg border border-white/12 bg-white/[0.08] p-5 text-white shadow-[0_24px_80px_rgba(0,0,0,0.38)] backdrop-blur-xl sm:p-6 lg:sticky lg:top-8"
        >
            <div className="absolute inset-x-0 top-0 h-1 bg-[var(--main-color-orange)]"/>
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.12),rgba(255,255,255,0)_45%)]"/>

            <div className="relative flex flex-col gap-6">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white text-black shadow-[0_14px_35px_rgba(252,147,40,0.24)]">
                        <img src="/add-user.png" alt="" className="h-6 w-6 object-contain"/>
                    </div>
                </div>

                <div className="space-y-3">
                    <p id="NOT_SIGNED_YET" className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--main-color-orange)]">
                        Nový používateľ?
                    </p>
                    <div id="DO_IT_NOW" className="space-y-2">
                        <h2 className="text-3xl font-black leading-tight text-white sm:text-4xl">
                            Vytvor si účet
                            <br/>
                            a uč sa naplno.
                        </h2>
                        <p id="GET_ACCESS" className="text-sm leading-6 text-white/68 sm:text-base">
                            Získaš prístup k funkciám, ktoré z anonymného prehliadania spravia
                            plnohodnotný študijný profil.
                        </p>
                    </div>
                </div>

                <div className="grid gap-3">
                    {perks.map(({text, iconPath}) => (
                        <div key={text} className="flex items-center gap-3 rounded-lg border border-white/10 bg-black/18 px-4 py-3">
                            <img src={iconPath} alt="" className="h-5 w-5 shrink-0 object-contain"/>
                            <span className="text-sm font-semibold text-white/82">{text}</span>
                        </div>
                    ))}
                </div>

                <SignedOut>
                    <SignInButton className = "bg-(--main-color-orange) font-bold" mode={"modal"}>
                        <Button className = "w-full h-full">Registrácia</Button>
                    </SignInButton>
                </SignedOut>

                <div className="flex items-center justify-center gap-2 text-xs font-medium text-white/45">
                    <img src="/clerk_logo.png" alt="" className="h-4 w-4 object-contain opacity-70"/>
                    Bezpečné prihlásenie cez Clerk
                </div>
            </div>
        </aside>
    );
}
