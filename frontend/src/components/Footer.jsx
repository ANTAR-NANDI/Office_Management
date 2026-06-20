function Footer() {
    return (
        <footer className="bg-white border-t px-6 py-4 flex justify-between items-center">
            <p className="text-sm text-slate-500">
                © {new Date().getFullYear()} Office Management System
            </p>

            <p className="text-sm text-slate-500">
                Version 1.0.0
            </p>
        </footer>
    );
}

export default Footer;