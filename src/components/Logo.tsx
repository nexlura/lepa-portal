import Image from "next/image"

import wordmarkLogo from "../../public/wordmark-logo.png"
import iconLogo from "../../public/icon-logo.png"

export const Logo = (props: { height?: number, icon?: boolean }) => {
    // if (props.icon) (

    //     <Image
    //         src={iconLogo}
    //         alt="Lepa Icon Logo"
    //         height={props.height || 30}
    //     />
    // )

    return (
        <Image
            src={iconLogo}
            alt="Lepa Icon Logo"
            height={props.height || 30}
        />
    )
}
