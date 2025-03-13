import 'bootstrap/dist/css/bootstrap.min.css';

export default function Sidebar() {
    return (
        <div className="d-flex flex-column bg-dark vh-100 p-4 shadow">
            <h2 className="fs-4 fw-bold mb-4 text-white">Nectar</h2>
            <ul className="nav flex-column gap-2">
                <li className="nav-item">
                    <a href="#" className="nav-link d-flex align-items-center text-light p-3 rounded sidebar-item">
                        🏠 Dashboard
                    </a>
                </li>
                <li className="nav-item">
                    <a href="#" className="nav-link d-flex align-items-center text-light p-3 rounded sidebar-item">
                        🔒 Logout
                    </a>
                </li>
            </ul>
            <style jsx>{`
                .sidebar-item {
                    transition: background-color 0.3s ease, transform 0.2s ease;
                }
                .sidebar-item:hover {
                    background-color: #007bff;
                    color: #ffffff;
                    transform: translateX(5px);
                }
            `}</style>
        </div>
    );
}
