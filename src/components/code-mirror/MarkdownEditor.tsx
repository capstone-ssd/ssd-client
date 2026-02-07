import CodeMirror, { keymap, Prec } from '@uiw/react-codemirror';
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

export default function MarkdownEditor({ text, onChange, className }: MarkdownEditorProps) {
  return (
    <div className={cn(className, 'flex-1')}>
      <CodeMirror
        value={text}
        height="100%"
        width="100%"
        onChange={(value) => onChange(value)}
        extensions={[
          markdown({
            base: markdownLanguage,
            codeLanguages: languages,
          }),
          markdownEditorTheme,
          Prec.highest(doubleEnterKeymap),
        ]}
        basicSetup={{
          lineNumbers: false,
          foldGutter: false,
          dropCursor: true,
          allowMultipleSelections: false,
          indentOnInput: true,
        }}
      />
    </div>
  );
}
