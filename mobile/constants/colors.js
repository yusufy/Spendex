// constants/colors.js
const coffeeTheme = {
    primary: "#8B593E",
    background: "#FFF8F3",
    text: "#4A3428",
    border: "#E5D3B7",
    white: "#FFFFFF",
    textLight: "#9A8478",
    expense: "#E74C3C",
    income: "#2ECC71",
    card: "#FFFFFF",
    shadow: "#000000",
  };
  
const forestTheme = {
  primary: "#388E3C",      // Daha dengeli, canlı yeşil
  background: "#F1F8F4",   // Daha soft pastel arka plan
  text: "#2E4600",         // Koyu, doğal bir orman tonu
  border: "#D0E8D0",       // Yumuşak yeşilimsi gri
  white: "#FFFFFF",
  textLight: "#81C784",    // Daha fresh yeşil tonu
  expense: "#E53935",      // Daha parlak kırmızı (net kontrast için)
  expenseLight: "#FFCDD2", // Light kırmızı (placeholder için)
  income: "#43A047",       // Dengeli koyu yeşil
  incomeLight: "#C8E6C9",  // Light yeşil (placeholder için)
  card: "#FFFFFF",         
  shadow: "rgba(0,0,0,0.15)", // Daha doğal ve modern gölge
  accent: "#8D6E63",       // Toprak tonları (detaylarda kullanılabilir)
};

  
  const purpleTheme = {
    primary: "#6A1B9A",
    background: "#F3E5F5",
    text: "#4A148C",
    border: "#D1C4E9",
    white: "#FFFFFF",
    textLight: "#BA68C8",
    expense: "#D32F2F",
    income: "#388E3C",
    card: "#FFFFFF",
    shadow: "#000000",
  };
  
  const oceanTheme = {
    primary: "#0277BD",
    background: "#E1F5FE",
    text: "#01579B",
    border: "#B3E5FC",
    white: "#FFFFFF",
    textLight: "#4FC3F7",
    expense: "#EF5350",
    income: "#26A69A",
    card: "#FFFFFF",
    shadow: "#000000",
  };

  const sunsetTheme = {
    primary: "#FF7043",      // Turuncu-kırmızı (güneş tonu)
    background: "#FFF3E0",   // Yumuşak açık turuncu
    text: "#BF360C",         // Koyu kırmızımsı kahverengi
    border: "#FFCCBC",       // Açık pastel turuncu
    white: "#FFFFFF",        
    textLight: "#FFAB91",    // Açık turuncu ton
    expense: "#D32F2F",      // Harcama için kırmızı
    income: "#388E3C",       // Gelir için yeşil
    card: "#FFFFFF",         
    shadow: "#4E342E",       // Hafif kahverengimsi gölge
  };

  const auroraTheme = {
    primary: "#00C853",      // Canlı yeşil (aurora efekti)
    background: "#0D1117",   // Koyu gece tonu
    text: "#E0F7FA",         // Hafif mavi-beyaz
    border: "#1E2A38",       // Koyu mavi-gri
    white: "#FFFFFF",
    textLight: "#64FFDA",    // Neon yeşil-mavi
    expense: "#FF5252",      // Canlı kırmızı (harcama)
    income: "#69F0AE",       // Neon yeşil (gelir)
    card: "#161B22",         // Hafif koyu gri kartlar
    shadow: "#000000",       // Derin gölge
  };
  
  
  
  export const THEMES = {
    coffee: coffeeTheme,
    forest: forestTheme,
    purple: purpleTheme,
    ocean: oceanTheme,
    sunset: sunsetTheme,
    aurora: auroraTheme,
  };
  
  // 👇 change this to switch theme
  export const COLORS = THEMES.forest;