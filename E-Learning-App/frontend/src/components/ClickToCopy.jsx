import {ClipboardWithIcon} from "flowbite-react";

export default function ClickToCopy({username}) {
    return (
        <div className="block fit-content">
            <input
                type="text"
                className="xx"
                value={`http://localhost:5173/userPage/${username}`}
                disabled
                readOnly
            />
            <ClipboardWithIcon valueToCopy={`http://localhost:5173/userPage/` + "?" + new URLSearchParams({username}).toString()} />
        </div>

    );
}
