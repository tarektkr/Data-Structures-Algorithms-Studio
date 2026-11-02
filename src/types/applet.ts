export interface PersonItem {
  id: string;
  height: number; // The key (0 to 999)
  color: string;  // Hex color e.g. "#64B5F6"
}

export type OperationMode = 'idle' | 'new' | 'fill' | 'ins' | 'find' | 'del';

export interface AppletState {
  totalCells: number;
  items: (PersonItem | null)[];
  nPersons: number;
  note: string;
  curIn: number;
  oldCurIn: number;
  lastDeletion: number;
  dupsOK: boolean;
  isOKChangeDups: boolean;
  currentOp: OperationMode;
  codePart: number; // 1: search, 2: shift
  findKey: number;
  delKey: number;
  wasJustFound: boolean;
  nDeleted: number;
  isRunning: boolean;
  speedMs: number;
  stepByStep: boolean;
}

export interface CSharpSourceFile {
  name: string;
  filename: string;
  language: string;
  descriptionAr: string;
  descriptionEn: string;
  content: string;
}
