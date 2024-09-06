import { Outlet } from "react-router-dom";
import { Suspense } from "react";

import Navbar from "../components/Navbar";

export default function Layout() {
    return (
        <>
            <Navbar />
            <div className="flex justify-center">
                <div className="container-2xl mt-10 mx-auto w-3/4">
                    <Suspense fallback={<div>Loading...</div>}>
                        <Outlet />
                    </Suspense>
                </div>
            </div>
        </>
    );
}
