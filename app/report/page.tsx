import { Suspense } from 'react';
import type { Metadata } from 'next';
import ReportView from '@/components/ReportView';

export const metadata: Metadata = {
    title: '运势报告 | 鸣潮运势检测器',
    description: '查看你的鸣潮每日运势报告：运势分数、幸运属性、模拟七十连、趋势预测与投资策略',
};

export default function ReportPage() {
    // useSearchParams 需要在 Suspense 边界内（Next.js 静态渲染要求）
    return (
        <Suspense fallback={<div className="min-h-screen" />}>
            <ReportView />
        </Suspense>
    );
}
