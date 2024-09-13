import React from 'react';

function LoaderOverlay({ text = "" }) {
    return (
        <div className="loader-container" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(255, 255, 255, 0.8)',
            zIndex: 999,
            flexDirection: "column"
        }}>
            <div className="lds-facebook" style={{ opacity: 0.6, mixBlendMode: 'luminosity', }}><div></div><div></div><div></div></div>
            <div style={{ color: "red", zIndex: 1000, mixBlendMode: 'luminosity', fontSize: 16 }}>{text}</div>

        </div>
    );
}

export default LoaderOverlay;