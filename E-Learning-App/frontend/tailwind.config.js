import path from "path";
import {fileURLToPath} from "url";

// V ESM neexistuje globálna premenná __dirname, musíme si ju vyrobiť
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        // Absolútne cesty pre istotu v monorepe
        path.join(__dirname, "./index.html"),
        path.join(__dirname, "./src/**/*.{js,ts,jsx,tsx}"),
    ],
    theme: {
        extend: {},
    },
    plugins: [],
};