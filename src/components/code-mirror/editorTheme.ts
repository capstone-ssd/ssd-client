import { EditorView } from '@codemirror/view';

export const markdownEditorTheme = EditorView.theme({
  '&': {
    backgroundColor: '#ffffff',
    fontSize: '16px',
    height: '100%',
  },
  '.cm-content': {
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    padding: '20px',
    lineHeight: '1.6',
  },
  '.cm-scroller': {
    overflow: 'auto',
  },
  '.cm-activeLine': {
    backgroundColor: 'var(--color-gray-50)',
  },
});
