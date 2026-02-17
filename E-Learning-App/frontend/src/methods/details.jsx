import React from "react";

export const testsAndLearningDetails = {
    "N/A": [
        <li>Obsah systematicky rozdelený do <span className="text-[var(--main-color-orange)] font-bold">desiatich kapitol</span></li>,
        <li>Dôraz kladený na <span className="text-[var(--main-color-orange)] font-bold">pochopenie súvislostí</span> medzi jednotlivými konceptmi</li>,
        <li>Jasne formulované vysvetlenia podporujú <span className="text-[var(--main-color-orange)] font-bold">hlbšie porozumenie, nie len memorovanie</span></li>,
        <li>Základné metodiky, procesy a návrhové princípy</li>
    ],

    Ľahký: [
        <li>20 minút, 13 bodov <span className="text-[var(--main-color-orange)] font-bold">10 single-select otázok</span>: 7 ľahkých + 3 stredne ťažké</li>,
        <li>
            <span className="text-[var(--main-color-orange)] font-bold">Správna odpoveď:</span> +1 bod,<br/>
            <span className="text-[var(--main-color-orange)] font-bold">Nesprávna odpoveď:</span> -0.1 bodu,<br/>
            <span className="text-[var(--main-color-orange)] font-bold">Možnost "Neodpovedať":</span> 0 bodov,<br/>
            <span className="text-[var(--main-color-orange)] font-bold">Nezodpovedaná odpoveď:</span> -1 bod
        </li>,
        <li>Pri získaní <span className="text-[var(--main-color-orange)] font-bold">známky A</span> získaš <span className="text-[#CD7F32] font-bold">bronzovú medailu</span></li>,
        <li>Test je hodnotený na základe <span className="text-[var(--main-color-orange)] font-bold">FEI STU stupnice</span></li>,
        <li>V prípade ukončenia testu alebo uplynutia časového limitu bude test automaticky vyhodnotený</li>
    ],

    Stredný: [
        <li>40 minút, 40 bodov <span className="text-[var(--main-color-orange)] font-bold">20 single-select / multi-select otázok</span>: 5 ľahkých + 10 stredne ťažkých + 5 ťažkých</li>,
        <li>
            <span className="text-[var(--main-color-orange)] font-bold">Správna odpoveď:</span> +1 bod (ľahká), +2 body (stredná). Multi-select: body sa delia podľa počtu správnych odpovedí.<br/>
            <span className="text-[var(--main-color-orange)] font-bold">Nesprávna odpoveď:</span> −0,2 bodu. Multi-select: penalizácia sa rozdeľuje podľa počtu odpovedí.<br/>
            <span className="text-[var(--main-color-orange)] font-bold">Možnost "Neodpovedať":</span> 0 bodov,<br/>
            <span className="text-[var(--main-color-orange)] font-bold">Nezodpovedaná odpoveď:</span> -1 bod (ľahká), -2 body (stredná)
        </li>,
        <li>Pri získaní <span className="text-[var(--main-color-orange)] font-bold">známky A</span> získaš <span className="text-[#C0C0C0] font-bold">striebornú medailu</span></li>,
        <li>Test je hodnotený na základe <span className="text-[var(--main-color-orange)] font-bold">FEI STU stupnice</span></li>,
        <li>V prípade ukončenia testu alebo uplynutia časového limitu bude test automaticky vyhodnotený</li>
    ],

    Ťažký: [
        <li>60 minút, 70 bodov <span className="text-[var(--main-color-orange)] font-bold">20 single-select / multi-select otázok</span>: 5 ľahkých + 10 stredne ťažkých + 15 ťažkých</li>,
        <li>
            <span className="text-[var(--main-color-orange)] font-bold">Správna odpoveď:</span> +1 bod (ľahká), +2 body (stredná), +3 body (ťažká). Multi-select: body sa delia podľa počtu správnych odpovedí.<br/>
            <span className="text-[var(--main-color-orange)] font-bold">Nesprávna odpoveď:</span> −0,3 bodu. Multi-select: penalizácia sa rozdeľuje podľa počtu odpovedí.<br/>
            <span className="text-[var(--main-color-orange)] font-bold">Možnost "Neodpovedať":</span> 0 bodov,<br/>
            <span className="text-[var(--main-color-orange)] font-bold">Nezodpovedaná odpoveď:</span> -1 bod (ľahká), -2 body (stredná), -3 body (ťažká)
        </li>,
        <li>Pri získaní <span className="text-[var(--main-color-orange)] font-bold">známky A</span> získaš <span className="text-[#FFD700] font-bold">zlatú medailu</span></li>,
        <li>Test je hodnotený na základe <span className="text-[var(--main-color-orange)] font-bold">FEI STU stupnice</span></li>,
        <li>V prípade ukončenia testu alebo uplynutia časového limitu bude test automaticky vyhodnotený</li>
    ]
}



export const chaptersDetails = {
    "Kapitola 1": [
        <li>Čo je <span className="text-[var(--main-color-orange)] font-bold">softvérové inžinierstvo</span> a aké sú jeho hlavné ciele</li>,
        <li>Rozdiel medzi <span className="text-[var(--main-color-orange)] font-bold">všeobecným</span> a <span className="text-[var(--main-color-orange)] font-bold">zákazníckym</span> softvérom</li>,
        <li><span className="text-[var(--main-color-orange)] font-bold">Kritické systémy</span></li>,
        <li>Čo všetko ovplyvňuje <span className="text-[var(--main-color-orange)] font-bold">spoľahlivosť</span></li>
    ],

    "Kapitola 2": [
        <li>Fázy <span className="text-[var(--main-color-orange)] font-bold">softvérového procesu</span></li>,
        <li>Rozdiel medzi <span className="text-[var(--main-color-orange)] font-bold">plánom riadeným</span> a <span className="text-[var(--main-color-orange)] font-bold">agilným vývojom</span></li>,
        <li><span className="text-[var(--main-color-orange)] font-bold">Vodopádový model</span> a jeho vlastnosti</li>,
        <li><span className="text-[var(--main-color-orange)] font-bold">Prototypovanie</span> a inkrementálne doručovanie</li>
    ],

    "Kapitola 3": [
        <li>Proces <span className="text-[var(--main-color-orange)] font-bold">plánovania projektu</span></li>,
        <li>Typy <span className="text-[var(--main-color-orange)] font-bold">rizík</span> a ich riadenie</li>,
        <li><span className="text-[var(--main-color-orange)] font-bold">Agilné plánovanie</span></li>,
        <li>Význam <span className="text-[var(--main-color-orange)] font-bold">tímovej spolupráce</span></li>
    ],

    "Kapitola 4": [
        <li>Čo sú <span className="text-[var(--main-color-orange)] font-bold">požiadavky</span> a ich typy</li>,
        <li><span className="text-[var(--main-color-orange)] font-bold">Funkcionálne</span> a <span className="text-[var(--main-color-orange)] font-bold">nefunkcionálne</span> požiadavky</li>,
        <li>Proces <span className="text-[var(--main-color-orange)] font-bold">získavania a validácie</span> požiadaviek</li>,
        <li><span className="text-[var(--main-color-orange)] font-bold">Riadenie zmien</span> požiadaviek</li>
    ],

    "Kapitola 5": [
        <li>Význam <span className="text-[var(--main-color-orange)] font-bold">systémového modelovania</span></li>,
        <li>Typy <span className="text-[var(--main-color-orange)] font-bold">UML diagramov</span></li>,
        <li><span className="text-[var(--main-color-orange)] font-bold">Perspektívy systému</span></li>,
        <li><span className="text-[var(--main-color-orange)] font-bold">Modelom riadené inžinierstvo</span> (MDE)</li>
    ],

    "Kapitola 6": [
        <li>Čo je <span className="text-[var(--main-color-orange)] font-bold">architektúra systému</span></li>,
        <li><span className="text-[var(--main-color-orange)] font-bold">Architektonické pohľady</span></li>,
        <li><span className="text-[var(--main-color-orange)] font-bold">Architektonické vzory</span> a štýly</li>,
        <li>Význam správneho <span className="text-[var(--main-color-orange)] font-bold">návrhu štruktúry</span></li>
    ],

    "Kapitola 7": [
        <li>Čo znamená <span className="text-[var(--main-color-orange)] font-bold">opätovné použitie softvéru</span></li>,
        <li><span className="text-[var(--main-color-orange)] font-bold">Softvérové rámce</span> a produktové rady</li>,
        <li>Výhody a nevýhody <span className="text-[var(--main-color-orange)] font-bold">reuse prístupu</span></li>,
        <li>Konfigurácia systému</li>
    ],

    "Kapitola 8": [
        <li>Rozdiel medzi <span className="text-[var(--main-color-orange)] font-bold">plánovaným</span> a <span className="text-[var(--main-color-orange)] font-bold">agilným vývojom</span></li>,
        <li><span className="text-[var(--main-color-orange)] font-bold">Extrémne programovanie (XP)</span></li>,
        <li>Metodika <span className="text-[var(--main-color-orange)] font-bold">Scrum</span> a šprinty</li>,
        <li>Význam <span className="text-[var(--main-color-orange)] font-bold">iterácií</span> a spolupráce so zákazníkom</li>
    ],

    "Kapitola 9": [
        <li>Rozdiel medzi <span className="text-[var(--main-color-orange)] font-bold">verifikáciou</span> a <span className="text-[var(--main-color-orange)] font-bold">validáciou</span></li>,
        <li>Typy <span className="text-[var(--main-color-orange)] font-bold">testovania</span></li>,
        <li><span className="text-[var(--main-color-orange)] font-bold">TDD</span> a regresné testovanie</li>,
        <li>Stratégie odhaľovania <span className="text-[var(--main-color-orange)] font-bold">chýb</span></li>
    ],

    "Kapitola 10": [
        <li>Základné princípy <span className="text-[var(--main-color-orange)] font-bold">bezpečnosti systému</span></li>,
        <li>Typy <span className="text-[var(--main-color-orange)] font-bold">hrozieb</span> a útokov</li>,
        <li><span className="text-[var(--main-color-orange)] font-bold">Bezpečnostné požiadavky</span></li>,
        <li>Overovanie a návrh <span className="text-[var(--main-color-orange)] font-bold">bezpečných systémov</span></li>
    ]
};
