import React, { Dispatch, FormEvent, ReactNode, SetStateAction } from 'react'

export interface ChildrenProps {
  children?: ReactNode;
}

export type HTMLFormEvent = FormEvent<HTMLFormElement>;
export type DivMouseEvent = React.MouseEvent<HTMLDivElement>
export type StateCalculator<T> = (prev: T) => T
export type StateChanger<T> = (changer: StateCalculator<T>) => void
export type StateSetter<T> = React.Dispatch<React.SetStateAction<T>>
export type State<S> = [S | undefined, Dispatch<SetStateAction<S | undefined>>]
