export default function ApplicationLogo(props) {
    return (
        <img
            {...props}
            src="/images/logo/logo LeDHaK UNHAS.webp"
            alt="Logo LeDHaK UNHAS"
            className={`object-contain ${props.className || 'w-16 h-16'}`}
        />
    );
}
