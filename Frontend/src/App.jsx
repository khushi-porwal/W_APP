import { Toaster } from "react-hot-toast";

import AppRoutes from "./routes/AppRoutes";
import AdminRoutes from "./routes/AdminRoutes"
function App() {
    return (
        <>
            <AppRoutes />
            <AdminRoutes/>


            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3000,
                }}
            />
        </>
    );
}

export default App;