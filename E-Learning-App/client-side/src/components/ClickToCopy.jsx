import {ClipboardWithIcon} from "flowbite-react";
import '../styles/ProfileStyles/ProfileStyle.css';

export default function ClickToCopy({userId}) {
    return (
        <div className="clickToCopy">
            <input
                type="text"
                className="xx"
                value={`http://localhost:5173/userPage/${userId}`}
                disabled
                readOnly
            />
            <ClipboardWithIcon valueToCopy={`http://localhost:5173/userPage/` + "?" + new URLSearchParams({userId}).toString()} />
        </div>

    );
}
