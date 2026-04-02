import React from "react";
import {Link} from "react-router-dom";
import {Button} from "@heroui/react";

export default function ErrorNotFound() {
    return (
        <div className="relative min-h-screen bg-black flex flex-col items-center justify-center overflow-hidden px-6">

            {/* Grid background */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(251,146,60,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(251,146,60,0.05) 1px, transparent 1px)",
                    backgroundSize: "48px 48px",
                }}
            />

            {/* Orange glow */}
            <div
                className="absolute pointer-events-none"
                style={{
                    width: 500,
                    height: 500,
                    borderRadius: "50%",
                    background:
                        "radial-gradient(circle, rgba(251,146,60,0.13) 0%, transparent 70%)",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                }}
            />

            {/* Corner brackets */}
            <span className="absolute top-6 left-6 w-5 h-5 border-t-2 border-l-2 border-(--main-color-orange) opacity-60" />
            <span className="absolute top-6 right-6 w-5 h-5 border-t-2 border-r-2 border-(--main-color-orange) opacity-60" />
            <span className="absolute bottom-6 left-6 w-5 h-5 border-b-2 border-l-2 border-(--main-color-orange) opacity-60" />
            <span className="absolute bottom-6 right-6 w-5 h-5 border-b-2 border-r-2 border-(--main-color-orange) opacity-60" />

            {/* Badge */}
            <div className="flex items-center gap-4 mb-6 z-10">
                <div className="h-px w-10 bg-(--main-color-orange)" />
                <span className="font-mono text-xs tracking-widest text-(--main-color-orange) uppercase">
          system error
        </span>
                <div className="h-px w-10 bg-(--main-color-orange)" />
            </div>

            {/* 404 */}
            <h1 className="z-10 text-white font-extrabold leading-none tracking-tighter select-none"
                style={{ fontSize: "clamp(96px, 18vw, 160px)" }}>
                4<span className="text-(--main-color-orange)">0</span>4
            </h1>

            {/* Title */}
            <h2 className="z-10 mt-1 text-white font-bold tracking-widest uppercase"
                style={{ fontSize: "clamp(16px, 3.5vw, 26px)" }}>
                Page not found
            </h2>

            {/* Description */}
            <p className="z-10 mt-4 mb-10 font-mono text-xs text-white/40 text-center leading-relaxed max-w-sm">
                Stránka, ktorú hľadáte, neexistuje alebo bola presunutá na inú adresu.
            </p>

            {/* Actions */}
            <div className="z-10 flex flex-wrap gap-3 justify-center">
                <Link to = "/">
                    <Button className="justify-self-center self-start mt-5 p-7 font-bold bg-(--main-color-orange) col-start-2 row-start-3">Späť na domovskú stránku</Button>
                </Link>
            </div>

            {/* Footer */}
            <p className="absolute bottom-5 font-mono text-xs tracking-widest text-white/20 uppercase z-10">
                err_not_found · eleonore 2026
            </p>
        </div>
    );
}