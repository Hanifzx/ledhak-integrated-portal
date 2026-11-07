export default function InputError({ message, className = '', ...props }) {
    return message ? (
        <p
            {...props}
            className={'text-body-sm text-status-err font-medium flex items-center gap-1.5 mt-1.5 ' + className}
        >
            <span className="material-symbols-outlined text-[16px] flex-shrink-0">error</span>
            <span>{message}</span>
        </p>
    ) : null;
}
