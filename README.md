# mAccessMap - Making Every Space Accessible

A community-driven accessibility mapping platform that empowers users to catalog and rate the accessibility of public spaces while earning blockchain-based NFT badges for their contributions.

🌐 **Live Demo:** [https://creative-strudel-f01ad0.netlify.app](https://creative-strudel-f01ad0.netlify.app)

## 🌟 Overview

mAccessMap is a Progressive Web App (PWA) that helps create a more inclusive world by crowdsourcing accessibility information about public spaces. Users can submit detailed reviews about accessibility features, earn reputation points, and receive unique NFT badges that recognize their civic contributions.

## ✨ Features

### 🗺️ Interactive Map Explorer
- **Real-time Location Discovery**: Browse accessibility-rated locations on an interactive map powered by Google Maps
- **Smart Color Coding**: Visual indicators for accessibility scores (green=excellent, yellow=moderate, red=poor)
- **Advanced Search & Filtering**: Find locations by category, accessibility features, or rating
- **Mobile-Responsive Design**: Seamless experience across desktop and mobile devices with toggle views
- **Location Centering**: Automatically centers map on selected locations for better navigation

### 📝 Review Submission System
- **Photo Upload**: Capture and upload images of accessibility features with Supabase storage
- **Comprehensive Checklists**: Rate wheelchair accessibility, audio cues, visual aids, and more
- **Detailed Comments**: Share specific experiences and recommendations
- **Google Places Integration**: Auto-complete addresses with location coordinates
- **Current Location Detection**: Use GPS to automatically detect your location

### 🏆 NFT Badge System
- **Blockchain Recognition**: Earn unique NFT badges on Sepolia testnet for verified contributions
- **Progressive Achievements**: Unlock badges at 1, 5, 25, 50, 100, and 250+ verified reviews
- **Automatic Minting**: Badges are automatically minted to your connected MetaMask wallet
- **IPFS Metadata**: Rich metadata stored on IPFS with contributor stats and achievement details
- **Smart Contract Integration**: Custom ERC-721 contract for badge minting

### 👥 Community Features
- **User Profiles**: Track your contributions, badges, and impact statistics
- **Global Leaderboards**: See top contributors by reputation, reviews, and badges earned
- **Badge Gallery**: Showcase your earned achievements with filtering options
- **Admin Panel**: Comprehensive admin interface for managing reviews, users, and platform settings
- **Review Management**: Edit, delete, and verify your own reviews

### 📱 Progressive Web App
- **Offline Functionality**: Browse cached locations and submit reviews offline
- **Install Anywhere**: Add to home screen on any device
- **Push Notifications**: Get notified about badge achievements and community updates
- **Background Sync**: Automatically sync offline contributions when connection returns
- **Service Worker**: Advanced caching and offline capabilities

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- Google Maps API key
- MetaMask or compatible Web3 wallet (for NFT features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/maccessmap.git
   cd maccessmap
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   
   Configure your environment variables:
   ```env
   # Supabase Configuration
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key

   # Google Maps API Key
   VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key

   # Blockchain Configuration (Sepolia Testnet)
   VITE_POLYGON_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/your-key
   VITE_CONTRACT_ADDRESS=your-nft-contract-address

   # IPFS Configuration (for NFT metadata)
   VITE_IPFS_GATEWAY=https://gateway.pinata.cloud/ipfs/
   VITE_PINATA_API_KEY=your-pinata-api-key
   VITE_PINATA_SECRET_KEY=your-pinata-secret-key

   # HuggingFace API Key (for AI suggestions)
   VITE_HUGGING_FACE_API_KEY=your-huggingface-api-key
   ```

4. **Database Setup**
   
   Run the Supabase migrations:
   ```bash
   npm run migrate
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Build for Production**
   ```bash
   npm run build
   npm run preview
   ```

## 🏗️ Architecture

### Frontend Stack
- **React 18** with TypeScript for type-safe development
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for responsive, accessible styling
- **React Router** for client-side navigation
- **Lucide React** for consistent iconography

### Backend & Database
- **Supabase** for authentication, PostgreSQL database, and file storage
- **Row Level Security (RLS)** for data protection
- **Real-time subscriptions** for live updates
- **Automated triggers** for maintaining data consistency
- **Storage buckets** for photo uploads with proper access controls

### Blockchain Integration
- **Ethers.js** for Web3 interactions
- **Sepolia Testnet** for development and testing
- **Custom ERC-721 Contract** for NFT badge minting
- **IPFS/Pinata** for decentralized metadata storage
- **MetaMask** integration for wallet connectivity

### AI-Powered Features
-  **Smart Accessibility Detection**: HuggingFace BART model integration for intelligent feature suggestions
-  **Fallback System**: Keyword-based suggestions when AI is unavailable
-  **User-Friendly Interface**: Purple gradient AI button with sparkles and loading states

### PWA Features
- **Service Worker** for offline functionality and caching
- **Web App Manifest** for installability
- **Background Sync** for offline data synchronization
- **Push Notifications** for user engagement

## 📊 Database Schema

### Core Tables

#### `user_profiles`
- User information and statistics
- Reputation scores and badge counts
- Admin flags and preferences

#### `locations`
- Geographic coordinates and business information
- Calculated accessibility ratings
- Category classification and metadata

#### `reviews`
- User-submitted accessibility evaluations
- Photo attachments and feature checklists
- Verification status and timestamps

#### `nft_badges`
- Blockchain badge records
- Token IDs and contract addresses
- IPFS metadata links

### Key Features
- **Automated Statistics**: Triggers maintain user and location statistics
- **Review Verification**: Community moderation workflow
- **Badge Automation**: Automatic badge eligibility checking
- **Data Integrity**: Foreign key constraints and validation

## 🔐 Security & Privacy

### Authentication
- Supabase Auth with email/password authentication
- JWT-based session management
- Secure password requirements
- Admin role management

### Data Protection
- Row Level Security (RLS) on all tables
- User data isolation and access controls
- GDPR-compliant data handling
- Secure file upload with size and type restrictions

### Blockchain Security
- Client-side wallet integration only
- No private key storage or handling
- User-controlled NFT minting process
- Smart contract security best practices

## ♿ Accessibility

mAccessMap is built with accessibility as a core principle:

### WCAG 2.1 AA Compliance
- Semantic HTML structure
- Proper heading hierarchy
- Alt text for all images
- Keyboard navigation support

### Screen Reader Support
- ARIA labels and descriptions
- Focus management
- Descriptive link text
- Status announcements

### Visual Accessibility
- High contrast color schemes
- Scalable text (up to 200%)
- Clear visual hierarchy
- Consistent navigation patterns

### Motor Accessibility
- Large click targets (44px minimum)
- No time-sensitive interactions
- Drag and drop alternatives
- Voice control compatibility

## 🌍 Contributing

We welcome contributions from developers, accessibility experts, and community advocates!

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Commit with descriptive messages: `git commit -m 'Add amazing feature'`
5. Push to your branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Contribution Guidelines
- Follow existing code style and conventions
- Add tests for new functionality
- Update documentation as needed
- Ensure accessibility compliance
- Test with screen readers and keyboard navigation

### Areas for Contribution
- **Accessibility Features**: New review categories and checklists
- **Internationalization**: Multi-language support
- **Mobile Enhancements**: Native app features
- **Data Visualization**: Analytics and reporting tools
- **Community Features**: Social interactions and gamification

## 📱 PWA Installation

### Desktop (Chrome/Edge)
1. Visit the mAccessMap website
2. Look for the install icon in the address bar
3. Click "Install mAccessMap"
4. The app will be added to your applications

### Mobile (iOS/Android)
1. Open the website in your mobile browser
2. Tap the share button (iOS) or menu (Android)
3. Select "Add to Home Screen"
4. The app icon will appear on your home screen

### Features When Installed
- Offline browsing of cached locations
- Background sync for submitted reviews
- Push notifications for achievements
- Native app-like experience

## 🔧 Configuration

### Google Maps Setup
1. Create a Google Cloud Platform project
2. Enable the Maps JavaScript API and Places API
3. Create an API key with appropriate restrictions
4. Add your domain to the API key restrictions

### Supabase Configuration
1. Create a new Supabase project
2. Run the provided database migrations using `npm run migrate`
3. Configure authentication providers as needed
4. Set up storage buckets for photo uploads (automatically configured)

### Blockchain Setup
1. Deploy the NFT contract to Sepolia testnet
2. Configure contract address in environment variables
3. Set up Pinata account for IPFS metadata storage
4. Test NFT minting on testnet before production

### Smart Contract
The project includes a custom ERC-721 smart contract for minting NFT badges:
- **Network**: Sepolia Testnet
- **Features**: Custom minting function with metadata URI
- **Events**: BadgeMinted event for tracking successful mints
- **Security**: Ownable pattern for controlled minting

## 📈 Analytics & Monitoring

### Built-in Analytics
- User contribution statistics
- Location coverage metrics
- Review verification rates
- Badge distribution analytics

### Performance Monitoring
- Core Web Vitals tracking
- Service Worker performance
- Database query optimization
- Error logging and reporting

## 🚀 Deployment

### Netlify (Current Deployment)
The application is currently deployed on Netlify at: https://creative-strudel-f01ad0.netlify.app

**Deployment Features:**
- Automatic builds from Git
- Environment variable management
- Form handling for contact forms
- CDN distribution
- HTTPS by default

### Manual Deployment
1. Build the project: `npm run build`
2. Deploy the `dist` directory to any static hosting service
3. Configure environment variables on your hosting platform
4. Ensure proper headers for PWA functionality

### Environment Variables for Production
Make sure to set these environment variables in your deployment platform:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_GOOGLE_MAPS_API_KEY`
- `VITE_POLYGON_RPC_URL`
- `VITE_CONTRACT_ADDRESS`
- `VITE_PINATA_API_KEY`
- `VITE_PINATA_SECRET_KEY`

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

### Community Support
- **GitHub Issues**: Bug reports and feature requests
- **Discussions**: Community Q&A and ideas
- **Live Demo**: Test the application at https://creative-strudel-f01ad0.netlify.app

### Professional Support
- **Email**: support@maccessmap.org
- **Documentation**: Comprehensive guides and API docs
- **Training**: Accessibility consulting and workshops

## 🙏 Acknowledgments

- **Accessibility Community**: For guidance and feedback on inclusive design
- **Open Source Contributors**: For the amazing tools and libraries that make this possible
- **Beta Testers**: For helping us identify and fix issues before launch
- **Disability Rights Advocates**: For inspiring this project and keeping us accountable

## 🗺️ Roadmap

### Phase 1: Core Platform ✅
- Basic mapping and review functionality
- User authentication and profiles
- NFT badge system
- PWA implementation
- Mobile responsiveness
- Admin panel

### Phase 2: Enhanced Features 🚧
- Advanced search and filtering
- Offline-first architecture improvements
- Social features and community building
- Analytics dashboard
- API for third-party integrations

### Phase 3: Scale & Impact 📋
- Government and business partnerships
- International expansion
- Advanced analytics and insights
- Mobile app development
- Multi-language support

### Phase 4: Innovation 🔮
- AI-powered accessibility predictions
- AR/VR integration for immersive reviews
- IoT sensor integration
- Blockchain governance features
- AI Accessibility Assistant

## 🔗 Quick Links

- **Live Application**: https://creative-strudel-f01ad0.netlify.app
- **Demo Accounts**: Use the quick login buttons on the auth page
- **Admin Panel**: Available for admin users at `/admin`
- **API Documentation**: Coming soon
- **Smart Contract**: Deployed on Sepolia testnet

---

**Together, we're building a more accessible world, one review at a time.** 🌍♿

For more information, visit the live application at https://creative-strudel-f01ad0.netlify.app or follow us on social media for updates and community highlights.