import Image from "next/image"

import wordmarkLogo from "../../public/wordmark-logo.png"
import iconLogo from "../../public/icon-logo.png"

export const IconLogo = (props: { height?: number }) => {

    return (
        <Image
            src={iconLogo}
            alt="Lepa icon logo"
            height={props.height || 30}
        />
    )
}

export const WordmarkLogo = (props: { height?: number }) => {
    return (
        <Image
            src={wordmarkLogo}
            alt="Lepa wordmark oogo"
            height={props.height || 30}
        />
    )
}
