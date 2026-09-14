import React, { useCallback, useState } from 'react';
import { loadState } from './storage.js';
import { normalizeData } from './data.js';
import Landing from './Landing.jsx';
import Editor from './Editor.jsx';

export default function App() {
  const [state, setState] = useState(() => loadState());

  const setCv = useCallback((updater) => {
    setState((s) => ({
      ...s,
      cv: typeof updater === 'function' ? normalizeData(updater(s.cv)) : normalizeData(updater),
    }));
  }, []);

  const setTemplateId = useCallback((id) => {
    setState((s) => ({ ...s, templateId: id }));
  }, []);

  const setView = useCallback((view) => {
    setState((s) => ({ ...s, view, seenLanding: true }));
  }, []);

  if (state.view !== 'editor') {
    return (
      <Landing
        cv={state.cv}
        templateId={state.templateId}
        onStart={(templateId) => {
          if (templateId) setTemplateId(templateId);
          setView('editor');
        }}
      />
    );
  }

  return (
    <Editor
      cv={state.cv}
      setCv={setCv}
      templateId={state.templateId}
      setTemplateId={setTemplateId}
      onHome={() => setView('landing')}
    />
  );
}
