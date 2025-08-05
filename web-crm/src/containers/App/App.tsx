import { FC } from "react";
import styles from "./App.module.scss";
import useAppRoutes from "src/routes/useAppRoutes";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useAppSelector } from "src/hooks/redux.hook";
import Navbar from "src/components/Navbar";


const App: FC<any> = () => {
    const authSelector = useAppSelector((s) => s.authReducer);

    // @ts-ignore
    const routes = useAppRoutes();

    return (
        <>
            <BrowserRouter>
                {authSelector.access_token && <Navbar />}
                {routes}
                <ToastContainer
                    position="bottom-right"
                    autoClose={2000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
            </BrowserRouter>
        </>
    );
};

export default App;
