const DRAFT_KEY = "emailmd:draft";

export function saveDraft(markdown: string): boolean {
  try {
    localStorage.setItem(DRAFT_KEY, markdown);
    return true;
  } catch {
    return false;
  }
}

export function loadDraft(): string | null {
  try {
    return localStorage.getItem(DRAFT_KEY);
  } catch {
    return null;
  }
}

export function clearDraft(): void {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    // ignore
  }
}
