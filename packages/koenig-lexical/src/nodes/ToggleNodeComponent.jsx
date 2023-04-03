import CardContext from '../context/CardContext';
import React, {useEffect, useRef, useState} from 'react';
import {$getNodeByKey} from 'lexical';
import {ActionToolbar} from '../components/ui/ActionToolbar';
import {ToggleCard} from '../components/ui/cards/ToggleCard';
import {ToolbarMenu, ToolbarMenuItem, ToolbarMenuSeparator} from '../components/ui/ToolbarMenu';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';

export function ToggleNodeComponent({nodeKey, content, header}) {
    const [editor] = useLexicalComposerContext();
    const cardContext = React.useContext(CardContext);
    const {isEditing, isSelected, setEditing} = cardContext;

    const [isContentVisible, setContentVisible] = useState(false);
    const [isContentFocused, setFocusOnContent] = useState(false);
    const [isHeaderFocused, setFocusOnHeader] = useState(true);

    const toggleRef = useRef(null);

    useEffect(() => {
        if (toggleRef && toggleRef.current) {
            toggleRef.current.click();
        }
    }, []);

    const toggleContent = () => {
        setContentVisible(!isContentVisible);
    };

    const focusOnContent = (e) => {
        if (e.key === 'Enter') {
            setFocusOnHeader(false);
            setFocusOnContent(true);

            if (!isContentVisible && toggleRef && toggleRef.current) {
                toggleRef.current.click();
            }
        }
    };

    const focusOnHeader = (e) => {
        setFocusOnContent(false);
        setFocusOnHeader(true);
    };

    const setHeader = (newHeader) => {
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            node.setHeader(newHeader);
        });
    };

    const setContent = (newContent) => {
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            node.setContent(newContent);
        });
    };

    const handleToolbarEdit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setEditing(true);
    };

    return (
        <>
            <ToggleCard
                content={content}
                contentPlaceholder={'Collapsible content'}
                focusOnContent={focusOnContent}
                focusOnHeader={focusOnHeader}
                header={header}
                headerPlaceholder={'Toggle header'}
                isContentFocused={isContentFocused}
                isContentVisible={isContentVisible}
                isEditing={isEditing}
                isHeaderFocused={isHeaderFocused}
                setContent={setContent}
                setHeader={setHeader}
                toggleContent={toggleContent}
                toggleRef={toggleRef}
            />

            <ActionToolbar
                data-kg-card-toolbar="toggle"
                isVisible={isSelected && !isEditing}
            >
                <ToolbarMenu>
                    <ToolbarMenuItem icon="edit" isActive={false} label="Edit" onClick={handleToolbarEdit} />
                    <ToolbarMenuSeparator />
                    <ToolbarMenuItem icon="snippet" isActive={false} label="Snippet" />
                </ToolbarMenu>
            </ActionToolbar>
        </>
    );
}