## nextjs-v16-template

Barebones NextJS v16 React app template with custom ESLint rules and Docker configurations.

## 📋 Requirements

1. NodeJS (recommended: >= 24.11.0)
   ```
   node: 24.11.0
   npm: 11.6.1
   ```

2. Docker (optional)

## 📦 Core Libraries / Frameworks

<details>
<summary>This app uses the following libraries and frameworks</summary>

| Library | Version | Description |
| --- | --- | --- |
| Next | 16.1.6 | A React framework |
| React | 19.2.3 | Library for creating reusable/composable and interactive components |
| Tailwind CSS | 4+ | Generic, composable utility classes for CSS styling |
| ESLint | 9+ | Enforces coding formats, rules and preferences |

</details>

## 🛠️ Installation

1. Clone the repository.<br>
   ```sh
   git clone https://github.com/weaponsforge/next-v16-template.git
   ```

2. Install dependencies.<br>
   ```sh
   cd nextapp
   npm install
   ```

3. Create a `.env.local` file from the `.env.example` file inside the `/nextapp` directory.

   > ⚠️ Ensure only one of `IS_BUILD_STATIC` or `IS_BUILD_DOCKER` has a value of `1` to avoid build conflicts.

   | Variable | Description |
   | --- | --- |
   | IS_BUILD_STATIC | If value is `1`, builds and exports the NextJS app into a static build in the `/nextapp/out` directory when running `"npm run build"` |
   | IS_BUILD_DOCKER | Flag to build the NextJS app for Docker in production using the standalone mode build. |

## 📖 Usage

Using Node

1. Run the React app for local development.<br>
   ```sh
   cd nextapp
   npm run dev
   ```

2. Launch the local app website in a web browser at:<br>
   ```
   http://localhost:3000
   ```

3. Edit the source code and wait for changes to display in the web browser.

4. To build the React app
   - For [static export](https://nextjs.org/docs/app/getting-started/deploying#static-export) (only frontend HTML/CSS/JS), set the environment variables `IS_BUILD_STATIC=1` and `IS_BUILD_DOCKER=0`.
   - For [Docker standalone mode](https://nextjs.org/docs/app/getting-started/deploying#docker), set the environment variables `IS_BUILD_STATIC=0` and `IS_BUILD_DOCKER=1`.
   - Run

      ```sh
      npm run build
      ```

      - This command exports the build artifacts to the `/nextapp/out` directory for **STATIC EXPORT** (`IS_BUILD_STATIC=1`).

      - This command exports the build artifacts to the `/nextapp/.next/standalone ` and `/nextapp/.next/.static` directories for **DOCKER STANDALONE MODE** (`IS_BUILD_DOCKER=1`).

## ⚡Alternate Usage

<details>
<summary>Using Docker</summary>
<br>

Usage with Docker is an alternate option to using Node directly from the [Usage](#-usage) section.

> **IMPORTANT**
> Ensure that port `3000` is free before proceeding.

### Build the Development Docker Image

1. Set up the environment variables for the `/app` directory. Refer to the [Installation](#️-installation) section **# 3** for more information.

2. Build the image for local development.<br>
   ```sh
   docker compose build --no-cache
   ```

   > **INFO:** Do this step only once during initial installation. Re-run this step if there will be changes to the Dockerfile or after installing new Node libraries.

3. Run the container for local development.<br>
   ```sh
   docker compose up
   ```

4. Launch the local app website in a web browser at:<br>
   ```
   http://localhost:3000
   ```

5. Edit the source code and wait for changes to display in the web browser.

### Other Docker Builds

1. `docker-compose.prod.yml` - packages the NextJS app into a standalone mode for Docker NextJS (app router) deployment.

   > Outputs build files in the `/nextapp/.next/standalone` and `/nextapp/.next/.static` directories.

2. `docker-compose.static.yml` - packages the frontend-only NextJS app into a static export.

   > Outputs build files in the `/nextapp/out` directory.

</details>
<br>

## 📜 Available Scripts

These scripts, compatible with running in Node and Docker, run various TypeScript scripts and tests.

<details>
<summary>👉 Click to expand the list of available scripts</summary>

### `npm start`

Runs the NextJS app in production mode. Requires running `"npm run build"` first.

### `npm run dev`

- Runs the NextJS app in development mode with hot-reload using Turbopack and NodeJS.
- See the `"npm run docker:dev"` script to run the NextJS app in development mode with hot-reload using Docker.

### `npm run build`

Builds the NextJS app for production mode.

> ⚠️ **WARNING**: Ensure only one of `IS_BUILD_STATIC` or `IS_BUILD_DOCKER` has a value of `1` to avoid build conflicts.

- **Static export**<br>
   When `IS_BUILD_STATIC=1`: exports the frontend-only build artifacts to the `/nextapp/out` directory.
- **Docker standalone mode**<br>
   When `IS_BUILD_DOCKER=1`: exports the NextJS app (uses app router) build artifacts to the `/nextapp/.next/standalone ` and `/nextapp/.next/.static` directories for Docker deployment.

> ℹ️ **INFO**: See the `"npm run docker:build"` script to build the NextJS app for production mode using Docker (NextJS standalone mode build).

### `npm run lint`

Lints TypeScript source codes and files, checking for linting errors.

### `npm run lint:fix`

Fixes lint errors.

### `npm run docker:dev`

- Runs the NextJS app in development mode inside Docker using Webpack and NodeJS.
- Sets the `WATCHPACK_POLLING=true` environment variable (only for Docker) to enable hot-reload for Webpack, since hot-reload with Turbopack [currently doesn't work in Docker](https://github.com/ymeskini/ai-app/issues/1).

</details>
<br>

## 📦 Docker Scripts

These scripts are called within the `Dockerfile` for building images.

<details>
<summary>👉 Click to expand the list of available scripts</summary>

### `npm run docker:dev`

- Sets `WATCHPACK_POLLING=true` and builds a Docker image for localhost development.
- Uses the `docker-compose.yml` Docker compose file.

### `npm run docker:build`

- Sets `IS_BUILD_DOCKER=1` and builds a Docker image containing a standalone NextJS build.
- Uses the `docker-compose.prod.yml` Docker compose file.

### `npm run docker:static`

- Sets `IS_BUILD_STATIC=1` and builds a Docker image containing a NextJS static export.
- Uses the `docker-compose.static.yml` Docker compose file.

> 💡 **INFO**: When running `docker compose up`
>
> You can also run `docker exec -it weaponsforge-next-v16-template-dev npm run docker:static` to build a static output.

</details>
<br>

@weaponsforge<br>
20260216