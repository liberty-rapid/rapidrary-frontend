import { Outlet, useMatches, useParams } from "react-router-dom";
import { Box, useColorModeValue } from "@chakra-ui/react";

import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/util/ScrollToTop";

function App() {
    const params = useParams();
    const matches = useMatches();

    const bgColor = useColorModeValue("#fafafa", "gray.900");

    const isViewerLoaded = params.bookId && matches.some(m => m.params.bookId && m.data);

    return (
        <>
            <ScrollToTop />
            <Box bgColor={bgColor}>
                { !isViewerLoaded && <Header /> }
                <Box bgColor={bgColor} minH="calc(100vh - 64px)">
                    <Outlet />
                </Box>
                { !isViewerLoaded && <Footer /> }
            </Box>
        </>
    );
}

export default App;
