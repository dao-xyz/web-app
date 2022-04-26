import { useTheme } from '@mui/styles';
import React, { FC, useCallback, useContext, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus as dark, solarizedlight as light } from 'react-syntax-highlighter/dist/esm/styles/prism'


export const MarkdownContent: FC<{ content: string }> = ({ content }) => {
    const theme = useTheme();
    return <ReactMarkdown components={{
        img({ ...props }) {
            return (<img  {...props} width={'100%'} />)
        },
        code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '')
            return !inline && match ? (
                <SyntaxHighlighter
                    children={String(children).replace(/\n$/, '')}
                    style={theme["palette"].mode == 'light' ? light : dark}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                />
            ) : (
                <code className={className} {...props}>
                    {children}
                </code>
            )
        }

    }}
    >{content}</ReactMarkdown>
}
