import {  useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Link as ChakraLink, Table, Td, Th, Thead, Tr, useColorMode, useColorModeValue } from '@chakra-ui/react';

import parse, { DOMNode, Element, domToReact } from 'html-react-parser';
import hljs from 'highlight.js/lib/core';

import { isAbsoluteUrl } from '../../utils/common-utils';
import { transformUrls } from '../../utils/dom-utils';

import HashedHeading from '../common/HashedHeading';

import '../../assets/styles/asciidoctor-common.css';
import '../../assets/styles/asciidoctor-dark.css';
import '../../assets/styles/asciidoctor-light.css';
import '../../assets/styles/viewer.css';

function getOptions(colorMode: string) {
    const options = {
        replace: (domNode: DOMNode) => {
            if (domNode instanceof Element && domNode.attribs) {
                if (domNode.name === 'a') {
                    const { id, href, target } = domNode.attribs;

                    const color = colorMode === 'light' ? '#1E90FF' : '#00BFFF';

                    if (id === 'buy-me-a-coffee')
                        return;
    
                    if (isAbsoluteUrl(href) || href.startsWith('#')) {
                        return (
                            <ChakraLink href={href} target={target} id={id} color={color}>
                                {!href.startsWith('#') && <span style={{ userSelect: 'none' }}>🔗 </span>}
                                {domToReact(domNode.children as DOMNode[], options)}
                            </ChakraLink>
                        );
                    }
    
                    return (
                        <ChakraLink as={RouterLink} to={href} id={id} color={color}>
                            {domToReact(domNode.children as DOMNode[], options)}
                        </ChakraLink>
                    );                
                } else if (/^h[1-6]$/.test(domNode.name)) {
                    const { id } = domNode.attribs;
    
                    if (!id) return;
    
                    const asValue = domNode.name as ('h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6');
    
                    return (
                        <HashedHeading as={asValue} id={id}>
                            {domToReact(domNode.children as DOMNode[], options)}
                        </HashedHeading>
                    );
                } else if (domNode.name === 'table') {
                    return (
                        <Table
                            colorScheme={colorMode === 'light' ? 'blackAlpha' : 'gray'}
                            variant="simple"
                        >
                            {domToReact(domNode.children as DOMNode[], options)}
                        </Table>
                    );
                } else if (domNode.name === 'thead') {
                    return (
                        <Thead>
                            {domToReact(domNode.children as DOMNode[], options)}
                        </Thead>
                    );
                } else if (domNode.name === 'tr') {
                    return (
                        <Tr>
                            {domToReact(domNode.children as DOMNode[], options)}
                        </Tr>
                    );
                } else if (domNode.name === 'th') {
                    return (
                        <Th>
                            {domToReact(domNode.children as DOMNode[], options)}
                        </Th>
                    );
                } else if (domNode.name === 'td') {
                    return (
                        <Td>
                            {domToReact(domNode.children as DOMNode[], options)}
                        </Td>
                    );
                }
            }
        }
    };

    return options;
}

interface ContentRendererProps {
    content: string;
    urlTransform?: (url: string, tag: string) => string;
}

export default function ContentRenderer({ content, urlTransform }: ContentRendererProps) {
    const hljsTheme = useColorModeValue('/styles/github.css', '/styles/github-dark.css');

    const { colorMode } = useColorMode();

    useEffect(() => {
        hljs.highlightAll();
    }, []);

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).renderMathInElement(document.body);
    });

    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `@import url("${hljsTheme}");`;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, [hljsTheme]);

    content = urlTransform ? transformUrls(content, urlTransform) : content;

    return (
        <div className="content">
            {parse(content, getOptions(colorMode))}
        </div>
    );
}
