export default function InputLabel({
    value,
    className = '',
    children,
    ...props
}) {
    return (
        <label
            {...props}
            className={
                `block text-body-sm font-semibold text-ink ` +
                className
            }
        >
            {value ? value : children}
        </label>
    );
}
