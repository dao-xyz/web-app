import { ChildCare, RocketLaunch, Send } from "@mui/icons-material";
import { Button, Card, CardContent, CircularProgress, Container, Grid, IconButton, List, ListItem, Paper, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useConnection } from "@solana/wallet-adapter-react";
import { Keypair, PublicKey } from "@solana/web3.js";
import { ChannelAccount, ChannelType, getChannel, getChannelsWithParent } from '@dao-xyz/sdk-social';
import React, { FC, useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { AccountInfoDeserialized } from "@dao-xyz/sdk-common";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { getChannelRoute } from "../../routes/routes";
import TreeView from '@mui/lab/TreeView';
import TreeItem, { TreeItemProps, treeItemClasses } from '@mui/lab/TreeItem';
import Label from '@mui/icons-material/Label';
import { SvgIconProps } from '@mui/material/SvgIcon';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ForumIcon from '@mui/icons-material/Forum';
import ChatIcon from '@mui/icons-material/Chat';
import { styled } from '@mui/material/styles';
import { useChannels } from "../../contexts/ChannelsContext";
import { CHANNEL_TREE_ROOT } from "../../services/channelUtils";

declare module 'react' {
    interface CSSProperties {
        '--tree-view-color'?: string;
        '--tree-view-bg-color'?: string;
    }
}

type StyledTreeItemProps = TreeItemProps & {
    bgColor?: string;
    color?: string;
    labelIcon: React.ElementType<SvgIconProps>;
    labelInfo?: string;
    labelText: string;
}

const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
    color: theme.palette.text.secondary,
    [`& .${treeItemClasses.content}`]: {
        color: theme.palette.text.secondary,
        borderTopRightRadius: theme.spacing(2),
        borderBottomRightRadius: theme.spacing(2),
        paddingRight: theme.spacing(1),
        fontWeight: theme.typography.fontWeightMedium,
        '&.Mui-expanded': {
            fontWeight: theme.typography.fontWeightRegular,
        },
        '&:hover': {
            backgroundColor: theme.palette.action.hover,
        },
        '&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused': {
            backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.selected})`,
            color: 'var(--tree-view-color)',
        },
        [`& .${treeItemClasses.label}`]: {
            fontWeight: 'inherit',
            color: 'inherit',
        },
    },
    [`& .${treeItemClasses.group}`]: {
        marginLeft: 0,
        [`& .${treeItemClasses.content}`]: {
            paddingLeft: theme.spacing(2),
        },
    },
}));

function StyledTreeItem(props: StyledTreeItemProps) {
    const {
        bgColor,
        color,
        labelIcon: LabelIcon,
        labelInfo,
        labelText,
        ...other
    } = props;

    return (
        <StyledTreeItemRoot
            label={
                <Box sx={{ display: 'flex', alignItems: 'center', p: 0.5, pr: 0 }}>
                    <Box component={LabelIcon} color="inherit" sx={{ mr: 1 }} />
                    <Typography variant="body2" sx={{ fontWeight: 'inherit', flexGrow: 1 }}>
                        {labelText}
                    </Typography>
                    <Typography variant="caption" color="inherit">
                        {labelInfo}
                    </Typography>
                </Box>
            }
            style={{
                '--tree-view-color': color,
                '--tree-view-bg-color': bgColor,
            }}
            {...other}
        />
    );
}


interface ChannelTreeItem {
    id: string,
    label: string,
    type: ChannelType
}
type ChannelTree = { [key: string]: ChannelTreeItem[] };

const channelsToTree = (channels: AccountInfoDeserialized<ChannelAccount>[]) => channels.map(channel => { return { id: channel.pubkey.toString(), label: channel.data.name, type: channel.data.channelType } })
export const ChannelTree: FC = () => {
    const { connection } = useConnection();
    const [notFound, setNotFound] = useState(false);
    const [tree, setTree] = useState<ChannelTree>({});
    const navigate = useNavigate();
    const { loading, select, selection } = useChannels();
    const [expanded, setExpanded] = React.useState<string[]>([]);
    const [selected, setSelected] = React.useState<string[]>([]);


    useEffect(() => {

        // Also load the root
        /* let root = selection.selectionPath[selectionTree.length - 1];
        if (root) {
            let newTree = {}
            selectionTree.forEach((selection) => {
                newTree[selection.pubkey.toString()] = []
            });
            getChannelsWithParent(root.pubkey, connection).then((channels) => {
                newTree[root.pubkey.toString()] = channelsToTree(channels);
                setTree(newTree);
            })

            console.log('NEW TREE', selectionTree, newTree)
            // Expand selection tree
            setDefaultExpanded(selectionTree.map(el => el.pubkey.toString()))
        } */
        let newTree: ChannelTree = tree;
        for (const property in selection.selectionTree) {
            let value = selection.selectionTree[property];
            newTree[property] = value.map(v => {
                return {
                    id: v.pubkey.toString(),
                    label: v.data.name,
                    type: v.data.channelType
                } as ChannelTreeItem
            });
        }
        // Also add root if just root

        setExpanded(selection.selectionPath.map(el => el.pubkey.toString()))

        setTree(newTree);
    }, [JSON.stringify(selection.selectionPath?.map(p => p.toString()))]);

    const renderTree = (children: ChannelTreeItem[] | undefined) => {
        if (!children) {
            return <Typography color="text.secondary" key="empty">No channels found</Typography>
        }
        return children.map(child => {
            const childrenNodes =
                tree[child.id] && tree[child.id].length > 0
                    ? renderTree(tree[child.id])
                    : child.type == ChannelType.Collection ? <div key={child.id} /> : undefined;
            let icon = undefined;
            switch (child.type) {
                case ChannelType.Collection:
                    icon = Label
                    break;

                case ChannelType.Chat:
                    icon = ChatIcon
                    break;

                case ChannelType.Forum:
                    icon = ForumIcon
                    break;

                default:
                    break;
            }
            return (
                <StyledTreeItem key={child.id} nodeId={child.id} labelText={child.label} labelIcon={icon}>
                    {childrenNodes}
                </StyledTreeItem>
            );

        });
    };

    const handleChange = (_event: any, nodeIds: string[]): any => {
        nodeIds.forEach((nodeId) => {
            let toExpand = new PublicKey(nodeId);
            console.log('expand', tree[nodeId]);
            getChannelsWithParent(toExpand, connection).then((channels) => {
                const newTree = {
                    ...tree,
                    [nodeId]: channelsToTree(channels)
                };
                console.log('new tree expansion', channels, newTree)
                setTree(newTree);
            });
        })
        setExpanded(nodeIds);

    };
    const handleSelect = (_event: any, nodeIds: string[]): any => {
        setSelected(nodeIds);
        if (nodeIds.length == 1) {
            navigate(getChannelRoute(new PublicKey(nodeIds[0])), { replace: true });

        }
    }

    return <TreeView
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        defaultEndIcon={<div style={{ width: 24 }} />}
        sx={{ height: 264, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
        onNodeToggle={handleChange}
        onNodeSelect={handleSelect}
        multiSelect
        expanded={expanded}
        selected={selected}
    >
        {renderTree(tree[selection.selectionPath[selection.selectionPath.length - 1].pubkey.toString()])}
    </TreeView>
}