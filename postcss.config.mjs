const config = {
  plugins: ["@tailwindcss/postcss"],
  theme: {
    extend: {
      colors: {
        'primary-calm': '#7c3aed', // Màu tím lavender dịu (Indigo-600)
        'secondary-calm': '#ede9fe', // Nền tím nhạt (Violet-100)
        'safe-alert': '#f59e0b', // Màu hổ phách (Amber) cho cảnh báo
        'text-soft': '#4b5563', // Màu xám mềm
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
};

export default config;
