import { isRouteErrorResponse, useRouteError } from "react-router-dom";

import NotFound from "./NotFound";
import Forbidden from "./Forbidden";

export default function ErrorBoundary() {
    const error = useRouteError() as Error;

    if (isRouteErrorResponse(error)) {
        if (error.status === 404) {
            return <NotFound />;
        }
        if (error.status === 403) {
            return <Forbidden />;
        }        
    }

    return <>{error.message}</>;
}
