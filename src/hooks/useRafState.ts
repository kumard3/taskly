/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useRef,
  useState,
} from "react"

import { type EffectCallback, useEffect } from "react"

const useEffectOnce = (effect: EffectCallback) => {
  useEffect(effect, [])
}

const useUnmount = (fn: () => any): void => {
  const fnRef = useRef(fn)

  // update the ref each render so if it change the newest callback will be invoked
  fnRef.current = fn

  useEffectOnce(() => () => fnRef.current())
}

const useRafState = <S>(
  initialState: S | (() => S),
): [S, Dispatch<SetStateAction<S>>] => {
  const frame = useRef(0)
  const [state, setState] = useState(initialState)

  const setRafState = useCallback((value: S | ((prevState: S) => S)) => {
    cancelAnimationFrame(frame.current)

    frame.current = requestAnimationFrame(() => {
      setState(value)
    })
  }, [])

  useUnmount(() => {
    cancelAnimationFrame(frame.current)
  })

  return [state, setRafState]
}

export default useRafState
