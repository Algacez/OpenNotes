import React, { useEffect } from 'react';

export default function Twikoo() {
    useEffect(() => {
        // 通过 CDN 引入 twikoo js 文件
        const cdnScript = document.createElement('script');

        cdnScript.src = '/js/twikoo.min.js';
        cdnScript.async = true;

        const loadSecondScript = () => {
            // 执行 twikoo.init() 函数
            const initScript = document.createElement('script');
            initScript.innerHTML = `
            twikoo.init({
              envId: "https://twikoo.282994.xyz/",
              el: '#twikoo-comment'
            });
          `;
            initScript.id = 'twikoo-init-17YVHb2v81UmUvxIG4sZ3'; // 添加唯一的 ID
            document.body.appendChild(initScript);
        };

        // 在 twikoo js 文件加载完成后，再加载执行 twikoo.init() 函数的 js 文件
        cdnScript.addEventListener('load', loadSecondScript);
        document.body.appendChild(cdnScript);

        return () => {
            if (loadSecondScript) {
                cdnScript.removeEventListener('load', loadSecondScript);
            }
            if (cdnScript) {
                document.body.removeChild(cdnScript);
            }
            const secondScript = document.querySelector('#twikoo-init-id');
            if (secondScript) {
                document.body.removeChild(secondScript);
            }
        };
    }, []);

    return <div id="twikoo-comment"></div>;
}