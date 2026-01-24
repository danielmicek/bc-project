import {ClipboardWithIconText} from "flowbite-react";

export default function ClickToCopy({username}) {
    return (
        <div className="grid w-full max-w-120">
            <div className="relative">
                <input
                    id="npm-install"
                    type="text"
                    className="col-span-6 block w-full rounded-2xl border border-gray-300 bg-gray-50 px-2.5 py-4 text-sm text-gray-500 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    className="col-span-6 block w-full rounded-2xl border border-gray-300 bg-gray-50 px-2.5 py-4 text-sm text-gray-500 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    value={"http://localhost:5173/userPage/" + "?" + new URLSearchParams({username}).toString()}
                    disabled
                    readOnly
                />
                <ClipboardWithIconText valueToCopy={`http://localhost:5173/userPage/` + "?" + new URLSearchParams({username}).toString()} />
            </div>
        </div>
    );
}