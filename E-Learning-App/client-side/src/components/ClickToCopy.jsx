import {ClipboardWithIcon} from "flowbite-react";
import '../styles/ProfileStyles/ProfileStyle.css';

export default function ClickToCopy({userId}) {
    return (
        <div className="grid w-full max-w-64">
            <div className="relative">
                <input
                    id="npm-install"
                    type="text"
                    className="col-span-6 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-500 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    value={`http://localhost:5173/userPage/${userId}`}
                    disabled
                    readOnly
                />
                <ClipboardWithIcon valueToCopy={`http://localhost:5173/userPage/${userId}`} />
            </div>
        </div>
    );
}
