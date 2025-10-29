import { useState, useRef } from 'react';

export default function RichTextArea({ value, onChange, rows = 3, label = "Text" }) {
  const textareaRef = useRef(null);

  const insertFormatting = (prefix, suffix = prefix) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const beforeText = value.substring(0, start);
    const afterText = value.substring(end);

    const newText = `${beforeText}${prefix}${selectedText}${suffix}${afterText}`;
    onChange(newText);

    // Set cursor position after formatting
    setTimeout(() => {
      textarea.focus();
      const cursorPos = start + prefix.length + selectedText.length;
      textarea.setSelectionRange(cursorPos, cursorPos);
    }, 0);
  };

  const insertBullet = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const beforeText = value.substring(0, start);
    const afterText = value.substring(start);

    // Check if we're at the start of a line
    const lastNewline = beforeText.lastIndexOf('\n');
    const isStartOfLine = lastNewline === beforeText.length - 1 || beforeText.length === 0;

    const bullet = isStartOfLine ? '• ' : '\n• ';
    const newText = `${beforeText}${bullet}${afterText}`;
    onChange(newText);

    setTimeout(() => {
      textarea.focus();
      const cursorPos = start + bullet.length;
      textarea.setSelectionRange(cursorPos, cursorPos);
    }, 0);
  };

  const insertNewline = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const beforeText = value.substring(0, start);
    const afterText = value.substring(start);

    const newText = `${beforeText}\n${afterText}`;
    onChange(newText);

    setTimeout(() => {
      textarea.focus();
      const cursorPos = start + 1;
      textarea.setSelectionRange(cursorPos, cursorPos);
    }, 0);
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>

      {/* Toolbar */}
      <div className="flex gap-1 mb-2 p-2 bg-gray-700/50 rounded-t border border-gray-600 border-b-0">
        <button
          type="button"
          onClick={() => insertFormatting('**')}
          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm font-bold transition-colors"
          title="Bold (surround with **text**)"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => insertFormatting('_')}
          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm italic transition-colors"
          title="Italic (surround with _text_)"
        >
          I
        </button>
        <button
          type="button"
          onClick={insertBullet}
          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
          title="Bullet point"
        >
          • List
        </button>
        <button
          type="button"
          onClick={insertNewline}
          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
          title="New line"
        >
          ↵ Line
        </button>
        <div className="flex-1" />
        <div className="text-xs text-gray-400 flex items-center">
          Use **bold** or _italic_
        </div>
      </div>

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full bg-gray-700 border border-gray-600 rounded-b px-3 py-2 text-white font-mono text-sm"
        style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
      />

      {/* Preview */}
      {value && (
        <div className="mt-2 p-3 bg-gray-800/50 rounded border border-gray-700">
          <div className="text-xs text-gray-400 mb-1">Preview:</div>
          <div
            className="text-sm text-white"
            dangerouslySetInnerHTML={{
              __html: value
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/_(.*?)_/g, '<em>$1</em>')
                .replace(/\n/g, '<br />')
            }}
          />
        </div>
      )}
    </div>
  );
}
