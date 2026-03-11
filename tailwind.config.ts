import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{ts,tsx}",
        "./components/**/*.{ts,tsx}",
        "./app/**/*.{ts,tsx}",
        "./src/**/*.{ts,tsx}",
    ],
    prefix: "",
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: { "2xl": "1400px" },
        },
        extend: {
            fontFamily: {
                heading: ["var(--font-heading)", "sans-serif"],
                body: ["var(--font-body)", "sans-serif"],
            },
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
                secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
                destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
                muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
                accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
                popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
                card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
                "rapido-blue": {
                    DEFAULT: "#1C244B",
                    50: "#E8E9EE",
                    100: "#D1D3DD",
                    200: "#A3A7BB",
                    300: "#757A99",
                    400: "#484E77",
                    500: "#1C244B",
                    600: "#191F42",
                    700: "#151A38",
                    800: "#11152E",
                    900: "#0D1024",
                },
                "rapido-green": {
                    DEFAULT: "#73C257",
                    50: "#F0F9ED",
                    100: "#E1F3DB",
                    200: "#C3E7B7",
                    300: "#A5DB93",
                    400: "#87CF6F",
                    500: "#73C257",
                    600: "#5EAE42",
                    700: "#4A8A34",
                    800: "#366627",
                    900: "#224219",
                },
                "rapido-orange": {
                    DEFAULT: "#EF7B45",
                    50: "#FDF2ED",
                    100: "#FBE5DB",
                    200: "#F7CBB7",
                    300: "#F3B193",
                    400: "#EF976F",
                    500: "#EF7B45",
                    600: "#E25E1E",
                    700: "#B34A17",
                    800: "#843711",
                    900: "#55230B",
                },
                "rapido-white": "#F8F8F8",
                "rapido-light": "#F8F8F8",
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
        },
    },
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    plugins: [require("tailwindcss-animate")],
};

export default config;
