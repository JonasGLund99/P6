import { ButtonStyle, IButtonProps } from "./IButtonProps";

interface ButtonTypeStyles {
    [ButtonStyle.Default]: string;
    [ButtonStyle.None]: string;
    [ButtonStyle.Warning]: string;
    [ButtonStyle.Standard]: string;
    [ButtonStyle.Modal]: string;

}

const buttonTypeStyles: ButtonTypeStyles = {
    [ButtonStyle.Default]: "THERE IS AN ERROR",
    [ButtonStyle.None]: '',
    [ButtonStyle.Standard]: 'text-white bg-gray-800 hover:bg-gray-700 font-medium rounded-lg text-sm',
    [ButtonStyle.Modal]: 'text-github-textWhiteBg bg-github-buttonNavBg border border-github-borderWhiteBg hover:bg-github-highlightedBtnNavBg focus:ring-4 focus:outline-none focus:ring-github-borderWhiteBg font-medium rounded-lg text-xs px-3 py-1.5 me-2 text-center inline-flex items-center',
    [ButtonStyle.Warning]: 'text-white bg-yellow-800 hover:bg-yellow-900 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-xs px-3 py-1.5 me-2 text-center inline-flex items-center dark:bg-yellow-300 dark:text-gray-800',
}

function Button({ onClick, type, style, buttonStyle: ButtonType, children }: IButtonProps) {
    return (
        <button onClick={onClick} className={`${style?.style + " " + buttonTypeStyles[ButtonType]}`} type={type}>
            {children}
        </button>
    );
}


export default Button;