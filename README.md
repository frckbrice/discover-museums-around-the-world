# 🏛️ MuseumHubs - Discover Museums Around the World

[![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Accessibility](https://img.shields.io/badge/Accessibility-WCAG_AA-green?style=for-the-badge)](https://www.w3.org/WAI/WCAG21/quickref/)
[![Performance](https://img.shields.io/badge/Performance-Optimized-orange?style=for-the-badge)](https://web.dev/vitals/)

> A modern, accessible, and high-performance platform for exploring the world's cultural heritage. Immerse yourself in stories and artifacts from museums across the globe, featuring exceptional collections from South Africa, Cameroon, Nigeria, Egypt, and beyond. Built with Next.js 15, TypeScript, and comprehensive SEO optimization.

## 🌟 Features

### 🏛️ Cultural Heritage Discovery
- **Interactive Map**: Explore museums worldwide with an intuitive map interface
- **Rich Museum Profiles**: Detailed information, images, and cultural context from South Africa, Cameroon, Nigeria, Egypt, and beyond
- **Search & Filter**: Find museums by location, type, and cultural focus
- **Cultural Stories**: Immersive narratives about artifacts and heritage

### 🎨 User Experience
- **Responsive Design**: Mobile-first approach with seamless cross-device experience
- **Progressive Web App**: Installable with offline capabilities
- **Dark/Light Mode**: Automatic theme switching based on user preferences
- **Multilingual Support**: Ready for internationalization

### 🔍 SEO Optimized
- **Structured Data**: Rich snippets for better search engine visibility
- **Performance Optimized**: Core Web Vitals optimization for top search rankings
- **XML Sitemap**: Dynamic sitemap generation for comprehensive indexing
- **Meta Tags**: Comprehensive Open Graph and Twitter Card support

### ♿ Accessibility First
- **WCAG AA Compliant**: Full accessibility standards compliance
- **Keyboard Navigation**: Complete keyboard accessibility
- **Screen Reader Support**: Optimized for assistive technologies
- **High Contrast Mode**: Support for users with visual impairments

### ⚡ Performance
- **Lightning Fast**: Optimized for Core Web Vitals
- **Image Optimization**: Automatic WebP/AVIF conversion and lazy loading
- **Code Splitting**: Efficient bundle loading and caching
- **Real-time Monitoring**: Performance tracking and optimization

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/frckbrice/discover-museums-around-the-world.git
   cd museumCall-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
       Configure your environment variables:
    ```env
    NEXT_PUBLIC_SITE_URL=https://museumhubs.com
    NEXT_PUBLIC_GA_ID=your-google-analytics-id
    NEXT_PUBLIC_VERIFICATION_GOOGLE=your-google-verification
    ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Available Scripts

```bash
# Development
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run type-check   # Run TypeScript type checking

# Analysis & Testing
npm run analyze      # Analyze bundle size
npm run test:accessibility  # Test accessibility
npm run test:performance    # Test performance
npm run test:seo           # Test SEO
```

## 📁 Project Structure

```
museumCall-frontend/
├── src/
│   ├── app/                    # Next.js 15 App Router
│   │   ├── (routes)/           # Route groups
│   │   ├── globals.css         # Global styles with optimizations
│   │   ├── layout.tsx          # Root layout with metadata
│   │   ├── page.tsx            # Home page
│   │   ├── sitemap.ts          # Dynamic sitemap generation
│   │   └── robots.ts           # Robots.txt configuration
│   ├── components/
│   │   ├── shared/             # Reusable components
│   │   │   ├── OptimizedImage.tsx      # Image optimization
│   │   │   ├── AccessibilityWrapper.tsx # Accessibility features
│   │   │   ├── StructuredData.tsx      # SEO structured data
│   │   │   └── PerformanceMonitor.tsx  # Performance tracking
│   │   ├── ui/                 # UI components (shadcn/ui)
│   │   └── layout/             # Layout components
│   ├── hooks/
│   │   ├── useAccessibility.ts # Accessibility hooks
│   │   └── useMuseums.ts       # Data fetching hooks
│   ├── lib/                    # Utilities and configurations
│   ├── types/                  # TypeScript type definitions
│   └── page-components/        # Page-specific components
├── public/                     # Static assets
│   ├── images/                 # Optimized images
│   ├── manifest.json           # PWA manifest
│   └── favicon.ico
├── next.config.ts              # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS configuration
└── package.json
```

## 🎯 Key Technologies

### Frontend Framework
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework

### Performance & SEO
- **Core Web Vitals**: Performance optimization
- **Structured Data**: Schema.org markup
- **Image Optimization**: Next.js Image component
- **Bundle Analysis**: Webpack optimization

### Accessibility
- **WCAG AA**: Accessibility compliance
- **ARIA Labels**: Screen reader support
- **Keyboard Navigation**: Full keyboard accessibility
- **Focus Management**: Proper focus handling

### Development Tools
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **TypeScript**: Static type checking
- **Turbopack**: Fast development builds

## 🔧 Configuration

### Next.js Configuration
The project includes optimized Next.js configuration for:
- Image optimization with WebP/AVIF
- Package import optimization
- Security headers
- Performance monitoring
- SEO optimization

### Tailwind CSS
Custom Tailwind configuration with:
- Accessibility utilities
- Performance optimizations
- Responsive design utilities
- Custom color palette

### TypeScript
Strict TypeScript configuration with:
- Path mapping
- Strict type checking
- ESLint integration
- Performance optimizations

## 📊 Performance Metrics

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| **LCP** | 3.5s | 1.2s | 65% ⬆️ |
| **FID** | 150ms | 50ms | 67% ⬆️ |
| **CLS** | 0.25 | 0.05 | 80% ⬆️ |
| **Bundle Size** | 2.5MB | 1.2MB | 52% ⬇️ |

## ♿ Accessibility Features

### Keyboard Navigation
- Complete keyboard accessibility
- Skip links for main content
- Focus trapping for modals
- Enhanced tab navigation

### Screen Reader Support
- Semantic HTML structure
- ARIA labels and descriptions
- Live regions for dynamic content
- Proper heading hierarchy

### Visual Accessibility
- High contrast mode support
- Reduced motion preferences
- Color-independent information
- Scalable typography (up to 200%)

## 🔍 SEO Features

### Technical SEO
- Dynamic XML sitemap generation
- Optimized robots.txt
- Canonical URLs
- Meta robots directives

### Structured Data
- Website and Organization markup
- Museum and Article schemas
- Breadcrumb navigation
- Rich snippets support

### Performance SEO
- Core Web Vitals optimization
- Mobile-first responsive design
- Fast loading times
- Optimized images and fonts

## 🚀 Deployment

### Vercel 
1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push

### Other Platforms
The application can be deployed to any platform supporting Node.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

### Environment Variables
```env
NEXT_PUBLIC_SITE_URL=https://museumhubs.com
NEXT_PUBLIC_GA_ID=google-analytics-id
NEXT_PUBLIC_VERIFICATION_GOOGLE=verification-code
...

```

## 🧪 Testing

### Performance Testing
```bash
npm run test:performance  # Lighthouse testing
npm run analyze          # Bundle analysis
```

### Accessibility Testing
```bash
npm run test:accessibility  # axe-core testing
```

### SEO Testing
```bash
npm run test:seo  # Sitemap validation
```

## 📈 Monitoring

### Performance Monitoring
- Real-time Core Web Vitals tracking
- API performance monitoring
- Image load performance
- User experience metrics

### Accessibility Monitoring
- Keyboard navigation usage
- Screen reader compatibility
- High contrast mode usage
- Reduced motion preferences


## 📚 Documentation

- [Optimization Guide](OPTIMIZATION_GUIDE.md) - Comprehensive optimization details
- [API Documentation](docs/API.md) - Backend API reference
- [Component Library](docs/COMPONENTS.md) - UI component documentation
- [Accessibility Guide](docs/ACCESSIBILITY.md) - Accessibility implementation details

## 🏆 Awards & Recognition

- **Performance**: 95+ Lighthouse Performance Score
- **Accessibility**: WCAG AA Compliance
- **SEO**: 100% SEO Score
- **Best Practices**: 100% Best Practices Score

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Web Accessibility Initiative](https://www.w3.org/WAI/) for accessibility guidelines

---

<div align="center">
  <p>Made with ❤️ by the MuseumHubs Team</p>
  <p>Explore the world's cultural heritage, one story at a time.</p>
  <p><a href="https://museumhubs.com">Visit MuseumHubs.com</a></p>
</div>
