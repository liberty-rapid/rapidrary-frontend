import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
    initialColorMode: 'system',
    useSystemColorMode: false
};

const theme = extendTheme({
    config,
    fonts: {
        heading: `'sans-serif'`,
        body: `'sans-serif'`
    },
    components: {
        Button: {
            baseStyle: {
                WebkitTapHighlightColor: 'transparent'
            },
        },
        IconButton: {
            baseStyle: {
                WebkitTapHighlightColor: 'transparent'
            },
        },
    },
    styles: {
        global: {
            "html": {
                scrollPaddingTop: "64px"
            },
            "::-webkit-scrollbar": {
                width: '8px',
                display: 'block'
            },
            "::-webkit-scrollbar-track, ::-webkit-scrollbar-button": {
                display: 'none'
            },
            "::-webkit-scrollbar-thumb": {
                backgroundColor: 'gray'
            },
            ".content": {
                h1: {
                    marginTop: '2rem',
                    marginBottom: '1.5rem',
                    fontSize: '1.9em',
                    fontWeight: 'bold'
                },
                h2: {
                    marginTop: '1.75rem',
                    marginBottom: '1.25rem',
                    fontSize: '1.5em',
                    fontWeight: 'bold'
                },
                h3: {
                    marginTop: '1.5rem',
                    marginBottom: '1rem',
                    fontSize: '1.25em',
                    fontWeight: 'bold'
                },
                h4: {
                    marginTop: '1.25em',
                    marginBottom: '0.75em',
                    fontSize: '1.17em',
                    fontWeight: 'bold'
                },
                h5: {
                    marginTop: '1rem',
                    marginBottom: '0.5rem',
                    fontSize: '1em',
                    fontWeight: 'bold'
                },
                h6: {
                    marginTop: '0.75rem',
                    marginBottom: '0.25rem',
                    fontSize: '0.83em',
                    fontWeight: 'bold'
                },                
                p: {
                    marginTop: 0,
                    marginBottom: '1em'
                },
                ol: {
                    marginTop: 0,
                    marginBottom: '1em',
                    paddingLeft: '2.5em'
                },
                ul: {
                    marginTop: 0,
                    marginBottom: '1em',
                    paddingLeft: '2.5em'
                },
                li: {
                    marginTop: '0.5em',
                    marginBottom: '0.5em'
                },
                img: {
                    borderRadius: "8px",
                    display: "inline",
                    margin: "1em 0px 1em 0px"
                },
                code: {
                    borderRadius: "8px",
                    fontSize: "0.9375rem"
                },
                pre: {
                    maxWidth: "100%",
                    overflowX: "auto",
                    whiteSpace: "pre-wrap"
                },
                'a:hover': {
                    textDecoration: "underline"
                }
            }
        }
    }
});

export default theme;
