import {ListboxItem} from "@heroui/react";
import Avatar from "@mui/material/Avatar";

export default function Friend({name, avatar, email}) {
    return (
        <ListboxItem textValue={name}>
            <div className="flex gap-2 items-center">
                <Avatar alt={name} className="shrink-0" size="sm" src={avatar} />
                <div className="flex flex-col">
                    <span className="text-small">{name}</span>
                    <span className="text-tiny text-default-400">{email}</span>
                </div>
            </div>
        </ListboxItem>
    )
}