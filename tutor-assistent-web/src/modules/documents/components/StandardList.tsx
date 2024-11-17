import { Box, Divider, IconButton, List, ListItem, Typography } from '@mui/joy'
import { Cached, Delete } from '@mui/icons-material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { isPresent } from '../../../lib/utils/utils.ts'

interface Props<T extends { id?: string }> {
    title: string
    items: T[]
    getLabel: (document: T) => string
    onReload?: (document: T) => void
    onDelete?: (document: T) => void
    canManage?: boolean
}

export function StandardList<T extends { id?: string }>(
    { title, items, getLabel, onReload, onDelete, canManage }: Props<T>,
) {

    const { t } = useTranslation()

    return (
        <>
            <Typography level='body-sm'>{title}</Typography>
            <List>
                {items.map((item, index) => (
                    <React.Fragment key={item.id}>
                        <ListItem
                            endAction={canManage && (
                                <Box display='flex'>
                                    {isPresent(onReload) && (
                                        <IconButton
                                            aria-label={t('Delete')}
                                            size='sm'
                                            color='primary'
                                            onClick={() => onReload(item)}
                                        >
                                            <Cached />
                                        </IconButton>
                                    )}
                                    {isPresent(onDelete) && (
                                        <IconButton
                                            aria-label={t('Delete')}
                                            size='sm'
                                            color='danger'
                                            onClick={() => onDelete(item)}
                                        >
                                            <Delete />
                                        </IconButton>
                                    )}
                                </Box>
                            )}
                        >
                            {getLabel(item)}
                        </ListItem>
                        {index < items.length - 1 && <Divider />}
                    </React.Fragment>
                ))}
            </List>
        </>
    )
}
