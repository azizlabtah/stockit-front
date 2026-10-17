import { Lato, Open_Sans, Montserrat, Outfit, Inter } from 'next/font/google'

export const lato = Lato({
    subsets: ['latin'],
    weight: ["100", "300", "400", "700", "900"],
    style: ['normal', 'italic'],
    variable: '--font-lato',
    display: "swap"
});

export const open_sans = Open_Sans({
    subsets: ['latin'],
    display: 'swap',
    fallback: ['sans-serif']
})

export const montserrat = Montserrat({
    weight: ['300', '400', '500', '700', '800', '900'],
    subsets: ['latin'],
    display: 'swap',
    fallback: ['sans-serif'],
    variable: '--font-montserrat'
});

export const outfit = Outfit({
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-outfit'
});

export const inter = Inter({
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-inter'
});

