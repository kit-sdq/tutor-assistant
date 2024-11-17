import { useEffect, useState } from 'react'

export function useAsyncActionTrigger(
    action: () => Promise<unknown>,
    canPerformAction: () => boolean,
    triggers: unknown[],
): [boolean, () => void] {
    const [isProcessing, setIsProcessing] = useState(false)

    function process() {
        setIsProcessing(true)
    }

    useEffect(() => {
        if (isProcessing && canPerformAction()) {
            doAction()
        }
    }, [...triggers, isProcessing])

    async function doAction() {
        await action()
        setIsProcessing(false)
    }

    return [
        isProcessing,
        process,
    ]
}
