# mAccessMap - Making Every Space Accessible

A community-driven accessibility mapping platform that empowers users to catalog and rate the accessibility of public spaces while earning blockchain-based NFT badges for their contributions.

## 🌟 Overview

mAccessMap is a Progressive Web App (PWA) that helps create a more inclusive world by crowdsourcing accessibility information about public spaces. Users can submit detailed reviews about accessibility features, earn reputation points, and receive unique NFT badges that recognize their civic contributions.

## ✨ Features

### 🗺️ Interactive Map Explorer
- **Real-time Location Discovery**: Browse accessibility-rated locations on an interactive map
- **Smart Color Coding**: Visual indicators for accessibility scores (green=excellent, yellow=moderate, red=poor)
- **Advanced Search & Filtering**: Find locations by category, accessibility features, or rating
- **Detailed Location Profiles**: Comprehensive accessibility information for each venue

### 📝 Review Submission System
- **Photo Upload**: Capture and upload images of accessibility features
- **Comprehensive Checklists**: Rate wheelchair accessibility, audio cues, visual aids, and more
- **Detailed Comments**: Share specific experiences and recommendations
- **Verification System**: Community-moderated review verification process

### 🏆 NFT Badge System
- **Blockchain Recognition**: Earn unique NFT badges on Polygon network for verified contributions
- **Progressive Achievements**: Unlock badges at 1, 5, 25, 50, 100, and 250+ verified reviews
- **Permanent Records**: Immutable proof of your accessibility advocacy
- **Metadata Rich**: Each badge contains contributor stats and achievement details

### 👥 Community Features
- **User Profiles**: Track your contributions, badges, and impact statistics
- **Global Leaderboards**: See top contributors by region and time period
- **Badge Gallery**: Showcase your earned achievements
- **Social Sharing**: Share your impact and encourage others to contribute

### 📱 Progressive Web App
- **Offline Functionality**: Browse cached locations and submit reviews offline
- **Install Anywhere**: Add to home screen on any device
- **Push Notifications**: Get notified about badge achievements and community updates
- **Background Sync**: Automatically sync offline contributions when connection returns

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

   # Blockchain Configuration (Polygon)
   VITE_POLYGON_RPC_URL=https://polygon-mumbai.g.alchemy.com/v2/your-key
   VITE_CONTRACT_ADDRESS=your-nft-contract-address

   # IPFS Configuration (for NFT metadata)
   VITE_IPFS_GATEWAY=https://gateway.pinata.cloud/ipfs/
   VITE_PINATA_API_KEY=your-pinata-api-key
   VITE_PINATA_SECRET_KEY=your-pinata-secret-key
   ```

4. **Database Setup**
   
   Run the Supabase migrations:
   ```bash
   # If using Supabase CLI
   supabase db reset
   
   # Or apply migrations manually in Supabase dashboard
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

### Blockchain Integration
- **Ethers.js** for Web3 interactions
- **Polygon Network** for low-cost NFT minting
- **IPFS/Pinata** for decentralized metadata storage
- **MetaMask** integration for wallet connectivity

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
- Supabase Auth with email/password and OAuth providers
- JWT-based session management
- Secure password requirements

### Data Protection
- Row Level Security (RLS) on all tables
- User data isolation and access controls
- GDPR-compliant data handling
- Optional anonymous review submission

### Blockchain Security
- Client-side wallet integration only
- No private key storage or handling
- User-controlled NFT minting process

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
2. Run the provided database migrations
3. Configure authentication providers as needed
4. Set up storage buckets for photo uploads

### Blockchain Setup (Optional)
1. Deploy the NFT contract to Polygon network
2. Configure contract address in environment variables
3. Set up Pinata account for IPFS metadata storage
4. Test NFT minting on testnet before production

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

### Netlify (Recommended)
1. Connect your GitHub repository
2. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Add environment variables in Netlify dashboard
4. Enable form handling for contact forms

### Vercel
1. Import project from GitHub
2. Configure environment variables
3. Deploy with automatic CI/CD

### Self-Hosted
1. Build the project: `npm run build`
2. Serve the `dist` directory with any static file server
3. Configure HTTPS and proper headers for PWA functionality

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

### Community Support
- **GitHub Issues**: Bug reports and feature requests
- **Discussions**: Community Q&A and ideas
- **Discord**: Real-time community chat (coming soon)

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

### Phase 2: Enhanced Features 🚧
- Advanced search and filtering
- Offline-first architecture improvements
- Social features and community building
- Mobile app development

### Phase 3: Scale & Impact 📋
- API for third-party integrations
- Government and business partnerships
- International expansion
- Advanced analytics and insights

### Phase 4: Innovation 🔮
- AI-powered accessibility predictions
- AR/VR integration for immersive reviews
- IoT sensor integration
- Blockchain governance features

---

**Together, we're building a more accessible world, one review at a time.** 🌍♿

For more information, visit [maccessmap.org](https://maccessmap.org) or follow us on social media for updates and community highlights.