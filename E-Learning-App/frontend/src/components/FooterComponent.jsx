import {createTheme, Footer, FooterBrand, FooterCopyright, FooterDivider, FooterLinkGroup} from "flowbite-react";


const customTheme = createTheme({
    "root": {
        "base": "w-full rounded-none md:flex md:items-center md:justify-between",
        "container": "w-full p-6",
        "bgDark": "bg-[#1f1f1f]"
    },
    "groupLink": {
        "base": "flex flex-wrap text-sm text-gray-500 dark:text-white",
        "link": {
            "base": "me-4 last:mr-0 md:mr-6",
            "href": "hover:underline"
        },
        "col": "flex-col space-y-4"
    },
    "icon": {
        "base": "text-gray-500 dark:hover:text-white",
        "size": "h-5 w-5"
    },
    "title": {
        "base": "mb-6 text-sm font-semibold uppercase text-gray-100 dark:text-white"
    },
    "divider": {
        "base": "my-6 w-full border-gray-200 sm:mx-auto lg:my-8 dark:border-gray-700"
    },
    "copyright": {
        "base": "text-sm text-gray-500 sm:text-center dark:text-gray-100",
        "href": "ml-1 hover:underline",
        "span": "ml-1"
    },
    "brand": {
        "base": "mb-4 flex items-center sm:mb-0",
        "img": "mr-3 h-8",
        "span": "self-center whitespace-nowrap text-2xl font-semibold text-white"
    }
})
export function FooterComponent() {
    return (
        <div id = "FOOTER" className= "w-full z-[10]">
            <Footer theme = {customTheme} container bgDark>
                <div className="w-full text-center">
                    <div className="w-full flex flex-col items-center justify-center sm:flex-row sm:items-center sm:justify-between">
                        <FooterBrand
                            href="/"
                            src="/eleonore-logo.png"
                            alt="eleonore Logo"
                            name="eleonore"
                            theme={{
                                base: "mb-4 flex items-center sm:mb-0",
                                img: "mr-3 h-8",
                                span: "self-center whitespace-nowrap text-2xl font-semibold text-gray-500"
                            }}
                        />
                        <FooterLinkGroup>
                            <p>“Any fool can know. The point is to understand.” — Albert Einstein</p>
                        </FooterLinkGroup>
                    </div>
                    <FooterDivider />
                    <FooterCopyright href="#" by="eleonore™" year={2026} />
                </div>
            </Footer>

        </div>
    );
}
