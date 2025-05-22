import React from 'react';

const LinuxShell = ({ shellOutput }) => {
  return (
    <div className="shell">
      <div className="shell-header">
        <span className="shell-title">Linux Shell</span>
      </div>
      <div className="shell-body">
        <pre className="shell-output" style={{ color: 'white' }}>{shellOutput}</pre>
      </div>
    </div>
  );
};

export default LinuxShell;
