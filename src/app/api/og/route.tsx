import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        // Dynamic title and description from query params
        const hasTitle = searchParams.has('title');
        const title = hasTitle
            ? searchParams.get('title')?.slice(0, 100)
            : "Rapido'Devis : L'IA au service de votre chiffrage";

        return new ImageResponse(
            (
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#1C244B', // secondary / rapido-blue
                        backgroundImage: 'radial-gradient(circle at 25% 25%, #2a3563 0%, transparent 50%), radial-gradient(circle at 75% 75%, #00C853 0%, transparent 50%)',
                        padding: '80px',
                    }}
                >
                    {/* Logo container */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '40px',
                        }}
                    >
                        <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="100" height="100" rx="20" fill="#00C853" />
                            <path d="M30 50L45 65L70 35" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div
                            style={{
                                marginLeft: '20px',
                                fontSize: 48,
                                fontFamily: 'League Spartan',
                                fontWeight: 900,
                                color: 'white',
                            }}
                        >
                            Rapido'Devis
                        </div>
                    </div>

                    <div
                        style={{
                            fontSize: 64,
                            fontFamily: 'League Spartan',
                            fontWeight: 900,
                            color: 'white',
                            textAlign: 'center',
                            lineHeight: 1.2,
                            marginBottom: '20px',
                            maxWidth: '900px',
                        }}
                    >
                        {title}
                    </div>

                    <div
                        style={{
                            fontSize: 32,
                            display: 'flex',
                            alignItems: 'center',
                            color: '#00C853',
                            fontWeight: 'bold',
                        }}
                    >
                        Estimation travaux en moins de 48h
                    </div>

                    <div
                        style={{
                            position: 'absolute',
                            bottom: '40px',
                            right: '40px',
                            fontSize: 24,
                            color: 'rgba(255,255,255,0.4)',
                        }}
                    >
                        rapido-devis.fr
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
            }
        );
    } catch (e: any) {
        console.log(`${e.message}`);
        return new Response(`Failed to generate the image`, {
            status: 500,
        });
    }
}
