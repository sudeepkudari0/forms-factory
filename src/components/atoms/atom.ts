import { atom } from "jotai"

export const darkModeAtom = atom<boolean>(true)
export const unsavedChangesAtom = atom<boolean>(true)
export const editorRefctchAtom = atom<boolean>(false)
export const atoms = {
  darkModeAtom,
  unsavedChangesAtom,
  editorRefctchAtom,
}
