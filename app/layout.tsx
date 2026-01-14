import type { Metadata } from 'next';
import { Inter, Rajdhani } from 'next/font/google';
import './globals.css';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
});

const rajdhani = Rajdhani({
    weight: ['400', '500', '600', '700'],
    subsets: ['latin'],
    variable: '--font-rajdhani',
});

export const metadata: Metadata = {
    title: '鸣潮运势检测器 | Wuthering Waves Fortune Detector',
    description: '检测你在《鸣潮》中今日的抽卡运势，获取幸运属性和模拟三十连结果',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="zh-CN" className={`${inter.variable} ${rajdhani.variable}`}>
            <body className={`${inter.className} min-h-screen`}>
                {/* 纹理覆盖层 */}
                <div className="fixed inset-0 texture-overlay z-0" />
                {children}
            </body>
        </html>
    );
}
