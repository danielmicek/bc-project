import {ClipboardWithIcon} from "flowbite-react";
import '../styles/ProfileStyles/ProfileStyle.css';

export default function ClickToCopy({username}) {
    return (
        <div className="clickToCopy">
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
