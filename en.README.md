# 42Hackathon_2024

## **CarbonToken: An Ecosystem for Incentivizing Eco-friendly Deliveries**

#### 1. **Overview**
CarbonToken is an incentive system designed to reduce environmental impact and promote sustainable driving in food delivery services. Drivers are rewarded with tokens for eco-friendly driving behaviors, which are managed using blockchain technology. Drivers can then use these tokens for eco-friendly services or coupons.

---

#### 2. **Proposed Solution**
CarbonTokens are awarded based on the following eco-driving behaviors:
- **Gentle Acceleration (e-start)**: Gradual acceleration when starting (taking more than 5 seconds to accelerate from 0 to 20 km/h).
- **Maintaining Steady Speed**: Maintaining a constant speed while driving and keeping a safe distance between vehicles.
- **Releasing the Accelerator Early**: Letting off the accelerator early when slowing down.
- **Avoiding Idling**: Reducing idling while stopped.
- **Avoiding Traffic Jams**: Using real-time traffic data to select routes that avoid congestion.
- **Parking Etiquette**: Avoiding illegal parking near intersections.

These behaviors are monitored using the smartphone’s GPS and sensors, with real-time driving data being collected.

---

#### 3. **Token Usage**
CarbonTokens can be used in various ways, one of which is redeeming **foodpanda coupons**. Drivers can use these tokens to get discounts or perks from foodpanda, offering a way to benefit from the tokens earned through their delivery activities.

Other possible uses include exchanging tokens for eco-friendly services, products, or partner company benefits.

---

#### 4. **Technical Foundation**
- **Data Collection**: The system uses smartphone GPS, accelerometers, and vibration sensors to monitor eco-driving behaviors.
- **Blockchain**: Tokens are managed on a blockchain to ensure transparency and security.

---

#### 5. **Expanding Sustainability**
The CarbonToken system can be extended to other industries or services. By encouraging eco-friendly driving behavior, this initiative builds a foundation for a more sustainable future.

---

### Conclusion
CarbonToken not only promotes environmentally friendly driving but also creates an ecosystem where delivery drivers can earn tokens through their eco-conscious driving practices. These tokens can be redeemed as foodpanda coupons, benefiting both drivers and the delivery industry by promoting sustainability.

---

## Technical Requirements

### 1. **Frontend**
- **Tech Stack**: Next.js (App Router)
- **Features**:
  - **Login**: Implement authentication using MetaMask or other wallet solutions.
  - **Wallet Connection**: Enable connection to Ethereum wallets to view and manage tokens.
  - **Acceleration Measurement**: Use smartphone accelerometers and GPS to collect driving data.
  - **Results Screen**: Display eco-driving results based on behaviors, such as token count and driving data analysis.
  - **Token-to-Coupon Conversion**: Implement a UI where ERC20 tokens can be converted into coupons.

### 2. **Backend**
- **Tech Stack**: Go (Gin framework)
- **Features**:
  - **REST API**: Manage user driving data and token information.
  - **Data Analysis**: Analyze collected driving data (acceleration, speed, GPS) to determine if eco-driving criteria are met for token rewards.
  - **ERC20 Token Minting**: Automatically mint ERC20 tokens based on eco-driving behaviors.
  - **ERC721 Driver License**: Issue an ERC721 driver license token, which is updated based on driving performance.

### 3. **Database**
- **Tech Stack**: PostgreSQL
- **Features**:
  - **User Data Management**: Store user profiles, driving data, token information, and transaction history.
  - **Token Management**: Keep track of earned tokens and their usage.

### 4. **Blockchain**
- **Tech Stack**: Ethereum (ERC20, ERC721)
- **Features**:
  - **ERC20 Tokens**: Manage tokens awarded for eco-driving behaviors on the Ethereum blockchain.
  - **ERC721 License**: Issue driver licenses as ERC721 tokens and update them based on driving performance.
  - **Infura**: Connect to the Ethereum blockchain via Infura for managing tokens and processing transactions.
  
## Setup
### Installation
To setup the following construction
- **NextJS**
This system use all-in-one toolkit called "Bun" for JavaScript and TypeScript apps.
It requires installation on your computer by executing the following command:
`curl -fsSL https://bun.sh/install | bash`

- **Docker**
This system runs on Docker containers, so install docker compose command.

### Environment variables
Clone this repository on your computer.
Create `.env` based on `.env_template` put in root of the repository,
 and fill your environment variables.

### Building
Use the foloowing `make` targets
- `make` : Build the Docker images, construct and run containers
- `make stop` : Stop the running containers
- `make re` : Rebuild and run containers
- `make ls`: List up the available Docker images, networks, volumes, containers and runnning containers
- `make purge` : Remove all the Docker containers, networks, images forcely

## Demo use
After the containers running properly, 
access `https://{your-pc-ip-address}:443/` with the web browser of your smartphone.
