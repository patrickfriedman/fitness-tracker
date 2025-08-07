import * as React from "react"
import { type ToastProps } from "@/components/ui/toast"
import { ToastAction } from "@/components/ui/toast"
import { toast as showToast } from "@/components/ui/use-toast"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToastsMap = Map<
  ToastProps["id"],
  {
    toast: ToastProps
    timeout: ReturnType<typeof setTimeout> | null
  }
>

type Action =
  | {
      type: "ADD_TOAST"
      toast: ToastProps
    }
  | {
      type: "UPDATE_TOAST"
      toast: ToastProps
    }
  | {
      type: "DISMISS_TOAST"
      toastId?: ToastProps["id"]
    }
  | {
      type: "REMOVE_TOAST"
      toastId?: ToastProps["id"]
    }

interface State {
  toasts: ToastProps[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

let dispatch: React.Dispatch<Action> // Declare dispatch here

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      // ! Side effects ! - This means all toasts will be dismissed/removed
      // only when the reducer is called.
      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id!)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      }
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

function updateState(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => listener(memoryState))
}

dispatch = updateState; // Assign updateState to dispatch

type Toast = Pick<ToastProps, "id" | "title" | "description" | "variant">

export function useToast() {
  const toast = React.useCallback(
    ({
      title,
      description,
      action,
      ...props
    }: Parameters<typeof showToast>[0]) => {
      return showToast({
        title,
        description,
        action: action ? <ToastAction {...action} /> : undefined,
        ...props,
      })
    },
    []
  )

  return { toast }
}

export { reducer as toastReducer }
