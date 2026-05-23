import { memo } from 'react';
import CodeMirror, { keymap, Prec, EditorView } from '@uiw/react-codemirror';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { markdownEditorTheme } from './editorTheme';
import { cn } from '../../utils/cn';
import { insertNewlineAndIndent } from '@codemirror/commands';

interface MarkdownEditorProps {
  text: string;
  onChange: (text: string) => void;
  className?: string;
}

const doubleEnterKeymap = keymap.of([
  {
    key: 'Enter',
    run: (view) => {
      insertNewlineAndIndent(view);
      view.dispatch(view.state.replaceSelection('\n'));
      return true;
    },
  },
]);

const extensions = [
  markdown({ base: markdownLanguage, codeLanguages: languages }),
  markdownEditorTheme,
  Prec.highest(doubleEnterKeymap),
  EditorView.lineWrapping,
];

const basicSetup = {
  lineNumbers: false,
  foldGutter: false,
  dropCursor: true,
  allowMultipleSelections: false,
  indentOnInput: true,
};

export default memo(function MarkdownEditor({ text, onChange, className }: MarkdownEditorProps) {
  return (
    <div className={cn('h-full min-w-0 flex-1', className)}>
      <CodeMirror
        value={text}
        height="100%"
        width="100%"
        style={{ height: '100%' }}
        onChange={onChange}
        extensions={extensions}
        basicSetup={basicSetup}
      />
    </div>
  );
});
