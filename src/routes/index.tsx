import { createBrowserRouter } from "react-router-dom";

import { viewerLoader } from "../loader/viewerLoader";
import { purchaseLoader } from "../loader/purchaseLoader";

import App from "../App";
import Home from "../pages/Home";
import MyBooks from "../pages/MyBooks";
import Html from "../pages/Html";
import Viewer from "../pages/Viewer";
import Purchase from "../pages/Purchase";
import PaymentSuccess from "../pages/PaymentSuccess";
import PaymentFail from "../pages/PaymentFail";
import NotFound from "../pages/NotFound";
import Forbidden from "../pages/Forbidden";
import ErrorBoundary from "../pages/ErrorBoundary";
import AccountInfo from "../pages/AccountInfo";
import AccountPayments from "../pages/AccountPayments";
import OAuth from "../pages/OAuth";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/oauth",
                element: <OAuth />
            },
            {
                path: "/information",
                element: <Html url="/information.html" />,
            },
            {
                path: "/terms-of-use",
                element: <Html url="/terms_of_use.html" />,
            },
            {
                path: "/privacy-policy",
                element: <Html url="/privacy_policy.html" />,
            },
            {
                path: "/my/books",
                element: <MyBooks />,
            },            
            {
                path: "/my/account",
                element: <AccountInfo />
            },
            {
                path: "/my/payments",
                element: <AccountPayments />
            },
            {
                path: "/purchase",
                element: <Purchase />,
                errorElement: <ErrorBoundary />,
                loader: purchaseLoader
            },
            {
                path: "/payment-success",
                element: <PaymentSuccess />
            },
            {
                path: "/payment-fail",
                element: <PaymentFail />
            }, 
            {
                path: "/:bookId/*",
                element: <Viewer />,
                errorElement: <ErrorBoundary />,
                loader: viewerLoader
            },
            {
                path: "/not-found",
                element: <NotFound />
            },
            {
                path: "/forbidden",
                element: <Forbidden />,
            },
            {
                path: "*",
                element: <NotFound />,
            }
        ],
    },
]);

export default router;
