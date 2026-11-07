export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded border-border-base text-primary shadow-sm focus:ring-primary focus:ring-offset-0 transition-colors cursor-pointer ' +
                className
            }
        />
    );
}
