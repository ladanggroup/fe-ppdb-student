import React from "react";

const LoadingOverlay = ({ isLoading }) => {
    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[1000]">
            <div className="loader"></div>
            <style jsx="true">{`
                .loader {
                    width: 50px;
                    aspect-ratio: 1;
                    border-radius: 50%;
                    border: 8px solid transparent;
                    border-right-color: #ffa50097;
                    position: relative;
                    animation: l24 1s infinite linear;
                }
                .loader:before,
                .loader:after {
                    content: '';
                    position: absolute;
                    inset: -8px;
                    border-radius: 50%;
                    border: inherit;
                    animation: inherit;
                    animation-duration: 2s;
                }
                .loader:after {
                    animation-duration: 4s;
                }
                @keyframes l24 {
                    100% {
                        transform: rotate(360deg);
                    }
                }
            `}</style>
        </div>
    );
}

export default LoadingOverlay;