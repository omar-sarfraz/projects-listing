import { Outlet } from "react-router-dom";

export default function Layout() {
    return (
        <div className="flex justify-center">
            <div className="container-2xl mt-10 mx-auto w-3/4">
                <Outlet />
            </div>
        </div>
    );
}
