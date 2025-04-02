// MyFallback.jsx
import React from 'react';

function MyFallback({ error }) {
  return (
    <div role="alert" style={{ padding: '1rem', background: '#fdd', color: '#900' }}>
      <h1>Something went wrong.</h1>
      <pre>{error && error.toString()}</pre>
    </div>
  );
}

export default MyFallback;
