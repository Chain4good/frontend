# Charity Platform - Frontend Documentation

## Project Overview

A modern web application for managing charity campaigns, donations, and fundraising activities. Built with React and Vite, featuring a modular architecture and comprehensive component system.

## Directory Structure

### Source Code (`src/`)

```
src/
├── App.jsx                 # Root application component
├── main.jsx               # Application entry point
├── router.jsx             # Route configurations
├── index.css             # Global CSS styles
│
├── apis/                 # API integration layer
│   ├── index.js          # API exports
│   └── endpoints/        # API endpoint definitions
│
├── common/               # Shared utilities and components
│   ├── NotFound.jsx     # 404 page component
│   └── ...
│
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI elements (buttons, inputs, etc.)
│   ├── Card/           # Card components
│   ├── Footer/         # Footer component
│   ├── Topic/          # Topic-related components
│   ├── LoadingPage/    # Loading indicators
│   └── ...
│
├── constants/          # Application constants
│   ├── enums.js       # Enumeration values
│   ├── index.js       # Constants exports
│   ├── linkApis.js    # API endpoints
│   ├── status.js      # Status codes/states
│   └── tokens.js      # Token-related constants
│
├── contracts/         # Smart contract integrations
│   └── abi/          # Contract ABIs
│
├── hooks/            # Custom React hooks
│   ├── useAuth.js    # Authentication hook
│   ├── useCampaign.js # Campaign management hook
│   ├── useWallet.js  # Wallet integration hook
│   └── ...
│
├── lib/             # Library configurations
│   ├── utils.js     # Utility functions
│   ├── contract.js  # Contract utilities
│   └── web3modal.js # Web3 modal configuration
│
├── module/          # Feature modules
│   ├── admin/      # Admin panel features
│   └── user/       # User-facing features
│       ├── components/  # Module-specific components
│       ├── layouts/     # Layout components
│       └── pages/       # Page components
│
├── services/       # Business logic services
│   ├── authService.js    # Authentication service
│   ├── campaignService.js # Campaign management
│   ├── donationService.js # Donation handling
│   └── ...
│
├── storage/       # Storage utilities
│   └── upload-metadata.js # File upload handling
│
├── styles/        # Styling utilities
│   ├── globals.css # Global styles
│   └── post.css    # Post-specific styles
│
└── utils/         # Utility functions
    ├── helper.js  # Helper functions
    ├── ipfs.js    # IPFS integration
    └── metamask.js # MetaMask utilities
```

## Key Components and Features

### Authentication

- Managed through `useAuth` hook
- Integration with Web3 wallets
- Secure token handling

### Campaign Management

- Campaign creation and editing
- Progress tracking
- Donation processing
- Social sharing capabilities

### Smart Contract Integration

- Web3 wallet connection
- Transaction handling
- Contract interaction utilities

### UI Components

- Responsive design system
- Loading states
- Error boundaries
- Modal systems
- Form components

## Development Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MetaMask or compatible Web3 wallet

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Configuration

Create a `.env` file with:

```env
VITE_API_URL=your_api_url
VITE_STRIPE_PUBLIC_KEY=your_stripe_key
VITE_CONTRACT_ADDRESS=your_contract_address
VITE_CHAIN_ID=your_chain_id
```

## Build and Deployment

### Development Build

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

### Testing

```bash
npm run test
```

## API Integration

### Available Services

- `authService`: User authentication
- `campaignService`: Campaign management
- `donationService`: Donation processing
- `userService`: User management

### Example Usage

```javascript
import { campaignService } from "@/services/campaignService";

// Create campaign
const newCampaign = await campaignService.create({
  title: "Campaign Title",
  description: "Campaign Description",
  goal: 1000,
});
```

## Smart Contract Integration

### Setup

1. Install MetaMask
2. Connect to appropriate network
3. Configure contract address in environment variables

### Usage

```javascript
import { useWallet } from "@/hooks/useWallet";

const { connect, account } = useWallet();
```

## Contributing

### Code Style

- Follow ESLint configuration
- Use Prettier for formatting
- Follow component structure guidelines

### Pull Request Process

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Submit pull request

## Support and Contact

### Technical Support

- GitHub Issues
- Documentation Wiki
- Support Email: chain4good@gmail.com

### Community

- Discord: []
- Twitter: []
- Telegram: ]

## License

MIT License - see LICENSE file for details
