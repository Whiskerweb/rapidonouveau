import { MarketingLayout } from '@/components/layout/marketing-layout';

export default function LegalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <MarketingLayout>
            <div className="pt-32 pb-40 bg-white">
                <div className="container px-4">
                    <div className="max-w-4xl mx-auto prose prose-zinc prose-xl 
                        prose-headings:font-heading prose-headings:font-black prose-headings:text-secondary 
                        prose-p:text-secondary/60 prose-p:font-bold prose-p:leading-relaxed
                        prose-strong:text-secondary prose-strong:font-black
                    ">
                        {children}
                    </div>
                </div>
            </div>
        </MarketingLayout>
    );
}
