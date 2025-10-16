import Image from "next/image"

import wordmarkLogo from "../../public/wordmark-logo.png"
import iconLogo from "../../public/icon-logo.png"

export const WordmarkLogo = (props: { height: number | undefined }) => {
    return (
        <Image
            src={wordmarkLogo}
            alt="Lepa Logo"
            height={props.height || 30}
        />
    )
}

export const IconLogo = () => {
    return (
        <Image
            src={iconLogo}
            alt="Lepa Logo"
            height={30}
        />
    )
}
