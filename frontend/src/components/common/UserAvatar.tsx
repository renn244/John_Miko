import type { ComponentProps } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type UserAvatarProps = {
    avatarUrl?: string;
    name: string;
} & ComponentProps<typeof Avatar>;

const UserAvatar = ({ avatarUrl, name, ...avatarProps }: UserAvatarProps) => {
    return (
        <Avatar size="lg" {...avatarProps}>
            <AvatarImage src={avatarUrl} alt={name} className="object-cover" />
            <AvatarFallback>{name ? name.charAt(0) : "A"}</AvatarFallback>
        </Avatar>
    )
}

export default UserAvatar
