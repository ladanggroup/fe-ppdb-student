export default function ErrorLabel({ message }) {
    return (
        <>
            <p className="text-sm text-red-500 dark:text-red-400 mt-1 text-left">{message}</p>
        </>
    );
}
